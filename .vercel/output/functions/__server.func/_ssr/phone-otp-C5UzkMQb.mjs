import { r as createServerFn } from "./ssr.mjs";
import { D as _enum, F as object, R as string } from "../_libs/@better-auth/core+[...].mjs";
import { r as getSql } from "./db-CpkKAdtF.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
import { n as normalizePhone } from "./phone-H0iOOiqk.mjs";
import { randomBytes } from "node:crypto";
//#region node_modules/.nitro/vite/services/ssr/assets/phone-otp-C5UzkMQb.js
/**
* Server-side phone OTP operations: generate, send (via SMS gateway), verify.
*
* OTP codes are 6 digits, expire after 5 minutes, and allow max 3 attempts.
* The `phone_otps` table (migration 0003) stores active codes.
*
* SMS delivery is pluggable — when no gateway is configured, the OTP is
* logged to the console (dev/preview mode) so the flow can be tested end-to-end.
*/
var OTP_LENGTH = 6;
var OTP_EXPIRY_MINUTES = 5;
var OTP_MAX_ATTEMPTS = 3;
var OTP_COOLDOWN_SECONDS = 60;
var AUTH_RATE_WINDOW_MINUTES = 15;
var AUTH_RATE_MAX_ATTEMPTS = 5;
var AUTH_RATE_LOCKOUT_MINUTES = 30;
/**
* Check server-side rate limit for auth actions (sign_in, sign_up).
* Returns null if allowed, or an error message string if blocked.
*/
var checkAuthRateLimit_createServerFn_handler = createServerRpc({
	id: "94041c0419f9c8251c513329cb1e816ad3e249406ee662a445e3319306118f66",
	name: "checkAuthRateLimit",
	filename: "src/lib/server/phone-otp.ts"
}, (opts) => checkAuthRateLimit.__executeServer(opts));
var checkAuthRateLimit = createServerFn({ method: "POST" }).validator(object({
	phone: string().min(1),
	action: _enum(["sign_in", "sign_up"])
})).handler(checkAuthRateLimit_createServerFn_handler, async ({ data }) => {
	const phone = normalizePhone(data.phone);
	if (!phone) return { allowed: true };
	const sql = await getSql();
	await sql.query(`CREATE TABLE IF NOT EXISTS auth_rate_limits (
      id          text primary key,
      phone       text not null,
      action      text not null check (action in ('sign_in', 'sign_up')),
      attempts    integer not null default 1,
      window_start timestamptz not null default now()
    )`);
	await sql.query(`CREATE INDEX IF NOT EXISTS auth_rate_limits_phone_action_idx
      ON auth_rate_limits (phone, action)`);
	await sql.query(`DELETE FROM auth_rate_limits WHERE window_start < now() - interval '${AUTH_RATE_LOCKOUT_MINUTES} minutes'`);
	const rows = await sql`
      SELECT attempts, window_start FROM auth_rate_limits
      WHERE phone = ${phone} AND action = ${data.action}
      ORDER BY window_start DESC LIMIT 1
    `;
	if (rows[0]) {
		const windowStart = new Date(rows[0].window_start);
		const elapsed = (Date.now() - windowStart.getTime()) / 1e3 / 60;
		const attempts = Number(rows[0].attempts);
		if (elapsed < AUTH_RATE_WINDOW_MINUTES) {
			if (attempts >= AUTH_RATE_MAX_ATTEMPTS) {
				const remaining = Math.ceil(AUTH_RATE_WINDOW_MINUTES - elapsed);
				return {
					allowed: false,
					error: `Too many failed attempts. Please try again in ${remaining} minute${remaining > 1 ? "s" : ""}.`
				};
			}
		}
	}
	return { allowed: true };
});
var recordAuthAttempt_createServerFn_handler = createServerRpc({
	id: "3ea1702cdfdbc8df3a0843a59cccfff9a08a62aeb84da4c63bb5f7740f05e9bf",
	name: "recordAuthAttempt",
	filename: "src/lib/server/phone-otp.ts"
}, (opts) => recordAuthAttempt.__executeServer(opts));
var recordAuthAttempt = createServerFn({ method: "POST" }).validator(object({
	phone: string().min(1),
	action: _enum(["sign_in", "sign_up"])
})).handler(recordAuthAttempt_createServerFn_handler, async ({ data }) => {
	const phone = normalizePhone(data.phone);
	if (!phone) return;
	const sql = await getSql();
	const existing = await sql.query(`SELECT id, attempts FROM auth_rate_limits
      WHERE phone = $1 AND action = $2
        AND window_start > now() - interval '${AUTH_RATE_WINDOW_MINUTES} minutes'
      ORDER BY window_start DESC LIMIT 1`, [phone, data.action]);
	if (existing[0]) await sql`
        UPDATE auth_rate_limits SET attempts = attempts + 1
        WHERE id = ${existing[0].id}
      `;
	else await sql`
        INSERT INTO auth_rate_limits (id, phone, action, attempts, window_start)
        VALUES (${`rl-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`}, ${phone}, ${data.action}, 1, now())
      `;
});
var resetAuthRateLimit_createServerFn_handler = createServerRpc({
	id: "f49b1e155d7ba24f766d59109e2b76931323e13a663ff87c1cf0971347d24c26",
	name: "resetAuthRateLimit",
	filename: "src/lib/server/phone-otp.ts"
}, (opts) => resetAuthRateLimit.__executeServer(opts));
var resetAuthRateLimit = createServerFn({ method: "POST" }).validator(object({
	phone: string().min(1),
	action: _enum(["sign_in", "sign_up"])
})).handler(resetAuthRateLimit_createServerFn_handler, async ({ data }) => {
	const phone = normalizePhone(data.phone);
	if (!phone) return;
	await (await getSql())`DELETE FROM auth_rate_limits WHERE phone = ${phone} AND action = ${data.action}`;
});
function generateOtpCode() {
	const num = randomBytes(4).readUInt32BE(0);
	return String(num % 1e6).padStart(OTP_LENGTH, "0");
}
function newId(prefix) {
	return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
/**
* Send an OTP via SMS gateway.
* When SMS_GATEWAY_URL is not set, logs to console (dev mode).
*/
async function deliverOtp(phone, code, purpose) {
	const gatewayUrl = process.env.SMS_GATEWAY_URL;
	const gatewayKey = process.env.SMS_GATEWAY_API_KEY;
	if (gatewayUrl && gatewayKey) {
		const response = await fetch(gatewayUrl, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${gatewayKey}`
			},
			body: JSON.stringify({
				to: phone,
				message: `Your Granary verification code is: ${code}. Valid for ${OTP_EXPIRY_MINUTES} minutes. Do not share this code.`
			})
		});
		if (!response.ok) {
			const text = await response.text();
			throw new Error(`SMS delivery failed (${response.status}): ${text}`);
		}
	} else console.log(`\n📱 [DEV OTP] Phone: ${phone} | Code: ${code} | Purpose: ${purpose}\n`);
}
/**
* Send a phone OTP for a given purpose (register, login, reset).
* Enforces cooldown between requests and cleans up expired OTPs.
*/
var sendPhoneOtp_createServerFn_handler = createServerRpc({
	id: "72fbfd7c9e1ee41959e7b6876658ec032d62ccfbb7be10d578c1ffdba37ebe28",
	name: "sendPhoneOtp",
	filename: "src/lib/server/phone-otp.ts"
}, (opts) => sendPhoneOtp.__executeServer(opts));
var sendPhoneOtp = createServerFn({ method: "POST" }).validator(object({
	phone: string().min(1),
	purpose: _enum([
		"register",
		"login",
		"reset"
	])
})).handler(sendPhoneOtp_createServerFn_handler, async ({ data }) => {
	const phone = normalizePhone(data.phone);
	if (!phone) return {
		ok: false,
		error: "Invalid phone number."
	};
	const sql = await getSql();
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
	await sql`DELETE FROM phone_otps WHERE expires_at < now() AND phone = ${phone}`;
	const recentOtp = await sql`
      SELECT created_at FROM phone_otps
      WHERE phone = ${phone} AND purpose = ${data.purpose}
      ORDER BY created_at DESC LIMIT 1
    `;
	if (recentOtp[0]) {
		const lastCreated = new Date(recentOtp[0].created_at);
		const elapsed = (Date.now() - lastCreated.getTime()) / 1e3;
		if (elapsed < OTP_COOLDOWN_SECONDS) {
			const wait = Math.ceil(OTP_COOLDOWN_SECONDS - elapsed);
			return {
				ok: false,
				error: `Please wait ${wait} second${wait > 1 ? "s" : ""} before requesting another code.`
			};
		}
	}
	const recentCount = await sql`
      SELECT count(*)::int as c FROM phone_otps
      WHERE phone = ${phone} AND created_at > now() - interval '1 hour'
    `;
	if (Number(recentCount[0]?.c ?? 0) >= 10) return {
		ok: false,
		error: "Too many verification requests. Please try again later."
	};
	const code = generateOtpCode();
	const id = newId("otp");
	const expiresAt = new Date(Date.now() + 3e5);
	await sql`
      INSERT INTO phone_otps (id, phone, code, purpose, expires_at, attempts)
      VALUES (${id}, ${phone}, ${code}, ${data.purpose}, ${expiresAt.toISOString()}, 0)
    `;
	try {
		await deliverOtp(phone, code, data.purpose);
	} catch (err) {
		console.error("OTP delivery failed:", err);
		if (!process.env.SMS_GATEWAY_URL) return {
			ok: true,
			phone,
			devCode: code
		};
		return {
			ok: false,
			error: "Failed to send SMS. Please try again."
		};
	}
	return {
		ok: true,
		phone
	};
});
var verifyPhoneOtp_createServerFn_handler = createServerRpc({
	id: "5d69b0a14a674d3f0ebcee5f149b05debb7005e4a0ed4b82aeba9cbdb67d3713",
	name: "verifyPhoneOtp",
	filename: "src/lib/server/phone-otp.ts"
}, (opts) => verifyPhoneOtp.__executeServer(opts));
var verifyPhoneOtp = createServerFn({ method: "POST" }).validator(object({
	phone: string().min(1),
	code: string().length(OTP_LENGTH),
	purpose: _enum([
		"register",
		"login",
		"reset"
	])
})).handler(verifyPhoneOtp_createServerFn_handler, async ({ data }) => {
	const phone = normalizePhone(data.phone);
	if (!phone) return {
		ok: false,
		error: "Invalid phone number."
	};
	const sql = await getSql();
	const otps = await sql`
      SELECT * FROM phone_otps
      WHERE phone = ${phone} AND purpose = ${data.purpose} AND expires_at > now()
      ORDER BY created_at DESC LIMIT 1
    `;
	if (!otps[0]) return {
		ok: false,
		error: "No active verification code. Please request a new one."
	};
	const otp = otps[0];
	const attempts = Number(otp.attempts ?? 0);
	if (attempts >= OTP_MAX_ATTEMPTS) {
		await sql`DELETE FROM phone_otps WHERE id = ${otp.id}`;
		return {
			ok: false,
			error: "Too many failed attempts. Please request a new code."
		};
	}
	if (otp.code !== data.code) {
		await sql`UPDATE phone_otps SET attempts = attempts + 1 WHERE id = ${otp.id}`;
		const remaining = OTP_MAX_ATTEMPTS - attempts - 1;
		return {
			ok: false,
			error: remaining > 0 ? `Incorrect code. ${remaining} attempt${remaining > 1 ? "s" : ""} remaining.` : "Incorrect code. Please request a new code."
		};
	}
	await sql`DELETE FROM phone_otps WHERE id = ${otp.id}`;
	await sql`
      UPDATE profiles SET phone_verified = true
      WHERE phone = ${phone} AND phone_verified = false
    `;
	return {
		ok: true,
		phone,
		purpose: data.purpose
	};
});
var checkPhoneRegistered_createServerFn_handler = createServerRpc({
	id: "1659962829fe36fc477ba64821f05151ecc160f9f9be651e0ed6115e80ae3b2d",
	name: "checkPhoneRegistered",
	filename: "src/lib/server/phone-otp.ts"
}, (opts) => checkPhoneRegistered.__executeServer(opts));
var checkPhoneRegistered = createServerFn({ method: "GET" }).validator(object({ phone: string().min(1) })).handler(checkPhoneRegistered_createServerFn_handler, async ({ data }) => {
	const phone = normalizePhone(data.phone);
	if (!phone) return { registered: false };
	return {
		registered: (await (await getSql())`
      SELECT user_id FROM profiles WHERE phone = ${phone} LIMIT 1
    `).length > 0,
		phone
	};
});
var logAuditEvent_createServerFn_handler = createServerRpc({
	id: "f3c8b3f46f41925fbf92d78a81d154b8b5fa311dfb1fcd23dc9d89370a3581c2",
	name: "logAuditEvent",
	filename: "src/lib/server/phone-otp.ts"
}, (opts) => logAuditEvent.__executeServer(opts));
var logAuditEvent = createServerFn({ method: "POST" }).validator(object({
	event: string(),
	phone: string().optional(),
	userId: string().optional(),
	detail: string().optional()
})).handler(logAuditEvent_createServerFn_handler, async ({ data }) => {
	try {
		const sql = await getSql();
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
		await sql`
        INSERT INTO audit_log (id, event, phone, user_id, detail, created_at)
        VALUES (${`audit-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`}, ${data.event}, ${data.phone ?? null}, ${data.userId ?? null}, ${data.detail ?? null}, now())
      `;
	} catch (err) {
		console.error("[audit] Failed to log event:", err);
	}
});
var resetPassword_createServerFn_handler = createServerRpc({
	id: "96526821f614fe11dfe6189d013dfd4f37886822fd54e0dec77fe5392e78cc46",
	name: "resetPassword",
	filename: "src/lib/server/phone-otp.ts"
}, (opts) => resetPassword.__executeServer(opts));
var resetPassword = createServerFn({ method: "POST" }).validator(object({
	phone: string().min(1),
	code: string().length(OTP_LENGTH),
	newPassword: string().min(8)
})).handler(resetPassword_createServerFn_handler, async ({ data }) => {
	const phone = normalizePhone(data.phone);
	if (!phone) return {
		ok: false,
		error: "Invalid phone number."
	};
	if (data.newPassword.length < 8) return {
		ok: false,
		error: "Password must be at least 8 characters."
	};
	if (!/[A-Z]/.test(data.newPassword) || !/[a-z]/.test(data.newPassword) || !/[0-9]/.test(data.newPassword)) return {
		ok: false,
		error: "Password must include uppercase, lowercase, and a number."
	};
	const sql = await getSql();
	const otps = await sql`
      SELECT * FROM phone_otps
      WHERE phone = ${phone} AND purpose = 'reset' AND expires_at > now()
      ORDER BY created_at DESC LIMIT 1
    `;
	if (!otps[0]) return {
		ok: false,
		error: "No active reset code. Please request a new one."
	};
	const otp = otps[0];
	if (Number(otp.attempts ?? 0) >= OTP_MAX_ATTEMPTS) {
		await sql`DELETE FROM phone_otps WHERE id = ${otp.id}`;
		return {
			ok: false,
			error: "Too many failed attempts. Please request a new code."
		};
	}
	if (otp.code !== data.code) {
		await sql`UPDATE phone_otps SET attempts = attempts + 1 WHERE id = ${otp.id}`;
		const remaining = OTP_MAX_ATTEMPTS - Number(otp.attempts ?? 0) - 1;
		return {
			ok: false,
			error: remaining > 0 ? `Incorrect code. ${remaining} attempt${remaining > 1 ? "s" : ""} remaining.` : "Incorrect code. Please request a new code."
		};
	}
	await sql`DELETE FROM phone_otps WHERE id = ${otp.id}`;
	const syntheticEmail = `${phone.replace("+", "")}@granary.local`;
	try {
		const { auth } = await import("./server-0w8Z6cbM.mjs").then((n) => n.r);
		const user = await sql`SELECT id FROM "user" WHERE email = ${syntheticEmail} LIMIT 1`;
		if (!user[0]) return {
			ok: false,
			error: "Account not found."
		};
		await auth.updatePassword({
			userId: user[0].id,
			newPassword: data.newPassword
		});
	} catch (err) {
		console.error("[password-reset] Failed to update password:", err);
		return {
			ok: false,
			error: "Failed to update password. Please try again."
		};
	}
	return {
		ok: true,
		phone
	};
});
//#endregion
export { checkAuthRateLimit_createServerFn_handler, checkPhoneRegistered_createServerFn_handler, logAuditEvent_createServerFn_handler, recordAuthAttempt_createServerFn_handler, resetAuthRateLimit_createServerFn_handler, resetPassword_createServerFn_handler, sendPhoneOtp_createServerFn_handler, verifyPhoneOtp_createServerFn_handler };
