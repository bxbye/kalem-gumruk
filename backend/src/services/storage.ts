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

/**
 * Multer/busboy tarafından Latin1 olarak çözülmüş UTF-8 karakterlerini onarır (Mojibake düzeltme)
 * Örnek: 'GÃ¼mrÃ¼kleme Ä°thalat.pdf' -> 'Gümrükleme İthalat.pdf'
 */
export function fixUtf8Mojibake(str?: string): string {
  if (!str || typeof str !== "string") return "";
  if (/[ÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖ×ØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõö÷øùúûüýþÿ]/.test(str)) {
    try {
      const candidate = Buffer.from(str, "latin1").toString("utf8");
      if (!candidate.includes("\uFFFD")) {
        return candidate;
      }
    } catch {}
  }
  return str;
}

// Güvenli dosya adı oluşturucu (Zararlı karakter ve çift uzantı temizliği)
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (_req, file, cb) => {
    // UTF-8 karakter bozulmasını düzelt
    file.originalname = fixUtf8Mojibake(file.originalname);
    const ext = path.extname(file.originalname).toLowerCase();

    // Türkçe karakterleri dosya sistemi için güvenli ASCII slug'a dönüştür
    const turkishMap: Record<string, string> = {
      ç: "c", Ç: "c", ğ: "g", Ğ: "g", ı: "i", İ: "i",
      ö: "o", Ö: "o", ş: "s", Ş: "s", ü: "u", Ü: "u",
    };
    const normalizedName = file.originalname
      .split("")
      .map((ch) => turkishMap[ch] || ch)
      .join("")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

    const cleanBaseName = path
      .basename(normalizedName, ext)
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, "-")
      .replace(/-+/g, "-")
      .slice(0, 35);

    const uniqueName = `doc-${cleanBaseName || "dosya"}-${Date.now()}${ext}`;
    cb(null, uniqueName);
  },
});

// Sadece gümrük evrakları için geçerli ve güvenli formatlar
// Arşiv dosyaları (.zip, .rar) ve script çalıştırabilecek SVG'ler KESİNLİKLE yasak
export const ALLOWED_EXTENSIONS = [".pdf", ".jpg", ".jpeg", ".png", ".doc", ".docx"];

// Tehlikeli uzantı kara listesi (Çift uzantı saldırıları için)
const DANGEROUS_EXTENSIONS_BLACKLIST = [
  ".exe", ".bat", ".cmd", ".sh", ".php", ".phtml", ".php5", ".js", ".vbs",
  ".ps1", ".scr", ".pif", ".com", ".hta", ".jar", ".msi", ".dll", ".bin",
  ".wsf", ".cpl", ".vbe", ".jse", ".reg"
];

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // Maksimum 5 MB
export const MAX_FILE_COUNT = 2; // Bir gönderimde en fazla 2 dosya

export const uploadMiddleware = multer({
  storage,
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: MAX_FILE_COUNT,
  },
  fileFilter: (_req, file, cb) => {
    const rawLowerName = file.originalname.toLowerCase();
    const ext = path.extname(rawLowerName);

    // 1. Çift Uzantı ve Zararlı Uzantı Kontrolü (örneğin: evrak.pdf.exe, belge.docx.bat)
    for (const badExt of DANGEROUS_EXTENSIONS_BLACKLIST) {
      if (rawLowerName.includes(badExt)) {
        return cb(
          new Error("Güvenlik Uyarısı: Şüpheli veya çalıştırılabilir dosya uzantısı tespit edildi.")
        );
      }
    }

    // 2. İzin Verilen Uzantı Kontrolü
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      return cb(
        new Error(
          `Güvenlik nedeniyle yalnızca PDF, JPG, PNG ve Word (.docx) dosyaları kabul edilmektedir. (${ext} uzantısı kabul edilmez)`
        )
      );
    }

    // 3. Tehlikeli MIME Türü Engellemesi
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
      "application/x-7z-compressed",
      "application/octet-stream", // Belirsiz binary içerik
    ];

    if (dangerousMimes.includes(file.mimetype.toLowerCase())) {
      return cb(new Error("Güvenlik Uyarısı: Zararlı içerik şüphesi taşıyan dosya formatı reddedildi."));
    }

    cb(null, true);
  },
});

/**
 * Dosya İçerik / Magic Bytes (Dosya İmzası) ve Zararlı Kod / Virüs Heuristic Taraması:
 * 1. Sahte uzantılı dosyaları (uzantısı .pdf yapılmış .exe veya scriptler) engeller.
 * 2. PDF ve DOCX içine gizlenmiş makroları, JavaScript taglerini ve sistem çağrılarını tarar.
 * 3. Windows çalıştırılabilir dosyalarını (MZ imzası) anında yok eder.
 */
