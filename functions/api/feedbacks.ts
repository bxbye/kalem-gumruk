const DEFAULT_FEEDBACKS = [
  {
    id: "fb-1",
    fullName: "Mehmet Yılmaz",
    company: "Atlas Dış Ticaret A.Ş.",
    rating: 5,
    serviceType: "İthalat Gümrükleme",
    comment: "1997 yılından beri çalıştığımız tek gümrük müşavirliği. Dijital arşivleme ve Evrim sistemi takipleri hızımıza hız katıyor.",
    createdAt: new Date().toISOString(),
  },
  {
    id: "fb-2",
    fullName: "Elena Petrova",
    company: "Global Logistics Group",
    rating: 5,
    serviceType: "Transit ve Antrepo",
    comment: "Ambarlı ve Erenköy operasyonlarımızda gümrük süreçlerimiz sıfır gecikmeyle sonuçlanıyor. Profesyonel kadroya teşekkürler.",
    createdAt: new Date().toISOString(),
  },
  {
    id: "fb-3",
    fullName: "Ahmet Demir",
    company: "Demir Otomotiv Yan Sanayi",
    rating: 5,
    serviceType: "Dahilde İşleme Rejimi",
    comment: "DİR izin süre uzatımları ve mevzuat tebliğlerindeki hızlı bilgilendirmeleri sayesinde maliyet avantajı sağladık.",
    createdAt: new Date().toISOString(),
  },
];

export async function onRequestGet() {
  return new Response(
    JSON.stringify({
      success: true,
      feedbacks: DEFAULT_FEEDBACKS,
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    }
  );
}

export async function onRequestPost({ request }: { request: Request }) {
  try {
    const body = (await request.json()) as any;
    const { fullName, rating, comment } = body || {};

    if (!fullName || !rating || !comment) {
      return new Response(
        JSON.stringify({ error: "Lütfen adınızı, puanınızı ve yorumunuzu belirtiniz." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Değerlendirmeniz alındı. Geri bildiriminiz için teşekkür ederiz!",
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
      JSON.stringify({ error: "Yorum kaydedilemedi." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
