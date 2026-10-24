import nodemailer from "nodemailer";

export function getMailer() {
  const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
  const smtpPort = Number(process.env.SMTP_PORT || 465);
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  if (!smtpUser || !smtpPass) {
    return null;
  }

  // Gmail veya özel SMTP yapılandırması
  const isGmail = smtpHost.includes("gmail") || process.env.SMTP_SERVICE === "gmail";

  if (isGmail) {
    return nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: smtpUser,
        pass: smtpPass, // 16 haneli Google Uygulama Şifresi
      },
    });
  }

  return nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: { user: smtpUser, pass: smtpPass },
    tls: {
      rejectUnauthorized: false,
    },
  });
}

const langDisplayMap: Record<string, string> = {
  tr: "🇹🇷 Türkçe",
  en: "🇬🇧 English (İngilizce)",
  ar: "🇸🇦 العربية (Arapça)",
  es: "🇪🇸 Español (İspanyolca)",
};

export const langBadgeMap: Record<string, string> = {
  tr: "TR 🇹🇷",
  en: "EN 🇬🇧",
  ar: "AR 🇸🇦",
  es: "ES 🇪🇸",
};

export interface CustomerConfirmationParams {
  refCode: string;
  fullName: string;
  serviceOrTitle: string;
  lang?: string;
}

