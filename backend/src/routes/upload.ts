import { Router } from "express";
import fs from "fs";
import { uploadMiddleware, formatBytes, verifyFileSignature } from "../services/storage.js";

export const uploadRouter = Router();

uploadRouter.post("/", uploadMiddleware.single("file"), async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: "Lütfen bir dosya seçiniz." });
    }

    // 1. Derinlikli Güvenlik / Magic Bytes Doğrulaması
    const signatureCheck = await verifyFileSignature(file.path);
    if (!signatureCheck.valid) {
      // Güvenlik testi başarısız -> Dosyayı sunucudan hemen sil
      try {
        fs.unlinkSync(file.path);
      } catch (e) {
        console.error("[Upload] Güvensiz dosya silinirken hata:", e);
      }

      console.warn(`[Anti-Virus/Malware Guard] Şüpheli dosya engellendi ve silindi: ${file.originalname} (${signatureCheck.reason})`);
      return res.status(400).json({
        error: signatureCheck.reason || "Güvenlik denetimi başarısız oldu. Yalnızca geçerli PDF veya Resim yükleyebilirsiniz.",
      });
    }

    const fileUrl = `/uploads/${file.filename}`;

    return res.json({
      success: true,
      file: {
        name: file.originalname,
        url: fileUrl,
        key: file.filename,
        size: formatBytes(file.size),
        type: file.mimetype || file.filename.split(".").pop(),
      },
    });
  } catch (error: any) {
    console.error("[Upload Error]:", error);
    return res.status(500).json({ error: error?.message || "Dosya yüklenirken bir hata oluştu." });
  }
});
