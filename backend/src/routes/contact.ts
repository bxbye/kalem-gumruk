import { Router } from "express";
import { db } from "../db/index.js";
import { formSubmissions } from "../db/schema.js";
import { sendContactEmail } from "../services/mailer.js";
import { validateFormSpamGuard } from "../services/security.js";

export const contactRouter = Router();

contactRouter.post("/", async (req, res) => {
  try {
    const {
      fullName,
      company,
      phone,
      email,
      serviceType,
      message,
      honeypot,
      formLoadedAt,
      challengeToken,
      challengeAnswer,
      kvkkConsent,
      lang = "tr",
    } = req.body || {};
    const visitorLang = String(lang).toLowerCase();

    // 1. Kapsamlı Spam & İnsan Doğrulaması & KVKK Onayı
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

    // 2. Zorunlu Alan Kontrolü
    if (!fullName || !phone || !message) {
      return res.status(400).json({ error: "Lütfen zorunlu alanları (Ad Soyad, Telefon, Mesaj) doldurunuz." });
    }

    // 4. Uzunluk ve format kontrolleri
    if (String(fullName).length > 120 || String(message).length > 2500) {
      return res.status(400).json({ error: "Girdiğiniz metin çok uzun." });
    }

    const refCode = req.body?.refCode || `TK-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const submissionId = `SUB-${refCode}`;
    const now = new Date();

    // 5. Veritabanına kaydet
    await db.insert(formSubmissions).values({
      id: submissionId,
      formSlug: serviceType ? "fiyat-teklifi" : "iletisim",
      data: JSON.stringify({
        fullName: String(fullName).trim(),
        company: company ? String(company).trim() : "",
        phone: String(phone).trim(),
        email: email ? String(email).trim() : "",
        serviceType: serviceType || "Genel Bilgi",
        message: String(message).trim(),
        _lang: visitorLang,
      }),
      files: "[]",
      status: "NEW",
      ipAddress: req.ip || "unknown",
      createdAt: now,
      updatedAt: now,
    });

    // 6. E-posta bildirimlerini arka planda gönder (kadir.kaya@kayapermit.com)
    sendContactEmail({
      refCode,
      fullName: String(fullName).trim(),
      company: company ? String(company).trim() : "",
      phone: String(phone).trim(),
      email: email ? String(email).trim() : "",
      serviceType,
      message: String(message).trim(),
      lang: visitorLang,
    }).catch((err) => console.error("[Contact Mail Error]:", err));

    const localizedSuccessMsgs: Record<string, string> = {
      en: `Your inquiry has been registered with reference #${refCode}. Our licensed customs broker will contact you shortly.`,
      ar: `تم تسجيل طلبكم بنجاح برقم مرجعي #${refCode}. سيتواصل معكم مستشارنا الجمركي في أقرب وقت.`,
      es: `Su solicitud ha sido registrada con la referencia #${refCode}. Nuestro agente de aduanas se pondrá en contacto en breve.`,
      tr: `Talebiniz #${refCode} referans koduyla başarıyla kaydedildi. Gümrük müşavirimiz en kısa sürede sizinle iletişime geçecektir.`,
    };

    return res.json({
      success: true,
      refCode,
      message: localizedSuccessMsgs[visitorLang] || localizedSuccessMsgs.tr,
    });
  } catch (error) {
    console.error("[Contact API Error]:", error);
    return res.status(500).json({
      error: "Mesaj gönderilirken bir hata oluştu. Lütfen doğrudan telefon veya WhatsApp ile ulaşınız.",
    });
  }
});
