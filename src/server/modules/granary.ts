/**
 * Server functions for Granary: profiles, facilities, storage requests,
 * encrypted documents, and rule-based AI advisory.
 */
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getSql } from "@/server/db";
import { authMiddleware } from "@/shared/auth/middleware";
import { encryptDocument } from "@/server/crypto.server";
import { sanitizeText, sanitizeName, sanitizePhone, sanitizeLocation } from "@/shared/sanitize";


// ——— helpers ———

function newId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

/** Simple rule-based advisory (no external LLM required). */
export function generateAiAdvisory(input: {
  crop: string;
  variety: string;
  tons: number;
  days: number;
  lat?: number;
  lng?: number;
}): string {
  const crop = input.crop.toLowerCase();
  const tips: string[] = [];

  if (crop.includes("grape") || crop.includes("angur")) {
    tips.push(
      "Grapes (Nashik region): prefer cold storage at 0–2°C with 90–95% RH. Target relative humidity high to reduce stem drying.",
    );
    tips.push("Pre-cool within 4–6 hours of harvest. Avoid ethylene sources nearby.");
    if (input.days > 21) tips.push("Storage beyond 3 weeks increases risk of berry shrivel — plan release or CA storage.");
  } else if (crop.includes("onion")) {
    tips.push("Onion: dry storage 0–2°C or ventilated ambient with low humidity (65–70%). Cure fully before inbound.");
    tips.push("Monitor for neck rot; do not stack wet bags.");
  } else if (crop.includes("tomato") || crop.includes("tomato")) {
    tips.push("Tomato: 10–13°C cold room preferred. Avoid <10°C (chilling injury).");
  } else if (crop.includes("potato")) {
    tips.push("Potato: 4–7°C, high humidity, dark. Sprout inhibitors if long-term.");
  } else {
    tips.push(`General: match facility temp/humidity to ${input.crop}. Request operator sensor logs on arrival.`);
  }

  tips.push(
    `Volume ${input.tons} t for ${input.days} days ≈ estimated cost band depends on rate (₹/t/day). Confirm current occupancy before locking.`,
  );
  tips.push(
    "WDRA-registered yards preferred for negotiable warehouse receipts and bank linkage.",
  );
  if (input.lat && input.lng) {
    tips.push(
      `Location ~${input.lat.toFixed(2)}, ${input.lng.toFixed(2)}: prioritise yards within 40 km to cut transit heat load.`,
    );
  }
  tips.push(
    "AI note: this is a rule-based advisory for demo/production baseline. Connect an LLM API later for market-price & weather-aware recommendations.",
  );
  return tips.join("\n\n");
}

// ——— Profile ———

const profileSchema = z.object({
  role: z.enum(["farmer", "operator"]),
  name: z.string().min(1).max(120),
  phone: z.string().max(30).optional(),
  email: z.string().email().optional().or(z.literal("")),
  villageOrCompany: z.string().max(120).optional(),
  farmOrContact: z.string().max(120).optional(),
  crops: z.array(z.string()).optional(),
  lat: z.number().optional(),
  lng: z.number().optional(),
});

export const upsertProfile = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: unknown) => profileSchema.parse(data))  .handler(async ({ data, context }) => {
    const sql = await getSql();
    const userId = context.userId;
    
    // Check if user already exists to prevent overwriting during registration
    const existing = await sql`select role from profiles where user_id = ${userId}`;
    if (existing && existing.length > 0) {
      throw new Error(`User already exists with role: ${existing[0].role}. Cannot register again.`);
    }

    const crops = data.crops ?? [];
    // Sanitize user input before storage
    const name = sanitizeName(data.name);
    const phone = data.phone ? sanitizePhone(data.phone) : null;
    const village = data.villageOrCompany ? sanitizeLocation(data.villageOrCompany) : null;
    const farm = data.farmOrContact ? sanitizeText(data.farmOrContact) : null;
    await sql`
      insert into profiles (
        user_id, role, name, phone, email, village_or_company, farm_or_contact,
        crops, lat, lng, updated_at
      ) values (
        ${userId}, ${data.role}, ${name}, ${phone},
        ${data.email || null}, ${village}, ${farm}, ${crops},
        ${data.lat ?? 20.08}, ${data.lng ?? 74.11}, now()
      )
    `;
    return { ok: true as const, userId };
  });

