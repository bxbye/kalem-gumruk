import { db } from "@/db";
import { services } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import { servicesData } from "@/data/services";

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

function getFallbackServices(): ServiceItem[] {
  return servicesData.map((item, idx) => ({
    id: `service-${item.slug}`,
    slug: item.slug,
    title: item.title,
    shortDesc: item.shortDesc,
    iconName: item.iconName,
    category: item.category,
    features: item.features,
    detailedContent: item.detailedContent,
    orderIndex: idx,
    isActive: true,
  }));
}

export function getAllServices(lang: string = "tr"): ServiceItem[] {
  try {
    const records = db
      .select()
      .from(services)
      .where(eq(services.isActive, true))
      .orderBy(asc(services.orderIndex))
      .all();

    if (!records || records.length === 0) {
      return getFallbackServices();
    }

    return (records as any[]).map((r: any) => {
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
    });
  } catch (error) {
    console.warn("Veritabanından hizmetler okunamadı, statik fallback kullanılıyor:", error);
    return getFallbackServices();
  }
}

export function getServiceBySlug(slug: string, lang: string = "tr"): ServiceItem | undefined {
  try {
    const r = db.select().from(services).where(eq(services.slug, slug)).get();
    if (!r) {
      const fallback = getFallbackServices().find((s) => s.slug === slug);
      return fallback;
    }

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
    console.warn("Hizmet slug okunamadı, statik fallback kullanılıyor:", error);
    return getFallbackServices().find((s) => s.slug === slug);
  }
}
