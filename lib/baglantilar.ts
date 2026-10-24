import { db } from "@/db";
import { gerekliBaglantilar } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
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

export function getAllGerekliBaglantilar(): GerekliBaglanti[] {
  try {
    const records = db
      .select()
      .from(gerekliBaglantilar)
      .where(eq(gerekliBaglantilar.isActive, true))
      .orderBy(asc(gerekliBaglantilar.orderIndex))
      .all();

    if (!records || records.length === 0) {
      return getFallbackBaglantilar();
    }

    return records.map((r) => ({
      id: r.id,
      title: r.title,
      shortTitle: r.shortTitle,
      category: r.category,
      url: r.url,
      image: r.image,
      description: r.description,
      tag: r.tag,
      orderIndex: r.orderIndex,
      isActive: r.isActive,
    }));
  } catch (error) {
    console.warn("Veritabanından gerekli bağlantılar okunamadı, statik fallback kullanılıyor:", error);
    return getFallbackBaglantilar();
  }
}
