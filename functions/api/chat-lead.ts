export async function onRequestPost({ request }: { request: Request }) {
  try {
    const body = (await request.json()) as any;
    const { contactInfo, question } = body || {};

    if (!contactInfo || !question) {
      return new Response(
        JSON.stringify({ error: "İletişim bilgisi veya soru eksik." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Talebiniz kaydedildi. Uzman gümrük müşavirimiz en kısa sürede iletişime geçecektir.",
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  } catch {
    return new Response(
      JSON.stringify({ error: "İşlem sırasında bir hata oluştu." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
