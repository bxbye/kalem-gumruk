import { NextResponse } from "next/server";
import { db } from "@/db";
import { references } from "@/db/schema";
import { eq, asc } from "drizzle-orm";

// GET: Tüm Referansları Listele
export async function GET() {
  try {
    const items = db
      .select()
      .from(references)
      .orderBy(asc(references.orderIndex))
      .all();
    return NextResponse.json({ success: true, items });
  } catch (error) {
    console.error("References GET error:", error);
    return NextResponse.json(
      { success: false, error: "Referanslar alınamadı." },
      { status: 500 }
    );
  }
}

// POST: Yeni Referans Ekle veya Güncelle
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      password,
      id,
      name,
      sector,
      description,
      logoUrl,
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

    if (!name || !sector) {
      return NextResponse.json(
        { success: false, error: "Referans firma adı ve sektör zorunludur." },
        { status: 400 }
      );
    }

    const refId = id || `ref-${Date.now()}-${Math.random().toString(36).substring(7)}`;

    db.insert(references)
      .values({
        id: refId,
        name,
        sector,
        description: description || "",
        logoUrl: logoUrl || "",
        orderIndex: Number(orderIndex) || 0,
        isActive: isActive !== undefined ? Boolean(isActive) : true,
      })
      .onConflictDoUpdate({
        target: references.id,
        set: {
          name,
          sector,
          description: description || "",
          logoUrl: logoUrl || "",
          orderIndex: Number(orderIndex) || 0,
          isActive: isActive !== undefined ? Boolean(isActive) : true,
        },
      })
      .run();

    return NextResponse.json({
      success: true,
      message: "Referans başarıyla kaydedildi.",
      id: refId,
    });
  } catch (error) {
    console.error("References POST error:", error);
    return NextResponse.json(
      { success: false, error: "Referans kaydedilirken hata oluştu." },
      { status: 500 }
    );
  }
}

// DELETE: Referansı Sil
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
        { success: false, error: "Referans ID zorunludur." },
        { status: 400 }
      );
    }

    db.delete(references)
      .where(eq(references.id, id))
      .run();

    return NextResponse.json({
      success: true,
      message: "Referans başarıyla silindi.",
    });
  } catch (error) {
    console.error("References DELETE error:", error);
    return NextResponse.json(
      { success: false, error: "Referans silinirken hata oluştu." },
      { status: 500 }
    );
  }
}
