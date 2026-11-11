import { Router } from "express";
import { db, isDbConnected } from "../db/index.js";
import { customerFeedbacks } from "../db/schema.js";
import { eq, desc } from "drizzle-orm";
import { authenticateRequest } from "../services/auth.js";
import { validateFormSpamGuard } from "../services/security.js";
import { defaultFeedbacks } from "../data/defaults.js";
import { formRateLimiter } from "../middleware/rateLimiter.js";
import { setNoStoreHeaders } from "../utils/http.js";
export const feedbacksRouter = Router();
// Yorumları Listele
feedbacksRouter.get("/", async (req, res) => {
    setNoStoreHeaders(res);
    const approvedOnly = req.query.approvedOnly === "true";
    // Onaysız yorumları görmek için yetkili oturum gerekir
    if (!approvedOnly) {
        const user = await authenticateRequest(req);
        if (!user) {
            return res.status(401).json({ error: "Yetkisiz işlem: Tüm yorumları görmek için giriş yapınız." });
        }
    }
    const staticFallback = approvedOnly ? defaultFeedbacks.filter((f) => f.isApproved) : defaultFeedbacks;
    if (!isDbConnected) {
        return res.json({ success: true, feedbacks: staticFallback });
    }
    try {
        let query = db.select().from(customerFeedbacks);
        if (approvedOnly) {
            // @ts-ignore
            query = query.where(eq(customerFeedbacks.isApproved, true));
        }
        const feedbacks = await query.orderBy(desc(customerFeedbacks.createdAt));
        return res.json({ success: true, feedbacks });
    }
    catch (error) {
        console.error("[Feedbacks List] DB sorgu hatası:", error instanceof Error ? error.message : error);
        return res.status(500).json({ error: "Müşteri yorumları yüklenemedi." });
    }
});
// Yeni Değerlendirme Gönder (Public)
feedbacksRouter.post("/", formRateLimiter, async (req, res) => {
    try {
        if (!isDbConnected) {
            return res.status(503).json({ error: "Veritabanı bağlantısı şu anda kullanılamıyor." });
        }
        const { fullName, company, rating, serviceType, comment, honeypot, kvkkConsent, challengeToken, challengeAnswer, formLoadedAt, } = req.body || {};
        // 1. Merkezi Spam ve İnsan Doğrulaması Denetimi
        const spamCheck = await validateFormSpamGuard({
            honeypot,
            formLoadedAt,
            challengeToken,
            challengeAnswer,
            kvkkConsent,
            ip: req.ip,
        });
        if (!spamCheck.valid) {
            return res.status(400).json({ error: spamCheck.reason || "Güvenlik denetimi başarısız oldu." });
        }
        const cleanName = String(fullName || "").trim();
        const cleanComment = String(comment || "").trim();
        const numericRating = Math.min(5, Math.max(1, Math.round(Number(rating) || 0)));
        if (!cleanName || !numericRating || !cleanComment) {
            return res.status(400).json({ error: "Lütfen ad soyad, puan ve yorum alanlarını doldurunuz." });
        }
        const id = `fb-${Date.now()}`;
        await db.insert(customerFeedbacks).values({
            id,
            fullName: cleanName,
            company: company ? String(company).trim() : null,
            rating: numericRating,
            serviceType: serviceType ? String(serviceType).trim() : "Genel Memnuniyet",
            comment: cleanComment,
            isApproved: false, // Yönetici onayından sonra yayınlanır
            createdAt: new Date(),
        });
        return res.json({
            success: true,
            id,
            message: "Değerlendirmeniz alındı. Yönetici kontrolünden sonra web sitesinde yayınlanacaktır.",
        });
    }
    catch (error) {
        console.error("[Feedback Create Error]:", error);
        return res.status(500).json({ error: "Yorum kaydedilemedi." });
    }
});
// Yorum Onay Durumu Güncelle (PATCH / PUT)
const updateFeedbackHandler = async (req, res) => {
    setNoStoreHeaders(res);
    try {
        const user = await authenticateRequest(req);
        if (!user) {
            return res.status(401).json({ error: "Yetkisiz işlem: Lütfen giriş yapınız." });
        }
        if (!isDbConnected) {
            return res.status(503).json({ error: "Veritabanı bağlantısı şu anda kullanılamıyor." });
        }
        const { id, isApproved } = req.body || {};
        if (!id) {
            return res.status(400).json({ error: "Yorum ID belirtilmelidir." });
        }
        const [existing] = await db
            .select()
            .from(customerFeedbacks)
            .where(eq(customerFeedbacks.id, String(id)))
            .limit(1);
        if (!existing) {
            return res.status(404).json({ error: "Güncellenecek yorum bulunamadı." });
        }
        const approvedState = Boolean(isApproved);
        await db
            .update(customerFeedbacks)
            .set({ isApproved: approvedState })
            .where(eq(customerFeedbacks.id, String(id)));
        return res.json({
            success: true,
            message: approvedState ? "Yorum onaylandı ve yayına alındı." : "Yorum yayından kaldırıldı.",
            feedback: { ...existing, isApproved: approvedState },
        });
    }
    catch (error) {
        console.error("[Feedback Update Error]:", error);
        return res.status(500).json({ error: "Güncelleme başarısız." });
    }
};
feedbacksRouter.patch("/", updateFeedbackHandler);
feedbacksRouter.put("/", updateFeedbackHandler);
// Yorum Sil (DELETE - YALNIZCA ADMIN)
feedbacksRouter.delete("/", async (req, res) => {
    setNoStoreHeaders(res);
    try {
        const user = await authenticateRequest(req);
        if (!user) {
            return res.status(401).json({ error: "Yetkisiz işlem: Lütfen giriş yapınız." });
        }
        if (user.role !== "ADMIN" || user.permissions?.canDelete === false) {
            return res.status(403).json({
                error: "Yetkisiz işlem: Editör kullanıcıları değerlendirme silemez. Silme yetkisi yalnızca Yöneticiye aittir.",
            });
        }
        if (!isDbConnected) {
            return res.status(503).json({ error: "Veritabanı bağlantısı şu anda kullanılamıyor." });
        }
        const id = req.query.id || req.body?.id;
        if (!id) {
            return res.status(400).json({ error: "Silinecek ID belirtilmelidir." });
        }
        const [existing] = await db
            .select()
            .from(customerFeedbacks)
            .where(eq(customerFeedbacks.id, String(id)))
            .limit(1);
        if (!existing) {
            return res.status(404).json({ error: "Silinecek yorum bulunamadı." });
        }
        await db.delete(customerFeedbacks).where(eq(customerFeedbacks.id, String(id)));
        return res.json({ success: true, message: "Yorum silindi." });
    }
    catch (error) {
        console.error("[Feedback Delete Error]:", error);
        return res.status(500).json({ error: "Silme işlemi başarısız." });
    }
});
