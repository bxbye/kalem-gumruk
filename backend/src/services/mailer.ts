import nodemailer, { type Transporter } from "nodemailer";
import { fixUtf8Mojibake } from "./storage.js";
import {
  renderFormSubmissionAdminEmail,
  renderCustomerConfirmationEmail,
} from "./emailTemplates.js";

let cachedTransporter: Transporter | null = null;
let lastSmtpConfigHash = "";

export interface MailAttachment {
  filename: string;
  path?: string;
  content?: Buffer | string;
  contentType?: string;
}

export interface SendMailOptions {
  from?: string;
  to: string | string[];
  replyTo?: string;
  subject: string;
  html: string;
  attachments?: MailAttachment[];
}

/**
 * Gönderici (From) başlığını formatlar: "Ad <email>" veya salt email
 */
function formatSender(rawFrom?: string): string {
  const defaultUser = process.env.SMTP_USER?.trim() || "bilgi@kalemgumruk.com";
  const configuredFrom = process.env.SMTP_FROM?.trim();
  const target = (rawFrom || configuredFrom || `"Kalem Gümrük" <${defaultUser}>`).trim();

  const emailMatch = target.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
  if (!emailMatch) return target;

  const email = emailMatch[1];
  let name = target.split("<")[0].replace(/["']/g, "").trim();
  if (!name) name = "Kalem Gümrük Müşavirliği";
  return `"${name}" <${email}>`;
}

/**
 * Nodemailer Transporter örneği oluşturur ve önbelleğe alır.
 */
export function getMailer(): Transporter | null {
  const smtpHost = process.env.SMTP_HOST?.trim() || "smtp.gmail.com";
  const smtpPort = Number(process.env.SMTP_PORT || 465);
  const smtpUser = process.env.SMTP_USER?.trim();
  const rawPass = process.env.SMTP_PASS?.trim();
  const smtpPass = rawPass ? rawPass.replace(/\s+/g, "") : "";

  const isSecure =
    process.env.SMTP_SECURE !== undefined
      ? process.env.SMTP_SECURE === "true" || process.env.SMTP_SECURE === "1"
      : smtpPort === 465;

  if (!smtpUser || !smtpPass) {
    return null;
  }

  const currentHash = `${smtpHost}:${smtpPort}:${isSecure}:${smtpUser}:${smtpPass}`;
  if (cachedTransporter && lastSmtpConfigHash === currentHash) {
    return cachedTransporter;
  }

  const isGmail = smtpHost.includes("gmail") || process.env.SMTP_SERVICE === "gmail";

  if (isGmail) {
    cachedTransporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });
  } else {
    cachedTransporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: isSecure,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
  }

  lastSmtpConfigHash = currentHash;
  return cachedTransporter;
}

/**
 * Bağımsız Standart E-Posta Gönderim Fonksiyonu (SMTP tabanlı)
 */
export async function sendEmailUnified(options: SendMailOptions): Promise<{ success: boolean; messageId?: string }> {
  const transporter = getMailer();
  const smtpUser = process.env.SMTP_USER?.trim();

  if (!transporter || !smtpUser) {
    throw new Error("E-posta yapılandırması eksik (SMTP_USER veya SMTP_PASS .env dosyasında tanımlı değil).");
  }

  const from = formatSender(options.from);

  const info = await transporter.sendMail({
    from,
    to: options.to,
    replyTo: options.replyTo,
    subject: options.subject,
    html: options.html,
    attachments: options.attachments?.map((a) => ({
      filename: fixUtf8Mojibake(a.filename),
      path: a.path,
      content: a.content,
      contentType: a.contentType,
    })),
  });

  return { success: true, messageId: info.messageId };
}

/**
 * SMTP Bağlantısını Doğrular ve Sağlık Durumunu Döner
 */
export async function verifySmtp(): Promise<{ ok: boolean; message: string; host?: string; user?: string; port?: number }> {
  const transporter = getMailer();
  const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
  const smtpPort = Number(process.env.SMTP_PORT || 465);
  const smtpUser = process.env.SMTP_USER;

  if (!transporter || !smtpUser) {
    return {
      ok: false,
      message: "SMTP yapılandırması eksik (SMTP_USER veya SMTP_PASS .env dosyasında bulunamadı).",
      host: smtpHost,
      port: smtpPort,
    };
  }

  try {
    await transporter.verify();
    return {
      ok: true,
      message: "SMTP bağlantısı ve kimlik doğrulama başarıyla sağlandı.",
      host: smtpHost,
      user: smtpUser,
      port: smtpPort,
    };
  } catch (error: any) {
    return {
      ok: false,
      message: `SMTP doğrulama hatası: ${error?.message || String(error)}`,
      host: smtpHost,
      user: smtpUser,
      port: smtpPort,
    };
  }
}

