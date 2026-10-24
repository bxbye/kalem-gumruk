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

function getFallbackServices(lang: string = "tr"): ServiceItem[] {
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

export async function getAllServicesAsync(lang: string = "tr"): Promise<ServiceItem[]> {
  const backendUrl = process.env.BACKEND_INTERNAL_URL || "http://localhost:5001";
  try {
    const res = await fetch(`${backendUrl}/api/public/services?lang=${lang}`, {
      next: { revalidate: 60 },
    });
    if (res.ok) {
      const data = await res.json();
      if (data.services && data.services.length > 0) {
        return data.services;
      }
    }
  } catch {
    // Backend erişilemezse fallback döndür
  }
  return getFallbackServices(lang);
}

// Senkron uyumluluk için (mevcut Server Component çağrıları için)
export function getAllServices(lang: string = "tr"): ServiceItem[] {
  return getFallbackServices(lang);
}

export function getServiceBySlug(slug: string, lang: string = "tr"): ServiceItem | undefined {
  const all = getFallbackServices(lang);
  return all.find((s) => s.slug === slug);
}
