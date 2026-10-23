import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { db } from "@/db";
import { chatConversations } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { contactInfo, question, conversationHistory } = body;

    if (!contactInfo || !question) {
      return NextResponse.json(
        { error: "İletişim bilgisi veya soru eksik." },
        { status: 400 }
      );
    }

    const sessionId = `chat-session-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;

    // 1. Veritabanına Kaydet (D1 / SQLite)
    const now = new Date();
    await db.insert(chatConversations).values({
      id: `chat-${Date.now()}`,
      sessionId,
      contactInfo: contactInfo.trim(),
      question: question.trim(),
      messages: JSON.stringify(conversationHistory || []),
      status: "NEW",
      isLeadCaptured: true,
      createdAt: now,
      updatedAt: now,
    });

    // 2. Müşavire E-Posta Bildirimi Gönder
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = Number(process.env.SMTP_PORT || 587);
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const receiverEmail = process.env.CONTACT_RECEIVER || "info@kalemgumruk.com";

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #1E2A3A; padding: 20px; color: #ffffff; text-align: center;">
          <h2 style="margin: 0; font-size: 20px;">🤖 Yeni Web Chatbot Müşteri Talebi</h2>
          <p style="margin: 5px 0 0 0; color: #44B9CD; font-size: 14px;">Kalem Gümrük Müşavirliği Web Sitesi</p>
        </div>
        <div style="padding: 24px; background-color: #ffffff;">
          <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; padding: 14px; border-radius: 8px; margin-bottom: 20px;">
            <h4 style="margin: 0 0 6px 0; color: #166534; font-size: 14px;">Ziyaretçinin İletişim Bilgileri:</h4>
            <p style="margin: 0; font-size: 16px; font-weight: bold; color: #1e293b;">${contactInfo}</p>
          </div>

          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <tr>
              <td style="padding: 8px 0; color: #64748b; font-weight: bold; width: 140px; vertical-align: top;">Sorduğu Soru / Konu:</td>
              <td style="padding: 8px 0; color: #1e293b; background-color: #f8fafc; padding: 10px; border-radius: 6px;">${question}</td>
            </tr>
          </table>

          ${
            conversationHistory && conversationHistory.length > 0
              ? `
            <div style="border-top: 1px solid #e2e8f0; padding-top: 16px; margin-top: 16px;">
              <h4 style="margin: 0 0 10px 0; color: #475569; font-size: 12px; text-transform: uppercase;">Sohbet Geçmişi:</h4>
              <div style="background-color: #f8fafc; padding: 12px; border-radius: 6px; font-size: 12px; color: #334155; line-height: 1.5;">
                ${conversationHistory
                  .map(
                    (msg: { sender: string; text: string }) =>
                      `<div><strong>${msg.sender === "user" ? "Kullanıcı" : "Asistan"}:</strong> ${msg.text.replace(/\n/g, "<br/>")}</div>`
                  )
                  .join("<hr style='border:0; border-top:1px dashed #cbd5e1; margin:8px 0;'/>")}
              </div>
            </div>
          `
              : ""
          }
        </div>
        <div style="background-color: #f1f5f9; padding: 12px; text-align: center; color: #94a3b8; font-size: 12px;">
          Bu bildirim kalemgumruk.com web sitesi canlı chatbot asistanı üzerinden oluşturulmuş ve veritabanına kaydedilmiştir.
        </div>
      </div>
    `;

    if (smtpHost && smtpUser && smtpPass) {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: { user: smtpUser, pass: smtpPass },
      });

      await transporter.sendMail({
        from: `"Kalem Gümrük Chatbot" <${smtpUser}>`,
        to: receiverEmail,
        subject: `[Chatbot Talebi] Yeni Soru & İletişim Bilgisi: ${contactInfo.slice(0, 40)}`,
        html: emailHtml,
      });
    }

    return NextResponse.json({
      success: true,
      message: "Talebiniz kaydedildi ve gümrük müşavirimize iletildi. En kısa sürede dönüş yapılacaktır.",
    });
  } catch (error) {
    console.error("Chat lead bildirim hatası:", error);
    return NextResponse.json(
      { error: "Bildirim iletilirken bir hata oluştu." },
      { status: 500 }
    );
  }
}
