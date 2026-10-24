import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Olası .env konumlarını sırayla kontrol et ve yükle
const backendDir = path.resolve(__dirname, "../..");
const rootDir = path.resolve(backendDir, "..");
const cwd = process.cwd();

const envCandidates = [
  path.join(backendDir, ".env"),
  path.join(rootDir, ".env"),
  path.join(cwd, "backend/.env"),
  path.join(cwd, ".env"),
];

for (const envPath of envCandidates) {
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
  }
}

// Global process.env fallback
dotenv.config();

// SMTP şifresindeki boşlukları (Gmail 16 haneli uygulama şifreleri) temizle
if (process.env.SMTP_PASS) {
  process.env.SMTP_PASS = process.env.SMTP_PASS.replace(/\s+/g, "").trim();
}

console.log(`[Env] Çevre değişkenleri yüklendi. (RESEND: ${process.env.RESEND_API_KEY ? "AKTİF" : "YOK"}, SMTP_USER: ${process.env.SMTP_USER || "YOK"}, RECEIVER: ${process.env.CONTACT_RECEIVER || "YOK"})`);
