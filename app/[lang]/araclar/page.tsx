import type { Metadata } from "next";
import GerekliBaglantilarSection from "@/components/GerekliBaglantilarSection";
import { translations, availableLanguages, Language } from "@/data/translations";
import { getAllGerekliBaglantilar } from "@/lib/baglantilar";

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
  const t = translations[currentLang]?.toolsPage || translations.tr.toolsPage;

  return {
    title: `${t.title} | Kalem Gümrük Müşavirliği`,
    description: t.subtitle,
    alternates: {
      canonical: `/${currentLang}/araclar`,
      languages: {
        tr: "/tr/araclar",
        en: "/en/araclar",
        ar: "/ar/araclar",
        es: "/es/araclar",
        "x-default": "/tr/araclar",
      },
    },
    openGraph: {
      title: `${t.title} | Kalem Gümrük`,
      description: t.subtitle,
      url: `https://kalemgumruk.com/${currentLang}/araclar`,
    },
  };
}

export default function AraclarPage() {
  const links = getAllGerekliBaglantilar();
  return (
    <div className="py-12 sm:py-16 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <GerekliBaglantilarSection initialLinks={links} />
      </div>
    </div>
  );
}
