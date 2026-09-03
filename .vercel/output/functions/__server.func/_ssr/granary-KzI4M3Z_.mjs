import { r as createServerFn } from "./ssr.mjs";
import { D as _enum, F as object, M as literal, P as number, R as string, k as array } from "../_libs/@better-auth/core+[...].mjs";
import { t as authMiddleware } from "./middleware-DaUBGgEK.mjs";
import { t as createSsrRpc } from "./createSsrRpc-B2Izd0c7.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/granary-KzI4M3Z_.js
/**
* Server functions for Granary: profiles, facilities, storage requests,
* encrypted documents, and rule-based AI advisory.
*/
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
var upsertProfile = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => profileSchema.parse(data)).handler(createSsrRpc("71b9e90e4f609bd9e8acbf79db8287bda54c7711da5e466f76afbe22db4bc6f5"));
var getMyProfile = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("4901b00bc632b4e4740daa9c2a7b6d8fb59fa28b6ffc089ef1a83d2cf08ecf0b"));
var updateMyProfile = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => object({
	name: string().min(1).max(120).optional(),
	phone: string().max(30).optional(),
	villageOrCompany: string().max(120).optional(),
	farmOrContact: string().max(120).optional(),
	crops: array(string()).optional()
}).parse(data)).handler(createSsrRpc("8984b93ab13ccf047e30ef05f15efb6dbee8111e97d0ed3ebb53177d3ee39cab"));
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
createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("47cd0e94deab0c7d7d0b01f140d7e17f6c758b43568e157975fd4c3452a369ae"));
createServerFn({ method: "GET" }).handler(createSsrRpc("30e672518a4f66f2f0629aefe15712b65f0a354e307001739714c988108893e9"));
var addFacility = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => facilitySchema.parse(data)).handler(createSsrRpc("69a8f171ed172e32d4dfe8f881d33b886f578ffc3ee358a5380ca9ecee5dd6fa"));
var requestSchema = object({
	crop: string().min(1).max(80),
	variety: string().max(80).optional(),
	tons: number().positive(),
	days: number().int().positive().max(365),
	lat: number().optional(),
	lng: number().optional()
});
var createStorageRequest = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => requestSchema.parse(data)).handler(createSsrRpc("48be81cd10b874874a2b92b619197045b2d7ce716ab5a1af6f8f6cd9f721cb20"));
createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("fa0ad686b2af18ba7639a6bdd3d4526264853bb8e080c0cb8e31d7d3bb3a687d"));
var allocateRequest = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => object({
	requestId: string(),
	facilityId: string()
}).parse(data)).handler(createSsrRpc("ed9448ea65e454387d407de9e3ade371243c60481627f6e32fa9d92b180f5adb"));
var denyRequest = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => object({ requestId: string() }).parse(data)).handler(createSsrRpc("76eb0ea1aa441bc65be162ca2373be16d6c914f61ba8778ac8a8b3cda9353d38"));
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
var uploadDocument = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => docUploadSchema.parse(data)).handler(createSsrRpc("448049ce34f841996ba110ad21511ae93cb79de8e8a40c46d740c77a5285e644"));
createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("03fe319684b1dc86ba15e0f74f84b45a872d54285812a42a0c0dd1f8d9c15926"));
/** Public catalogue + requests + lots for UI hydration (no auth required). */
var loadCatalog = createServerFn({ method: "GET" }).handler(createSsrRpc("16c090bef2fe538a40f3de5c9e80f70c65ed9a83be998e2e541aa392d4ea780d"));
/**
* Seed demo facilities/operators into empty DB so maps work without manual entry.
* Idempotent: skips if any facility already exists.
*/
var seedDemoCatalog = createServerFn({ method: "POST" }).handler(createSsrRpc("7e22ca1c1642b0e80bbedacc67a55285988659b4004a49954b791dcb2ecbbbd7"));
//#endregion
export { addFacility, allocateRequest, createStorageRequest, denyRequest, getMyProfile, loadCatalog, seedDemoCatalog, updateMyProfile, uploadDocument, upsertProfile };
