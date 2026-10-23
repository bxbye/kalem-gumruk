import { NextResponse } from "next/server";
import { db } from "@/db";
import { documents } from "@/db/schema";
import { eq, desc, sql } from "drizzle-orm";

// Belgeleri Listele
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    let query = db.select().from(documents);
    if (category) {
      // @ts-ignore
      query = query.where(eq(documents.category, category));
    }

    const docList = await query.orderBy(desc(documents.createdAt)).all();
    return NextResponse.json({ success: true, documents: docList });
  } catch (error) {
    console.error("Belge listeleme hatası:", error);
    return NextResponse.json({ error: "Belgeler alınamadı." }, { status: 500 });
  }
}

// Yeni Belge / Sertifika Ekle (Admin)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { password, title, description, category, fileUrl, fileKey, fileSize, fileType, isPublic } = body;

    const validPassword = process.env.ADMIN_PASSWORD || "kalem1997";
    if (password !== validPassword) {
      return NextResponse.json({ error: "Yetkisiz işlem: Geçersiz şifre." }, { status: 401 });
    }

    if (!title || !category || !fileUrl) {
      return NextResponse.json({ error: "Lütfen başlık, kategori ve dosya bağlantısını eksiksiz giriniz." }, { status: 400 });
    }

    const newId = `doc-${Date.now()}`;
    await db.insert(documents).values({
      id: newId,
      title: title.trim(),
      description: description ? description.trim() : null,
      category,
      fileUrl,
      fileKey: fileKey || null,
      fileSize: fileSize || "1.0 MB",
      fileType: fileType || "pdf",
      downloadCount: 0,
      isPublic: isPublic !== undefined ? Boolean(isPublic) : true,
      createdAt: new Date(),
    });

    return NextResponse.json({ success: true, message: "Belge başarıyla yüklendi." });
  } catch (error) {
    console.error("Belge ekleme hatası:", error);
    return NextResponse.json({ error: "Belge eklenemedi." }, { status: 500 });
  }
}

// İndirme Sayısını Artır
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: "Belge ID belirtilmelidir." }, { status: 400 });
    }

    await db
      .update(documents)
      .set({ downloadCount: sql`${documents.downloadCount} + 1` })
      .where(eq(documents.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Sayaç artırma hatası:", error);
    return NextResponse.json({ error: "Hata" }, { status: 500 });
  }
}

// Belge Sil
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const password = searchParams.get("password");

    const validPassword = process.env.ADMIN_PASSWORD || "kalem1997";
    if (password !== validPassword) {
      return NextResponse.json({ error: "Yetkisiz işlem." }, { status: 401 });
    }

    if (!id) {
      return NextResponse.json({ error: "Belge ID belirtilmelidir." }, { status: 400 });
    }

    await db.delete(documents).where(eq(documents.id, id));
    return NextResponse.json({ success: true, message: "Belge silindi." });
  } catch (error) {
    console.error("Belge silme hatası:", error);
    return NextResponse.json({ error: "Belge silinemedi." }, { status: 500 });
  }
}
