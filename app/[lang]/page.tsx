import type { Metadata } from "next";
import Hero from "@/components/Hero";
import StatsBar from "@/components/StatsBar";
import ServicesCarousel from "@/components/ServicesCarousel";
import CircularsCarousel from "@/components/CircularsCarousel";
import ReferencesSection from "@/components/ReferencesSection";
import { getAllSirkuler } from "@/lib/sirkuler";
import { availableLanguages } from "@/data/translations";

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
    ? "Kalem Customs Brokerage | Reliable Foreign Trade Solutions Since 1997"
    : isAr
    ? "شركة قلم للتخليص الجمركي | حلول التجارة الخارجية الموثوقة منذ عام 1997"
    : isEs
    ? "Kalem Despacho de Aduanas | Soluciones Confiables de Comercio Exterior desde 1997"
    : "Kalem Gümrük Müşavirliği | 1997'den Bugüne Güvenilir Dış Ticaret Çözümleri";

  const description = isEn
    ? "Authorized Customs Brokerage in Istanbul, Turkey since 1997. Import, export, bonded warehousing, inward processing, and Evrim digital tracking."
    : isAr
    ? "شركة تخليص جمركي معتمدة في إسطنبول منذ عام 1997. خدمات الاستيراد والتصدير والمستودعات الجمركية وتتبع المعاملات رقمياً."
    : isEs
    ? "Agencia aduanera homologada en Estambul, Turquía desde 1997. Despachos de importación, exportación, depósito aduanero, perfeccionamiento y seguimiento digital."
    : "1997 yılından bu yana İstanbul merkezli olarak yetkili gümrük müşavirliği, ithalat, ihracat, antrepo, DİR ve dijital gümrükleme (Evrim Web) çözümleri sunuyoruz.";

  return {
    title,
    description,
    alternates: {
      canonical: `/${lang}`,
      languages: {
        tr: "/tr",
        en: "/en",
        ar: "/ar",
        es: "/es",
        "x-default": "/tr",
      },
    },
    openGraph: {
      title,
      description,
      url: `https://kalemgumruk.com/${lang}`,
      locale: isEn ? "en_US" : isAr ? "ar_AR" : isEs ? "es_ES" : "tr_TR",
    },
  };
}

export default async function HomePage({ params }: Props) {
  const { lang } = await params;
  const allSirkuler = getAllSirkuler(lang);

  return (
    <>
      <Hero />
      <StatsBar />
      <ServicesCarousel />
      <CircularsCarousel items={allSirkuler} />
      <ReferencesSection />
    </>
  );
}
