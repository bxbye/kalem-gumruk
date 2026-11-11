import { Router } from "express";
import fs from "fs";
import path from "path";
import { db, isDbConnected } from "../db/index.js";
import { documents, sirkuler } from "../db/schema.js";
import { eq, desc, sql } from "drizzle-orm";
import { authenticateRequest } from "../services/auth.js";
import { uploadsDir } from "../services/storage.js";
import { defaultDocuments } from "../data/defaults.js";
import { setNoStoreHeaders } from "../utils/http.js";
export const documentsRouter = Router();
// Belgeleri Listele
documentsRouter.get("/", async (req, res) => {
    setNoStoreHeaders(res);
    if (!isDbConnected) {
        return res.json({ success: true, documents: defaultDocuments });
    }
    try {
        const user = await authenticateRequest(req);
        let query = db.select().from(documents);
        if (!user) {
            // @ts-ignore
            query = query.where(eq(documents.isPublic, true));
        }
        const docs = await query.orderBy(desc(documents.createdAt));
        return res.json({ success: true, documents: docs });
    }
    catch (error) {
        console.error("[Documents List] DB hatası:", error instanceof Error ? error.message : error);
        return res.status(500).json({ error: "Belgeler listelenemedi." });
    }
});
// İndirme Sayacı Artır (PATCH - Public)
documentsRouter.patch("/", async (req, res) => {
    setNoStoreHeaders(res);
    try {
        const { id } = req.body || {};
        if (!id) {
            return res.status(400).json({ error: "Belge ID belirtilmelidir." });
        }
        if (!isDbConnected) {
            return res.json({ success: true, message: "Sayım atlandı (çevrimdışı mod)." });
        }
        await db
            .update(documents)
            .set({ downloadCount: sql `${documents.downloadCount} + 1` })
            .where(eq(documents.id, String(id)));
        return res.json({ success: true, message: "Sayım artırıldı." });
    }
    catch (error) {
        console.error("[Documents Download Count Error]:", error);
        return res.status(500).json({ error: "İndirme sayacı güncellenemedi." });
    }
});
// Belge Ekle / İndirme Sayacı Artır
documentsRouter.post("/", async (req, res) => {
    setNoStoreHeaders(res);
    try {
        const { action, id, title, description, category, fileUrl, fileKey, fileSize, fileType, isPublic } = req.body || {};
        // 1. İndirme Sayacı Artırma (Public - geriye dönük uyumluluk)
        if (action === "increment_download" && id) {
            if (!isDbConnected) {
                return res.json({ success: true, message: "Sayım atlandı." });
            }
            await db
                .update(documents)
                .set({ downloadCount: sql `${documents.downloadCount} + 1` })
                .where(eq(documents.id, String(id)));
            return res.json({ success: true, message: "Sayım artırıldı." });
        }
        // 2. Yeni Belge Ekleme (Admin veya Yetkili Editör)
        const user = await authenticateRequest(req);
        if (!user) {
            return res.status(401).json({ error: "Yetkisiz işlem: Lütfen giriş yapınız." });
        }
        if (user.role !== "ADMIN" && user.permissions?.canEditDocuments === false) {
            return res.status(403).json({ error: "Yetkisiz işlem: Belge yükleme yetkiniz bulunmamaktadır." });
        }
        if (!isDbConnected) {
            return res.status(503).json({ error: "Veritabanı bağlantısı şu anda kullanılamıyor." });
        }
        if (!title || !fileUrl || !category) {
            return res.status(400).json({ error: "Başlık, dosya linki ve kategori zorunludur." });
        }
        const docId = id || `doc-${Date.now()}`;
        const resolvedKey = fileKey || (typeof fileUrl === "string" && fileUrl.startsWith("/uploads/") ? path.basename(fileUrl) : null);
        const newDoc = {
            id: docId,
            title: String(title).trim(),
            description: description ? String(description).trim() : null,
            category: String(category).trim(),
            fileUrl: String(fileUrl).trim(),
            fileKey: resolvedKey,
            fileSize: fileSize || "1.0 MB",
            fileType: fileType || "pdf",
            downloadCount: 0,
            isPublic: isPublic !== undefined ? Boolean(isPublic) : true,
            createdAt: new Date(),
        };
        await db.insert(documents).values(newDoc);
        return res.json({
            success: true,
            message: "Belge başarıyla eklendi.",
            id: docId,
            document: newDoc,
        });
    }
    catch (error) {
        console.error("[Documents Save Error]:", error);
        return res.status(500).json({ error: "Belge eklenemedi." });
    }
});
// Belge Sil (DELETE - YALNIZCA ADMIN)
documentsRouter.delete("/", async (req, res) => {
    setNoStoreHeaders(res);
    try {
        const user = await authenticateRequest(req);
        if (!user) {
            return res.status(401).json({ error: "Yetkisiz işlem: Lütfen yönetici şifresi giriniz." });
        }
        if (user.role !== "ADMIN" || user.permissions?.canDelete === false) {
            return res.status(403).json({
                error: "Yetkisiz işlem: Editör kullanıcıları belge silemez. Silme işlemi için Yönetici (Admin) yetkisi gereklidir.",
            });
        }
        if (!isDbConnected) {
            return res.status(503).json({ error: "Veritabanı bağlantısı şu anda kullanılamıyor." });
        }
        const id = req.query.id || req.body?.id;
        if (!id) {
            return res.status(400).json({ error: "Silinecek belge ID belirtilmelidir." });
        }
        const [existing] = await db
            .select()
            .from(documents)
            .where(eq(documents.id, String(id)))
            .limit(1);
        if (!existing) {
            return res.status(404).json({ error: "Silinecek belge bulunamadı." });
        }
        await db.delete(documents).where(eq(documents.id, String(id)));
        // Yalnızca uploads/ altındaki başka bir kayıt tarafından kullanılmayan yüklenmiş dosyayı temizle
        try {
            const candidateUrl = existing.fileUrl || "";
            const filename = existing.fileKey || (candidateUrl.startsWith("/uploads/") ? path.basename(candidateUrl) : "");
            if (filename && filename.startsWith("doc-")) {
                const remainingDocs = await db
                    .select({ id: documents.id })
                    .from(documents)
                    .where(eq(documents.fileUrl, candidateUrl))
                    .limit(1);
                const remainingSirkuler = await db
                    .select({ id: sirkuler.id })
                    .from(sirkuler)
                    .where(eq(sirkuler.pdfUrl, candidateUrl))
                    .limit(1);
                if (remainingDocs.length === 0 && remainingSirkuler.length === 0) {
                    const safeAbsPath = path.join(uploadsDir, path.basename(filename));
                    if (fs.existsSync(safeAbsPath)) {
                        fs.unlinkSync(safeAbsPath);
                    }
                }
            }
        }
        catch (cleanupErr) {
            console.warn("[Document File Cleanup Warning]:", cleanupErr);
        }
        return res.json({ success: true, message: "Belge kalıcı olarak silindi." });
    }
    catch (error) {
        console.error("[Document Delete Error]:", error);
        return res.status(500).json({ error: "Silme işlemi başarısız." });
    }
});
