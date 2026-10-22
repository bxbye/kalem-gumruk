"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { SirkulerItem } from "@/lib/sirkuler";
import {
  ArrowRight,
  Calendar,
  Tag,
  ChevronLeft,
  ChevronRight,
  BookOpen,
} from "lucide-react";

interface CircularsCarouselProps {
  items: SirkulerItem[];
}

export default function CircularsCarousel({ items }: CircularsCarouselProps) {
  const [isPaused, setIsPaused] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Otomatik yumuşak kayma (5 saniyede bir kart ilerle)
  useEffect(() => {
    if (isPaused || items.length <= 1) return;

    const interval = setInterval(() => {
      if (!scrollRef.current) return;
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;

      if (scrollLeft + clientWidth >= scrollWidth - 20) {
        scrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        const firstCard = scrollRef.current.querySelector<HTMLElement>("[data-circular-card]");
        const cardWidth = firstCard ? firstCard.offsetWidth + 24 : 340;
        scrollRef.current.scrollBy({ left: cardWidth, behavior: "smooth" });
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isPaused, items.length]);

  const handlePrev = () => {
    if (!scrollRef.current) return;
    const firstCard = scrollRef.current.querySelector<HTMLElement>("[data-circular-card]");
    const cardWidth = firstCard ? firstCard.offsetWidth + 24 : 340;
    scrollRef.current.scrollBy({ left: -cardWidth, behavior: "smooth" });
  };

  const handleNext = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    if (scrollLeft + clientWidth >= scrollWidth - 20) {
      scrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
    } else {
      const firstCard = scrollRef.current.querySelector<HTMLElement>("[data-circular-card]");
      const cardWidth = firstCard ? firstCard.offsetWidth + 24 : 340;
      scrollRef.current.scrollBy({ left: cardWidth, behavior: "smooth" });
    }
  };

  return (
    <section
      className="py-16 sm:py-20 bg-white border-t border-slate-200/90 select-none relative"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Üst Başlık & Kontroller */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#44B9CD]/15 text-[#1E2A3A] text-xs font-bold uppercase tracking-wider">
              <BookOpen className="w-3.5 h-3.5 text-[#44B9CD]" />
              <span>Güncel Mevzuat & Sirküler</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#1E2A3A]">
              Gümrük Tebliğleri & Sirküler Bülteni
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl">
              Resmi Gazete&apos;de yayımlanan güncel gümrük tebliğleri, vergi düzenlemeleri ve dış ticaret
              kararları hakkında müşavir yorumlarımız.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/sirkuler"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-[#1E2A3A] hover:text-[#44B9CD] transition-colors"
            >
              <span>Tüm Sirkülerler ({items.length})</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <div className="flex items-center gap-1.5">
              <button
                onClick={handlePrev}
                aria-label="Önceki Sirküler"
                className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 transition-all shadow-xs hover:scale-105 active:scale-95"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNext}
                aria-label="Sonraki Sirküler"
                className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 transition-all shadow-xs hover:scale-105 active:scale-95"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Kayan Sirküler Konteyneri (Snap Scroll + Touch Swipe) */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory py-2 pb-4 no-scrollbar"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {items.map((item, idx) => (
            <div
              key={item.id}
              data-circular-card
              className="snap-start shrink-0 w-[88%] sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] flex flex-col"
            >
              <article className="h-full bg-slate-50 hover:bg-white rounded-2xl p-6 shadow-xs border border-slate-200 hover:border-[#44B9CD]/60 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span className="inline-flex items-center gap-1 text-[#44B9CD] font-bold bg-[#44B9CD]/10 px-2.5 py-0.5 rounded-md">
                      <Tag className="w-3 h-3" />
                      {item.category}
                    </span>
                    <span className="inline-flex items-center gap-1 text-slate-400">
                      <Calendar className="w-3 h-3" />
                      {new Date(item.date).toLocaleDateString("tr-TR")}
                    </span>
                  </div>

                  <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-[#44B9CD] transition-colors line-clamp-2">
                    <Link href={`/sirkuler/${item.slug}`}>{item.title}</Link>
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {item.summary || item.content.slice(0, 140) + "..."}
                  </p>

                  {item.relatedGtip && (
                    <div className="pt-1">
                      <span className="text-[10px] bg-slate-200/80 text-slate-700 font-mono px-2 py-0.5 rounded">
                        GTİP: {item.relatedGtip}
                      </span>
                    </div>
                  )}
                </div>

                <div className="pt-4 mt-4 border-t border-slate-200/80 flex items-center justify-between">
                  <Link
                    href={`/sirkuler/${item.slug}`}
                    className="text-xs font-bold text-[#1E2A3A] group-hover:text-[#44B9CD] inline-flex items-center gap-1 transition-colors"
                  >
                    <span>Mevzuatı Oku</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>

                  <span className="text-[10px] font-semibold text-slate-400">
                    0{idx + 1}
                  </span>
                </div>
              </article>
            </div>
          ))}
        </div>

        {/* Mobil Alt Bağlantı */}
        <div className="flex sm:hidden justify-center mt-6">
          <Link
            href="/sirkuler"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#44B9CD]"
          >
            <span>Tüm Sirkülerleri Gör ({items.length})</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
