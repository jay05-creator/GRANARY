/**
 * Security headers middleware — adds HSTS, CSP, X-Frame-Options,
 * X-Content-Type-Options, Referrer-Policy, and Permissions-Policy
 * to all responses. Auto-registered by Nitro via serverDir: "./server".
 */
export default async function securityHeaders(
  _event: { req: { method: string; headers: Headers } },
  next: () => unknown | Promise<unknown>,
): Promise<unknown> {
  const result = await next();
  if (result instanceof Response) {
    const headers = new Headers(result.headers);

    // HSTS — enforce HTTPS for 1 year, including subdomains
    if (!headers.has("strict-transport-security")) {
      headers.set("strict-transport-security", "max-age=31536000; includeSubDomains; preload");
    }

    // Prevent clickjacking
    if (!headers.has("x-frame-options")) {
      headers.set("x-frame-options", "DENY");
    }

    // Prevent MIME sniffing
    if (!headers.has("x-content-type-options")) {
      headers.set("x-content-type-options", "nosniff");
    }

    // Referrer policy — send origin only on cross-origin requests
    if (!headers.has("referrer-policy")) {
      headers.set("referrer-policy", "strict-origin-when-cross-origin");
    }

    // Permissions policy — disable dangerous browser features
    if (!headers.has("permissions-policy")) {
      headers.set(
        "permissions-policy",
        "camera=(), microphone=(), geolocation=(), payment=(), usb=(), magnetometer=()",
      );
    }

    // Content Security Policy — restrict resource loading
    if (!headers.has("content-security-policy")) {
      headers.set(
        "content-security-policy",
        [
          "default-src 'self'",
          "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // React needs unsafe-inline/eval for dev
          "style-src 'self' 'unsafe-inline'", // Tailwind needs unsafe-inline
          "img-src 'self' https://api.dicebear.com https://images.unsplash.com https://*.basemaps.cartocdn.com https://*.tile.openstreetmap.org https://tile.openstreetmap.org data: blob:",
          "font-src 'self' https://fonts.gstatic.com",
          "connect-src 'self' http://localhost:* https:",
          "frame-ancestors 'none'",
          "base-uri 'self'",
          "form-action 'self'",
        ].join("; "),
      );
    }

    return new Response(result.body, {
      status: result.status,
      statusText: result.statusText,
      headers,
    });
  }

  return result;
}
