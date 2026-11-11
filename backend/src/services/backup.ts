import path from "path";
import fs from "fs";
import { pool, db } from "../db/index.js";
import { databaseBackups } from "../db/schema.js";
import { desc, eq } from "drizzle-orm";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const dataDir = path.resolve(__dirname, "../../data");
export const backupsDir = path.join(dataDir, "backups");
if (!fs.existsSync(backupsDir)) {
  fs.mkdirSync(backupsDir, { recursive: true });
}

export interface BackupItem {
  id: string;
  filename: string;
  filepath: string;
  sizeBytes: number;
  sizeFormatted: string;
  backupType: "AUTOMATIC" | "MANUAL" | "PRE_RESTORE";
  note?: string;
  createdAt: number;
  createdAtFormatted: string;
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

const TABLES = [
  "forms",
  "form_submissions",
  "documents",
  "sirkuler",
  "customer_feedbacks",
  "chat_conversations",
  "site_settings",
  "gerekli_baglantilar",
  "services",
  "references",
  "users",
];

/**
 * MySQL veritabanındaki tabloları JSON formatında yedekler.
 */
export async function createDatabaseBackup(
  type: "AUTOMATIC" | "MANUAL" | "PRE_RESTORE" = "MANUAL",
  note?: string
): Promise<BackupItem> {
  const timestamp = new Date();
  const dateStr = timestamp
    .toISOString()
    .replace(/T/, "_")
    .replace(/:/g, "-")
    .split(".")[0];
  const filename = `kalem_db_${dateStr}_${type.toLowerCase()}.json`;
  const targetPath = path.join(backupsDir, filename);

  console.log(`[Backup] Veritabanı yedeği alınıyor: ${filename} (Tür: ${type})...`);

  const dump: Record<string, any[]> = {};
  for (const table of TABLES) {
    try {
      const [rows]: any = await pool.query(`SELECT * FROM \`${table}\``);
      dump[table] = rows;
    } catch (e) {
      console.warn(`[Backup] ${table} tablosu okunurken uyarı:`, e);
      dump[table] = [];
    }
  }

  fs.writeFileSync(targetPath, JSON.stringify(dump, null, 2), "utf-8");

  const stats = fs.statSync(targetPath);
  const backupId = `bkp-${Date.now()}`;

  // Kataloğa kaydet
  try {
    await db.insert(databaseBackups).values({
      id: backupId,
      filename,
      filepath: targetPath,
      sizeBytes: stats.size,
      backupType: type,
      note: note || (type === "AUTOMATIC" ? "Günlük otomatik sistem yedeği" : "Kullanıcı tetiklemeli yedek"),
      createdAt: timestamp,
    });
  } catch (err) {
    console.warn("[Backup] Veritabanı kataloğuna eklenirken uyarı:", err);
  }

  // Otomatik yedekleri temizle
  cleanOldBackups().catch((e) => console.warn("[Backup] Temizleme uyarısı:", e));

  return {
    id: backupId,
    filename,
    filepath: targetPath,
    sizeBytes: stats.size,
    sizeFormatted: formatBytes(stats.size),
    backupType: type,
    note,
    createdAt: timestamp.getTime(),
    createdAtFormatted: timestamp.toLocaleString("tr-TR"),
  };
}

/**
 * Mevcut yedekleri listeler
 */
export async function listDatabaseBackups(): Promise<BackupItem[]> {
  const result: BackupItem[] = [];
  const registered = new Set<string>();

  // 1. Veritabanı kataloğundan çek
  try {
    const records = await db
      .select()
      .from(databaseBackups)
      .orderBy(desc(databaseBackups.createdAt));

    for (const r of records) {
      if (fs.existsSync(r.filepath)) {
        registered.add(r.filename);
        const stats = fs.statSync(r.filepath);
        const time = r.createdAt ? new Date(r.createdAt).getTime() : stats.mtimeMs;
        result.push({
          id: r.id,
          filename: r.filename,
          filepath: r.filepath,
          sizeBytes: stats.size,
          sizeFormatted: formatBytes(stats.size),
          backupType: (r.backupType as any) || "AUTOMATIC",
          note: r.note || undefined,
          createdAt: time,
          createdAtFormatted: new Date(time).toLocaleString("tr-TR"),
        });
      }
    }
  } catch (e) {
    console.warn("[Backup] Katalog okuma hatası:", e);
  }

  // 2. Diskte olup katalogda olmayanları da tara ve ekle
  try {
    const files = fs.readdirSync(backupsDir);
    for (const f of files) {
      if ((f.endsWith(".json") || f.endsWith(".sqlite")) && !registered.has(f)) {
        const fullPath = path.join(backupsDir, f);
        const stats = fs.statSync(fullPath);
        result.push({
          id: `file-${f}`,
          filename: f,
          filepath: fullPath,
          sizeBytes: stats.size,
          sizeFormatted: formatBytes(stats.size),
          backupType: f.includes("pre_restore") ? "PRE_RESTORE" : f.includes("manual") ? "MANUAL" : "AUTOMATIC",
          note: "Diskten tespit edilen harici yedek",
          createdAt: stats.mtimeMs,
          createdAtFormatted: new Date(stats.mtimeMs).toLocaleString("tr-TR"),
        });
      }
    }
  } catch (e) {
    console.warn("[Backup] Disk tarama hatası:", e);
  }

  // Tarihe göre yeniden eskiye sırala
  result.sort((a, b) => b.createdAt - a.createdAt);
  return result;
}

/**
 * Seçilen JSON yedeğinden verileri geri yükler
 */
export async function restoreDatabaseBackup(filename: string): Promise<{ success: boolean; message: string; preRestoreBackup?: string }> {
  const targetFile = path.basename(filename);
  const backupPath = path.join(backupsDir, targetFile);

  if (!fs.existsSync(backupPath)) {
    throw new Error(`Yedek dosyası bulunamadı: ${targetFile}`);
  }

  console.log(`[Restore] ⚠️ Geri yükleme başlatılıyor: ${targetFile}`);

  let preBackupName = "";
  try {
    const preBackup = await createDatabaseBackup("PRE_RESTORE", `Geri yükleme öncesi otomatik emniyet yedeği (${targetFile})`);
    preBackupName = preBackup.filename;
  } catch (err) {
    console.error("[Restore] Emniyet yedeği alınamadı:", err);
  }

  try {
    const raw = fs.readFileSync(backupPath, "utf-8");
    const data: Record<string, any[]> = JSON.parse(raw);

    for (const [table, rows] of Object.entries(data)) {
      if (!TABLES.includes(table)) continue;
      if (Array.isArray(rows) && rows.length > 0) {
        for (const row of rows) {
          const keys = Object.keys(row).map((k) => `\`${k}\``).join(", ");
          const placeholders = Object.keys(row).map(() => "?").join(", ");
          const values = Object.values(row);
          await pool.query(
            `REPLACE INTO \`${table}\` (${keys}) VALUES (${placeholders})`,
            values
          );
        }
      }
    }

    console.log(`[Restore] ✅ Veritabanı '${targetFile}' yedeğinden başarıyla geri yüklendi!`);
    return {
      success: true,
      message: `Veritabanı '${targetFile}' yedeğinden başarıyla geri yüklendi.`,
      preRestoreBackup: preBackupName,
    };
  } catch (error: any) {
    console.error("[Restore] Geri yükleme hatası:", error);
    throw new Error(`Geri yükleme başarısız oldu: ${error?.message || String(error)}`);
  }
}

/**
 * 30 günden eski veya en yeni 30 adetten fazla olan otomatik yedekleri temizler
 */
export async function cleanOldBackups(retentionDays = 30, maxBackups = 30) {
  try {
    const all = await listDatabaseBackups();
    const now = Date.now();
    const maxAgeMs = retentionDays * 24 * 60 * 60 * 1000;

    const autoBackups = all.filter((b) => b.backupType === "AUTOMATIC");

    if (autoBackups.length > maxBackups) {
      const toDelete = autoBackups.slice(maxBackups);
      for (const b of toDelete) {
        if (now - b.createdAt > maxAgeMs) {
          try {
            if (fs.existsSync(b.filepath)) fs.unlinkSync(b.filepath);
            await db.delete(databaseBackups).where(eq(databaseBackups.filename, b.filename));
            console.log(`[Backup Cleaner] Eski yedek silindi: ${b.filename}`);
          } catch {}
        }
      }
    }
  } catch (e) {
    console.warn("[Backup Cleaner] Hata:", e);
  }
}

let dailyBackupTimer: NodeJS.Timeout | null = null;

export function startDailyBackupScheduler() {
  if (dailyBackupTimer) return;

  console.log("[Backup Scheduler] 🕒 Günlük otomatik veritabanı yedekleme servisi aktif edildi.");

  setTimeout(async () => {
    try {
      const list = await listDatabaseBackups();
      const lastBackup = list[0];
      const oneDayMs = 24 * 60 * 60 * 1000;
      if (!lastBackup || Date.now() - lastBackup.createdAt > oneDayMs) {
        console.log("[Backup Scheduler] Son 24 saatte yedek bulunamadı, otomatik yedek alınıyor...");
        await createDatabaseBackup("AUTOMATIC", "Sistem başlangıcı ilk otomatik yedek");
      }
    } catch (e) {
      console.warn("[Backup Scheduler] İlk yedekleme kontrol hatası:", e);
    }
  }, 5000);

  dailyBackupTimer = setInterval(async () => {
    try {
      console.log("[Backup Scheduler] Günlük periyodik yedekleme başlatılıyor...");
      await createDatabaseBackup("AUTOMATIC", "Günlük 24 saatlik otomatik sistem yedeği");
    } catch (e) {
      console.error("[Backup Scheduler] Günlük periyodik yedekleme hatası:", e);
    }
  }, 24 * 60 * 60 * 1000);
}
