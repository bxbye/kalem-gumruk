import { MetadataRoute } from "next";
import { getAllServices } from "@/lib/services";
import { getAllSirkuler } from "@/lib/sirkuler";
import { availableLanguages } from "@/data/translations";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://kalemgumruk.com";
  const currentDate = new Date();
  const languages = availableLanguages.map((l) => l.code);

  const staticSlugs = [
    "",
    "kurumsal",
    "hizmetlerimiz",
    "araclar",
    "sirkuler",
    "iletisim",
    "belgeler",
    "degerlendirme",
    "kariyer",
  ];

  const staticPages: MetadataRoute.Sitemap = [];
  for (const lang of languages) {
    for (const slug of staticSlugs) {
      const path = slug ? `/${lang}/${slug}` : `/${lang}`;
      staticPages.push({
        url: `${baseUrl}${path}`,
        lastModified: currentDate,
        changeFrequency: slug === "sirkuler" ? "daily" : slug === "" ? "weekly" : "monthly",
        priority: slug === "" ? 1.0 : slug === "hizmetlerimiz" ? 0.95 : 0.8,
      });
    }
  }

  // Hizmet Sayfaları (Tüm diller)
  const services = getAllServices("tr");
  const servicePages: MetadataRoute.Sitemap = [];
  for (const lang of languages) {
    for (const service of services) {
      servicePages.push({
        url: `${baseUrl}/${lang}/hizmetlerimiz/${service.slug}`,
        lastModified: currentDate,
        changeFrequency: "monthly",
        priority: 0.85,
      });
    }
  }

  // Sirküler Sayfaları (Tüm diller)
  const sirkulerItems = getAllSirkuler("tr");
  const sirkulerPages: MetadataRoute.Sitemap = [];
  for (const lang of languages) {
    for (const item of sirkulerItems) {
      sirkulerPages.push({
        url: `${baseUrl}/${lang}/sirkuler/${item.slug}`,
        lastModified: new Date(item.date),
        changeFrequency: "never",
        priority: 0.7,
      });
    }
  }

  return [...staticPages, ...servicePages, ...sirkulerPages];
}
