import { Router } from "express";
import { uploadMiddleware, formatBytes } from "../services/storage.js";

export const uploadRouter = Router();

uploadRouter.post("/", uploadMiddleware.single("file"), (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: "Lütfen bir dosya seçiniz." });
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
