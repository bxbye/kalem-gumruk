import { Router } from "express";
import { db } from "../db/index.js";
import { forms, formSubmissions } from "../db/schema.js";
import { eq, desc } from "drizzle-orm";
import { getMailer } from "../services/mailer.js";

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
    const { password, id, slug, title, description, category, fields, settings, isActive } = req.body || {};
    const validPassword = process.env.ADMIN_PASSWORD || "kalem1997";

    if (password !== validPassword) {
      return res.status(401).json({ error: "Yetkisiz işlem: Geçersiz şifre." });
    }

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

// Form Sil (DELETE)
formsRouter.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const authHeader = (req.headers["authorization"] || req.headers["x-admin-password"]) as string | undefined;
    const password =
      req.body?.password ||
      req.query?.password ||
      (typeof authHeader === "string" ? authHeader.replace("Bearer ", "") : "");
    const validPassword = process.env.ADMIN_PASSWORD || "kalem1997";

    if (password !== validPassword) {
      return res.status(401).json({ error: "Yetkisiz işlem: Geçersiz şifre." });
    }

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
    const { formData, files, honeypot } = req.body || {};

    if (honeypot) {
      return res.json({ success: true, message: "İşlem başarılı." });
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

    const refCode = `TK-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const submissionId = `SUB-${refCode}`;
    const now = new Date();

    await db.insert(formSubmissions).values({
      id: submissionId,
      formSlug: slug,
      data: JSON.stringify(formData || {}),
      files: JSON.stringify(files || []),
      status: "NEW",
      createdAt: now,
      updatedAt: now,
    });

    // Otomatik E-Posta Bildirimi
    handleFormSubmissionEmail(slug, formRecord.title, formData || {}, files || [], refCode, settings).catch((err) =>
      console.error("[Form Email Error]:", err)
    );

    return res.json({
      success: true,
      refCode,
      submissionId,
      message: settings.successMessage || "Talebiniz başarıyla alınmıştır. En kısa sürede sizinle iletişime geçilecektir.",
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
  settings: any
) {
  const transporter = getMailer();
  const smtpUser = process.env.SMTP_USER;
  const companyEmail = settings.notificationEmail || process.env.CONTACT_RECEIVER || "info@kalemgumruk.com";

  if (!transporter || !smtpUser) return;

  const customerEmail = data.email || data.eposta || data.mail;
  const customerName = data.fullName || data.adsoyad || data.name || "Sayın Yetkili";

  const formDetailsHtml = Object.entries(data)
    .map(
      ([key, val]) =>
        `<tr><td style="padding: 6px 12px; font-weight: bold; color: #475569; border-bottom: 1px solid #e2e8f0;">${key}:</td><td style="padding: 6px 12px; color: #0f172a; border-bottom: 1px solid #e2e8f0;">${val}</td></tr>`
    )
    .join("");

  const filesHtml =
    files && files.length > 0
      ? `<div style="margin-top: 15px; padding: 12px; background-color: #f1f5f9; border-radius: 6px;">
          <strong>Ekli Dosyalar:</strong>
          <ul style="margin: 6px 0 0 0; padding-left: 20px;">
            ${files.map((f: any) => `<li><a href="${f.url}" target="_blank">${f.name} (${f.size || "Dosya"})</a></li>`).join("")}
          </ul>
        </div>`
      : "";

  const adminHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
      <div style="background-color: #1E2A3A; padding: 18px; color: #ffffff;">
        <h3 style="margin: 0; font-size: 18px;">📋 Yeni Form Yanıtı: ${formTitle}</h3>
        <p style="margin: 4px 0 0 0; color: #44B9CD; font-size: 13px;">Referans Kodu: <strong>${refCode}</strong></p>
      </div>
      <div style="padding: 20px; background-color: #ffffff;">
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          ${formDetailsHtml}
        </table>
        ${filesHtml}
      </div>
      <div style="background-color: #f8fafc; padding: 12px; font-size: 12px; color: #64748b; text-align: center;">
        Bu talep Kalem Gümrük Müşavirliği web sitesi üzerinden doğrudan iletilmiştir.
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: `"Kalem Gümrük Web Formu" <${smtpUser}>`,
    to: companyEmail,
    replyTo: customerEmail || undefined,
    subject: `[${refCode}] Yeni ${formTitle} - ${customerName}`,
    html: adminHtml,
  });

  if (customerEmail && settings.autoEmailSubject && settings.autoEmailBody) {
    const personalizedBody = settings.autoEmailBody
      .replace(/{{fullName}}/g, customerName)
      .replace(/{{refNo}}/g, refCode)
      .replace(/{{formTitle}}/g, formTitle)
      .replace(/\n/g, "<br/>");

    const customerHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #1E2A3A; padding: 20px; text-align: center; color: #ffffff;">
          <h2 style="margin: 0; font-size: 20px; color: #ffffff;">Kalem Gümrük Müşavirliği</h2>
          <p style="margin: 6px 0 0 0; color: #44B9CD; font-size: 13px;">1997'den Beri Güvenle Dış Ticaretin Hizmetinde</p>
        </div>
        <div style="padding: 24px; background-color: #ffffff; color: #334155; line-height: 1.6; font-size: 14px;">
          <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; padding: 12px 16px; border-radius: 8px; margin-bottom: 20px;">
            <p style="margin: 0; font-size: 13px; color: #166534;">
              <strong>Talep Referans Numaranız:</strong> <span style="font-family: monospace; font-size: 15px; font-weight: bold;">${refCode}</span>
            </p>
          </div>
          <div>${personalizedBody}</div>
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: `"Kalem Gümrük Müşavirliği" <${smtpUser}>`,
      to: customerEmail,
      subject: settings.autoEmailSubject.replace(/{{refNo}}/g, refCode),
      html: customerHtml,
    });
  }
}
