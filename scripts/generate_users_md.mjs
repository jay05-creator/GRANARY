import pg from 'pg';
import fs from 'fs';

const databaseUrl = process.env.DATABASE_URL?.trim();
const pool = new pg.Pool({ connectionString: databaseUrl, max: 1 });

async function main() {
  const { rows } = await pool.query('SELECT role, name, phone FROM profiles ORDER BY role, name');
  let md = '# Granary Demo Users\n\nThis document lists the pre-seeded demo users along with their auto-generated passwords.\n\n';
  md += '| Role | Name | Phone | Password |\n|---|---|---|---|\n';
  for (const row of rows) {
    const name = row.name || '';
    const pass = name.replace(/\s+/g, '').toLowerCase() + '123';
    md += `| ${row.role} | ${name} | ${row.phone || ''} | ${pass} |\n`;
  }
  fs.writeFileSync('C:/Users/Jayant Madhwal/.gemini/antigravity-ide/brain/506924c7-b3ca-4a11-a3a5-cc0e0af6fc3b/users.md', md);
  console.log('Done');
  process.exit(0);
}
main().catch(console.error);