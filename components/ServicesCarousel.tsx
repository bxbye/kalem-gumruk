"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { servicesData } from "@/data/services";
import { companyInfo } from "@/data/company";
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  Repeat,
  RefreshCw,
  Warehouse,
  Truck,
  Building2,
  Briefcase,
  Scale,
  Shield,
  ArrowRight,
  CheckCircle2,
  Pause,
  Play,
  Layers,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const iconMap: Record<string, React.ReactNode> = {
  ArrowDownToLine: <ArrowDownToLine className="w-5 h-5" />,
  ArrowUpFromLine: <ArrowUpFromLine className="w-5 h-5" />,
  Repeat: <Repeat className="w-5 h-5" />,
  RefreshCw: <RefreshCw className="w-5 h-5" />,
  Warehouse: <Warehouse className="w-5 h-5" />,
  Truck: <Truck className="w-5 h-5" />,
  Building2: <Building2 className="w-5 h-5" />,
  Briefcase: <Briefcase className="w-5 h-5" />,
  Scale: <Scale className="w-5 h-5" />,
  Shield: <Shield className="w-5 h-5" />,
};

export default function ServicesCarousel() {
  const [isPaused, setIsPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sonsuz kesintisiz yatay akış için 10 hizmeti 2 kez tekrarlıyoruz
  const marqueeServices = [...servicesData, ...servicesData];

  const handlePrev = () => {
    if (!containerRef.current) return;
    containerRef.current.scrollBy({ left: -380, behavior: "smooth" });
  };

  const handleNext = () => {
    if (!containerRef.current) return;
    containerRef.current.scrollBy({ left: 380, behavior: "smooth" });
  };

  return (
    <section className="py-14 sm:py-20 bg-gradient-to-b from-slate-50 via-slate-100/50 to-slate-50 border-t border-slate-200/90 relative select-none overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Üst Başlık & Kontroller */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#44B9CD]/15 border border-[#44B9CD]/30 text-[#1E2A3A] text-xs font-bold uppercase tracking-wider">
              <Layers className="w-3.5 h-3.5 text-[#44B9CD]" />
              <span>Uzmanlık Alanlarımız &amp; Rejimler</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#1E2A3A] tracking-tight">
              Kapsamlı Gümrükleme &amp; Dış Ticaret Hizmetleri
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
              1997&apos;den bugüne tüm gümrük rejimlerinde A Karne yetkili müşavir kadromuzla yanınızdayız.
              Aşağıdaki yatay kayan bant üzerinden tüm hizmetlerimizi inceleyebilirsiniz.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 self-start md:self-end">
            {/* Duraklat / Oynat Düğmesi */}
            <button
              onClick={() => setIsPaused((prev) => !prev)}
              aria-label={isPaused ? "Akışı Başlat" : "Akışı Duraklat"}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold shadow-2xs transition-all hover:scale-105"
              title={isPaused ? "Akışı devam ettir" : "Akışı duraklat"}
            >
              {isPaused ? (
                <>
                  <Play className="w-3.5 h-3.5 text-[#44B9CD] fill-current" />
                  <span className="hidden sm:inline">Devam Ettir</span>
                </>
              ) : (
                <>
                  <Pause className="w-3.5 h-3.5 text-slate-500" />
                  <span className="hidden sm:inline">Duraklat</span>
                </>
              )}
            </button>

            {/* Manuel Önceki / Sonraki Kontroller */}
            <button
              onClick={handlePrev}
              aria-label="Önceki Hizmet"
              className="p-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 transition-all shadow-2xs hover:scale-105 active:scale-95"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              aria-label="Sonraki Hizmet"
              className="p-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 transition-all shadow-2xs hover:scale-105 active:scale-95"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Tüm Hizmetleri Gör Linki */}
            <Link
              href="/hizmetlerimiz"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1E2A3A] hover:bg-[#2A3B50] text-white text-xs font-bold transition-all shadow-xs hover:shadow"
            >
              <span>Tüm Hizmetler ({servicesData.length})</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#44B9CD]" />
            </Link>
          </div>
        </div>
      </div>

      {/* Yatay Kayan Kart Bandı (Marquee Taşıyıcı + Kenar Degrade Maskeleri) */}
      <div
        ref={containerRef}
        className="relative w-full overflow-x-auto no-scrollbar marquee-container py-3"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {/* Sol yumuşak solma degrade maskesi */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-12 sm:w-28 bg-gradient-to-r from-slate-50 via-slate-50/90 to-transparent z-10" />

        {/* Sağ yumuşak solma degrade maskesi */}
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-12 sm:w-28 bg-gradient-to-l from-slate-50 via-slate-50/90 to-transparent z-10" />

        {/* Sağdan Sola Kesintisiz Yavaş Kayan Kart Grubu */}
        <div
          className="animate-marquee-slow flex items-stretch gap-5 sm:gap-6 px-4"
          style={{
            animationDuration: "65s",
            animationPlayState: isPaused ? "paused" : undefined,
          }}
        >
          {marqueeServices.map((service, index) => {
            const originalIndex = (index % servicesData.length) + 1;
            const formattedNum = originalIndex < 10 ? `0${originalIndex}` : `${originalIndex}`;

            return (
              <div
                key={`${service.slug}-${index}`}
                data-service-card
                className="group relative shrink-0 w-[300px] sm:w-[350px] bg-white hover:bg-slate-50/90 border border-slate-200/90 hover:border-[#44B9CD] rounded-3xl p-6 shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between"
              >
                <div>
                  {/* Üst Sıra: İkon + Numara */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#1E2A3A] text-[#44B9CD] group-hover:bg-[#44B9CD] group-hover:text-white flex items-center justify-center group-hover:scale-105 transition-all shadow-xs">
                      {iconMap[service.iconName] || <Briefcase className="w-5 h-5" />}
                    </div>

                    <span className="text-lg font-black text-slate-300 group-hover:text-[#44B9CD]/40 transition-colors">
                      {formattedNum}
                    </span>
                  </div>

                  {/* Başlık */}
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-[#44B9CD] transition-colors line-clamp-1 mb-2">
                    {service.title}
                  </h3>

                  {/* Kısa Açıklama */}
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
                    {service.shortDesc}
                  </p>

                  {/* Örnek 3 İşlem Maddesi */}
                  <div className="space-y-2 pt-3 border-t border-slate-100">
                    {service.features.slice(0, 3).map((feat, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-slate-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#44B9CD] shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Alt Kısım: Butonlar */}
                <div className="pt-4 mt-5 border-t border-slate-100 flex items-center justify-between gap-2">
                  <Link
                    href={`/hizmetlerimiz/${service.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1E2A3A] group-hover:text-[#44B9CD] transition-colors"
                  >
                    <span>Hizmet Detayı</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>

                  <a
                    href={`https://wa.me/${companyInfo.whatsapp}?text=${encodeURIComponent(
                      `Merhaba Kalem Gümrük, ${service.title} hakkında detaylı bilgi ve teklif almak istiyorum.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white text-[11px] font-bold transition-all"
                    title="WhatsApp Müşavir Hattı"
                  >
                    <MessageCircle className="w-3 h-3" />
                    <span>Danış</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
