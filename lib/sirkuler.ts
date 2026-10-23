import { db } from "@/db";
import { sirkuler } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export interface SirkulerItem {
  id: string;
  title: string;
  slug: string;
  date: string;
  category: string;
  regulationType?: string; // Tebliğ, Karar, Genelge, Yönetmelik
  officialGazetteNumber?: string; // Resmi Gazete Sayısı (Örn: 32700)
  relatedGtip?: string; // İlgili GTİP veya Fasıllar (Örn: 84. ve 85. Fasıllar)
  summary: string;
  content: string;
  expertNote?: string; // Kalem Gümrük Müşavirlik Uzman Tavsiyesi / Yorumu
  sourceUrl?: string;
  pdfUrl?: string;
  author?: string;
  viewsCount?: number;
  isPublished?: boolean;
}

export function getAllSirkuler(): SirkulerItem[] {
  try {
    const records = db
      .select()
      .from(sirkuler)
      .where(eq(sirkuler.isPublished, true))
      .orderBy(desc(sirkuler.date))
      .all();

    return records.map((r) => ({
      id: r.id,
      title: r.title,
      slug: r.slug,
      date: r.date,
      category: r.category,
      regulationType: r.regulationType || undefined,
      officialGazetteNumber: r.officialGazetteNumber || undefined,
      relatedGtip: r.relatedGtip || undefined,
      summary: r.summary,
      content: r.content,
      expertNote: r.expertNote || undefined,
      sourceUrl: r.sourceUrl || undefined,
      pdfUrl: r.pdfUrl || undefined,
      author: r.author || undefined,
      viewsCount: r.viewsCount,
      isPublished: r.isPublished,
    }));
  } catch (error) {
    console.error("Veritabanından sirküler okuma hatası:", error);
    return [];
  }
}

export function getSirkulerBySlug(slug: string): SirkulerItem | undefined {
  try {
    const r = db.select().from(sirkuler).where(eq(sirkuler.slug, slug)).get();
    if (!r) return undefined;

    return {
      id: r.id,
      title: r.title,
      slug: r.slug,
      date: r.date,
      category: r.category,
      regulationType: r.regulationType || undefined,
      officialGazetteNumber: r.officialGazetteNumber || undefined,
      relatedGtip: r.relatedGtip || undefined,
      summary: r.summary,
      content: r.content,
      expertNote: r.expertNote || undefined,
      sourceUrl: r.sourceUrl || undefined,
      pdfUrl: r.pdfUrl || undefined,
      author: r.author || undefined,
      viewsCount: r.viewsCount,
      isPublished: r.isPublished,
    };
  } catch (error) {
    console.error("Sirküler slug okuma hatası:", error);
    return undefined;
  }
}

export function saveSirkuler(item: Omit<SirkulerItem, "id" | "slug">): SirkulerItem {
  const slug = item.title
    .toLowerCase()
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") + "-" + Date.now().toString().slice(-4);

  const id = "sirkuler-" + Date.now();
  const dateStr = item.date || new Date().toISOString().split("T")[0];

  db.insert(sirkuler).values({
    id,
    slug,
    title: item.title,
    category: item.category || "Genel Mevzuat",
    regulationType: item.regulationType || null,
    officialGazetteNumber: item.officialGazetteNumber || null,
    relatedGtip: item.relatedGtip || null,
    summary: item.summary,
    content: item.content,
    expertNote: item.expertNote || null,
    sourceUrl: item.sourceUrl || null,
    pdfUrl: item.pdfUrl || null,
    author: item.author || "Kalem Gümrük Mevzuat Kurulu",
    viewsCount: 0,
    isPublished: true,
    date: dateStr,
    createdAt: new Date(),
  }).run();

  return {
    ...item,
    id,
    slug,
    date: dateStr,
    viewsCount: 0,
    isPublished: true,
  };
}

export function deleteSirkuler(id: string) {
  return db.delete(sirkuler).where(eq(sirkuler.id, id)).run();
}
