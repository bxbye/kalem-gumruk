"use client";

import Link from "next/link";
import { SirkulerItem } from "@/lib/sirkuler";
import CircularsVerticalTicker from "./CircularsVerticalTicker";
import ExchangeRatesWidget from "./ExchangeRatesWidget";
import QuickLinksWidget from "./QuickLinksWidget";
import { useLanguage } from "@/context/LanguageContext";
import { BookOpen, ArrowRight, TrendingUp } from "lucide-react";

interface CircularsCarouselProps {
  items: SirkulerItem[];
}

export default function CircularsCarousel({ items }: CircularsCarouselProps) {
  const { t, isRTL, localePath } = useLanguage();
  const dw = t.deskWidgets;

  return (
    <section className="py-12 sm:py-16 bg-gradient-to-b from-white via-slate-50/50 to-white border-t border-slate-200/90 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Eşit Büyüklükte 2 Kolon: Üstten ve Alttan Birebir Aynı Hizada */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-start">
          {/* Sol Kolon: Mevzuat & Sirküler Bülteni */}
          <div className="flex flex-col">
            {/* Sol Alan Başlığı */}
            <div className="h-10 flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-[#44B9CD]/15 text-[#0d788a]">
                  <BookOpen className="w-4 h-4 text-[#44B9CD]" />
                </div>
                <h2 className="text-base sm:text-lg font-extrabold text-[#1E2A3A] tracking-tight">
                  {dw.legislationTitle}
                </h2>
              </div>

              <Link
                href={localePath("/sirkuler")}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-[#1E2A3A] hover:text-white text-xs font-bold text-[#1E2A3A] transition-all border border-slate-200 shadow-2xs"
              >
                <span>
                  {dw.viewAllCount.replace("{count}", String(items.length))}
                </span>
                <ArrowRight className={`w-3.5 h-3.5 ${isRTL ? "rotate-180" : ""}`} />
              </Link>
            </div>

            {/* Sol Akış Kutusu - 540px */}
            <div className="h-[540px]">
              <CircularsVerticalTicker items={items} />
            </div>
          </div>

          {/* Sağ Kolon: İki Parçalı Alan */}
          <div className="flex flex-col">
            {/* Sağ Alan Başlığı */}
            <div className="h-10 flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-emerald-500/15 text-emerald-800">
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                </div>
                <h2 className="text-base sm:text-lg font-extrabold text-[#1E2A3A] tracking-tight">
                  {dw.ratesTitle}
                </h2>
              </div>

              <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-[11px] font-semibold text-emerald-800">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span>{dw.ratesLive}</span>
              </div>
            </div>

            {/* Sağ İki Parçalı Kutu */}
            <div className="h-[540px] flex flex-col gap-4">
              <div className="h-[262px]">
                <ExchangeRatesWidget compact={true} />
              </div>
              <div className="h-[262px]">
                <QuickLinksWidget />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
