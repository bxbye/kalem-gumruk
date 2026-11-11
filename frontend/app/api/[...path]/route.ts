import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const BACKEND_URL = (
  process.env.BACKEND_INTERNAL_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://test-api.kalemgumruk.com"
).replace(/\/$/, "");

async function proxyRequest(
  req: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path } = await context.params;
  const targetPath = (path || []).join("/");
  const url = new URL(req.url);
  const targetUrl = `${BACKEND_URL}/api/${targetPath}${url.search}`;

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