// Sembolsüz, kurumsal dil tanımları
const langDisplayMap: Record<string, string> = {
  tr: "Türkçe",
  en: "English",
  ar: "العربية",
  es: "Español",
};

export const langBadgeMap: Record<string, string> = {
  tr: "TR",
  en: "EN",
  ar: "AR",
  es: "ES",
};

export interface CustomerConfirmationParams {
  refCode: string;
  fullName: string;
  serviceOrTitle: string;
  lang?: string;
}

/**
 * Müşteriye Gönderilen Otomatik Bilgilendirme E-postası
 * Modern kurumsal tasarım
 */
export function getCustomerConfirmationEmail(params: CustomerConfirmationParams): { subject: string; html: string } {
  return renderCustomerConfirmationEmail(params);
}

// 1. İletişim & Teklif Formu Bildirimi (Yetkili Müşavire)
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
  const receiverEmail = process.env.CONTACT_RECEIVER || "kadir.kaya@kayapermit.com";
  const smtpUser = process.env.SMTP_USER;

  if (!getMailer() || !smtpUser) {
    console.warn(`[Mailer] SMTP yapilandirmasi eksik. Bildirim iletilemedi: [${refCode}] ${fullName} (${phone}) -> ${receiverEmail}`);
    return;
  }

  const renderedAdmin = renderFormSubmissionAdminEmail({
    formSlug: "iletisim",
    formTitle: serviceType ? `İletişim & Danışma: ${serviceType}` : "Genel İletişim & Danışma Formu",
    refCode,
    data: {
      fullName,
      company: company || "-",
      phone,
      email: email || "-",
      serviceType: serviceType || "Genel Bilgi",
      message,
    },
    lang,
    siteBaseUrl: process.env.SITE_URL || "https://kalemgumruk.com",
  });

  // Müşavire bildirim
  try {
    const res = await sendEmailUnified({
      to: receiverEmail,
      replyTo: email || undefined,
      subject: renderedAdmin.subject,
      html: renderedAdmin.html,
    });
    console.log(`[Mailer] Iletisim e-postasi iletildi: [${refCode}] -> ${receiverEmail} (MsgID: ${res.messageId})`);
  } catch (err: any) {
    console.error(`[Mailer] Iletisim e-postasi gonderim hatasi: [${refCode}] -> ${receiverEmail}:`, err?.message || err);
  }

  // Müşteriye onay e-postası
  if (email) {
    try {
      const conf = getCustomerConfirmationEmail({
        refCode,
        fullName,
        serviceOrTitle: serviceType || "İletişim ve Danışmanlık",
        lang,
      });

      const custRes = await sendEmailUnified({
        to: email,
        subject: conf.subject,
        html: conf.html,
      });
      console.log(`[Mailer] Musteri onay e-postasi iletildi: [${refCode}] -> ${email} (MsgID: ${custRes.messageId})`);
    } catch (err: any) {
      console.warn(`[Mailer] Musteri onay e-postasi gonderilemedi (${email}):`, err?.message || err);
    }
  }
}

