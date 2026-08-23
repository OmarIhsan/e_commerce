import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const LOCALES = ["en", "ar", "fr"] as const;
type Locale = (typeof LOCALES)[number];

const DEFAULT_LOCALE: Locale = "en";

function getPreferredLocale(request: NextRequest): Locale {
  const acceptLang = (request.headers.get("accept-language") || "").toLowerCase();
  if (acceptLang.includes("ar")) return "ar";
  if (acceptLang.includes("fr")) return "fr";
  return DEFAULT_LOCALE;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip _next internals, api routes, and static files
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Already has a valid locale prefix — pass through
  const firstSegment = pathname.split("/")[1];
  if (LOCALES.includes(firstSegment as Locale)) {
    return NextResponse.next();
  }

  // Redirect bare paths to locale-prefixed equivalent
  const locale = getPreferredLocale(request);
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
