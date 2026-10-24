import { Router } from "express";
import { db } from "../db/index.js";
import { formSubmissions } from "../db/schema.js";
import { sendContactEmail } from "../services/mailer.js";

export const contactRouter = Router();

contactRouter.post("/", async (req, res) => {
  try {
    const { fullName, company, phone, email, serviceType, message, honeypot } = req.body || {};

    // Spam engelleme
    if (honeypot) {
      return res.json({ success: true, message: "İşlem başarılı." });
    }

    if (!fullName || !phone || !message) {
      return res.status(400).json({ error: "Lütfen zorunlu alanları (Ad Soyad, Telefon, Mesaj) doldurunuz." });
    }

    const refCode = `TK-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const submissionId = `SUB-${refCode}`;
    const now = new Date();

    // 1. Veritabanına kaydet
    await db.insert(formSubmissions).values({
      id: submissionId,
      formSlug: serviceType ? "fiyat-teklifi" : "iletisim",
      data: JSON.stringify({
        fullName,
        company,
        phone,
        email,
        serviceType: serviceType || "Genel Bilgi",
        message,
      }),
      files: "[]",
      status: "NEW",
      createdAt: now,
      updatedAt: now,
    });

    // 2. E-posta bildirimlerini arka planda gönder
    sendContactEmail({
      refCode,
      fullName,
      company,
      phone,
      email,
      serviceType,
      message,
    }).catch((err) => console.error("[Contact Mail Error]:", err));

    return res.json({
      success: true,
      refCode,
      message: `Talebiniz #${refCode} referans koduyla başarıyla kaydedildi. Gümrük müşavirimiz en kısa sürede sizinle iletişime geçecektir.`,
    });
  } catch (error) {
    console.error("[Contact API Error]:", error);
    return res.status(500).json({
      error: "Mesaj gönderilirken bir hata oluştu. Lütfen doğrudan telefon veya WhatsApp ile ulaşınız.",
    });
  }
});
