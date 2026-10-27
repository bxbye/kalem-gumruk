import type { Metadata } from "next";
import { getAllSirkulerAsync } from "@/lib/sirkuler";
import { availableLanguages } from "@/data/translations";
import SirkulerListClient from "@/components/SirkulerListClient";

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
    : "Bilgi Merkezi & Mevzuat";
  const mainTitle = isEn
    ? "Customs Legislation & Circulars"
    : isAr
    ? "التشريعات والتعاميم الجمركية"
    : isEs
    ? "Legislación Aduanera y Circulares"
    : "Gümrük Mevzuatı & Sirküler Bülteni";
  const subTitle = isEn
    ? "Authoritative regulatory briefs, duty revisions, and official gazette bulletins curated by our customs council."
    : isAr
    ? "أحدث القرارات الجمركية وتعديلات الرسوم والتنظيمات القانونية للتجارة الخارجية بإشراف مستشارينا."
    : isEs
    ? "Boletines regulatorios, revisiones arancelarias y normativas oficiales seleccionadas por nuestro consejo aduanero."
    : "Resmi Gazete tebliğleri, tarife ve vergi düzenlemeleri ile dış ticaret operasyonlarınızı ilgilendiren tüm güncel mevzuat kararları.";

  return (
    <div className="py-12 sm:py-16 bg-[#F8FAFC] min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Başlık Bölümü */}
        <div className="text-center space-y-3">
          <span className="text-xs font-bold text-[#0e7490] uppercase tracking-wider bg-[#44B9CD]/15 px-3 py-1 rounded-full inline-block">
            {badgeText}
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-[#1E2A3A] tracking-tight">
            {mainTitle}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
            {subTitle}
          </p>
        </div>

        {/* Yüzlerce Post Destekli Filtreli ve Sayfalamalı Liste Bileşeni */}
        <SirkulerListClient initialItems={items} lang={lang} />
      </div>
    </div>
  );
}
