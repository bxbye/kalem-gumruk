import { NextResponse } from "next/server";
import { db } from "@/db";
import { forms } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

// Tüm form tanımlarını getir
export async function GET() {
  try {
    const allForms = await db.select().from(forms).orderBy(desc(forms.createdAt));
    const parsed = allForms.map((f) => ({
      ...f,
      fields: JSON.parse(f.fields),
      settings: JSON.parse(f.settings),
    }));
    return NextResponse.json({ success: true, forms: parsed });
  } catch (error) {
    console.error("Form listeleme hatası:", error);
    return NextResponse.json({ error: "Formlar alınamadı." }, { status: 500 });
  }
}

// Yeni Form Oluştur (Admin Form Builder)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { password, title, slug, description, category, fields, settings } = body;

    const validPassword = process.env.ADMIN_PASSWORD || "kalem1997";
    if (password !== validPassword) {
      return NextResponse.json({ error: "Yetkisiz işlem: Geçersiz şifre." }, { status: 401 });
    }

    if (!title || !slug || !fields) {
      return NextResponse.json({ error: "Lütfen form başlığı, URL uzantısı (slug) ve alanları doldurunuz." }, { status: 400 });
    }

    const cleanSlug = slug
      .toLowerCase()
      .replace(/ğ/g, "g")
      .replace(/ü/g, "u")
      .replace(/ş/g, "s")
      .replace(/ı/g, "i")
      .replace(/ö/g, "o")
      .replace(/ç/g, "c")
      .replace(/[^a-z0-9_-]+/g, "-");

    const newFormId = `form_${cleanSlug}_${Date.now()}`;
    const now = new Date();

    await db.insert(forms).values({
      id: newFormId,
      slug: cleanSlug,
      title: title.trim(),
      description: description ? description.trim() : null,
      category: category || "custom",
      fields: typeof fields === "string" ? fields : JSON.stringify(fields),
      settings: typeof settings === "string" ? settings : JSON.stringify(settings || {}),
      isActive: true,
      createdAt: now,
      updatedAt: now,
    });

    return NextResponse.json({
      success: true,
      message: "Yeni form başarıyla oluşturuldu.",
      slug: cleanSlug,
    });
  } catch (error: any) {
    console.error("Form oluşturma hatası:", error);
    if (error?.message?.includes("UNIQUE constraint failed")) {
      return NextResponse.json({ error: "Bu URL uzantısına (slug) sahip bir form zaten mevcut." }, { status: 409 });
    }
    return NextResponse.json({ error: "Form oluşturulurken bir hata oluştu." }, { status: 500 });
  }
}

// Form Güncelle (Mevcut formun alanlarını veya ayarlarını güncelleme)
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { password, slug, title, description, fields, settings, isActive } = body;

    const validPassword = process.env.ADMIN_PASSWORD || "kalem1997";
    if (password !== validPassword) {
      return NextResponse.json({ error: "Yetkisiz işlem: Geçersiz şifre." }, { status: 401 });
    }

    if (!slug) {
      return NextResponse.json({ error: "Güncellenecek form slug belirtilmelidir." }, { status: 400 });
    }

    const updatePayload: any = {
      updatedAt: new Date(),
    };

    if (title) updatePayload.title = title.trim();
    if (description !== undefined) updatePayload.description = description;
    if (fields) updatePayload.fields = typeof fields === "string" ? fields : JSON.stringify(fields);
    if (settings) updatePayload.settings = typeof settings === "string" ? settings : JSON.stringify(settings);
    if (isActive !== undefined) updatePayload.isActive = Boolean(isActive);

    await db.update(forms).set(updatePayload).where(eq(forms.slug, slug));

    return NextResponse.json({ success: true, message: "Form başarıyla güncellendi." });
  } catch (error) {
    console.error("Form güncelleme hatası:", error);
    return NextResponse.json({ error: "Form güncellenemedi." }, { status: 500 });
  }
}
