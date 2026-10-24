import type { Metadata } from "next";
import BelgelerClient from "@/components/BelgelerClient";
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
  const t = translations[currentLang]?.documentsPage || translations.tr.documentsPage;

  return {
    title: `${t.title} | Kalem Gümrük Müşavirliği`,
    description: t.subtitle,
    alternates: {
      canonical: `/${currentLang}/belgeler`,
      languages: {
        tr: "/tr/belgeler",
        en: "/en/belgeler",
        ar: "/ar/belgeler",
        es: "/es/belgeler",
        "x-default": "/tr/belgeler",
      },
    },
    openGraph: {
      title: `${t.title} | Kalem Gümrük Müşavirliği`,
      description: t.subtitle,
      url: `https://kalemgumruk.com/${currentLang}/belgeler`,
    },
  };
}

export default function BelgelerPage() {
  return <BelgelerClient />;
}
