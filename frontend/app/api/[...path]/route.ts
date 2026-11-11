import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getBackendBaseUrl } from "@/lib/api";

export const dynamic = "force-dynamic";

function shouldRevalidateAppCache(method: string, targetPath: string): boolean {
  if (method === "GET" || method === "HEAD" || method === "OPTIONS") return false;

  // Belgeler ekleme/silme
  if (targetPath === "documents" && (method === "POST" || method === "DELETE")) return true;
  // Müşteri yorumu onaylama/gizleme/silme
  if (targetPath === "feedbacks" && (method === "PATCH" || method === "PUT" || method === "DELETE")) return true;
  // Form şablonu kaydetme/silme/durum değiştirme
  if (targetPath === "forms" && method === "POST") return true;
  if (targetPath.startsWith("forms/") && (method === "DELETE" || method === "PATCH")) return true;
  // Admin CMS mutasyonları (sirküler, hizmetler, bağlantılar, referanslar, ayarlar, yedek geri yükleme)
  if (
    targetPath.startsWith("admin/") &&
    targetPath !== "admin/login" &&
    targetPath !== "admin/test-email" &&
    targetPath !== "admin/backups/create"
  ) {
    return true;
  }

  return false;
}

async function proxyRequest(
  req: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path } = await context.params;
  const targetPath = (path || []).join("/");
  const url = new URL(req.url);
  const backendUrl = getBackendBaseUrl();
  const targetUrl = `${backendUrl}/api/${targetPath}${url.search}`;

  try {
    const headers = new Headers();
    req.headers.forEach((value, key) => {
      const lower = key.toLowerCase();
      if (lower !== "host" && lower !== "connection" && lower !== "content-length") {
        headers.set(key, value);
      }
    });

    const body =
      req.method !== "GET" && req.method !== "HEAD"
        ? await req.arrayBuffer()
        : undefined;

    const backendRes = await fetch(targetUrl, {
      method: req.method,
      headers,
      body,
      cache: "no-store",
    });

    const responseBody = await backendRes.arrayBuffer();
    const resHeaders = new Headers();
    backendRes.headers.forEach((value, key) => {
      const lower = key.toLowerCase();
      if (lower !== "content-encoding" && lower !== "transfer-encoding") {
        resHeaders.set(key, value);
      }
    });

    // Açıkça public cache belirtilmeyen tüm API yanıtlarında proxy/tarayıcı cache'ini devre dışı bırak
    const cacheControl = resHeaders.get("cache-control") || "";
    if (!cacheControl.includes("public")) {
      resHeaders.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
      resHeaders.set("Pragma", "no-cache");
      resHeaders.set("Expires", "0");
    }

    if (backendRes.ok && shouldRevalidateAppCache(req.method, targetPath)) {
      try {
        revalidatePath("/", "layout");
      } catch (revalErr) {
        console.warn("[API Proxy Revalidate Warning]:", revalErr);
      }
    }

    return new NextResponse(responseBody, {
      status: backendRes.status,
      headers: resHeaders,
    });
  } catch (err: any) {
    console.error(`[API Proxy Error] -> ${targetUrl}:`, err);
    return NextResponse.json(
      {
        success: false,
        error: "API sunucusuna erişilemedi: " + (err?.message || "Bilinmeyen hata"),
      },
      { status: 502 }
    );
  }
}

export const GET = proxyRequest;
export const POST = proxyRequest;
export const PUT = proxyRequest;
export const PATCH = proxyRequest;
export const DELETE = proxyRequest;
export const OPTIONS = proxyRequest;
