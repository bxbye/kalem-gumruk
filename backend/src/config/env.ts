import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Monorepo ana dizini ve backend dizini
const backendDir = path.resolve(__dirname, "../..");
const rootDir = path.resolve(backendDir, "..");
const cwd = process.cwd();

// Ortam tespiti (development | production)
const nodeEnv = process.env.NODE_ENV || "development";
process.env.NODE_ENV = nodeEnv;

/**
 * Ortama göre öncelikli olarak .env dosyalarını yükler:
 * 1. .env.{NODE_ENV}.local
 * 2. .env.{NODE_ENV}
 * 3. .env.local
 * 4. .env
 */
const envCandidates = [
  `.env.${nodeEnv}.local`,
  `.env.${nodeEnv}`,
  ".env.local",
  ".env",
];

const searchDirs = [rootDir, backendDir, cwd];

for (const dir of searchDirs) {
  for (const envFile of envCandidates) {
    const fullPath = path.join(dir, envFile);
    if (fs.existsSync(fullPath)) {
      dotenv.config({ path: fullPath, override: false });
    }
  }
}

// Global process.env fallback
dotenv.config();

// Development / Production özel SMTP değişkenleri varsa ve genel SMTP boşsa otomatik doldur
if (nodeEnv === "development") {
  if (process.env.DEV_SMTP_HOST && !process.env.SMTP_HOST) process.env.SMTP_HOST = process.env.DEV_SMTP_HOST;
  if (process.env.DEV_SMTP_PORT && !process.env.SMTP_PORT) process.env.SMTP_PORT = process.env.DEV_SMTP_PORT;
  if (process.env.DEV_SMTP_USER && !process.env.SMTP_USER) process.env.SMTP_USER = process.env.DEV_SMTP_USER;
  if (process.env.DEV_SMTP_PASS && !process.env.SMTP_PASS) process.env.SMTP_PASS = process.env.DEV_SMTP_PASS;
  if (process.env.DEV_SMTP_FROM && !process.env.SMTP_FROM) process.env.SMTP_FROM = process.env.DEV_SMTP_FROM;
  if (process.env.DEV_CONTACT_RECEIVER && !process.env.CONTACT_RECEIVER) process.env.CONTACT_RECEIVER = process.env.DEV_CONTACT_RECEIVER;
} else if (nodeEnv === "production") {
  if (process.env.PROD_SMTP_HOST && !process.env.SMTP_HOST) process.env.SMTP_HOST = process.env.PROD_SMTP_HOST;
  if (process.env.PROD_SMTP_PORT && !process.env.SMTP_PORT) process.env.SMTP_PORT = process.env.PROD_SMTP_PORT;
  if (process.env.PROD_SMTP_USER && !process.env.SMTP_USER) process.env.SMTP_USER = process.env.PROD_SMTP_USER;
  if (process.env.PROD_SMTP_PASS && !process.env.SMTP_PASS) process.env.SMTP_PASS = process.env.PROD_SMTP_PASS;
  if (process.env.PROD_SMTP_FROM && !process.env.SMTP_FROM) process.env.SMTP_FROM = process.env.PROD_SMTP_FROM;
  if (process.env.PROD_CONTACT_RECEIVER && !process.env.CONTACT_RECEIVER) process.env.CONTACT_RECEIVER = process.env.PROD_CONTACT_RECEIVER;
}

// SMTP şifresindeki boşlukları (Gmail 16 haneli uygulama şifreleri) temizle
if (process.env.SMTP_PASS) {
  process.env.SMTP_PASS = process.env.SMTP_PASS.replace(/\s+/g, "").trim();
}

console.log(
  `[Env] Ortam: [${nodeEnv.toUpperCase()}], Port: ${process.env.PORT || process.env.BACKEND_PORT || 5001}, SMTP Host: ${
    process.env.SMTP_HOST || "YOK"
  }, Gönderici: ${process.env.SMTP_FROM || process.env.SMTP_USER || "YOK"}, Bildirim Alıcısı: ${
    process.env.CONTACT_RECEIVER || "YOK"
  }`
);
