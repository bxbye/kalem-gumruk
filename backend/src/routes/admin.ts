import { Router, type Response } from "express";
import path from "path";
import fs from "fs";
import { db } from "../db/index.js";
import {
  sirkuler,
  services,
  gerekliBaglantilar,
  references,
  siteSettings,
  users,
} from "../db/schema.js";
import { eq, desc, asc } from "drizzle-orm";
import { verifySmtp, sendTestEmail } from "../services/mailer.js";
import {
  authenticateRequest,
  generateToken,
  hashPassword,
  verifyPassword,
  type AuthenticatedRequest,
} from "../services/auth.js";
import {
  listDatabaseBackups,
  createDatabaseBackup,
  restoreDatabaseBackup,
  backupsDir,
} from "../services/backup.js";

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

/**
 * Kimlik ve Yetki Kontrolü
 */
async function authorize(
  req: AuthenticatedRequest,
  res: Response,
  options?: { requiredPermission?: string; requireAdmin?: boolean }
): Promise<boolean> {
  const user = await authenticateRequest(req);
  if (!user) {
    res.status(401).json({ error: "Yetkisiz işlem: Lütfen giriş yapınız veya geçerli şifre giriniz." });
    return false;
  }
  req.user = user;

  // 1. DELETE metodunda Editör kesinlikle engellenir
  if (req.method === "DELETE") {
    if (user.role !== "ADMIN" || user.permissions?.canDelete === false) {
      res.status(403).json({
        error: "Yetkisiz işlem: Editör kullanıcıları kayıt silme işlemi yapamaz. Silme yetkisi yalnızca Sistem Yöneticisine (Admin) aittir.",
      });
      return false;
    }
  }

  // 2. Sadece Admin'e özel alanlar
  if (options?.requireAdmin && user.role !== "ADMIN") {
    res.status(403).json({
      error: "Yetkisiz işlem: Bu alana yalnızca Sistem Yöneticisi (Admin) erişebilir.",
    });
    return false;
  }

  // 3. Özel yetki kontrolü
  if (options?.requiredPermission && user.role !== "ADMIN") {
    const hasPerm = Boolean(user.permissions?.[options.requiredPermission]);
    if (!hasPerm) {
      res.status(403).json({
        error: `Yetkisiz işlem: '${options.requiredPermission}' yetkiniz bulunmamaktadır.`,
      });
      return false;
    }
  }

  return true;
}

// ==================== 0. KİMLİK DOĞRULAMA (AUTH) ====================

/**
 * Giriş Yap (Hem Kullanıcı Adı + Şifre, hem de tek şifre ile giriş desteklenir)
 */
