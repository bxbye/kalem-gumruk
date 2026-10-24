import { Router } from "express";
import { db } from "../db/index.js";
import { documents } from "../db/schema.js";
import { eq, desc, sql } from "drizzle-orm";

export const documentsRouter = Router();

// Belgeleri Listele
documentsRouter.get("/", async (_req, res) => {
  try {
    const docs = await db.select().from(documents).orderBy(desc(documents.createdAt)).all();
    return res.json({ success: true, documents: docs });
  } catch (error) {
    console.error("[Documents List Error]:", error);
    return res.status(500).json({ error: "Belgeler listelenemedi." });
  }
});

// Belge Ekle / İndirme Sayacı Artır
documentsRouter.post("/", async (req, res) => {
  try {
    const { action, id, password, title, description, category, fileUrl, fileKey, fileSize, fileType, isPublic } =
      req.body || {};

    // 1. İndirme Sayacı Artırma (Public)
    if (action === "increment_download" && id) {
      await db
        .update(documents)
        .set({ downloadCount: sql`${documents.downloadCount} + 1` })
        .where(eq(documents.id, id));
      return res.json({ success: true, message: "Sayım artırıldı." });
    }

    // 2. Yeni Belge Ekleme (Admin)
    const validPassword = process.env.ADMIN_PASSWORD || "kalem1997";
    if (password !== validPassword) {
      return res.status(401).json({ error: "Yetkisiz işlem: Geçersiz şifre." });
    }

    if (!title || !fileUrl || !category) {
      return res.status(400).json({ error: "Başlık, dosya linki ve kategori zorunludur." });
    }

    const docId = id || `doc-${Date.now()}`;
    await db.insert(documents).values({
      id: docId,
      title,
      description: description || null,
      category,
      fileUrl,
      fileKey: fileKey || null,
      fileSize: fileSize || "1.0 MB",
      fileType: fileType || "pdf",
      downloadCount: 0,
      isPublic: isPublic !== undefined ? isPublic : true,
      createdAt: new Date(),
    });

    return res.json({ success: true, message: "Belge başarıyla eklendi.", id: docId });
  } catch (error) {
    console.error("[Documents Save Error]:", error);
    return res.status(500).json({ error: "Belge eklenemedi." });
  }
});

// Belge Sil (DELETE)
documentsRouter.delete("/", async (req, res) => {
  try {
    const id = (req.query.id as string) || req.body?.id;
    const password = (req.query.password as string) || req.body?.password;

    const validPassword = process.env.ADMIN_PASSWORD || "kalem1997";
    if (password !== validPassword) {
      return res.status(401).json({ error: "Yetkisiz işlem: Geçersiz şifre." });
    }

    if (!id) {
      return res.status(400).json({ error: "Silinecek belge ID belirtilmelidir." });
    }

    await db.delete(documents).where(eq(documents.id, id));
    return res.json({ success: true, message: "Belge silindi." });
  } catch (error) {
    console.error("[Document Delete Error]:", error);
    return res.status(500).json({ error: "Silme işlemi başarısız." });
  }
});
