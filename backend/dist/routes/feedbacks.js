import { Router } from "express";
import { db, isDbConnected } from "../db/index.js";
import { customerFeedbacks } from "../db/schema.js";
import { eq, desc } from "drizzle-orm";
import { authenticateRequest } from "../services/auth.js";
import { validateFormSpamGuard } from "../services/security.js";
import { defaultFeedbacks } from "../data/defaults.js";
export const feedbacksRouter = Router();
// Yorumları Listele
feedbacksRouter.get("/", async (req, res) => {
    const approvedOnly = req.query.approvedOnly === "true";
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
        return res.json({ success: true, feedbacks: feedbacks.length > 0 ? feedbacks : staticFallback });
    }
    catch (error) {
        console.warn("[Feedbacks List] DB hatası, statik yorumlar kullanılıyor:", error instanceof Error ? error.message : error);
        return res.json({ success: true, feedbacks: staticFallback });
    }
});
// Yeni Değerlendirme Gönder (Public)
feedbacksRouter.post("/", async (req, res) => {
    try {
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
        if (!fullName || !rating || !comment) {
            return res.status(400).json({ error: "Lütfen ad soyad, puan ve yorum alanlarını doldurunuz." });
        }
        const id = `fb-${Date.now()}`;
        await db.insert(customerFeedbacks).values({
            id,
            fullName,
            company: company || null,
            rating: Number(rating),
            serviceType: serviceType || "Genel Memnuniyet",
            comment,
            isApproved: false, // Yönetici onayından sonra yayınlanır
            createdAt: new Date(),
        });
        return res.json({
            success: true,
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
    try {
        const user = await authenticateRequest(req);
        if (!user) {
            return res.status(401).json({ error: "Yetkisiz işlem: Lütfen giriş yapınız." });
        }
        const { id, isApproved } = req.body || {};
        if (!id) {
            return res.status(400).json({ error: "Yorum ID belirtilmelidir." });
        }
        await db.update(customerFeedbacks).set({ isApproved: Boolean(isApproved) }).where(eq(customerFeedbacks.id, id));
        return res.json({ success: true, message: "Yorum durumu güncellendi." });
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
        const id = req.query.id || req.body?.id;
        if (!id) {
            return res.status(400).json({ error: "Silinecek ID belirtilmelidir." });
        }
        await db.delete(customerFeedbacks).where(eq(customerFeedbacks.id, id));
        return res.json({ success: true, message: "Yorum silindi." });
    }
    catch (error) {
        console.error("[Feedback Delete Error]:", error);
        return res.status(500).json({ error: "Silme işlemi başarısız." });
    }
});
