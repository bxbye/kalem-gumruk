import fs from "fs";
import path from "path";

export interface SirkulerItem {
  id: string;
  title: string;
  slug: string;
  date: string;
  category: string;
  summary: string;
  content: string;
  sourceUrl?: string;
}

const dbPath = path.join(process.cwd(), "data", "sirkuler-db.json");

export function getAllSirkuler(): SirkulerItem[] {
  try {
    if (!fs.existsSync(dbPath)) {
      return [];
    }
    const data = fs.readFileSync(dbPath, "utf-8");
    const items = JSON.parse(data) as SirkulerItem[];
    // En yeni tarih en üstte
    return items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch (error) {
    console.error("Sirküler okuma hatası:", error);
    return [];
  }
}

export function getSirkulerBySlug(slug: string): SirkulerItem | undefined {
  const items = getAllSirkuler();
  return items.find((item) => item.slug === slug);
}

export function saveSirkuler(item: Omit<SirkulerItem, "id" | "slug">): SirkulerItem {
  const items = getAllSirkuler();
  
  // Basit ve temiz slug üretimi
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

  const newItem: SirkulerItem = {
    ...item,
    id: "sirkuler-" + Date.now(),
    slug,
  };

  items.unshift(newItem);
  fs.writeFileSync(dbPath, JSON.stringify(items, null, 2), "utf-8");
  return newItem;
}
