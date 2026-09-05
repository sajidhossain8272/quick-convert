import { NextRequest, NextResponse } from "next/server";

// Hosts that serve the Quick Convert app.
const APP_HOSTS = new Set([
  "quickconvert.plzwork.app",
  "www.quickconvert.plzwork.app",
]);

// Hosts that should show the "Coming Soon" placeholder with migration links.
const COMING_SOON_HOSTS = new Set(["plzwork.app", "www.plzwork.app"]);

// Legacy deployment domain that previously hosted the app.
const LEGACY_HOST = "quick-convert-img.vercel.app";

/**
 * Resolve the hostname from the request headers.
 * `request.nextUrl.hostname` reflects the connection host on self-hosted
 * `next start`, so we read the `Host` header directly (with
 * `x-forwarded-host` for proxy platforms like Vercel) and strip any port.
 */
function getHostname(request: NextRequest): string {
  const forwardedHost = request.headers.get("x-forwarded-host");
  const hostHeader = request.headers.get("host");
  const raw = (forwardedHost || hostHeader || request.nextUrl.hostname).toLowerCase();
  return raw.split(":")[0];
}

const COMING_SOON_HTML = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Plzwork - Coming Soon</title>
    <style>
      html, body { margin: 0; padding: 0; height: 100%; background: #ffffff; }
      body {
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      }
      main { padding: 0 1.5rem; text-align: center; }
      h1 {
        color: #111111;
        font-size: clamp(1.5rem, 4vw, 2.5rem);
        font-weight: 600;
        letter-spacing: -0.02em;
        text-align: center;
        margin: 0;
      }
      p {
        color: #6b7280;
        font-size: 0.95rem;
        line-height: 1.6;
        margin: 1.25rem 0 0;
      }
      a {
        color: #42b719;
        font-weight: 500;
        text-decoration: none;
      }
      a:hover {
        color: #2f9e14;
        text-decoration: underline;
      }
    </style>
  </head>
  <body>
    <main>
      <h1>Coming Soon</h1>
      <p>This project was migrated to <a href="https://quickconvert.plzwork.app">quickconvert.plzwork.app</a>.</p>
      <p><a href="https://quickconvert.plzwork.app">View the old plzwork here</a></p>
    </main>
  </body>
</html>`;

export function middleware(request: NextRequest) {
  const hostname = getHostname(request);

  // Quick Convert app lives only on the subdomain.
  if (APP_HOSTS.has(hostname)) {
    return NextResponse.next();
  }

  // Old Vercel domain -> permanent redirect to the new Quick Convert subdomain.
  if (hostname === LEGACY_HOST) {
    const url = request.nextUrl.clone();
    url.protocol = "https:";
    url.hostname = "quickconvert.plzwork.app";
    url.port = "";
    return NextResponse.redirect(url, 308);
  }

  // Main domain -> "Coming Soon" placeholder with migration links.
  if (COMING_SOON_HOSTS.has(hostname)) {
    return new NextResponse(COMING_SOON_HTML, {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "X-Robots-Tag": "noindex, nofollow",
        "Cache-Control": "public, max-age=300",
      },
    });
  }

  // Everything else (Vercel previews, localhost, etc.) serves the app.
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico|pdf|json|txt)$).*)"],
};