import * as schema from "./schema";
import path from "path";
import fs from "fs";
import { companyInfo } from "@/data/company";
import { gerekliBaglantilarData } from "@/data/gerekliBaglantilar";
import { servicesData } from "@/data/services";
import { defaultSirkuler } from "@/data/sirkuler";

let sqliteInstance: any = null;
let dbInstance: any = null;

function initSqlite(Database: any): any {
  try {
    const dataDir = path.join(process.cwd(), "data");
    try {
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
    } catch {}

    const sqlitePath = path.join(dataDir, "kalem.sqlite");
    const instance = new Database(sqlitePath, { timeout: 30000 });
    try { instance.pragma("busy_timeout = 30000"); } catch {}
    try { instance.pragma("journal_mode = WAL"); } catch {}
    return instance;
  } catch (error) {
    console.warn("Dosya tabanlı SQLite açılamadı, bellek içi (:memory:) SQLite başlatılıyor:", error);
    try {
      return new Database(":memory:");
    } catch (e) {
      console.error("SQLite başlatma hatası:", e);
      throw e;
    }
  }
}

function getDatabase() {
  if (dbInstance) return dbInstance;
  try {
    // Sadece better-sqlite3 yüklenebilen Node.js ortamında çalıştır
    // Cloudflare Workers (workerd) runtime'ında C++ native addon desteklenmez
    if (typeof process !== "undefined" && process.versions?.node) {
      // eval("require") sayesinde bundler (esbuild/webpack) better_sqlite3.node'u bundle'a zorlamaz
      const req = typeof __non_webpack_require__ !== "undefined" ? __non_webpack_require__ : eval("require");
      const Database = req("better-sqlite3");
      const { drizzle } = req("drizzle-orm/better-sqlite3");
      sqliteInstance = initSqlite(Database);
      dbInstance = drizzle(sqliteInstance, { schema });
      return dbInstance;
    }
  } catch (e) {
    // Cloudflare Workers ortamında sqlite desteklenmez, fallback kullanılır
  }
  return null;
}

// Güvenli DB Proxy: Veritabanı yoksa uygulamanın çökmesini engeller, catch bloklarını tetikler
export const db = new Proxy({} as any, {
  get(_target, prop) {
    const realDb = getDatabase();
    if (realDb && typeof realDb[prop] !== "undefined") {
      const val = realDb[prop];
      return typeof val === "function" ? val.bind(realDb) : val;
    }
    return () => {
      throw new Error("SQLite veritabanı Cloudflare Workers çalışma ortamında desteklenmemektedir.");
    };
  },
});

declare const __non_webpack_require__: any;

// Otomatik Tablo Oluşturma ve Başlangıç Verilerini (Seed) Yükleme
let isInitialized = false;