export function getCustomerConfirmationEmail({
  refCode,
  fullName,
  serviceOrTitle,
  lang = "tr",
}: CustomerConfirmationParams): { subject: string; html: string } {
  const cleanLang = (lang || "tr").toLowerCase();

  switch (cleanLang) {
    case "en":
      return {
        subject: `[${refCode}] Your Customs Inquiry Received | Kalem Customs Brokerage`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
            <div style="background-color: #1E2A3A; padding: 22px; color: #ffffff; text-align: center;">
              <h2 style="margin: 0; font-size: 20px; color: #ffffff;">Kalem Customs Brokerage</h2>
              <p style="margin: 5px 0 0 0; color: #44B9CD; font-size: 13px;">Accredited Customs & Foreign Trade Partner Since 1997</p>
            </div>
            <div style="padding: 24px; color: #334155; line-height: 1.6; font-size: 14px;">
              <p>Dear <strong>${fullName}</strong>,</p>
              <p>Thank you for contacting Kalem Customs Brokerage. We have successfully received your inquiry regarding <strong>${serviceOrTitle || "Customs Clearance"}</strong>.</p>
              <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; padding: 12px 16px; border-radius: 8px; margin: 18px 0;">
                <p style="margin: 0; font-size: 13px; color: #166534;">
                  <strong>Tracking / Reference Code:</strong> <span style="font-family: monospace; font-size: 15px; font-weight: bold;">${refCode}</span>
                </p>
              </div>
              <p>Our licensed customs broker is reviewing your details and will contact you shortly via email or phone.</p>
              <p style="margin-top: 20px; font-size: 13px; color: #64748b;">For urgent operational matters, you can also reach our desk directly via WhatsApp at +90 544 972 29 57.</p>
              <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
              <p style="margin: 0; font-size: 12px; color: #94a3b8; text-align: center;">Kalem Gümrük Müşavirliği Ltd. Şti. | Ümraniye, Istanbul / Turkey</p>
            </div>
          </div>
        `,
      };

    case "ar":
      return {
        subject: `[${refCode}] تم استلام طلبكم للتخليص الجمركي | شركة قلم للتخليص الجمركي`,
        html: `
          <div dir="rtl" style="font-family: Arial, Tahoma, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; text-align: right;">
            <div style="background-color: #1E2A3A; padding: 22px; color: #ffffff; text-align: center;">
              <h2 style="margin: 0; font-size: 20px; color: #ffffff;">شركة قلم للتخليص والاستشارات الجمركية</h2>
              <p style="margin: 5px 0 0 0; color: #44B9CD; font-size: 13px;">شريككم المعتمد والموثوق في التجارة الدولية منذ 1997</p>
            </div>
            <div style="padding: 24px; color: #334155; line-height: 1.8; font-size: 14px;">
              <p>السادة / <strong>${fullName}</strong> المحترمون،</p>
              <p>نشكركم على تواصلكم مع شركة قلم للتخليص الجمركي. تم استلام طلبكم الخاص بـ <strong>${serviceOrTitle || "خدمات التخليص الجمركي"}</strong> بنجاح.</p>
              <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; padding: 12px 16px; border-radius: 8px; margin: 18px 0;">
                <p style="margin: 0; font-size: 13px; color: #166534;">
                  <strong>رقم المرجع والمتابعة:</strong> <span style="font-family: monospace; font-size: 15px; font-weight: bold;">${refCode}</span>
                </p>
              </div>
              <p>يقوم مستشارنا الجمركي المعتمد حالياً بدراسة طلبكم وسيتواصل معكم في أقرب وقت عبر البريد الإلكتروني أو الهاتف.</p>
              <p style="margin-top: 20px; font-size: 13px; color: #64748b;">للاستفسارات العاجلة، يسعدنا تواصلكم المباشر عبر الواتساب: 905449722957+.</p>
              <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
              <p style="margin: 0; font-size: 12px; color: #94a3b8; text-align: center;">شركة قلم للتخليص الجمركي المحدودة | إسطنبول - تركيا</p>
            </div>
          </div>
        `,
      };

    case "es":
      return {
        subject: `[${refCode}] Solicitud de Despacho Aduanero Recibida | Kalem Aduanas`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
            <div style="background-color: #1E2A3A; padding: 22px; color: #ffffff; text-align: center;">
              <h2 style="margin: 0; font-size: 20px; color: #ffffff;">Kalem Agentes de Aduanas</h2>
              <p style="margin: 5px 0 0 0; color: #44B9CD; font-size: 13px;">Su socio acreditado en comercio exterior desde 1997</p>
            </div>
            <div style="padding: 24px; color: #334155; line-height: 1.6; font-size: 14px;">
              <p>Estimado/a <strong>${fullName}</strong>,</p>
              <p>Gracias por contactar con Kalem Aduanas. Hemos recibido con éxito su solicitud referente a <strong>${serviceOrTitle || "Despacho Aduanero"}</strong>.</p>
              <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; padding: 12px 16px; border-radius: 8px; margin: 18px 0;">
                <p style="margin: 0; font-size: 13px; color: #166534;">
                  <strong>Código de Referencia / Seguimiento:</strong> <span style="font-family: monospace; font-size: 15px; font-weight: bold;">${refCode}</span>
                </p>
              </div>
              <p>Nuestro agente de aduanas colegiado revisará los detalles y se pondrá en contacto con usted a la brevedad.</p>
              <p style="margin-top: 20px; font-size: 13px; color: #64748b;">Para consultas operativas urgentes, puede comunicarse directamente por WhatsApp al +90 544 972 29 57.</p>
              <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
              <p style="margin: 0; font-size: 12px; color: #94a3b8; text-align: center;">Kalem Gümrük Müşavirliği | Ümraniye, Estambul / Turquía</p>
            </div>
          </div>
        `,
      };

    case "tr":
    default:
      return {
        subject: `Talebiniz Alındı (#${refCode}) | Kalem Gümrük Müşavirliği`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
            <div style="background-color: #1E2A3A; padding: 20px; color: #ffffff; text-align: center;">
              <h3 style="margin: 0; color: #ffffff;">Kalem Gümrük Müşavirliği</h3>
              <p style="margin: 5px 0 0 0; color: #44B9CD; font-size: 13px;">1997'den Bugüne Güven ve Hız</p>
            </div>
            <div style="padding: 24px; color: #334155; line-height: 1.6; font-size: 14px;">
              <p>Sayın <strong>${fullName}</strong>,</p>
              <p>İletmiş olduğunuz talep <strong>#${refCode}</strong> takip kodu ile operasyon birimimize iletilmiştir. Yetkili gümrük müşavirimiz en kısa sürede sizinle irtibata geçecektir.</p>
              <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; padding: 12px 16px; border-radius: 8px; margin: 18px 0;">
                <p style="margin: 0; font-size: 13px; color: #166534;">
                  <strong>Talep Referans Numaranız:</strong> <span style="font-family: monospace; font-size: 15px; font-weight: bold;">${refCode}</span>
                </p>
              </div>
              <p>İlginiz için teşekkür eder, iyi çalışmalar dileriz.</p>
            </div>
          </div>
        `,
      };
  }
}

// 1. İletişim & Teklif Formu Bildirimi
export async function sendContactEmail({
  refCode,
  fullName,
  company,
  phone,
  email,
  serviceType,
  message,
  lang = "tr",
}: {
  refCode: string;
  fullName: string;
  company?: string;
  phone: string;
  email?: string;
  serviceType?: string;
  message: string;
  lang?: string;
}) {
  const transporter = getMailer();
  const receiverEmail = process.env.CONTACT_RECEIVER || "kadir.kaya@kayapermit.com";
  const smtpUser = process.env.SMTP_USER;

  const cleanLang = (lang || "tr").toLowerCase();
  const langBadge = langBadgeMap[cleanLang] || cleanLang.toUpperCase();
  const langLabel = langDisplayMap[cleanLang] || cleanLang;

  if (!transporter || !smtpUser) {
    console.log(`[Mailer] SMTP ayarı eksik. Form bildirimi konsola yazıldı: [${refCode}] ${fullName} (${phone}) [Lang: ${langLabel}] -> ${receiverEmail}`);
    return;
  }

  const cleanService = (serviceType || "İletişim")
    .replace(/Gümrükleme İşlemleri/gi, "")
    .replace(/Gümrükleme/gi, "")
    .replace(/İşlemleri/gi, "")
    .trim() || "İletişim";
  const companyTag = company && company !== "Bireysel" && company !== "-" ? ` (${company})` : "";
  const mailSubject = `[${refCode}] [${langBadge}] ${cleanService}: ${fullName}${companyTag}`;

  const emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
      <div style="background-color: #1E2A3A; padding: 20px; color: #ffffff; text-align: center;">
        <h2 style="margin: 0; font-size: 20px;">Yeni Web İletişim / Teklif Talebi</h2>
        <p style="margin: 5px 0 0 0; color: #44B9CD; font-size: 14px;">Talep Referans No: <strong>${refCode}</strong></p>
        <div style="display: inline-block; margin-top: 8px; background: rgba(68,185,205,0.2); border: 1px solid rgba(68,185,205,0.5); padding: 4px 10px; border-radius: 6px; font-size: 12px; color: #44B9CD;">
          🌐 Ziyaretçi Dili: <strong>${langLabel}</strong>
        </div>
      </div>
      <div style="padding: 24px; background-color: #ffffff;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; color: #64748b; font-weight: bold; width: 140px;">Adı Soyadı:</td>
            <td style="padding: 8px 0; color: #1e293b;">${fullName}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #64748b; font-weight: bold;">Firma:</td>
            <td style="padding: 8px 0; color: #1e293b;">${company || "-"}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #64748b; font-weight: bold;">Telefon:</td>
            <td style="padding: 8px 0; color: #1e293b;"><a href="tel:${phone}">${phone}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #64748b; font-weight: bold;">E-Posta:</td>
            <td style="padding: 8px 0; color: #1e293b;">${email || "-"}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #64748b; font-weight: bold;">İlgilenilen Hizmet:</td>
            <td style="padding: 8px 0; color: #1e293b; font-weight: 600; color: #44B9CD;">${serviceType || "Genel Bilgi"}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #64748b; font-weight: bold;">Seçilen Dil:</td>
            <td style="padding: 8px 0; color: #0284c7; font-weight: bold;">${langLabel}</td>
          </tr>
        </table>
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
        <div>
          <h4 style="margin: 0 0 8px 0; color: #1e293b;">Mesaj / Talep Detayı:</h4>
          <p style="margin: 0; color: #334155; line-height: 1.6; white-space: pre-wrap; background-color: #f8fafc; padding: 12px; border-radius: 6px;">${message}</p>
        </div>
      </div>
      <div style="background-color: #f1f5f9; padding: 12px; text-align: center; color: #94a3b8; font-size: 12px;">
        Bu mesaj Kalem Gümrük Müşavirliği web sitesi üzerinden (#${refCode}) referansıyla doğrudan iletilmiştir.
      </div>
    </div>
  `;

  // Şirkete / Kadir Bey'e bildirim
  await transporter.sendMail({
    from: `"Kalem Gümrük Web Formu" <${smtpUser}>`,
    to: receiverEmail,
    replyTo: email || undefined,
    subject: mailSubject,
    html: emailHtml,
  });

  // Müşteriye kendi dilinde otomatik onay e-postası (varsa)
  if (email) {
    try {
      const conf = getCustomerConfirmationEmail({
        refCode,
        fullName,
        serviceOrTitle: serviceType || "İletişim ve Danışmanlık",
        lang,
      });

      await transporter.sendMail({
        from: `"Kalem Gümrük Müşavirliği" <${smtpUser}>`,
        to: email,
        subject: conf.subject,
        html: conf.html,
      });
    } catch (err) {
      console.warn("[Mailer] Müşteri onay maili gönderilemedi:", err);
    }
  }
}

// 2. Chatbot Mesajları & Canlı Lead Bildirimi
export async function sendChatLeadEmail({
  refCode,
  contactInfo,
  contactName,
  question,
  messages,
  lang = "tr",
}: {
  refCode: string;
  contactInfo?: string;
  contactName?: string;
  question?: string;
  messages: Array<{ sender: string; text: string; time?: string }>;
  lang?: string;
}) {
  const transporter = getMailer();
  const receiverEmail = process.env.CONTACT_RECEIVER || "kadir.kaya@kayapermit.com";
  const smtpUser = process.env.SMTP_USER;

  const cleanLang = (lang || "tr").toLowerCase();
  const langBadge = langBadgeMap[cleanLang] || cleanLang.toUpperCase();
  const langLabel = langDisplayMap[cleanLang] || cleanLang;

  // Kısa ve anlaşılır başlık üretimi
  let clientDisplay = contactName?.trim() || "";
  if (!clientDisplay && contactInfo) {
    if (contactInfo.toLowerCase().includes("whatsapp")) {
      clientDisplay = "WhatsApp";
    } else {
      const clean = contactInfo.split(/\s*\(|- Tel:/)[0].trim();
      clientDisplay = clean || "Ziyaretçi";
    }
  }
  if (!clientDisplay) clientDisplay = "Ziyaretçi";

  const mailSubject = `[${refCode}] [${langBadge}] Chatbot: ${clientDisplay}`;

  if (!transporter || !smtpUser) {
    console.log(`[Mailer] SMTP ayarı eksik. Chatbot mesajı konsola yazıldı: ${mailSubject} -> ${receiverEmail}`);
    return;
  }

  const messagesHtml = messages
    .map((m) => {
      const isUser = m.sender === "user";
      const bg = isUser ? "#e0f2fe" : "#f1f5f9";
      const align = isUser ? "right" : "left";
      const senderLabel = isUser ? "👤 Ziyaretçi" : "🤖 Kalem Asistan";
      return `
        <div style="text-align: ${align}; margin-bottom: 10px;">
          <div style="display: inline-block; max-width: 85%; text-align: left; background: ${bg}; padding: 10px 14px; border-radius: 8px; font-size: 13px;">
            <div style="font-weight: bold; font-size: 11px; color: #475569; margin-bottom: 4px;">${senderLabel} ${m.time ? `<span style="font-weight: normal; color: #94a3b8;">(${m.time})</span>` : ""}</div>
            <div style="color: #0f172a; white-space: pre-wrap; line-height: 1.4;">${m.text}</div>
          </div>
        </div>
      `;
    })
    .join("");

  const emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
      <div style="background-color: #1E2A3A; padding: 20px; color: #ffffff; text-align: center;">
        <h2 style="margin: 0; font-size: 20px;">💬 Web Chatbot Ziyaretçi Talebi</h2>
        <p style="margin: 5px 0 0 0; color: #44B9CD; font-size: 14px;">Referans Kodu: <strong>${refCode}</strong></p>
        <div style="display: inline-block; margin-top: 8px; background: rgba(68,185,205,0.2); border: 1px solid rgba(68,185,205,0.5); padding: 4px 10px; border-radius: 6px; font-size: 12px; color: #44B9CD;">
          🌐 Ziyaretçi Dili: <strong>${langLabel}</strong>
        </div>
      </div>
      <div style="padding: 20px; background-color: #ffffff;">
        <div style="background-color: #f8fafc; border-left: 4px solid #44B9CD; padding: 12px 16px; margin-bottom: 18px; border-radius: 4px;">
          <p style="margin: 0 0 6px 0; color: #64748b; font-size: 12px; font-weight: bold;">İLETİŞİM BİLGİSİ:</p>
          <p style="margin: 0; color: #0f172a; font-size: 15px; font-weight: bold;">${contactInfo || "Ziyaretçi henüz iletişim bilgisi bırakmadı (veya doğrudan WhatsApp'a yöneldi)"}</p>
        </div>

        ${
          question
            ? `
          <div style="margin-bottom: 18px;">
            <p style="margin: 0 0 4px 0; color: #64748b; font-size: 12px; font-weight: bold;">MÜŞTERİNİN İLK SORUSU / ÖZETİ:</p>
            <p style="margin: 0; color: #1e293b; font-size: 14px; background: #fffbeb; border: 1px solid #fef3c7; padding: 10px; border-radius: 6px;">${question}</p>
          </div>
        `
            : ""
        }

        <h4 style="margin: 20px 0 10px 0; color: #1e293b; font-size: 14px; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px;">
          Sohbet Geçmişi:
        </h4>
        <div style="background: #ffffff; padding: 10px 0;">
          ${messagesHtml || "<p style='color: #94a3b8; font-size: 13px;'>Mesaj detayı bulunamadı.</p>"}
        </div>
      </div>
      <div style="background-color: #f1f5f9; padding: 12px; text-align: center; color: #94a3b8; font-size: 12px;">
        Bu kayıt Kalem Gümrük web sitesindeki canlı sohbet asistanından anında CRM'e kaydedilmiş ve iletilmiştir.
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: `"Kalem Gümrük Web Chatbot" <${smtpUser}>`,
    to: receiverEmail,
    subject: mailSubject,
    html: emailHtml,
  });
}
