import { gerekliBaglantilarData } from "@/data/gerekliBaglantilar";

export interface GerekliBaglanti {
  id: string;
  title: string;
  shortTitle: string;
  category: string;
  url: string;
  image: string;
  description: string;
  tag: string;
  orderIndex: number;
  isActive: boolean;
}

function getFallbackBaglantilar(): GerekliBaglanti[] {
  return gerekliBaglantilarData.map((item, index) => ({
    id: item.id,
    title: item.title,
    shortTitle: item.shortTitle,
    category: item.category,
    url: item.url,
    image: item.image,
    description: item.description,
    tag: item.tag,
    orderIndex: index,
    isActive: true,
  }));
}

export async function getAllGerekliBaglantilarAsync(): Promise<GerekliBaglanti[]> {
  const backendUrl = process.env.BACKEND_INTERNAL_URL || "http://localhost:5001";
  try {
    const res = await fetch(`${backendUrl}/api/public/baglantilar`, {
      cache: "no-store",
    });
    if (res.ok) {
      const data = await res.json();
      if (data.baglantilar && data.baglantilar.length > 0) {
        return data.baglantilar;
      }
    }
  } catch {
    // Fallback
  }
  return getFallbackBaglantilar();
}

export function getAllGerekliBaglantilar(): GerekliBaglanti[] {
  return getFallbackBaglantilar();
}
