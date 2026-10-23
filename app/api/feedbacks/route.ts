import { NextResponse } from "next/server";
import { db } from "@/db";
import { customerFeedbacks } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

// Yorumları Listele
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const approvedOnly = searchParams.get("approvedOnly") === "true";

    let query = db.select().from(customerFeedbacks);
    if (approvedOnly) {
      // @ts-ignore
      query = query.where(eq(customerFeedbacks.isApproved, true));
    }

    const feedbacks = await query.orderBy(desc(customerFeedbacks.createdAt)).all();
    return NextResponse.json({ success: true, feedbacks });
  } catch (error) {
    console.error("Yorum listeleme hatası:", error);
    return NextResponse.json({ error: "Yorumlar alınamadı." }, { status: 500 });
  }
}

// Yeni Yorum Gönder (Müşteri)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fullName, company, rating, serviceType, comment } = body;

    if (!fullName || !rating || !comment) {
      return NextResponse.json({ error: "Lütfen adınızı, puanınızı ve yorumunuzu belirtiniz." }, { status: 400 });
    }

    const newId = `fb-${Date.now()}`;
    await db.insert(customerFeedbacks).values({
      id: newId,
      fullName: fullName.trim(),
      company: company ? company.trim() : null,
      rating: Number(rating) || 5,
      serviceType: serviceType || "Genel Hizmet",
      comment: comment.trim(),
      isApproved: false, // Yönetici onayına düşer
      createdAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      message: "Değerlendirmeniz alındı. Geri bildiriminiz için teşekkür ederiz!",
    });
  } catch (error) {
    console.error("Yorum gönderme hatası:", error);
    return NextResponse.json({ error: "Yorum kaydedilemedi." }, { status: 500 });
  }
}

// Yorum Onayla / Reddet (Admin)
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { password, id, isApproved } = body;

    const validPassword = process.env.ADMIN_PASSWORD || "kalem1997";
    if (password !== validPassword) {
      return NextResponse.json({ error: "Yetkisiz işlem: Geçersiz şifre." }, { status: 401 });
    }

    if (!id) {
      return NextResponse.json({ error: "ID belirtilmelidir." }, { status: 400 });
    }

    await db.update(customerFeedbacks).set({ isApproved: Boolean(isApproved) }).where(eq(customerFeedbacks.id, id));

    return NextResponse.json({ success: true, message: "Yorum durumu güncellendi." });
  } catch (error) {
    console.error("Yorum güncelleme hatası:", error);
    return NextResponse.json({ error: "Güncelleme başarısız." }, { status: 500 });
  }
}

// Yorum Sil
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
      return NextResponse.json({ error: "ID belirtilmelidir." }, { status: 400 });
    }

    await db.delete(customerFeedbacks).where(eq(customerFeedbacks.id, id));
    return NextResponse.json({ success: true, message: "Yorum silindi." });
  } catch (error) {
    console.error("Yorum silme hatası:", error);
    return NextResponse.json({ error: "Silme işlemi başarısız." }, { status: 500 });
  }
}
