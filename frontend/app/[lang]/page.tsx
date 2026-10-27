import type { Metadata } from "next";
import Hero from "@/components/Hero";
import StatsBar from "@/components/StatsBar";
import ServicesCarousel from "@/components/ServicesCarousel";
import CircularsCarousel from "@/components/CircularsCarousel";
import ReferencesSection from "@/components/ReferencesSection";
import { getAllSirkulerAsync } from "@/lib/sirkuler";
import { getAllServicesAsync } from "@/lib/services";
import { getAllGerekliBaglantilarAsync } from "@/lib/baglantilar";
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
    ? "Kalem Customs Brokerage | Reliable Foreign Trade Solutions"
    : isAr
    ? "شركة قلم للتخليص الجمركي | حلول التجارة الخارجية الموثوقة"
    : isEs
    ? "Kalem Despacho de Aduanas | Soluciones Confiables de Comercio Exterior"
    : "Kalem Gümrük Müşavirliği | Güvenilir Dış Ticaret Çözümleri";

  const description = isEn
    ? "Authorized Customs Brokerage in Istanbul, Turkey. Import, export, bonded warehousing, inward processing, and Evrim digital tracking."
    : isAr
    ? "شركة تخليص جمركي معتمدة في إسطنبول. خدمات الاستيراد والتصدير والمستودعات الجمركية وتتبع المعاملات رقمياً."
    : isEs
    ? "Agencia aduanera homologada en Estambul, Turquía. Despachos de importación, exportación, depósito aduanero, perfeccionamiento y seguimiento digital."
    : "25 yılı aşkın sektörel tecrübemizle İstanbul merkezli olarak yetkili gümrük müşavirliği, ithalat, ihracat, antrepo, DİR ve dijital gümrükleme (Evrim Web) çözümleri sunuyoruz.";

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
  const allSirkuler = await getAllSirkulerAsync(lang);
  const allServices = await getAllServicesAsync(lang);
  const allBaglantilar = await getAllGerekliBaglantilarAsync();

  return (
    <>
      <Hero />
      <StatsBar />
      <ServicesCarousel initialServices={allServices} />
      <CircularsCarousel items={allSirkuler} initialLinks={allBaglantilar} />
      <ReferencesSection />
    </>
  );
}
