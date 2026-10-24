import { NextResponse } from "next/server";
import { db } from "@/db";
import { siteSettings } from "@/db/schema";
import fs from "fs";
import path from "path";

// GET: Tüm Site Ayarlarını Getir
export async function GET() {
  try {
    const rows = db.select().from(siteSettings).all();
    const settings: Record<string, string> = {};
    rows.forEach((r) => {
      settings[r.key] = r.value;
    });
    return NextResponse.json({ success: true, settings });
  } catch (error) {
    console.error("Settings GET error:", error);
    return NextResponse.json(
      { success: false, error: "Ayarlar alınırken hata oluştu." },
      { status: 500 }
    );
  }
}

// POST: Site Ayarlarını Güncelle
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { password, settings } = body;

    const validPassword = process.env.ADMIN_PASSWORD || "kalem1997";
    if (password !== validPassword) {
      return NextResponse.json(
        { success: false, error: "Yetkisiz erişim. Yönetici şifresi geçersiz." },
        { status: 401 }
      );
    }

    if (!settings || typeof settings !== "object") {
      return NextResponse.json(
        { success: false, error: "Geçersiz ayar verisi." },
        { status: 400 }
      );
    }

    const now = new Date();

    // 1. SQLite Veritabanını Güncelle
    for (const [key, value] of Object.entries(settings)) {
      const stringValue = typeof value === "object" ? JSON.stringify(value) : String(value ?? "");
      db.insert(siteSettings)
        .values({
          key,
          value: stringValue,
          updatedAt: now,
        })
        .onConflictDoUpdate({
          target: siteSettings.key,
          set: {
            value: stringValue,
            updatedAt: now,
          },
        })
        .run();
    }

    // 2. data/company.ts Dosyasını Senkronize Et
    try {
      const companyTsPath = path.join(process.cwd(), "data", "company.ts");
      let activeCustomsParsed = [];
      let statsParsed = [];
      try {
        activeCustomsParsed = typeof settings.activeCustoms === "string" 
          ? JSON.parse(settings.activeCustoms) 
          : (settings.activeCustoms || []);
      } catch {
        activeCustomsParsed = [];
      }
      try {
        statsParsed = typeof settings.stats === "string"
          ? JSON.parse(settings.stats)
          : (settings.stats || []);
      } catch {
        statsParsed = [];
      }

      const fileContent = `export const companyInfo = {
  name: ${JSON.stringify(settings.name || "Kalem Gümrük Müşavirliği Ltd. Şti.")},
  shortName: ${JSON.stringify(settings.shortName || "Kalem Gümrük")},
  foundedYear: ${Number(settings.foundedYear) || 1997},
  experienceYears: new Date().getFullYear() - ${Number(settings.foundedYear) || 1997},
  slogan: ${JSON.stringify(settings.slogan || "1997'den Bugüne Güven, Hız ve Mevzuata Tam Uyum")},
  description: ${JSON.stringify(settings.description || "")},
  address: ${JSON.stringify(settings.address || "")},
  phone: ${JSON.stringify(settings.phone || "")},
  phoneRaw: ${JSON.stringify(settings.phoneRaw || "")},
  whatsapp: ${JSON.stringify(settings.whatsapp || "")},
  whatsappDefaultMessage: ${JSON.stringify(settings.whatsappDefaultMessage || "")},
  email: ${JSON.stringify(settings.email || "")},
  evrimPortalUrl: ${JSON.stringify(settings.evrimPortalUrl || "https://webgumruk.com")},
  workingHours: ${JSON.stringify(settings.workingHours || "")},
  activeCustoms: ${JSON.stringify(activeCustomsParsed, null, 4)},
  stats: ${JSON.stringify(statsParsed, null, 4)},
};
`;
      fs.writeFileSync(companyTsPath, fileContent, "utf-8");
    } catch (fsErr) {
      console.warn("company.ts dosya senkronizasyon uyarısı:", fsErr);
    }

    return NextResponse.json({
      success: true,
      message: "Firma ve site ayarları başarıyla güncellendi.",
    });
  } catch (error) {
    console.error("Settings POST error:", error);
    return NextResponse.json(
      { success: false, error: "Ayarlar güncellenirken bir hata oluştu." },
      { status: 500 }
    );
  }
}
