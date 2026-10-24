import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

// 1. Dinamik Form Tanımları (Form Builder)
export const forms = sqliteTable("forms", {
  id: text("id").primaryKey(), // Örn: 'form_fiyat_teklifi'
  slug: text("slug").unique().notNull(), // 'fiyat-teklifi', 'iletisim', 'kariyer-staj'
  title: text("title").notNull(),
  description: text("description"),
  category: text("category").notNull().default("general"),
  fields: text("fields").notNull(),
  settings: text("settings").notNull(),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// 2. Gelen Form Yanıtları (Submissions & Leadler)
export const formSubmissions = sqliteTable("form_submissions", {
  id: text("id").primaryKey(),
  formSlug: text("form_slug").notNull(),
  data: text("data").notNull(),
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
  title: text("title").notNull(),
  description: text("description"),
  category: text("category").notNull(),
  fileUrl: text("file_url").notNull(),
  fileKey: text("file_key"),
  fileSize: text("file_size").notNull(),
  fileType: text("file_type").notNull().default("pdf"),
  downloadCount: integer("download_count").notNull().default(0),
  isPublic: integer("is_public", { mode: "boolean" }).notNull().default(true),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// 4. Mevzuat & Sirküler Haberleri CMS
export const sirkuler = sqliteTable("sirkuler", {
  id: text("id").primaryKey(),
  slug: text("slug").unique().notNull(),
  title: text("title").notNull(),
  category: text("category").notNull(),
  regulationType: text("regulation_type"),
  officialGazetteNumber: text("official_gazette_number"),
  relatedGtip: text("related_gtip"),
  summary: text("summary").notNull(),
  content: text("content").notNull(),
  expertNote: text("expert_note"),
  sourceUrl: text("source_url"),
  pdfUrl: text("pdf_url"),
  author: text("author").notNull().default("Kalem Gümrük Mevzuat Kurulu"),
  viewsCount: integer("views_count").notNull().default(0),
  isPublished: integer("is_published", { mode: "boolean" }).notNull().default(true),
  date: text("date").notNull(),
  translations: text("translations").default("{}"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// 5. Müşteri Memnuniyeti & Hizmet Değerlendirmeleri
export const customerFeedbacks = sqliteTable("customer_feedbacks", {
  id: text("id").primaryKey(),
  fullName: text("full_name").notNull(),
  company: text("company"),
  rating: integer("rating").notNull(),
  serviceType: text("service_type"),
  comment: text("comment").notNull(),
  isApproved: integer("is_approved", { mode: "boolean" }).notNull().default(false),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// 6. Chatbot Konuşmaları ve Müşteri Talepleri
export const chatConversations = sqliteTable("chat_conversations", {
  id: text("id").primaryKey(),
  sessionId: text("session_id").unique().notNull(),
  contactInfo: text("contact_info"),
  question: text("question"),
  messages: text("messages").notNull(),
  status: text("status").notNull().default("NEW"),
  isLeadCaptured: integer("is_lead_captured", { mode: "boolean" }).notNull().default(false),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// 7. Site & Firma Genel Ayarları
export const siteSettings = sqliteTable("site_settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// 8. Müşavir Masası & Gerekli Bağlantılar Portalı
export const gerekliBaglantilar = sqliteTable("gerekli_baglantilar", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  shortTitle: text("short_title").notNull(),
  category: text("category").notNull(),
  url: text("url").notNull(),
  image: text("image").notNull(),
  description: text("description").notNull(),
  tag: text("tag").notNull(),
  orderIndex: integer("order_index").notNull().default(0),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// 9. Hizmetlerimiz CMS
export const services = sqliteTable("services", {
  id: text("id").primaryKey(),
  slug: text("slug").unique().notNull(),
  title: text("title").notNull(),
  shortDesc: text("short_desc").notNull(),
  iconName: text("icon_name").notNull().default("ArrowDownToLine"),
  category: text("category").notNull().default("gumruk"),
  features: text("features").notNull().default("[]"),
  detailedContent: text("detailed_content").notNull(),
  orderIndex: integer("order_index").notNull().default(0),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  translations: text("translations").default("{}"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// 10. Müşteri Referansları & İş Ortakları
export const references = sqliteTable("references", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  sector: text("sector").notNull(),
  description: text("description"),
  logoUrl: text("logo_url"),
  orderIndex: integer("order_index").notNull().default(0),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});
