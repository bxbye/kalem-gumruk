import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema";
import path from "path";
import fs from "fs";

// Veritabanı dosya yolu: data/kalem.sqlite
const dataDir = path.join(process.cwd(), "data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const sqlitePath = path.join(dataDir, "kalem.sqlite");
const sqlite = new Database(sqlitePath);
sqlite.pragma("journal_mode = WAL");

export const db = drizzle(sqlite, { schema });

// Otomatik Tablo Oluşturma ve Başlangıç Verilerini (Seed) Yükleme
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
    `);

    // 2. Başlangıç Formlarını (Seed Forms) Kontrol Et ve Ekle
    const checkForms = sqlite.prepare("SELECT count(*) as count FROM forms").get() as { count: number };
    if (checkForms.count === 0) {
      seedDefaultForms(sqlite);
    }

    // 3. Mevcut sirkuler-db.json verilerini sirkuler tablosuna aktar (Migration)
    const checkSirkuler = sqlite.prepare("SELECT count(*) as count FROM sirkuler").get() as { count: number };
    if (checkSirkuler.count === 0) {
      seedSirkulerFromJson(sqlite);
    }

    // 4. Başlangıç Belgeleri ve Sertifikaları Ekle
    const checkDocs = sqlite.prepare("SELECT count(*) as count FROM documents").get() as { count: number };
    if (checkDocs.count === 0) {
      seedDefaultDocuments(sqlite);
    }

    isInitialized = true;
  } catch (error) {
    console.error("Veritabanı başlatma hatası:", error);
  }
}

// Varsayılan Form Tanımları
function seedDefaultForms(dbInstance: Database.Database) {
  const insertForm = dbInstance.prepare(`
    INSERT INTO forms (id, slug, title, description, category, fields, settings, is_active, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?, ?)
  `);

  const now = Date.now();

  // 1. Fiyat Teklif Formu
  insertForm.run(
    "form_fiyat_teklifi",
    "fiyat-teklifi",
    "Hızlı Gümrükleme Fiyat Teklifi",
    "İthalat, ihracat ve antrepo operasyonlarınız için gümrük müşavirlerimizden 2 saat içinde özel teklif alın.",
    "quote",
    JSON.stringify([
      { name: "fullName", label: "Adınız Soyadınız", type: "text", required: true, placeholder: "Örn: Ahmet Yılmaz" },
      { name: "company", label: "Firma Unvanı", type: "text", required: true, placeholder: "Örn: ABC Dış Ticaret Ltd. Şti." },
      { name: "phone", label: "Telefon Numarası", type: "tel", required: true, placeholder: "05XX XXX XX XX" },
      { name: "email", label: "E-Posta Adresi", type: "email", required: true, placeholder: "ahmet@firma.com" },
      {
        name: "operationType",
        label: "İşlem Türü / Gümrük Rejimi",
        type: "select",
        required: true,
        options: ["İthalat İşlemleri", "İhracat İşlemleri", "Antrepo & Depolama", "Transit Ticaret", "Dahilde İşleme (DİİB)", "Gümrük Danışmanlığı"],
      },
      { name: "customsOffice", label: "Hedef Gümrük Müdürlüğü", type: "text", required: false, placeholder: "Örn: Erenköy, Ambarlı, Muratbey, AHL" },
      { name: "gtipOrProduct", label: "GTİP No veya Eşya Tanımı", type: "text", required: false, placeholder: "Örn: 8471.30 veya Endüstriyel Elektronik Kart" },
      { name: "message", label: "Sevkiyat Detayları ve Özel Notlar", type: "textarea", required: false, placeholder: "Konteyner/koli adedi, çıkış ülkesi veya sormak istedikleriniz..." },
      { name: "files", label: "Fatura / Konşimento / Çeki Listesi (Opsiyonel)", type: "file", required: false, helpText: "PDF, JPG veya PNG formatında yükleyebilirsiniz." },
    ]),
    JSON.stringify({
      successMessage: "Fiyat teklif talebiniz başarıyla alındı! Gümrük müşavirimiz en kısa sürede analiz ederek tarafınıza dönecektir.",
      autoEmailSubject: "Fiyat Teklifi Talebiniz Alındı | Kalem Gümrük Müşavirliği",
      autoEmailBody: "Sayın Yetkili,\n\nKalem Gümrük Müşavirliği'ne iletmiş olduğunuz fiyat teklif talebi operasyon ekibimize iletilmiştir. Uzman müşavirlerimiz mevzuat ve tarife kontrollerini yaparak en kısa sürede dönüş sağlayacaktır.\n\nSaygılarımızla,\nKalem Gümrük Müşavirliği",
      notificationEmail: "info@kalemgumruk.com",
    }),
    now,
    now
  );

  // 2. İletişim Formu
  insertForm.run(
    "form_iletisim",
    "iletisim",
    "Genel İletişim & Danışma Formu",
    "Gümrük mevzuatı, danışmanlık veya kurumsal iş birlikleri için bize yazın.",
    "contact",
    JSON.stringify([
      { name: "fullName", label: "Adınız Soyadınız", type: "text", required: true, placeholder: "Adınız Soyadınız" },
      { name: "company", label: "Firma / Kurum", type: "text", required: false, placeholder: "Firma Adı (varsa)" },
      { name: "phone", label: "Telefon Numarası", type: "tel", required: true, placeholder: "05XX XXX XX XX" },
      { name: "email", label: "E-Posta Adresi", type: "email", required: true, placeholder: "ornek@domain.com" },
      {
        name: "subject",
        label: "Konu / Hizmet Alanı",
        type: "select",
        required: true,
        options: ["Genel Bilgi & İletişim", "Mevzuat Danışmanlığı", "İthalat / İhracat Operasyonu", "Yetkilendirilmiş Yükümlü (YYS)", "Diğer"],
      },
      { name: "message", label: "Mesajınız", type: "textarea", required: true, placeholder: "Lütfen mesajınızı detaylıca belirtiniz..." },
    ]),
    JSON.stringify({
      successMessage: "Mesajınız başarıyla iletildi. Müşteri temsilcimiz en kısa sürede sizinle iletişime geçecektir.",
      autoEmailSubject: "Mesajınız Alındı | Kalem Gümrük Müşavirliği",
      autoEmailBody: "Sayın Yetkili,\n\nİletişim talebiniz merkezimize ulaşmıştır. Konuyla ilgili yetkilimiz sizinle irtibata geçecektir.\n\nKalem Gümrük Müşavirliği Ltd. Şti.",
      notificationEmail: "info@kalemgumruk.com",
    }),
    now,
    now
  );

  // 3. Kariyer & Staj Başvuru Formu
  insertForm.run(
    "form_kariyer_staj",
    "kariyer-staj",
    "İş & Staj Başvuru Formu",
    "Kalem Gümrük ekibine katılmak veya staj yapmak için özgeçmişinizi iletebilirsiniz.",
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
        options: ["Gümrük Müşavir Yardımcısı (B Karne)", "Müşteri Temsilcisi & Operasyon", "Dış Ticaret / Gümrük Stajyeri", "Saha & Kurye Personeli", "Genel Başvuru"],
      },
      { name: "experience", label: "Gümrük / Dış Ticaret Deneyiminiz", type: "text", required: false, placeholder: "Örn: 2 yıl ithalat operasyon deneyimi" },
      { name: "coverLetter", label: "Ön Yazı / Kendinizi Tanıtın", type: "textarea", required: false, placeholder: "Kariyer hedefleriniz, bildiğiniz programlar (Evrim vb.)..." },
      { name: "cvFile", label: "Özgeçmiş / CV Dosyası (PDF veya Word)", type: "file", required: true, helpText: "Maksimum 10MB boyutunda PDF veya Word dosyası yükleyiniz." },
    ]),
    JSON.stringify({
      successMessage: "Başvurunuz ve özgeçmişiniz İnsan Kaynakları havuzumuza başarıyla kaydedilmiştir. Teşekkür ederiz.",
      autoEmailSubject: "İş/Staj Başvurunuz Alındı | Kalem Gümrük İK",
      autoEmailBody: "Sayın Aday,\n\nKalem Gümrük Müşavirliği'ne yaptığınız başvuru İnsan Kaynakları veri tabanımıza kaydedilmiştir. Nitelikleriniz ve açık pozisyonlarımız doğrultusunda uygunluk durumunda sizinle mülakat için iletişime geçilecektir.\n\nBaşarılar dileriz,\nKalem Gümrük İnsan Kaynakları",
      notificationEmail: "ik@kalemgumruk.com",
    }),
    now,
    now
  );

  // 4. Müşteri Memnuniyet Anketi & Değerlendirme Formu
  insertForm.run(
    "form_musteri_memnuniyeti",
    "musteri-memnuniyeti",
    "Müşteri Memnuniyet & Değerlendirme Formu",
    "Gümrükleme hizmetlerimiz hakkındaki görüş ve geri bildirimlerinizi bizimle paylaşın.",
    "feedback",
    JSON.stringify([
      { name: "fullName", label: "Adınız Soyadınız", type: "text", required: true, placeholder: "Ad Soyad" },
      { name: "company", label: "Firma Unvanı", type: "text", required: true, placeholder: "Firma Adı" },
      { name: "email", label: "E-Posta Adresiniz", type: "email", required: true, placeholder: "iletisim@firma.com" },
      {
        name: "rating",
        label: "Hizmet Memnuniyet Puanınız (1-5 Yıldız)",
        type: "select",
        required: true,
        options: ["5 Yıldız - Mükemmel", "4 Yıldız - Çok İyi", "3 Yıldız - Orta / Yeterli", "2 Yıldız - Geliştirilmeli", "1 Yıldız - Yetersiz"],
      },
      {
        name: "evaluatedService",
        label: "Değerlendirdiğiniz Hizmet Alanı",
        type: "select",
        required: false,
        options: ["İthalat Gümrükleme", "İhracat Gümrükleme", "Mevzuat Danışmanlığı", "Operasyon Hızı ve Bilgilendirme", "Genel Hizmet Kalitesi"],
      },
      { name: "comment", label: "Görüş ve Değerlendirmeniz", type: "textarea", required: true, placeholder: "Görüşleriniz hizmet kalitemizi artırmamız için değerlidir..." },
    ]),
    JSON.stringify({
      successMessage: "Değerlendirmeniz için çok teşekkür ederiz. Görüşleriniz hizmet standartlarımızı geliştirmemiz için dikkatle incelenecektir.",
      autoEmailSubject: "Geri Bildiriminiz İçin Teşekkür Ederiz | Kalem Gümrük",
      autoEmailBody: "Sayın Müşterimiz,\n\nKalem Gümrük Müşavirliği hizmet kalitemizi değerlendirdiğiniz için teşekkür ederiz.\n\nKalem Gümrük Yönetimi",
      notificationEmail: "info@kalemgumruk.com",
    }),
    now,
    now
  );
}

// Mevcut sirkuler-db.json dosyasını veritabanına aktar
function seedSirkulerFromJson(dbInstance: Database.Database) {
  try {
    const jsonPath = path.join(process.cwd(), "data", "sirkuler-db.json");
    if (!fs.existsSync(jsonPath)) return;

    const content = fs.readFileSync(jsonPath, "utf-8");
    const items = JSON.parse(content);
    if (!Array.isArray(items) || items.length === 0) return;

    const insertStmt = dbInstance.prepare(`
      INSERT OR IGNORE INTO sirkuler (
        id, slug, title, category, regulation_type, official_gazette_number,
        related_gtip, summary, content, expert_note, source_url, pdf_url,
        author, views_count, is_published, date, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 1, ?, ?)
    `);

    for (const item of items) {
      insertStmt.run(
        item.id || `sirkuler-${Date.now()}-${Math.random().toString(36).substring(7)}`,
        item.slug,
        item.title,
        item.category || "Genel Mevzuat",
        item.regulationType || "Gümrük Tebliği",
        item.officialGazetteNumber || null,
        item.relatedGtip || null,
        item.summary || item.title,
        item.content || "",
        item.expertNote || null,
        item.sourceUrl || null,
        item.pdfUrl || null,
        item.author || "Kalem Gümrük Mevzuat Kurulu",
        item.date || new Date().toISOString().split("T")[0],
        Date.now()
      );
    }
    console.log(`${items.length} adet sirküler başarıyla SQLite veritabanına aktarıldı.`);
  } catch (error) {
    console.error("Sirküler seed hatası:", error);
  }
}

// Başlangıç Belgeleri ve Sertifikaları Ekle
function seedDefaultDocuments(dbInstance: Database.Database) {
  const insertDoc = dbInstance.prepare(`
    INSERT INTO documents (id, title, description, category, file_url, file_key, file_size, file_type, download_count, is_public, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, 1, ?)
  `);

  const now = Date.now();
  const sampleDocs = [
    {
      id: "doc-iso-9001",
      title: "ISO 9001:2015 Kalite Yönetim Sistemi Sertifikası",
      description: "Kalem Gümrük Müşavirliği uluslararası kalite yönetim standartları sertifikası.",
      category: "SERTIFIKA",
      fileUrl: "/documents/kalem-iso-9001-belgesi.pdf",
      fileSize: "1.2 MB",
      fileType: "pdf",
    },
    {
      id: "doc-yetki-belgesi",
      title: "T.C. Ticaret Bakanlığı Gümrük Müşavirliği İzin Belgesi",
      description: "Gümrük Kanunu kapsamında müşavirlik faaliyeti resmi izin ve sicil belgesi.",
      category: "SERTIFIKA",
      fileUrl: "/documents/gumruk-musavirligi-izin-belgesi.pdf",
      fileSize: "850 KB",
      fileType: "pdf",
    },
    {
      id: "doc-vekaletname",
      title: "2026 Standart Gümrük Noter Vekaletnamesi Şablonu",
      description: "Şirketiniz adına gümrük işlemlerini yürütebilmemiz için noter tasdikli vekaletname örneği.",
      category: "VEKALETNAME",
      fileUrl: "/documents/kalem-gumruk-vekaletname-ornegi.pdf",
      fileSize: "420 KB",
      fileType: "pdf",
    },
    {
      id: "doc-ithalat-rehberi",
      title: "Gümrük İthalat & İhracat Süreçleri Bilgilendirme Kılavuzu",
      description: "Dış ticarette gümrükleme basamakları, gerekli belgeler ve dikkat edilmesi gereken mevzuat detayları.",
      category: "KILAVUZ",
      fileUrl: "/documents/gumruk-surecleri-rehberi.pdf",
      fileSize: "2.4 MB",
      fileType: "pdf",
    },
    {
      id: "doc-talimat-formu",
      title: "Gümrükleme İthalat / İhracat Talimat Formu",
      description: "Dosya açılışlarında beyanname tescili öncesi doldurulması gereken operasyon talimat formu.",
      category: "GUMRUK_FORMU",
      fileUrl: "/documents/gumruk-is-talimat-formu.pdf",
      fileSize: "310 KB",
      fileType: "pdf",
    },
  ];

  for (const doc of sampleDocs) {
    insertDoc.run(
      doc.id,
      doc.title,
      doc.description,
      doc.category,
      doc.fileUrl,
      doc.id,
      doc.fileSize,
      doc.fileType,
      now
    );
  }
}

// Dosya import edildiğinde veri tabanını otomatik initialize et
ensureDatabaseInitialized();
