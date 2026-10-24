"use client";

import { useState } from "react";
import Link from "next/link";
import { SirkulerItem } from "@/lib/sirkuler";
import { useLanguage } from "@/context/LanguageContext";
import {
  Calendar,
  Tag,
  ArrowRight,
  Pause,
  Play,
} from "lucide-react";

interface CircularsVerticalTickerProps {
  items: SirkulerItem[];
}

export default function CircularsVerticalTicker({ items }: CircularsVerticalTickerProps) {
  const { localePath, language, isRTL, t } = useLanguage();
  const [isPaused, setIsPaused] = useState(false);
  const dw = t.deskWidgets;

  const safeItems = items && items.length > 0 ? items : [];

  const dateLocaleMap: Record<string, string> = {
    tr: "tr-TR",
    en: "en-US",
    ar: "ar-EG",
    es: "es-ES",
  };
  const dateLocale = dateLocaleMap[language] || "tr-TR";

  const renderCard = (item: SirkulerItem, key: string) => (
    <article
      key={key}
      dir={isRTL ? "rtl" : "ltr"}
      className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200/90 shadow-xs hover:border-[#44B9CD] hover:shadow-md transition-all duration-200 group/card relative text-left rtl:text-right"
    >
      <div className="flex items-center justify-between gap-2 text-xs text-slate-500 mb-2">
        <span className="inline-flex items-center gap-1 font-semibold text-[#44B9CD] bg-[#44B9CD]/10 px-2 py-0.5 rounded-md text-[11px]">
          <Tag className="w-3 h-3" />
          {item.category}
        </span>
        <span className="inline-flex items-center gap-1 text-slate-400 text-[11px]">
          <Calendar className="w-3 h-3" />
          {new Date(item.date).toLocaleDateString(dateLocale, {
            day: "numeric",
            month: "short",
          })}
        </span>
      </div>

      <h3 className="font-bold text-xs sm:text-sm text-slate-800 group-hover/card:text-[#44B9CD] transition-colors line-clamp-2 leading-snug">
        <Link href={localePath(`/sirkuler/${item.slug}`)}>
          {item.title}
        </Link>
      </h3>

      <p className="mt-1.5 text-[11px] sm:text-xs text-slate-600 line-clamp-2 leading-relaxed">
        {item.summary}
      </p>

      <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-100">
        <span className="text-[10px] text-slate-400 font-mono">
          {item.regulationType || (language === "en" ? "Decree" : language === "ar" ? "قرار" : language === "es" ? "Normativa" : "Mevzuat")}
        </span>
        <Link
          href={localePath(`/sirkuler/${item.slug}`)}
          className="inline-flex items-center gap-1 text-[11px] font-bold text-[#44B9CD] hover:text-[#1E2A3A] transition-colors"
        >
          <span>{dw.examine}</span>
          <ArrowRight className={`w-3 h-3 transition-transform ${isRTL ? "rotate-180 group-hover/card:-translate-x-0.5" : "group-hover/card:translate-x-0.5"}`} />
        </Link>
      </div>
    </article>
  );

  return (
    <div
      className="relative flex flex-col h-full bg-slate-50/70 rounded-2xl p-4 border border-slate-200/80 shadow-xs"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-200/80">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#44B9CD] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#44B9CD]"></span>
          </span>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
            {dw.liveLegislationFeed}
          </span>
        </div>

        <div className="flex items-center gap-1 text-slate-400">
          <button
            type="button"
            onClick={() => setIsPaused(!isPaused)}
            className="p-1 rounded-md hover:bg-slate-200 hover:text-slate-700 transition-colors cursor-pointer"
            title={isPaused ? (language === "en" ? "Play" : language === "ar" ? "تشغيل" : language === "es" ? "Iniciar" : "Başlat") : (language === "en" ? "Pause" : language === "ar" ? "إيقاف مؤقت" : language === "es" ? "Pausar" : "Durdur")}
            aria-label={isPaused ? "Play" : "Pause"}
          >
            {isPaused ? <Play className="w-3.5 h-3.5 text-emerald-600 fill-current" /> : <Pause className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      <div className="relative overflow-hidden flex-1 h-[420px] max-h-[420px]">
        <div
          className={`space-y-3 animate-vertical-scroll`}
          style={{
            animationDuration: `${Math.max(28, safeItems.length * 4.5)}s`,
            animationPlayState: isPaused ? "paused" : "running",
          }}
        >
          {safeItems.map((item, index) => renderCard(item, `orig-${item.id || index}`))}
          {safeItems.map((item, index) => renderCard(item, `dup-${item.id || index}`))}
        </div>

        <div className="pointer-events-none absolute inset-x-0 top-0 h-6 bg-gradient-to-b from-slate-50/90 to-transparent z-10" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-slate-50/90 to-transparent z-10" />
      </div>

      <div className="pt-3 mt-2 border-t border-slate-200/80 text-center">
        <Link
          href={localePath("/sirkuler")}
          className="inline-flex items-center gap-1 text-xs font-bold text-slate-700 hover:text-[#44B9CD] transition-colors"
        >
          <span>{dw.viewAllCirculars}</span>
        </Link>
      </div>
    </div>
  );
}
