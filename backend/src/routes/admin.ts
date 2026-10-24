import { Router } from "express";
import { db } from "../db/index.js";
import {
  sirkuler,
  services,
  gerekliBaglantilar,
  references,
  siteSettings,
} from "../db/schema.js";
import { eq, desc, asc } from "drizzle-orm";

export const adminRouter = Router();

function slugify(text: string): string {
  const trMap: Record<string, string> = {
    ç: "c", Ç: "c",
    ğ: "g", Ğ: "g",
    ı: "i", I: "i", İ: "i",
    ö: "o", Ö: "o",
    ş: "s", Ş: "s",
    ü: "u", Ü: "u",
  };
  let str = text;
  for (const [key, val] of Object.entries(trMap)) {
    str = str.replaceAll(key, val);
  }
  return str
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function checkAdminPassword(req: any, res: any): boolean {
  const password = req.body?.password || req.query?.password || req.headers["x-admin-password"];
  const validPassword = process.env.ADMIN_PASSWORD || "kalem1997";
  if (password !== validPassword) {
    res.status(401).json({ error: "Yetkisiz işlem: Geçersiz şifre." });
    return false;
  }
  return true;
}

// ==================== 1. SIRKÜLER ====================
adminRouter.get("/sirkuler", async (_req, res) => {
  try {
    const list = await db.select().from(sirkuler).orderBy(desc(sirkuler.date)).all();
    const formatted = list.map((item) => ({
      ...item,
      translations: JSON.parse(item.translations || "{}"),
    }));
    return res.json({ success: true, sirkuler: formatted });
  } catch (error) {
    console.error("[Admin Sirkuler List Error]:", error);
    return res.status(500).json({ error: "Sirküler listelenemedi." });
  }
});

adminRouter.post("/sirkuler", async (req, res) => {
  if (!checkAdminPassword(req, res)) return;
  try {
    const {
      id,
      slug,
      title,
      category,
      regulationType,
      officialGazetteNumber,
      relatedGtip,
      summary,
      content,
      expertNote,
      sourceUrl,
      pdfUrl,
      author,
      date,
      translations,
      isPublished,
    } = req.body || {};

    if (!title || !summary || !content) {
      return res.status(400).json({ error: "Başlık, özet ve içerik alanları zorunludur." });
    }

    const sirkulerSlug = slug ? slugify(slug) : slugify(title);

    const sirkulerId = id || `sirkuler-${Date.now()}`;
    const now = new Date();

    const existing = await db.select().from(sirkuler).where(eq(sirkuler.id, sirkulerId)).get();

    if (existing) {
      await db
        .update(sirkuler)
        .set({
          slug: sirkulerSlug,
          title,
          category: category || "İthalat & Vergi",
          regulationType: regulationType || null,
          officialGazetteNumber: officialGazetteNumber || null,
          relatedGtip: relatedGtip || null,
          summary,
          content,
          expertNote: expertNote || null,
          sourceUrl: sourceUrl || null,
          pdfUrl: pdfUrl || null,
          author: author || "Kalem Gümrük Mevzuat Kurulu",
          date: date || new Date().toISOString().split("T")[0],
          translations: typeof translations === "string" ? translations : JSON.stringify(translations || {}),
          isPublished: isPublished !== undefined ? isPublished : true,
        })
        .where(eq(sirkuler.id, sirkulerId));
      return res.json({ success: true, message: "Sirküler güncellendi." });
    } else {
      await db.insert(sirkuler).values({
        id: sirkulerId,
        slug: sirkulerSlug,
        title,
        category: category || "İthalat & Vergi",
        regulationType: regulationType || null,
        officialGazetteNumber: officialGazetteNumber || null,
        relatedGtip: relatedGtip || null,
        summary,
        content,
        expertNote: expertNote || null,
        sourceUrl: sourceUrl || null,
        pdfUrl: pdfUrl || null,
        author: author || "Kalem Gümrük Mevzuat Kurulu",
        viewsCount: 0,
        isPublished: isPublished !== undefined ? isPublished : true,
        date: date || new Date().toISOString().split("T")[0],
        translations: typeof translations === "string" ? translations : JSON.stringify(translations || {}),
        createdAt: now,
      });
      return res.json({ success: true, message: "Sirküler eklendi.", id: sirkulerId });
    }
  } catch (error) {
    console.error("[Admin Sirkuler Save Error]:", error);
    return res.status(500).json({ error: "Sirküler kaydedilemedi." });
  }
});

adminRouter.delete("/sirkuler", async (req, res) => {
  if (!checkAdminPassword(req, res)) return;
  try {
    const id = (req.query.id as string) || req.body?.id;
    if (!id) return res.status(400).json({ error: "Silinecek sirküler ID belirtilmelidir." });

    await db.delete(sirkuler).where(eq(sirkuler.id, id));
    return res.json({ success: true, message: "Sirküler silindi." });
  } catch (error) {
    console.error("[Admin Sirkuler Delete Error]:", error);
    return res.status(500).json({ error: "Silme işlemi başarısız." });
  }
});

adminRouter.patch("/sirkuler/status", async (req, res) => {
  if (!checkAdminPassword(req, res)) return;
  try {
    const { id, isPublished } = req.body || {};
    if (!id) return res.status(400).json({ error: "Sirküler ID belirtilmelidir." });

    await db.update(sirkuler).set({ isPublished: Boolean(isPublished) }).where(eq(sirkuler.id, id));
    return res.json({ success: true, message: `Sirküler ${isPublished ? "yayına alındı" : "taslağa alındı"}.` });
  } catch (error) {
    console.error("[Admin Sirkuler Status Error]:", error);
    return res.status(500).json({ error: "Durum güncellenemedi." });
  }
});

// ==================== 2. HİZMETLER ====================
adminRouter.get("/services", async (_req, res) => {
  try {
    const list = await db.select().from(services).orderBy(asc(services.orderIndex)).all();
    const formatted = list.map((item) => ({
      ...item,
      features: JSON.parse(item.features || "[]"),
      translations: JSON.parse(item.translations || "{}"),
    }));
    return res.json({ success: true, services: formatted, items: formatted });
  } catch (error) {
    console.error("[Admin Services List Error]:", error);
    return res.status(500).json({ error: "Hizmetler listelenemedi." });
  }
});

adminRouter.post("/services", async (req, res) => {
  if (!checkAdminPassword(req, res)) return;
  try {
    const {
      id,
      slug,
      title,
      shortDesc,
      iconName,
      category,
      features,
      detailedContent,
      orderIndex,
      isActive,
      translations,
    } = req.body || {};

    if (!title || !shortDesc || !detailedContent) {
      return res.status(400).json({ error: "Başlık, kısa açıklama ve detaylı içerik zorunludur." });
    }

    const serviceSlug =
      slug ||
      title
        .toLowerCase()
        .replace(/[^a-z0-9ğüşıöç-]/gi, "-")
        .replace(/-+/g, "-");

    const serviceId = id || `service-${serviceSlug}`;

    const existing = await db.select().from(services).where(eq(services.id, serviceId)).get();

    if (existing) {
      await db
        .update(services)
        .set({
          slug: serviceSlug,
          title,
          shortDesc,
          iconName: iconName || "ArrowDownToLine",
          category: category || "gumruk",
          features: typeof features === "string" ? features : JSON.stringify(features || []),
          detailedContent,
          orderIndex: Number(orderIndex || 0),
          isActive: isActive !== undefined ? isActive : true,
          translations: typeof translations === "string" ? translations : JSON.stringify(translations || {}),
        })
        .where(eq(services.id, serviceId));
      return res.json({ success: true, message: "Hizmet güncellendi." });
    } else {
      await db.insert(services).values({
        id: serviceId,
        slug: serviceSlug,
        title,
        shortDesc,
        iconName: iconName || "ArrowDownToLine",
        category: category || "gumruk",
        features: typeof features === "string" ? features : JSON.stringify(features || []),
        detailedContent,
        orderIndex: Number(orderIndex || 0),
        isActive: isActive !== undefined ? isActive : true,
        translations: typeof translations === "string" ? translations : JSON.stringify(translations || {}),
        createdAt: new Date(),
      });
      return res.json({ success: true, message: "Hizmet eklendi.", id: serviceId });
    }
  } catch (error) {
    console.error("[Admin Services Save Error]:", error);
    return res.status(500).json({ error: "Hizmet kaydedilemedi." });
  }
});

adminRouter.delete("/services", async (req, res) => {
  if (!checkAdminPassword(req, res)) return;
  try {
    const id = (req.query.id as string) || req.body?.id;
    if (!id) return res.status(400).json({ error: "Silinecek hizmet ID belirtilmelidir." });

    await db.delete(services).where(eq(services.id, id));
    return res.json({ success: true, message: "Hizmet silindi." });
  } catch (error) {
    console.error("[Admin Services Delete Error]:", error);
    return res.status(500).json({ error: "Silme işlemi başarısız." });
  }
});

// ==================== 3. GEREKLİ BAĞLANTILAR ====================
adminRouter.get("/baglantilar", async (_req, res) => {
  try {
    const list = await db.select().from(gerekliBaglantilar).orderBy(asc(gerekliBaglantilar.orderIndex)).all();
    return res.json({ success: true, baglantilar: list, items: list });
  } catch (error) {
    console.error("[Admin Baglantilar List Error]:", error);
    return res.status(500).json({ error: "Bağlantılar listelenemedi." });
  }
});

adminRouter.post("/baglantilar", async (req, res) => {
  if (!checkAdminPassword(req, res)) return;
  try {
    const { id, title, shortTitle, category, url, image, description, tag, orderIndex, isActive } = req.body || {};

    if (!title || !url) {
      return res.status(400).json({ error: "Başlık ve URL zorunludur." });
    }

    const baglantiId = id || `link-${Date.now()}`;
    const existing = await db.select().from(gerekliBaglantilar).where(eq(gerekliBaglantilar.id, baglantiId)).get();

    if (existing) {
      await db
        .update(gerekliBaglantilar)
        .set({
          title,
          shortTitle: shortTitle || title,
          category: category || "Resmi Sistemler",
          url,
          image: image || "/images/baglantilar/beyanname-sorgulama.png",
          description: description || "",
          tag: tag || "Bakanlık Sistemi",
          orderIndex: Number(orderIndex || 0),
          isActive: isActive !== undefined ? isActive : true,
        })
        .where(eq(gerekliBaglantilar.id, baglantiId));
      return res.json({ success: true, message: "Bağlantı güncellendi." });
    } else {
      await db.insert(gerekliBaglantilar).values({
        id: baglantiId,
        title,
        shortTitle: shortTitle || title,
        category: category || "Resmi Sistemler",
        url,
        image: image || "/images/baglantilar/beyanname-sorgulama.png",
        description: description || "",
        tag: tag || "Bakanlık Sistemi",
        orderIndex: Number(orderIndex || 0),
        isActive: isActive !== undefined ? isActive : true,
        createdAt: new Date(),
      });
      return res.json({ success: true, message: "Bağlantı eklendi.", id: baglantiId });
    }
  } catch (error) {
    console.error("[Admin Baglantilar Save Error]:", error);
    return res.status(500).json({ error: "Bağlantı kaydedilemedi." });
  }
});

adminRouter.delete("/baglantilar", async (req, res) => {
  if (!checkAdminPassword(req, res)) return;
  try {
    const id = (req.query.id as string) || req.body?.id;
    if (!id) return res.status(400).json({ error: "Silinecek bağlantı ID belirtilmelidir." });

    await db.delete(gerekliBaglantilar).where(eq(gerekliBaglantilar.id, id));
    return res.json({ success: true, message: "Bağlantı silindi." });
  } catch (error) {
    console.error("[Admin Baglantilar Delete Error]:", error);
    return res.status(500).json({ error: "Silme işlemi başarısız." });
  }
});

// ==================== 4. REFERANSLAR ====================
adminRouter.get("/references", async (_req, res) => {
  try {
    const list = await db.select().from(references).orderBy(asc(references.orderIndex)).all();
    return res.json({ success: true, references: list, items: list });
  } catch (error) {
    console.error("[Admin References List Error]:", error);
    return res.status(500).json({ error: "Referanslar listelenemedi." });
  }
});

adminRouter.post("/references", async (req, res) => {
  if (!checkAdminPassword(req, res)) return;
  try {
    const { id, name, sector, description, logoUrl, orderIndex, isActive } = req.body || {};

    if (!name || !sector) {
      return res.status(400).json({ error: "Firma adı ve sektör zorunludur." });
    }

    const refId = id || `ref-${Date.now()}`;
    const existing = await db.select().from(references).where(eq(references.id, refId)).get();

    if (existing) {
      await db
        .update(references)
        .set({
          name,
          sector,
          description: description || null,
          logoUrl: logoUrl || null,
          orderIndex: Number(orderIndex || 0),
          isActive: isActive !== undefined ? isActive : true,
        })
        .where(eq(references.id, refId));
      return res.json({ success: true, message: "Referans güncellendi." });
    } else {
      await db.insert(references).values({
        id: refId,
        name,
        sector,
        description: description || null,
        logoUrl: logoUrl || null,
        orderIndex: Number(orderIndex || 0),
        isActive: isActive !== undefined ? isActive : true,
        createdAt: new Date(),
      });
      return res.json({ success: true, message: "Referans eklendi.", id: refId });
    }
  } catch (error) {
    console.error("[Admin References Save Error]:", error);
    return res.status(500).json({ error: "Referans kaydedilemedi." });
  }
});

adminRouter.delete("/references", async (req, res) => {
  if (!checkAdminPassword(req, res)) return;
  try {
    const id = (req.query.id as string) || req.body?.id;
    if (!id) return res.status(400).json({ error: "Silinecek referans ID belirtilmelidir." });

    await db.delete(references).where(eq(references.id, id));
    return res.json({ success: true, message: "Referans silindi." });
  } catch (error) {
    console.error("[Admin References Delete Error]:", error);
    return res.status(500).json({ error: "Silme işlemi başarısız." });
  }
});

// ==================== 5. SİTE AYARLARI ====================
adminRouter.get("/settings", async (_req, res) => {
  try {
    const record = await db.select().from(siteSettings).where(eq(siteSettings.key, "general_settings")).get();
    let settingsData = {};
    if (record && record.value) {
      try {
        settingsData = JSON.parse(record.value);
      } catch {
        settingsData = {};
      }
    }
    return res.json({ success: true, settings: settingsData });
  } catch (error) {
    console.error("[Admin Settings Get Error]:", error);
    return res.status(500).json({ error: "Ayarlar yüklenemedi." });
  }
});

adminRouter.post("/settings", async (req, res) => {
  if (!checkAdminPassword(req, res)) return;
  try {
    const { settings } = req.body || {};
    if (!settings) return res.status(400).json({ error: "Ayarlar verisi eksik." });

    const jsonVal = typeof settings === "string" ? settings : JSON.stringify(settings);
    const existing = await db.select().from(siteSettings).where(eq(siteSettings.key, "general_settings")).get();

    if (existing) {
      await db
        .update(siteSettings)
        .set({ value: jsonVal, updatedAt: new Date() })
        .where(eq(siteSettings.key, "general_settings"));
    } else {
      await db.insert(siteSettings).values({
        key: "general_settings",
        value: jsonVal,
        updatedAt: new Date(),
      });
    }

    return res.json({ success: true, message: "Ayarlar başarıyla kaydedildi." });
  } catch (error) {
    console.error("[Admin Settings Save Error]:", error);
    return res.status(500).json({ error: "Ayarlar kaydedilemedi." });
  }
});
