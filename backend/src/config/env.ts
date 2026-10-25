import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Monorepo ana dizini (Tek Doğruluk Kaynağı / Single Source of Truth)
const backendDir = path.resolve(__dirname, "../..");
const rootDir = path.resolve(backendDir, "..");
const cwd = process.cwd();

// 1. Öncelikle kök dizindeki ana .env dosyasını yükle (en yüksek öncelik)
const rootEnvPath = path.join(rootDir, ".env");
if (fs.existsSync(rootEnvPath)) {
  dotenv.config({ path: rootEnvPath, override: true });
}

// 2. Fallback: Proje kökünden farklı bir çalışma dizinindeyse (örn. backend dizini)
const fallbackCandidates = [
  path.join(cwd, ".env"),
  path.join(backendDir, ".env"),
];

for (const envPath of fallbackCandidates) {
  if (fs.existsSync(envPath) && envPath !== rootEnvPath) {
    dotenv.config({ path: envPath, override: false });
  }
}

// Global process.env fallback
dotenv.config();

// SMTP şifresindeki boşlukları (Gmail 16 haneli uygulama şifreleri) temizle
if (process.env.SMTP_PASS) {
  process.env.SMTP_PASS = process.env.SMTP_PASS.replace(/\s+/g, "").trim();
}

console.log(
  `[Env] Çevre değişkenleri yüklendi. (RESEND: ${
    process.env.RESEND_API_KEY ? "AKTİF" : "YOK"
  }, GÖNDERİCİ: ${process.env.RESEND_FROM || process.env.SMTP_USER || "YOK"}, ALICI: ${
    process.env.CONTACT_RECEIVER || "YOK"
  })`
);