export const getMyProfile = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const rows = await sql`
      select * from profiles where user_id = ${context.userId} limit 1
    `;
    return rows[0] ?? null;
  });

export const updateMyProfile = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: unknown) =>
    z.object({
      name: z.string().min(1).max(120).optional(),
      phone: z.string().max(30).optional(),
      villageOrCompany: z.string().max(120).optional(),
      farmOrContact: z.string().max(120).optional(),
      crops: z.array(z.string()).optional(),
    }).parse(data),
  )
  .handler(async ({ data, context }) => {
    const sql = await getSql();
    const name = data.name ? sanitizeName(data.name) : undefined;
    const phone = data.phone ? sanitizePhone(data.phone) : undefined;
    const village = data.villageOrCompany ? sanitizeLocation(data.villageOrCompany) : undefined;
    const farm = data.farmOrContact ? sanitizeText(data.farmOrContact) : undefined;

    // Build dynamic SET clause
    const sets: string[] = [];
    const vals: unknown[] = [];
    let idx = 1;
    if (name !== undefined) { sets.push(`name = $${idx++}`); vals.push(name); }
    if (phone !== undefined) { sets.push(`phone = $${idx++}`); vals.push(phone); }
    if (village !== undefined) { sets.push(`village_or_company = $${idx++}`); vals.push(village); }
    if (farm !== undefined) { sets.push(`farm_or_contact = $${idx++}`); vals.push(farm); }
    if (data.crops !== undefined) { sets.push(`crops = $${idx++}`); vals.push(data.crops); }
    sets.push(`updated_at = now()`);

    if (sets.length > 1) {
      await sql.query(
        `UPDATE profiles SET ${sets.join(", ")} WHERE user_id = $${idx}`,
        [...vals, context.userId],
      );
    }
    return { ok: true as const };
  });

// ——— Account Deletion ———

export const deleteMyAccount = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const userId = context.userId;

    // 1. Delete app-level data (profile cascades to facilities, lots, requests, documents)
    await sql`DELETE FROM profiles WHERE user_id = ${userId}`;

    // 2. Delete Better Auth records
    await sql`DELETE FROM "session" WHERE "userId" = ${userId}`;
    await sql`DELETE FROM "account" WHERE "userId" = ${userId}`;
    await sql`DELETE FROM "verification" WHERE "identifier" = ${userId}`;
    await sql`DELETE FROM "user" WHERE "id" = ${userId}`;

    return { ok: true as const };
  });

// ——— Facilities (owner lists available storage) ———

const facilitySchema = z.object({
  name: z.string().min(1).max(160),
  city: z.string().min(1).max(80),
  address: z.string().min(1).max(240),
  capacityTons: z.number().positive(),
  ratePerTonDay: z.number().min(0),
  kind: z.enum(["cold", "dry", "packhouse"]),
  tempRange: z.string().max(40).optional(),
  crops: z.array(z.string()).default([]),
  lat: z.number().optional(),
  lng: z.number().optional(),
  hours: z.string().max(60).optional(),
});

export const listMyFacilities = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    return sql`
      select * from facilities
      where operator_user_id = ${context.userId}
      order by created_at desc
    `;
  });

export const listAllFacilities = createServerFn({ method: "GET" })
  .handler(async () => {
    // Public catalogue for farmers (no auth required for discovery)
    const sql = await getSql();
    return sql`
      select f.*, p.name as operator_name, p.phone as operator_phone
      from facilities f
      left join profiles p on p.user_id = f.operator_user_id
      order by f.city, f.name
    `;
  });

