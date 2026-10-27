"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { GerekliBaglanti, gerekliBaglantilarData } from "@/data/gerekliBaglantilar";
import { useLanguage } from "@/context/LanguageContext";
import { ExternalLink, ArrowRight, Pause, Play, Globe } from "lucide-react";

interface QuickLinksWidgetProps {
  initialLinks?: GerekliBaglanti[];
}

export default function QuickLinksWidget({ initialLinks }: QuickLinksWidgetProps = {}) {
  const { isRTL, localePath, t } = useLanguage();
  const [isPaused, setIsPaused] = useState(false);
  const [links, setLinks] = useState<GerekliBaglanti[]>(
    initialLinks && initialLinks.length > 0 ? initialLinks : []
  );
  const ul = t.usefulLinksSection;

  useEffect(() => {
    let isMounted = true;
    const fetchFreshLinks = async () => {
      try {
        const res = await fetch("/api/public/baglantilar", {
          cache: "no-store",
        });
        if (res.ok) {
          const data = await res.json();
          if (data.baglantilar && Array.isArray(data.baglantilar) && data.baglantilar.length > 0) {
            if (isMounted) {
              setLinks(data.baglantilar);
            }
          }
        }
      } catch (err) {
        console.error("Hızlı erişim bağlantıları veritabanından alınamadı:", err);
      }
    };

    fetchFreshLinks();

    return () => {
      isMounted = false;
    };
  }, []);

  const activeLinks = useMemo(() => {
    if (links.length > 0) return links;
    if (initialLinks && initialLinks.length > 0) return initialLinks;
    return gerekliBaglantilarData;
  }, [links, initialLinks]);

  const marqueeItems = useMemo(() => {
    if (activeLinks.length === 0) return [];
    let items = [...activeLinks];
    while (items.length < 10) {
      items = [...items, ...activeLinks];
    }
    // Sonsuz kayan bant akışı için çift kopya
    return [...items, ...items];
  }, [activeLinks]);

  return (
    <div
      className="relative flex flex-col h-full bg-slate-50/60 rounded-2xl border border-slate-200/90 overflow-hidden group/links select-none"
    >
      {/* 1. Başlık & Kontrol Çubuğu */}
      <div className="px-4 py-2 bg-white border-b border-slate-200/80 flex items-center justify-between shrink-0 z-20">
        <div className="flex items-center gap-2 min-w-0">
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#44B9CD] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#44B9CD]"></span>
          </span>
          <span className="text-xs font-bold text-[#1E2A3A] truncate">
            {ul.quickAccessTitle.replace("{count}", String(activeLinks.length))}
          </span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => setIsPaused((prev) => !prev)}
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
            title={isPaused ? ul.autoFlow : ul.paused}
            aria-label={isPaused ? "Play" : "Pause"}
          >
            {isPaused ? (
              <Play className="w-3.5 h-3.5 text-emerald-600 fill-current" />
            ) : (
              <Pause className="w-3.5 h-3.5 text-slate-500" />
            )}
          </button>

          <Link
            href={localePath("/araclar#gerekli-baglantilar")}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#1E2A3A] hover:bg-[#2A3B50] text-white text-[11px] font-bold transition-colors shadow-2xs"
            title={ul.allBtn}
          >
            <span>{ul.allBtn}</span>
            <ArrowRight className={`w-3.5 h-3.5 text-[#44B9CD] ${isRTL ? "rotate-180" : ""}`} />
          </Link>
        </div>
      </div>

      {/* 2. Sol & Sağ Degrade Maskesi */}
      <div className="pointer-events-none absolute left-0 top-10 bottom-7 w-8 sm:w-12 bg-gradient-to-r from-slate-50/95 to-transparent z-10" />
      <div className="pointer-events-none absolute right-0 top-10 bottom-7 w-8 sm:w-12 bg-gradient-to-l from-slate-50/95 to-transparent z-10" />

      {/* 3. Yatay Kayan Kartlar Konteyneri */}
      <div
        dir="ltr"
        className="flex-1 min-h-0 overflow-hidden marquee-container flex items-center py-1.5 relative"
        style={{ direction: "ltr" }}
      >
        <div
          dir="ltr"
          className="animate-marquee-slow flex items-center gap-3 px-3"
          style={{
            animationPlayState: isPaused ? "paused" : "running",
            animationDuration: `${Math.max(35, activeLinks.length * 4)}s`,
          }}
        >
          {marqueeItems.map((item, index) => (
            <a
              key={`${item.id}-${index}`}
              dir={isRTL ? "rtl" : "ltr"}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative shrink-0 w-[210px] sm:w-[225px] h-[185px] bg-white hover:bg-slate-50/90 border border-slate-200/90 hover:border-[#44B9CD] rounded-xl p-3 shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col justify-between text-left rtl:text-right"
            >
              <div className="flex flex-col min-w-0">
                <div className="flex items-center justify-between gap-1 mb-1.5">
                  <span className="inline-block text-[9px] font-bold uppercase tracking-wider text-cyan-800 bg-cyan-50 border border-cyan-100/80 px-1.5 py-0.2 rounded truncate max-w-[150px]">
                    {item.tag || "Portalı"}
                  </span>
                  <ExternalLink className="w-3 h-3 text-slate-300 group-hover:text-[#44B9CD] transition-colors shrink-0" />
                </div>

                <div className="relative w-full h-14 rounded-lg bg-slate-50 border border-slate-100 shadow-2xs p-1.5 flex items-center justify-center overflow-hidden group-hover:bg-white group-hover:border-cyan-100 transition-colors">
                  {item.image && (item.image.startsWith("/") || item.image.startsWith("http")) ? (
                    <Image
                      src={item.image}
                      alt={item.shortTitle || item.title}
                      fill
                      unoptimized
                      className="object-contain p-1 transition-transform duration-200 group-hover:scale-105"
                      sizes="200px"
                    />
                  ) : (
                    <Globe className="w-7 h-7 text-slate-400 group-hover:text-[#44B9CD] transition-colors" />
                  )}
                </div>

                <h4 className="text-xs sm:text-[13px] font-bold text-slate-900 group-hover:text-[#44B9CD] transition-colors truncate mt-2">
                  {item.shortTitle || item.title}
                </h4>

                <p className="text-[10px] sm:text-[11px] text-slate-500 line-clamp-2 mt-0.5 leading-snug">
                  {item.description}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 mt-1">
                <span className="flex items-center gap-1 text-slate-400">
                  <Globe className="w-2.5 h-2.5 text-[#44B9CD]" />
                  {ul.officialSystem}
                </span>
                <span className="inline-flex items-center gap-0.5 font-bold text-[#44B9CD] group-hover:text-[#288696] transition-colors">
                  <span>{ul.goToPortal}</span>
                  <ArrowRight className="w-2.5 h-2.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* 4. Alt Bilgi Çubuğu */}
      <div className="px-4 py-1.5 bg-white border-t border-slate-200/80 flex items-center justify-between text-[10px] text-slate-500 shrink-0 z-20">
        <div className="truncate">
          {ul.bottomTrack}
        </div>
        <span className="font-semibold text-slate-400 shrink-0 ml-2">
          {isPaused ? ul.paused : ul.autoFlow}
        </span>
      </div>
    </div>
  );
}
