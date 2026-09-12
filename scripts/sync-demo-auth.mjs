import pg from "pg";
import { hashPassword } from "better-auth/crypto";

const databaseUrl = process.env.DATABASE_URL?.trim();
if (!databaseUrl) {
  console.error("[sync-auth] DATABASE_URL is not set");
  process.exit(1);
}

const pool = new pg.Pool({ connectionString: databaseUrl, max: 1 });

function normalizePhone(phone) {
  let digits = (phone || "").replace(/[^\d+]/g, "");
  if (digits.startsWith("+")) digits = digits.slice(1);
  if (digits.startsWith("0")) digits = digits.slice(1);
  if (digits.length === 10) {
    digits = "91" + digits;
  } else if (digits.length === 12 && digits.startsWith("91")) {
    // ok
  } else if (digits.length < 10) {
    return null;
  }
  return "+" + digits;
}

function phoneToSyntheticEmail(phone) {
  const normalized = normalizePhone(phone);
  if (!normalized) {
    const digits = (phone || "").replace(/\D/g, "");
    return `${digits}@granary.local`;
  }
  const digits = normalized.replace("+", "");
  return `${digits}@granary.local`;
}

async function main() {
  console.log("[sync-auth] Ensuring core demo profiles exist...");
  await pool.query(`
    INSERT INTO profiles (user_id, role, name, phone, village_or_company, farm_or_contact, crops, lat, lng)
    VALUES ('farmer-meera', 'farmer', 'Meera Kulkarni', '+91 98220 99887', 'Niphad', 'Kulkarni Vineyards', ARRAY['Grapes', 'Raisins', 'Onions'], 20.0797, 74.1106)
    ON CONFLICT (user_id) DO UPDATE SET phone = '+91 98220 99887', name = 'Meera Kulkarni'
  `);
  await pool.query(`
    INSERT INTO profiles (user_id, role, name, phone, village_or_company, farm_or_contact)
    VALUES ('op-sahyadri', 'operator', 'Sahyadri Cold Chain', '+91 98230 12345', 'Nashik', 'Sahyadri Warehouse Network')
    ON CONFLICT (user_id) DO UPDATE SET phone = '+91 98230 12345', name = 'Sahyadri Cold Chain'
  `);

  console.log("[sync-auth] Fetching existing profiles...");
  const { rows: profiles } = await pool.query(
    "SELECT user_id, role, name, phone FROM profiles ORDER BY role, name"
  );

  console.log(`[sync-auth] Found ${profiles.length} profiles to check.`);

  for (const p of profiles) {
    const userId = p.user_id;
    const name = p.name || userId;
    const rawPhone = p.phone || "";
    const email = phoneToSyntheticEmail(rawPhone);
    const plainPassword = name.replace(/\s+/g, "").toLowerCase() + "123";
    const passwordHash = await hashPassword(plainPassword);

    // 1. Check if Better Auth "user" exists by id or email
    const existing = await pool.query(
      `SELECT "id", "email" FROM "user" WHERE "id" = $1 OR "email" = $2`,
      [userId, email]
    );

    let actualUserId = userId;
    if (existing.rows.length > 0) {
      actualUserId = existing.rows[0].id;
      await pool.query(
        `UPDATE "user" SET "name" = $1, "email" = $2, "emailVerified" = true, "updatedAt" = NOW() WHERE "id" = $3`,
        [name, email, actualUserId]
      );
    } else {
      await pool.query(
        `INSERT INTO "user" ("id", "name", "email", "emailVerified", "createdAt", "updatedAt")
         VALUES ($1, $2, $3, true, NOW(), NOW())`,
        [userId, name, email]
      );
    }

    // 2. Ensure Better Auth "account" exists
    const accountId = `account-${actualUserId}`;
    const existingAccount = await pool.query(
      `SELECT "id" FROM "account" WHERE "userId" = $1 AND "providerId" = 'credential'`,
      [actualUserId]
    );

    if (existingAccount.rows.length > 0) {
      await pool.query(
        `UPDATE "account" SET "password" = $1, "updatedAt" = NOW() WHERE "id" = $2`,
        [passwordHash, existingAccount.rows[0].id]
      );
    } else {
      await pool.query(
        `INSERT INTO "account" ("id", "accountId", "providerId", "userId", "password", "createdAt", "updatedAt")
         VALUES ($1, $2, 'credential', $3, $4, NOW(), NOW())`,
        [accountId, actualUserId, actualUserId, passwordHash]
      );
    }

    console.log(`[sync-auth] Synced: ${name} (${actualUserId}) -> email: ${email}, pass: ${plainPassword}`);
  }

  console.log("[sync-auth] Complete! All profiles synced to Better Auth.");
}

main()
  .catch((err) => {
    console.error("[sync-auth] Error:", err);
    process.exit(1);
  })
  .finally(() => pool.end());
