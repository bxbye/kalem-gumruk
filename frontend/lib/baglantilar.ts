import { gerekliBaglantilarData } from "@/data/gerekliBaglantilar";
import { fetchBackendNoStore } from "./api";

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
  try {
    const res = await fetchBackendNoStore("/api/public/baglantilar");
    if (res.ok) {
      const data = await res.json();
      if (data && data.success && Array.isArray(data.baglantilar)) {
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
