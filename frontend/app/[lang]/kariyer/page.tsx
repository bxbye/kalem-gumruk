import type { Metadata } from "next";
import KariyerClient from "@/components/KariyerClient";
import { translations, availableLanguages, Language } from "@/data/translations";

export function generateStaticParams() {
  return availableLanguages.map((l) => ({ lang: l.code }));
}

interface Props {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const currentLang: Language =
    availableLanguages.find((l) => l.code === lang)?.code || "tr";
  const t = translations[currentLang]?.careerPage || translations.tr.careerPage;

  return {
    title: `${t.title} | Kalem Gümrük Müşavirliği`,
    description: t.subtitle,
    alternates: {
      canonical: `/${currentLang}/kariyer`,
      languages: {
        tr: "/tr/kariyer",
        en: "/en/kariyer",
        ar: "/ar/kariyer",
        es: "/es/kariyer",
        "x-default": "/tr/kariyer",
      },
    },
    openGraph: {
      title: `${t.title} | Kalem Gümrük Müşavirliği`,
      description: t.subtitle,
      url: `https://kalemgumruk.com/${currentLang}/kariyer`,
    },
  };
}

const BACKEND_INTERNAL_URL = process.env.BACKEND_INTERNAL_URL || "http://127.0.0.1:5001";

async function getCareerFormData() {
  try {
    const res = await fetch(`${BACKEND_INTERNAL_URL}/api/forms/kariyer-staj`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data?.success && data.form ? data.form : null;
  } catch (e) {
    console.error("[Career Form Fetch Error]:", e);
    return null;
  }
}

export default async function KariyerPage() {
  const careerForm = await getCareerFormData();
  return <KariyerClient initialForm={careerForm} />;
}
