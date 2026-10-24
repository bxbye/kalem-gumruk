import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SUPPORTED_LOCALES = ["tr", "en", "ar", "es"] as const;
type Locale = (typeof SUPPORTED_LOCALES)[number];
const DEFAULT_LOCALE: Locale = "tr";

const ARABIC_COUNTRIES = new Set([
  "SA", "AE", "QA", "KW", "BH", "OM", "EG", "JO", "LB", "IQ", "DZ", "MA", "TN", "LY", "YE", "SD"
]);

const SPANISH_COUNTRIES = new Set([
  "ES", "MX", "AR", "CO", "CL", "PE", "VE", "EC", "GT", "CU", "BO", "DO", "HN", "PY", "SV", "NI", "CR", "PA", "UY", "PR"
]);

function detectLocale(request: NextRequest): Locale {
  // 1. Kullanıcının önceden seçtiği çerez (Cookie)
  const savedLang = request.cookies.get("kalem_lang")?.value;
  if (savedLang && (SUPPORTED_LOCALES as readonly string[]).includes(savedLang)) {
    return savedLang as Locale;
  }

  // 2. Cloudflare Edge Coğrafi Konum Tespiti (cf-ipcountry başlığı)
  const country =
    request.headers.get("cf-ipcountry") ||
    request.headers.get("x-country-code") ||
    "";

  if (country) {
    const upperCountry = country.toUpperCase();
    if (upperCountry === "TR" || upperCountry === "AZ") {
      return "tr";
    }
    if (ARABIC_COUNTRIES.has(upperCountry)) {
      return "ar";
    }
    if (SPANISH_COUNTRIES.has(upperCountry)) {
      return "es";
    }
    // Diğer ülkeler için varsayılan İngilizce
    return "en";
  }

  // 3. Tarayıcı Accept-Language Başlığı
  const acceptLanguage = request.headers.get("accept-language") || "";
  const primaryLang = acceptLanguage.split(",")[0]?.trim().toLowerCase() || "";
  if (primaryLang.startsWith("es")) return "es";
  if (primaryLang.startsWith("ar")) return "ar";
  if (primaryLang.startsWith("en")) return "en";
  if (primaryLang.startsWith("tr")) return "tr";

  return DEFAULT_LOCALE;
}

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // Statik dosyaları, Next.js iç rotalarını, admin panelini ve API uç noktalarını atla
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/images") ||
    pathname.startsWith("/documents") ||
    pathname.includes(".") // .svg, .ico, .png, .jpg, .webmanifest vb.
  ) {
    return NextResponse.next();
  }

  // Pathname desteklenen dillerden biriyle başlıyor mu?
  const pathnameHasLocale = SUPPORTED_LOCALES.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );

  if (pathnameHasLocale) {
    // Mevcut dil segmentini al ve çerezi eşitle
    const currentLocale = pathname.split("/")[1] as Locale;
    const response = NextResponse.next();
    if (request.cookies.get("kalem_lang")?.value !== currentLocale) {
      response.cookies.set("kalem_lang", currentLocale, {
        path: "/",
        maxAge: 60 * 60 * 24 * 365,
        sameSite: "lax",
      });
    }
    return response;
  }

  // Dil ön eki yoksa (örn: '/' veya '/kurumsal'), uygun dile yönlendir
  const targetLocale = detectLocale(request);
  const redirectUrl = new URL(`/${targetLocale}${pathname === "/" ? "" : pathname}${search}`, request.url);

  const response = NextResponse.redirect(redirectUrl);
  response.cookies.set("kalem_lang", targetLocale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });

  return response;
}

export const config = {
  matcher: [
    // API, Admin ve statik dosyalar haricindeki tüm rotaları yakala
    "/((?!api|admin|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};
