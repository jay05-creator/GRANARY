import { r as createServerFn } from "./ssr.mjs";
import { D as _enum, F as object, M as literal, P as number, R as string, k as array } from "../_libs/@better-auth/core+[...].mjs";
import { r as getSql } from "./db-CpkKAdtF.mjs";
import { i as sanitizeText, n as sanitizeName, r as sanitizePhone, t as sanitizeLocation } from "./sanitize-DM4olk7P.mjs";
import { t as authMiddleware } from "./middleware-DaUBGgEK.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
import { createCipheriv, randomBytes, scryptSync } from "node:crypto";
//#region node_modules/.nitro/vite/services/ssr/assets/granary-B7A-79hx.js
/**
* Server-only AES-256-GCM helpers for sensitive documents.
* Key from DOCUMENT_ENCRYPTION_KEY (32-byte hex or base64) or a derived
* fallback for preview (NOT for real production secrets).
*/
var ALGO = "aes-256-gcm";
var IV_LEN = 12;
function getKey() {
	const raw = process.env.DOCUMENT_ENCRYPTION_KEY?.trim();
	if (raw) {
		if (/^[0-9a-fA-F]{64}$/.test(raw)) return Buffer.from(raw, "hex");
		try {
			const b = Buffer.from(raw, "base64");
			if (b.length === 32) return b;
		} catch {}
		return scryptSync(raw, "granary-doc-salt", 32);
	}
	const g = globalThis;
	g.__docKey__ ??= randomBytes(32);
	return g.__docKey__;
}
/** Encrypt plaintext buffer → base64(iv || tag || ciphertext) */
function encryptDocument(plain) {
	const key = getKey();
	const iv = randomBytes(IV_LEN);
	const cipher = createCipheriv(ALGO, key, iv);
	const enc = Buffer.concat([cipher.update(plain), cipher.final()]);
	const tag = cipher.getAuthTag();
	return Buffer.concat([
		iv,
		tag,
		enc
	]).toString("base64");
}
/**
* Server functions for Granary: profiles, facilities, storage requests,
* encrypted documents, and rule-based AI advisory.
*/
function newId(prefix) {
	return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
/** Simple rule-based advisory (no external LLM required). */
function generateAiAdvisory(input) {
	const crop = input.crop.toLowerCase();
	const tips = [];
	if (crop.includes("grape") || crop.includes("angur")) {
		tips.push("Grapes (Nashik region): prefer cold storage at 0–2°C with 90–95% RH. Target relative humidity high to reduce stem drying.");
		tips.push("Pre-cool within 4–6 hours of harvest. Avoid ethylene sources nearby.");
		if (input.days > 21) tips.push("Storage beyond 3 weeks increases risk of berry shrivel — plan release or CA storage.");
	} else if (crop.includes("onion")) {
		tips.push("Onion: dry storage 0–2°C or ventilated ambient with low humidity (65–70%). Cure fully before inbound.");
		tips.push("Monitor for neck rot; do not stack wet bags.");
	} else if (crop.includes("tomato") || crop.includes("tomato")) tips.push("Tomato: 10–13°C cold room preferred. Avoid <10°C (chilling injury).");
	else if (crop.includes("potato")) tips.push("Potato: 4–7°C, high humidity, dark. Sprout inhibitors if long-term.");
	else tips.push(`General: match facility temp/humidity to ${input.crop}. Request operator sensor logs on arrival.`);
	tips.push(`Volume ${input.tons} t for ${input.days} days ≈ estimated cost band depends on rate (₹/t/day). Confirm current occupancy before locking.`);
	tips.push("WDRA-registered yards preferred for negotiable warehouse receipts and bank linkage.");
	if (input.lat && input.lng) tips.push(`Location ~${input.lat.toFixed(2)}, ${input.lng.toFixed(2)}: prioritise yards within 40 km to cut transit heat load.`);
	tips.push("AI note: this is a rule-based advisory for demo/production baseline. Connect an LLM API later for market-price & weather-aware recommendations.");
	return tips.join("\n\n");
}
var profileSchema = object({
	role: _enum(["farmer", "operator"]),
	name: string().min(1).max(120),
	phone: string().max(30).optional(),
	email: string().email().optional().or(literal("")),
	villageOrCompany: string().max(120).optional(),
	farmOrContact: string().max(120).optional(),
	crops: array(string()).optional(),
	lat: number().optional(),
	lng: number().optional()
});
var upsertProfile_createServerFn_handler = createServerRpc({
	id: "71b9e90e4f609bd9e8acbf79db8287bda54c7711da5e466f76afbe22db4bc6f5",
	name: "upsertProfile",
	filename: "src/lib/server/granary.ts"
}, (opts) => upsertProfile.__executeServer(opts));
var upsertProfile = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => profileSchema.parse(data)).handler(upsertProfile_createServerFn_handler, async ({ data, context }) => {
	const sql = await getSql();
	const userId = context.userId;
	const crops = data.crops ?? [];
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
      on conflict (user_id) do update set
        role = excluded.role,
        name = excluded.name,
        phone = excluded.phone,
        email = excluded.email,
        village_or_company = excluded.village_or_company,
        farm_or_contact = excluded.farm_or_contact,
        crops = excluded.crops,
        lat = excluded.lat,
        lng = excluded.lng,
        updated_at = now()
    `;
	return {
		ok: true,
		userId
	};
});
var getMyProfile_createServerFn_handler = createServerRpc({
	id: "4901b00bc632b4e4740daa9c2a7b6d8fb59fa28b6ffc089ef1a83d2cf08ecf0b",
	name: "getMyProfile",
	filename: "src/lib/server/granary.ts"
}, (opts) => getMyProfile.__executeServer(opts));
var getMyProfile = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getMyProfile_createServerFn_handler, async ({ context }) => {
	return (await (await getSql())`
      select * from profiles where user_id = ${context.userId} limit 1
    `)[0] ?? null;
});
var updateMyProfile_createServerFn_handler = createServerRpc({
	id: "8984b93ab13ccf047e30ef05f15efb6dbee8111e97d0ed3ebb53177d3ee39cab",
	name: "updateMyProfile",
	filename: "src/lib/server/granary.ts"
}, (opts) => updateMyProfile.__executeServer(opts));
var updateMyProfile = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => object({
	name: string().min(1).max(120).optional(),
	phone: string().max(30).optional(),
	villageOrCompany: string().max(120).optional(),
	farmOrContact: string().max(120).optional(),
	crops: array(string()).optional()
}).parse(data)).handler(updateMyProfile_createServerFn_handler, async ({ data, context }) => {
	const sql = await getSql();
	const name = data.name ? sanitizeName(data.name) : void 0;
	const phone = data.phone ? sanitizePhone(data.phone) : void 0;
	const village = data.villageOrCompany ? sanitizeLocation(data.villageOrCompany) : void 0;
	const farm = data.farmOrContact ? sanitizeText(data.farmOrContact) : void 0;
	const sets = [];
	const vals = [];
	let idx = 1;
	if (name !== void 0) {
		sets.push(`name = $${idx++}`);
		vals.push(name);
	}
	if (phone !== void 0) {
		sets.push(`phone = $${idx++}`);
		vals.push(phone);
	}
	if (village !== void 0) {
		sets.push(`village_or_company = $${idx++}`);
		vals.push(village);
	}
	if (farm !== void 0) {
		sets.push(`farm_or_contact = $${idx++}`);
		vals.push(farm);
	}
	if (data.crops !== void 0) {
		sets.push(`crops = $${idx++}`);
		vals.push(data.crops);
	}
	sets.push(`updated_at = now()`);
	if (sets.length > 1) await sql.query(`UPDATE profiles SET ${sets.join(", ")} WHERE user_id = $${idx}`, [...vals, context.userId]);
	return { ok: true };
});
var facilitySchema = object({
	name: string().min(1).max(160),
	city: string().min(1).max(80),
	address: string().min(1).max(240),
	capacityTons: number().positive(),
	ratePerTonDay: number().min(0),
	kind: _enum([
		"cold",
		"dry",
		"packhouse"
	]),
	tempRange: string().max(40).optional(),
	crops: array(string()).default([]),
	lat: number().optional(),
	lng: number().optional(),
	hours: string().max(60).optional()
});
var listMyFacilities_createServerFn_handler = createServerRpc({
	id: "47cd0e94deab0c7d7d0b01f140d7e17f6c758b43568e157975fd4c3452a369ae",
	name: "listMyFacilities",
	filename: "src/lib/server/granary.ts"
}, (opts) => listMyFacilities.__executeServer(opts));
var listMyFacilities = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listMyFacilities_createServerFn_handler, async ({ context }) => {
	return (await getSql())`
      select * from facilities
      where operator_user_id = ${context.userId}
      order by created_at desc
    `;
});
var listAllFacilities_createServerFn_handler = createServerRpc({
	id: "30e672518a4f66f2f0629aefe15712b65f0a354e307001739714c988108893e9",
	name: "listAllFacilities",
	filename: "src/lib/server/granary.ts"
}, (opts) => listAllFacilities.__executeServer(opts));
var listAllFacilities = createServerFn({ method: "GET" }).handler(listAllFacilities_createServerFn_handler, async () => {
	return (await getSql())`
      select f.*, p.name as operator_name, p.phone as operator_phone
      from facilities f
      left join profiles p on p.user_id = f.operator_user_id
      order by f.city, f.name
    `;
});
var addFacility_createServerFn_handler = createServerRpc({
	id: "69a8f171ed172e32d4dfe8f881d33b886f578ffc3ee358a5380ca9ecee5dd6fa",
	name: "addFacility",
	filename: "src/lib/server/granary.ts"
}, (opts) => addFacility.__executeServer(opts));
var addFacility = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => facilitySchema.parse(data)).handler(addFacility_createServerFn_handler, async ({ data, context }) => {
	const sql = await getSql();
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
	if (!profiles[0] || profiles[0].role !== "operator") throw new Error("Only operators can list storage. Complete operator registration first.");
	const id = newId("fac");
	const lat = data.lat ?? 20 + Math.random() * .3;
	const lng = data.lng ?? 73.8 + Math.random() * .4;
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
	return (await sql`select * from facilities where id = ${id}`)[0];
});
var requestSchema = object({
	crop: string().min(1).max(80),
	variety: string().max(80).optional(),
	tons: number().positive(),
	days: number().int().positive().max(365),
	lat: number().optional(),
	lng: number().optional()
});
var createStorageRequest_createServerFn_handler = createServerRpc({
	id: "48be81cd10b874874a2b92b619197045b2d7ce716ab5a1af6f8f6cd9f721cb20",
	name: "createStorageRequest",
	filename: "src/lib/server/granary.ts"
}, (opts) => createStorageRequest.__executeServer(opts));
var createStorageRequest = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => requestSchema.parse(data)).handler(createStorageRequest_createServerFn_handler, async ({ data, context }) => {
	const sql = await getSql();
	let profiles = await sql`select * from profiles where user_id = ${context.userId}`;
	let p = profiles[0];
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
	if (!p || p.role !== "farmer") throw new Error("Only farmers can create storage requests. Register as a farmer first.");
	const advisory = generateAiAdvisory({
		crop: data.crop,
		variety: data.variety || "Standard",
		tons: data.tons,
		days: data.days,
		lat: data.lat ?? p.lat,
		lng: data.lng ?? p.lng
	});
	const id = newId("req");
	await sql`
      insert into farmer_requests (
        id, farmer_user_id, farmer_name, farmer_village, farmer_contact,
        crop, variety, tons, days, lat, lng, status, ai_advisory
      ) values (
        ${id}, ${context.userId}, ${p.name},
        ${p.village_or_company}, ${p.phone},
        ${data.crop}, ${data.variety || "Standard"}, ${data.tons}, ${data.days},
        ${data.lat ?? p.lat}, ${data.lng ?? p.lng},
        'pending', ${advisory}
      )
    `;
	return {
		request: (await sql`select * from farmer_requests where id = ${id}`)[0],
		advisory
	};
});
var listPendingRequests_createServerFn_handler = createServerRpc({
	id: "fa0ad686b2af18ba7639a6bdd3d4526264853bb8e080c0cb8e31d7d3bb3a687d",
	name: "listPendingRequests",
	filename: "src/lib/server/granary.ts"
}, (opts) => listPendingRequests.__executeServer(opts));
var listPendingRequests = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listPendingRequests_createServerFn_handler, async ({ context }) => {
	const sql = await getSql();
	if ((await sql`select role from profiles where user_id = ${context.userId}`)[0]?.role === "operator") return sql`
        select * from farmer_requests
        where status = 'pending'
        order by requested_at desc, created_at desc
      `;
	return sql`
      select * from farmer_requests
      where farmer_user_id = ${context.userId}
      order by created_at desc
    `;
});
var allocateRequest_createServerFn_handler = createServerRpc({
	id: "ed9448ea65e454387d407de9e3ade371243c60481627f6e32fa9d92b180f5adb",
	name: "allocateRequest",
	filename: "src/lib/server/granary.ts"
}, (opts) => allocateRequest.__executeServer(opts));
var allocateRequest = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => object({
	requestId: string(),
	facilityId: string()
}).parse(data)).handler(allocateRequest_createServerFn_handler, async ({ data, context }) => {
	const sql = await getSql();
	const op = (await sql`select * from profiles where user_id = ${context.userId}`)[0];
	if (!op || op.role !== "operator") throw new Error("Operators only");
	const fac = (await sql`
      select * from facilities
      where id = ${data.facilityId} and operator_user_id = ${context.userId}
    `)[0];
	if (!fac) throw new Error("Facility not found or not yours");
	const req = (await sql`
      select * from farmer_requests where id = ${data.requestId} and status = 'pending'
    `)[0];
	if (!req) throw new Error("Request not found or already handled");
	const storedAt = /* @__PURE__ */ new Date();
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
	return {
		ok: true,
		lotId
	};
});
var denyRequest_createServerFn_handler = createServerRpc({
	id: "76eb0ea1aa441bc65be162ca2373be16d6c914f61ba8778ac8a8b3cda9353d38",
	name: "denyRequest",
	filename: "src/lib/server/granary.ts"
}, (opts) => denyRequest.__executeServer(opts));
var denyRequest = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => object({ requestId: string() }).parse(data)).handler(denyRequest_createServerFn_handler, async ({ data, context }) => {
	await (await getSql())`
      update farmer_requests set status = 'denied', notified_farmer = false
      where id = ${data.requestId}
    `;
	return { ok: true };
});
var docUploadSchema = object({
	docType: _enum([
		"warehouse",
		"capacity",
		"wdra",
		"other"
	]),
	filename: string().min(1).max(200),
	mimeType: string().max(100).optional(),
	/** Base64 of the raw file bytes (client encodes) */
	contentBase64: string().min(1)
});
var uploadDocument_createServerFn_handler = createServerRpc({
	id: "448049ce34f841996ba110ad21511ae93cb79de8e8a40c46d740c77a5285e644",
	name: "uploadDocument",
	filename: "src/lib/server/granary.ts"
}, (opts) => uploadDocument.__executeServer(opts));
var uploadDocument = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => docUploadSchema.parse(data)).handler(uploadDocument_createServerFn_handler, async ({ data, context }) => {
	const sql = await getSql();
	const plain = Buffer.from(data.contentBase64, "base64");
	if (plain.length > 8388608) throw new Error("Document too large (max 8 MB)");
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
		ok: true,
		id,
		docType: data.docType,
		filename: data.filename,
		sizeBytes: plain.length
	};
});
var listMyDocuments_createServerFn_handler = createServerRpc({
	id: "03fe319684b1dc86ba15e0f74f84b45a872d54285812a42a0c0dd1f8d9c15926",
	name: "listMyDocuments",
	filename: "src/lib/server/granary.ts"
}, (opts) => listMyDocuments.__executeServer(opts));
var listMyDocuments = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listMyDocuments_createServerFn_handler, async ({ context }) => {
	return (await getSql())`
      select id, doc_type, filename, mime_type, size_bytes, created_at
      from documents
      where owner_user_id = ${context.userId}
      order by created_at desc
    `;
});
function mapFacility(row) {
	const crops = Array.isArray(row.crops) ? row.crops : typeof row.crops === "string" ? JSON.parse(row.crops) : [];
	return {
		id: String(row.id),
		name: String(row.name),
		operatorId: String(row.operator_user_id),
		operator: String(row.operator_name ?? row.operator_user_id ?? "Operator"),
		kind: row.kind,
		lat: Number(row.lat),
		lng: Number(row.lng),
		address: String(row.address),
		city: String(row.city),
		capacityTons: Number(row.capacity_tons),
		baseOccupiedTons: Number(row.base_occupied_tons ?? 0),
		ratePerTonDay: Number(row.rate_per_ton_day),
		tempRange: row.temp_range ? String(row.temp_range) : void 0,
		crops,
		photo: String(row.photo ?? ""),
		hours: String(row.hours ?? "6:00 – 20:00")
	};
}
function mapLot(row) {
	return {
		id: String(row.id),
		facilityId: String(row.facility_id),
		farmerId: String(row.farmer_user_id),
		crop: String(row.crop),
		variety: String(row.variety ?? "Standard"),
		tons: Number(row.tons),
		storedAt: String(row.stored_at).slice(0, 10),
		until: String(row.until_date).slice(0, 10),
		status: row.status
	};
}
function mapRequest(row) {
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
		status: row.status,
		allocatedFacilityId: row.allocated_facility_id ? String(row.allocated_facility_id) : void 0,
		allocatedFacilityName: row.allocated_facility_name ? String(row.allocated_facility_name) : void 0,
		operatorId: row.operator_user_id ? String(row.operator_user_id) : void 0,
		operatorName: row.operator_name ? String(row.operator_name) : void 0,
		operatorContact: row.operator_contact ? String(row.operator_contact) : void 0,
		notifiedFarmer: Boolean(row.notified_farmer),
		aiAdvisory: row.ai_advisory ? String(row.ai_advisory) : void 0
	};
}
var loadCatalog_createServerFn_handler = createServerRpc({
	id: "16c090bef2fe538a40f3de5c9e80f70c65ed9a83be998e2e541aa392d4ea780d",
	name: "loadCatalog",
	filename: "src/lib/server/granary.ts"
}, (opts) => loadCatalog.__executeServer(opts));
var loadCatalog = createServerFn({ method: "GET" }).handler(loadCatalog_createServerFn_handler, async () => {
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
		sql`select * from profiles order by created_at desc`
	]);
	const facilities = facilityRows.map(mapFacility);
	return {
		facilities,
		lots: lotRows.map(mapLot),
		farmerRequests: requestRows.map(mapRequest),
		farmersList: profileRows.filter((p) => p.role === "farmer").map((p) => ({
			id: String(p.user_id),
			name: String(p.name),
			farm: String(p.farm_or_contact ?? `${p.name}'s Farm`),
			village: String(p.village_or_company ?? ""),
			district: String(p.district ?? "Nashik"),
			crops: Array.isArray(p.crops) ? p.crops : [],
			lat: Number(p.lat ?? 20.08),
			lng: Number(p.lng ?? 74.11),
			photo: String(p.photo) || `https://api.dicebear.com/9.x/lorelei/svg?seed=${encodeURIComponent(String(p.name))}`
		})),
		operatorsList: profileRows.filter((p) => p.role === "operator").map((p) => ({
			id: String(p.user_id),
			name: String(p.name),
			contact: String(p.phone ?? p.farm_or_contact ?? p.email ?? ""),
			facilityIds: facilities.filter((f) => f.operatorId === String(p.user_id)).map((f) => f.id)
		})),
		facilityCount: facilities.length
	};
});
var seedDemoCatalog_createServerFn_handler = createServerRpc({
	id: "7e22ca1c1642b0e80bbedacc67a55285988659b4004a49954b791dcb2ecbbbd7",
	name: "seedDemoCatalog",
	filename: "src/lib/server/granary.ts"
}, (opts) => seedDemoCatalog.__executeServer(opts));
var seedDemoCatalog = createServerFn({ method: "POST" }).handler(seedDemoCatalog_createServerFn_handler, async () => {
	const sql = await getSql();
	const existing = await sql`select count(*)::int as c from facilities`;
	const count = Number(existing[0]?.c ?? 0);
	if (count > 0) return {
		seeded: false,
		reason: "already_has_data",
		count
	};
	for (const op of [
		{
			id: "op-sahyadri",
			name: "Sahyadri Cold Chain",
			phone: "ops@sahyadri-chain.in"
		},
		{
			id: "op-coldstar",
			name: "ColdStar Nashik",
			phone: "yard@coldstar.in"
		},
		{
			id: "op-godavari",
			name: "Godavari Cold Chain",
			phone: "desk@godavari-cold.in"
		},
		{
			id: "op-deccan",
			name: "Deccan Warehousing",
			phone: "hello@deccan-wh.in"
		},
		{
			id: "op-lasal",
			name: "Lasalgaon Yard Co-op",
			phone: "yard@lasalgaon.coop"
		}
	]) await sql`
      insert into profiles (user_id, role, name, phone, farm_or_contact, village_or_company)
      values (${op.id}, 'operator', ${op.name}, ${op.phone}, ${op.phone}, 'Nashik')
      on conflict (user_id) do nothing
    `;
	for (const f of [{
		id: "farmer-meera",
		name: "Meera Kulkarni",
		village: "Niphad",
		farm: "Kulkarni Vineyards",
		crops: [
			"Grapes",
			"Raisins",
			"Onions"
		],
		lat: 20.0797,
		lng: 74.1106
	}, {
		id: "farmer-devidas",
		name: "Devidas Patil",
		village: "Lasalgaon",
		farm: "Patil Organic Farm",
		crops: ["Onion", "Pomegranate"],
		lat: 20.142,
		lng: 74.23
	}]) await sql`
      insert into profiles (
        user_id, role, name, village_or_company, farm_or_contact, crops, lat, lng, phone
      ) values (
        ${f.id}, 'farmer', ${f.name}, ${f.village}, ${f.farm},
        ${f.crops}, ${f.lat}, ${f.lng}, '+91 98220 99887'
      )
      on conflict (user_id) do nothing
    `;
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
			hours: "Open 5:00 to 22:00"
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
			crops: [
				"Grapes",
				"Tomato",
				"Pomegranate"
			],
			photo: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1400&q=75",
			hours: "Open all day"
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
			hours: "Open 6:00 to 21:00"
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
			temp: null,
			crops: ["Onion"],
			photo: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=1200&q=75",
			hours: "Open 6:00 to 19:00"
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
			temp: null,
			crops: [
				"Onion",
				"Raisins",
				"Grain"
			],
			photo: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=1400&q=75",
			hours: "Open 7:00 to 20:00"
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
			hours: "Open 6:00 to 20:00"
		}
	];
	for (const f of demoFacilities) await sql`
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
	return {
		seeded: true,
		facilities: demoFacilities.length
	};
});
//#endregion
export { addFacility_createServerFn_handler, allocateRequest_createServerFn_handler, createStorageRequest_createServerFn_handler, denyRequest_createServerFn_handler, getMyProfile_createServerFn_handler, listAllFacilities_createServerFn_handler, listMyDocuments_createServerFn_handler, listMyFacilities_createServerFn_handler, listPendingRequests_createServerFn_handler, loadCatalog_createServerFn_handler, seedDemoCatalog_createServerFn_handler, updateMyProfile_createServerFn_handler, uploadDocument_createServerFn_handler, upsertProfile_createServerFn_handler };
