import "./config/env.js";
import express from "express";
import cors from "cors";
import path from "path";
import rateLimit from "express-rate-limit";
import { ensureDatabaseInitialized } from "./db/index.js";
import { uploadsDir } from "./services/storage.js";
import { verifySmtp } from "./services/mailer.js";
import { startDailyBackupScheduler } from "./services/backup.js";

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

const app = express();
const PORT = process.env.BACKEND_PORT || 5001;

// Render, Cloudflare vb. reverse proxy arkasında gerçek istemci IP'sini tespit edebilmek için
app.set("trust proxy", 1);

// 1. Veritabanını başlat ve tabloları/seed verilerini kontrol et
ensureDatabaseInitialized();

// 2. Güvenlik ve CORS Yapılandırması
function parseOrigins(raw?: string): string[] {
  if (!raw) return [];
  return raw
    .split(",")
    .map((o) => o.trim().replace(/\/$/, ""))
    .filter(Boolean);
}

const configuredOrigins = new Set<string>([
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://localhost:5001",
  "http://127.0.0.1:5001",
  "https://kalemgumruk.com",
  "https://www.kalemgumruk.com",
  "http://kalemgumruk.com",
  "http://www.kalemgumruk.com",
  "https://kalem-gumruk.onrender.com",
  "http://kalem-gumruk.onrender.com",
  ...parseOrigins(process.env.RENDER_EXTERNAL_URL),
  ...parseOrigins(process.env.FRONTEND_URL),
  ...parseOrigins(process.env.ALLOWED_ORIGINS),
]);

function isOriginAllowed(origin: string | undefined, req: express.Request): boolean {
  // 1. Origin başlığı yoksa izin ver (aynı sunucu, curl, healthcheck, Next.js server component)
  if (!origin) return true;

  // 2. Geliştirme ortamında serbest
  if (process.env.NODE_ENV !== "production") return true;

  const normalized = origin.trim().replace(/\/$/, "");

  // 3. Önceden yapılandırılmış origin listesi
  if (configuredOrigins.has(normalized)) return true;

  // 4. Hostname tabanlı dinamik kontroller
  try {
    const url = new URL(normalized);
    const host = url.hostname.toLowerCase();

    // Localhost veya loopback
    if (host === "localhost" || host === "127.0.0.1" || host === "::1") {
      return true;
    }

    // Kalem Gümrük ana alan adı veya alt alan adları
    if (host === "kalemgumruk.com" || host.endsWith(".kalemgumruk.com")) {
      return true;
    }

    // Cloudflare tünelleri, Render ve Vercel önizleme URL'leri
    if (
      host.endsWith(".trycloudflare.com") ||
      host.endsWith(".onrender.com") ||
      host.endsWith(".vercel.app")
    ) {
      return true;
    }

    // Next.js reverse-proxy üzerinden iletilen x-forwarded-host ile eşleşme
    const forwardedHost = (req.headers["x-forwarded-host"] as string)?.split(":")[0]?.toLowerCase();
    if (forwardedHost && host === forwardedHost) {
      return true;
    }

    // İstek yapılan sunucu Host başlığı ile eşleşme
    const reqHost = req.headers.host?.split(":")[0]?.toLowerCase();
    if (reqHost && host === reqHost) {
      return true;
    }
  } catch {
    return false;
  }

  return false;
}

app.use(
  cors((req, callback) => {
    const originHeader = req.headers.origin;
    const allowed = isOriginAllowed(originHeader, req as express.Request);

    callback(null, {
      origin: allowed,
      credentials: true,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: [
        "Content-Type",
        "Authorization",
        "x-admin-password",
        "x-requested-with",
        "accept",
        "origin",
      ],
    });
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

// 6. Anti-Spam & DoS Koruması (Rate Limiting)
const formRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 dakika
  max: 20, // 15 dakikada tek bir IP'den en fazla 20 istek
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Çok fazla deneme yapıldı. Güvenlik nedeniyle lütfen 15 dakika sonra tekrar deneyiniz." },
});

// 7. API Rotaları
app.use("/api/contact", formRateLimiter, contactRouter);
app.use("/api/forms", formRateLimiter, formsRouter);
app.use("/api/submissions", submissionsRouter);
app.use("/api/documents", documentsRouter);
app.use("/api/feedbacks", formRateLimiter, feedbacksRouter);
app.use("/api/chat-lead", formRateLimiter, chatLeadRouter);
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
app.listen(Number(PORT), "0.0.0.0", async () => {
  console.log(`=================================================`);
  console.log(`🚀 Kalem Gümrük Backend Servisi Hazır!`);
  console.log(`📡 URL: http://localhost:${PORT}`);
  console.log(`📁 Uploads: ${uploadsDir}`);
  console.log(`🩺 Health: http://localhost:${PORT}/health`);

  // E-Posta Bildirim Bağlantısını Doğrula (SMTP)
  const smtpStatus = await verifySmtp();
  if (smtpStatus.ok) {
    console.log(`📧 E-Posta Servisi [SMTP]: ✅ Hazır (${smtpStatus.user} -> ${process.env.CONTACT_RECEIVER || "kadir.kaya@kayapermit.com"})`);
  } else {
    console.warn(`📧 E-Posta Servisi [SMTP]: ⚠️ ${smtpStatus.message}`);
  }

  // 9. Günlük Otomatik Yedekleme Servisini Başlat
  startDailyBackupScheduler();
  console.log(`=================================================`);
});
