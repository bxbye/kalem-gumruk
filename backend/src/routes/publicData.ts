import { Router } from "express";
import { db } from "../db/index.js";
import { sirkuler, services, gerekliBaglantilar, references } from "../db/schema.js";
import { eq, desc, asc, and } from "drizzle-orm";

export const publicDataRouter = Router();

// ==================== HİZMETLER (PUBLIC) ====================
publicDataRouter.get("/services", async (req, res) => {
  try {
    const lang = (req.query.lang as string) || "tr";
    const list = await db
      .select()
      .from(services)
      .where(eq(services.isActive, true))
      .orderBy(asc(services.orderIndex))
      .all();

    const formatted = list.map((r: any) => {
      let parsedFeatures: string[] = [];
      try { parsedFeatures = JSON.parse(r.features || "[]"); } catch { parsedFeatures = []; }

      let parsedTranslations: Record<string, any> = {};
      try { parsedTranslations = JSON.parse(r.translations || "{}"); } catch { parsedTranslations = {}; }

      const langTrans = lang !== "tr" ? parsedTranslations[lang] : undefined;
      const title = langTrans?.title || r.title;
      const shortDesc = langTrans?.shortDesc || r.shortDesc;
      const detailedContent = langTrans?.detailedContent || r.detailedContent;
      const features = Array.isArray(langTrans?.features) && langTrans.features.length > 0 ? langTrans.features : parsedFeatures;

      return {
        id: r.id,
        slug: r.slug,
        title,
        shortDesc,
        iconName: r.iconName,
        category: r.category,
        features,
        detailedContent,
        orderIndex: r.orderIndex,
        isActive: r.isActive,
        translations: parsedTranslations,
      };
    });

    res.setHeader("Cache-Control", "public, max-age=60");
    return res.json({ success: true, services: formatted });
  } catch (error) {
    console.error("[Public Services Error]:", error);
    return res.status(500).json({ error: "Hizmetler alınamadı." });
  }
});

publicDataRouter.get("/services/:slug", async (req, res) => {
  try {
    const { slug } = req.params;
    const lang = (req.query.lang as string) || "tr";
    const record = await db
      .select()
      .from(services)
      .where(and(eq(services.slug, slug), eq(services.isActive, true)))
      .get();

    if (!record) {
      return res.status(404).json({ error: "Hizmet bulunamadı." });
    }

    let parsedFeatures: string[] = [];
    try { parsedFeatures = JSON.parse(record.features || "[]"); } catch { parsedFeatures = []; }

    let parsedTranslations: Record<string, any> = {};
    try { parsedTranslations = JSON.parse(record.translations || "{}"); } catch { parsedTranslations = {}; }

    const langTrans = lang !== "tr" ? parsedTranslations[lang] : undefined;

    return res.json({
      success: true,
      service: {
        id: record.id,
        slug: record.slug,
        title: langTrans?.title || record.title,
        shortDesc: langTrans?.shortDesc || record.shortDesc,
        iconName: record.iconName,
        category: record.category,
        features: Array.isArray(langTrans?.features) && langTrans.features.length > 0 ? langTrans.features : parsedFeatures,
        detailedContent: langTrans?.detailedContent || record.detailedContent,
        orderIndex: record.orderIndex,
        isActive: record.isActive,
      },
    });
  } catch (error) {
    console.error("[Public Service Detail Error]:", error);
    return res.status(500).json({ error: "Hizmet detayı alınamadı." });
  }
});

