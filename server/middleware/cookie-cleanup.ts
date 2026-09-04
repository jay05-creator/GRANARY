/**
 * Cookie cleanup middleware — detects oversized Cookie headers (which cause
 * Vercel 494 REQUEST_HEADER_TOO_LARGE) and responds with Set-Cookie headers
 * that expire the stale auth cookies, then redirects the browser back.
 *
 * This happens when the auth secret changes (e.g. serverless cold starts
 * before BETTER_AUTH_SECRET was pinned) and old session cookies accumulate.
 * After one redirect the browser drops them and everything works normally.
 *
 * Auto-registered by Nitro via serverDir: "./server".
 */

const AUTH_COOKIE_NAMES = [
  "__Host-grok-auth.session_token",
  "__Host-grok-auth.session_data",
  "__Host-grok-auth.account_data",
  "__Host-grok-auth.dont_remember",
];

const MAX_COOKIE_BYTES = 8000;

export default async function cookieCleanup(
  event: { req: { headers: Headers; url?: string } },
  next: () => unknown | Promise<unknown>,
): Promise<unknown> {
  const cookieHeader =
    (event.req.headers instanceof Headers
      ? event.req.headers.get("cookie")
      : (event.req.headers as Record<string, string | undefined>)?.["cookie"]) ?? "";

  if (cookieHeader.length > MAX_COOKIE_BYTES) {
    const clearHeaders = new Headers();
    for (const name of AUTH_COOKIE_NAMES) {
      clearHeaders.append(
        "Set-Cookie",
        `${name}=; Path=/; Secure; SameSite=Lax; Max-Age=0`,
      );
    }
    const url = event.req.url || "/";
    clearHeaders.set("Location", url);

    return new Response("Clearing stale cookies…", {
      status: 302,
      headers: clearHeaders,
    });
  }

  return next();
}
