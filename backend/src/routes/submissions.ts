import { Router } from "express";
import { db } from "../db/index.js";
import { formSubmissions } from "../db/schema.js";
import { eq, desc, and } from "drizzle-orm";
import { authenticateRequest } from "../services/auth.js";

export const submissionsRouter = Router();

// Form Yanıtlarını Listele
submissionsRouter.get("/", async (req, res) => {
  try {
    const { formSlug, status } = req.query as { formSlug?: string; status?: string };

    let query = db.select().from(formSubmissions);

    if (formSlug && status && status !== "ALL") {
      // @ts-ignore
      query = query.where(and(eq(formSubmissions.formSlug, formSlug), eq(formSubmissions.status, status)));
    } else if (formSlug) {
      // @ts-ignore
      query = query.where(eq(formSubmissions.formSlug, formSlug));
    } else if (status && status !== "ALL") {
      // @ts-ignore
      query = query.where(eq(formSubmissions.status, status));
    }

    const submissions = await query.orderBy(desc(formSubmissions.createdAt)).all();

    const formatted = submissions.map((sub) => ({
      ...sub,
      data: JSON.parse(sub.data || "{}"),
      files: JSON.parse(sub.files || "[]"),
    }));

    return res.json({ success: true, submissions: formatted });
  } catch (error) {
    console.error("[Submissions List Error]:", error);
    return res.status(500).json({ error: "Kayıtlar listelenemedi." });
  }
});

// Durum Güncelle ve Yönetici Notu Ekle (PATCH veya PUT)
const updateSubmissionHandler = async (req: any, res: any) => {
  try {
    const user = await authenticateRequest(req);
    if (!user) {
      return res.status(401).json({ error: "Yetkisiz işlem: Lütfen giriş yapınız." });
    }

    const { id, status, adminNotes } = req.body || {};
    if (!id) {
      return res.status(400).json({ error: "Kayıt ID belirtilmelidir." });
    }

    const updates: any = { updatedAt: new Date() };
    if (status) updates.status = status;
    if (adminNotes !== undefined) updates.adminNotes = adminNotes;

    await db.update(formSubmissions).set(updates).where(eq(formSubmissions.id, id));

    return res.json({ success: true, message: "Kayıt güncellendi." });
  } catch (error) {
    console.error("[Submission Update Error]:", error);
    return res.status(500).json({ error: "Güncelleme başarısız." });
  }
};

submissionsRouter.patch("/", updateSubmissionHandler);
submissionsRouter.put("/", updateSubmissionHandler);

// Kayıt Sil (DELETE - YALNIZCA ADMIN)
submissionsRouter.delete("/", async (req, res) => {
  try {
    const user = await authenticateRequest(req);
    if (!user) {
      return res.status(401).json({ error: "Yetkisiz işlem: Lütfen giriş yapınız." });
    }

    if (user.role !== "ADMIN" || user.permissions?.canDelete === false) {
      return res.status(403).json({
        error: "Yetkisiz işlem: Editör kullanıcıları başvuru kayıtlarını silemez. Silme yetkisi yalnızca Yöneticiye aittir.",
      });
    }

    const id = (req.query.id as string) || req.body?.id;
    if (!id) {
      return res.status(400).json({ error: "Silinecek ID belirtilmelidir." });
    }

    await db.delete(formSubmissions).where(eq(formSubmissions.id, id));
    return res.json({ success: true, message: "Kayıt silindi." });
  } catch (error) {
    console.error("[Submission Delete Error]:", error);
    return res.status(500).json({ error: "Silme işlemi başarısız." });
  }
});
