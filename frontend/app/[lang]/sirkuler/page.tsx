import type { Metadata } from "next";
import Link from "next/link";
import { getAllSirkulerAsync } from "@/lib/sirkuler";
import { Calendar, Tag, ArrowRight } from "lucide-react";
import { availableLanguages } from "@/data/translations";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return availableLanguages.map((l) => ({ lang: l.code }));
}

interface Props {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const isEn = lang === "en";
  const isAr = lang === "ar";
  const isEs = lang === "es";

  const title = isEn
    ? "Customs Legislation & Trade Circulars | Kalem Brokerage"
    : isAr
    ? "التشريعات والتعاميم الجمركية | قلم للتخليص الجمركي"
    : isEs
    ? "Legislación Aduanera y Circulares Comerciales | Kalem Aduanas"
    : "Gümrük Mevzuatı & Sirkülerler | Kalem Gümrük Müşavirliği";

  const description = isEn
    ? "Official gazette releases, customs communiqués, tariff modifications and foreign trade regulatory bulletins."
    : isAr
    ? "أحدث التعاميم والقرارات الجمركية المنشورة في الجريدة الرسمية وتعديلات التعريفة الجمركية والتجارة الخارجية."
    : isEs
    ? "Publicaciones del boletín oficial, comunicados aduaneros, modificaciones arancelarias y novedades regulatorias."
    : "Resmi Gazete'de yayımlanan güncel gümrük tebliğleri, vergi değişiklikleri ve dış ticaret mevzuat duyuruları.";

  return {
    title,
    description,
    alternates: {
      canonical: `/${lang}/sirkuler`,
      languages: {
        tr: "/tr/sirkuler",
        en: "/en/sirkuler",
        ar: "/ar/sirkuler",
        es: "/es/sirkuler",
        "x-default": "/tr/sirkuler",
      },
    },
    openGraph: {
      title,
      description,
      url: `https://kalemgumruk.com/${lang}/sirkuler`,
    },
  };
}

export default async function SirkulerListPage({ params }: Props) {
  const { lang } = await params;
  const items = await getAllSirkulerAsync(lang);

  const isEn = lang === "en";
  const isAr = lang === "ar";
  const isEs = lang === "es";

  const badgeText = isEn
    ? "Knowledge Center"
    : isAr
    ? "مركز المعرفة"
    : isEs
    ? "Centro de Conocimiento"
    : "Bilgi Merkezi";
  const mainTitle = isEn
    ? "Customs Legislation & Circulars"
    : isAr
    ? "التشريعات والتعاميم الجمركية"
    : isEs
    ? "Legislación Aduanera y Circulares"
    : "Gümrük Mevzuatı & Sirkülerler";
  const subTitle = isEn
    ? "Authoritative regulatory briefs, duty revisions, and official gazette bulletins curated by our customs council."
    : isAr
    ? "أحدث القرارات الجمركية وتعديلات الرسوم والتنظيمات القانونية للتجارة الخارجية بإشراف مستشارينا."
    : isEs
    ? "Boletines regulatorios, revisiones arancelarias y normativas oficiales seleccionadas por nuestro consejo aduanero."
    : "İthalat, ihracat, gümrük vergileri ve dış ticaret mevzuatındaki en son yasal düzenlemeler hakkında müşavirlik bilgilendirmeleri.";
  const readMoreText = isEn
    ? "Read Details"
    : isAr
    ? "قراءة التفاصيل"
    : isEs
    ? "Leer Detalles"
    : "Detayları Oku";

  return (
    <div className="py-16 bg-slate-50 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Başlık */}
        <div className="text-center space-y-3">
          <span className="text-xs font-bold text-[#44B9CD] uppercase tracking-wider">
            {badgeText}
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1E2A3A]">
            {mainTitle}
          </h1>
          <p className="text-sm text-slate-600 max-w-2xl mx-auto">
            {subTitle}
          </p>
        </div>

        {/* Sirküler Listesi */}
        <div className="space-y-4">
          {items.map((item) => (
            <article
              key={item.id}
              className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200/80 hover:shadow-md hover:border-[#44B9CD]/50 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
            >
              <div className="space-y-2.5 max-w-2xl">
                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span className="inline-flex items-center gap-1 text-[#44B9CD] font-bold bg-[#44B9CD]/10 px-2.5 py-0.5 rounded-full">
                    <Tag className="w-3 h-3" />
                    {item.category}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(item.date).toLocaleDateString(
                      isEn ? "en-US" : isAr ? "ar-EG" : isEs ? "es-ES" : "tr-TR",
                      {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      }
                    )}
                  </span>
                </div>
                <h2 className="text-lg font-bold text-slate-900 leading-snug">
                  <Link
                    href={`/${lang}/sirkuler/${item.slug}`}
                    className="hover:text-[#44B9CD] transition-colors"
                  >
                    {item.title}
                  </Link>
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed">
                  {item.summary}
                </p>
              </div>

              <Link
                href={`/${lang}/sirkuler/${item.slug}`}
                className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-[#1E2A3A] hover:text-white transition-all self-end sm:self-center"
              >
                <span>{readMoreText}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
