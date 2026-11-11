/**
 * Sunucu tarafı (SSR / Route Handler) backend API adresini tek merkezden çözer.
 */
export function getBackendBaseUrl(): string {
  const raw =
    process.env.BACKEND_INTERNAL_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    (process.env.NODE_ENV === "production"
      ? "http://test-api.kalemgumruk.com"
      : "http://127.0.0.1:5001");

  return raw.replace(/\/$/, "");
}

/**
 * Her zaman güncel veri çeken (cache: "no-store") sunucu tarafı fetch yardımcısı.
 */
export async function fetchBackendNoStore(path: string, init?: RequestInit): Promise<Response> {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return fetch(`${getBackendBaseUrl()}${cleanPath}`, {
    ...init,
    cache: "no-store",
  });
}
