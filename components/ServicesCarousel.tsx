"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { servicesData } from "@/data/services";
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  Repeat,
  Warehouse,
  Building2,
  Briefcase,
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Layers,
} from "lucide-react";

const iconMap: Record<string, React.ReactNode> = {
  ArrowDownToLine: <ArrowDownToLine className="w-5 h-5" />,
  ArrowUpFromLine: <ArrowUpFromLine className="w-5 h-5" />,
  Repeat: <Repeat className="w-5 h-5" />,
  Warehouse: <Warehouse className="w-5 h-5" />,
  Building2: <Building2 className="w-5 h-5" />,
  Briefcase: <Briefcase className="w-5 h-5" />,
};

export default function ServicesCarousel() {
  const [isPaused, setIsPaused] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Otomatik yumuşak kayma (4 saniyede bir bir kart ilerle)
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      if (!scrollRef.current) return;
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;

      // Sona ulaşıldıysa başa sar
      if (scrollLeft + clientWidth >= scrollWidth - 20) {
        scrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        const firstCard = scrollRef.current.querySelector<HTMLElement>("[data-service-card]");
        const cardWidth = firstCard ? firstCard.offsetWidth + 24 : 340;
        scrollRef.current.scrollBy({ left: cardWidth, behavior: "smooth" });
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [isPaused]);

  const handlePrev = () => {
    if (!scrollRef.current) return;
    const firstCard = scrollRef.current.querySelector<HTMLElement>("[data-service-card]");
    const cardWidth = firstCard ? firstCard.offsetWidth + 24 : 340;
    scrollRef.current.scrollBy({ left: -cardWidth, behavior: "smooth" });
  };

  const handleNext = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    if (scrollLeft + clientWidth >= scrollWidth - 20) {
      scrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
    } else {
      const firstCard = scrollRef.current.querySelector<HTMLElement>("[data-service-card]");
      const cardWidth = firstCard ? firstCard.offsetWidth + 24 : 340;
      scrollRef.current.scrollBy({ left: cardWidth, behavior: "smooth" });
    }
  };

  return (
    <section
      className="py-16 sm:py-20 bg-slate-50 relative select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Üst Başlık & Kontroller */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#44B9CD]/15 text-[#1E2A3A] text-xs font-bold uppercase tracking-wider">
              <Layers className="w-3.5 h-3.5 text-[#44B9CD]" />
              <span>Uzmanlık Alanlarımız</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#1E2A3A]">
              Kapsamlı Gümrükleme & Dış Ticaret Hizmetleri
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl">
              İthalat, ihracat, serbest bölge ve danışmanlık süreçlerinizi mevzuata tam uyumla
              sıfır gecikmeyle yönetiyoruz. Kartları kaydırarak tüm hizmetlerimizi inceleyebilirsiniz.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              aria-label="Önceki Hizmet"
              className="p-3 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 transition-all shadow-xs hover:scale-105 active:scale-95"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              aria-label="Sonraki Hizmet"
              className="p-3 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 transition-all shadow-xs hover:scale-105 active:scale-95"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Kayan Hizmetler Konteyneri (Snap Scroll + Touch Swipe) */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory py-2 pb-4 no-scrollbar"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {servicesData.map((service, index) => (
            <div
              key={service.slug}
              data-service-card
              className="snap-start shrink-0 w-[88%] sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] flex flex-col"
            >
              <div className="h-full bg-white rounded-2xl p-6 sm:p-7 shadow-xs hover:shadow-xl transition-all duration-300 border border-slate-200/90 flex flex-col justify-between group hover:-translate-y-1">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-[#1E2A3A] text-[#44B9CD] flex items-center justify-center group-hover:scale-110 transition-transform shadow-xs">
                    {iconMap[service.iconName] || <Briefcase className="w-5 h-5" />}
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-[#44B9CD] transition-colors line-clamp-1">
                    {service.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {service.shortDesc}
                  </p>

                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    {service.features.slice(0, 3).map((feat, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-slate-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#44B9CD] shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-5 mt-4 border-t border-slate-100 flex items-center justify-between">
                  <Link
                    href={`/hizmetlerimiz/${service.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1E2A3A] group-hover:text-[#44B9CD] transition-colors"
                  >
                    <span>Hizmet Detayı</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>

                  <span className="text-[10px] font-semibold text-slate-400">
                    0{index + 1}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
