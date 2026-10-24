import { db } from "@/db";
import { services } from "@/db/schema";
import { eq, asc } from "drizzle-orm";

export interface ServiceItem {
  id: string;
  slug: string;
  title: string;
  shortDesc: string;
  iconName: string;
  category: "gumruk" | "rejim" | "danismanlik";
  features: string[];
  detailedContent: string;
  orderIndex: number;
  isActive: boolean;
  translations?: Record<
    string,
    {
      title?: string;
      shortDesc?: string;
      detailedContent?: string;
      features?: string[];
    }
  >;
}

export function getAllServices(lang: string = "tr"): ServiceItem[] {
  try {
    const records = db
      .select()
      .from(services)
      .where(eq(services.isActive, true))
      .orderBy(asc(services.orderIndex))
      .all();

    return records.map((r) => {
      let parsedFeatures: string[] = [];
      try {
        parsedFeatures = JSON.parse(r.features || "[]");
      } catch {
        parsedFeatures = [];
      }

      let parsedTranslations: Record<string, any> = {};
      try {
        parsedTranslations = JSON.parse(r.translations || "{}");
      } catch {
        parsedTranslations = {};
      }

      // Dil desteği (Fallback mantığı: Çeviri varsa al, yoksa TR varsayılanını koru)
      const langTrans = lang !== "tr" ? parsedTranslations[lang] : undefined;

      const title = langTrans?.title || r.title;
      const shortDesc = langTrans?.shortDesc || r.shortDesc;
      const detailedContent = langTrans?.detailedContent || r.detailedContent;
      const features =
        Array.isArray(langTrans?.features) && langTrans.features.length > 0
          ? langTrans.features
          : parsedFeatures;

      return {
        id: r.id,
        slug: r.slug,
        title,
        shortDesc,
        iconName: r.iconName,
        category: r.category as "gumruk" | "rejim" | "danismanlik",
        features,
        detailedContent,
        orderIndex: r.orderIndex,
        isActive: r.isActive,
        translations: parsedTranslations,
      };
    });
  } catch (error) {
    console.error("Veritabanından hizmetler okuma hatası:", error);
    return [];
  }
}

export function getServiceBySlug(slug: string, lang: string = "tr"): ServiceItem | undefined {
  try {
    const r = db.select().from(services).where(eq(services.slug, slug)).get();
    if (!r) return undefined;

    let parsedFeatures: string[] = [];
    try {
      parsedFeatures = JSON.parse(r.features || "[]");
    } catch {
      parsedFeatures = [];
    }

    let parsedTranslations: Record<string, any> = {};
    try {
      parsedTranslations = JSON.parse(r.translations || "{}");
    } catch {
      parsedTranslations = {};
    }

    const langTrans = lang !== "tr" ? parsedTranslations[lang] : undefined;

    const title = langTrans?.title || r.title;
    const shortDesc = langTrans?.shortDesc || r.shortDesc;
    const detailedContent = langTrans?.detailedContent || r.detailedContent;
    const features =
      Array.isArray(langTrans?.features) && langTrans.features.length > 0
        ? langTrans.features
        : parsedFeatures;

    return {
      id: r.id,
      slug: r.slug,
      title,
      shortDesc,
      iconName: r.iconName,
      category: r.category as "gumruk" | "rejim" | "danismanlik",
      features,
      detailedContent,
      orderIndex: r.orderIndex,
      isActive: r.isActive,
      translations: parsedTranslations,
    };
  } catch (error) {
    console.error("Hizmet slug okuma hatası:", error);
    return undefined;
  }
}
