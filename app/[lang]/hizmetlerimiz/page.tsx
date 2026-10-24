import type { Metadata } from "next";
import HizmetlerClient from "@/components/HizmetlerClient";
import { getAllServices } from "@/lib/services";
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
    ? "Customs Brokerage Services | Import, Export & Trade Advisory"
    : isAr
    ? "خدمات التخليص الجمركي | الاستيراد والتصدير والاستشارات"
    : isEs
    ? "Servicios de Despacho de Aduanas | Importación, Exportación y Asesoría"
    : "Gümrük Müşavirliği Hizmetlerimiz | İthalat, İhracat & Danışmanlık";

  const description = isEn
    ? "Authorized customs brokerage solutions since 1997 for import, export, bonded warehousing, inward processing, and free trade zones."
    : isAr
    ? "حلول التخليص الجمركي المعتمدة منذ 1997 في عمليات الاستيراد والتصدير والمستودعات الجمركية والمناطق الحرة."
    : isEs
    ? "Soluciones autorizadas de despacho aduanero desde 1997 para importación, exportación, depósito aduanero y zonas francas."
    : "İthalat, ihracat, dahilde ve hariçte işleme rejimi, antrepo, transit ve serbest bölge işlemlerinde 1997'den bugüne yetkili gümrük müşavirliği çözümleri.";

  return {
    title,
    description,
    alternates: {
      canonical: `/${lang}/hizmetlerimiz`,
      languages: {
        tr: "/tr/hizmetlerimiz",
        en: "/en/hizmetlerimiz",
        ar: "/ar/hizmetlerimiz",
        es: "/es/hizmetlerimiz",
        "x-default": "/tr/hizmetlerimiz",
      },
    },
    openGraph: {
      title,
      description,
      url: `https://kalemgumruk.com/${lang}/hizmetlerimiz`,
    },
  };
}

export default async function HizmetlerimizPage({ params }: Props) {
  const { lang } = await params;
  const services = getAllServices(lang);

  return <HizmetlerClient initialServices={services} />;
}
