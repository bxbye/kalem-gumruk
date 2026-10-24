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

export default function KariyerPage() {
  return <KariyerClient />;
}
