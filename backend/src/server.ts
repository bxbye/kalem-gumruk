import express from "express";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";
import { ensureDatabaseInitialized } from "./db/index.js";
import { uploadsDir } from "./services/storage.js";

// Rotalar
import { contactRouter } from "./routes/contact.js";
import { formsRouter } from "./routes/forms.js";
import { submissionsRouter } from "./routes/submissions.js";
import { documentsRouter } from "./routes/documents.js";
import { feedbacksRouter } from "./routes/feedbacks.js";
import { chatLeadRouter } from "./routes/chatLead.js";
import { exchangeRatesRouter } from "./routes/exchangeRates.js";
import { uploadRouter } from "./routes/upload.js";
import { adminRouter } from "./routes/admin.js";
import { publicDataRouter } from "./routes/publicData.js";

dotenv.config();

const app = express();
const PORT = process.env.BACKEND_PORT || 5001;

// 1. Veritabanını başlat ve tabloları/seed verilerini kontrol et
ensureDatabaseInitialized();

// 2. Güvenlik ve CORS Yapılandırması
const allowedOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  process.env.FRONTEND_URL,
].filter(Boolean) as string[];

app.use(
  cors({
    origin: (origin, callback) => {
      // Sunucudan sunucuya, Next.js rewrites veya Cloudflare tünellerinde izin ver
      if (
        !origin ||
        allowedOrigins.includes(origin) ||
        origin.endsWith(".trycloudflare.com") ||
        origin.includes("trycloudflare.com") ||
        process.env.NODE_ENV !== "production"
      ) {
        return callback(null, true);
      }
      return callback(new Error("CORS policy violation"), false);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-admin-password"],
  })
);

// 3. Body Parser
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));

// 4. Statik Dosyalar (Yüklenen CV'ler, evraklar vb.)
app.use("/uploads", express.static(uploadsDir));

// 5. Sağlık Kontrolü (Healthcheck)
app.get("/health", (_req, res) => {
  return res.json({
    status: "ok",
    service: "kalem-gumruk-backend",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
  });
});

// 6. API Rotaları
app.use("/api/contact", contactRouter);
app.use("/api/forms", formsRouter);
app.use("/api/submissions", submissionsRouter);
app.use("/api/documents", documentsRouter);
app.use("/api/feedbacks", feedbacksRouter);
app.use("/api/chat-lead", chatLeadRouter);
app.use("/api/exchange-rates", exchangeRatesRouter);
app.use("/api/upload", uploadRouter);
app.use("/api/admin", adminRouter);
app.use("/api/public", publicDataRouter);

// 7. Global Hata Yakalayıcı
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error("[Unhandled Error]:", err);
  res.status(err.status || 500).json({
    error: err.message || "Sunucu tarafında beklenmeyen bir hata oluştu.",
  });
});

// 8. Sunucuyu Başlat
app.listen(PORT, () => {
  console.log(`=================================================`);
  console.log(`🚀 Kalem Gümrük Backend Servisi Hazır!`);
  console.log(`📡 URL: http://localhost:${PORT}`);
  console.log(`📁 Uploads: ${uploadsDir}`);
  console.log(`🩺 Health: http://localhost:${PORT}/health`);
  console.log(`=================================================`);
});
