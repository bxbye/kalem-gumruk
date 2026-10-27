import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema.js";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import { fileURLToPath } from "url";
import { companyInfo } from "../data/company.js";
import { gerekliBaglantilarData } from "../data/gerekliBaglantilar.js";
import { servicesData } from "../data/services.js";
import { defaultSirkuler } from "../data/sirkuler.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// backend/data dizini
export const dataDir = path.resolve(__dirname, "../../data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

export const sqlitePath = path.join(dataDir, "kalem.sqlite");
console.log(`[DB] SQLite veritabanı yolu: ${sqlitePath}`);

export const sqlite = new Database(sqlitePath, { timeout: 30000 });

// Performans optimizasyonları (WAL modu + bellek önbelleği)
sqlite.pragma("journal_mode = WAL");
sqlite.pragma("synchronous = NORMAL");
sqlite.pragma("busy_timeout = 30000");
sqlite.pragma("cache_size = -64000"); // 64MB RAM önbellek

export const db = drizzle(sqlite, { schema });

let isInitialized = false;

export function ensureDatabaseInitialized() {
  if (isInitialized) return;

  try {
    // 1. Tabloları oluştur
    sqlite.exec(`
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
        is_approved INTEGER NOT NULL DEFAULT 0,
        created_at INTEGER
      );

      CREATE TABLE IF NOT EXISTS chat_conversations (
        id TEXT PRIMARY KEY,
        session_id TEXT UNIQUE NOT NULL,
        contact_info TEXT,
        question TEXT,
        messages TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'NEW',
        is_lead_captured INTEGER NOT NULL DEFAULT 0,
        created_at INTEGER,
        updated_at INTEGER
      );

      CREATE TABLE IF NOT EXISTS site_settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL,
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

      CREATE TABLE IF NOT EXISTS "references" (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        sector TEXT NOT NULL,
        description TEXT,
        logo_url TEXT,
        order_index INTEGER NOT NULL DEFAULT 0,
        is_active INTEGER NOT NULL DEFAULT 1,
        created_at INTEGER
      );

      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        name TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'EDITOR',
        permissions TEXT NOT NULL DEFAULT '{}',
        is_active INTEGER NOT NULL DEFAULT 1,
        created_at INTEGER,
        updated_at INTEGER
      );

      CREATE TABLE IF NOT EXISTS database_backups (
        id TEXT PRIMARY KEY,
        filename TEXT UNIQUE NOT NULL,
        filepath TEXT NOT NULL,
        size_bytes INTEGER NOT NULL,
        backup_type TEXT NOT NULL DEFAULT 'AUTOMATIC',
        note TEXT,
        created_at INTEGER
      );
    `);

    // 2. Başlangıç Hizmet Verilerini Yükle
    const countServices = sqlite.prepare("SELECT count(*) as count FROM services").get() as { count: number };
    if (countServices.count === 0) {
      const insertService = sqlite.prepare(`
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
      console.log(`[DB Seed] ${servicesData.length} hizmet eklendi.`);
    }

    // 3. Başlangıç Sirküler Verilerini Yükle
    const countSirkuler = sqlite.prepare("SELECT count(*) as count FROM sirkuler").get() as { count: number };
    if (countSirkuler.count === 0) {
      const insertSirkuler = sqlite.prepare(`
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
      console.log(`[DB Seed] ${defaultSirkuler.length} sirküler eklendi.`);
    }

    // 4. Başlangıç Gerekli Bağlantılar Verilerini Yükle
    const countBaglanti = sqlite.prepare("SELECT count(*) as count FROM gerekli_baglantilar").get() as { count: number };
    if (countBaglanti.count === 0) {
      const insertBaglanti = sqlite.prepare(`
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
      console.log(`[DB Seed] ${gerekliBaglantilarData.length} bağlantı eklendi.`);
    }

    // 5. Başlangıç Formlarını Tanımla (fiyat-teklifi, iletisim, kariyer-staj)
    const countForms = sqlite.prepare("SELECT count(*) as count FROM forms").get() as { count: number };
    if (countForms.count === 0) {
      const insertForm = sqlite.prepare(`
        INSERT OR IGNORE INTO forms (id, slug, title, description, category, fields, settings, is_active, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      insertForm.run(
        "form_fiyat_teklifi",
        "fiyat-teklifi",
        "Fiyat Teklifi İsteme Formu",
        "İthalat, ihracat ve antrepo operasyonlarınız için gümrük müşavirimizden özel fiyat teklifi talep edin.",
        "quote",
        JSON.stringify([
          { name: "fullName", label: "Adınız Soyadınız", type: "text", required: true, placeholder: "Örn: Ahmet Yılmaz" },
          { name: "company", label: "Firma / Kurum Adı", type: "text", required: false, placeholder: "Örn: ABC Dış Ticaret Ltd." },
          { name: "phone", label: "Telefon Numaranız", type: "tel", required: true, placeholder: "05XX XXX XX XX" },
          { name: "email", label: "E-Posta Adresiniz", type: "email", required: false, placeholder: "adiniz@sirketiniz.com" },
          {
            name: "operationType",
            label: "İşlem Türü / Gümrük Rejimi",
            type: "select",
            required: true,
            options: [
              "İthalat Gümrükleme",
              "İhracat Gümrükleme",
              "Antrepo & Depolama",
              "Transit Ticaret",
              "Dahilde İşleme (DİİB)",
              "Gümrük Danışmanlığı & Mevzuat"
            ]
          },
          {
            name: "volume",
            label: "Aylık Dosya Hacmi",
            type: "select",
            required: false,
            options: [
              "Tek Seferlik Dosya",
              "1 - 5 Dosya / Ay (Düzenli)",
              "5 - 20 Dosya / Ay (Yüksek)",
              "20+ Dosya / Ay (Kurumsal)"
            ]
          },
          {
            name: "customsOffice",
            label: "Hedef Gümrük / Liman",
            type: "select",
            required: false,
            options: [
              "İstanbul Limanları (Ambarlı / Kumport / Marport)",
              "İstanbul Karayolu (Erenköy / Muratbey)",
              "Havalimanı Kargo (İGA / SAW)",
              "Kocaeli / Dilovası / Evyapport / DP World",
              "İzmir / Mersin / Gemlik Limanları",
              "Diğer Tüm Gümrük İdareleri"
            ]
          },
          { name: "gtipOrProduct", label: "GTİP No veya Eşya Tanımı", type: "text", required: false, placeholder: "Örn: 8471.30 veya Endüstriyel Elektronik Kart" },
          { name: "message", label: "Sevkiyat ve Fiyat Teklifi Detayları", type: "textarea", required: true, placeholder: "Konteyner/koli adedi, çıkış ülkesi veya sormak istedikleriniz..." },
          { name: "files", label: "Fatura / Konşimento / Çeki Listesi (Opsiyonel)", type: "file", required: false, helpText: "PDF, JPG veya PNG formatında yükleyebilirsiniz." }
        ]),
        JSON.stringify({
          successMessage: "Fiyat teklif talebiniz başarıyla alındı! Gümrük müşavirimiz en kısa sürede analiz ederek tarafınıza dönecektir.",
          autoEmailSubject: "Fiyat Teklifi Talebiniz Alındı | Kalem Gümrük Müşavirliği (#{{refNo}})",
          autoEmailBody: "Sayın {{fullName}},\n\nKalem Gümrük Müşavirliği'ne iletmiş olduğunuz fiyat teklif talebi operasyon ekibimize iletilmiştir. Gümrük müşavirimiz mevzuat ve tarife kontrollerini yaparak en kısa sürede dönüş sağlayacaktır.\n\nSaygılarımızla,\nKalem Gümrük Müşavirliği",
          notificationEmail: "kadir.kaya@kayapermit.com"
        }),
        1,
        Date.now(),
        Date.now()
      );

      insertForm.run(
        "form_iletisim",
        "iletisim",
        "Genel İletişim & Danışma Formu",
        "Gümrük süreçleri, dış ticaret mevzuatı veya hizmetlerimiz hakkında doğrudan bize mesaj iletebilirsiniz.",
        "general",
        JSON.stringify([
          { name: "fullName", label: "Adınız Soyadınız", type: "text", required: true, placeholder: "Adınız Soyadınız" },
          { name: "company", label: "Firma / Kurum", type: "text", required: false, placeholder: "Firma Adı (varsa)" },
          { name: "phone", label: "Telefon Numarası", type: "tel", required: true, placeholder: "05XX XXX XX XX" },
          { name: "email", label: "E-Posta Adresi", type: "email", required: false, placeholder: "ornek@domain.com" },
          {
            name: "subject",
            label: "Konu / Hizmet Alanı",
            type: "select",
            required: true,
            options: [
              "Genel Bilgi & İletişim",
              "Mevzuat Danışmanlığı",
              "İthalat / İhracat Operasyonu",
              "Yetkilendirilmiş Yükümlü (YYS)",
              "Diğer"
            ]
          },
          { name: "message", label: "Mesajınız", type: "textarea", required: true, placeholder: "Lütfen mesajınızı detaylıca belirtiniz..." }
        ]),
        JSON.stringify({
          successMessage: "Mesajınız başarıyla iletildi. Müşteri temsilcimiz en kısa sürede sizinle iletişime geçecektir.",
          autoEmailSubject: "Mesajınız Alındı | Kalem Gümrük Müşavirliği (#{{refNo}})",
          autoEmailBody: "Sayın {{fullName}},\n\nİletişim talebiniz merkezimize ulaşmıştır. Konuyla ilgili müşteri temsilcimiz sizinle irtibata geçecektir.\n\nSaygılarımızla,\nKalem Gümrük Müşavirliği",
          notificationEmail: "kadir.kaya@kayapermit.com"
        }),
        1,
        Date.now(),
        Date.now()
      );

      insertForm.run(
        "form_kariyer_staj",
        "kariyer-staj",
        "İş & Staj Başvuru Formu",
        "Kalem Gümrük Müşavirliği bünyesinde kariyer fırsatları.",
        "career",
        JSON.stringify([
          { name: "fullName", label: "Adınız Soyadınız", type: "text", required: true, placeholder: "Ad Soyad" },
          { name: "email", label: "E-Posta Adresi", type: "email", required: true, placeholder: "ad.soyad@email.com" },
          { name: "phone", label: "Telefon Numarası", type: "tel", required: true, placeholder: "05XX XXX XX XX" },
          {
            name: "applicationType",
            label: "Başvuru Türü",
            type: "select",
            required: true,
            options: [
              "Gümrük Müşavir Yardımcısı (B Karne)",
              "Müşteri Temsilcisi & Operasyon",
              "Dış Ticaret / Gümrük Stajyeri",
              "Saha & Kurye Personeli",
              "Genel Başvuru"
            ]
          },
          { name: "experience", label: "Gümrük / Dış Ticaret Deneyiminiz", type: "text", required: false, placeholder: "Örn: 2 yıl ithalat operasyon deneyimi" },
          { name: "coverLetter", label: "Ön Yazı / Kendinizi Tanıtın", type: "textarea", required: false, placeholder: "Kariyer hedefleriniz, bildiğiniz programlar (Evrim vb.)..." },
          { name: "cvFile", label: "Özgeçmiş / CV Dosyası (PDF veya Word)", type: "file", required: true, helpText: "Maksimum 10MB boyutunda PDF veya Word dosyası yükleyiniz." }
        ]),
        JSON.stringify({
          successMessage: "Başvurunuz ve özgeçmişiniz İnsan Kaynakları havuzumuza başarıyla kaydedilmiştir. Teşekkür ederiz.",
          autoEmailSubject: "İş/Staj Başvurunuz Alındı | Kalem Gümrük İK (#{{refNo}})",
          autoEmailBody: "Sayın {{fullName}},\n\nKalem Gümrük Müşavirliği bünyesindeki açık pozisyonlara göstermiş olduğunuz ilgi için teşekkür ederiz. Başvurunuz ve özgeçmişiniz İnsan Kaynakları havuzumuza dahil edilmiştir.",
          notificationEmail: "ik@kalemgumruk.com"
        }),
        1,
        Date.now(),
        Date.now()
      );
      console.log("[DB Seed] Standart fiyat teklifi, iletişim ve kariyer formları eklendi.");
    }

    // 6. Başlangıç Belgeleri Yükle
    const countDocs = sqlite.prepare("SELECT count(*) as count FROM documents").get() as { count: number };
    if (countDocs.count === 0) {
      const insertDoc = sqlite.prepare(`
        INSERT OR IGNORE INTO documents (id, title, description, category, file_url, file_key, file_size, file_type, download_count, is_public, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      const defaultDocs = [
        {
          id: "doc-1",
          title: "Gümrük Müşavirliği İzin Belgesi",
          description: "T.C. Ticaret Bakanlığı yetkili gümrük müşavirliği resmi izin belgemiz.",
          category: "legal",
          fileUrl: "/documents/gumruk-musavirligi-izin-belgesi.pdf",
          fileKey: null,
          fileSize: "148 KB",
          fileType: "pdf",
          downloadCount: 245,
        },
        {
          id: "doc-2",
          title: "ISO 9001:2015 Kalite Yönetim Sertifikası",
          description: "Tüm operasyonel gümrükleme ve danışmanlık hizmetlerimizin uluslararası kalite tescili.",
          category: "quality",
          fileUrl: "/documents/kalem-iso-9001-belgesi.pdf",
          fileKey: null,
          fileSize: "148 KB",
          fileType: "pdf",
          downloadCount: 182,
        },
        {
          id: "doc-3",
          title: "Gümrük İş Talimat ve Başvuru Formu",
          description: "İthalat, ihracat ve antrepo işlemleri öncesinde doldurulması gereken resmi talimat formu.",
          category: "forms",
          fileUrl: "/documents/gumruk-is-talimat-formu.pdf",
          fileKey: null,
          fileSize: "148 KB",
          fileType: "pdf",
          downloadCount: 310,
        },
        {
          id: "doc-4",
          title: "Gümrük Vekaletname Örneği",
          description: "Noter kanalıyla firmamız adına düzenlenecek gümrük müşavirliği vekaletname taslağı.",
          category: "legal",
          fileUrl: "/documents/kalem-gumruk-vekaletname-ornegi.pdf",
          fileKey: null,
          fileSize: "148 KB",
          fileType: "pdf",
          downloadCount: 428,
        },
      ];

      defaultDocs.forEach((d) => {
        insertDoc.run(
          d.id,
          d.title,
          d.description,
          d.category,
          d.fileUrl,
          d.fileKey,
          d.fileSize,
          d.fileType,
          d.downloadCount,
          1,
          Date.now()
        );
      });
      console.log(`[DB Seed] ${defaultDocs.length} varsayılan belge eklendi.`);
    }

    // 7. Başlangıç Referanslarını Yükle
    const countRefs = sqlite.prepare('SELECT count(*) as count FROM "references"').get() as { count: number };
    if (countRefs.count === 0) {
      const insertRef = sqlite.prepare(`
        INSERT OR IGNORE INTO "references" (id, name, sector, description, logo_url, order_index, is_active, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);

      const defaultReferences = [
        { id: "ref-1", name: "Atlas Dış Ticaret A.Ş.", sector: "Makine & Endüstri", description: "Avrupa ve Uzak Doğu ithalat operasyonları", orderIndex: 1 },
        { id: "ref-2", name: "Global Logistics Group", sector: "Lojistik & Antrepo", description: "Transit ticaret ve antrepo gümrükleme süreçleri", orderIndex: 2 },
        { id: "ref-3", name: "Demir Otomotiv Yan Sanayi", sector: "Otomotiv", description: "Dahilde İşleme İzin Belgesi yönetimi ve ihracat", orderIndex: 3 },
        { id: "ref-4", name: "Mega Kimya Sanayi", sector: "Kimya & Hammadde", description: "Tareks, TSE ve ihtisas gümrükleme işlemleri", orderIndex: 4 },
        { id: "ref-5", name: "TeknoMed Sağlık Ürünleri", sector: "Medikal & İlaç", description: "TİTCK izinleri ve soğuk zincir gümrükleme", orderIndex: 5 },
      ];

      defaultReferences.forEach((r) => {
        insertRef.run(r.id, r.name, r.sector, r.description, null, r.orderIndex, 1, Date.now());
      });
      console.log(`[DB Seed] ${defaultReferences.length} referans firma eklendi.`);
    }

    // 8. Başlangıç Müşteri Değerlendirmeleri Yükle
    const countFeedbacks = sqlite.prepare("SELECT count(*) as count FROM customer_feedbacks").get() as { count: number };
    if (countFeedbacks.count === 0) {
      const insertFb = sqlite.prepare(`
        INSERT OR IGNORE INTO customer_feedbacks (id, full_name, company, rating, service_type, comment, is_approved, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);

      const defaultFeedbacks = [
        {
          id: "fb-1",
          fullName: "Mehmet Yılmaz",
          company: "Atlas Dış Ticaret A.Ş.",
          rating: 5,
          serviceType: "İthalat Gümrükleme",
          comment: "Uzun yıllardır birlikte çalıştığımız yetkili gümrük müşavirliği. Dijital arşivleme ve Evrim sistemi takipleri hızımıza hız katıyor.",
        },
        {
          id: "fb-2",
          fullName: "Elena Petrova",
          company: "Global Logistics Group",
          rating: 5,
          serviceType: "Transit ve Antrepo",
          comment: "Ambarlı ve Erenköy operasyonlarımızda gümrük süreçlerimiz sıfır gecikmeyle sonuçlanıyor. Profesyonel kadroya teşekkürler.",
        },
        {
          id: "fb-3",
          fullName: "Ahmet Demir",
          company: "Demir Otomotiv Yan Sanayi",
          rating: 5,
          serviceType: "Dahilde İşleme Rejimi",
          comment: "DİR izin süre uzatımları ve mevzuat tebliğlerindeki hızlı bilgilendirmeleri sayesinde maliyet avantajı sağladık.",
        },
      ];

      defaultFeedbacks.forEach((fb) => {
        insertFb.run(fb.id, fb.fullName, fb.company, fb.rating, fb.serviceType, fb.comment, 1, Date.now());
      });
      console.log(`[DB Seed] ${defaultFeedbacks.length} onaylı müşteri değerlendirmesi eklendi.`);
    }

    // 9. Başlangıç Kullanıcılarını Oluştur (Admin & Editör)
    const countUsers = sqlite.prepare("SELECT count(*) as count FROM users").get() as { count: number };
    if (countUsers.count === 0) {
      function quickHash(pw: string): string {
        const salt = crypto.randomBytes(16).toString("hex");
        const key = crypto.scryptSync(pw, salt, 64);
        return `${salt}:${key.toString("hex")}`;
      }

      const insertUser = sqlite.prepare(`
        INSERT OR IGNORE INTO users (id, username, password_hash, name, role, permissions, is_active, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      const adminPassword = (process.env.ADMIN_PASSWORD || "kalem1997").trim();
      const editorPassword = (process.env.EDITOR_PASSWORD || "editor1997").trim();

      // 1. Yönetici Kullanıcısı (Tüm yetkiler açık)
      insertUser.run(
        "user-admin",
        (process.env.ADMIN_USERNAME || "admin").trim(),
        quickHash(adminPassword),
        "Sistem Yöneticisi",
        "ADMIN",
        JSON.stringify({
          canEditServices: true,
          canEditSirkuler: true,
          canEditBaglantilar: true,
          canEditReferences: true,
          canEditForms: true,
          canEditDocuments: true,
          canManageSettings: true,
          canManageUsers: true,
          canManageBackups: true,
          canDelete: true,
        }),
        1,
        Date.now(),
        Date.now()
      );

      // 2. Editör Kullanıcısı (Ekleme ve Düzenleme yapabilir, ASLA SİLEMEZ)
      insertUser.run(
        "user-editor",
        (process.env.EDITOR_USERNAME || "editor").trim(),
        quickHash(editorPassword),
        "Mevzuat & İçerik Editörü",
        "EDITOR",
        JSON.stringify({
          canEditServices: true,
          canEditSirkuler: true,
          canEditBaglantilar: true,
          canEditReferences: true,
          canEditForms: false,
          canEditDocuments: true,
          canManageSettings: false,
          canManageUsers: false,
          canManageBackups: false,
          canDelete: false, // Editör silme yapamaz!
        }),
        1,
        Date.now(),
        Date.now()
      );

      console.log("[DB Seed] Varsayılan 'admin' ve 'editor' kullanıcı hesapları oluşturuldu.");
    }

    isInitialized = true;
  } catch (error) {
    console.error("[DB Init Hatası]:", error);
  }
}
