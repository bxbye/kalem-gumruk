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

function getFallbackSirkuler(lang: string = "tr"): SirkulerItem[] {
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

export async function getAllSirkulerAsync(lang: string = "tr"): Promise<SirkulerItem[]> {
  const backendUrl = process.env.BACKEND_INTERNAL_URL || "http://127.0.0.1:5001";
  try {
    const res = await fetch(`${backendUrl}/api/public/sirkuler?lang=${lang}`, {
      cache: "no-store",
    });
    if (res.ok) {
      const data = await res.json();
      if (data && data.success && Array.isArray(data.sirkuler)) {
        return data.sirkuler;
      }
    }
  } catch (error) {
    console.error("[getAllSirkulerAsync] Backend fetch failed, using fallback:", error);
  }
  return getFallbackSirkuler(lang);
}

export async function getSirkulerBySlugAsync(
  slug: string,
  lang: string = "tr"
): Promise<SirkulerItem | undefined> {
  const backendUrl = process.env.BACKEND_INTERNAL_URL || "http://127.0.0.1:5001";
  try {
    const res = await fetch(
      `${backendUrl}/api/public/sirkuler/${encodeURIComponent(slug)}?lang=${lang}`,
      {
        cache: "no-store",
      }
    );
    if (res.ok) {
      const data = await res.json();
      if (data && data.success && data.sirkuler) {
        return data.sirkuler;
      }
    }
    if (res.status === 404) {
      return undefined;
    }
  } catch (error) {
    console.error("[getSirkulerBySlugAsync] Backend fetch failed, checking fallback:", error);
  }
  const fallbackAll = getFallbackSirkuler(lang);
  return fallbackAll.find((s) => s.slug === slug);
}

export function getAllSirkuler(lang: string = "tr"): SirkulerItem[] {
  return getFallbackSirkuler(lang);
}

export function getSirkulerBySlug(slug: string, lang: string = "tr"): SirkulerItem | undefined {
  const all = getFallbackSirkuler(lang);
  return all.find((s) => s.slug === slug);
}
