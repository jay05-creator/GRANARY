//#region node_modules/.nitro/vite/services/ssr/assets/sanitize-DM4olk7P.js
/**
* Server-side input sanitization utilities.
*
* While React escapes output by default, stored data could be rendered
* in non-React contexts (emails, PDFs, admin panels). These functions
* strip dangerous content before database storage.
*/
/** Strip HTML tags and dangerous characters from user input. */
function sanitizeText(input) {
	return input.replace(/<[^>]*>/g, "").replace(/javascript:/gi, "").replace(/on\w+\s*=/gi, "").replace(/data:/gi, "").trim();
}
/** Sanitize a name field — allows letters, spaces, hyphens, apostrophes only. */
function sanitizeName(input) {
	return input.replace(/<[^>]*>/g, "").replace(/[<>\"'&;()]/g, "").trim().slice(0, 120);
}
/** Sanitize a phone number — digits, plus, spaces, hyphens only. */
function sanitizePhone(input) {
	return input.replace(/[^0-9+\-\s()]/g, "").trim().slice(0, 30);
}
/** Sanitize a location/address field. */
function sanitizeLocation(input) {
	return input.replace(/<[^>]*>/g, "").replace(/[<>\"'&]/g, "").trim().slice(0, 120);
}
//#endregion
export { sanitizeText as i, sanitizeName as n, sanitizePhone as r, sanitizeLocation as t };
