import { mysqlTable, varchar, text, int, boolean, timestamp, bigint, } from "drizzle-orm/mysql-core";
// 1. Dinamik Form Tanımları (Form Builder)
export const forms = mysqlTable("forms", {
    id: varchar("id", { length: 191 }).primaryKey(), // Örn: 'form_fiyat_teklifi'
    slug: varchar("slug", { length: 191 }).unique().notNull(), // 'fiyat-teklifi', 'iletisim', 'kariyer-staj'
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description"),
    category: varchar("category", { length: 100 }).notNull().default("general"),
    fields: text("fields").notNull(),
    settings: text("settings").notNull(),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at").$defaultFn(() => new Date()),
    updatedAt: timestamp("updated_at").$defaultFn(() => new Date()),
});
// 2. Gelen Form Yanıtları (Submissions & Leadler)
export const formSubmissions = mysqlTable("form_submissions", {
    id: varchar("id", { length: 191 }).primaryKey(),
    formSlug: varchar("form_slug", { length: 191 }).notNull(),
    data: text("data").notNull(),
    files: text("files").default("[]"),
    status: varchar("status", { length: 50 }).notNull().default("NEW"), // NEW, IN_REVIEW, CONTACTED, RESOLVED, ARCHIVED
    adminNotes: text("admin_notes"),
    ipAddress: varchar("ip_address", { length: 100 }),
    createdAt: timestamp("created_at").$defaultFn(() => new Date()),
    updatedAt: timestamp("updated_at").$defaultFn(() => new Date()),
});
// 3. Belgeler, Sertifikalar ve İndirilebilir Evraklar
export const documents = mysqlTable("documents", {
    id: varchar("id", { length: 191 }).primaryKey(),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description"),
    category: varchar("category", { length: 100 }).notNull(),
    fileUrl: varchar("file_url", { length: 500 }).notNull(),
    fileKey: varchar("file_key", { length: 255 }),
    fileSize: varchar("file_size", { length: 50 }).notNull(),
    fileType: varchar("file_type", { length: 50 }).notNull().default("pdf"),
    downloadCount: int("download_count").notNull().default(0),
    isPublic: boolean("is_public").notNull().default(true),
    createdAt: timestamp("created_at").$defaultFn(() => new Date()),
});
// 4. Mevzuat & Sirküler Haberleri CMS
export const sirkuler = mysqlTable("sirkuler", {
    id: varchar("id", { length: 191 }).primaryKey(),
    slug: varchar("slug", { length: 191 }).unique().notNull(),
    title: varchar("title", { length: 500 }).notNull(),
    category: varchar("category", { length: 100 }).notNull(),
    regulationType: varchar("regulation_type", { length: 100 }),
    officialGazetteNumber: varchar("official_gazette_number", { length: 100 }),
    relatedGtip: varchar("related_gtip", { length: 255 }),
    summary: text("summary").notNull(),
    content: text("content").notNull(),
    expertNote: text("expert_note"),
    sourceUrl: varchar("source_url", { length: 500 }),
    pdfUrl: varchar("pdf_url", { length: 500 }),
    author: varchar("author", { length: 255 }).notNull().default("Kalem Gümrük Mevzuat Kurulu"),
    viewsCount: int("views_count").notNull().default(0),
    isPublished: boolean("is_published").notNull().default(true),
    date: varchar("date", { length: 50 }).notNull(),
    translations: text("translations").default("{}"),
    createdAt: timestamp("created_at").$defaultFn(() => new Date()),
});
// 5. Müşteri Memnuniyeti & Hizmet Değerlendirmeleri
export const customerFeedbacks = mysqlTable("customer_feedbacks", {
    id: varchar("id", { length: 191 }).primaryKey(),
    fullName: varchar("full_name", { length: 255 }).notNull(),
    company: varchar("company", { length: 255 }),
    rating: int("rating").notNull(),
    serviceType: varchar("service_type", { length: 100 }),
    comment: text("comment").notNull(),
    isApproved: boolean("is_approved").notNull().default(false),
    createdAt: timestamp("created_at").$defaultFn(() => new Date()),
});
// 6. Chatbot Konuşmaları ve Müşteri Talepleri
export const chatConversations = mysqlTable("chat_conversations", {
    id: varchar("id", { length: 191 }).primaryKey(),
    sessionId: varchar("session_id", { length: 191 }).unique().notNull(),
    contactInfo: text("contact_info"),
    question: text("question"),
    messages: text("messages").notNull(),
    status: varchar("status", { length: 50 }).notNull().default("NEW"),
    isLeadCaptured: boolean("is_lead_captured").notNull().default(false),
    createdAt: timestamp("created_at").$defaultFn(() => new Date()),
    updatedAt: timestamp("updated_at").$defaultFn(() => new Date()),
});
// 7. Site & Firma Genel Ayarları
export const siteSettings = mysqlTable("site_settings", {
    key: varchar("key", { length: 191 }).primaryKey(),
    value: text("value").notNull(),
    updatedAt: timestamp("updated_at").$defaultFn(() => new Date()),
});
// 8. Müşavir Masası & Gerekli Bağlantılar Portalı
export const gerekliBaglantilar = mysqlTable("gerekli_baglantilar", {
    id: varchar("id", { length: 191 }).primaryKey(),
    title: varchar("title", { length: 255 }).notNull(),
    shortTitle: varchar("short_title", { length: 100 }).notNull(),
    category: varchar("category", { length: 100 }).notNull(),
    url: varchar("url", { length: 500 }).notNull(),
    image: varchar("image", { length: 500 }).notNull(),
    description: text("description").notNull(),
    tag: varchar("tag", { length: 100 }).notNull(),
    orderIndex: int("order_index").notNull().default(0),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at").$defaultFn(() => new Date()),
});
// 9. Hizmetlerimiz CMS
export const services = mysqlTable("services", {
    id: varchar("id", { length: 191 }).primaryKey(),
    slug: varchar("slug", { length: 191 }).unique().notNull(),
    title: varchar("title", { length: 255 }).notNull(),
    shortDesc: text("short_desc").notNull(),
    iconName: varchar("icon_name", { length: 100 }).notNull().default("ArrowDownToLine"),
    category: varchar("category", { length: 100 }).notNull().default("gumruk"),
    features: text("features").notNull().default("[]"),
    detailedContent: text("detailed_content").notNull(),
    orderIndex: int("order_index").notNull().default(0),
    isActive: boolean("is_active").notNull().default(true),
    translations: text("translations").default("{}"),
    createdAt: timestamp("created_at").$defaultFn(() => new Date()),
});
// 10. Müşteri Referansları & İş Ortakları
export const references = mysqlTable("references", {
    id: varchar("id", { length: 191 }).primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    sector: varchar("sector", { length: 100 }).notNull(),
    description: text("description"),
    logoUrl: varchar("logo_url", { length: 500 }),
    orderIndex: int("order_index").notNull().default(0),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at").$defaultFn(() => new Date()),
});
// 11. Kullanıcılar ve Rol Bazlı Yetkilendirme (Admin & Editör)
export const users = mysqlTable("users", {
    id: varchar("id", { length: 191 }).primaryKey(),
    username: varchar("username", { length: 191 }).unique().notNull(),
    passwordHash: varchar("password_hash", { length: 255 }).notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    role: varchar("role", { length: 50 }).notNull().default("EDITOR"), // 'ADMIN' | 'EDITOR'
    permissions: text("permissions").notNull().default("{}"), // JSON string
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at").$defaultFn(() => new Date()),
    updatedAt: timestamp("updated_at").$defaultFn(() => new Date()),
});
// 12. Veritabanı Yedekleri Kataloğu
export const databaseBackups = mysqlTable("database_backups", {
    id: varchar("id", { length: 191 }).primaryKey(),
    filename: varchar("filename", { length: 255 }).unique().notNull(),
    filepath: varchar("filepath", { length: 500 }).notNull(),
    sizeBytes: bigint("size_bytes", { mode: "number" }).notNull(),
    backupType: varchar("backup_type", { length: 50 }).notNull().default("AUTOMATIC"), // AUTOMATIC, MANUAL, PRE_RESTORE
    note: text("note"),
    createdAt: timestamp("created_at").$defaultFn(() => new Date()),
});
