"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gerekliBaglantilarData } from "@/data/gerekliBaglantilar";
import { ChevronLeft, ChevronRight, ExternalLink, ArrowRight } from "lucide-react";

export default function LinksCompactTicker() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Otomatik yumuşak kayma
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % gerekliBaglantilarData.length);
    }, 3200);
    return () => clearInterval(interval);
  }, [isPaused]);

  // Manuel kaydırma
  const handlePrev = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -240, behavior: "smooth" });
    }
  };

  const handleNext = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 240, behavior: "smooth" });
    }
  };

  return (
    <section className="bg-slate-100/90 border-y border-slate-200/90 py-4 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 mb-2.5">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#44B9CD] animate-pulse"></span>
            <span className="text-xs font-bold text-[#1E2A3A] uppercase tracking-wider">
              Gerekli Bağlantılar & Portallar
            </span>
            <span className="hidden sm:inline-block text-[11px] text-slate-500">
              (Kargo takip, liman ve resmi gümrükleme sistemleri)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/araclar#gerekli-baglantilar"
              className="text-[11px] font-bold text-[#44B9CD] hover:text-[#1E2A3A] transition-colors inline-flex items-center gap-1"
            >
              <span>Tümünü Gör</span>
              <ArrowRight className="w-3 h-3" />
            </Link>

            <div className="flex items-center gap-1 ml-2">
              <button
                onClick={handlePrev}
                aria-label="Önceki Bağlantı"
                className="w-6 h-6 rounded-md bg-white hover:bg-slate-200 text-slate-700 flex items-center justify-center border border-slate-200 transition-colors shadow-2xs"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleNext}
                aria-label="Sonraki Bağlantı"
                className="w-6 h-6 rounded-md bg-white hover:bg-slate-200 text-slate-700 flex items-center justify-center border border-slate-200 transition-colors shadow-2xs"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Yatay Kaydırılabilir Kartlar Bandı */}
        <div
          ref={scrollRef}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="flex items-center gap-3 overflow-x-auto no-scrollbar scroll-smooth py-1"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {gerekliBaglantilarData.map((item) => (
            <a
              key={item.id}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 flex items-center gap-2.5 bg-white hover:bg-slate-50 border border-slate-200 hover:border-[#44B9CD] px-3 py-1.5 rounded-xl shadow-2xs hover:shadow-xs transition-all duration-200 group"
              style={{ width: "220px" }}
            >
              <div className="relative w-12 h-8 bg-slate-50 rounded-lg overflow-hidden shrink-0 border border-slate-100 flex items-center justify-center">
                <Image
                  src={item.image}
                  alt={item.shortTitle}
                  fill
                  className="object-contain p-1"
                  sizes="48px"
                />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-bold text-slate-900 group-hover:text-[#44B9CD] transition-colors truncate">
                    {item.shortTitle}
                  </span>
                  <ExternalLink className="w-3 h-3 text-slate-400 shrink-0 group-hover:text-[#44B9CD] transition-colors" />
                </div>
                <span className="text-[10px] text-slate-500 block truncate">
                  {item.tag}
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
