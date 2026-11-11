import { Router } from "express";
import fs from "fs";
import path from "path";
import { uploadMiddleware, formatBytes, verifyFileSignature, fixUtf8Mojibake, standardizeReferenceLogo, } from "../services/storage.js";
export const uploadRouter = Router();
// Genel Dosya Yükleme (type=logo verilirse otomatik standartlaştırır)
uploadRouter.post("/", uploadMiddleware.single("file"), async (req, res) => {
    try {
        const file = req.file;
        if (!file) {
            return res.status(400).json({ error: "Lütfen bir dosya seçiniz." });
        }
        // Dosya adındaki UTF-8 bozulmasını gider
        const cleanOriginalName = fixUtf8Mojibake(file.originalname);
        file.originalname = cleanOriginalName;
        // 1. Derinlikli Güvenlik / Magic Bytes Doğrulaması
        const signatureCheck = await verifyFileSignature(file.path);
        if (!signatureCheck.valid) {
            // Güvenlik testi başarısız -> Dosyayı sunucudan hemen sil
            try {
                fs.unlinkSync(file.path);
            }
            catch (e) {
                console.error("[Upload] Güvensiz dosya silinirken hata:", e);
            }
            console.warn(`[Anti-Virus/Malware Guard] Şüpheli dosya engellendi ve silindi: ${cleanOriginalName} (${signatureCheck.reason})`);
            return res.status(400).json({
                error: signatureCheck.reason || "Güvenlik denetimi başarısız oldu. Yalnızca geçerli PDF veya Resim yükleyebilirsiniz.",
            });
        }
        const isLogo = req.query.type === "logo" || req.body?.type === "logo";
        const ext = path.extname(file.originalname).toLowerCase();
        const isImage = [".png", ".jpg", ".jpeg", ".webp"].includes(ext);
        // Eğer Referans Logosu olarak yükleniyorsa standartlaştırma filtresinden geçir
        if (isLogo && isImage) {
            try {
                const baseSlug = path.basename(cleanOriginalName, ext);
                const standardized = await standardizeReferenceLogo(file.path, baseSlug);
                const fileUrl = `/uploads/${standardized.filename}`;
                console.log(`[Upload Logo] Referans logosu standartlaştırıldı: ${standardized.filename} (${standardized.sizeFormatted})`);
                return res.json({
                    success: true,
                    standardized: true,
                    file: {
                        name: cleanOriginalName,
                        url: fileUrl,
                        key: standardized.filename,
                        size: standardized.sizeFormatted,
                        type: "image/png",
                    },
                    originalName: cleanOriginalName,
                    fileUrl,
                });
            }
            catch (err) {
                console.error("[Upload Logo Error]:", err);
                // Standardize başarısız olursa normal yükleme ile devam et
            }
        }
        const fileUrl = `/uploads/${file.filename}`;
        return res.json({
            success: true,
            file: {
                name: cleanOriginalName,
                url: fileUrl,
                key: file.filename,
                size: formatBytes(file.size),
                type: file.mimetype || file.filename.split(".").pop(),
            },
            originalName: cleanOriginalName,
            fileUrl,
        });
    }
    catch (error) {
        console.error("[Upload Error]:", error);
        return res.status(500).json({ error: error?.message || "Dosya yüklenirken bir hata oluştu." });
    }
});
// Referans Logoları İçin Özel Endpoint: POST /api/upload/logo
uploadRouter.post("/logo", uploadMiddleware.single("file"), async (req, res) => {
    try {
        const file = req.file;
        if (!file) {
            return res.status(400).json({ error: "Lütfen bir logo görseli seçiniz." });
        }
        const cleanOriginalName = fixUtf8Mojibake(file.originalname);
        const ext = path.extname(cleanOriginalName).toLowerCase();
        if (![".png", ".jpg", ".jpeg", ".webp"].includes(ext)) {
            try {
                fs.unlinkSync(file.path);
            }
            catch { }
            return res.status(400).json({ error: "Logo için lütfen geçerli bir resim formatı (PNG, JPG, WebP) yükleyiniz." });
        }
        // Güvenlik doğrulaması
        const signatureCheck = await verifyFileSignature(file.path);
        if (!signatureCheck.valid) {
            try {
                fs.unlinkSync(file.path);
            }
            catch { }
            return res.status(400).json({ error: signatureCheck.reason || "Geçersiz resim dosyası." });
        }
        // Sharp ile 360x140 şeffaf standardına dönüştür
        const baseSlug = path.basename(cleanOriginalName, ext);
        const standardized = await standardizeReferenceLogo(file.path, baseSlug);
        const fileUrl = `/uploads/${standardized.filename}`;
        console.log(`[Upload Logo] Referans logosu standartlaştırıldı: ${standardized.filename} (${standardized.sizeFormatted})`);
        return res.json({
            success: true,
            standardized: true,
            file: {
                name: cleanOriginalName,
                url: fileUrl,
                key: standardized.filename,
                size: standardized.sizeFormatted,
                type: "image/png",
            },
            originalName: cleanOriginalName,
            fileUrl,
        });
    }
    catch (error) {
        console.error("[Upload Logo Error]:", error);
        return res.status(500).json({ error: error?.message || "Logo yüklenirken bir hata oluştu." });
    }
});
