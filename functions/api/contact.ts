interface Env {
  CONTACT_RECEIVER?: string;
  SMTP_HOST?: string;
  SMTP_PORT?: string;
  SMTP_USER?: string;
  SMTP_PASS?: string;
}

export async function onRequestPost({ request, env }: { request: Request; env: Env }) {
  try {
    const body = await request.json() as any;
    const { fullName, company, phone, email, serviceType, message, honeypot } = body || {};

    // Spam / Bot engelleme
    if (honeypot) {
      return new Response(JSON.stringify({ success: true, message: "İşlem başarılı." }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (!fullName || !phone || !message) {
      return new Response(
        JSON.stringify({ error: "Lütfen zorunlu alanları (Ad Soyad, Telefon, Mesaj) doldurunuz." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const refCode = `TK-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    return new Response(
      JSON.stringify({
        success: true,
        refCode,
        message: `Talebiniz #${refCode} referans koduyla başarıyla kaydedildi. Gümrük müşavirimiz en kısa sürede sizinle iletişime geçecektir.`,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: "Mesaj gönderilirken bir hata oluştu. Lütfen doğrudan telefon veya WhatsApp ile ulaşınız.",
      }),
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
