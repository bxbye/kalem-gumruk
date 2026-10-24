const DEFAULT_DOCUMENTS = [
  {
    id: "doc-1",
    title: "Gümrük Müşavirliği İzin Belgesi",
    description: "T.C. Ticaret Bakanlığı yetkili gümrük müşavirliği resmi izin belgemiz.",
    category: "legal",
    fileUrl: "/documents/gumruk-musavirligi-izin-belgesi.pdf",
    fileSize: "148 KB",
    fileType: "pdf",
    downloadCount: 245,
    createdAt: "2026-01-15T00:00:00.000Z",
  },
  {
    id: "doc-2",
    title: "ISO 9001:2015 Kalite Yönetim Sertifikası",
    description: "Tüm operasyonel gümrükleme ve danışmanlık hizmetlerimizin uluslararası kalite tescili.",
    category: "quality",
    fileUrl: "/documents/kalem-iso-9001-belgesi.pdf",
    fileSize: "148 KB",
    fileType: "pdf",
    downloadCount: 182,
    createdAt: "2026-02-10T00:00:00.000Z",
  },
  {
    id: "doc-3",
    title: "Gümrük İş Talimat ve Başvuru Formu",
    description: "İthalat, ihracat ve antrepo işlemleri öncesinde doldurulması gereken resmi talimat formu.",
    category: "forms",
    fileUrl: "/documents/gumruk-is-talimat-formu.pdf",
    fileSize: "148 KB",
    fileType: "pdf",
    downloadCount: 310,
    createdAt: "2026-03-01T00:00:00.000Z",
  },
  {
    id: "doc-4",
    title: "Gümrük Vekaletname Örneği",
    description: "Noter kanalıyla firmamız adına düzenlenecek gümrük müşavirliği vekaletname taslağı.",
    category: "legal",
    fileUrl: "/documents/kalem-gumruk-vekaletname-ornegi.pdf",
    fileSize: "148 KB",
    fileType: "pdf",
    downloadCount: 428,
    createdAt: "2026-03-15T00:00:00.000Z",
  },
  {
    id: "doc-5",
    title: "Dış Ticaret ve Gümrükleme Süreçleri Rehberi",
    description: "İthalat ve ihracatta mevzuat adımları, GTİP tespit rehberi ve masraf kalemleri özeti.",
    category: "guides",
    fileUrl: "/documents/gumruk-surecleri-rehberi.pdf",
    fileSize: "148 KB",
    fileType: "pdf",
    downloadCount: 560,
    createdAt: "2026-04-01T00:00:00.000Z",
  },
];

export async function onRequestGet({ request }: { request: Request }) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");

  let list = DEFAULT_DOCUMENTS;
  if (category) {
    list = list.filter((d) => d.category === category);
  }

  return new Response(
    JSON.stringify({
      success: true,
      documents: list,
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
  return new Response(
    JSON.stringify({ success: true, message: "İşlem başarılı." }),
    {
      status: 200,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    }
  );
}
