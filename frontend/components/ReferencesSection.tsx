"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { ChevronLeft, ChevronRight, Pause, Play, ShieldCheck, Building2 } from "lucide-react";

export interface ReferenceClient {
  id: string;
  name: string;
  sector: string;
  logoUrl?: string | null;
  symbol?: React.ReactNode;
}

// Sektöre veya isme göre kurumsal vektörel sembol üretici
function getReferenceSymbol(name: string, sector: string): React.ReactNode {
  const n = (name || "").toLowerCase();
  const s = (sector || "").toLowerCase();

  // 1. Kimya & Kozmetik
  if (s.includes("kimya") || s.includes("kozmetik") || n.includes("kimya")) {
    return (
      <svg viewBox="0 0 40 40" className="w-6 h-6 fill-current text-[#44B9CD]">
        <path d="M20 4L34 12V28L20 36L6 28V12L20 4Z" fillOpacity="0.15" stroke="currentColor" strokeWidth="2.5" />
        <circle cx="20" cy="20" r="5" fill="currentColor" />
        <line x1="20" y1="15" x2="20" y2="4" stroke="currentColor" strokeWidth="2" />
        <line x1="24" y1="23" x2="34" y2="28" stroke="currentColor" strokeWidth="2" />
        <line x1="16" y1="23" x2="6" y2="28" stroke="currentColor" strokeWidth="2" />
      </svg>
    );
  }

  // 2. Dış Ticaret & Uluslararası
  if (s.includes("ticaret") || n.includes("ticaret") || n.includes("atlas")) {
    return (
      <svg viewBox="0 0 40 40" className="w-6 h-6 fill-current text-indigo-600">
        <circle cx="20" cy="20" r="15" stroke="currentColor" strokeWidth="2.5" fill="none" />
        <ellipse cx="20" cy="20" rx="7" ry="15" stroke="currentColor" strokeWidth="2" fill="none" />
        <line x1="5" y1="20" x2="35" y2="20" stroke="currentColor" strokeWidth="2" />
        <line x1="8" y1="12" x2="32" y2="12" stroke="currentColor" strokeWidth="1.5" />
        <line x1="8" y1="28" x2="32" y2="28" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    );
  }

  // 3. Makine, İmalat & Endüstri
  if (s.includes("makine") || s.includes("endüstri") || s.includes("imalat") || n.includes("makina") || n.includes("erdem")) {
    return (
      <svg viewBox="0 0 40 40" className="w-6 h-6 fill-current text-amber-600">
        <path
          d="M20 12C15.58 12 12 15.58 12 20C12 24.42 15.58 28 20 28C24.42 28 28 24.42 28 20C28 15.58 24.42 12 20 12ZM20 24C17.79 24 16 22.21 16 20C16 17.79 17.79 16 20 16C22.21 16 24 17.79 24 20C24 22.21 22.21 24 20 24Z"
          fill="currentColor"
        />
        <circle cx="20" cy="20" r="13" stroke="currentColor" strokeWidth="2" fill="none" strokeDasharray="3 3" />
      </svg>
    );
  }

  // 4. Lojistik, Antrepo & Taşımacılık
  if (s.includes("lojistik") || s.includes("antrepo") || s.includes("tasima") || n.includes("pars") || n.includes("logistics")) {
    return (
      <svg viewBox="0 0 40 40" className="w-6 h-6 fill-current text-sky-600">
        <rect x="8" y="14" width="24" height="14" rx="2" stroke="currentColor" strokeWidth="2.5" fill="none" />
        <line x1="14" y1="14" x2="14" y2="28" stroke="currentColor" strokeWidth="1.5" />
        <line x1="20" y1="14" x2="20" y2="28" stroke="currentColor" strokeWidth="1.5" />
        <line x1="26" y1="14" x2="26" y2="28" stroke="currentColor" strokeWidth="1.5" />
        <path d="M12 9L20 5L28 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
      </svg>
    );
  }

  // 5. Tekstil & Konfeksiyon
  if (s.includes("tekstil") || s.includes("giyim") || n.includes("zenit") || n.includes("trendline")) {
    return (
      <svg viewBox="0 0 40 40" className="w-6 h-6 fill-current text-rose-600">
        <path d="M10 20C10 13 15 8 20 8C25 8 30 13 30 20C30 27 25 32 20 32C15 32 10 27 10 20Z" stroke="currentColor" strokeWidth="2.5" fill="none" />
        <path d="M14 20Q20 12 26 20Q20 28 14 20Z" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="20" cy="20" r="3" fill="currentColor" />
      </svg>
    );
  }

  // 6. Gıda & Tarım
  if (s.includes("gıda") || s.includes("gida") || s.includes("tarım") || s.includes("tarim") || n.includes("vita") || n.includes("viva")) {
    return (
      <svg viewBox="0 0 40 40" className="w-6 h-6 fill-current text-emerald-600">
        <path
          d="M20 7C20 7 28 10 30 18C32 26 25 33 20 33C15 33 8 26 10 18C12 10 20 7 20 7Z"
          stroke="currentColor"
          strokeWidth="2.5"
          fill="none"
        />
        <path d="M20 12V28M20 18C23 16 26 18 26 18M20 22C17 20 14 22 14 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }

  // 7. Otomotiv
  if (s.includes("otomotiv") || s.includes("oto") || n.includes("demir") || n.includes("argos")) {
    return (
      <svg viewBox="0 0 40 40" className="w-6 h-6 fill-current text-cyan-600">
        <polygon points="20,6 34,14 34,26 20,34 6,26 6,14" stroke="currentColor" strokeWidth="2.5" fill="none" />
        <polygon points="20,12 28,17 28,23 20,28 12,23 12,17" fill="currentColor" fillOpacity="0.3" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    );
  }

  // 8. Medikal & Sağlık & İlaç
  if (s.includes("medikal") || s.includes("sağlık") || s.includes("saglik") || s.includes("ilaç") || s.includes("ilac") || n.includes("tekno")) {
    return (
      <svg viewBox="0 0 40 40" className="w-6 h-6 fill-current text-teal-600">
        <circle cx="20" cy="20" r="14" stroke="currentColor" strokeWidth="2.5" fill="none" />
        <path d="M17 11H23V17H29V23H23V29H17V23H11V17H17V11Z" fill="currentColor" />
      </svg>
    );
  }

  // 9. Elektronik & Teknoloji
  if (s.includes("elektronik") || s.includes("teknoloji") || n.includes("solis")) {
    return (
      <svg viewBox="0 0 40 40" className="w-6 h-6 fill-current text-blue-600">
        <rect x="10" y="10" width="20" height="20" rx="3" stroke="currentColor" strokeWidth="2.5" fill="none" />
        <circle cx="20" cy="20" r="4" fill="currentColor" />
        <line x1="20" y1="5" x2="20" y2="10" stroke="currentColor" strokeWidth="2" />
        <line x1="20" y1="30" x2="20" y2="35" stroke="currentColor" strokeWidth="2" />
        <line x1="5" y1="20" x2="10" y2="20" stroke="currentColor" strokeWidth="2" />
        <line x1="30" y1="20" x2="35" y2="20" stroke="currentColor" strokeWidth="2" />
      </svg>
    );
  }

  // 10. Enerji & İletim
  if (s.includes("enerji") || n.includes("enerji") || n.includes("kent")) {
    return (
      <svg viewBox="0 0 40 40" className="w-6 h-6 fill-current text-emerald-500">
        <circle cx="20" cy="20" r="13" stroke="currentColor" strokeWidth="2" strokeDasharray="3 3" fill="none" />
        <polygon points="21,7 13,21 19,21 17,33 27,17 21,17" fill="currentColor" />
      </svg>
    );
  }

  // 11. Metal, Çelik & Ağır Sanayi
  if (s.includes("metal") || s.includes("çelik") || s.includes("celik") || n.includes("promet")) {
    return (
      <svg viewBox="0 0 40 40" className="w-6 h-6 fill-current text-slate-700">
        <path d="M20 5L33 13V27L20 35L7 27V13L20 5Z" stroke="currentColor" strokeWidth="2" fill="none" />
        <path d="M20 5V35M7 13L33 27M7 27L33 13" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    );
  }

  // Varsayılan Kurumsal Logo Simgesi
  return <Building2 className="w-6 h-6 text-[#44B9CD]" />;
}

// Başlangıç Referans Verileri
const INITIAL_CLIENTS: ReferenceClient[] = [
  {
    id: "ref-1",
    name: "NOVA KİMYA",
    sector: "Kimya & Kozmetik",
    symbol: getReferenceSymbol("NOVA KİMYA", "Kimya & Kozmetik"),
  },
  {
    id: "ref-2",
    name: "ATLAS DIŞ TİCARET",
    sector: "Uluslararası Ticaret",
    symbol: getReferenceSymbol("ATLAS DIŞ TİCARET", "Uluslararası Ticaret"),
  },
  {
    id: "ref-3",
    name: "ERDEM MAKİNA",
    sector: "Endüstri & İmalat",
    symbol: getReferenceSymbol("ERDEM MAKİNA", "Endüstri & İmalat"),
  },
  {
    id: "ref-4",
    name: "PARS LOJİSTİK",
    sector: "Lojistik & Antrepo",
    symbol: getReferenceSymbol("PARS LOJİSTİK", "Lojistik & Antrepo"),
  },
  {
    id: "ref-5",
    name: "ZENİT TEKSTİL",
    sector: "Tekstil & Hazır Giyim",
    symbol: getReferenceSymbol("ZENİT TEKSTİL", "Tekstil & Hazır Giyim"),
  },
  {
    id: "ref-6",
    name: "VİTA GIDA",
    sector: "Gıda & Tarım",
    symbol: getReferenceSymbol("VİTA GIDA", "Gıda & Tarım"),
  },
  {
    id: "ref-7",
    name: "GLOBAL LOGISTICS GROUP",
    sector: "Lojistik & Antrepo",
    symbol: getReferenceSymbol("GLOBAL LOGISTICS GROUP", "Lojistik & Antrepo"),
  },
  {
    id: "ref-8",
    name: "DEMİR OTOMOTİV YAN SANAYİ",
    sector: "Otomotiv",
    symbol: getReferenceSymbol("DEMİR OTOMOTİV YAN SANAYİ", "Otomotiv"),
  },
  {
    id: "ref-9",
    name: "MEGA KİMYA SANAYİ",
    sector: "Kimya & Hammadde",
    symbol: getReferenceSymbol("MEGA KİMYA SANAYİ", "Kimya & Hammadde"),
  },
  {
    id: "ref-10",
    name: "TEKNOMED SAĞLIK ÜRÜNLERİ",
    sector: "Medikal & İlaç",
    symbol: getReferenceSymbol("TEKNOMED SAĞLIK ÜRÜNLERİ", "Medikal & İlaç"),
  },
];

// Tekil Referans Kartı Bileşeni
function ReferenceCard({ client }: { client: ReferenceClient }) {
  const [imgFailed, setImgFailed] = useState(false);
  const hasValidLogo = Boolean(client.logoUrl && client.logoUrl.trim() !== "" && !imgFailed);

  return (
    <div
      className="group relative shrink-0 w-[220px] sm:w-[250px] h-[138px] bg-white hover:bg-slate-50/90 border border-slate-200/90 hover:border-[#44B9CD] rounded-2xl p-4 shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col items-center justify-center text-center cursor-default select-none"
    >
      {/* Logo veya Vektörel Sektör İşareti */}
      <div className="h-12 w-full flex items-center justify-center mb-2">
        {hasValidLogo ? (
          <img
            src={client.logoUrl!}
            alt={client.name}
            className="max-h-10 max-w-[130px] w-auto h-auto object-contain filter grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
            onError={() => setImgFailed(true)}
            loading="lazy"
          />
        ) : (
          <div className="w-11 h-11 rounded-xl bg-slate-50 group-hover:bg-[#44B9CD]/10 border border-slate-100 group-hover:border-[#44B9CD]/30 flex items-center justify-center transition-all group-hover:scale-105 shadow-2xs">
            {client.symbol || <Building2 className="w-5 h-5 text-[#44B9CD]" />}
          </div>
        )}
      </div>

      {/* Firma İsmi */}
      <h3
        title={client.name}
        className="font-extrabold text-xs sm:text-[13px] tracking-wide text-slate-800 group-hover:text-[#0d788a] transition-colors leading-tight line-clamp-1 mb-1 max-w-full px-1"
      >
        {client.name}
      </h3>

      {/* Sektör Etiketi */}
      <p
        title={client.sector}
        className="text-[11px] text-slate-500 font-medium line-clamp-1 max-w-full px-1"
      >
        {client.sector}
      </p>

      {/* Alt ince aktif çizgi efekti */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 group-hover:w-16 h-[2px] bg-[#44B9CD] rounded-full transition-all duration-300" />
    </div>
  );
}

export default function ReferencesSection() {
  const { t, isRTL } = useLanguage();
  const [clientsList, setClientsList] = useState<ReferenceClient[]>(INITIAL_CLIENTS);
  const [isPaused, setIsPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Veritabanından dinamik referansları çek ve sembolleriyle eşle
  useEffect(() => {
    fetch("/api/public/references")
      .then((res) => res.json())
      .then((data) => {
        const items = data.references || data.items;
        if (data.success && Array.isArray(items) && items.length > 0) {
          const activeRefs = items.filter((r: any) => r.isActive !== 0 && r.isActive !== false);
          if (activeRefs.length > 0) {
            const mapped: ReferenceClient[] = activeRefs.map((item: any, idx: number) => {
              return {
                id: item.id || `ref-${idx}`,
                name: item.name,
                sector: item.sector,
                logoUrl: item.logoUrl && item.logoUrl.trim() !== "" ? item.logoUrl.trim() : null,
                symbol: getReferenceSymbol(item.name, item.sector),
              };
            });
            setClientsList(mapped);
          }
        }
      })
      .catch(() => {});
  }, []);

  // Listenin her yarısının en az 12 kart içermesini sağlayarak her ekran boyutunda (4K dahil)
  // boşluksuz, pürüzsüz ve asla kaybolmayan kesintisiz bir döngü kuruyoruz
  const displayList = useMemo(() => {
    if (!clientsList || clientsList.length === 0) return [];
    let singleHalf = [...clientsList];
    while (singleHalf.length < 12) {
      singleHalf = [...singleHalf, ...clientsList];
    }
    // İki özdeş yarı (Half 1 ve Half 2)
    return [...singleHalf, ...singleHalf];
  }, [clientsList]);

  const handlePrev = () => {
    if (!containerRef.current) return;
    containerRef.current.scrollBy({ left: -320, behavior: "smooth" });
  };

  const handleNext = () => {
    if (!containerRef.current) return;
    containerRef.current.scrollBy({ left: 320, behavior: "smooth" });
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
          className="animate-marquee-slow flex items-stretch gap-4 sm:gap-5"
          style={{
            animationDuration: `${Math.max(45, Math.round(displayList.length * 1.8))}s`,
            animationPlayState: isPaused ? "paused" : "running",
            WebkitBackfaceVisibility: "hidden",
            backfaceVisibility: "hidden",
            transform: "translate3d(0, 0, 0)",
          }}
        >
          {displayList.map((client, index) => (
            <ReferenceCard
              key={`${client.id}-${index}`}
              client={client}
            />
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
