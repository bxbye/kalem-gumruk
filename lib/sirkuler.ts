import { db } from "@/db";
import { sirkuler } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { defaultSirkuler } from "@/data/sirkuler";

export interface SirkulerItem {
  id: string;
  title: string;
  slug: string;
  date: string;
  category: string;
  regulationType?: string;
  officialGazetteNumber?: string;
  relatedGtip?: string;
  summary: string;
  content: string;
  expertNote?: string;
  sourceUrl?: string;
  pdfUrl?: string;
  author?: string;
  viewsCount?: number;
  isPublished?: boolean;
  translations?: Record<
    string,
    {
      title?: string;
      summary?: string;
      content?: string;
      expertNote?: string;
    }
  >;
}

function getFallbackSirkuler(): SirkulerItem[] {
  return defaultSirkuler.map((item) => ({
    id: item.id,
    title: item.title,
    slug: item.slug,
    date: item.date,
    category: item.category,
    regulationType: item.regulationType || undefined,
    officialGazetteNumber: item.officialGazetteNumber || undefined,
    relatedGtip: item.relatedGtip || undefined,
    summary: item.summary,
    content: item.content,
    expertNote: item.expertNote || undefined,
    sourceUrl: item.sourceUrl || undefined,
    pdfUrl: item.pdfUrl || undefined,
    author: item.author || "Kalem Gümrük Mevzuat Kurulu",
    viewsCount: 0,
    isPublished: true,
  }));
}

export function getAllSirkuler(lang: string = "tr"): SirkulerItem[] {
  try {
    const records = db
      .select()
      .from(sirkuler)
      .where(eq(sirkuler.isPublished, true))
      .orderBy(desc(sirkuler.date))
      .all();

    if (!records || records.length === 0) {
      return getFallbackSirkuler();
    }

    return (records as any[]).map((r: any) => {
      let parsedTranslations: Record<string, any> = {};
      try {
        parsedTranslations = JSON.parse(r.translations || "{}");
      } catch {
        parsedTranslations = {};
      }

      const langTrans = lang !== "tr" ? parsedTranslations[lang] : undefined;
      const title = langTrans?.title || r.title;
      const summary = langTrans?.summary || r.summary;
      const content = langTrans?.content || r.content;
      const expertNote = langTrans?.expertNote || r.expertNote || undefined;

      return {
        id: r.id,
        title,
        slug: r.slug,
        date: r.date,
        category: r.category,
        regulationType: r.regulationType || undefined,
        officialGazetteNumber: r.officialGazetteNumber || undefined,
        relatedGtip: r.relatedGtip || undefined,
        summary,
        content,
        expertNote,
        sourceUrl: r.sourceUrl || undefined,
        pdfUrl: r.pdfUrl || undefined,
        author: r.author || undefined,
        viewsCount: r.viewsCount,
        isPublished: r.isPublished,
        translations: parsedTranslations,
      };
    });
  } catch (error) {
    console.warn("Veritabanından sirküler okunamadı, statik fallback kullanılıyor:", error);
    return getFallbackSirkuler();
  }
}

export function getSirkulerBySlug(slug: string, lang: string = "tr"): SirkulerItem | undefined {
  try {
    const r = db.select().from(sirkuler).where(eq(sirkuler.slug, slug)).get();
    if (!r) {
      return getFallbackSirkuler().find((item) => item.slug === slug);
    }

    let parsedTranslations: Record<string, any> = {};
    try {
      parsedTranslations = JSON.parse(r.translations || "{}");
    } catch {
      parsedTranslations = {};
    }

    const langTrans = lang !== "tr" ? parsedTranslations[lang] : undefined;
    const title = langTrans?.title || r.title;
    const summary = langTrans?.summary || r.summary;
    const content = langTrans?.content || r.content;
    const expertNote = langTrans?.expertNote || r.expertNote || undefined;

    return {
      id: r.id,
      title,
      slug: r.slug,
      date: r.date,
      category: r.category,
      regulationType: r.regulationType || undefined,
      officialGazetteNumber: r.officialGazetteNumber || undefined,
      relatedGtip: r.relatedGtip || undefined,
      summary,
      content,
      expertNote,
      sourceUrl: r.sourceUrl || undefined,
      pdfUrl: r.pdfUrl || undefined,
      author: r.author || undefined,
      viewsCount: r.viewsCount,
      isPublished: r.isPublished,
      translations: parsedTranslations,
    };
  } catch (error) {
    console.warn("Sirküler slug okunamadı, statik fallback kullanılıyor:", error);
    return getFallbackSirkuler().find((item) => item.slug === slug);
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
    translations: "{}",
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