adminRouter.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body || {};
    const cleanPass = String(password || "").trim();
    const cleanUser = String(username || "").trim();

    if (!cleanPass) {
      return res.status(400).json({ error: "Lütfen şifrenizi giriniz." });
    }

    const adminEnvPass = (process.env.ADMIN_PASSWORD || "kalem1997").trim();
    const editorEnvPass = (process.env.EDITOR_PASSWORD || "editor1997").trim();

    // 1. Veritabanındaki kullanıcıları kontrol et
    let matchedUser: any = null;
    const dbUsers = await db.select().from(users).where(eq(users.isActive, true)).all();

    if (cleanUser) {
      const userRecord = dbUsers.find((u) => u.username.toLowerCase() === cleanUser.toLowerCase());
      if (userRecord && verifyPassword(cleanPass, userRecord.passwordHash)) {
        matchedUser = userRecord;
      }
    } else {
      // Kullanıcı adı verilmemişse şifreye göre eşleştir
      for (const u of dbUsers) {
        if (verifyPassword(cleanPass, u.passwordHash)) {
          matchedUser = u;
          break;
        }
      }
    }

    if (matchedUser) {
      let parsedPerms = {};
      try {
        parsedPerms = JSON.parse(matchedUser.permissions || "{}");
      } catch {
        parsedPerms = {};
      }

      const session = {
        id: matchedUser.id,
        username: matchedUser.username,
        role: matchedUser.role as "ADMIN" | "EDITOR",
        name: matchedUser.name,
        permissions: parsedPerms,
      };

      const token = generateToken(session);
      return res.json({ success: true, token, user: session });
    }

    // 2. Fallback: ENV şifreleri ile eşleşme
    if (cleanPass === adminEnvPass) {
      const session = {
        id: "env-admin",
        username: "admin",
        role: "ADMIN" as const,
        name: "Sistem Yöneticisi (Admin)",
        permissions: {
          canEditServices: true,
          canEditSirkuler: true,
          canEditBaglantilar: true,
          canEditReferences: true,
          canEditForms: true,
          canEditDocuments: true,
          canManageSettings: true,
          canManageUsers: true,
          canManageBackups: true,
          canDelete: true,
        },
      };
      const token = generateToken(session);
      return res.json({ success: true, token, user: session });
    }

    if (cleanPass === editorEnvPass) {
      const session = {
        id: "env-editor",
        username: "editor",
        role: "EDITOR" as const,
        name: "Mevzuat & İçerik Editörü",
        permissions: {
          canEditServices: true,
          canEditSirkuler: true,
          canEditBaglantilar: true,
          canEditReferences: true,
          canEditForms: false,
          canEditDocuments: true,
          canManageSettings: false,
          canManageUsers: false,
          canManageBackups: false,
          canDelete: false, // Editör silemez!
        },
      };
      const token = generateToken(session);
      return res.json({ success: true, token, user: session });
    }

    return res.status(401).json({ error: "Geçersiz kullanıcı adı veya şifre." });
  } catch (error: any) {
    console.error("[Admin Login Error]:", error);
    return res.status(500).json({ error: "Giriş işlemi sırasında sunucu hatası oluştu." });
  }
});

/**
 * Mevcut oturum bilgilerini doğrula
 */
adminRouter.get("/me", async (req: AuthenticatedRequest, res) => {
  const user = await authenticateRequest(req);
  if (!user) {
    return res.status(401).json({ error: "Oturum açılmamış." });
  }
  return res.json({ success: true, user });
});

// ==================== 1. SIRKÜLER & MEVZUAT ====================
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

