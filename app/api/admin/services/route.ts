import { NextResponse } from "next/server";
import { db } from "@/db";
import { services } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import fs from "fs";
import path from "path";

// Services are directly fetched from database via lib/services.ts
function syncServicesFile() {
  // No-op: Data is dynamic from SQLite database
}

// GET: Tüm Hizmetleri Listele
export async function GET() {
  try {
    const items = db
      .select()
      .from(services)
      .orderBy(asc(services.orderIndex))
      .all();
    return NextResponse.json({ success: true, items });
  } catch (error) {
    console.error("Services GET error:", error);
    return NextResponse.json(
      { success: false, error: "Hizmetler alınamadı." },
      { status: 500 }
    );
  }
}

// POST: Yeni Hizmet Ekle veya Güncelle
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      password,
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
    } = body;

    const validPassword = process.env.ADMIN_PASSWORD || "kalem1997";
    if (password !== validPassword) {
      return NextResponse.json(
        { success: false, error: "Yetkisiz erişim. Yönetici şifresi geçersiz." },
        { status: 401 }
      );
    }

    if (!title || !slug) {
      return NextResponse.json(
        { success: false, error: "Başlık ve slug zorunludur." },
        { status: 400 }
      );
    }

    const serviceId = id || `service-${slug}`;
    const featuresJson = typeof features === "string" ? features : JSON.stringify(features || []);

    db.insert(services)
      .values({
        id: serviceId,
        slug,
        title,
        shortDesc: shortDesc || "",
        iconName: iconName || "ArrowDownToLine",
        category: category || "gumruk",
        features: featuresJson,
        detailedContent: detailedContent || "",
        orderIndex: Number(orderIndex) || 0,
        isActive: isActive !== undefined ? Boolean(isActive) : true,
      })
      .onConflictDoUpdate({
        target: services.slug,
        set: {
          title,
          shortDesc: shortDesc || "",
          iconName: iconName || "ArrowDownToLine",
          category: category || "gumruk",
          features: featuresJson,
          detailedContent: detailedContent || "",
          orderIndex: Number(orderIndex) || 0,
          isActive: isActive !== undefined ? Boolean(isActive) : true,
        },
      })
      .run();

    syncServicesFile();

    return NextResponse.json({
      success: true,
      message: "Hizmet başarıyla kaydedildi.",
      id: serviceId,
    });
  } catch (error) {
    console.error("Services POST error:", error);
    return NextResponse.json(
      { success: false, error: "Hizmet kaydedilirken hata oluştu." },
      { status: 500 }
    );
  }
}

// DELETE: Hizmeti Sil
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const password = searchParams.get("password");

    const validPassword = process.env.ADMIN_PASSWORD || "kalem1997";
    if (password !== validPassword) {
      return NextResponse.json(
        { success: false, error: "Yetkisiz işlem." },
        { status: 401 }
      );
    }

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Hizmet ID zorunludur." },
        { status: 400 }
      );
    }

    db.delete(services)
      .where(eq(services.id, id))
      .run();

    syncServicesFile();

    return NextResponse.json({
      success: true,
      message: "Hizmet başarıyla silindi.",
    });
  } catch (error) {
    console.error("Services DELETE error:", error);
    return NextResponse.json(
      { success: false, error: "Hizmet silinirken hata oluştu." },
      { status: 500 }
    );
  }
}
