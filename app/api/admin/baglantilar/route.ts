import { NextResponse } from "next/server";
import { db } from "@/db";
import { gerekliBaglantilar } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import fs from "fs";
import path from "path";

// Bağlantılar doğrudan lib/baglantilar.ts üzerinden SQLite veritabanından çekilir
function syncBaglantilarFile() {
  // No-op: Data is dynamic from SQLite database
}

// GET: Tüm Bağlantıları Listele
export async function GET() {
  try {
    const items = db
      .select()
      .from(gerekliBaglantilar)
      .orderBy(asc(gerekliBaglantilar.orderIndex))
      .all();
    return NextResponse.json({ success: true, items });
  } catch (error) {
    console.error("Baglantilar GET error:", error);
    return NextResponse.json(
      { success: false, error: "Bağlantılar alınamadı." },
      { status: 500 }
    );
  }
}

// POST: Yeni Bağlantı Ekle veya Güncelle
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      password,
      id,
      title,
      shortTitle,
      category,
      url,
      image,
      description,
      tag,
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

    if (!title || !url) {
      return NextResponse.json(
        { success: false, error: "Başlık ve URL zorunludur." },
        { status: 400 }
      );
    }

    const itemId =
      id ||
      `link-${Date.now()}-${Math.random().toString(36).substring(7)}`;

    db.insert(gerekliBaglantilar)
      .values({
        id: itemId,
        title,
        shortTitle: shortTitle || title,
        category: category || "Resmi Sistemler",
        url,
        image: image || "/images/baglantilar/beyanname-sorgulama.png",
        description: description || "",
        tag: tag || "Sistem",
        orderIndex: Number(orderIndex) || 0,
        isActive: isActive !== undefined ? Boolean(isActive) : true,
      })
      .onConflictDoUpdate({
        target: gerekliBaglantilar.id,
        set: {
          title,
          shortTitle: shortTitle || title,
          category: category || "Resmi Sistemler",
          url,
          image: image || "/images/baglantilar/beyanname-sorgulama.png",
          description: description || "",
          tag: tag || "Sistem",
          orderIndex: Number(orderIndex) || 0,
          isActive: isActive !== undefined ? Boolean(isActive) : true,
        },
      })
      .run();

    syncBaglantilarFile();

    return NextResponse.json({
      success: true,
      message: "Bağlantı başarıyla kaydedildi.",
      id: itemId,
    });
  } catch (error) {
    console.error("Baglantilar POST error:", error);
    return NextResponse.json(
      { success: false, error: "Bağlantı kaydedilirken hata oluştu." },
      { status: 500 }
    );
  }
}

// DELETE: Bağlantıyı Sil
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
        { success: false, error: "Bağlantı ID zorunludur." },
        { status: 400 }
      );
    }

    db.delete(gerekliBaglantilar)
      .where(eq(gerekliBaglantilar.id, id))
      .run();

    syncBaglantilarFile();

    return NextResponse.json({
      success: true,
      message: "Bağlantı başarıyla silindi.",
    });
  } catch (error) {
    console.error("Baglantilar DELETE error:", error);
    return NextResponse.json(
      { success: false, error: "Bağlantı silinirken hata oluştu." },
      { status: 500 }
    );
  }
}
