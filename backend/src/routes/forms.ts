import { Router } from "express";
import path from "path";
import fs from "fs";
import { db } from "../db/index.js";
import { forms, formSubmissions } from "../db/schema.js";
import { eq, desc } from "drizzle-orm";
import { getMailer, sendEmailUnified } from "../services/mailer.js";
import { uploadsDir, fixUtf8Mojibake } from "../services/storage.js";
import { authenticateRequest } from "../services/auth.js";
import { validateFormSpamGuard } from "../services/security.js";
import {
  renderFormSubmissionAdminEmail,
  renderCustomerConfirmationEmail,
} from "../services/emailTemplates.js";

export const formsRouter = Router();

// Tüm Formları Listele
formsRouter.get("/", async (_req, res) => {
  try {
    const records = await db.select().from(forms).orderBy(desc(forms.createdAt)).all();
    const formatted = records.map((f) => ({
      ...f,
      fields: JSON.parse(f.fields || "[]"),
      settings: JSON.parse(f.settings || "{}"),
    }));
    return res.json({ success: true, forms: formatted });
  } catch (error) {
    console.error("[Forms List Error]:", error);
    return res.status(500).json({ error: "Formlar yüklenemedi." });
  }
});

// Yeni Form Tanımla
formsRouter.post("/", async (req, res) => {
  try {
    const user = await authenticateRequest(req);
    if (!user) {
      return res.status(401).json({ error: "Yetkisiz işlem: Lütfen giriş yapınız." });
    }

    if (user.role !== "ADMIN" && user.permissions?.canEditForms === false) {
      return res.status(403).json({ error: "Yetkisiz işlem: Form düzenleme yetkiniz bulunmamaktadır." });
    }

    const { id, slug, title, description, category, fields, settings, isActive } = req.body || {};

    if (!slug || !title) {
      return res.status(400).json({ error: "Slug ve Başlık alanları zorunludur." });
    }

    const formId = id || `form_${slug.replace(/[^a-z0-9_-]/g, "_")}`;
    const now = new Date();

    const existing = await db.select().from(forms).where(eq(forms.id, formId)).get();

    if (existing) {
      await db
        .update(forms)
        .set({
          slug,
          title,
          description: description || null,
          category: category || "general",
          fields: typeof fields === "string" ? fields : JSON.stringify(fields || []),
          settings: typeof settings === "string" ? settings : JSON.stringify(settings || {}),
          isActive: isActive !== undefined ? isActive : true,
          updatedAt: now,
        })
        .where(eq(forms.id, formId));
      return res.json({ success: true, message: "Form güncellendi." });
    } else {
      await db.insert(forms).values({
        id: formId,
        slug,
        title,
        description: description || null,
        category: category || "general",
        fields: typeof fields === "string" ? fields : JSON.stringify(fields || []),
        settings: typeof settings === "string" ? settings : JSON.stringify(settings || {}),
        isActive: isActive !== undefined ? isActive : true,
        createdAt: now,
        updatedAt: now,
      });
      return res.json({ success: true, message: "Form oluşturuldu." });
    }
  } catch (error) {
    console.error("[Form Save Error]:", error);
    return res.status(500).json({ error: "Form kaydedilemedi." });
  }
});

// Form Sil (DELETE - YALNIZCA ADMIN)
formsRouter.delete("/:id", async (req, res) => {
  try {
    const user = await authenticateRequest(req);
    if (!user) {
      return res.status(401).json({ error: "Yetkisiz işlem: Lütfen giriş yapınız." });
    }

    if (user.role !== "ADMIN" || user.permissions?.canDelete === false) {
      return res.status(403).json({
        error: "Yetkisiz işlem: Editör kullanıcıları form şablonlarını silemez. Silme yetkisi yalnızca Yöneticiye aittir.",
      });
    }

    const { id } = req.params;

    await db.delete(forms).where(eq(forms.id, id));
    return res.json({ success: true, message: "Form başarıyla silindi." });
  } catch (error) {
    console.error("[Form Delete Error]:", error);
    return res.status(500).json({ error: "Form silinemedi." });
  }
});

// Form Aktif/Pasif Durumunu Güncelle (PATCH)
formsRouter.patch("/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { password, isActive } = req.body || {};
    const validPassword = process.env.ADMIN_PASSWORD || "kalem1997";

    if (password !== validPassword) {
      return res.status(401).json({ error: "Yetkisiz işlem: Geçersiz şifre." });
    }

    await db
      .update(forms)
      .set({
        isActive: Boolean(isActive),
        updatedAt: new Date(),
      })
      .where(eq(forms.id, id));

    return res.json({
      success: true,
      message: `Form ${isActive ? "aktif" : "pasif"} hale getirildi.`,
    });
  } catch (error) {
    console.error("[Form Status Error]:", error);
    return res.status(500).json({ error: "Form durumu güncellenemedi." });
  }
});

