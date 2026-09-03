//#region node_modules/.nitro/vite/services/ssr/assets/phone-H0iOOiqk.js
/**
* Phone number validation and normalization utilities.
*
* Normalizes to E.164 format (+<country><number>) for consistent storage
* and comparison. Indian numbers default to +91 when no country code is given.
*/
var DEFAULT_COUNTRY_CODE = "91";
/** Strip everything except digits and leading +. */
function rawDigits(phone) {
	return phone.replace(/[^\d+]/g, "");
}
/**
* Normalize a phone number to E.164 format.
*
* Handles:
*   - "9823012345"         → "+919823012345"  (10-digit Indian)
*   - "09823012345"        → "+919823012345"  (leading 0)
*   - "+91 98230 12345"    → "+919823012345"  (already E.164, spaces)
*   - "919823012345"       → "+919823012345"  (no +, has country code)
*
* Returns null if the number cannot be normalized (too short/long).
*/
function normalizePhone(phone) {
	let digits = rawDigits(phone);
	if (digits.startsWith("+")) digits = digits.slice(1);
	if (digits.startsWith("0")) digits = digits.slice(1);
	if (digits.length === 10) digits = DEFAULT_COUNTRY_CODE + digits;
	else if (digits.length === 12 && digits.startsWith(DEFAULT_COUNTRY_CODE)) {} else if (digits.length > 12 || digits.length < 10) return null;
	return `+${digits}`;
}
/**
* Validate that a phone number is a valid 10-digit Indian mobile number.
* Returns an error message string if invalid, null if valid.
*/
function validatePhone(phone) {
	const normalized = normalizePhone(phone);
	if (!normalized) return "Phone number must be 10 to 12 digits.";
	const national = normalized.slice(3);
	if (national.length !== 10) return "Phone number must be exactly 10 digits.";
	if (!/^[6-9]/.test(national)) return "Indian mobile numbers must start with 6, 7, 8, or 9.";
	return null;
}
/**
* Validate password strength.
* Returns an error message string if weak, null if strong enough.
*/
function validatePassword(password) {
	if (password.length < 8) return "Password must be at least 8 characters long.";
	if (!/[A-Z]/.test(password)) return "Password must contain at least one uppercase letter.";
	if (!/[a-z]/.test(password)) return "Password must contain at least one lowercase letter.";
	if (!/[0-9]/.test(password)) return "Password must contain at least one number.";
	return null;
}
/**
* Derive a synthetic email from a phone number for Better Auth's
* email/password plugin. The auth DB requires a unique email, so we map
* phone numbers to `digits@granary.local` internally.
*
* IMPORTANT: This domain must never receive real emails. Better Auth should
* NOT be configured to send verification emails when using phone-based auth.
*/
function phoneToSyntheticEmail(phone) {
	const normalized = normalizePhone(phone);
	if (!normalized) return `${phone.replace(/\D/g, "")}@granary.local`;
	return `${normalized.replace("+", "")}@granary.local`;
}
/**
* Rate-limit key for auth attempts (phone-based).
* Returns a key suitable for a client-side throttle map.
*/
function authRateLimitKey(phone) {
	return normalizePhone(phone) ?? phone.replace(/\D/g, "");
}
//#endregion
export { validatePhone as a, validatePassword as i, normalizePhone as n, phoneToSyntheticEmail as r, authRateLimitKey as t };
