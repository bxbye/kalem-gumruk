import type { Metadata } from "next";
import DegerlendirmeClient from "@/components/DegerlendirmeClient";
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
  const t = translations[currentLang]?.feedbackPage || translations.tr.feedbackPage;

  return {
    title: `${t.title} | Kalem Gümrük Müşavirliği`,
    description: t.subtitle,
    alternates: {
      canonical: `/${currentLang}/degerlendirme`,
      languages: {
        tr: "/tr/degerlendirme",
        en: "/en/degerlendirme",
        ar: "/ar/degerlendirme",
        es: "/es/degerlendirme",
        "x-default": "/tr/degerlendirme",
      },
    },
    openGraph: {
      title: `${t.title} | Kalem Gümrük Müşavirliği`,
      description: t.subtitle,
      url: `https://kalemgumruk.com/${currentLang}/degerlendirme`,
    },
  };
}

export default function DegerlendirmePage() {
  return <DegerlendirmeClient />;
}
