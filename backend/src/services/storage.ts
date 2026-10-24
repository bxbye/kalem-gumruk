import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const uploadsDir = path.resolve(__dirname, "../../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

export function formatBytes(bytes: number, decimals = 1) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

// Güvenli dosya adı oluşturucu (Zararlı karakter ve çift uzantı temizliği)
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (_req, file, cb) => {
    // Sadece son uzantıyı al
    const ext = path.extname(file.originalname).toLowerCase();
    // Tehlikeli karakterleri, çift uzantıları, script isimlerini temizle
    const cleanBaseName = path
      .basename(file.originalname, ext)
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, "-")
      .replace(/-+/g, "-")
      .slice(0, 35);

    const uniqueName = `doc-${cleanBaseName}-${Date.now()}${ext}`;
    cb(null, uniqueName);
  },
});

// Sadece gümrük evrakları için geçerli ve güvenli formatlar
// Arşiv dosyaları (.zip, .rar) ve script çalıştırabilecek SVG'ler KESİNLİKLE yasak
export const ALLOWED_EXTENSIONS = [".pdf", ".jpg", ".jpeg", ".png", ".doc", ".docx"];

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // Maksimum 5 MB
export const MAX_FILE_COUNT = 2; // Bir gönderimde en fazla 2 dosya

export const uploadMiddleware = multer({
  storage,
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: MAX_FILE_COUNT,
  },
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();

    // 1. Uzantı Kontrolü
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      return cb(
        new Error(
          `Güvenlik nedeniyle yalnızca PDF, JPG, PNG ve Word (.docx) dosyaları kabul edilmektedir. (${ext} uzantısı kabul edilmez)`
        )
      );
    }

    // 2. Tehlikeli MIME Türü Engellemesi
    const dangerousMimes = [
      "application/x-msdownload",
      "application/x-sh",
      "application/x-php",
      "text/html",
      "text/javascript",
      "application/javascript",
      "image/svg+xml",
      "application/zip",
      "application/x-rar-compressed",
    ];

    if (dangerousMimes.includes(file.mimetype.toLowerCase())) {
      return cb(new Error("Güvenlik Uyarısı: Zararlı içerik şüphesi taşıyan dosya formatı reddedildi."));
    }

    cb(null, true);
  },
});

/**
 * Dosya İçerik / Magic Bytes (Dosya İmzası) Güvenlik Doğrulaması:
 * Bir dosyanın uzantısı '.pdf' yapılmış olsa dahi, içeriği gerçekten PDF mi kontrol eder.
 * Sahte uzantılı virüsleri, gizlenmiş script veya çalıştırılabilir (exe) dosyaları yakalar.
 */
export async function verifyFileSignature(filePath: string): Promise<{ valid: boolean; reason?: string }> {
  try {
    const buffer = Buffer.alloc(16);
    const fd = fs.openSync(filePath, "r");
    fs.readSync(fd, buffer, 0, 16, 0);
    fs.closeSync(fd);

    const ext = path.extname(filePath).toLowerCase();

    // 1. PDF Kontrolü (İlk 4 bayt: %PDF)
    if (ext === ".pdf") {
      const isPdf = buffer.slice(0, 4).toString() === "%PDF";
      if (!isPdf) {
        return { valid: false, reason: "Dosya uzantısı PDF olarak belirtilmiş ancak içeriği geçerli bir PDF dosyası değil." };
      }
    }

    // 2. PNG Kontrolü (İlk 4 bayt: 0x89 50 4E 47)
    else if (ext === ".png") {
      const isPng =
        buffer[0] === 0x89 &&
        buffer[1] === 0x50 &&
        buffer[2] === 0x4e &&
        buffer[3] === 0x47;
      if (!isPng) {
        return { valid: false, reason: "Dosya uzantısı PNG olarak belirtilmiş ancak içeriği geçerli bir PNG resmi değil." };
      }
    }

    // 3. JPEG Kontrolü (İlk 3 bayt: 0xFF D8 FF)
    else if (ext === ".jpg" || ext === ".jpeg") {
      const isJpg = buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
      if (!isJpg) {
        return { valid: false, reason: "Dosya uzantısı JPG olarak belirtilmiş ancak içeriği geçerli bir JPG resmi değil." };
      }
    }

    // 4. DOCX Kontrolü (PK\x03\x04 - ZIP tabanlı OpenXML)
    else if (ext === ".docx") {
      const isZipDocx = buffer[0] === 0x50 && buffer[1] === 0x4b && buffer[2] === 0x03 && buffer[3] === 0x04;
      if (!isZipDocx) {
        return { valid: false, reason: "Dosya içeriği geçerli bir Word (.docx) belgesi değil." };
      }
    }

    // 5. Windows EXE / DLL Kontrolü (MZ - 0x4D 0x5A) -> Kesinlikle Reddet
    if (buffer[0] === 0x4d && buffer[1] === 0x5a) {
      return { valid: false, reason: "Kritik Güvenlik Uyarısı: Çalıştırılabilir dosya (EXE/DLL) tespit edildi ve engellendi!" };
    }

    return { valid: true };
  } catch (err: any) {
    return { valid: false, reason: "Dosya okunurken hata oluştu: " + err.message };
  }
}
