"use client";

import Link from "next/link";
import { SirkulerItem } from "@/lib/sirkuler";
import CircularsVerticalTicker from "./CircularsVerticalTicker";
import ExchangeRatesWidget from "./ExchangeRatesWidget";
import { BookOpen, ArrowRight, TrendingUp } from "lucide-react";

interface CircularsCarouselProps {
  items: SirkulerItem[];
}

export default function CircularsCarousel({ items }: CircularsCarouselProps) {
  return (
    <section className="py-12 sm:py-16 bg-gradient-to-b from-white via-slate-50/50 to-white border-t border-slate-200/90 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Eşit Büyüklükte 2 Kolon: Her alanın başlığı ve açıklaması kendi üzerinde */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-stretch">
          {/* Sol Kolon: Mevzuat & Sirküler Bülteni */}
          <div className="flex flex-col">
            {/* Sol Alan Başlığı */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#44B9CD]/15 text-[#1E2A3A] text-[11px] font-bold uppercase tracking-wider">
                  <BookOpen className="w-3 h-3 text-[#44B9CD]" />
                  <span>Resmi Gazete & Mevzuat</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-[#1E2A3A] tracking-tight">
                  Güncel Gümrük Sirkülerleri
                </h2>
                <p className="text-xs text-slate-500 leading-relaxed max-w-md">
                  Gümrük tebliğleri, İGV kararları ve dış ticaret mevzuat duyuruları.
                </p>
              </div>

              <Link
                href="/sirkuler"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-[#1E2A3A] hover:text-white text-xs font-bold text-[#1E2A3A] transition-all border border-slate-200 shadow-2xs shrink-0 self-start sm:self-end"
              >
                <span>Tüm Sirkülerler ({items.length})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Sol Akış Kutusu */}
            <CircularsVerticalTicker items={items} />
          </div>

          {/* Sağ Kolon: TCMB Gösterge Kurları & Gram Altın */}
          <div className="flex flex-col">
            {/* Sağ Alan Başlığı */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-900 text-[11px] font-bold uppercase tracking-wider">
                  <TrendingUp className="w-3 h-3 text-emerald-600" />
                  <span>TCMB & Serbest Piyasa</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-[#1E2A3A] tracking-tight">
                  Resmi Gösterge Kurları & Altın
                </h2>
                <p className="text-xs text-slate-500 leading-relaxed max-w-md">
                  Gümrük beyannamelerinde geçerli döviz satış kurları ve 24 ayar gram altın.
                </p>
              </div>

              <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-[11px] font-semibold text-emerald-800 shrink-0 self-start sm:self-end">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span>Canlı Gösterge</span>
              </div>
            </div>

            {/* Sağ Akış Kutusu */}
            <ExchangeRatesWidget />
          </div>
        </div>
      </div>
    </section>
  );
}
