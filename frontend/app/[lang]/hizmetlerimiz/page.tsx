import type { Metadata } from "next";
import HizmetlerClient from "@/components/HizmetlerClient";
import { getAllServicesAsync } from "@/lib/services";
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
    ? "Authorized customs brokerage solutions with 25+ years expertise for import, export, bonded warehousing, inward processing, and free trade zones."
    : isAr
    ? "حلول التخليص الجمركي المعتمدة بخبرة تتجاوز 25 عاماً في عمليات الاستيراد والتصدير والمستودعات الجمركية والمناطق الحرة."
    : isEs
    ? "Soluciones autorizadas de despacho aduanero con más de 25 años de experiencia para importación, exportación, depósito aduanero y zonas francas."
    : "İthalat, ihracat, dahilde ve hariçte işleme rejimi, antrepo, transit ve serbest bölge işlemlerinde 25 yılı aşkın tecrübeyle yetkili gümrük müşavirliği çözümleri.";

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

const BACKEND_INTERNAL_URL = process.env.BACKEND_INTERNAL_URL || "http://127.0.0.1:5001";

async function getQuoteFormData() {
  try {
    const res = await fetch(`${BACKEND_INTERNAL_URL}/api/forms/fiyat-teklifi`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data?.success && data.form ? data.form : null;
  } catch (e) {
    console.error("[Quote Form Fetch Error]:", e);
    return null;
  }
}

export default async function HizmetlerimizPage({ params }: Props) {
  const { lang } = await params;
  const services = await getAllServicesAsync(lang);
  const quoteForm = await getQuoteFormData();

  return <HizmetlerClient initialServices={services} initialQuoteForm={quoteForm} />;
}
