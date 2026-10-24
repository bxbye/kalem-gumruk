import { Router } from "express";
import { db } from "../db/index.js";
import { chatConversations, formSubmissions } from "../db/schema.js";
import { eq } from "drizzle-orm";
import { sendChatLeadEmail } from "../services/mailer.js";

export const chatLeadRouter = Router();

// Yardımcı: Mesaj listesini okunabilir metin haline getir
function formatMessagesText(messages: Array<{ sender: string; text: string; time?: string }>) {
  return messages
    .map((m) => `[${m.sender === "user" ? "Müşteri" : "Kalem Asistan"} - ${m.time || ""}]: ${m.text}`)
    .join("\n");
}

// Yardımcı: Metin içerisinden telefon veya e-posta tespit et
function extractContactFromText(text: string): { phone?: string; email?: string } {
  const phoneMatch = text.match(/(?:(?:\+90|0)?\s*[5]\d{2}[\s.-]?\d{3}[\s.-]?\d{2}[\s.-]?\d{2})/);
  const emailMatch = text.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/);
  return {
    phone: phoneMatch ? phoneMatch[0].trim() : undefined,
    email: emailMatch ? emailMatch[0].trim() : undefined,
  };
}

// 1. Ziyaretçi Mesaj Gönderdiğinde / Oturumu Güncellediğinde
chatLeadRouter.post("/message", async (req, res) => {
  try {
    const { sessionId, refCode: clientRefCode, message, sender = "user", lang = "tr" } = req.body || {};
    const visitorLang = String(lang).toLowerCase();

    if (!sessionId || !message || typeof message !== "string") {
      return res.status(400).json({ error: "Geçersiz oturum veya boş mesaj." });
    }

    // Karakter sınırı: en fazla 200 karakter
    const trimmedMessage = message.trim();
    if (trimmedMessage.length > 200) {
      return res.status(400).json({ error: "Mesaj uzunluğu en fazla 200 karakter olabilir." });
    }

    const now = new Date();
    const existing = await db.select().from(chatConversations).where(eq(chatConversations.sessionId, sessionId)).get();

    let currentMessages: Array<{ id: string; sender: string; text: string; time: string }> = [];
    const detected = extractContactFromText(trimmedMessage);
    const refCode = clientRefCode || `TK-CHAT-${now.getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    if (existing) {
      try {
        currentMessages = JSON.parse(existing.messages || "[]");
      } catch {
        currentMessages = [];
      }

      // Kullanıcının yazdığı mesaj sayısını kontrol et (Maksimum 5 mesaj)
      const userMessageCount = currentMessages.filter((m) => m.sender === "user").length;
      if (sender === "user" && userMessageCount >= 5) {
        return res.status(400).json({
          error: "Maksimum 5 mesaj sınırına ulaştınız. Lütfen müşavirimizin size ulaşabilmesi için iletişim bilgilerinizi iletiniz.",
          limitReached: true,
        });
      }

      currentMessages.push({
        id: `msg-${Date.now()}`,
        sender,
        text: trimmedMessage,
        time: now.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" }),
      });

      // İletişim bilgisi mesaj içinde yakalandıysa güncelle
      let updatedContact = existing.contactInfo;
      let shouldSendNotification = false;

      if (!existing.contactInfo && (detected.phone || detected.email)) {
        updatedContact = [detected.phone, detected.email].filter(Boolean).join(" | ");
        shouldSendNotification = true;
      }

      // 1. chat_conversations tablosunu güncelle
      await db
        .update(chatConversations)
        .set({
          contactInfo: updatedContact,
          messages: JSON.stringify(currentMessages),
          isLeadCaptured: existing.isLeadCaptured || Boolean(detected.phone || detected.email),
          updatedAt: now,
        })
        .where(eq(chatConversations.sessionId, sessionId));

      // 2. CRM (form_submissions) tablosunu da güncelle
      const subId = `SUB-CHAT-${sessionId}`;
      const existingSub = await db.select().from(formSubmissions).where(eq(formSubmissions.id, subId)).get();

      const userQuestions = currentMessages.filter((m) => m.sender === "user").map((m) => m.text);
      const firstQuestion = userQuestions[0] || trimmedMessage;

      const crmData = {
        fullName: updatedContact || "Web Chatbot Ziyaretçisi",
        phone: detected.phone || "-",
        company: "-",
        serviceType: "💬 Chatbot Danışma",
        question: firstQuestion,
        message: formatMessagesText(currentMessages),
        chatHistory: currentMessages,
        refCode,
        _lang: visitorLang,
      };

      if (existingSub) {
        await db
          .update(formSubmissions)
          .set({
            data: JSON.stringify(crmData),
            updatedAt: now,
          })
          .where(eq(formSubmissions.id, subId));
      } else {
        await db.insert(formSubmissions).values({
          id: subId,
          formSlug: "chatbot",
          data: JSON.stringify(crmData),
          files: "[]",
          status: "NEW",
          ipAddress: req.ip || "unknown",
          createdAt: now,
          updatedAt: now,
        });
      }

      // Mesaj içinde telefon/email yakalandıysa derhal bildirim gönder
      if (shouldSendNotification) {
        sendChatLeadEmail({
          refCode,
          contactInfo: updatedContact || undefined,
          question: firstQuestion,
          messages: currentMessages,
          lang: visitorLang,
        }).catch((err) => console.error("[Chat Lead Auto-Detect Mail Error]:", err));
      }

      return res.json({
        success: true,
        userMessageCount: currentMessages.filter((m) => m.sender === "user").length,
        remainingMessages: Math.max(0, 5 - currentMessages.filter((m) => m.sender === "user").length),
      });
    } else {
      // Yeni sohbet oturumu oluştur
      currentMessages = [
        {
          id: `msg-${Date.now()}`,
          sender,
          text: trimmedMessage,
          time: now.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" }),
        },
      ];

      const convId = `chat-${Date.now()}`;
      const contactInfo = [detected.phone, detected.email].filter(Boolean).join(" | ") || null;

      // 1. chat_conversations'a ekle
      await db.insert(chatConversations).values({
        id: convId,
        sessionId,
        contactInfo,
        question: trimmedMessage,
        messages: JSON.stringify(currentMessages),
        status: "NEW",
        isLeadCaptured: Boolean(contactInfo),
        createdAt: now,
        updatedAt: now,
      });

      // 2. CRM (form_submissions) tablosuna da kaydet
      const subId = `SUB-CHAT-${sessionId}`;
      const crmData = {
        fullName: contactInfo || "Web Chatbot Ziyaretçisi",
        phone: detected.phone || "-",
        company: "-",
        serviceType: "💬 Chatbot Danışma",
        question: trimmedMessage,
        message: formatMessagesText(currentMessages),
        chatHistory: currentMessages,
        refCode,
        _lang: visitorLang,
      };

      await db.insert(formSubmissions).values({
        id: subId,
        formSlug: "chatbot",
        data: JSON.stringify(crmData),
        files: "[]",
        status: "NEW",
        ipAddress: req.ip || "unknown",
        createdAt: now,
        updatedAt: now,
      });

      if (contactInfo) {
        sendChatLeadEmail({
          refCode,
          contactInfo,
          question: trimmedMessage,
          messages: currentMessages,
          lang: visitorLang,
        }).catch((err) => console.error("[Chat Lead First Msg Mail Error]:", err));
      }

      return res.json({
        success: true,
        userMessageCount: 1,
        remainingMessages: 4,
      });
    }
  } catch (error) {
    console.error("[Chat Message Error]:", error);
    return res.status(500).json({ error: "Mesaj kaydedilemedi." });
  }
});

// 2. Ziyaretçi İletişim Bilgilerini Bıraktığında VEYA WhatsApp'a Geçtiğinde
chatLeadRouter.post("/", async (req, res) => {
  try {
    const {
      contactInfo,
      contactName,
      contactPhone,
      contactCompany,
      question,
      messages,
      sessionId,
      refCode: clientRefCode,
      honeypot,
      lang = "tr",
    } = req.body || {};
    const visitorLang = String(lang).toLowerCase();

    // Spam engelleme: Honeypot kontrolü
    if (honeypot) {
      return res.json({ success: true, message: "Talebiniz kaydedildi." });
    }

    if (!sessionId && !contactInfo && !question && !contactName) {
      return res.status(400).json({ error: "Eksik bilgi gönderildi." });
    }

    const sessId = sessionId || `sess-${Date.now()}`;
    const refCode = clientRefCode || `TK-CHAT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date();

    const existing = await db.select().from(chatConversations).where(eq(chatConversations.sessionId, sessId)).get();

    let allMessages = messages || [];
    if (typeof allMessages === "string") {
      try {
        allMessages = JSON.parse(allMessages);
      } catch {
        allMessages = [];
      }
    }

    const finalContactInfo =
      contactInfo ||
      (contactName ? `${contactName} (${contactCompany || "Bireysel"}) - Tel: ${contactPhone}` : "Bilinmiyor");

    if (existing) {
      if (!allMessages.length) {
        try {
          allMessages = JSON.parse(existing.messages || "[]");
        } catch {
          allMessages = [];
        }
      }

      await db
        .update(chatConversations)
        .set({
          contactInfo: finalContactInfo,
          question: question || existing.question,
          messages: JSON.stringify(allMessages),
          status: "CONTACTED",
          isLeadCaptured: true,
          updatedAt: now,
        })
        .where(eq(chatConversations.sessionId, sessId));
    } else {
      const convId = `chat-${Date.now()}`;
      await db.insert(chatConversations).values({
        id: convId,
        sessionId: sessId,
        contactInfo: finalContactInfo,
        question: question || "Web Chatbot Danışma Talebi",
        messages: JSON.stringify(allMessages),
        status: "NEW",
        isLeadCaptured: true,
        createdAt: now,
        updatedAt: now,
      });
    }

    // CRM (form_submissions) Tablosuna Kaydet / Güncelle
    const subId = `SUB-CHAT-${sessId}`;
    const existingSub = await db.select().from(formSubmissions).where(eq(formSubmissions.id, subId)).get();

    const crmPayload = {
      fullName: contactName || finalContactInfo,
      phone: contactPhone || "-",
      company: contactCompany || "-",
      serviceType: "💬 Chatbot Danışma",
      question: question || (allMessages.find((m: any) => m.sender === "user")?.text ?? "Gümrük Danışma"),
      message: formatMessagesText(allMessages),
      refCode,
      chatHistory: allMessages,
      _lang: visitorLang,
    };

    if (existingSub) {
      await db
        .update(formSubmissions)
        .set({
          data: JSON.stringify(crmPayload),
          status: "CONTACTED",
          updatedAt: now,
        })
        .where(eq(formSubmissions.id, subId));
    } else {
      await db.insert(formSubmissions).values({
        id: subId,
        formSlug: "chatbot",
        data: JSON.stringify(crmPayload),
        files: "[]",
        status: "NEW",
        ipAddress: req.ip || "unknown",
        createdAt: now,
        updatedAt: now,
      });
    }

    // Kadir Bey'in email adresine anlık HTML bildirim gönder
    sendChatLeadEmail({
      refCode,
      contactInfo: finalContactInfo,
      contactName: contactName?.trim() || undefined,
      question: question || (allMessages.find((m: any) => m.sender === "user")?.text ?? ""),
      messages: allMessages,
      lang: visitorLang,
    }).catch((err) => console.error("[Chat Lead Mail Error]:", err));

    const localizedSuccessMsgs: Record<string, string> = {
      en: `Thank you! Your inquiry and messages have been forwarded to our customs broker under reference #${refCode}. We will contact you shortly.`,
      ar: `شكراً لكم! تم إرسال استفساركم ورسائلكم إلى المستشار الجمركي بالرقم المرجعي #${refCode}. سنتواصل معكم في أقرب وقت.`,
      es: `¡Muchas gracias! Su consulta y mensajes han sido remitidos a nuestro agente de aduanas con la referencia #${refCode}. Nos pondremos en contacto en breve.`,
      tr: "Talebiniz ve mesajlarınız gümrük müşavirimize iletildi. En kısa sürede sizinle irtibata geçilecektir.",
    };

    return res.json({
      success: true,
      refCode,
      message: localizedSuccessMsgs[visitorLang] || localizedSuccessMsgs.tr,
    });
  } catch (error) {
    console.error("[Chat Lead Error]:", error);
    return res.status(500).json({ error: "İşlem sırasında bir hata oluştu." });
  }
});
