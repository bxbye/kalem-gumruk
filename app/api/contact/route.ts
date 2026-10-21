import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fullName, company, phone, email, serviceType, message, honeypot } = body;

    // Spam / Bot engelleme (Görünmez alan doldurulduysa reddet)
    if (honeypot) {
      return NextResponse.json({ success: true, message: "İşlem başarılı." });
    }

    if (!fullName || !phone || !message) {
      return NextResponse.json(
        { error: "Lütfen zorunlu alanları (Ad Soyad, Telefon, Mesaj) doldurunuz." },
        { status: 400 }
      );
    }

    // SMTP Ayarları (Ortam değişkenlerinden alınır)
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = Number(process.env.SMTP_PORT || 587);
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const receiverEmail = process.env.CONTACT_RECEIVER || "info@kalemgumruk.com";

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #1E2A3A; padding: 20px; color: #ffffff; text-align: center;">
          <h2 style="margin: 0; font-size: 20px;">Yeni Web İletişim / Teklif Talebi</h2>
          <p style="margin: 5px 0 0 0; color: #44B9CD; font-size: 14px;">Kalem Gümrük Müşavirliği Web Sitesi</p>
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
          Bu mesaj kalemgumruk.com iletişim formu üzerinden gönderilmiştir.
        </div>
      </div>
    `;

    if (smtpHost && smtpUser && smtpPass) {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      await transporter.sendMail({
        from: `"Kalem Gümrük Web Formu" <${smtpUser}>`,
        to: receiverEmail,
        replyTo: email || undefined,
        subject: `[Web Form] ${serviceType || "İletişim Talebi"} - ${fullName} (${company || "Bireysel"})`,
        html: emailHtml,
      });
    } else {
      console.log("SMTP ayarları henüz girilmedi. Gelen form verisi:", {
        fullName,
        company,
        phone,
        email,
        serviceType,
        message,
      });
    }

    return NextResponse.json({
      success: true,
      message: "Talebiniz başarıyla alındı. Gümrük müşavirimiz en kısa sürede sizinle iletişime geçecektir.",
    });
  } catch (error) {
    console.error("Form gönderme hatası:", error);
    return NextResponse.json(
      { error: "Mesaj gönderilirken bir hata oluştu. Lütfen doğrudan telefon veya WhatsApp ile ulaşınız." },
      { status: 500 }
    );
  }
}
