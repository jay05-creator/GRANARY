/**
 * Server-side phone OTP operations: generate, send (via SMS gateway), verify.
 *
 * OTP codes are 6 digits, expire after 5 minutes, and allow max 3 attempts.
 * The `phone_otps` table (migration 0003) stores active codes.
 *
 * SMS delivery is pluggable — when no gateway is configured, the OTP is
 * logged to the console (dev/preview mode) so the flow can be tested end-to-end.
 */
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getSql } from "@/server/db";
import { normalizePhone } from "@/shared/phone";
import { randomBytes } from "node:crypto";

// ——— Constants ———

const OTP_LENGTH = 6;
const OTP_EXPIRY_MINUTES = 5;
const OTP_MAX_ATTEMPTS = 3;
const OTP_COOLDOWN_SECONDS = 60; // Min gap between OTP requests for same phone

// ——— Server-side Auth Rate Limiting ———
const AUTH_RATE_WINDOW_MINUTES = 15;
const AUTH_RATE_MAX_ATTEMPTS = 5;
const AUTH_RATE_LOCKOUT_MINUTES = 30;

/**
 * Check server-side rate limit for auth actions (sign_in, sign_up).
 * Returns null if allowed, or an error message string if blocked.
 */
export const checkAuthRateLimit = createServerFn({ method: "POST" })
  .validator(
    z.object({
      phone: z.string().min(1),
      action: z.enum(["sign_in", "sign_up"]),
    }),
  )
  .handler(async ({ data }) => {
    const phone = normalizePhone(data.phone);
    if (!phone) return { allowed: true as const };

    const sql = await getSql();

    // Ensure table exists (self-bootstrapping — handles fresh DB / migration skip)
    await sql.query(`CREATE TABLE IF NOT EXISTS auth_rate_limits (
      id          text primary key,
      phone       text not null,
      action      text not null check (action in ('sign_in', 'sign_up')),
      attempts    integer not null default 1,
      window_start timestamptz not null default now()
    )`);
    await sql.query(`CREATE INDEX IF NOT EXISTS auth_rate_limits_phone_action_idx
      ON auth_rate_limits (phone, action)`);

    // Clean up expired rate limit windows (use raw SQL for interval literal)
    await sql.query(
      `DELETE FROM auth_rate_limits WHERE window_start < now() - interval '${AUTH_RATE_LOCKOUT_MINUTES} minutes'`,
    );

    // Check current window
    const rows = await sql`
      SELECT attempts, window_start FROM auth_rate_limits
      WHERE phone = ${phone} AND action = ${data.action}
      ORDER BY window_start DESC LIMIT 1
    `;

    if (rows[0]) {
      const windowStart = new Date(rows[0].window_start as string);
      const elapsed = (Date.now() - windowStart.getTime()) / 1000 / 60;
      const attempts = Number(rows[0].attempts);

      if (elapsed < AUTH_RATE_WINDOW_MINUTES) {
        if (attempts >= AUTH_RATE_MAX_ATTEMPTS) {
          const remaining = Math.ceil(AUTH_RATE_WINDOW_MINUTES - elapsed);
          return {
            allowed: false as const,
            error: `Too many failed attempts. Please try again in ${remaining} minute${remaining > 1 ? "s" : ""}.`,
          };
        }
      }
    }

    return { allowed: true as const };
  });

/**
 * Record a failed auth attempt for rate limiting.
 * Call this after a failed signIn.email or signUp.email.
 */