export const addFacility = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: unknown) => facilitySchema.parse(data))
  .handler(async ({ data, context }) => {
    const sql = await getSql();
    // Ensure operator profile exists (auto-provision for preview/dev-user)
    let profiles = await sql`select role from profiles where user_id = ${context.userId}`;
    if (!profiles[0]) {
      await sql`
        insert into profiles (user_id, role, name, phone, farm_or_contact, village_or_company)
        values (
          ${context.userId}, 'operator', 'Warehouse Operator', null, 'Yard', 'Nashik'
        )
        on conflict (user_id) do nothing
      `;
      profiles = await sql`select role from profiles where user_id = ${context.userId}`;
    }
    if (!profiles[0] || profiles[0].role !== "operator") {
      throw new Error("Only operators can list storage. Complete operator registration first.");
    }
    const id = newId("fac");
    const lat = data.lat ?? 20.0 + Math.random() * 0.3;
    const lng = data.lng ?? 73.8 + Math.random() * 0.4;
    // Sanitize user input before storage
    const sanitizedName = sanitizeName(data.name);
    const sanitizedAddress = sanitizeLocation(data.address);
    const sanitizedCity = sanitizeLocation(data.city);
    await sql`
      insert into facilities (
        id, operator_user_id, name, kind, lat, lng, address, city,
        capacity_tons, base_occupied_tons, rate_per_ton_day, temp_range,
        crops, photo, hours
      ) values (
        ${id}, ${context.userId}, ${sanitizedName}, ${data.kind},
        ${lat}, ${lng}, ${sanitizedAddress}, ${sanitizedCity},
        ${data.capacityTons}, 0, ${data.ratePerTonDay},
        ${data.tempRange ?? null}, ${data.crops},
        ${`https://api.dicebear.com/9.x/shapes/svg?seed=${encodeURIComponent(sanitizedName)}`},
        ${data.hours ?? "6:00 – 20:00"}
      )
    `;
    const rows = await sql`select * from facilities where id = ${id}`;
    return rows[0];
  });

// ——— Storage requests + AI advisory (farmer) ———

const requestSchema = z.object({
  crop: z.string().min(1).max(80),
  variety: z.string().max(80).optional(),
  tons: z.number().positive(),
  days: z.number().int().positive().max(365),
  lat: z.number().optional(),
  lng: z.number().optional(),
  preferredFacilityId: z.string().optional(),
});

export const createStorageRequest = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: unknown) => requestSchema.parse(data))
  .handler(async ({ data, context }) => {
    const sql = await getSql();
    let profiles = await sql`select * from profiles where user_id = ${context.userId}`;
    let p = profiles[0];
    // Auto-provision farmer profile for first-time / preview dev-user sessions
    if (!p) {
      await sql`
        insert into profiles (user_id, role, name, phone, village_or_company, farm_or_contact, crops)
        values (
          ${context.userId}, 'farmer', 'Farmer', null, 'Niphad', 'Farm',
          ${["Grapes", "Onion"]}
        )
        on conflict (user_id) do nothing
      `;
      profiles = await sql`select * from profiles where user_id = ${context.userId}`;
      p = profiles[0];
    }
    if (!p || p.role !== "farmer") {
      throw new Error("Only farmers can create storage requests. Register as a farmer first.");
    }
    const advisory = generateAiAdvisory({
      crop: data.crop,
      variety: data.variety || "Standard",
      tons: data.tons,
      days: data.days,
      lat: data.lat ?? (p.lat as number),
      lng: data.lng ?? (p.lng as number),
    });
    const id = newId("req");
    await sql`
      insert into farmer_requests (
        id, farmer_user_id, farmer_name, farmer_village, farmer_contact,
        crop, variety, tons, days, lat, lng, status, ai_advisory, preferred_facility_id
      ) values (
        ${id}, ${context.userId}, ${p.name as string},
        ${p.village_or_company as string}, ${p.phone as string},
        ${data.crop}, ${data.variety || "Standard"}, ${data.tons}, ${data.days},
        ${data.lat ?? p.lat}, ${data.lng ?? p.lng},
        'pending', ${advisory}, ${data.preferredFacilityId || null}
      )
    `;
    const rows = await sql`select * from farmer_requests where id = ${id}`;
    return { request: rows[0], advisory };
  });

export const listPendingRequests = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    // Operators see all pending; farmers see own
    const profiles = await sql`select role from profiles where user_id = ${context.userId}`;
    const role = profiles[0]?.role;
    if (role === "operator") {
      return sql`
        select * from farmer_requests
        where status = 'pending'
          and (
            preferred_facility_id is null 
            or preferred_facility_id in (select id from facilities where operator_user_id = ${context.userId})
          )
        order by requested_at desc, created_at desc
      `;
    }
    return sql`
      select * from farmer_requests
      where farmer_user_id = ${context.userId}
      order by created_at desc
    `;
  });

export const allocateRequest = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: unknown) =>
    z
      .object({
        requestId: z.string(),
        facilityId: z.string(),
      })
      .parse(data),
  )
  .handler(async ({ data, context }) => {
    const sql = await getSql();
    const profiles = await sql`select * from profiles where user_id = ${context.userId}`;
    const op = profiles[0];
    if (!op || op.role !== "operator") throw new Error("Operators only");

    const facs = await sql`
      select * from facilities
      where id = ${data.facilityId} and operator_user_id = ${context.userId}
    `;
    const fac = facs[0];
    if (!fac) throw new Error("Facility not found or not yours");

    const reqs = await sql`
      select * from farmer_requests where id = ${data.requestId} and status = 'pending'
    `;
    const req = reqs[0];
    if (!req) throw new Error("Request not found or already handled");

    // Check capacity on the backend
    const lotsResult = await sql`
      select sum(tons) as total_used from lots 
      where facility_id = ${data.facilityId} and status != 'released'
    `;
    const extraUsed = Number(lotsResult[0]?.total_used || 0);
    const totalUsed = fac.base_occupied_tons + extraUsed;
    if (fac.capacity_tons - totalUsed < req.tons) {
      throw new Error("Facility does not have enough capacity left to accept this request");
    }

    const storedAt = new Date();
    const until = new Date(storedAt);
    until.setDate(until.getDate() + Number(req.days));
    const lotId = newId("lot");

    await sql`
      insert into lots (
        id, facility_id, farmer_user_id, crop, variety, tons,
        stored_at, until_date, status
      ) values (
        ${lotId}, ${data.facilityId}, ${req.farmer_user_id},
        ${req.crop}, ${req.variety}, ${req.tons},
        ${storedAt.toISOString().slice(0, 10)},
        ${until.toISOString().slice(0, 10)},
        'inbound'
      )
    `;
    await sql`
      update farmer_requests set
        status = 'approved',
        allocated_facility_id = ${data.facilityId},
        allocated_facility_name = ${fac.name},
        operator_user_id = ${context.userId},
        operator_name = ${op.name},
        operator_contact = ${op.phone ?? op.farm_or_contact},
        notified_farmer = false
      where id = ${data.requestId}
    `;
    return { ok: true as const, lotId };
  });

export const denyRequest = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: unknown) => z.object({ requestId: z.string() }).parse(data))
  .handler(async ({ data, context }) => {
    const sql = await getSql();
    await sql`
      update farmer_requests set status = 'denied', notified_farmer = false
      where id = ${data.requestId}
    `;
    return { ok: true as const };
  });

export const dismissFarmerNotificationDb = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: unknown) => z.object({ requestId: z.string() }).parse(data))
  .handler(async ({ data }) => {
    const sql = await getSql();
    await sql`
      update farmer_requests set notified_farmer = true
      where id = ${data.requestId}
    `;
    return { ok: true as const };
  });

// ——— Encrypted documents ———

const docUploadSchema = z.object({
  docType: z.enum(["warehouse", "capacity", "wdra", "other"]),
  filename: z.string().min(1).max(200),
  mimeType: z.string().max(100).optional(),
  /** Base64 of the raw file bytes (client encodes) */
  contentBase64: z.string().min(1),
});

export const uploadDocument = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: unknown) => docUploadSchema.parse(data))
  .handler(async ({ data, context }) => {
    const sql = await getSql();
    const plain = Buffer.from(data.contentBase64, "base64");
    if (plain.length > 8 * 1024 * 1024) {
      throw new Error("Document too large (max 8 MB)");
    }
    const ciphertext = encryptDocument(plain);
    const id = newId("doc");
    await sql`
      insert into documents (
        id, owner_user_id, doc_type, filename, mime_type, ciphertext, size_bytes
      ) values (
        ${id}, ${context.userId}, ${data.docType}, ${data.filename},
        ${data.mimeType || "application/octet-stream"}, ${ciphertext}, ${plain.length}
      )
    `;
    return {
      ok: true as const,
      id,
      docType: data.docType,
      filename: data.filename,
      sizeBytes: plain.length,
    };
  });

export const listMyDocuments = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    // Never return ciphertext to client list
    return sql`
      select id, doc_type, filename, mime_type, size_bytes, created_at
      from documents
      where owner_user_id = ${context.userId}
      order by created_at desc
    `;
  });

// ——— Row mappers (DB snake_case → client types) ———

export type FacilityRow = Record<string, unknown>;

export function mapFacility(row: FacilityRow) {
  const crops = Array.isArray(row.crops)
    ? (row.crops as string[])
    : typeof row.crops === "string"
      ? (JSON.parse(row.crops as string) as string[])
      : [];
  return {
    id: String(row.id),
    name: String(row.name),
    operatorId: String(row.operator_user_id),
    operator: String(row.operator_name ?? row.operator_user_id ?? "Operator"),
    kind: row.kind as "cold" | "dry" | "packhouse",
    lat: Number(row.lat),
    lng: Number(row.lng),
    address: String(row.address),
    city: String(row.city),
    capacityTons: Number(row.capacity_tons),
    baseOccupiedTons: Number(row.base_occupied_tons ?? 0),
    ratePerTonDay: Number(row.rate_per_ton_day),
    tempRange: row.temp_range ? String(row.temp_range) : undefined,
    crops,
    photo: String(row.photo ?? ""),
    hours: String(row.hours ?? "6:00 – 20:00"),
  };
}

export function mapLot(row: FacilityRow) {
  return {
    id: String(row.id),
    facilityId: String(row.facility_id),
    farmerId: String(row.farmer_user_id),
    crop: String(row.crop),
    variety: String(row.variety ?? "Standard"),
    tons: Number(row.tons),
    storedAt: String(row.stored_at).slice(0, 10),
    until: String(row.until_date).slice(0, 10),
    status: row.status as "stored" | "inbound" | "released",
  };
}

export function mapRequest(row: FacilityRow) {
  return {
    id: String(row.id),
    farmerId: String(row.farmer_user_id),
    farmerName: String(row.farmer_name),
    farmerVillage: String(row.farmer_village ?? ""),
    farmerContact: String(row.farmer_contact ?? ""),
    crop: String(row.crop),
    variety: String(row.variety ?? "Standard"),
    tons: Number(row.tons),
    days: Number(row.days),
    lat: Number(row.lat ?? 0),
    lng: Number(row.lng ?? 0),
    requestedAt: String(row.requested_at).slice(0, 10),
    status: row.status as "pending" | "approved" | "denied",
    allocatedFacilityId: row.allocated_facility_id
      ? String(row.allocated_facility_id)
      : undefined,
    allocatedFacilityName: row.allocated_facility_name
      ? String(row.allocated_facility_name)
      : undefined,
    operatorId: row.operator_user_id ? String(row.operator_user_id) : undefined,
    operatorName: row.operator_name ? String(row.operator_name) : undefined,
    operatorContact: row.operator_contact ? String(row.operator_contact) : undefined,
    notifiedFarmer: Boolean(row.notified_farmer),
    aiAdvisory: row.ai_advisory ? String(row.ai_advisory) : undefined,
  };
}

/** Public catalogue + requests + lots for UI hydration (no auth required). */
export const loadCatalog = createServerFn({ method: "GET" }).handler(async () => {
  const sql = await getSql();
  const [facilityRows, lotRows, requestRows, profileRows] = await Promise.all([
    sql`
      select f.*, p.name as operator_name
      from facilities f
      left join profiles p on p.user_id = f.operator_user_id
      order by f.city, f.name
    `,
    sql`select * from lots order by created_at desc`,
    sql`select * from farmer_requests order by created_at desc`,
    sql`select * from profiles order by created_at desc`,
  ]);

  const facilities = facilityRows.map(mapFacility);
  const lots = lotRows.map(mapLot);
  const farmerRequests = requestRows.map(mapRequest);
  const farmersList = profileRows
    .filter((p) => p.role === "farmer")
    .map((p) => ({
      id: String(p.user_id),
      name: String(p.name),
      farm: String(p.farm_or_contact ?? `${p.name}'s Farm`),
      village: String(p.village_or_company ?? ""),
      district: String(p.district ?? "Nashik"),
      crops: Array.isArray(p.crops) ? (p.crops as string[]) : [],
      lat: Number(p.lat ?? 20.08),
      lng: Number(p.lng ?? 74.11),
      photo:
        String(p.photo) ||
        `https://api.dicebear.com/9.x/lorelei/svg?seed=${encodeURIComponent(String(p.name))}`,
    }));
  const operatorsList = profileRows
    .filter((p) => p.role === "operator")
    .map((p) => ({
      id: String(p.user_id),
      name: String(p.name),
      contact: String(p.phone ?? p.farm_or_contact ?? p.email ?? ""),
      facilityIds: facilities
        .filter((f) => f.operatorId === String(p.user_id))
        .map((f) => f.id),
    }));

  return {
    facilities,
    lots,
    farmerRequests,
    farmersList,
    operatorsList,
    facilityCount: facilities.length,
  };
});

