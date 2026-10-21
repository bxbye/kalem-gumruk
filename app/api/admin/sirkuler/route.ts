import { NextResponse } from "next/server";
import { saveSirkuler } from "@/lib/sirkuler";
import { revalidatePath } from "next/cache";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { password, title, category, summary, content, sourceUrl } = body;

    // Yönetici Şifre Kontrolü (Varsayılan: kalem1997, ortam değişkeniyle değiştirilebilir)
    const validPassword = process.env.ADMIN_PASSWORD || "kalem1997";
    if (password !== validPassword) {
      return NextResponse.json(
        { error: "Geçersiz yönetici şifresi. Lütfen doğru şifreyi giriniz." },
        { status: 401 }
      );
    }

    if (!title || !content) {
      return NextResponse.json(
        { error: "Lütfen başlık ve mevzuat içeriğini doldurunuz." },
        { status: 400 }
      );
    }

    const newItem = saveSirkuler({
      title: title.trim(),
      category: category || "Genel Mevzuat",
      date: new Date().toISOString().split("T")[0],
      summary: summary ? summary.trim() : content.slice(0, 160).trim() + "...",
      content: content.trim(),
      sourceUrl: sourceUrl ? sourceUrl.trim() : undefined,
    });

    // Önbellekleri tazele
    revalidatePath("/");
    revalidatePath("/sirkuler");

    return NextResponse.json({
      success: true,
      message: "Sirküler başarıyla web sitesinde yayımlandı!",
      item: newItem,
    });
  } catch (error) {
    console.error("Sirküler kaydetme hatası:", error);
    return NextResponse.json(
      { error: "Kayıt sırasında bir hata oluştu." },
      { status: 500 }
    );
  }
}
