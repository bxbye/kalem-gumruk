import type { Metadata } from "next";
import { Award, ShieldCheck, Clock, Users } from "lucide-react";
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
  const t = translations[currentLang]?.corporatePage || translations.tr.corporatePage;

  return {
    title: `${t.title} | Kalem Gümrük Müşavirliği`,
    description: t.subtitle,
    alternates: {
      canonical: `/${currentLang}/kurumsal`,
      languages: {
        tr: "/tr/kurumsal",
        en: "/en/kurumsal",
        ar: "/ar/kurumsal",
        es: "/es/kurumsal",
        "x-default": "/tr/kurumsal",
      },
    },
    openGraph: {
      title: `${t.title} | Kalem Gümrük Müşavirliği`,
      description: t.subtitle,
      url: `https://kalemgumruk.com/${currentLang}/kurumsal`,
    },
  };
}

export default async function KurumsalPage({ params }: Props) {
  const { lang } = await params;
  const currentLang: Language =
    availableLanguages.find((l) => l.code === lang)?.code || "tr";
  const t = translations[currentLang]?.corporatePage || translations.tr.corporatePage;

  return (
    <div className="py-16 bg-slate-50 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Başlık */}
        <div className="text-center space-y-3">
          <span className="text-xs font-bold text-[#44B9CD] uppercase tracking-wider">
            {t.badge}
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1E2A3A]">
            {t.title}
          </h1>
          <p className="text-sm text-slate-600 max-w-2xl mx-auto">
            {t.subtitle}
          </p>
        </div>

        {/* Hikayemiz & Vizyon */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-slate-200/80 space-y-8">
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-[#44B9CD]" />
              <span>{t.aboutTitle}</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {t.aboutP1}
            </p>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {t.aboutP2}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-[#1E2A3A]">{t.visionTitle}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {t.visionDesc}
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-[#1E2A3A]">{t.missionTitle}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {t.missionDesc}
              </p>
            </div>
          </div>
        </div>

        {/* Değerlerimiz */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#1E2A3A] text-[#44B9CD] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">{t.complianceTitle}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t.complianceDesc}
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#1E2A3A] text-[#44B9CD] flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">{t.speedTitle}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t.speedDesc}
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#1E2A3A] text-[#44B9CD] flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">{t.reportingTitle}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t.reportingDesc}
            </p>
          </div>
        </div>

        {/* KVKK / Veri Koruma Bildirimi */}
        <div id="kvkk" className="bg-white rounded-2xl p-8 border border-slate-200/80 space-y-3">
          <h2 className="text-base font-bold text-slate-900">
            {t.kvkkTitle}
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            {t.kvkkDesc}
          </p>
        </div>
      </div>
    </div>
  );
}
