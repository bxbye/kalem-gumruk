import { NextResponse } from "next/server";
import { saveSirkuler, getAllSirkuler } from "@/lib/sirkuler";
import { revalidatePath } from "next/cache";

export async function GET() {
  try {
    const all = getAllSirkuler();
    return NextResponse.json({ success: true, sirkuler: all });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Sirkülerler alınamadı." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      password,
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
    } = body;

    // Yönetici Şifre Kontrolü
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
      regulationType: regulationType ? regulationType.trim() : "Gümrük Tebliği",
      officialGazetteNumber: officialGazetteNumber ? officialGazetteNumber.trim() : undefined,
      relatedGtip: relatedGtip ? relatedGtip.trim() : undefined,
      date: new Date().toISOString().split("T")[0],
      summary: summary ? summary.trim() : content.slice(0, 160).trim() + "...",
      content: content.trim(),
      expertNote: expertNote ? expertNote.trim() : undefined,
      sourceUrl: sourceUrl ? sourceUrl.trim() : undefined,
      pdfUrl: pdfUrl ? pdfUrl.trim() : undefined,
      author: "Kalem Gümrük Mevzuat Kurulu",
    });

    // Önbellekleri anında tazele (SSG / ISR)
    revalidatePath("/");
    revalidatePath("/sirkuler");
    revalidatePath(`/sirkuler/${newItem.slug}`);

    return NextResponse.json({
      success: true,
      message: "Mevzuat sirküleri başarıyla web sitesinde yayımlandı!",
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
