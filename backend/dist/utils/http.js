/**
 * Dinamik API yanıtlarının tarayıcı, Next.js veya reverse proxy (Cloudflare/Nginx)
 * tarafından önbelleğe alınmasını kesin olarak engeller.
 */
export function setNoStoreHeaders(res) {
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
}
/**
 * Bozuk JSON metinlerinde sunucunun 500 hatası vermesini önleyen güvenli ayrıştırıcı.
 */
export function safeJsonParse(raw, fallback) {
    if (!raw || typeof raw !== "string")
        return fallback;
    try {
        return JSON.parse(raw);
    }
    catch {
        return fallback;
    }
}
