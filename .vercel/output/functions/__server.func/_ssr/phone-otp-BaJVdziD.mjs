import { r as createServerFn } from "./ssr.mjs";
import { D as _enum, F as object, R as string } from "../_libs/@better-auth/core+[...].mjs";
import { t as createSsrRpc } from "./createSsrRpc-B2Izd0c7.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/phone-otp-BaJVdziD.js
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
/**
* Check server-side rate limit for auth actions (sign_in, sign_up).
* Returns null if allowed, or an error message string if blocked.
*/
var checkAuthRateLimit = createServerFn({ method: "POST" }).validator(object({
	phone: string().min(1),
	action: _enum(["sign_in", "sign_up"])
})).handler(createSsrRpc("94041c0419f9c8251c513329cb1e816ad3e249406ee662a445e3319306118f66"));
/**
* Record a failed auth attempt for rate limiting.
* Call this after a failed signIn.email or signUp.email.
*/
var recordAuthAttempt = createServerFn({ method: "POST" }).validator(object({
	phone: string().min(1),
	action: _enum(["sign_in", "sign_up"])
})).handler(createSsrRpc("3ea1702cdfdbc8df3a0843a59cccfff9a08a62aeb84da4c63bb5f7740f05e9bf"));
/**
* Reset rate limit for a phone + action (call after successful auth).
*/
var resetAuthRateLimit = createServerFn({ method: "POST" }).validator(object({
	phone: string().min(1),
	action: _enum(["sign_in", "sign_up"])
})).handler(createSsrRpc("f49b1e155d7ba24f766d59109e2b76931323e13a663ff87c1cf0971347d24c26"));
createServerFn({ method: "POST" }).validator(object({
	phone: string().min(1),
	purpose: _enum([
		"register",
		"login",
		"reset"
	])
})).handler(createSsrRpc("72fbfd7c9e1ee41959e7b6876658ec032d62ccfbb7be10d578c1ffdba37ebe28"));
createServerFn({ method: "POST" }).validator(object({
	phone: string().min(1),
	code: string().length(OTP_LENGTH),
	purpose: _enum([
		"register",
		"login",
		"reset"
	])
})).handler(createSsrRpc("5d69b0a14a674d3f0ebcee5f149b05debb7005e4a0ed4b82aeba9cbdb67d3713"));
createServerFn({ method: "GET" }).validator(object({ phone: string().min(1) })).handler(createSsrRpc("1659962829fe36fc477ba64821f05151ecc160f9f9be651e0ed6115e80ae3b2d"));
/**
* Log an auth event to the audit_log table.
*/
var logAuditEvent = createServerFn({ method: "POST" }).validator(object({
	event: string(),
	phone: string().optional(),
	userId: string().optional(),
	detail: string().optional()
})).handler(createSsrRpc("f3c8b3f46f41925fbf92d78a81d154b8b5fa311dfb1fcd23dc9d89370a3581c2"));
createServerFn({ method: "POST" }).validator(object({
	phone: string().min(1),
	code: string().length(OTP_LENGTH),
	newPassword: string().min(8)
})).handler(createSsrRpc("96526821f614fe11dfe6189d013dfd4f37886822fd54e0dec77fe5392e78cc46"));
//#endregion
export { checkAuthRateLimit, logAuditEvent, recordAuthAttempt, resetAuthRateLimit };