export function ensureDatabaseInitialized() {
  if (isInitialized) return;

  const realDb = getDatabase();
  if (!realDb || !sqliteInstance) return;

  try {
    const tableCheck = sqliteInstance
      .prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='services'")
      .get();
    if (tableCheck) {
      isInitialized = true;
      return;
    }
    // 1. Tabloları oluştur
    sqliteInstance.exec(`
      CREATE TABLE IF NOT EXISTS forms (
        id TEXT PRIMARY KEY,
        slug TEXT UNIQUE NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        category TEXT NOT NULL DEFAULT 'general',
        fields TEXT NOT NULL,
        settings TEXT NOT NULL,
        is_active INTEGER NOT NULL DEFAULT 1,
        created_at INTEGER,
        updated_at INTEGER
      );

      CREATE TABLE IF NOT EXISTS form_submissions (
        id TEXT PRIMARY KEY,
        form_slug TEXT NOT NULL,
        data TEXT NOT NULL,
        files TEXT DEFAULT '[]',
        status TEXT NOT NULL DEFAULT 'NEW',
        admin_notes TEXT,
        ip_address TEXT,
        created_at INTEGER,
        updated_at INTEGER
      );

      CREATE TABLE IF NOT EXISTS documents (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        category TEXT NOT NULL,
        file_url TEXT NOT NULL,
        file_key TEXT,
        file_size TEXT NOT NULL,
        file_type TEXT NOT NULL DEFAULT 'pdf',
        download_count INTEGER NOT NULL DEFAULT 0,
        is_public INTEGER NOT NULL DEFAULT 1,
        created_at INTEGER
      );

      CREATE TABLE IF NOT EXISTS sirkuler (
        id TEXT PRIMARY KEY,
        slug TEXT UNIQUE NOT NULL,
        title TEXT NOT NULL,
        category TEXT NOT NULL,
        regulation_type TEXT,
        official_gazette_number TEXT,
        related_gtip TEXT,
        summary TEXT NOT NULL,
        content TEXT NOT NULL,
        expert_note TEXT,
        source_url TEXT,
        pdf_url TEXT,
        author TEXT NOT NULL DEFAULT 'Kalem Gümrük Mevzuat Kurulu',
        views_count INTEGER NOT NULL DEFAULT 0,
        is_published INTEGER NOT NULL DEFAULT 1,
        date TEXT NOT NULL,
        translations TEXT DEFAULT '{}',
        created_at INTEGER
      );

      CREATE TABLE IF NOT EXISTS customer_feedbacks (
        id TEXT PRIMARY KEY,
        full_name TEXT NOT NULL,
        company TEXT,
        rating INTEGER NOT NULL,
        service_type TEXT,
        comment TEXT NOT NULL,
        is_approved INTEGER NOT NULL DEFAULT 1,
        created_at INTEGER
      );

      CREATE TABLE IF NOT EXISTS chat_leads (
        id TEXT PRIMARY KEY,
        full_name TEXT NOT NULL,
        phone TEXT NOT NULL,
        email TEXT,
        service_interest TEXT,
        notes TEXT,
        status TEXT NOT NULL DEFAULT 'NEW',
        created_at INTEGER
      );

      CREATE TABLE IF NOT EXISTS services (
        id TEXT PRIMARY KEY,
        slug TEXT UNIQUE NOT NULL,
        title TEXT NOT NULL,
        short_desc TEXT NOT NULL,
        icon_name TEXT NOT NULL,
        category TEXT NOT NULL,
        features TEXT NOT NULL,
        detailed_content TEXT NOT NULL,
        order_index INTEGER NOT NULL DEFAULT 0,
        is_active INTEGER NOT NULL DEFAULT 1,
        translations TEXT DEFAULT '{}',
        created_at INTEGER
      );

      CREATE TABLE IF NOT EXISTS site_settings (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT NOT NULL,
        gsm TEXT NOT NULL,
        address TEXT NOT NULL,
        social_links TEXT NOT NULL,
        tax_office TEXT NOT NULL,
        tax_number TEXT NOT NULL,
        ticaret_sicil_no TEXT NOT NULL,
        mersis_no TEXT NOT NULL,
        kep_address TEXT NOT NULL,
        updated_at INTEGER
      );

      CREATE TABLE IF NOT EXISTS gerekli_baglantilar (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        short_title TEXT NOT NULL,
        category TEXT NOT NULL,
        url TEXT NOT NULL,
        image TEXT NOT NULL,
        description TEXT NOT NULL,
        tag TEXT NOT NULL,
        order_index INTEGER NOT NULL DEFAULT 0,
        is_active INTEGER NOT NULL DEFAULT 1,
        created_at INTEGER
      );
    `);

    // 2. Başlangıç Hizmet Verilerini Yükle
    const insertService = sqliteInstance.prepare(`
      INSERT OR IGNORE INTO services (id, slug, title, short_desc, icon_name, category, features, detailed_content, order_index, is_active, translations, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    servicesData.forEach((s, idx) => {
      insertService.run(
        `service-${s.slug}`,
        s.slug,
        s.title,
        s.shortDesc,
        s.iconName,
        s.category,
        JSON.stringify(s.features),
        s.detailedContent,
        idx,
        1,
        JSON.stringify({}),
        Date.now()
      );
    });

    // 3. Başlangıç Sirküler Verilerini Yükle
    const insertSirkuler = sqliteInstance.prepare(`
      INSERT OR IGNORE INTO sirkuler (id, slug, title, category, regulation_type, official_gazette_number, related_gtip, summary, content, expert_note, source_url, pdf_url, author, views_count, is_published, date, translations, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    defaultSirkuler.forEach((s) => {
      insertSirkuler.run(
        s.id,
        s.slug,
        s.title,
        s.category,
        s.regulationType || null,
        s.officialGazetteNumber || null,
        s.relatedGtip || null,
        s.summary,
        s.content,
        s.expertNote || null,
        s.sourceUrl || null,
        s.pdfUrl || null,
        s.author || "Kalem Gümrük Mevzuat Kurulu",
        0,
        1,
        s.date,
        JSON.stringify({}),
        Date.now()
      );
    });

    // 4. Başlangıç Ayarlarını Yükle
    const insertSettings = sqliteInstance.prepare(`
      INSERT OR IGNORE INTO site_settings (id, title, email, phone, gsm, address, social_links, tax_office, tax_number, ticaret_sicil_no, mersis_no, kep_address, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const compAny = companyInfo as any;
    insertSettings.run(
      "default",
      compAny.fullName || companyInfo.name,
      companyInfo.email,
      companyInfo.phone,
      compAny.gsm || companyInfo.phone,
      companyInfo.address,
      JSON.stringify(compAny.social || {}),
      compAny.taxOffice || "",
      compAny.taxNumber || "",
      compAny.ticaretSicilNo || "",
      compAny.mersisNo || "",
      compAny.kepAddress || "",
      Date.now()
    );

    // 5. Başlangıç Gerekli Bağlantılar Verilerini Yükle
    const insertBaglanti = sqliteInstance.prepare(`
      INSERT OR IGNORE INTO gerekli_baglantilar (id, title, short_title, category, url, image, description, tag, order_index, is_active, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    gerekliBaglantilarData.forEach((b, idx) => {
      insertBaglanti.run(
        b.id,
        b.title,
        b.shortTitle,
        b.category,
        b.url,
        b.image,
        b.description,
        b.tag,
        idx,
        1,
        Date.now()
      );
    });

    isInitialized = true;
  } catch (error) {
    console.error("Veritabanı başlatma hatası:", error);
  }
}
