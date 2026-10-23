import { NextResponse } from "next/server";
import { db } from "@/db";
import { forms, formSubmissions } from "@/db/schema";
import { eq } from "drizzle-orm";
import nodemailer from "nodemailer";

interface FormField {
  name: string;
  label: string;
  type: string;
  required?: boolean;
  placeholder?: string;
  options?: string[];
  helpText?: string;
}

interface FormSettings {
  successMessage?: string;
  autoEmailSubject?: string;
  autoEmailBody?: string;
  notificationEmail?: string;
}

// Belirli bir formun tanımını getir
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const formRecord = await db.select().from(forms).where(eq(forms.slug, slug)).get();

    if (!formRecord || !formRecord.isActive) {
      return NextResponse.json({ error: "Form bulunamadı veya pasif durumda." }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      form: {
        id: formRecord.id,
        slug: formRecord.slug,
        title: formRecord.title,
        description: formRecord.description,
        category: formRecord.category,
        fields: JSON.parse(formRecord.fields) as FormField[],
        settings: JSON.parse(formRecord.settings) as FormSettings,
      },
    });
  } catch (error) {
    console.error("Form getirme hatası:", error);
    return NextResponse.json({ error: "Form yüklenemedi." }, { status: 500 });
  }
}

// Form Yanıtını Kaydet ve Otomatik Mesaj Gönder
export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await request.json();
    const { formData, files, honeypot } = body;

    // Spam bot engeli
    if (honeypot) {
      return NextResponse.json({ success: true, message: "İşlem başarılı." });
    }

    // Form tanımını al
    const formRecord = await db.select().from(forms).where(eq(forms.slug, slug)).get();
    if (!formRecord || !formRecord.isActive) {
      return NextResponse.json({ error: "Geçersiz veya yayından kaldırılmış form." }, { status: 404 });
    }

    const fields = JSON.parse(formRecord.fields) as FormField[];
    const settings = JSON.parse(formRecord.settings) as FormSettings;

    // Zorunlu alan kontrolü
    for (const field of fields) {
      if (field.required && (!formData || !formData[field.name] || String(formData[field.name]).trim() === "")) {
        return NextResponse.json(
          { error: `Lütfen zorunlu alanı doldurunuz: ${field.label}` },
          { status: 400 }
        );
      }
    }

    // Benzersiz Başvuru / Talep Referans Kodu Üret: Örn: TK-2026-9482
    const refCode = `TK-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const submissionId = `SUB-${refCode}`;

    // Veritabanına Kaydet (D1 / SQLite)
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

    // Otomatik E-Posta Gönderimi (Müşteriye ve Şirkete)
    try {
      await handleEmailDispatch(slug, formRecord.title, formData, files, refCode, settings);
    } catch (emailErr) {
      console.error("E-posta gönderim uyarısı (İşlem DB'ye kaydedildi):", emailErr);
    }

    return NextResponse.json({
      success: true,
      refCode,
      submissionId,
      message: settings.successMessage || "Talebiniz başarıyla alınmıştır. En kısa sürede sizinle iletişime geçilecektir.",
    });
  } catch (error) {
    console.error("Form gönderme hatası:", error);
    return NextResponse.json({ error: "Form kaydedilirken bir hata oluştu." }, { status: 500 });
  }
}

// Otomatik E-posta Motoru
async function handleEmailDispatch(
  formSlug: string,
  formTitle: string,
  data: Record<string, any>,
  files: any[],
  refCode: string,
  settings: FormSettings
) {
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = Number(process.env.SMTP_PORT || 587);
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const companyEmail = settings.notificationEmail || process.env.CONTACT_RECEIVER || "info@kalemgumruk.com";

  if (!smtpHost || !smtpUser || !smtpPass) {
    console.log("SMTP ayarları bulunamadı. Form kaydı DB'ye başarıyla yazıldı:", {
      refCode,
      formSlug,
      data,
      files,
    });
    return;
  }

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: { user: smtpUser, pass: smtpPass },
  });

  const customerEmail = data.email || data.eposta || data.mail;
  const customerName = data.fullName || data.adsoyad || data.name || "Sayın Yetkili";

  // 1. Şirket Müşavirlerine Giden Bildirim E-postası
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

  // 2. Müşteriye Gönderilen Otomatik Bilgilendirme / Teşekkür E-postası
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
        <div style="background-color: #f1f5f9; padding: 16px; text-align: center; font-size: 12px; color: #64748b; line-height: 1.4;">
          <strong>Kalem Gümrük Müşavirliği Ltd. Şti.</strong><br/>
          Saray Mah. Dr. Adnan Büyükdeniz Cad. Akkom 2. Blok No:4 Ümraniye / İstanbul<br/>
          Tel: 0216 481 00 00 | E-Posta: info@kalemgumruk.com
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
