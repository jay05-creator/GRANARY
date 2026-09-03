import pg from 'pg';

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function run() {
  const client = await pool.connect();
  try {
    await client.query('TRUNCATE TABLE "user", session, account, verification, profiles, facilities, lots, farmer_requests, documents CASCADE;');
    console.log('All tables truncated successfully.');
  } catch (e) {
    console.error('Error truncating tables:', e);
  } finally {
    client.release();
    await pool.end();
  }
}
run();
