#!/usr/bin/env node
/**
 * Seed demo Nashik profiles + facilities + one pending request.
 * Idempotent (ON CONFLICT DO NOTHING). Requires DATABASE_URL.
 */
import pg from "pg";

const databaseUrl = process.env.DATABASE_URL?.trim();
if (!databaseUrl) {
  console.error("[seed] DATABASE_URL is not set");
  process.exit(1);
}

const pool = new pg.Pool({ connectionString: databaseUrl, max: 1 });

async function main() {
  const q = (text, params) => pool.query(text, params);

  const ops = [
    { id: "op-sahyadri", name: "Sahyadri Cold Chain", phone: "ops@sahyadri-chain.in" },
    { id: "op-coldstar", name: "ColdStar Nashik", phone: "yard@coldstar.in" },
    { id: "op-godavari", name: "Godavari Cold Chain", phone: "desk@godavari-cold.in" },
    { id: "op-deccan", name: "Deccan Warehousing", phone: "hello@deccan-wh.in" },
    { id: "op-lasal", name: "Lasalgaon Yard Co-op", phone: "yard@lasalgaon.coop" },
  ];
  for (const op of ops) {
    await q(
      `insert into profiles (user_id, role, name, phone, farm_or_contact, village_or_company)
       values ($1, 'operator', $2, $3, $3, 'Nashik') on conflict (user_id) do nothing`,
      [op.id, op.name, op.phone],
    );
  }

  await q(
    `insert into profiles (user_id, role, name, village_or_company, farm_or_contact, crops, lat, lng, phone)
     values ('farmer-meera', 'farmer', 'Meera Kulkarni', 'Niphad', 'Kulkarni Vineyards', $1, 20.0797, 74.1106, '+91 98220 99887')
     on conflict (user_id) do nothing`,
    [["Grapes", "Raisins", "Onions"]],
  );

  const facs = [
    ["fac-mohadi", "op-sahyadri", "Sahyadri Packhouse", "packhouse", 20.0194, 73.8702, "Mohadi Road", "Mohadi", 86, 41, 18, "0 to 2 C", ["Grapes", "Pomegranate"]],
    ["fac-midc", "op-coldstar", "ColdStar Nashik MIDC", "cold", 19.9912, 73.7874, "Plot 14 Satpur MIDC", "Nashik", 120, 64, 22, "-2 to 4 C", ["Grapes", "Tomato"]],
    ["fac-kopargaon", "op-godavari", "Godavari Cold Chain", "cold", 19.8854, 74.4761, "Ahmednagar Road", "Kopargaon", 70, 70, 16, "0 to 5 C", ["Onion"]],
    ["fac-lasalgaon", "op-lasal", "Lasalgaon Onion Yard", "dry", 20.1426, 74.2326, "APMC yard", "Lasalgaon", 240, 240, 9, null, ["Onion"]],
    ["fac-pimpalgaon", "op-deccan", "Deccan Dry Store", "dry", 20.1648, 73.9921, "Pimpalgaon bypass", "Pimpalgaon", 54, 0, 11, null, ["Onion", "Raisins"]],
    ["fac-igatpuri", "op-sahyadri", "Igatpuri Hill Cold", "cold", 19.6957, 73.5626, "Ghoti Road", "Igatpuri", 38, 4, 24, "2 to 6 C", ["Grapes", "Strawberry"]],
  ];
  for (const f of facs) {
    await q(
      `insert into facilities (
         id, operator_user_id, name, kind, lat, lng, address, city,
         capacity_tons, base_occupied_tons, rate_per_ton_day, temp_range, crops, photo, hours
       ) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,'6:00 – 20:00')
       on conflict (id) do nothing`,
      [...f, `https://api.dicebear.com/9.x/shapes/svg?seed=${f[0]}`],
    );
  }

  await q(
    `insert into farmer_requests (
       id, farmer_user_id, farmer_name, farmer_village, farmer_contact,
       crop, variety, tons, days, lat, lng, status, ai_advisory
     ) values (
       'req-demo-1', 'farmer-meera', 'Meera Kulkarni', 'Niphad', '+91 98220 99887',
       'Grapes', 'Thompson Seedless', 12, 18, 20.0797, 74.1106, 'pending',
       'Grapes: prefer 0–2°C cold storage. Pre-cool within 6 hours of harvest.'
     ) on conflict (id) do nothing`,
  );

  const { rows } = await q(`select
    (select count(*)::int from profiles) as profiles,
    (select count(*)::int from facilities) as facilities,
    (select count(*)::int from farmer_requests) as requests`);
  console.log("[seed] done", rows[0]);
}

main()
  .catch((err) => {
    console.error("[seed] failed", err);
    process.exit(1);
  })
  .finally(() => pool.end());
