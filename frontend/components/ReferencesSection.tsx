"use client";

import { useState, useEffect, useRef } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { ChevronLeft, ChevronRight, Pause, Play, ShieldCheck, Building2 } from "lucide-react";

interface ReferenceClient {
  id: string;
  name: string;
  sector: string;
  symbol: React.ReactNode;
}

const CLIENTS: ReferenceClient[] = [
  {
    id: "nova-kimya",
    name: "NOVA KİMYA",
    sector: "Kimya & Kozmetik",
    symbol: (
      <svg viewBox="0 0 40 40" className="w-7 h-7 fill-current text-[#44B9CD]">
        <path d="M20 4L34 12V28L20 36L6 28V12L20 4Z" fillOpacity="0.15" stroke="currentColor" strokeWidth="2.5" />
        <circle cx="20" cy="20" r="5" fill="currentColor" />
        <line x1="20" y1="15" x2="20" y2="4" stroke="currentColor" strokeWidth="2" />
        <line x1="24" y1="23" x2="34" y2="28" stroke="currentColor" strokeWidth="2" />
        <line x1="16" y1="23" x2="6" y2="28" stroke="currentColor" strokeWidth="2" />
      </svg>
    ),
  },
  {
    id: "atlas-ticaret",
    name: "ATLAS DIŞ TİCARET",
    sector: "Uluslararası Ticaret",
    symbol: (
      <svg viewBox="0 0 40 40" className="w-7 h-7 fill-current text-indigo-600">
        <circle cx="20" cy="20" r="15" stroke="currentColor" strokeWidth="2.5" fill="none" />
        <ellipse cx="20" cy="20" rx="7" ry="15" stroke="currentColor" strokeWidth="2" fill="none" />
        <line x1="5" y1="20" x2="35" y2="20" stroke="currentColor" strokeWidth="2" />
        <line x1="8" y1="12" x2="32" y2="12" stroke="currentColor" strokeWidth="1.5" />
        <line x1="8" y1="28" x2="32" y2="28" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    id: "erdem-makina",
    name: "ERDEM MAKİNA",
    sector: "Endüstri & İmalat",
    symbol: (
      <svg viewBox="0 0 40 40" className="w-7 h-7 fill-current text-amber-600">
        <path
          d="M20 12C15.58 12 12 15.58 12 20C12 24.42 15.58 28 20 28C24.42 28 28 24.42 28 20C28 15.58 24.42 12 20 12ZM20 24C17.79 24 16 22.21 16 20C16 17.79 17.79 16 20 16C22.21 16 24 17.79 24 20C24 22.21 22.21 24 20 24Z"
          fill="currentColor"
        />
        <path
          d="M32 18V14L28.2 13.4C27.8 12.3 27.2 11.2 26.4 10.3L28.6 7.2L25.8 4.4L22.7 6.6C21.8 5.8 20.7 5.2 19.6 4.8L19 1H15L14.4 4.8C13.3 5.2 12.2 5.8 11.3 6.6L8.2 4.4L5.4 7.2L7.6 10.3C6.8 11.2 6.2 12.3 5.8 13.4L2 14V18L5.8 18.6C6.2 19.7 6.8 20.8 7.6 21.7L5.4 24.8L8.2 27.6L11.3 25.4C12.2 26.2 13.3 26.8 14.4 27.2L15 31H19L19.6 27.2C20.7 26.8 21.8 26.2 22.7 25.4L25.8 27.6L28.6 24.8L26.4 21.7C27.2 20.8 27.8 19.7 28.2 18.6L32 18Z"
          stroke="currentColor"
          strokeWidth="1.5"
          fill="none"
          transform="scale(0.85) translate(3, 4)"
        />
      </svg>
    ),
  },
  {
    id: "trendline-tekstil",
    name: "TRENDLINE",
    sector: "Tekstil & Hazır Giyim",
    symbol: (
      <svg viewBox="0 0 40 40" className="w-7 h-7 fill-current text-rose-600">
        <path d="M10 20C10 13 15 8 20 8C25 8 30 13 30 20C30 27 25 32 20 32C15 32 10 27 10 20Z" stroke="currentColor" strokeWidth="2.5" fill="none" />
        <path d="M14 20Q20 12 26 20Q20 28 14 20Z" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="20" cy="20" r="3" fill="currentColor" />
      </svg>
    ),
  },
  {
    id: "viva-gida",
    name: "VİVA GIDA",
    sector: "Gıda & Tarım İhracatı",
    symbol: (
      <svg viewBox="0 0 40 40" className="w-7 h-7 fill-current text-emerald-600">
        <path
          d="M20 7C20 7 28 10 30 18C32 26 25 33 20 33C15 33 8 26 10 18C12 10 20 7 20 7Z"
          stroke="currentColor"
          strokeWidth="2.5"
          fill="none"
        />
        <path d="M20 12V28M20 18C23 16 26 18 26 18M20 22C17 20 14 22 14 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "argos-otomotiv",
    name: "ARGOS OTO",
    sector: "Otomotiv Yan Sanayi",
    symbol: (
      <svg viewBox="0 0 40 40" className="w-7 h-7 fill-current text-cyan-600">
        <polygon points="20,6 34,14 34,26 20,34 6,26 6,14" stroke="currentColor" strokeWidth="2.5" fill="none" />
        <polygon points="20,12 28,17 28,23 20,28 12,23 12,17" fill="currentColor" fillOpacity="0.3" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    id: "solis-elektronik",
    name: "SOLIS TECH",
    sector: "Tüketici Elektroniği",
    symbol: (
      <svg viewBox="0 0 40 40" className="w-7 h-7 fill-current text-blue-600">
        <rect x="10" y="10" width="20" height="20" rx="3" stroke="currentColor" strokeWidth="2.5" fill="none" />
        <circle cx="20" cy="20" r="4" fill="currentColor" />
        <line x1="20" y1="5" x2="20" y2="10" stroke="currentColor" strokeWidth="2" />
        <line x1="20" y1="30" x2="20" y2="35" stroke="currentColor" strokeWidth="2" />
        <line x1="5" y1="20" x2="10" y2="20" stroke="currentColor" strokeWidth="2" />
        <line x1="30" y1="20" x2="35" y2="20" stroke="currentColor" strokeWidth="2" />
      </svg>
    ),
  },
  {
    id: "medtech-saglik",
    name: "MEDTECH",
    sector: "Medikal & Sağlık",
    symbol: (
      <svg viewBox="0 0 40 40" className="w-7 h-7 fill-current text-teal-600">
        <circle cx="20" cy="20" r="14" stroke="currentColor" strokeWidth="2.5" fill="none" />
        <path d="M17 11H23V17H29V23H23V29H17V23H11V17H17V11Z" fill="currentColor" />
      </svg>
    ),
  },
  {
    id: "promet-metal",
    name: "PROMET ÇELİK",
    sector: "Metal & Ağır Sanayi",
    symbol: (
      <svg viewBox="0 0 40 40" className="w-7 h-7 fill-current text-slate-700">
        <path d="M20 5L33 13V27L20 35L7 27V13L20 5Z" stroke="currentColor" strokeWidth="2" fill="none" />
        <path d="M20 5V35M7 13L33 27M7 27L33 13" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    id: "kent-enerji",
    name: "KENT ENERJİ",
    sector: "Yenilenebilir Enerji",
    symbol: (
      <svg viewBox="0 0 40 40" className="w-7 h-7 fill-current text-emerald-500">
        <circle cx="20" cy="20" r="13" stroke="currentColor" strokeWidth="2" strokeDasharray="3 3" fill="none" />
        <polygon points="21,7 13,21 19,21 17,33 27,17 21,17" fill="currentColor" />
      </svg>
    ),
  },
  {
    id: "terra-lojistik",
    name: "TERRA LOG",
    sector: "Uluslararası Taşımacılık",
    symbol: (
      <svg viewBox="0 0 40 40" className="w-7 h-7 fill-current text-orange-600">
        <rect x="8" y="14" width="24" height="14" rx="2" stroke="currentColor" strokeWidth="2.5" fill="none" />
        <line x1="14" y1="14" x2="14" y2="28" stroke="currentColor" strokeWidth="1.5" />
        <line x1="20" y1="14" x2="20" y2="28" stroke="currentColor" strokeWidth="1.5" />
        <line x1="26" y1="14" x2="26" y2="28" stroke="currentColor" strokeWidth="1.5" />
        <path d="M12 9L20 5L28 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
      </svg>
    ),
  },
  {
    id: "vista-yapi",
    name: "VİSTA YAPI",
    sector: "İnşaat Malzemeleri",
    symbol: (
      <svg viewBox="0 0 40 40" className="w-7 h-7 fill-current text-violet-600">
        <path d="M8 32V16L20 8L32 16V32H8Z" stroke="currentColor" strokeWidth="2.5" fill="none" />
        <rect x="13" y="19" width="4" height="4" fill="currentColor" />
        <rect x="23" y="19" width="4" height="4" fill="currentColor" />
        <rect x="17" y="26" width="6" height="6" fill="currentColor" />
      </svg>
    ),
  },
  {
    id: "aerotech",
    name: "AEROTECH",
    sector: "Havacılık & Savunma",
    symbol: (
      <svg viewBox="0 0 40 40" className="w-7 h-7 fill-current text-sky-600">
        <path d="M20 6L33 30L20 24L7 30L20 6Z" stroke="currentColor" strokeWidth="2.5" fill="currentColor" fillOpacity="0.2" />
        <circle cx="20" cy="20" r="2.5" fill="currentColor" />
      </svg>
    ),
  },
  {
    id: "marina-deniz",
    name: "MARİNA GEMİ",
    sector: "Denizcilik & Konteyner",
    symbol: (
      <svg viewBox="0 0 40 40" className="w-7 h-7 fill-current text-blue-700">
        <circle cx="20" cy="11" r="3" stroke="currentColor" strokeWidth="2" fill="none" />
        <line x1="20" y1="14" x2="20" y2="31" stroke="currentColor" strokeWidth="2.5" />
        <line x1="14" y1="18" x2="26" y2="18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M10 24C12 30 28 30 30 24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      </svg>
    ),
  },
  {
    id: "bella-kozmetik",
    name: "BELLA BEAUTY",
    sector: "Kozmetik & Bakım",
    symbol: (
      <svg viewBox="0 0 40 40" className="w-7 h-7 fill-current text-pink-600">
        <path d="M20 7C20 7 29 17 29 24C29 28.97 24.97 33 20 33C15.03 33 11 28.97 11 24C11 17 20 7 20 7Z" stroke="currentColor" strokeWidth="2.5" fill="currentColor" fillOpacity="0.15" />
        <circle cx="20" cy="24" r="3" fill="currentColor" />
      </svg>
    ),
  },
  {
    id: "greenpack",
    name: "GREENPACK",
    sector: "Endüstriyel Ambalaj",
    symbol: (
      <svg viewBox="0 0 40 40" className="w-7 h-7 fill-current text-lime-600">
        <rect x="9" y="11" width="22" height="18" rx="3" stroke="currentColor" strokeWidth="2.5" fill="none" />
        <path d="M9 17H31M20 17V29" stroke="currentColor" strokeWidth="2" />
        <circle cx="20" cy="8" r="2" fill="currentColor" />
      </svg>
    ),
  },
  {
    id: "apex-kablo",
    name: "APEX ELEKTRİK",
    sector: "Enerji & İletim",
    symbol: (
      <svg viewBox="0 0 40 40" className="w-7 h-7 fill-current text-amber-500">
        <circle cx="13" cy="20" r="5" stroke="currentColor" strokeWidth="2" fill="none" />
        <circle cx="27" cy="20" r="5" stroke="currentColor" strokeWidth="2" fill="none" />
        <path d="M18 20H22M15 15Q20 10 25 15M15 25Q20 30 25 25" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "lotus-mobilya",
    name: "LOTUS DİZAYN",
    sector: "Mobilya & Ağaç Sanayi",
    symbol: (
      <svg viewBox="0 0 40 40" className="w-7 h-7 fill-current text-rose-500">
        <path d="M20 28C20 28 12 24 10 16C16 16 19 22 20 28Z" fill="currentColor" fillOpacity="0.4" stroke="currentColor" strokeWidth="1.5" />
        <path d="M20 28C20 28 28 24 30 16C24 16 21 22 20 28Z" fill="currentColor" fillOpacity="0.4" stroke="currentColor" strokeWidth="1.5" />
        <path d="M20 28V10C22 15 23 22 20 28Z" fill="currentColor" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
];

export default function ReferencesSection() {
  const { t, isRTL } = useLanguage();
  const [clientsList, setClientsList] = useState<ReferenceClient[]>(CLIENTS);
  const [isPaused, setIsPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/admin/references")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.items) && data.items.length > 0) {
          const activeRefs = data.items.filter((r: any) => r.isActive !== 0 && r.isActive !== false);
          if (activeRefs.length > 0) {
            const mapped: ReferenceClient[] = activeRefs.map((item: any, idx: number) => {
              const matched = CLIENTS.find(
                (c) =>
                  c.name.toLowerCase().includes(item.name.toLowerCase()) ||
                  item.name.toLowerCase().includes(c.name.toLowerCase()) ||
                  c.id === item.id
              );
              return {
                id: item.id || `ref-${idx}`,
                name: item.name,
                sector: item.sector,
                symbol: matched ? (
                  matched.symbol
                ) : item.logoUrl ? (
                  <img src={item.logoUrl} alt={item.name} className="w-7 h-7 object-contain" />
                ) : (
                  <Building2 className="w-7 h-7 text-[#44B9CD]" />
                ),
              };
            });
            setClientsList(mapped);
          }
        }
      })
      .catch(() => {});
  }, []);

  // Sonsuz ve kesintisiz akış için kart listesini çift katlı (2 eşit yarı) olarak tekrarlıyoruz
  const repeatCount = Math.max(4, Math.ceil(16 / Math.max(1, clientsList.length)) * 2);
  const marqueeClients = Array.from({ length: repeatCount }).flatMap(() => clientsList);

  const handlePrev = () => {
    if (!containerRef.current) return;
    containerRef.current.scrollBy({ left: -300, behavior: "smooth" });
  };

  const handleNext = () => {
    if (!containerRef.current) return;
    containerRef.current.scrollBy({ left: 300, behavior: "smooth" });
  };

  return (
    <section
      aria-label="Referanslarımız"
      className="py-14 sm:py-20 bg-gradient-to-b from-slate-50 via-slate-100/50 to-slate-50 border-t border-slate-200/90 relative select-none overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Üst Başlık & Kontroller */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#44B9CD]/15 border border-[#44B9CD]/30 text-[#1E2A3A] text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5 text-[#44B9CD]" />
              <span>{t.referencesSection.badge}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#1E2A3A] tracking-tight">
              {t.referencesSection.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
              {t.referencesSection.subtitle}
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
          className="animate-marquee-slow flex items-stretch gap-4 sm:gap-5 px-4"
          style={{
            animationDuration: "60s",
            animationPlayState: isPaused ? "paused" : "running",
          }}
        >
          {marqueeClients.map((client, index) => (
            <div
              key={`${client.id}-${index}`}
              className="group relative shrink-0 w-[230px] sm:w-[260px] bg-white hover:bg-slate-50/90 border border-slate-200/90 hover:border-[#44B9CD] rounded-2xl p-5 shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col items-center justify-center text-center cursor-default select-none"
            >
              {/* Vektörel Logo / İkon */}
              <div className="w-12 h-12 rounded-xl bg-slate-50 group-hover:bg-[#44B9CD]/10 border border-slate-100 group-hover:border-[#44B9CD]/30 text-[#0d788a] flex items-center justify-center mb-3 group-hover:scale-105 transition-all shadow-2xs">
                {client.symbol}
              </div>

              {/* Firma İsmi */}
              <div className="font-extrabold text-xs sm:text-sm tracking-wide text-slate-800 group-hover:text-[#0d788a] transition-colors leading-tight line-clamp-1 mb-1">
                {client.name}
              </div>

              {/* Sektör Etiketi */}
              <div className="text-[11px] text-slate-500 font-medium line-clamp-1">
                {client.sector}
              </div>

              {/* Alt ince aktif çizgi efekti */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 group-hover:w-16 h-[2px] bg-[#44B9CD] rounded-full transition-all duration-300" />
            </div>
          ))}
        </div>
      </div>

      {/* Alt Bilgi & Gizlilik Notu */}
      <div className="mt-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="pt-4 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Müşteri gizlilik protokollerimiz uyarınca seçili referanslarımız gösterilmektedir.</span>
          </div>
        </div>
      </div>
    </section>
  );
}