// ==================== SIRKÜLER (PUBLIC) ====================
publicDataRouter.get("/sirkuler", async (req, res) => {
  try {
    const lang = (req.query.lang as string) || "tr";
    const list = await db
      .select()
      .from(sirkuler)
      .where(eq(sirkuler.isPublished, true))
      .orderBy(desc(sirkuler.date))
      .all();

    const formatted = list.map((r: any) => {
      let parsedTranslations: Record<string, any> = {};
      try { parsedTranslations = JSON.parse(r.translations || "{}"); } catch { parsedTranslations = {}; }

      const langTrans = lang !== "tr" ? parsedTranslations[lang] : undefined;

      return {
        id: r.id,
        slug: r.slug,
        title: langTrans?.title || r.title,
        category: r.category,
        regulationType: r.regulationType,
        officialGazetteNumber: r.officialGazetteNumber,
        relatedGtip: r.relatedGtip,
        summary: langTrans?.summary || r.summary,
        content: langTrans?.content || r.content,
        expertNote: langTrans?.expertNote || r.expertNote,
        sourceUrl: r.sourceUrl,
        pdfUrl: r.pdfUrl,
        author: r.author,
        viewsCount: r.viewsCount,
        isPublished: r.isPublished,
        date: r.date,
        createdAt: r.createdAt,
      };
    });

    res.setHeader("Cache-Control", "public, max-age=60");
    return res.json({ success: true, sirkuler: formatted });
  } catch (error) {
    console.error("[Public Sirkuler Error]:", error);
    return res.status(500).json({ error: "Sirkülerler alınamadı." });
  }
});

publicDataRouter.get("/sirkuler/:slug", async (req, res) => {
  try {
    const { slug } = req.params;
    const lang = (req.query.lang as string) || "tr";
    const record = await db
      .select()
      .from(sirkuler)
      .where(and(eq(sirkuler.slug, slug), eq(sirkuler.isPublished, true)))
      .get();

    if (!record) {
      return res.status(404).json({ error: "Sirküler bulunamadı." });
    }

    let parsedTranslations: Record<string, any> = {};
    try { parsedTranslations = JSON.parse(record.translations || "{}"); } catch { parsedTranslations = {}; }

    const langTrans = lang !== "tr" ? parsedTranslations[lang] : undefined;

    return res.json({
      success: true,
      sirkuler: {
        id: record.id,
        slug: record.slug,
        title: langTrans?.title || record.title,
        category: record.category,
        regulationType: record.regulationType,
        officialGazetteNumber: record.officialGazetteNumber,
        relatedGtip: record.relatedGtip,
        summary: langTrans?.summary || record.summary,
        content: langTrans?.content || record.content,
        expertNote: langTrans?.expertNote || record.expertNote,
        sourceUrl: record.sourceUrl,
        pdfUrl: record.pdfUrl,
        author: record.author,
        viewsCount: record.viewsCount,
        isPublished: record.isPublished,
        date: record.date,
        createdAt: record.createdAt,
      },
    });
  } catch (error) {
    console.error("[Public Sirkuler Detail Error]:", error);
    return res.status(500).json({ error: "Sirküler detayı alınamadı." });
  }
});

// ==================== GEREKLİ BAĞLANTILAR (PUBLIC) ====================
publicDataRouter.get("/baglantilar", async (_req, res) => {
  try {
    const list = await db
      .select()
      .from(gerekliBaglantilar)
      .where(eq(gerekliBaglantilar.isActive, true))
      .orderBy(asc(gerekliBaglantilar.orderIndex))
      .all();
    res.setHeader("Cache-Control", "public, max-age=300");
    return res.json({ success: true, baglantilar: list });
  } catch (error) {
    console.error("[Public Baglantilar Error]:", error);
    return res.status(500).json({ error: "Bağlantılar alınamadı." });
  }
});

// ==================== REFERANSLAR (PUBLIC) ====================
publicDataRouter.get("/references", async (_req, res) => {
  try {
    const list = await db
      .select()
      .from(references)
      .where(eq(references.isActive, true))
      .orderBy(asc(references.orderIndex))
      .all();
    res.setHeader("Cache-Control", "public, max-age=300");
    return res.json({ success: true, references: list });
  } catch (error) {
    console.error("[Public References Error]:", error);
    return res.status(500).json({ error: "Referanslar alınamadı." });
  }
});
