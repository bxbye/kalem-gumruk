import { db } from "@/db";
import { gerekliBaglantilar } from "@/db/schema";
import { eq, asc } from "drizzle-orm";

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

export function getAllGerekliBaglantilar(): GerekliBaglanti[] {
  try {
    const records = db
      .select()
      .from(gerekliBaglantilar)
      .where(eq(gerekliBaglantilar.isActive, true))
      .orderBy(asc(gerekliBaglantilar.orderIndex))
      .all();

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
    console.error("Veritabanından gerekli bağlantılar okuma hatası:", error);
    return [];
  }
}
