"use client";

import { useState } from "react";
import Link from "next/link";
import { SirkulerItem } from "@/lib/sirkuler";
import {
  Calendar,
  Tag,
  ArrowRight,
  Pause,
  Play,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface CircularsVerticalTickerProps {
  items: SirkulerItem[];
}

export default function CircularsVerticalTicker({ items }: CircularsVerticalTickerProps) {
  const [isPaused, setIsPaused] = useState(false);

  const safeItems = items && items.length > 0 ? items : [];

  const renderCard = (item: SirkulerItem, key: string) => (
    <article
      key={key}
      className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200/90 shadow-xs hover:border-[#44B9CD] hover:shadow-md transition-all duration-200 group/card relative"
    >
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#44B9CD] bg-[#44B9CD]/10 px-2 py-0.5 rounded-md">
          <Tag className="w-3 h-3" />
          {item.category}
        </span>

        <span className="inline-flex items-center gap-1 text-[11px] text-slate-400">
          <Calendar className="w-3 h-3" />
          {new Date(item.date).toLocaleDateString("tr-TR")}
        </span>
      </div>

      <h4 className="text-sm font-bold text-[#1E2A3A] group-hover/card:text-[#44B9CD] transition-colors leading-snug mb-2 line-clamp-2">
        <Link href={`/sirkuler/${item.slug}`}>{item.title}</Link>
      </h4>

      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-3">
        {item.summary || item.content.slice(0, 120) + "..."}
      </p>

      <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
        {item.relatedGtip ? (
          <span className="text-[10px] bg-slate-100 text-slate-700 font-mono px-2 py-0.5 rounded font-medium">
            GTİP: {item.relatedGtip}
          </span>
        ) : (
          <span className="text-[10px] text-slate-400">Genel Mevzuat</span>
        )}

        <Link
          href={`/sirkuler/${item.slug}`}
          className="font-bold text-[#1E2A3A] group-hover/card:text-[#44B9CD] inline-flex items-center gap-1 transition-colors text-xs"
        >
          <span>İncele</span>
          <ArrowRight className="w-3 h-3 group-hover/card:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </article>
  );

  return (
    <div
      className="relative flex flex-col h-[580px] bg-slate-50/60 rounded-2xl border border-slate-200/90 overflow-hidden group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Ticker Kontrol Başlığı */}
      <div className="px-5 py-3.5 bg-white border-b border-slate-200/80 flex items-center justify-between shrink-0 z-20">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#44B9CD] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#44B9CD]"></span>
          </span>
          <span className="text-xs font-bold text-[#1E2A3A]">
            Mevzuat Akışı ({safeItems.length} Sirküler)
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
            title={isPaused ? "Akışı Başlat" : "Akışı Duraklat"}
            aria-label={isPaused ? "Akışı Başlat" : "Akışı Duraklat"}
          >
            {isPaused ? <Play className="w-3.5 h-3.5 text-emerald-600" /> : <Pause className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Üst ve Alt Gradyan Yumuşatma Katmanı (Fade Mask) */}
      <div className="pointer-events-none absolute top-12 left-0 right-0 h-8 bg-gradient-to-b from-slate-50 to-transparent z-10" />
      <div className="pointer-events-none absolute bottom-9 left-0 right-0 h-10 bg-gradient-to-t from-slate-50 to-transparent z-10" />

      {/* Donanım Hızlandırmalı GPU İpeksi Akış Konteyneri (Yukarıdan Aşağıya - Takılmasız) */}
      <div className="flex-1 overflow-hidden p-4 select-none relative">
        <div
          className="space-y-4 animate-scroll-down"
          style={{
            animationDuration: `${Math.max(20, safeItems.length * 3.2)}s`,
            animationPlayState: isPaused ? "paused" : "running",
          }}
        >
          {/* 1. Set */}
          {safeItems.map((item, idx) => renderCard(item, `set1-${item.id}-${idx}`))}

          {/* 2. Set (Kesintisiz döngü için tam eş kopyası) */}
          {safeItems.map((item, idx) => renderCard(item, `set2-${item.id}-${idx}`))}
        </div>
      </div>

      {/* Alt Bilgi Çubuğu */}
      <div className="px-5 py-2.5 bg-white border-t border-slate-200/80 flex items-center justify-between text-[11px] text-slate-500 shrink-0 z-20">
        <span className="truncate">Fare ile üzerine gelerek akışı duraklatabilirsiniz.</span>
        <Link
          href="/sirkuler"
          className="font-bold text-[#1E2A3A] hover:text-[#44B9CD] shrink-0 inline-flex items-center gap-1 transition-colors ml-2"
        >
          <span>Tümü</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
}
