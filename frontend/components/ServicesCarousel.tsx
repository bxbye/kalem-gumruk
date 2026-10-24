"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { servicesData } from "@/data/services";
import { companyInfo } from "@/data/company";
import { useLanguage } from "@/context/LanguageContext";
import { getWhatsAppUrl } from "@/lib/whatsappMessages";
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
  const { t, language, isRTL, localePath } = useLanguage();
  const [isPaused, setIsPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Hizmet id eşlemesi
  const serviceKeyMap: Record<string, keyof typeof t.services> = {
    ithalat: "import",
    ihracat: "export",
    "dahilde-isleme": "dir",
    "haricte-isleme": "haricte",
    antrepo: "antrepo",
    transit: "transit",
    "serbest-bolge": "serbestBolge",
    danismanlik: "danismanlik",
    hukuk: "hukuk",
    sigorta: "sigorta",
  };

  // Sonsuz kesintisiz yatay akış için 4 set kullanıyoruz (her ekran boyutunda ve dilde boşluksuz kesintisiz döngü)
  const marqueeServices = [
    ...servicesData,
    ...servicesData,
    ...servicesData,
    ...servicesData,
  ];

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
              <span>{t.servicesSection.badge}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#1E2A3A] tracking-tight">
              {t.servicesSection.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
              {t.servicesSection.subtitle}
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 self-start md:self-end">
            {/* Duraklat / Oynat Düğmesi */}
            <button
              onClick={() => setIsPaused((prev) => !prev)}
              aria-label={isPaused ? "Play" : "Pause"}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold shadow-2xs transition-all hover:scale-105 cursor-pointer"
            >
              {isPaused ? (
                <>
                  <Play className="w-3.5 h-3.5 text-[#44B9CD] fill-current" />
                  <span className="hidden sm:inline">Play</span>
                </>
              ) : (
                <>
                  <Pause className="w-3.5 h-3.5 text-slate-500" />
                  <span className="hidden sm:inline">Pause</span>
                </>
              )}
            </button>

            {/* Manuel Önceki / Sonraki Kontroller */}
            <button
              onClick={handlePrev}
              aria-label="Previous"
              className="p-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 transition-all shadow-2xs hover:scale-105 active:scale-95 cursor-pointer"
            >
              <ChevronLeft className={`w-4 h-4 ${isRTL ? "rotate-180" : ""}`} />
            </button>
            <button
              onClick={handleNext}
              aria-label="Next"
              className="p-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 transition-all shadow-2xs hover:scale-105 active:scale-95 cursor-pointer"
            >
              <ChevronRight className={`w-4 h-4 ${isRTL ? "rotate-180" : ""}`} />
            </button>

            {/* Tüm Hizmetleri Gör Linki */}
            <Link
              href={localePath("/hizmetlerimiz")}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1E2A3A] hover:bg-[#2A3B50] text-white text-xs font-bold transition-all shadow-xs hover:shadow"
            >
              <span>{t.servicesSection.allServicesBtn}</span>
              <ArrowRight className={`w-3.5 h-3.5 text-[#44B9CD] ${isRTL ? "rotate-180" : ""}`} />
            </Link>
          </div>
        </div>
      </div>

      {/* Yatay Kayan Kart Bandı (Marquee Taşıyıcı + Kenar Degrade Maskeleri) */}
      <div
        ref={containerRef}
        dir="ltr"
        className="relative w-full overflow-hidden marquee-container py-3"
        style={{ direction: "ltr" }}
      >
        {/* Sol yumuşak solma degrade maskesi */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-12 sm:w-28 bg-gradient-to-r from-slate-50 via-slate-50/90 to-transparent z-10" />

        {/* Sağ yumuşak solma degrade maskesi */}
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-12 sm:w-28 bg-gradient-to-l from-slate-50 via-slate-50/90 to-transparent z-10" />

        {/* Kesintisiz Yavaş Kayan Kart Grubu (Daima LTR ekseninde akar) */}
        <div
          dir="ltr"
          className="animate-marquee-slow flex items-stretch gap-5 sm:gap-6 px-4"
          style={{
            animationDuration: "75s",
            animationPlayState: isPaused ? "paused" : "running",
          }}
        >
          {marqueeServices.map((service, index) => {
            const originalIndex = (index % servicesData.length) + 1;
            const formattedNum = originalIndex < 10 ? `0${originalIndex}` : `${originalIndex}`;
            const transKey = serviceKeyMap[service.slug];
            const trans = transKey ? t.services[transKey] : null;
            const title = trans?.title || service.title;
            const shortDesc = trans?.desc || service.shortDesc;

            return (
              <div
                key={`${service.slug}-${index}`}
                dir={isRTL ? "rtl" : "ltr"}
                data-service-card
                className="group relative shrink-0 w-[300px] sm:w-[350px] bg-white hover:bg-slate-50/90 border border-slate-200/90 hover:border-[#44B9CD] rounded-3xl p-6 shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between text-left rtl:text-right"
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
                    {title}
                  </h3>

                  {/* Kısa Açıklama */}
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
                    {shortDesc}
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
                <div className="pt-4 mt-5 border-t border-slate-100 flex items-center justify-between gap-1.5">
                  <Link
                    href={localePath(`/hizmetlerimiz/${service.slug}`)}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-[#1E2A3A] group-hover:text-[#44B9CD] transition-colors"
                  >
                    <span>{t.servicesSection.viewDetails}</span>
                    <ArrowRight className={`w-3 h-3 transition-transform ${isRTL ? "rotate-180 group-hover:-translate-x-1" : "group-hover:translate-x-1"}`} />
                  </Link>

                  <div className="flex items-center gap-1.5">
                    <Link
                      href={localePath(`/hizmetlerimiz?service=${service.slug}#randevu-teklif`)}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-[#44B9CD]/15 hover:bg-[#44B9CD] text-[#196b78] hover:text-white text-[11px] font-bold transition-all"
                      title={t.servicesPage.actionQuote}
                    >
                      <span>{t.servicesPage.actionQuote}</span>
                    </Link>

                    <a
                      href={getWhatsAppUrl({
                        type: "service",
                        lang: language,
                        serviceTitle: title,
                      })}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white text-[11px] font-bold transition-all"
                      title="WhatsApp"
                    >
                      <MessageCircle className="w-3 h-3" />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