export const recordAuthAttempt = createServerFn({ method: "POST" })
  .validator(
    z.object({
      phone: z.string().min(1),
      action: z.enum(["sign_in", "sign_up"]),
    }),
  )
  .handler(async ({ data }) => {
    const phone = normalizePhone(data.phone);
    if (!phone) return;

    const sql = await getSql();

    // Upsert: increment attempts within current window, or start new window
    const existing = await sql.query(
      `SELECT id, attempts FROM auth_rate_limits
      WHERE phone = $1 AND action = $2
        AND window_start > now() - interval '${AUTH_RATE_WINDOW_MINUTES} minutes'
      ORDER BY window_start DESC LIMIT 1`,
      [phone, data.action],
    );

    if (existing[0]) {
      await sql`
        UPDATE auth_rate_limits SET attempts = attempts + 1
        WHERE id = ${existing[0].id}
      `;
    } else {
      const id = `rl-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      await sql`
        INSERT INTO auth_rate_limits (id, phone, action, attempts, window_start)
        VALUES (${id}, ${phone}, ${data.action}, 1, now())
      `;
    }
  });

/**
 * Reset rate limit for a phone + action (call after successful auth).
 */
export const resetAuthRateLimit = createServerFn({ method: "POST" })
  .validator(
    z.object({
      phone: z.string().min(1),
      action: z.enum(["sign_in", "sign_up"]),
    }),
  )
  .handler(async ({ data }) => {
    const phone = normalizePhone(data.phone);
    if (!phone) return;
    const sql = await getSql();
    await sql`DELETE FROM auth_rate_limits WHERE phone = ${phone} AND action = ${data.action}`;
  });

// ——— Helpers ———

function generateOtpCode(): string {
  // Generate a cryptographically random 6-digit code
  const buf = randomBytes(4);
  const num = buf.readUInt32BE(0);
  return String(num % 1_000_000).padStart(OTP_LENGTH, "0");
}

function newId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * Send an OTP via SMS gateway.
 * When SMS_GATEWAY_URL is not set, logs to console (dev mode).
 */
async function deliverOtp(phone: string, code: string, purpose: string): Promise<void> {
  // 2Factor.in API configuration (free: 50 OTPs/month)
  const twoFactorApiKey = process.env.TWOFACTOR_API_KEY;
  
  if (twoFactorApiKey) {
    // Production: send via 2Factor.in OTP API
    // API format: https://2factor.in/API/V1/{API_KEY}/SMS/{PHONE}/{OTP}
    const apiUrl = `https://2factor.in/API/V1/${twoFactorApiKey}/SMS/${phone}/${code}`;
    
    console.log(`[2Factor] Sending OTP to ${phone}...`);
    
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const responseText = await response.text();
    
    if (!response.ok) {
      console.error(`[2Factor] SMS delivery failed (${response.status}): ${responseText}`);
      throw new Error(`SMS delivery failed (${response.status}): ${responseText}`);
    }

    // Parse 2Factor.in response
    try {
      const result = JSON.parse(responseText);
      if (result.Status === "Success") {
        console.log(`[2Factor] OTP sent successfully to ${phone} | Session: ${result.Details}`);
      } else {
        console.error(`[2Factor] API error: ${result.Details || responseText}`);
        throw new Error(`2Factor API error: ${result.Details || "Unknown error"}`);
      }
    } catch (parseErr) {
      console.error(`[2Factor] Failed to parse response: ${responseText}`);
      throw new Error(`SMS delivery failed: ${responseText}`);
    }
  } else {
    // Dev/preview: log to console so developers can test the flow
    console.log(`\n📱 [DEV OTP] Phone: ${phone} | Code: ${code} | Purpose: ${purpose}\n`);
    console.log(`💡 To enable real SMS, add TWOFACTOR_API_KEY to your .env file`);
    console.log(`💡 Get free key at: https://2factor.in`);
  }
}
// ——— Server Functions ———

/**
 * Send a phone OTP for a given purpose (register, login, reset).
 * Enforces cooldown between requests and cleans up expired OTPs.
 */
export const sendPhoneOtp = createServerFn({ method: "POST" })
  .validator(
    z.object({
      phone: z.string().min(1),
      purpose: z.enum(["register", "login", "reset"]),
    }),
  )
  .handler(async ({ data }) => {
    const phone = normalizePhone(data.phone);
    if (!phone) {
      return { ok: false as const, error: "Invalid phone number." };
    }

    const sql = await getSql();

    // Ensure phone_otps table exists (self-bootstrapping)
    await sql.query(`CREATE TABLE IF NOT EXISTS phone_otps (
      id          text primary key,
      phone       text not null,
      code        text not null,
      purpose     text not null check (purpose in ('register', 'login', 'reset')),
      expires_at  timestamptz not null,
      attempts    integer not null default 0,
      created_at  timestamptz not null default now()
    )`);
    await sql.query(`CREATE INDEX IF NOT EXISTS phone_otps_phone_idx ON phone_otps (phone)`);
    await sql.query(`CREATE INDEX IF NOT EXISTS phone_otps_purpose_idx ON phone_otps (purpose)`);

    // Clean up expired OTPs for this phone
    await sql`DELETE FROM phone_otps WHERE expires_at < now() AND phone = ${phone}`;

    // Enforce cooldown (1 OTP per 60 seconds per phone)
    const recentOtp = await sql`
      SELECT created_at FROM phone_otps
      WHERE phone = ${phone} AND purpose = ${data.purpose}
      ORDER BY created_at DESC LIMIT 1
    `;
    if (recentOtp[0]) {
      const lastCreated = new Date(recentOtp[0].created_at as string);
      const elapsed = (Date.now() - lastCreated.getTime()) / 1000;
      if (elapsed < OTP_COOLDOWN_SECONDS) {
        const wait = Math.ceil(OTP_COOLDOWN_SECONDS - elapsed);
        return {
          ok: false as const,
          error: `Please wait ${wait} second${wait > 1 ? "s" : ""} before requesting another code.`,
        };
      }
    }

    // Check for too many OTPs in a short window (abuse protection)
    const recentCount = await sql`
      SELECT count(*)::int as c FROM phone_otps
      WHERE phone = ${phone} AND created_at > now() - interval '1 hour'
    `;
    if (Number(recentCount[0]?.c ?? 0) >= 10) {
      return {
        ok: false as const,
        error: "Too many verification requests. Please try again later.",
      };
    }

    const code = generateOtpCode();
    const id = newId("otp");
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

    if (process.env.NODE_ENV !== "production") {
      console.info(`[OTP] Generated | phone: ${phone} | code: ${code} | purpose: ${data.purpose}`);
    }

    await sql`
      INSERT INTO phone_otps (id, phone, code, purpose, expires_at, attempts)
      VALUES (${id}, ${phone}, ${code}, ${data.purpose}, ${expiresAt.toISOString()}, 0)
    `;

    try {
      await deliverOtp(phone, code, data.purpose);
    } catch (err) {
      console.error("OTP delivery failed:", err);
      // Still return success to the client in dev mode — the code is in logs
      if (!process.env.SMS_GATEWAY_URL) {
        return { ok: true as const, phone, devCode: code };
      }
      return { ok: false as const, error: "Failed to send SMS. Please try again." };
    }

    return {
      ok: true as const,
      phone,
      ...(process.env.NODE_ENV !== "production" ? { devCode: code } : {}),
    };
  });

/**
 * Verify a phone OTP code.
 * Returns the verification result (success + matched purpose).
 */
export const verifyPhoneOtp = createServerFn({ method: "POST" })
  .validator(
    z.object({
      phone: z.string().min(1),
      code: z.string().length(OTP_LENGTH),
      purpose: z.enum(["register", "login", "reset"]),
    }),
  )
  .handler(async ({ data }) => {
    const phone = normalizePhone(data.phone);
    if (!phone) {
      return { ok: false as const, error: "Invalid phone number." };
    }

    const sql = await getSql();

    // Find the latest valid OTP for this phone + purpose
    const otps = await sql`
      SELECT * FROM phone_otps
      WHERE phone = ${phone} AND purpose = ${data.purpose} AND expires_at > now()
      ORDER BY created_at DESC LIMIT 1
    `;

    if (!otps[0]) {
      return { ok: false as const, error: "No active verification code. Please request a new one." };
    }

    const otp = otps[0];
    const attempts = Number(otp.attempts ?? 0);

    if (process.env.NODE_ENV !== "production") {
      console.info(`[OTP] Verify | phone: ${phone} | entered: ${data.code} | stored: ${otp.code} | purpose: ${data.purpose}`);
    }

    if (attempts >= OTP_MAX_ATTEMPTS) {
      // Delete exhausted OTP so user can request a new one
      await sql`DELETE FROM phone_otps WHERE id = ${otp.id}`;
      return { ok: false as const, error: "Too many failed attempts. Please request a new code." };
    }

    if (otp.code !== data.code) {
      // Increment attempts
      await sql`UPDATE phone_otps SET attempts = attempts + 1 WHERE id = ${otp.id}`;
      const remaining = OTP_MAX_ATTEMPTS - attempts - 1;
      return {
        ok: false as const,
        error: remaining > 0
          ? `Incorrect code. ${remaining} attempt${remaining > 1 ? "s" : ""} remaining.`
          : "Incorrect code. Please request a new code.",
      };
    }

    // Success — delete the OTP (one-time use)
    await sql`DELETE FROM phone_otps WHERE id = ${otp.id}`;

    // Mark phone as verified in profiles (if profile exists)
    await sql`
      UPDATE profiles SET phone_verified = true
      WHERE phone = ${phone} AND phone_verified = false
    `;

    return { ok: true as const, phone, purpose: data.purpose };
  });

/**
 * Check if a phone number is already registered.
 * Used before registration to give a clear error.
 */
export const checkPhoneRegistered = createServerFn({ method: "GET" })
  .validator(z.object({ phone: z.string().min(1) }))
  .handler(async ({ data }) => {
    const phone = normalizePhone(data.phone);
    if (!phone) {
      return { registered: false as const };
    }
    const sql = await getSql();
    const rows = await sql`
      SELECT user_id FROM profiles WHERE phone = ${phone} LIMIT 1
    `;
    return { registered: rows.length > 0, phone };
  });

// ——— Audit Logging ———

/**
 * Log an auth event to the audit_log table.
 */
export const logAuditEvent = createServerFn({ method: "POST" })
  .validator(
    z.object({
      event: z.string(),
      phone: z.string().optional(),
      userId: z.string().optional(),
      detail: z.string().optional(),
    }),
  )
  .handler(async ({ data }) => {
    try {
      const sql = await getSql();
      // Ensure table exists (self-bootstrapping)
      await sql.query(`CREATE TABLE IF NOT EXISTS audit_log (
        id          text primary key,
        event       text not null,
        phone       text,
        user_id     text,
        ip_address  text,
        user_agent  text,
        detail      text,
        created_at  timestamptz not null default now()
      )`);
      await sql.query(`CREATE INDEX IF NOT EXISTS audit_log_event_idx ON audit_log (event)`);
      await sql.query(`CREATE INDEX IF NOT EXISTS audit_log_phone_idx ON audit_log (phone)`);
      await sql.query(`CREATE INDEX IF NOT EXISTS audit_log_created_at_idx ON audit_log (created_at)`);
      const id = `audit-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      await sql`
        INSERT INTO audit_log (id, event, phone, user_id, detail, created_at)
        VALUES (${id}, ${data.event}, ${data.phone ?? null}, ${data.userId ?? null}, ${data.detail ?? null}, now())
      `;
    } catch (err) {
      console.error("[audit] Failed to log event:", err);
    }
  });

// ——— Password Reset ———

/**
 * Reset a user's password after OTP verification.
 * The OTP must have purpose 'reset' and must have been verified.
 */
export const resetPassword = createServerFn({ method: "POST" })
  .validator(
    z.object({
      phone: z.string().min(1),
      code: z.string().length(OTP_LENGTH),
      newPassword: z.string().min(8),
    }),
  )
  .handler(async ({ data }) => {
    const phone = normalizePhone(data.phone);
    if (!phone) {
      return { ok: false as const, error: "Invalid phone number." };
    }

    // Validate new password strength
    if (data.newPassword.length < 8) {
      return { ok: false as const, error: "Password must be at least 8 characters." };
    }
    if (!/[A-Z]/.test(data.newPassword) || !/[a-z]/.test(data.newPassword) || !/[0-9]/.test(data.newPassword)) {
      return { ok: false as const, error: "Password must include uppercase, lowercase, and a number." };
    }

    const sql = await getSql();

    // Verify the reset OTP
    const otps = await sql`
      SELECT * FROM phone_otps
      WHERE phone = ${phone} AND purpose = 'reset' AND expires_at > now()
      ORDER BY created_at DESC LIMIT 1
    `;

    if (!otps[0]) {
      return { ok: false as const, error: "No active reset code. Please request a new one." };
    }

    const otp = otps[0];
    if (Number(otp.attempts ?? 0) >= OTP_MAX_ATTEMPTS) {
      await sql`DELETE FROM phone_otps WHERE id = ${otp.id}`;
      return { ok: false as const, error: "Too many failed attempts. Please request a new code." };
    }

    if (otp.code !== data.code) {
      await sql`UPDATE phone_otps SET attempts = attempts + 1 WHERE id = ${otp.id}`;
      const remaining = OTP_MAX_ATTEMPTS - Number(otp.attempts ?? 0) - 1;
      return {
        ok: false as const,
        error: remaining > 0
          ? `Incorrect code. ${remaining} attempt${remaining > 1 ? "s" : ""} remaining.`
          : "Incorrect code. Please request a new code.",
      };
    }

    // OTP verified — delete it and update the password via Better Auth
    await sql`DELETE FROM phone_otps WHERE id = ${otp.id}`;

    // Update password in Better Auth's user table
    // Better Auth stores passwords hashed — we need to use its API
    const syntheticEmail = `${phone.replace("+", "")}@granary.local`;
    try {
      // Import Better Auth server to update the password
      const { auth } = await import("@/shared/auth/server");
      const user = await sql`SELECT id FROM "user" WHERE email = ${syntheticEmail} LIMIT 1`;
      if (!user[0]) {
        return { ok: false as const, error: "Account not found." };
      }
      // Use Better Auth internals to update password
      // The updatePassword method is available on the auth instance
      await (auth as any).updatePassword({
        userId: user[0].id as string,
        newPassword: data.newPassword,
      });
    } catch (err) {
      console.error("[password-reset] Failed to update password:", err);
      return { ok: false as const, error: "Failed to update password. Please try again." };
    }

    return { ok: true as const, phone };
  });