adminRouter.post("/sirkuler", async (req: AuthenticatedRequest, res) => {
  if (!(await authorize(req, res, { requiredPermission: "canEditSirkuler" }))) return;
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

adminRouter.delete("/sirkuler", async (req: AuthenticatedRequest, res) => {
  // Silme işlemini YALNIZCA Admin yapabilir
  if (!(await authorize(req, res))) return;
  try {
    const id = (req.query.id as string) || req.body?.id;
    if (!id) return res.status(400).json({ error: "Silinecek sirküler ID belirtilmelidir." });

    await db.delete(sirkuler).where(eq(sirkuler.id, id));
    return res.json({ success: true, message: "Sirküler başarıyla silindi." });
  } catch (error) {
    console.error("[Admin Sirkuler Delete Error]:", error);
    return res.status(500).json({ error: "Silme işlemi başarısız." });
  }
});

adminRouter.patch("/sirkuler/status", async (req: AuthenticatedRequest, res) => {
  if (!(await authorize(req, res, { requiredPermission: "canEditSirkuler" }))) return;
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

adminRouter.post("/services", async (req: AuthenticatedRequest, res) => {
  if (!(await authorize(req, res, { requiredPermission: "canEditServices" }))) return;
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

adminRouter.delete("/services", async (req: AuthenticatedRequest, res) => {
  // Silme işlemini YALNIZCA Admin yapabilir
  if (!(await authorize(req, res))) return;
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

adminRouter.post("/baglantilar", async (req: AuthenticatedRequest, res) => {
  if (!(await authorize(req, res, { requiredPermission: "canEditBaglantilar" }))) return;
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

adminRouter.delete("/baglantilar", async (req: AuthenticatedRequest, res) => {
  // Silme işlemini YALNIZCA Admin yapabilir
  if (!(await authorize(req, res))) return;
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

adminRouter.post("/references", async (req: AuthenticatedRequest, res) => {
  if (!(await authorize(req, res, { requiredPermission: "canEditReferences" }))) return;
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

adminRouter.delete("/references", async (req: AuthenticatedRequest, res) => {
  // Silme işlemini YALNIZCA Admin yapabilir
  if (!(await authorize(req, res))) return;
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

adminRouter.post("/settings", async (req: AuthenticatedRequest, res) => {
  // Ayarları sadece Admin veya yetkilendirilmiş editör değiştirebilir
  if (!(await authorize(req, res, { requiredPermission: "canManageSettings" }))) return;
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

// ==================== 6. KULLANICI VE YETKİ YÖNETİMİ (ADMIN ONLY) ====================
adminRouter.get("/users", async (req: AuthenticatedRequest, res) => {
  if (!(await authorize(req, res, { requireAdmin: true }))) return;
  try {
    const userList = await db.select().from(users).orderBy(asc(users.createdAt)).all();
    const safeUsers = userList.map((u) => {
      let perms = {};
      try {
        perms = JSON.parse(u.permissions || "{}");
      } catch {
        perms = {};
      }
      return {
        id: u.id,
        username: u.username,
        name: u.name,
        role: u.role,
        permissions: perms,
        isActive: u.isActive,
        createdAt: u.createdAt,
        updatedAt: u.updatedAt,
      };
    });
    return res.json({ success: true, users: safeUsers });
  } catch (error) {
    console.error("[Admin Users List Error]:", error);
    return res.status(500).json({ error: "Kullanıcılar listelenemedi." });
  }
});

adminRouter.post("/users", async (req: AuthenticatedRequest, res) => {
  if (!(await authorize(req, res, { requireAdmin: true }))) return;
  try {
    const { id, username, password, name, role, permissions, isActive } = req.body || {};

    if (!username || !name) {
      return res.status(400).json({ error: "Kullanıcı adı ve Ad Soyad alanları zorunludur." });
    }

    const cleanUser = String(username).trim().toLowerCase();
    const userId = id || `user-${Date.now()}`;
    const userRole = (role === "ADMIN" ? "ADMIN" : "EDITOR") as "ADMIN" | "EDITOR";

    // Editörlerin silme yetkisi KESİNLİKLE false olmalıdır
    const parsedPerms = typeof permissions === "object" ? { ...permissions } : {};
    if (userRole === "EDITOR") {
      parsedPerms.canDelete = false; // Güvenlik garantisi
    }

    const existing = await db.select().from(users).where(eq(users.id, userId)).get();

    if (existing) {
      const updateData: any = {
        username: cleanUser,
        name,
        role: userRole,
        permissions: JSON.stringify(parsedPerms),
        isActive: isActive !== undefined ? Boolean(isActive) : existing.isActive,
        updatedAt: new Date(),
      };
      if (password && String(password).trim().length >= 4) {
        updateData.passwordHash = hashPassword(String(password).trim());
      }

      await db.update(users).set(updateData).where(eq(users.id, userId));
      return res.json({ success: true, message: "Kullanıcı başarıyla güncellendi." });
    } else {
      if (!password || String(password).trim().length < 4) {
        return res.status(400).json({ error: "Yeni kullanıcı için en az 4 karakterli bir şifre belirleyiniz." });
      }

      // Kullanıcı adı benzersizlik kontrolü
      const duplicate = await db.select().from(users).where(eq(users.username, cleanUser)).get();
      if (duplicate) {
        return res.status(400).json({ error: "Bu kullanıcı adı zaten kullanımda." });
      }

      await db.insert(users).values({
        id: userId,
        username: cleanUser,
        passwordHash: hashPassword(String(password).trim()),
        name,
        role: userRole,
        permissions: JSON.stringify(parsedPerms),
        isActive: isActive !== undefined ? Boolean(isActive) : true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      return res.json({ success: true, message: "Yeni kullanıcı başarıyla eklendi.", id: userId });
    }
  } catch (error: any) {
    console.error("[Admin Users Save Error]:", error);
    return res.status(500).json({ error: error?.message || "Kullanıcı kaydedilemedi." });
  }
});

adminRouter.delete("/users", async (req: AuthenticatedRequest, res) => {
  if (!(await authorize(req, res, { requireAdmin: true }))) return;
  try {
    const id = (req.query.id as string) || req.body?.id;
    if (!id) return res.status(400).json({ error: "Silinecek kullanıcı ID belirtilmelidir." });

    if (req.user?.id === id) {
      return res.status(400).json({ error: "Kendi yönetici hesabınızı silemezsiniz." });
    }

    await db.delete(users).where(eq(users.id, id));
    return res.json({ success: true, message: "Kullanıcı silindi." });
  } catch (error) {
    console.error("[Admin Users Delete Error]:", error);
    return res.status(500).json({ error: "Kullanıcı silinemedi." });
  }
});

// ==================== 7. YEDEKLEME VE GERİ YÜKLEME (BACKUPS - ADMIN ONLY) ====================
adminRouter.get("/backups", async (req: AuthenticatedRequest, res) => {
  if (!(await authorize(req, res, { requireAdmin: true }))) return;
  try {
    const backups = await listDatabaseBackups();
    return res.json({ success: true, backups });
  } catch (error: any) {
    console.error("[Admin Backups List Error]:", error);
    return res.status(500).json({ error: "Yedekler listelenemedi." });
  }
});

adminRouter.post("/backups/create", async (req: AuthenticatedRequest, res) => {
  if (!(await authorize(req, res, { requireAdmin: true }))) return;
  try {
    const note = req.body?.note || "Yönetici paneli üzerinden manuel alındı";
    const backup = await createDatabaseBackup("MANUAL", note);
    return res.json({
      success: true,
      message: `Veritabanı yedeği başarıyla oluşturuldu: ${backup.filename}`,
      backup,
    });
  } catch (error: any) {
    console.error("[Admin Backup Create Error]:", error);
    return res.status(500).json({ error: error?.message || "Yedek alınamadı." });
  }
});

adminRouter.post("/backups/restore", async (req: AuthenticatedRequest, res) => {
  if (!(await authorize(req, res, { requireAdmin: true }))) return;
  try {
    const { filename } = req.body || {};
    if (!filename) {
      return res.status(400).json({ error: "Geri yüklenecek yedek dosya adı belirtilmelidir." });
    }

    const result = await restoreDatabaseBackup(filename);
    return res.json(result);
  } catch (error: any) {
    console.error("[Admin Backup Restore Error]:", error);
    return res.status(500).json({ error: error?.message || "Geri yükleme başarısız." });
  }
});

adminRouter.get("/backups/download/:filename", async (req: AuthenticatedRequest, res) => {
  if (!(await authorize(req, res, { requireAdmin: true }))) return;
  try {
    const target = path.basename(String(req.params.filename));
    const absPath = path.join(backupsDir, target);

    if (!fs.existsSync(absPath)) {
      return res.status(404).json({ error: "Yedek dosyası sunucuda bulunamadı." });
    }

    res.download(absPath, target);
  } catch (error: any) {
    console.error("[Admin Backup Download Error]:", error);
    return res.status(500).json({ error: "Dosya indirilemedi." });
  }
});

// ==================== 8. SMTP TEST & SAĞLIK ====================
adminRouter.get("/smtp-status", async (req: AuthenticatedRequest, res) => {
  if (!(await authorize(req, res))) return;
  const status = await verifySmtp();
  return res.json({
    success: status.ok,
    status,
    config: {
      smtpHost: process.env.SMTP_HOST || "smtp.gmail.com",
      smtpPort: process.env.SMTP_PORT || 465,
      smtpUser: process.env.SMTP_USER || "Tanımsız",
      contactReceiver: process.env.CONTACT_RECEIVER || "kadir.kaya@kayapermit.com",
    },
  });
});

adminRouter.post("/test-email", async (req: AuthenticatedRequest, res) => {
  if (!(await authorize(req, res))) return;
  const targetEmail = req.body?.targetEmail || process.env.CONTACT_RECEIVER;
  const result = await sendTestEmail(targetEmail);
  return res.json(result);
});
