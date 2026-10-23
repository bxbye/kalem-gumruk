import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "Lütfen bir dosya seçiniz." }, { status: 400 });
    }

    // Dosya boyutu sınırı (Maks 15MB)
    const MAX_SIZE = 15 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "Dosya boyutu en fazla 15MB olabilir." }, { status: 400 });
    }

    // Güvenli dosya adı ve uzantı
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const originalName = file.name;
    const ext = path.extname(originalName).toLowerCase();
    const allowedExts = [".pdf", ".doc", ".docx", ".jpg", ".jpeg", ".png", ".webp", ".xlsx", ".zip"];
    if (!allowedExts.includes(ext)) {
      return NextResponse.json(
        { error: `Geçersiz dosya uzantısı (${ext}). Yalnızca PDF, Word, Excel ve Resim dosyaları desteklenir.` },
        { status: 400 }
      );
    }

    const cleanBaseName = path
      .basename(originalName, ext)
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, "-")
      .slice(0, 40);

    const fileName = `${cleanBaseName}-${Date.now()}${ext}`;

    // Cloudflare R2 veya Yerel Depolama (public/uploads)
    // Cloudflare R2 bilgileri tanımlıysa oraya, değilse yerel public klasörüne kaydeder
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, fileName);
    fs.writeFileSync(filePath, buffer);

    const fileUrl = `/uploads/${fileName}`;

    return NextResponse.json({
      success: true,
      file: {
        name: originalName,
        url: fileUrl,
        key: fileName,
        size: formatBytes(file.size),
        type: file.type || ext.replace(".", ""),
      },
    });
  } catch (error) {
    console.error("Dosya yükleme hatası:", error);
    return NextResponse.json(
      { error: "Dosya yüklenirken bir hata oluştu." },
      { status: 500 }
    );
  }
}

function formatBytes(bytes: number, decimals = 1) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}
