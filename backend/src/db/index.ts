import mysql from "mysql2/promise";
import { drizzle } from "drizzle-orm/mysql2";
import * as schema from "./schema.js";
import crypto from "crypto";
import { companyInfo } from "../data/company.js";
import { gerekliBaglantilarData } from "../data/gerekliBaglantilar.js";
import { servicesData } from "../data/services.js";
import { defaultSirkuler } from "../data/sirkuler.js";

const DB_HOST = process.env.DB_HOST || "localhost";
const DB_PORT = Number(process.env.DB_PORT) || 3306;
const DB_USER = process.env.DB_USER || "kadirkaya";
const DB_PASSWORD = process.env.DB_PASSWORD || "kadirkaya";
const DB_NAME = process.env.DB_NAME || "kalemgumruk_yeni";

console.log(`[DB] MySQL Bağlantısı Başlatılıyor: ${DB_USER}@${DB_HOST}:${DB_PORT}/${DB_NAME}`);

export const pool = mysql.createPool({
  host: DB_HOST,
  port: DB_PORT,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: "utf8mb4",
});

export const db = drizzle(pool, { schema, mode: "default" });

let isInitialized = false;

export async function ensureDatabaseInitialized() {
  if (isInitialized) return;

  try {
    // 1. Tabloları oluştur
    await pool.query(`
      CREATE TABLE IF NOT EXISTS forms (
        id VARCHAR(191) PRIMARY KEY,
        slug VARCHAR(191) UNIQUE NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        category VARCHAR(100) NOT NULL DEFAULT 'general',
        fields LONGTEXT NOT NULL,
        settings LONGTEXT NOT NULL,
        is_active BOOLEAN NOT NULL DEFAULT TRUE,
        created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS form_submissions (
        id VARCHAR(191) PRIMARY KEY,
        form_slug VARCHAR(191) NOT NULL,
        data LONGTEXT NOT NULL,
        files LONGTEXT,
        status VARCHAR(50) NOT NULL DEFAULT 'NEW',
        admin_notes TEXT,
        ip_address VARCHAR(100),
        created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS documents (
        id VARCHAR(191) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        category VARCHAR(100) NOT NULL,
        file_url VARCHAR(500) NOT NULL,
        file_key VARCHAR(255),
        file_size VARCHAR(50) NOT NULL,
        file_type VARCHAR(50) NOT NULL DEFAULT 'pdf',
        download_count INT NOT NULL DEFAULT 0,
        is_public BOOLEAN NOT NULL DEFAULT TRUE,
        created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS sirkuler (
        id VARCHAR(191) PRIMARY KEY,
        slug VARCHAR(191) UNIQUE NOT NULL,
        title VARCHAR(500) NOT NULL,
        category VARCHAR(100) NOT NULL,
        regulation_type VARCHAR(100),
        official_gazette_number VARCHAR(100),
        related_gtip VARCHAR(255),
        summary TEXT NOT NULL,
        content LONGTEXT NOT NULL,
        expert_note TEXT,
        source_url VARCHAR(500),
        pdf_url VARCHAR(500),
        author VARCHAR(255) NOT NULL DEFAULT 'Kalem Gümrük Mevzuat Kurulu',
        views_count INT NOT NULL DEFAULT 0,
        is_published BOOLEAN NOT NULL DEFAULT TRUE,
        date VARCHAR(50) NOT NULL,
        translations LONGTEXT,
        created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS customer_feedbacks (
        id VARCHAR(191) PRIMARY KEY,
        full_name VARCHAR(255) NOT NULL,
        company VARCHAR(255),
        rating INT NOT NULL,
        service_type VARCHAR(100),
        comment TEXT NOT NULL,
        is_approved BOOLEAN NOT NULL DEFAULT FALSE,
        created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS chat_conversations (
        id VARCHAR(191) PRIMARY KEY,
        session_id VARCHAR(191) UNIQUE NOT NULL,
        contact_info TEXT,
        question TEXT,
        messages LONGTEXT NOT NULL,
        status VARCHAR(50) NOT NULL DEFAULT 'NEW',
        is_lead_captured BOOLEAN NOT NULL DEFAULT FALSE,
        created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS site_settings (
        \`key\` VARCHAR(191) PRIMARY KEY,
        value LONGTEXT NOT NULL,
        updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS gerekli_baglantilar (
        id VARCHAR(191) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        short_title VARCHAR(100) NOT NULL,
        category VARCHAR(100) NOT NULL,
        url VARCHAR(500) NOT NULL,
        image VARCHAR(500) NOT NULL,
        description TEXT NOT NULL,
        tag VARCHAR(100) NOT NULL,
        order_index INT NOT NULL DEFAULT 0,
        is_active BOOLEAN NOT NULL DEFAULT TRUE,
        created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS services (
        id VARCHAR(191) PRIMARY KEY,
        slug VARCHAR(191) UNIQUE NOT NULL,
        title VARCHAR(255) NOT NULL,
        short_desc TEXT NOT NULL,
        icon_name VARCHAR(100) NOT NULL DEFAULT 'ArrowDownToLine',
        category VARCHAR(100) NOT NULL DEFAULT 'gumruk',
        features LONGTEXT NOT NULL,
        detailed_content LONGTEXT NOT NULL,
        order_index INT NOT NULL DEFAULT 0,
        is_active BOOLEAN NOT NULL DEFAULT TRUE,
        translations LONGTEXT,
        created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS \`references\` (
        id VARCHAR(191) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        sector VARCHAR(100) NOT NULL,
        description TEXT,
        logo_url VARCHAR(500),
        order_index INT NOT NULL DEFAULT 0,
        is_active BOOLEAN NOT NULL DEFAULT TRUE,
        created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(191) PRIMARY KEY,
        username VARCHAR(191) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL DEFAULT 'EDITOR',
        permissions LONGTEXT,
        is_active BOOLEAN NOT NULL DEFAULT TRUE,
        created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS database_backups (
        id VARCHAR(191) PRIMARY KEY,
        filename VARCHAR(255) UNIQUE NOT NULL,
        filepath VARCHAR(500) NOT NULL,
        size_bytes BIGINT NOT NULL,
        backup_type VARCHAR(50) NOT NULL DEFAULT 'AUTOMATIC',
        note TEXT,
        created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 2. Başlangıç Hizmet Verilerini Yükle
    const [serviceRows]: any = await pool.query("SELECT count(*) as count FROM services");
    if (serviceRows[0].count === 0) {
      for (let idx = 0; idx < servicesData.length; idx++) {
        const s = servicesData[idx];
        await pool.query(
          `INSERT IGNORE INTO services (id, slug, title, short_desc, icon_name, category, features, detailed_content, order_index, is_active, translations)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
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
          ]
        );
      }
      console.log(`[DB Seed] ${servicesData.length} hizmet eklendi.`);
    }

    // 3. Başlangıç Sirküler Verilerini Yükle
    const [sirkulerRows]: any = await pool.query("SELECT count(*) as count FROM sirkuler");
    if (sirkulerRows[0].count === 0) {
      for (const s of defaultSirkuler) {
        await pool.query(
          `INSERT IGNORE INTO sirkuler (id, slug, title, category, regulation_type, official_gazette_number, related_gtip, summary, content, expert_note, source_url, pdf_url, author, views_count, is_published, date, translations)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
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
          ]
        );
      }
      console.log(`[DB Seed] ${defaultSirkuler.length} sirküler eklendi.`);
    }

    // 4. Başlangıç Gerekli Bağlantılar Verilerini Yükle
    const [baglantiRows]: any = await pool.query("SELECT count(*) as count FROM gerekli_baglantilar");
    if (baglantiRows[0].count === 0) {
      for (let idx = 0; idx < gerekliBaglantilarData.length; idx++) {
        const b = gerekliBaglantilarData[idx];
        await pool.query(
          `INSERT IGNORE INTO gerekli_baglantilar (id, title, short_title, category, url, image, description, tag, order_index, is_active)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [b.id, b.title, b.shortTitle, b.category, b.url, b.image, b.description, b.tag, idx, 1]
        );
      }
      console.log(`[DB Seed] ${gerekliBaglantilarData.length} bağlantı eklendi.`);
    }

    // 5. Başlangıç Formlarını Tanımla
    const [formRows]: any = await pool.query("SELECT count(*) as count FROM forms");
    if (formRows[0].count === 0) {
      await pool.query(
        `INSERT IGNORE INTO forms (id, slug, title, description, category, fields, settings, is_active)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
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
                "Gümrük Danışmanlığı & Mevzuat",
              ],
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
                "20+ Dosya / Ay (Kurumsal)",
              ],
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
                "Diğer Tüm Gümrük İdareleri",
              ],
            },
            { name: "gtipOrProduct", label: "GTİP No veya Eşya Tanımı", type: "text", required: false, placeholder: "Örn: 8471.30 veya Endüstriyel Elektronik Kart" },
            { name: "message", label: "Sevkiyat ve Fiyat Teklifi Detayları", type: "textarea", required: true, placeholder: "Konteyner/koli adedi, çıkış ülkesi veya sormak istedikleriniz..." },
            { name: "files", label: "Fatura / Konşimento / Çeki Listesi (Opsiyonel)", type: "file", required: false, helpText: "PDF, JPG veya PNG formatında yükleyebilirsiniz." },
          ]),
          JSON.stringify({
            successMessage: "Fiyat teklif talebiniz başarıyla alındı! Gümrük müşavirimiz en kısa sürede analiz ederek tarafınıza dönecektir.",
            autoEmailSubject: "Fiyat Teklifi Talebiniz Alındı | Kalem Gümrük Müşavirliği (#{{refNo}})",
            autoEmailBody: "Sayın {{fullName}},\n\nKalem Gümrük Müşavirliği'ne iletmiş olduğunuz fiyat teklif talebi operasyon ekibimize iletilmiştir. Gümrük müşavirimiz mevzuat ve tarife kontrollerini yaparak en kısa sürede dönüş sağlayacaktır.\n\nSaygılarımızla,\nKalem Gümrük Müşavirliği",
            notificationEmail: "kadir.kaya@kayapermit.com",
          }),
          1,
        ]
      );

      await pool.query(
        `INSERT IGNORE INTO forms (id, slug, title, description, category, fields, settings, is_active)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
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
                "Diğer",
              ],
            },
            { name: "message", label: "Mesajınız", type: "textarea", required: true, placeholder: "Lütfen mesajınızı detaylıca belirtiniz..." },
          ]),
          JSON.stringify({
            successMessage: "Mesajınız başarıyla iletildi. Müşteri temsilcimiz en kısa sürede sizinle iletişime geçecektir.",
            autoEmailSubject: "Mesajınız Alındı | Kalem Gümrük Müşavirliği (#{{refNo}})",
            autoEmailBody: "Sayın {{fullName}},\n\nİletişim talebiniz merkezimize ulaşmıştır. Konuyla ilgili müşteri temsilcimiz sizinle irtibata geçecektir.\n\nSaygılarımızla,\nKalem Gümrük Müşavirliği",
            notificationEmail: "kadir.kaya@kayapermit.com",
          }),
          1,
        ]
      );

      await pool.query(
        `INSERT IGNORE INTO forms (id, slug, title, description, category, fields, settings, is_active)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
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
                "Genel Başvuru",
              ],
            },
            { name: "experience", label: "Gümrük / Dış Ticaret Deneyiminiz", type: "text", required: false, placeholder: "Örn: 2 yıl ithalat operasyon deneyimi" },
            { name: "coverLetter", label: "Ön Yazı / Kendinizi Tanıtın", type: "textarea", required: false, placeholder: "Kariyer hedefleriniz, bildiğiniz programlar (Evrim vb.)..." },
            { name: "cvFile", label: "Özgeçmiş / CV Dosyası (PDF veya Word)", type: "file", required: true, helpText: "Maksimum 10MB boyutunda PDF veya Word dosyası yükleyiniz." },
          ]),
          JSON.stringify({
            successMessage: "Başvurunuz ve özgeçmişiniz İnsan Kaynakları havuzumuza başarıyla kaydedilmiştir. Teşekkür ederiz.",
            autoEmailSubject: "İş/Staj Başvurunuz Alındı | Kalem Gümrük İK (#{{refNo}})",
            autoEmailBody: "Sayın {{fullName}},\n\nKalem Gümrük Müşavirliği bünyesindeki açık pozisyonlara göstermiş olduğunuz ilgi için teşekkür ederiz. Başvurunuz ve özgeçmişiniz İnsan Kaynakları havuzumuza dahil edilmiştir.",
            notificationEmail: "ik@kalemgumruk.com",
          }),
          1,
        ]
      );
      console.log("[DB Seed] Standart fiyat teklifi, iletişim ve kariyer formları eklendi.");
    }

    // 6. Başlangıç Belgeleri Yükle
    const [docRows]: any = await pool.query("SELECT count(*) as count FROM documents");
    if (docRows[0].count === 0) {
      const defaultDocs = [
        {
          id: "doc-1",
          title: "Gümrük Müşavirliği İzin Belgesi",
          description: "T.C. Ticaret Bakanlığı yetkili gümrük müşavirliği resmi izin belgemiz.",
          category: "legal",
          fileUrl: "/uploads/gumruk-musavirligi-izin-belgesi.pdf",
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
          fileUrl: "/uploads/kalem-iso-9001-belgesi.pdf",
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
          fileUrl: "/uploads/gumruk-is-talimat-formu.pdf",
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
          fileUrl: "/uploads/kalem-gumruk-vekaletname-ornegi.pdf",
          fileKey: null,
          fileSize: "148 KB",
          fileType: "pdf",
          downloadCount: 428,
        },
      ];

      for (const d of defaultDocs) {
        await pool.query(
          `INSERT IGNORE INTO documents (id, title, description, category, file_url, file_key, file_size, file_type, download_count, is_public)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [d.id, d.title, d.description, d.category, d.fileUrl, d.fileKey, d.fileSize, d.fileType, d.downloadCount, 1]
        );
      }
      console.log(`[DB Seed] ${defaultDocs.length} varsayılan belge eklendi.`);
    }

    // 7. Başlangıç Referanslarını Yükle
    const [refRows]: any = await pool.query("SELECT count(*) as count FROM `references`");
    if (refRows[0].count === 0) {
      const defaultReferences = [
        { id: "ref-1", name: "Atlas Dış Ticaret A.Ş.", sector: "Makine & Endüstri", description: "Avrupa ve Uzak Doğu ithalat operasyonları", orderIndex: 1 },
        { id: "ref-2", name: "Global Logistics Group", sector: "Lojistik & Antrepo", description: "Transit ticaret ve antrepo gümrükleme süreçleri", orderIndex: 2 },
        { id: "ref-3", name: "Demir Otomotiv Yan Sanayi", sector: "Otomotiv", description: "Dahilde İşleme İzin Belgesi yönetimi ve ihracat", orderIndex: 3 },
        { id: "ref-4", name: "Mega Kimya Sanayi", sector: "Kimya & Hammadde", description: "Tareks, TSE ve ihtisas gümrükleme işlemleri", orderIndex: 4 },
        { id: "ref-5", name: "TeknoMed Sağlık Ürünleri", sector: "Medikal & İlaç", description: "TİTCK izinleri ve soğuk zincir gümrükleme", orderIndex: 5 },
      ];

      for (const r of defaultReferences) {
        await pool.query(
          `INSERT IGNORE INTO \`references\` (id, name, sector, description, logo_url, order_index, is_active)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [r.id, r.name, r.sector, r.description, null, r.orderIndex, 1]
        );
      }
      console.log(`[DB Seed] ${defaultReferences.length} referans firma eklendi.`);
    }

    // 8. Başlangıç Müşteri Değerlendirmeleri Yükle
    const [fbRows]: any = await pool.query("SELECT count(*) as count FROM customer_feedbacks");
    if (fbRows[0].count === 0) {
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

      for (const fb of defaultFeedbacks) {
        await pool.query(
          `INSERT IGNORE INTO customer_feedbacks (id, full_name, company, rating, service_type, comment, is_approved)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [fb.id, fb.fullName, fb.company, fb.rating, fb.serviceType, fb.comment, 1]
        );
      }
      console.log(`[DB Seed] ${defaultFeedbacks.length} onaylı müşteri değerlendirmesi eklendi.`);
    }

    // 9. Başlangıç Kullanıcılarını Oluştur (Admin & Editör)
    const [userRows]: any = await pool.query("SELECT count(*) as count FROM users");
    if (userRows[0].count === 0) {
      function quickHash(pw: string): string {
        const salt = crypto.randomBytes(16).toString("hex");
        const key = crypto.scryptSync(pw, salt, 64);
        return `${salt}:${key.toString("hex")}`;
      }

      const adminPassword = (process.env.ADMIN_PASSWORD || "kalem1997").trim();
      const editorPassword = (process.env.EDITOR_PASSWORD || "editor1997").trim();

      // Admin
      await pool.query(
        `INSERT IGNORE INTO users (id, username, password_hash, name, role, permissions, is_active)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
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
        ]
      );

      // Editör
      await pool.query(
        `INSERT IGNORE INTO users (id, username, password_hash, name, role, permissions, is_active)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
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
            canDelete: false,
          }),
          1,
        ]
      );

      console.log("[DB Seed] Varsayılan 'admin' ve 'editor' kullanıcı hesapları oluşturuldu.");
    }

    // 10. Başlangıç Firma Ayarları (site_settings)
    const [settingsRows]: any = await pool.query("SELECT count(*) as count FROM site_settings WHERE `key` = 'general_settings'");
    if (settingsRows[0].count === 0) {
      await pool.query(
        `INSERT IGNORE INTO site_settings (\`key\`, value) VALUES (?, ?)`,
        ["general_settings", JSON.stringify(companyInfo)]
      );
      console.log("[DB Seed] Firma genel iletişim ve şirket ayarları yüklendi.");
    }

    isInitialized = true;
    console.log("[DB] ✅ MySQL veritabanı tabloları ve başlangıç verileri başarıyla hazırlandı!");
  } catch (error) {
    console.error("[DB Init Hatası]:", error);
  }
}
