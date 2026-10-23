"use client";

import { useEffect, useState } from "react";
import {
  TrendingUp,
  RefreshCw,
  Clock,
  ExternalLink,
  Pause,
  Play,
  ChevronDown,
  Coins,
  Calculator,
} from "lucide-react";

interface RateItem {
  code: string;
  name: string;
  unit: number;
  buying: number;
  selling: number;
}

interface RatesData {
  date: string;
  bulletinNo: string;
  updatedAt: string;
  rates: RateItem[];
  source: string;
}

const CURRENCY_META: Record<
  string,
  { flag: string; symbol: string; badgeColor?: string; isGold?: boolean }
> = {
  GA: { flag: "🪙", symbol: "GR", badgeColor: "bg-amber-100 text-amber-800 border-amber-300", isGold: true },
  USD: { flag: "🇺🇸", symbol: "$", badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  EUR: { flag: "🇪🇺", symbol: "€", badgeColor: "bg-blue-50 text-blue-700 border-blue-200" },
  GBP: { flag: "🇬🇧", symbol: "£", badgeColor: "bg-indigo-50 text-indigo-700 border-indigo-200" },
  CHF: { flag: "🇨🇭", symbol: "CHF", badgeColor: "bg-red-50 text-red-700 border-red-200" },
  CNY: { flag: "🇨🇳", symbol: "¥", badgeColor: "bg-rose-50 text-rose-700 border-rose-200" },
  JPY: { flag: "🇯🇵", symbol: "¥", badgeColor: "bg-slate-100 text-slate-700 border-slate-200" },
  CAD: { flag: "🇨🇦", symbol: "C$", badgeColor: "bg-red-50 text-red-700 border-red-200" },
  AUD: { flag: "🇦🇺", symbol: "A$", badgeColor: "bg-amber-50 text-amber-700 border-amber-200" },
  RUB: { flag: "🇷🇺", symbol: "₽", badgeColor: "bg-slate-100 text-slate-700 border-slate-200" },
  SAR: { flag: "🇸🇦", symbol: "SAR", badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  AED: { flag: "🇦🇪", symbol: "AED", badgeColor: "bg-slate-100 text-slate-700 border-slate-200" },
};

export default function ExchangeRatesWidget() {
  const [data, setData] = useState<RatesData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [showCalculator, setShowCalculator] = useState<boolean>(false);
  const [calcAmount, setCalcAmount] = useState<number>(1000);
  const [calcCurrency, setCalcCurrency] = useState<string>("USD");

  const fetchRates = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/exchange-rates");
      const json = await res.json();
      setData(json);
    } catch (e) {
      console.error("Kur bilgileri alınamadı:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRates();
  }, []);

  const rates = data?.rates || [];

  const selectedRate = rates.find((r) => r.code === calcCurrency);
  const calculatedSelling =
    selectedRate && selectedRate.selling
      ? ((calcAmount / selectedRate.unit) * selectedRate.selling).toLocaleString("tr-TR", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      : "0,00";

  const renderRateCard = (rate: RateItem, key: string) => {
    const meta = CURRENCY_META[rate.code] || {
      flag: "🌐",
      symbol: rate.code,
      badgeColor: "bg-slate-100 text-slate-700",
      isGold: false,
    };

    const isGold = meta.isGold;

    return (
      <div
        key={key}
        className={`rounded-xl p-3.5 sm:p-4 border transition-all duration-200 group/item relative ${
          isGold
            ? "bg-gradient-to-r from-amber-50/90 to-yellow-50/80 border-amber-300/80 shadow-xs hover:border-amber-400 hover:shadow-md"
            : "bg-white border-slate-200/90 shadow-xs hover:border-[#44B9CD] hover:shadow-md"
        }`}
      >
        <div className="flex items-center justify-between gap-3">
          {/* Sol: Bayrak & Para Birimi */}
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-2xl sm:text-3xl shrink-0 leading-none drop-shadow-xs">
              {meta.flag}
            </span>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span
                  className={`font-extrabold text-sm sm:text-base tracking-tight ${
                    isGold ? "text-amber-900" : "text-[#1E2A3A]"
                  }`}
                >
                  {rate.code}
                </span>
                {rate.unit > 1 && (
                  <span className="text-[10px] text-slate-400 font-mono">
                    ({rate.unit} birim)
                  </span>
                )}
                {isGold && (
                  <span className="text-[10px] font-bold bg-amber-200/80 text-amber-900 px-1.5 py-0.2 rounded inline-flex items-center gap-0.5">
                    <Coins className="w-2.5 h-2.5" />
                    24 Ayar
                  </span>
                )}
              </div>
              <div className="text-xs text-slate-500 truncate">{rate.name}</div>
            </div>
          </div>

          {/* Sağ: Alış & Satış Fiyatları */}
          <div className="flex items-center gap-3 sm:gap-5 text-right shrink-0">
            {/* Alış */}
            <div>
              <div className="text-[10px] uppercase font-semibold text-slate-400">
                Alış
              </div>
              <div className="font-mono text-xs sm:text-sm font-semibold text-slate-700">
                ₺
                {rate.buying > 0
                  ? rate.buying.toLocaleString("tr-TR", {
                      minimumFractionDigits: isGold ? 2 : 4,
                      maximumFractionDigits: isGold ? 2 : 4,
                    })
                  : "--"}
              </div>
            </div>

            {/* Satış (Gümrük Kuru) */}
            <div className="min-w-[85px] sm:min-w-[105px]">
              <div className="text-[10px] uppercase font-bold text-emerald-700 flex items-center justify-end gap-1">
                <span>{isGold ? "Satış" : "Gümrük Satış"}</span>
              </div>
              <div
                className={`font-mono text-sm sm:text-base font-extrabold ${
                  isGold ? "text-amber-900" : "text-[#1E2A3A]"
                }`}
              >
                ₺
                {rate.selling > 0
                  ? rate.selling.toLocaleString("tr-TR", {
                      minimumFractionDigits: isGold ? 2 : 4,
                      maximumFractionDigits: isGold ? 2 : 4,
                    })
                  : "--"}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      className="relative flex flex-col h-[580px] max-h-[580px] bg-slate-50/60 rounded-2xl border border-slate-200/90 overflow-hidden group/rates"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* 1. Ticker Kontrol & Başlık Çubuğu */}
      <div className="px-5 py-3.5 bg-white border-b border-slate-200/80 flex items-center justify-between shrink-0 z-20">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
          </span>
          <span className="text-xs font-bold text-[#1E2A3A]">
            TCMB & Piyasa ({rates.length} Birim)
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

          <button
            onClick={fetchRates}
            disabled={loading}
            title="Kurları Yenile"
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors disabled:opacity-50 ml-1"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-[#44B9CD]" : ""}`} />
          </button>
        </div>
      </div>

      {/* 2. Açılır-Kapanır Hesaplama Çubuğu */}
      <div className="shrink-0 z-20 bg-white/95 border-b border-slate-200/90 transition-all">
        <div className="px-4 py-2 flex items-center justify-between">
          <button
            onClick={() => setShowCalculator(!showCalculator)}
            className="inline-flex items-center gap-2 text-xs font-bold text-[#1E2A3A] hover:text-[#44B9CD] transition-colors group/btn"
          >
            <span className="p-1 rounded-md bg-[#44B9CD]/10 text-[#44B9CD] group-hover/btn:bg-[#44B9CD] group-hover/btn:text-white transition-colors">
              <Calculator className="w-3 h-3" />
            </span>
            <span>Hızlı Kur & Gümrük Hesaplama</span>
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform duration-200 text-slate-400 ${
                showCalculator ? "rotate-180 text-[#44B9CD]" : ""
              }`}
            />
          </button>

          <button
            onClick={() => setShowCalculator(!showCalculator)}
            className="text-[11px] font-semibold text-[#44B9CD] hover:underline"
          >
            {showCalculator ? "Kapat" : "Hesapla"}
          </button>
        </div>

        {showCalculator && (
          <div className="px-4 pb-3 pt-1 border-t border-slate-100 bg-slate-50/80 animate-fadeIn">
            <div className="grid grid-cols-12 gap-2 items-center">
              <div className="col-span-5 sm:col-span-4">
                <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">
                  Miktar
                </label>
                <input
                  type="number"
                  min="0"
                  value={calcAmount}
                  onChange={(e) => setCalcAmount(Math.max(0, Number(e.target.value)))}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-mono bg-white focus:outline-none focus:border-[#44B9CD] shadow-xs"
                  placeholder="1000"
                />
              </div>

              <div className="col-span-7 sm:col-span-4">
                <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">
                  Birim / Döviz
                </label>
                <select
                  value={calcCurrency}
                  onChange={(e) => setCalcCurrency(e.target.value)}
                  className="w-full px-2 py-1.5 rounded-lg border border-slate-200 text-xs bg-white focus:outline-none focus:border-[#44B9CD] shadow-xs truncate"
                >
                  {rates.map((r) => (
                    <option key={r.code} value={r.code}>
                      {r.code === "GA" ? "🪙 Gram Altın (GA)" : `${r.code} - ${r.name}`}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-span-12 sm:col-span-4">
                <label className="block text-[10px] font-semibold text-emerald-700 mb-0.5">
                  TL Karşılığı
                </label>
                <div className="px-2.5 py-1.5 rounded-lg bg-emerald-50/90 border border-emerald-200 flex items-center justify-between text-xs">
                  <span className="text-[10px] text-emerald-800 font-medium">Toplam:</span>
                  <span className="font-mono font-extrabold text-[#1E2A3A] truncate ml-1">
                    ₺{calculatedSelling}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3. Üst ve Alt Gradyan Yumuşatma Katmanı (Fade Mask) */}
      <div className="pointer-events-none absolute top-20 left-0 right-0 h-6 bg-gradient-to-b from-slate-50/90 to-transparent z-10" />
      <div className="pointer-events-none absolute bottom-10 left-0 right-0 h-8 bg-gradient-to-t from-slate-50 to-transparent z-10" />

      {/* 4. Donanım Hızlandırmalı GPU İpeksi Akış Konteyneri (Aşağıdan Yukarıya - Takılmasız) */}
      <div className="flex-1 min-h-0 overflow-hidden p-4 select-none relative">
        {loading && !data ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-2">
            <RefreshCw className="w-6 h-6 animate-spin text-[#44B9CD]" />
            <span className="text-xs">Kurlar ve Gram Altın fiyatı alınıyor...</span>
          </div>
        ) : (
          <div
            className="space-y-3 animate-scroll-up"
            style={{
              animationDuration: `${Math.max(18, rates.length * 1.6)}s`,
              animationPlayState: isPaused ? "paused" : "running",
            }}
          >
            {/* 1. Set */}
            {rates.map((rate, idx) => renderRateCard(rate, `set1-${rate.code}-${idx}`))}

            {/* 2. Set (Kesintisiz döngü için tam eş kopyası) */}
            {rates.map((rate, idx) => renderRateCard(rate, `set2-${rate.code}-${idx}`))}
          </div>
        )}
      </div>

      {/* 5. Alt Bilgi Çubuğu */}
      <div className="px-5 py-2.5 bg-white border-t border-slate-200/80 flex items-center justify-between text-[11px] text-slate-500 shrink-0 z-20">
        <div className="flex items-center gap-1.5 truncate">
          <Clock className="w-3.5 h-3.5 text-[#44B9CD] shrink-0" />
          <span className="truncate">
            Bülten: {data?.bulletinNo || "Güncel"} ({data?.date || "Bugün"})
          </span>
        </div>

        <a
          href="https://www.tcmb.gov.tr/kurlar/kurlar_tr.html"
          target="_blank"
          rel="noopener noreferrer"
          className="font-bold text-[#1E2A3A] hover:text-[#44B9CD] shrink-0 inline-flex items-center gap-1 transition-colors ml-2"
        >
          <span>TCMB Tablosu</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}