export async function verifyFileSignature(filePath: string): Promise<{ valid: boolean; reason?: string }> {
  try {
    const stats = fs.statSync(filePath);
    if (stats.size > MAX_FILE_SIZE) {
      return { valid: false, reason: "Dosya boyutu 5 MB sınırını aşıyor." };
    }
    if (stats.size < 4) {
      return { valid: false, reason: "Dosya içeriği geçersiz veya boş." };
    }

    // Dosyanın ilk 16 baytını oku (Magic Bytes)
    const headerBuffer = Buffer.alloc(16);
    const fd = fs.openSync(filePath, "r");
    fs.readSync(fd, headerBuffer, 0, 16, 0);

    const ext = path.extname(filePath).toLowerCase();

    // 1. Windows EXE / DLL Kontrolü (MZ - 0x4D 0x5A) -> Kesinlikle Reddet
    if (headerBuffer[0] === 0x4d && headerBuffer[1] === 0x5a) {
      fs.closeSync(fd);
      return { valid: false, reason: "Kritik Güvenlik Uyarısı: Çalıştırılabilir dosya (EXE/DLL) tespit edildi ve engellendi!" };
    }

    // 2. ELF (Linux Executable: 0x7F 'E' 'L' 'F')
    if (
      headerBuffer[0] === 0x7f &&
      headerBuffer[1] === 0x45 &&
      headerBuffer[2] === 0x4c &&
      headerBuffer[3] === 0x46
    ) {
      fs.closeSync(fd);
      return { valid: false, reason: "Kritik Güvenlik Uyarısı: Linux çalıştırılabilir ikili (ELF) tespit edildi." };
    }

    // 3. PDF Kontrolü (İlk 4 bayt: %PDF)
    if (ext === ".pdf") {
      const isPdf = headerBuffer.slice(0, 4).toString() === "%PDF";
      if (!isPdf) {
        fs.closeSync(fd);
        return { valid: false, reason: "Dosya uzantısı PDF olarak belirtilmiş ancak içeriği geçerli bir PDF dosyası değil." };
      }
    }

    // 4. PNG Kontrolü (İlk 4 bayt: 0x89 50 4E 47)
    else if (ext === ".png") {
      const isPng =
        headerBuffer[0] === 0x89 &&
        headerBuffer[1] === 0x50 &&
        headerBuffer[2] === 0x4e &&
        headerBuffer[3] === 0x47;
      if (!isPng) {
        fs.closeSync(fd);
        return { valid: false, reason: "Dosya uzantısı PNG olarak belirtilmiş ancak içeriği geçerli bir PNG resmi değil." };
      }
    }

    // 5. JPEG Kontrolü (İlk 3 bayt: 0xFF D8 FF)
    else if (ext === ".jpg" || ext === ".jpeg") {
      const isJpg = headerBuffer[0] === 0xff && headerBuffer[1] === 0xd8 && headerBuffer[2] === 0xff;
      if (!isJpg) {
        fs.closeSync(fd);
        return { valid: false, reason: "Dosya uzantısı JPG olarak belirtilmiş ancak içeriği geçerli bir JPG resmi değil." };
      }
    }

    // 6. DOCX Kontrolü (PK\x03\x04 - ZIP tabanlı OpenXML)
    else if (ext === ".docx") {
      const isZipDocx =
        headerBuffer[0] === 0x50 &&
        headerBuffer[1] === 0x4b &&
        headerBuffer[2] === 0x03 &&
        headerBuffer[3] === 0x04;
      if (!isZipDocx) {
        fs.closeSync(fd);
        return { valid: false, reason: "Dosya içeriği geçerli bir Word (.docx) belgesi değil." };
      }
    }

    // 7. Derin Seviye Zararlı İçerik ve Script Heuristic Taraması (İlk 512 KB'lık kısmı oku)
    const scanSize = Math.min(stats.size, 512 * 1024);
    const contentBuffer = Buffer.alloc(scanSize);
    fs.readSync(fd, contentBuffer, 0, scanSize, 0);
    fs.closeSync(fd);

    const contentText = contentBuffer.toString("binary").toLowerCase();

    // Tehlikeli kod / makro / exploit imzaları
    const maliciousPatterns = [
      "<script",
      "javascript:",
      "/javascript",
      "/launch",
      "/embeddedfiles",
      "powershell",
      "cmd.exe",
      "wscript.shell",
      "cscript",
      "vbscript:",
      "activexobject",
      "vbaproject.bin", // Word makro virüsleri
      "autoopen",
      "autoexec",
    ];

    for (const pattern of maliciousPatterns) {
      if (contentText.includes(pattern)) {
        return {
          valid: false,
          reason: `Güvenlik Uyarısı: Dosya içerisinde şüpheli zararlı kod veya makro imzası (${pattern}) tespit edildi.`,
        };
      }
    }

    return { valid: true };
  } catch (err: any) {
    return { valid: false, reason: "Dosya taranırken hata oluştu: " + err.message };
  }
}
