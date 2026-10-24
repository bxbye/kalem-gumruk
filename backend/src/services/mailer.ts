import nodemailer from "nodemailer";

export function getMailer() {
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = Number(process.env.SMTP_PORT || 587);
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  if (!smtpHost || !smtpUser || !smtpPass) {
    return null;
  }

  return nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: { user: smtpUser, pass: smtpPass },
  });
}

export async function sendContactEmail({
  refCode,
  fullName,
  company,
  phone,
  email,
  serviceType,
  message,
}: {
  refCode: string;
  fullName: string;
  company?: string;
  phone: string;
  email?: string;
  serviceType?: string;
  message: string;
}) {
  const transporter = getMailer();
  const receiverEmail = process.env.CONTACT_RECEIVER || "info@kalemgumruk.com";
  const smtpUser = process.env.SMTP_USER;

  if (!transporter || !smtpUser) {
    console.log(`[Mailer] SMTP ayarı eksik. Talep konsola yazıldı: [${refCode}] ${fullName} - ${phone}`);
    return;
  }

  const emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
      <div style="background-color: #1E2A3A; padding: 20px; color: #ffffff; text-align: center;">
        <h2 style="margin: 0; font-size: 20px;">Yeni Web İletişim / Teklif Talebi</h2>
        <p style="margin: 5px 0 0 0; color: #44B9CD; font-size: 14px;">Talep Referans No: <strong>${refCode}</strong></p>
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
        </table>
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
        <div>
          <h4 style="margin: 0 0 8px 0; color: #1e293b;">Mesaj / Talep Detayı:</h4>
          <p style="margin: 0; color: #334155; line-height: 1.6; white-space: pre-wrap; background-color: #f8fafc; padding: 12px; border-radius: 6px;">${message}</p>
        </div>
      </div>
      <div style="background-color: #f1f5f9; padding: 12px; text-align: center; color: #94a3b8; font-size: 12px;">
        Bu mesaj Kalem Gümrük Müşavirliği web sitesi üzerinden (#${refCode}) referansıyla iletilmiştir.
      </div>
    </div>
  `;

  // Şirkete bildirim
  await transporter.sendMail({
    from: `"Kalem Gümrük Web Formu" <${smtpUser}>`,
    to: receiverEmail,
    replyTo: email || undefined,
    subject: `[${refCode}] ${serviceType || "İletişim Talebi"} - ${fullName} (${company || "Bireysel"})`,
    html: emailHtml,
  });

  // Müşteriye onay e-postası
  if (email) {
    try {
      await transporter.sendMail({
        from: `"Kalem Gümrük Müşavirliği" <${smtpUser}>`,
        to: email,
        subject: `Talebiniz Alındı (#${refCode}) | Kalem Gümrük`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
            <div style="background-color: #1E2A3A; padding: 20px; color: #ffffff; text-align: center;">
              <h3 style="margin:0;">Kalem Gümrük Müşavirliği</h3>
              <p style="margin:5px 0 0 0; color: #44B9CD; font-size:13px;">Talebiniz Kaydedildi</p>
            </div>
            <div style="padding: 24px; color: #334155;">
              <p>Sayın <strong>${fullName}</strong>,</p>
              <p>İletmiş olduğunuz talep <strong>#${refCode}</strong> takip kodu ile operasyon birimimize iletilmiştir. Gümrük müşavirimiz en kısa sürede sizinle irtibata geçecektir.</p>
              <p>İlginiz için teşekkür eder, iyi çalışmalar dileriz.</p>
            </div>
          </div>
        `,
      });
    } catch (err) {
      console.warn("[Mailer] Müşteri onay maili gönderilemedi:", err);
    }
  }
}
