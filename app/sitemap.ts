import { MetadataRoute } from "next";
import { servicesData } from "@/data/services";
import { getAllSirkuler } from "@/lib/sirkuler";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://kalemgumruk.com";
  const currentDate = new Date();

  // Sabit Sayfalar
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/kurumsal`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/araclar`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/sirkuler`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/iletisim`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/kariyer`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  // Hizmet Sayfaları
  const servicePages: MetadataRoute.Sitemap = servicesData.map((service) => ({
    url: `${baseUrl}/hizmetlerimiz/${service.slug}`,
    lastModified: currentDate,
    changeFrequency: "monthly",
    priority: 0.85,
  }));

  // Sirküler Sayfaları
  const sirkulerItems = getAllSirkuler();
  const sirkulerPages: MetadataRoute.Sitemap = sirkulerItems.map((item) => ({
    url: `${baseUrl}/sirkuler/${item.slug}`,
    lastModified: new Date(item.date),
    changeFrequency: "never",
    priority: 0.7,
  }));

  return [...staticPages, ...servicePages, ...sirkulerPages];
}
