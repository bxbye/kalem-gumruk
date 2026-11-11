import rateLimit from "express-rate-limit";

/**
 * Herkese açık form ve değerlendirme gönderimleri için IP bazlı anti-spam hız sınırı.
 * Yalnızca public POST uç noktalarına uygulanır; GET ve yetkili admin işlemlerini kısıtlamaz.
 */
export const formRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 dakika
  max: 20, // 15 dakikada tek bir IP'den en fazla 20 gönderim
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Çok fazla deneme yapıldı. Güvenlik nedeniyle lütfen 15 dakika sonra tekrar deneyiniz.",
  },
});
