import { Router } from "express";
import { db } from "../db/index.js";
import { chatConversations } from "../db/schema.js";

export const chatLeadRouter = Router();

chatLeadRouter.post("/", async (req, res) => {
  try {
    const { contactInfo, question, messages, sessionId } = req.body || {};

    if (!contactInfo || !question) {
      return res.status(400).json({ error: "İletişim bilgisi veya soru eksik." });
    }

    const convId = `chat-${Date.now()}`;
    const sessId = sessionId || `sess-${Date.now()}`;
    const now = new Date();

    await db.insert(chatConversations).values({
      id: convId,
      sessionId: sessId,
      contactInfo,
      question,
      messages: typeof messages === "string" ? messages : JSON.stringify(messages || []),
      status: "NEW",
      isLeadCaptured: true,
      createdAt: now,
      updatedAt: now,
    });

    return res.json({
      success: true,
      message: "Talebiniz kaydedildi. Uzman gümrük müşavirimiz en kısa sürede iletişime geçecektir.",
    });
  } catch (error) {
    console.error("[Chat Lead Error]:", error);
    return res.status(500).json({ error: "İşlem sırasında bir hata oluştu." });
  }
});
