"use client";

import { useState, useEffect } from "react";
import { Award, ChevronLeft, ChevronRight, Pause, Play, ShieldCheck } from "lucide-react";

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
      <svg viewBox="0 0 40 40" className="w-8 h-8 fill-current text-[#44B9CD]">
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
      <svg viewBox="0 0 40 40" className="w-8 h-8 fill-current text-indigo-600">
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
      <svg viewBox="0 0 40 40" className="w-8 h-8 fill-current text-amber-600">
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
      <svg viewBox="0 0 40 40" className="w-8 h-8 fill-current text-rose-600">
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
      <svg viewBox="0 0 40 40" className="w-8 h-8 fill-current text-emerald-600">
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
      <svg viewBox="0 0 40 40" className="w-8 h-8 fill-current text-cyan-600">
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
      <svg viewBox="0 0 40 40" className="w-8 h-8 fill-current text-blue-600">
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
      <svg viewBox="0 0 40 40" className="w-8 h-8 fill-current text-teal-600">
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
      <svg viewBox="0 0 40 40" className="w-8 h-8 fill-current text-slate-700">
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
      <svg viewBox="0 0 40 40" className="w-8 h-8 fill-current text-emerald-500">
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
      <svg viewBox="0 0 40 40" className="w-8 h-8 fill-current text-orange-600">
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
      <svg viewBox="0 0 40 40" className="w-8 h-8 fill-current text-violet-600">
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
      <svg viewBox="0 0 40 40" className="w-8 h-8 fill-current text-sky-600">
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
      <svg viewBox="0 0 40 40" className="w-8 h-8 fill-current text-blue-700">
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
      <svg viewBox="0 0 40 40" className="w-8 h-8 fill-current text-pink-600">
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
      <svg viewBox="0 0 40 40" className="w-8 h-8 fill-current text-lime-600">
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
      <svg viewBox="0 0 40 40" className="w-8 h-8 fill-current text-amber-500">
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
      <svg viewBox="0 0 40 40" className="w-8 h-8 fill-current text-rose-500">
        <path d="M20 28C20 28 12 24 10 16C16 16 19 22 20 28Z" fill="currentColor" fillOpacity="0.4" stroke="currentColor" strokeWidth="1.5" />
        <path d="M20 28C20 28 28 24 30 16C24 16 21 22 20 28Z" fill="currentColor" fillOpacity="0.4" stroke="currentColor" strokeWidth="1.5" />
        <path d="M20 28V10C22 15 23 22 20 28Z" fill="currentColor" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
];

const ITEMS_PER_PAGE = 6;
const TOTAL_PAGES = Math.ceil(CLIENTS.length / ITEMS_PER_PAGE);
const AUTO_ROTATE_INTERVAL = 3500; // 3.5 saniye

export default function ReferencesSection() {
  const [currentPage, setCurrentPage] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      handleNextPage();
    }, AUTO_ROTATE_INTERVAL);

    return () => clearInterval(timer);
  }, [currentPage, isPaused]);

  const changePage = (newPage: number) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentPage(newPage);
      setIsTransitioning(false);
    }, 200);
  };

  const handleNextPage = () => {
    changePage((currentPage + 1) % TOTAL_PAGES);
  };

  const handlePrevPage = () => {
    changePage((currentPage - 1 + TOTAL_PAGES) % TOTAL_PAGES);
  };

  const currentClients = CLIENTS.slice(
    currentPage * ITEMS_PER_PAGE,
    (currentPage + 1) * ITEMS_PER_PAGE
  );

  return (
    <section
      aria-label="Referanslarımız"
      className="py-12 bg-gradient-to-b from-slate-50 via-white to-slate-50 border-t border-slate-200/90 relative overflow-hidden select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Arka plan dekoratif hafif ızgara deseni */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#0F172A 1px, transparent 1px)`,
          backgroundSize: "20px 20px",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Üst Başlık & Kontroller */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#44B9CD]/10 text-[#0d788a] text-[11px] font-bold tracking-wider uppercase mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-[#44B9CD]" />
              <span>GÜVENİLİR İŞ ORTAKLIKLARI</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Referanslarımız
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
              Türkiye&apos;nin öncü sanayi kuruluşları ve dış ticaret firmaları, gümrükleme ve lojistik
              süreçlerinde Kalem Gümrük Müşavirliği&apos;ne güveniyor.
            </p>
          </div>

          {/* Kontrol Butonları & Sayaç */}
          <div className="flex items-center gap-2 self-start md:self-end">
            <span className="text-[11px] font-medium text-slate-400 mr-1">
              Grup {currentPage + 1} / {TOTAL_PAGES}
            </span>

            <button
              type="button"
              onClick={handlePrevPage}
              className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-600 transition-colors shadow-xs"
              title="Önceki Referanslar"
              aria-label="Önceki referans grubu"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => setIsPaused(!isPaused)}
              className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-600 transition-colors shadow-xs"
              title={isPaused ? "Otomatik Geçişi Başlat" : "Otomatik Geçişi Duraklat"}
              aria-label={isPaused ? "Başlat" : "Duraklat"}
            >
              {isPaused ? <Play className="w-4 h-4 text-emerald-600" /> : <Pause className="w-4 h-4" />}
            </button>

            <button
              type="button"
              onClick={handleNextPage}
              className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-600 transition-colors shadow-xs"
              title="Sonraki Referanslar"
              aria-label="Sonraki referans grubu"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Küçük Logolar Izgarası (Birkaç saniyede bir değişen grup) */}
        <div
          className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 transition-all duration-300 transform ${
            isTransitioning ? "opacity-0 scale-[0.98]" : "opacity-100 scale-100"
          }`}
        >
          {currentClients.map((client) => (
            <div
              key={client.id}
              className="group relative bg-white rounded-xl border border-slate-200/90 hover:border-[#44B9CD]/50 p-4 flex flex-col items-center justify-center text-center shadow-xs hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 min-h-[110px]"
            >
              {/* Küçük Vektörel Logo İkonu */}
              <div className="shrink-0 mb-2 p-1.5 rounded-lg bg-slate-50 group-hover:bg-[#44B9CD]/10 transition-colors duration-300 flex items-center justify-center">
                {client.symbol}
              </div>

              {/* Firma İsmi */}
              <div className="font-extrabold text-[12px] tracking-wide text-slate-800 group-hover:text-[#0d788a] transition-colors leading-tight line-clamp-1">
                {client.name}
              </div>

              {/* Sektör Etiketi */}
              <div className="text-[10px] text-slate-600 mt-0.5 line-clamp-1">
                {client.sector}
              </div>

              {/* Alt ince aktif çizgi efekti */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 group-hover:w-12 h-[2px] bg-[#44B9CD] rounded-full transition-all duration-300" />
            </div>
          ))}
        </div>

        {/* Sayfa Nokta Göstergeleri (Dots) & Gizlilik Notu */}
        <div className="mt-8 pt-4 border-t border-slate-200/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Müşteri gizlilik protokollerimiz uyarınca seçili referanslarımız gösterilmektedir.</span>
          </div>

          <div className="flex items-center gap-1.5">
            {Array.from({ length: TOTAL_PAGES }).map((_, index) => (
              <button
                key={index}
                onClick={() => changePage(index)}
                aria-label={`Referans sayfası ${index + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  currentPage === index
                    ? "w-6 bg-[#44B9CD]"
                    : "w-2 bg-slate-300 hover:bg-slate-400"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
