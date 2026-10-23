import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

// 1. Dinamik Form Tanımları (Form Builder)
export const forms = sqliteTable("forms", {
  id: text("id").primaryKey(), // Örn: 'form_fiyat_teklifi'
  slug: text("slug").unique().notNull(), // 'fiyat-teklifi', 'iletisim', 'kariyer-staj'
  title: text("title").notNull(),
  description: text("description"),
  category: text("category").notNull().default("general"), // 'quote', 'contact', 'career', 'feedback', 'custom'
  // Form alanları JSON array olarak saklanır:
  // [{ name, label, type, required, placeholder, options?: string[], helpText?: string }]
  fields: text("fields").notNull(),
  // Ayarlar: { successMessage, autoEmailSubject, autoEmailBody, notificationEmail }
  settings: text("settings").notNull(),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// 2. Gelen Form Yanıtları (Submissions & Leadler)
export const formSubmissions = sqliteTable("form_submissions", {
  id: text("id").primaryKey(), // Örn: 'SUB-2026-1049'
  formSlug: text("form_slug").notNull(),
  // Doldurulan veriler anahtar-değer JSON formatında
  data: text("data").notNull(),
  // Yüklenen dosyalar: [{ name, url, size, type, key }]
  files: text("files").default("[]"),
  status: text("status").notNull().default("NEW"), // NEW, IN_REVIEW, CONTACTED, RESOLVED, ARCHIVED
  adminNotes: text("admin_notes"),
  ipAddress: text("ip_address"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// 3. Belgeler, Sertifikalar ve İndirilebilir Evraklar
export const documents = sqliteTable("documents", {
  id: text("id").primaryKey(),
  title: text("title").notNull(), // "2026 Standart Gümrük Vekaletnamesi Şablonu"
  description: text("description"),
  category: text("category").notNull(), // 'SERTIFIKA', 'VEKALETNAME', 'GUMRUK_FORMU', 'KILAVUZ'
  fileUrl: text("file_url").notNull(),
  fileKey: text("file_key"),
  fileSize: text("file_size").notNull(), // "1.4 MB"
  fileType: text("file_type").notNull().default("pdf"), // "pdf", "docx", "xlsx"
  downloadCount: integer("download_count").notNull().default(0),
  isPublic: integer("is_public", { mode: "boolean" }).notNull().default(true),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// 4. Mevzuat & Sirküler Haberleri CMS
export const sirkuler = sqliteTable("sirkuler", {
  id: text("id").primaryKey(),
  slug: text("slug").unique().notNull(),
  title: text("title").notNull(),
  category: text("category").notNull(), // "İthalat & Vergi", "Gümrük Tebliği" vb.
  regulationType: text("regulation_type"), // "Cumhurbaşkanı Kararı", "Tebliğ", "Genelge"
  officialGazetteNumber: text("official_gazette_number"), // Örn: 32700
  relatedGtip: text("related_gtip"), // "84. ve 85. Fasıllar"
  summary: text("summary").notNull(),
  content: text("content").notNull(),
  expertNote: text("expert_note"), // Kalem Gümrük Müşavirlik Uzman Tavsiyesi / Yorumu
  sourceUrl: text("source_url"),
  pdfUrl: text("pdf_url"),
  author: text("author").notNull().default("Kalem Gümrük Mevzuat Kurulu"),
  viewsCount: integer("views_count").notNull().default(0),
  isPublished: integer("is_published", { mode: "boolean" }).notNull().default(true),
  date: text("date").notNull(), // YYYY-MM-DD
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// 5. Müşteri Memnuniyeti & Hizmet Değerlendirmeleri
export const customerFeedbacks = sqliteTable("customer_feedbacks", {
  id: text("id").primaryKey(),
  fullName: text("full_name").notNull(),
  company: text("company"),
  rating: integer("rating").notNull(), // 1 - 5 Yıldız
  serviceType: text("service_type"), // İthalat, İhracat, Danışmanlık vb.
  comment: text("comment").notNull(),
  isApproved: integer("is_approved", { mode: "boolean" }).notNull().default(false), // Admin onaylarsa sitede yayınlanır
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// 6. Chatbot Konuşmaları ve Müşteri Talepleri
export const chatConversations = sqliteTable("chat_conversations", {
  id: text("id").primaryKey(),
  sessionId: text("session_id").unique().notNull(),
  contactInfo: text("contact_info"), // Ziyaretçinin bıraktığı telefon/e-posta
  question: text("question"), // İlk sorduğu soru veya konu
  messages: text("messages").notNull(), // JSON string: [{ sender: 'user'|'bot', text: '...', time: '...' }]
  status: text("status").notNull().default("NEW"), // NEW, CONTACTED, RESOLVED
  isLeadCaptured: integer("is_lead_captured", { mode: "boolean" }).notNull().default(false),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});