// Slug ile Form Tanımı Getir
formsRouter.get("/:slug", async (req, res) => {
  try {
    const { slug } = req.params;
    const formRecord = await db.select().from(forms).where(eq(forms.slug, slug)).get();

    if (!formRecord || !formRecord.isActive) {
      return res.status(404).json({ error: "Form bulunamadı veya pasif durumda." });
    }

    return res.json({
      success: true,
      form: {
        id: formRecord.id,
        slug: formRecord.slug,
        title: formRecord.title,
        description: formRecord.description,
        category: formRecord.category,
        fields: JSON.parse(formRecord.fields || "[]"),
        settings: JSON.parse(formRecord.settings || "{}"),
      },
    });
  } catch (error) {
    console.error("[Form Get Error]:", error);
    return res.status(500).json({ error: "Form yüklenemedi." });
  }
});

// Forma Yanıt Gönder (Submission)
formsRouter.post("/:slug", async (req, res) => {
  try {
    const { slug } = req.params;
    const {
      formData,
      files,
      honeypot,
      formLoadedAt,
      challengeToken,
      challengeAnswer,
      kvkkConsent,
      lang = "tr",
    } = req.body || {};
    const visitorLang = String(lang || formData?.lang || "tr").toLowerCase();

    // 1. Merkezi Spam ve Güvenlik Denetimi (KVKK onayı, İnsan doğrulaması, Honeypot, Süre tuzağı, Maksimum 2 dosya)
    const spamCheck = await validateFormSpamGuard({
      honeypot: honeypot || formData?.honeypot,
      formLoadedAt: formLoadedAt || formData?.formLoadedAt,
      challengeToken: challengeToken || formData?.challengeToken,
      challengeAnswer: challengeAnswer || formData?.challengeAnswer,
      kvkkConsent: kvkkConsent !== undefined ? kvkkConsent : formData?.kvkkConsent,
      files: files || [],
      maxFiles: 2,
      ip: req.ip,
    });

    if (!spamCheck.valid) {
      return res.status(400).json({ error: spamCheck.reason || "Güvenlik denetimi başarısız oldu." });
    }

    // 2. Maksimum 2 Dosya Kontrolü
    if (Array.isArray(files) && files.length > 2) {
      return res.status(400).json({ error: "Forma en fazla 2 adet dosya ekleyebilirsiniz." });
    }

    const formRecord = await db.select().from(forms).where(eq(forms.slug, slug)).get();
    if (!formRecord || !formRecord.isActive) {
      return res.status(404).json({ error: "Geçersiz veya yayından kaldırılmış form." });
    }

    const fields = JSON.parse(formRecord.fields || "[]");
    const settings = JSON.parse(formRecord.settings || "{}");

    // Zorunlu alan kontrolü
    for (const field of fields) {
      if (field.required && (!formData || !formData[field.name] || String(formData[field.name]).trim() === "")) {
        return res.status(400).json({ error: `Lütfen zorunlu alanı doldurunuz: ${field.label}` });
      }
    }

    const refCode =
      req.body?.refCode ||
      req.body?.formData?.refCode ||
      `TK-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const submissionId = `SUB-${refCode}`;
    const now = new Date();

    const submissionData = {
      ...(formData || {}),
      _lang: visitorLang,
    };

    await db.insert(formSubmissions).values({
      id: submissionId,
      formSlug: slug,
      data: JSON.stringify(submissionData),
      files: JSON.stringify(files || []),
      status: "NEW",
      createdAt: now,
      updatedAt: now,
    });

    // Otomatik E-Posta Bildirimi (Ziyaretçinin Seçtiği Dilde ve Form Alan Tanımlarıyla)
    handleFormSubmissionEmail(
      slug,
      formRecord.title,
      submissionData,
      files || [],
      refCode,
      settings,
      visitorLang,
      fields
    ).catch((err) => console.error("[Form Email Error]:", err));

    const localizedSuccessMsgs: Record<string, string> = {
      en: "Your quote request has been received successfully. Our customs broker will contact you shortly.",
      ar: "تم استلام طلبكم بنجاح. سيتواصل معكم مستشارنا الجمركي في أقرب وقت.",
      es: "Su solicitud ha sido recibida con éxito. Nuestro agente de aduanas se pondrá en contacto en breve.",
      tr: settings.successMessage || "Talebiniz başarıyla alınmıştır. En kısa sürede sizinle iletişime geçilecektir.",
    };

    const finalClientMessage =
      visitorLang !== "tr"
        ? localizedSuccessMsgs[visitorLang] || localizedSuccessMsgs.en
        : settings.successMessage || localizedSuccessMsgs.tr;

    return res.json({
      success: true,
      refCode,
      submissionId,
      message: finalClientMessage,
    });
  } catch (error) {
    console.error("[Form Submit Error]:", error);
    return res.status(500).json({ error: "Form kaydedilirken bir hata oluştu." });
  }
});

async function handleFormSubmissionEmail(
  formSlug: string,
  formTitle: string,
  data: Record<string, any>,
  files: any[],
  refCode: string,
  settings: any,
  lang: string = "tr",
  fieldsDef: any[] = []
) {
  const transporter = getMailer();
  const smtpUser = process.env.SMTP_USER;
  // Hedef e-posta: Öncelik kadir.kaya@kayapermit.com (CONTACT_RECEIVER)
  const companyEmail = process.env.CONTACT_RECEIVER || settings.notificationEmail || "kadir.kaya@kayapermit.com";

  if (!transporter || !smtpUser) {
    console.warn(`[Form Mailer] SMTP yapilandirmasi eksik. Form e-postasi gonderilemedi: [${refCode}] -> ${companyEmail}`);
    return;
  }

  const customerEmail = data.email || data.eposta || data.mail;
  const customerName = fixUtf8Mojibake(data.fullName || data.adsoyad || data.name || "Sayın Yetkili");
  const siteBaseUrl = process.env.SITE_URL || process.env.RENDER_EXTERNAL_URL || "https://kalemgumruk.com";

  // Gerçek e-posta eki (Attachments) oluştur - UTF-8 karakter onarımı ile
  const mailAttachments: Array<{ filename: string; path: string }> = [];
  if (Array.isArray(files) && files.length > 0) {
    for (const f of files) {
      const rawUrl = typeof f?.url === "string" ? f.url : "";
      const filenameOnDisk = f?.key || (rawUrl ? path.basename(rawUrl) : "");
      if (!filenameOnDisk) continue;
      const absPath = path.join(uploadsDir, filenameOnDisk);
      if (fs.existsSync(absPath)) {
        mailAttachments.push({
          filename: fixUtf8Mojibake(f.name || filenameOnDisk),
          path: absPath,
        });
      }
    }
  }

  // Modern, optimize edilmiş kurumsal HTML e-posta tasarımı oluştur
  const renderedAdmin = renderFormSubmissionAdminEmail({
    formSlug,
    formTitle,
    refCode,
    data,
    fieldsDef,
    files,
    lang,
    siteBaseUrl,
  });

  // Yetkili Gümrük Müşaviri / Admin Bildirimi Gönder
  try {
    const res = await sendEmailUnified({
      from: `"Kalem Gümrük Web Formu" <${process.env.SMTP_FROM || smtpUser || "bilgi@kalemgumruk.com"}>`,
      to: companyEmail,
      replyTo: customerEmail || undefined,
      subject: renderedAdmin.subject,
      html: renderedAdmin.html,
      attachments: mailAttachments,
    });
    console.log(`[Form Mailer] Form bildirimi başarıyla iletildi: [${refCode}] -> ${companyEmail} (MsgID: ${res.messageId})`);
  } catch (err: any) {
    console.error(`[Form Mailer] Form bildirimi e-postası iletilemedi: [${refCode}] -> ${companyEmail}:`, err?.message || err);
  }

  // Müşteriye / Başvuru Sahibine Otomatik Onay E-postası Gönder
  if (customerEmail) {
    try {
      const conf = renderCustomerConfirmationEmail({
        refCode,
        fullName: customerName,
        serviceOrTitle: formTitle,
        lang,
      });

      const custRes = await sendEmailUnified({
        from: `"Kalem Gümrük Müşavirliği" <${process.env.SMTP_FROM || smtpUser || "bilgi@kalemgumruk.com"}>`,
        to: customerEmail,
        subject: conf.subject,
        html: conf.html,
      });
      console.log(`[Form Mailer] ✅ Müşteri onay e-postası gönderildi: [${refCode}] -> ${customerEmail} (MsgID: ${custRes.messageId})`);
    } catch (err: any) {
      console.warn(`[Form Mailer] ⚠️ Müşteri onay e-postası gönderilemedi (${customerEmail}):`, err?.message || err);
    }
  }
}