// 2. Chatbot Mesajları & Ziyaretçi Bildirimi (Yetkili Müşavire)
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
  const receiverEmail = process.env.CONTACT_RECEIVER || "kadir.kaya@kayapermit.com";
  const smtpUser = process.env.SMTP_USER;

  const cleanLang = (lang || "tr").toLowerCase();
  const langBadge = langBadgeMap[cleanLang] || cleanLang.toUpperCase();
  const langLabel = langDisplayMap[cleanLang] || cleanLang;

  let clientDisplay = contactName?.trim() || "";
  if (!clientDisplay && contactInfo) {
    if (contactInfo.toLowerCase().includes("whatsapp")) {
      clientDisplay = "WhatsApp Yonlendirme";
    } else {
      const clean = contactInfo.split(/\s*\(|- Tel:/)[0].trim();
      clientDisplay = clean || "Ziyaretci";
    }
  }
  if (!clientDisplay) clientDisplay = "Ziyaretci";

  const mailSubject = `[${refCode}] [${langBadge}] Chatbot: ${clientDisplay}`;

  if (!getMailer() || !smtpUser) {
    console.warn(`[Mailer] SMTP yapilandirmasi eksik. Chatbot bildirimi iletilemedi: [${refCode}] -> ${receiverEmail}`);
    return;
  }

  const messagesHtml = messages
    .map((m) => {
      const isUser = m.sender === "user";
      const bg = isUser ? "#f0fdf4" : "#f8fafc";
      const borderColor = isUser ? "#bbf7d0" : "#e2e8f0";
      const senderLabel = isUser ? "Ziyaretci" : "Kalem Asistan";
      return `
        <div style="margin-bottom: 8px; border: 1px solid ${borderColor}; background-color: ${bg}; padding: 8px 12px; border-radius: 4px;">
          <div style="font-size: 11px; font-weight: bold; color: #475569; margin-bottom: 3px;">
            ${senderLabel} ${m.time ? `<span style="font-weight: normal; color: #94a3b8;">(${m.time})</span>` : ""}
          </div>
          <div style="color: #0f172a; font-size: 13px; line-height: 1.4; white-space: pre-wrap;">${m.text}</div>
        </div>
      `;
    })
    .join("");

  const siteBaseUrl = process.env.SITE_URL || process.env.RENDER_EXTERNAL_URL || "https://kalemgumruk.com";
  const emailHtml = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 580px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; color: #1e293b; background-color: #ffffff;">
      <div style="background-color: #1E2A3A; padding: 20px 24px; color: #ffffff;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td style="vertical-align: middle;">
              <a href="${siteBaseUrl}" target="_blank" style="text-decoration: none; display: inline-block;">
                <img src="${siteBaseUrl}/logo-white.png" alt="Kalem Gümrük Müşavirliği" width="140" height="40" style="display: block; border: 0; max-width: 140px; height: auto;" />
              </a>
            </td>
            <td align="right" style="vertical-align: middle;">
              <span style="display: inline-block; background-color: rgba(68, 185, 205, 0.15); border: 1px solid #44B9CD; color: #44B9CD; font-size: 11px; font-weight: 700; padding: 3px 8px; border-radius: 4px; font-family: monospace;">
                ${refCode}
              </span>
            </td>
          </tr>
        </table>
        <div style="font-size: 15px; font-weight: 700; color: #ffffff; margin-top: 12px; padding-top: 10px; border-top: 1px solid rgba(255, 255, 255, 0.12);">
          Web Danışma ve Chatbot Kaydı
        </div>
      </div>
      <div style="padding: 20px 24px; background-color: #ffffff; font-size: 13px; line-height: 1.5;">
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 16px;">
          <tr style="border-bottom: 1px solid #e5e7eb;">
            <td style="padding: 8px 0; color: #64748b; font-weight: 600; width: 130px;">İletişim Bilgisi:</td>
            <td style="padding: 8px 0; color: #0f172a; font-weight: 600;">${contactInfo || "İletişim bilgisi girilmedi"}</td>
          </tr>
          ${
            question
              ? `
          <tr style="border-bottom: 1px solid #e5e7eb;">
            <td style="padding: 8px 0; color: #64748b; font-weight: 600;">Başlangıç Sorusu:</td>
            <td style="padding: 8px 0; color: #0f172a;">${question}</td>
          </tr>
          `
              : ""
          }
          <tr>
            <td style="padding: 8px 0; color: #64748b; font-weight: 600;">Kayıt Zamanı:</td>
            <td style="padding: 8px 0; color: #0f172a;">${new Date().toLocaleString("tr-TR")}</td>
          </tr>
        </table>

        <div style="font-weight: 700; color: #1e293b; margin-bottom: 8px; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px; font-size: 12px; text-transform: uppercase;">
          Sohbet Geçmişi (${messages.length} Mesaj)
        </div>
        <div>
          ${messagesHtml || "<p style='color: #94a3b8;'>Mesaj kaydı bulunmuyor.</p>"}
        </div>
      </div>
      <div style="background-color: #1E2A3A; padding: 14px 24px; font-size: 11px; color: #94a3b8; text-align: center;">
        Kalem Gümrük Müşavirliği Ltd. Şti. | Ref: #${refCode}
      </div>
    </div>
  `;

  try {
    const res = await sendEmailUnified({
      to: receiverEmail,
      subject: mailSubject,
      html: emailHtml,
    });
    console.log(`[Mailer] Chatbot e-postasi iletildi: [${refCode}] -> ${receiverEmail} (MsgID: ${res.messageId})`);
  } catch (err: any) {
    console.error(`[Mailer] Chatbot e-postasi gonderim hatasi: [${refCode}] -> ${receiverEmail}:`, err?.message || err);
  }
}

// 3. Test E-postası Gönderimi
export async function sendTestEmail(targetEmail?: string): Promise<{ success: boolean; message: string; messageId?: string }> {
  const receiverEmail = targetEmail || process.env.CONTACT_RECEIVER || "kadir.kaya@kayapermit.com";
  const smtpUser = process.env.SMTP_USER;

  if (!getMailer() || !smtpUser) {
    return {
      success: false,
      message: "SMTP yapilandirmasi eksik (SMTP_USER veya SMTP_PASS tanimli degil).",
    };
  }

  const testRef = `TEST-${Date.now().toString().slice(-4)}`;
  const siteBaseUrl = process.env.SITE_URL || process.env.RENDER_EXTERNAL_URL || "https://kalemgumruk.com";
  try {
    const res = await sendEmailUnified({
      to: receiverEmail,
      subject: `[${testRef}] E-Posta Servis Doğrulama Testi - Kalem Gümrük`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 550px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; color: #1e293b; background-color: #ffffff;">
          <div style="background-color: #1E2A3A; padding: 20px 24px; color: #ffffff;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td style="vertical-align: middle;">
                  <a href="${siteBaseUrl}" target="_blank" style="text-decoration: none; display: inline-block;">
                    <img src="${siteBaseUrl}/logo-white.png" alt="Kalem Gümrük Müşavirliği" width="140" height="40" style="display: block; border: 0; max-width: 140px; height: auto;" />
                  </a>
                </td>
                <td align="right" style="vertical-align: middle;">
                  <span style="display: inline-block; background-color: rgba(68, 185, 205, 0.15); border: 1px solid #44B9CD; color: #44B9CD; font-size: 11px; font-weight: 700; padding: 3px 8px; border-radius: 4px; font-family: monospace;">
                    ${testRef}
                  </span>
                </td>
              </tr>
            </table>
            <div style="font-size: 15px; font-weight: 700; color: #ffffff; margin-top: 12px; padding-top: 10px; border-top: 1px solid rgba(255, 255, 255, 0.12);">
              SMTP Servis Doğrulama Testi
            </div>
          </div>
          <div style="padding: 20px 24px; font-size: 13px; line-height: 1.6;">
            <p style="margin-top: 0; color: #334155;">Bu e-posta, sistem bildirim servisinin SMTP bağlantısı üzerinden eksiksiz çalıştığını doğrulamak amacıyla gönderilmiştir.</p>
            <table style="width: 100%; border-collapse: collapse; background-color: #f8fafc; border: 1px solid #e2e8f0; margin: 14px 0; border-radius: 6px; overflow: hidden;">
              <tr>
                <td style="padding: 10px 14px; font-weight: 600; width: 120px; color: #64748b; border-bottom: 1px solid #e2e8f0;">Bağlantı:</td>
                <td style="padding: 10px 14px; color: #0f172a; font-weight: 600; border-bottom: 1px solid #e2e8f0;">SMTP Aktif</td>
              </tr>
              <tr>
                <td style="padding: 10px 14px; font-weight: 600; color: #64748b; border-bottom: 1px solid #e2e8f0;">Tarih:</td>
                <td style="padding: 10px 14px; color: #0f172a; border-bottom: 1px solid #e2e8f0;">${new Date().toLocaleString("tr-TR")}</td>
              </tr>
              <tr>
                <td style="padding: 10px 14px; font-weight: 600; color: #64748b;">Hedef Alıcı:</td>
                <td style="padding: 10px 14px; color: #0f172a;">${receiverEmail}</td>
              </tr>
            </table>
            <p style="margin-bottom: 0; font-size: 11.5px; color: #64748b;">Tüm form ve danışma bildirimleri Kalem Gümrük kurumsal standartlarında iletilmektedir.</p>
          </div>
          <div style="background-color: #1E2A3A; padding: 14px 24px; font-size: 11px; color: #94a3b8; text-align: center;">
            Kalem Gümrük Müşavirliği Ltd. Şti. | Ümraniye, İstanbul
          </div>
        </div>
      `,
    });

    console.log(`[Mailer] Test e-postasi iletildi: -> ${receiverEmail} (MsgID: ${res.messageId})`);
    return {
      success: true,
      message: `Test e-postasi basariyla iletildi (${receiverEmail})`,
      messageId: res.messageId,
    };
  } catch (err: any) {
    console.error(`[Mailer] Test e-postasi gonderilemedi: -> ${receiverEmail}:`, err?.message || err);
    return {
      success: false,
      message: `Test e-postasi gonderilemedi: ${err?.message || String(err)}`,
    };
  }
}
