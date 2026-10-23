import { NextResponse } from "next/server";
import { db } from "@/db";
import { formSubmissions, forms } from "@/db/schema";
import { eq, desc, and } from "drizzle-orm";

// Form Yanıtlarını Listele (Admin CRM)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const formSlug = searchParams.get("formSlug");
    const status = searchParams.get("status");

    let query = db.select().from(formSubmissions);

    if (formSlug && status) {
      // @ts-ignore
      query = query.where(and(eq(formSubmissions.formSlug, formSlug), eq(formSubmissions.status, status)));
    } else if (formSlug) {
      // @ts-ignore
      query = query.where(eq(formSubmissions.formSlug, formSlug));
    } else if (status) {
      // @ts-ignore
      query = query.where(eq(formSubmissions.status, status));
    }

    const submissions = await query.orderBy(desc(formSubmissions.createdAt)).all();

    const formatted = submissions.map((sub) => ({
      ...sub,
      data: JSON.parse(sub.data || "{}"),
      files: JSON.parse(sub.files || "[]"),
    }));

    return NextResponse.json({ success: true, submissions: formatted });
  } catch (error) {
    console.error("Başvuru listeleme hatası:", error);
    return NextResponse.json({ error: "Kayıtlar listelenemedi." }, { status: 500 });
  }
}

// Durum Güncelle ve Yönetici Notu Ekle
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { password, id, status, adminNotes } = body;

    const validPassword = process.env.ADMIN_PASSWORD || "kalem1997";
    if (password !== validPassword) {
      return NextResponse.json({ error: "Yetkisiz işlem: Geçersiz şifre." }, { status: 401 });
    }

    if (!id) {
      return NextResponse.json({ error: "Kayıt ID belirtilmelidir." }, { status: 400 });
    }

    const updates: any = { updatedAt: new Date() };
    if (status) updates.status = status;
    if (adminNotes !== undefined) updates.adminNotes = adminNotes;

    await db.update(formSubmissions).set(updates).where(eq(formSubmissions.id, id));

    return NextResponse.json({ success: true, message: "Kayıt güncellendi." });
  } catch (error) {
    console.error("Kayıt güncelleme hatası:", error);
    return NextResponse.json({ error: "Güncelleme başarısız." }, { status: 500 });
  }
}

// Kayıt Sil
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
      return NextResponse.json({ error: "Silinecek ID belirtilmelidir." }, { status: 400 });
    }

    await db.delete(formSubmissions).where(eq(formSubmissions.id, id));
    return NextResponse.json({ success: true, message: "Kayıt silindi." });
  } catch (error) {
    console.error("Kayıt silme hatası:", error);
    return NextResponse.json({ error: "Silme işlemi başarısız." }, { status: 500 });
  }
}