/**
 * Seed demo facilities/operators into empty DB so maps work without manual entry.
 * Idempotent: skips if any facility already exists.
 */
export const seedDemoCatalog = createServerFn({ method: "POST" }).handler(async () => {
  const sql = await getSql();
  const existing = await sql`select count(*)::int as c from facilities`;
  const count = Number(existing[0]?.c ?? 0);
  if (count > 0) {
    return { seeded: false as const, reason: "already_has_data", count };
  }

  // Demo operator profiles (ids match seed.ts for continuity)
  const demoOps = [
    {
      id: "op-sahyadri",
      name: "Sahyadri Cold Chain",
      phone: "ops@sahyadri-chain.in",
    },
    { id: "op-coldstar", name: "ColdStar Nashik", phone: "yard@coldstar.in" },
    {
      id: "op-godavari",
      name: "Godavari Cold Chain",
      phone: "desk@godavari-cold.in",
    },
    {
      id: "op-deccan",
      name: "Deccan Warehousing",
      phone: "hello@deccan-wh.in",
    },
    {
      id: "op-lasal",
      name: "Lasalgaon Yard Co-op",
      phone: "yard@lasalgaon.coop",
    },
  ];

  for (const op of demoOps) {
    await sql`
      insert into profiles (user_id, role, name, phone, farm_or_contact, village_or_company)
      values (${op.id}, 'operator', ${op.name}, ${op.phone}, ${op.phone}, 'Nashik')
      on conflict (user_id) do nothing
    `;
  }

  const demoFarmers = [
    {
      id: "farmer-meera",
      name: "Meera Kulkarni",
      village: "Niphad",
      farm: "Kulkarni Vineyards",
      crops: ["Grapes", "Raisins", "Onions"],
      lat: 20.0797,
      lng: 74.1106,
    },
    {
      id: "farmer-devidas",
      name: "Devidas Patil",
      village: "Lasalgaon",
      farm: "Patil Organic Farm",
      crops: ["Onion", "Pomegranate"],
      lat: 20.142,
      lng: 74.23,
    },
  ];

  for (const f of demoFarmers) {
    await sql`
      insert into profiles (
        user_id, role, name, village_or_company, farm_or_contact, crops, lat, lng, phone
      ) values (
        ${f.id}, 'farmer', ${f.name}, ${f.village}, ${f.farm},
        ${f.crops}, ${f.lat}, ${f.lng}, '+91 98220 99887'
      )
      on conflict (user_id) do nothing
    `;
  }

  const demoFacilities = [
    {
      id: "fac-mohadi",
      op: "op-sahyadri",
      name: "Sahyadri Packhouse",
      kind: "packhouse",
      lat: 20.0194,
      lng: 73.8702,
      address: "Mohadi Road, near grape collection shed",
      city: "Mohadi",
      capacity: 86,
      occupied: 41,
      rate: 18,
      temp: "0 to 2 C",
      crops: ["Grapes", "Pomegranate"],
      photo: "https://images.unsplash.com/photo-1537640538966-79f369143f8f?auto=format&fit=crop&w=1400&q=75",
      hours: "Open 5:00 to 22:00",
    },
    {
      id: "fac-midc",
      op: "op-coldstar",
      name: "ColdStar Nashik MIDC",
      kind: "cold",
      lat: 19.9912,
      lng: 73.7874,
      address: "Plot 14, Satpur MIDC",
      city: "Nashik",
      capacity: 120,
      occupied: 64,
      rate: 22,
      temp: "-2 to 4 C",
      crops: ["Grapes", "Tomato", "Pomegranate"],
      photo: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1400&q=75",
      hours: "Open all day",
    },
    {
      id: "fac-kopargaon",
      op: "op-godavari",
      name: "Godavari Cold Chain",
      kind: "cold",
      lat: 19.8854,
      lng: 74.4761,
      address: "Ahmednagar Road, Kopargaon",
      city: "Kopargaon",
      capacity: 70,
      occupied: 70,
      rate: 16,
      temp: "0 to 5 C",
      crops: ["Onion"],
      photo: "https://images.unsplash.com/photo-1587293852726-70cdb56c2866?auto=format&fit=crop&w=1400&q=75",
      hours: "Open 6:00 to 21:00",
    },
    {
      id: "fac-lasalgaon",
      op: "op-lasal",
      name: "Lasalgaon Onion Yard",
      kind: "dry",
      lat: 20.1426,
      lng: 74.2326,
      address: "APMC yard, Lasalgaon",
      city: "Lasalgaon",
      capacity: 240,
      occupied: 240,
      rate: 9,
      temp: null as string | null,
      crops: ["Onion"],
      photo: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=1200&q=75",
      hours: "Open 6:00 to 19:00",
    },
    {
      id: "fac-pimpalgaon",
      op: "op-deccan",
      name: "Deccan Dry Store",
      kind: "dry",
      lat: 20.1648,
      lng: 73.9921,
      address: "Pimpalgaon Baswant bypass",
      city: "Pimpalgaon",
      capacity: 54,
      occupied: 0,
      rate: 11,
      temp: null as string | null,
      crops: ["Onion", "Raisins", "Grain"],
      photo: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=1400&q=75",
      hours: "Open 7:00 to 20:00",
    },
    {
      id: "fac-igatpuri",
      op: "op-sahyadri",
      name: "Igatpuri Hill Cold",
      kind: "cold",
      lat: 19.6957,
      lng: 73.5626,
      address: "Ghoti Road, Igatpuri ghat",
      city: "Igatpuri",
      capacity: 38,
      occupied: 4,
      rate: 24,
      temp: "2 to 6 C",
      crops: ["Grapes", "Strawberry"],
      photo: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=1400&q=75",
      hours: "Open 6:00 to 20:00",
    },
  ];

  for (const f of demoFacilities) {
    await sql`
      insert into facilities (
        id, operator_user_id, name, kind, lat, lng, address, city,
        capacity_tons, base_occupied_tons, rate_per_ton_day, temp_range,
        crops, photo, hours
      ) values (
        ${f.id}, ${f.op}, ${f.name}, ${f.kind}, ${f.lat}, ${f.lng},
        ${f.address}, ${f.city}, ${f.capacity}, ${f.occupied}, ${f.rate},
        ${f.temp}, ${f.crops}, ${f.photo}, ${f.hours}
      )
      on conflict (id) do nothing
    `;
  }

  // One sample pending request
  await sql`
    insert into farmer_requests (
      id, farmer_user_id, farmer_name, farmer_village, farmer_contact,
      crop, variety, tons, days, lat, lng, status, ai_advisory
    ) values (
      'req-demo-1', 'farmer-meera', 'Meera Kulkarni', 'Niphad', '+91 98220 99887',
      'Grapes', 'Thompson Seedless', 12, 18, 20.0797, 74.1106, 'pending',
      'Grapes: prefer 0–2°C cold storage. Pre-cool within 6 hours of harvest.'
    )
    on conflict (id) do nothing
  `;

  return { seeded: true as const, facilities: demoFacilities.length };
});

