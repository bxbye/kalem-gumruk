"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import {
  RefreshCw,
  Clock,
  ExternalLink,
  Pause,
  Play,
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

interface ExchangeRatesWidgetProps {
  compact?: boolean;
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

export default function ExchangeRatesWidget({ compact = false }: ExchangeRatesWidgetProps) {
  const { t } = useLanguage();
  const dw = t.deskWidgets;

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
        className={`rounded-xl border transition-all duration-200 group/item relative ${
          compact ? "p-2 sm:p-2.5" : "p-3.5 sm:p-4"
        } ${
          isGold
            ? "bg-gradient-to-r from-amber-50/90 to-yellow-50/80 border-amber-300/80 shadow-xs hover:border-amber-400 hover:shadow-md"
            : "bg-white border-slate-200/90 shadow-xs hover:border-[#44B9CD] hover:shadow-md"
        }`}
      >
        <div className="flex items-center justify-between gap-2.5 sm:gap-3">
          {/* Sol: Bayrak & Para Birimi */}
          <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
            <span className={`${compact ? "text-xl sm:text-2xl" : "text-2xl sm:text-3xl"} shrink-0 leading-none drop-shadow-xs`}>
              {meta.flag}
            </span>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span
                  className={`font-extrabold tracking-tight ${compact ? "text-xs sm:text-sm" : "text-sm sm:text-base"} ${
                    isGold ? "text-amber-900" : "text-[#1E2A3A]"
                  }`}
                >
                  {rate.code}
                </span>
                {rate.unit > 1 && (
                  <span className="text-[10px] text-slate-400 font-mono">
                    ({rate.unit})
                  </span>
                )}
                {isGold && (
                  <span className="text-[9px] font-bold bg-amber-200/80 text-amber-900 px-1 py-0.2 rounded inline-flex items-center gap-0.5">
                    <Coins className="w-2.5 h-2.5" />
                    {dw.caratLabel}
                  </span>
                )}
              </div>
              <div className="text-[11px] text-slate-500 truncate">{rate.name}</div>
            </div>
          </div>

          {/* Sağ: Alış & Satış Fiyatları */}
          <div className="flex items-center gap-2.5 sm:gap-4 text-right shrink-0">
            {/* Alış */}
            <div>
              <div className="text-[9px] uppercase font-semibold text-slate-400">
                {dw.buyLabel}
              </div>
              <div className={`font-mono font-semibold text-slate-700 ${compact ? "text-[11px] sm:text-xs" : "text-xs sm:text-sm"}`} dir="ltr">
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
            <div className={compact ? "min-w-[75px] sm:min-w-[90px]" : "min-w-[85px] sm:min-w-[105px]"}>
              <div className="text-[9px] uppercase font-bold text-emerald-700 flex items-center justify-end gap-1">
                <span>
                  {isGold ? dw.goldSaleLabel : dw.customsSaleLabel}
                </span>
              </div>
              <div
                className={`font-mono font-extrabold ${compact ? "text-xs sm:text-sm" : "text-sm sm:text-base"} ${
                  isGold ? "text-amber-900" : "text-[#1E2A3A]"
                }`}
                dir="ltr"
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
      className={`relative flex flex-col ${
        compact ? "h-full" : "h-[580px] max-h-[580px]"
      } bg-slate-50/60 rounded-2xl border border-slate-200/90 overflow-hidden group/rates`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* 1. Ticker Kontrol & Başlık Çubuğu */}
      <div className={`bg-white border-b border-slate-200/80 flex items-center justify-between shrink-0 z-20 ${
        compact ? "px-4 py-2" : "px-5 py-3.5"
      }`}>
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
          </span>
          <span className="text-xs font-bold text-[#1E2A3A]">
            {dw.ratesBoxTitle.replace("{count}", String(rates.length))}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setShowCalculator(!showCalculator)}
            className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-bold transition-colors cursor-pointer ${
              showCalculator
                ? "bg-[#44B9CD] text-white"
                : "bg-[#44B9CD]/10 text-[#0d788a] hover:bg-[#44B9CD]/20"
            }`}
            title={dw.calculateBtn}
          >
            <Calculator className="w-3 h-3" />
            <span className="hidden xs:inline">{dw.calculateBtn}</span>
          </button>

          <button
            onClick={() => setIsPaused(!isPaused)}
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
            title={isPaused ? "Play" : "Pause"}
            aria-label={isPaused ? "Play" : "Pause"}
          >
            {isPaused ? <Play className="w-3.5 h-3.5 text-emerald-600" /> : <Pause className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={fetchRates}
            disabled={loading}
            title="Refresh"
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-[#44B9CD]" : ""}`} />
          </button>
        </div>
      </div>

      {/* 2. Mini Çevirici Panel */}
      {showCalculator && (
        <div className="p-3 bg-gradient-to-r from-slate-900 to-[#1E2A3A] text-white border-b border-slate-700 animate-in slide-in-from-top-2 duration-200 z-30 shrink-0">
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="1"
              value={calcAmount}
              onChange={(e) => setCalcAmount(Math.max(0, Number(e.target.value)))}
              className="w-24 px-2 py-1 text-xs rounded-lg bg-white/10 border border-white/20 text-white font-mono focus:outline-none focus:border-[#44B9CD]"
            />
            <select
              value={calcCurrency}
              onChange={(e) => setCalcCurrency(e.target.value)}
              className="px-2 py-1 text-xs rounded-lg bg-white/10 border border-white/20 text-white font-bold focus:outline-none focus:border-[#44B9CD]"
            >
              {rates.map((r) => (
                <option key={r.code} value={r.code} className="bg-slate-900 text-white">
                  {r.code}
                </option>
              ))}
            </select>
            <span className="text-xs text-slate-400">=</span>
            <div className="flex-1 text-right">
              <span className="text-sm font-extrabold text-[#44B9CD] font-mono" dir="ltr">
                ₺{calculatedSelling}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 3. Degrade Maskeler */}
      <div className={`pointer-events-none absolute left-0 right-0 h-5 bg-gradient-to-b from-slate-50/90 to-transparent z-10 ${
        compact ? "top-10" : "top-20"
      }`} />
      <div className={`pointer-events-none absolute left-0 right-0 h-6 bg-gradient-to-t from-slate-50 to-transparent z-10 ${
        compact ? "bottom-7" : "bottom-10"
      }`} />

      {/* 4. GPU İpeksi Akış Konteyneri */}
      <div className={`flex-1 min-h-0 overflow-hidden select-none relative ${
        compact ? "p-2.5 space-y-2" : "p-4"
      }`}>
        {loading && !data ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-2">
            <RefreshCw className="w-5 h-5 animate-spin text-[#44B9CD]" />
            <span className="text-xs">{dw.ratesLoading}</span>
          </div>
        ) : (
          <div
            className={`animate-scroll-up ${compact ? "space-y-2" : "space-y-3"}`}
            style={{
              animationDuration: `${Math.max(16, rates.length * 1.5)}s`,
              animationPlayState: isPaused ? "paused" : "running",
            }}
          >
            {rates.map((rate, idx) => renderRateCard(rate, `set1-${rate.code}-${idx}`))}
            {rates.map((rate, idx) => renderRateCard(rate, `set2-${rate.code}-${idx}`))}
          </div>
        )}
      </div>

      {/* 5. Alt Bilgi Çubuğu */}
      <div className={`bg-white border-t border-slate-200/80 flex items-center justify-between text-[11px] text-slate-500 shrink-0 z-20 ${
        compact ? "px-4 py-1.5 text-[10px]" : "px-5 py-2.5 text-[11px]"
      }`}>
        <div className="flex items-center gap-1.5 truncate">
          <Clock className="w-3 h-3 text-[#44B9CD] shrink-0" />
          <span className="truncate">
            {dw.bulletinPrefix}{data?.bulletinNo || dw.currentLabel} ({data?.date || dw.todayLabel})
          </span>
        </div>

        <a
          href="https://www.tcmb.gov.tr/kurlar/kurlar_tr.html"
          target="_blank"
          rel="noopener noreferrer"
          className="font-bold text-[#1E2A3A] hover:text-[#44B9CD] shrink-0 inline-flex items-center gap-1 transition-colors ml-2"
        >
          <span>{dw.cbrtTableBtn}</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}
