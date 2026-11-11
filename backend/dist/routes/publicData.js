import { Router } from "express";
import { db, isDbConnected } from "../db/index.js";
import { sirkuler, services, gerekliBaglantilar, references, siteSettings } from "../db/schema.js";
import { eq, desc, asc, and, or } from "drizzle-orm";
import { companyInfo } from "../data/company.js";
import { servicesData } from "../data/services.js";
import { defaultSirkuler } from "../data/sirkuler.js";
import { gerekliBaglantilarData } from "../data/gerekliBaglantilar.js";
import { generateHumanChallenge } from "../services/security.js";
import { setNoStoreHeaders, safeJsonParse } from "../utils/http.js";
export const publicDataRouter = Router();
publicDataRouter.use((_req, res, next) => {
    setNoStoreHeaders(res);
    next();
});
// ==================== İNSAN DOĞRULAMASI / GÜVENLİK SORUSU (PUBLIC) ====================
publicDataRouter.get("/challenge", (_req, res) => {
    try {
        const challenge = generateHumanChallenge();
        return res.json({ success: true, challenge });
    }
    catch (error) {
        console.error("[Public Challenge Error]:", error);
        return res.status(500).json({ error: "Güvenlik sorusu oluşturulamadı." });
    }
});
// Helper: servicesData formatlayıcı
function formatStaticServices(lang) {
    return servicesData.map((s, idx) => ({
        id: `service-${s.slug}`,
        slug: s.slug,
        title: s.title,
        shortDesc: s.shortDesc,
        iconName: s.iconName,
        category: s.category,
        features: s.features,
        detailedContent: s.detailedContent,
        orderIndex: idx,
        isActive: true,
        translations: {},
    }));
}
// ==================== HİZMETLER (PUBLIC) ====================
publicDataRouter.get("/services", async (req, res) => {
    const lang = req.query.lang || "tr";
    if (!isDbConnected) {
        return res.json({ success: true, services: formatStaticServices(lang) });
    }
    try {
        const list = await db
            .select()
            .from(services)
            .where(eq(services.isActive, true))
            .orderBy(asc(services.orderIndex));
        const formatted = list.map((r) => {
            const parsedFeatures = safeJsonParse(r.features, []);
            const parsedTranslations = safeJsonParse(r.translations, {});
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
        return res.json({ success: true, services: formatted });
    }
    catch (error) {
        console.error("[Public Services] DB sorgu hatası:", error instanceof Error ? error.message : error);
        return res.status(500).json({ error: "Hizmetler yüklenemedi." });
    }
});
publicDataRouter.get("/services/:slug", async (req, res) => {
    const { slug } = req.params;
    const lang = req.query.lang || "tr";
    if (!isDbConnected) {
        const staticItem = servicesData.find((s) => s.slug === slug);
        if (!staticItem)
            return res.status(404).json({ error: "Hizmet bulunamadı." });
        return res.json({
            success: true,
            service: {
                id: `service-${staticItem.slug}`,
                slug: staticItem.slug,
                title: staticItem.title,
                shortDesc: staticItem.shortDesc,
                iconName: staticItem.iconName,
                category: staticItem.category,
                features: staticItem.features,
                detailedContent: staticItem.detailedContent,
                orderIndex: 0,
                isActive: true,
            },
        });
    }
    try {
        const [record] = await db
            .select()
            .from(services)
            .where(and(eq(services.slug, slug), eq(services.isActive, true)))
            .limit(1);
        if (!record) {
            return res.status(404).json({ error: "Hizmet bulunamadı." });
        }
        const parsedFeatures = safeJsonParse(record.features, []);
        const parsedTranslations = safeJsonParse(record.translations, {});
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
    }
    catch (error) {
        console.error("[Public Service Detail] DB sorgu hatası:", error instanceof Error ? error.message : error);
        return res.status(500).json({ error: "Hizmet detayı yüklenemedi." });
    }
});
// Helper: sirkuler formatlayıcı
function formatStaticSirkuler() {
    return defaultSirkuler.map((s) => ({
        id: s.id,
        slug: s.slug,
        title: s.title,
        category: s.category,
        regulationType: s.regulationType || null,
        officialGazetteNumber: s.officialGazetteNumber || null,
        relatedGtip: s.relatedGtip || null,
        summary: s.summary,
        content: s.content,
        expertNote: s.expertNote || null,
        sourceUrl: s.sourceUrl || null,
        pdfUrl: s.pdfUrl || null,
        author: s.author || "Kalem Gümrük Mevzuat Kurulu",
        viewsCount: 0,
        isPublished: true,
        date: s.date,
        createdAt: new Date().toISOString(),
    }));
}
// ==================== SIRKÜLER & MEVZUAT (PUBLIC) ====================
publicDataRouter.get("/sirkuler", async (req, res) => {
    const lang = req.query.lang || "tr";
    if (!isDbConnected) {
        return res.json({ success: true, sirkuler: formatStaticSirkuler() });
    }
    try {
        const list = await db
            .select()
            .from(sirkuler)
            .where(eq(sirkuler.isPublished, true))
            .orderBy(desc(sirkuler.date));
        const formatted = list.map((r) => {
            const parsedTranslations = safeJsonParse(r.translations, {});
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
        return res.json({ success: true, sirkuler: formatted });
    }
    catch (error) {
        console.error("[Public Sirkuler] DB sorgu hatası:", error instanceof Error ? error.message : error);
        return res.status(500).json({ error: "Sirkülerler yüklenemedi." });
    }
});
publicDataRouter.get("/sirkuler/:slug", async (req, res) => {
    const rawSlug = req.params.slug;
    const decodedSlug = decodeURIComponent(rawSlug);
    const lang = req.query.lang || "tr";
    if (!isDbConnected) {
        const staticItem = defaultSirkuler.find((s) => s.slug === rawSlug || s.slug === decodedSlug);
        if (!staticItem)
            return res.status(404).json({ error: "Sirküler bulunamadı." });
        return res.json({
            success: true,
            sirkuler: {
                ...staticItem,
                viewsCount: 0,
                isPublished: true,
                createdAt: new Date().toISOString(),
            },
        });
    }
    try {
        const [record] = await db
            .select()
            .from(sirkuler)
            .where(and(or(eq(sirkuler.slug, rawSlug), eq(sirkuler.slug, decodedSlug)), eq(sirkuler.isPublished, true)))
            .limit(1);
        if (!record) {
            return res.status(404).json({ error: "Sirküler bulunamadı." });
        }
        const parsedTranslations = safeJsonParse(record.translations, {});
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
    }
    catch (error) {
        console.error("[Public Sirkuler Detail] DB sorgu hatası:", error instanceof Error ? error.message : error);
        return res.status(500).json({ error: "Sirküler detayı yüklenemedi." });
    }
});
// ==================== GEREKLİ BAĞLANTILAR (PUBLIC) ====================
publicDataRouter.get("/baglantilar", async (_req, res) => {
    if (!isDbConnected) {
        return res.json({ success: true, baglantilar: gerekliBaglantilarData });
    }
    try {
        const list = await db
            .select()
            .from(gerekliBaglantilar)
            .where(eq(gerekliBaglantilar.isActive, true))
            .orderBy(asc(gerekliBaglantilar.orderIndex));
        return res.json({ success: true, baglantilar: list });
    }
    catch (error) {
        console.error("[Public Baglantilar] DB sorgu hatası:", error instanceof Error ? error.message : error);
        return res.status(500).json({ error: "Bağlantılar yüklenemedi." });
    }
});
// ==================== REFERANSLAR (PUBLIC) ====================
publicDataRouter.get("/references", async (_req, res) => {
    if (!isDbConnected) {
        return res.json({ success: true, references: [] });
    }
    try {
        const list = await db
            .select()
            .from(references)
            .where(eq(references.isActive, true))
            .orderBy(asc(references.orderIndex));
        return res.json({ success: true, references: list });
    }
    catch (error) {
        console.error("[Public References] DB sorgu hatası:", error instanceof Error ? error.message : error);
        return res.status(500).json({ error: "Referanslar yüklenemedi." });
    }
});
// ==================== SİTE VE FİRMA AYARLARI (PUBLIC) ====================
publicDataRouter.get("/settings", async (_req, res) => {
    if (!isDbConnected) {
        return res.json({ success: true, settings: companyInfo });
    }
    try {
        const [record] = await db.select().from(siteSettings).where(eq(siteSettings.key, "general_settings")).limit(1);
        const dbSettings = safeJsonParse(record?.value, {});
        const merged = {
            ...companyInfo,
            ...dbSettings,
        };
        return res.json({ success: true, settings: merged });
    }
    catch (error) {
        console.warn("[Public Settings] DB sorgu hatası, varsayılan ayarlar kullanılıyor:", error instanceof Error ? error.message : error);
        return res.json({ success: true, settings: companyInfo });
    }
});