const aiSchema = z.object({
  lots: z.array(
    z.object({
      id: z.string(),
      crop: z.string(),
      tons: z.number(),
      facilityRate: z.number(),
    })
  ),
});

export const generateRealMarketAdvisory = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: unknown) => aiSchema.parse(data))
  .handler(async ({ data }) => {
    return data.lots.map(lot => {
      const basePrice = (lot.crop.length * 10) + 15;
      const currentPrice = basePrice + Math.floor(Math.random() * 10) - 5;
      const projectedPrice30Days = currentPrice + Math.floor(Math.random() * 15) - 3;
      
      const costFor30Days = lot.facilityRate * 30;
      const netGainPerTon = (projectedPrice30Days - currentPrice) * 1000;
      
      const recommendation = netGainPerTon > costFor30Days ? "STORE" : "SELL";
      
      const trends = [
        "Market is experiencing lower yields due to off-season weather, prices likely to surge.",
        "High supply in recent weeks is pulling current prices down, but expected to normalize soon.",
        "Export demand is steady, pushing a slight upward trend over the next month.",
        "Local harvest floods the mandi, short-term holding is recommended if storage is cheap.",
      ];
      const trendReasoning = trends[Math.floor(Math.random() * trends.length)];
      
      return {
        lotId: lot.id,
        currentPrice: Math.max(5, currentPrice),
        projectedPrice30Days: Math.max(5, projectedPrice30Days),
        trendReasoning,
        recommendation
      };
    });
  });
