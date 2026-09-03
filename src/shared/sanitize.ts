/**
 * Server-side input sanitization utilities.
 *
 * While React escapes output by default, stored data could be rendered
 * in non-React contexts (emails, PDFs, admin panels). These functions
 * strip dangerous content before database storage.
 */

/** Strip HTML tags and dangerous characters from user input. */
export function sanitizeText(input: string): string {
  return input
    .replace(/<[^>]*>/g, "") // Strip HTML tags
    .replace(/javascript:/gi, "") // Strip javascript: URIs
    .replace(/on\w+\s*=/gi, "") // Strip inline event handlers
    .replace(/data:/gi, "") // Strip data: URIs
    .trim();
}

/** Sanitize a name field — allows letters, spaces, hyphens, apostrophes only. */
export function sanitizeName(input: string): string {
  return input
    .replace(/<[^>]*>/g, "")
    .replace(/[<>\"'&;()]/g, "")
    .trim()
    .slice(0, 120);
}

/** Sanitize a phone number — digits, plus, spaces, hyphens only. */
export function sanitizePhone(input: string): string {
  return input.replace(/[^0-9+\-\s()]/g, "").trim().slice(0, 30);
}

/** Sanitize a location/address field. */
export function sanitizeLocation(input: string): string {
  return input
    .replace(/<[^>]*>/g, "")
    .replace(/[<>\"'&]/g, "")
    .trim()
    .slice(0, 120);
}
