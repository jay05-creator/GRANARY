import pg from "pg";
import { verifyPassword } from "better-auth/crypto";

const databaseUrl = process.env.DATABASE_URL?.trim();
const pool = new pg.Pool({ connectionString: databaseUrl, max: 1 });

async function main() {
  console.log("=== BETTER AUTH USER & ACCOUNT AUDIT ===");
  
  // 1. Count users and accounts
  const { rows: userCount } = await pool.query('SELECT count(*)::int as count FROM "user"');
  const { rows: accountCount } = await pool.query('SELECT count(*)::int as count FROM "account"');
  console.log(`Total "user" rows in Better Auth: ${userCount[0].count}`);
  console.log(`Total "account" rows in Better Auth: ${accountCount[0].count}`);

  // 2. Sample key users
  const targets = ["farmer-meera", "op-sahyadri", "farmer-1", "op-10"];
  const { rows: users } = await pool.query(
    `SELECT u.id, u.name, u.email, u."emailVerified", a.id as account_id, a."providerId", a.password
     FROM "user" u
     LEFT JOIN "account" a ON a."userId" = u.id
     WHERE u.id = ANY($1)`,
    [targets]
  );

  console.log("\nTarget Demo Users in Auth Database:");
  for (const u of users) {
    let passwordValid = false;
    if (u.id === "farmer-meera") {
      passwordValid = await verifyPassword({ hash: u.password, password: "meerakulkarni123" });
    } else if (u.id === "op-sahyadri") {
      passwordValid = await verifyPassword({ hash: u.password, password: "sahyadricoldchain123" });
    } else if (u.id === "farmer-1") {
      passwordValid = await verifyPassword({ hash: u.password, password: "farmer1singh123" });
    } else if (u.id === "op-10") {
      passwordValid = await verifyPassword({ hash: u.password, password: "operator10storage123" });
    }

    console.log({
      id: u.id,
      name: u.name,
      email: u.email,
      hasAccount: Boolean(u.account_id),
      provider: u.providerId,
      passwordValid,
    });
  }

  process.exit(0);
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
}).finally(() => pool.end());
