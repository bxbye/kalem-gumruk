"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import {
  RefreshCw,
  Clock,
  ExternalLink,
  Pause,
  Play,
  Calculator,
  ArrowLeftRight,
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
  { flag: string; symbol: string; badgeColor?: string }
> = {
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

const CURRENCY_LIST = [
  { code: "USD", name: "Amerikan Doları" },
  { code: "EUR", name: "Euro" },
  { code: "TRY", name: "Türk Lirası" },
  { code: "GBP", name: "İngiliz Sterlini" },
  { code: "CHF", name: "İsviçre Frangı" },
  { code: "CNY", name: "Çin Yuanı" },
  { code: "JPY", name: "Japon Yeni" },
  { code: "CAD", name: "Kanada Doları" },
  { code: "AUD", name: "Avustralya Doları" },
  { code: "RUB", name: "Rus Rublesi" },
  { code: "SAR", name: "Suudi Arabistan Riyali" },
  { code: "AED", name: "BAE Dirhemi" },
];

function getCurrencySymbol(code: string): string {
  switch (code) {
    case "TRY": return "₺";
    case "USD": return "$";
    case "EUR": return "€";
    case "GBP": return "£";
    case "JPY":
    case "CNY": return "¥";
    case "CHF": return "CHF";
    case "CAD": return "C$";
    case "AUD": return "A$";
    case "RUB": return "₽";
    default: return code;
  }
}

export default function ExchangeRatesWidget({ compact = false }: ExchangeRatesWidgetProps) {
  const { t } = useLanguage();
  const dw = t.deskWidgets;

  const [data, setData] = useState<RatesData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [showCalculator, setShowCalculator] = useState<boolean>(true);
  const [calcAmount, setCalcAmount] = useState<number>(1000);
  const [fromCurrency, setFromCurrency] = useState<string>("USD");
  const [toCurrency, setToCurrency] = useState<string>("EUR");

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

  const handleSwapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const getUnitPriceInTRY = (code: string): number => {
    if (code === "TRY") return 1;
    const item = rates.find((r) => r.code === code);
    if (!item || !item.selling || item.selling <= 0) {
      if (code === "USD") return 49.654;
      if (code === "EUR") return 54.2315;
      return 1;
    }
    return item.selling / (item.unit || 1);
  };

  const fromPriceInTRY = getUnitPriceInTRY(fromCurrency);
  const toPriceInTRY = getUnitPriceInTRY(toCurrency);
  const parity = toPriceInTRY > 0 ? fromPriceInTRY / toPriceInTRY : 1;
  const calculatedResult = calcAmount * parity;

  const formattedResult = calculatedResult.toLocaleString("tr-TR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: calculatedResult < 1 && calculatedResult > 0 ? 4 : 2,
  });

  const formattedParity = parity.toLocaleString("tr-TR", {
    minimumFractionDigits: 4,
    maximumFractionDigits: 4,
  });

  const renderRateCard = (rate: RateItem, key: string) => {
    const meta = CURRENCY_META[rate.code] || {
      flag: "🌐",
      symbol: rate.code,
      badgeColor: "bg-slate-100 text-slate-700",
    };

    return (
      <div
        key={key}
        className="rounded-lg border transition-all duration-200 group/item relative py-1.5 px-2 sm:px-2.5 bg-white/95 border-slate-200 shadow-2xs hover:border-[#44B9CD] hover:shadow-xs"
      >
        <div className="flex items-center justify-between gap-1.5 sm:gap-2">
          {/* Sol: Bayrak & Kod & İsim */}
          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
            <span className="text-base sm:text-lg shrink-0 leading-none drop-shadow-2xs">
              {meta.flag}
            </span>
            <div className="min-w-0">
              <div className="flex items-center gap-1">
                <span className="font-extrabold tracking-tight text-xs sm:text-[13px] leading-tight text-[#1E2A3A]">
                  {rate.code}
                </span>
                {rate.unit > 1 && (
                  <span className="text-[9px] text-slate-400 font-mono">
                    ({rate.unit})
                  </span>
                )}
              </div>
              <div className="text-[9.5px] sm:text-[10px] text-slate-500 truncate max-w-[65px] xs:max-w-[85px] sm:max-w-[105px] leading-tight">
                {rate.name}
              </div>
            </div>
          </div>

          {/* Sağ: Alış & Satış Fiyatları (Birbirine yakın ve net) */}
          <div className="flex items-center gap-2 sm:gap-2.5 text-right shrink-0">
            {/* Alış */}
            <div className="text-right">
              <div className="text-[8px] sm:text-[8.5px] uppercase font-semibold text-slate-400 leading-none mb-0.5">
                {dw.buyLabel}
              </div>
              <div className="font-mono font-semibold text-slate-700 text-[10.5px] sm:text-[11.5px] leading-tight" dir="ltr">
                ₺{rate.buying > 0
                  ? rate.buying.toLocaleString("tr-TR", {
                      minimumFractionDigits: 4,
                      maximumFractionDigits: 4,
                    })
                  : "--"}
              </div>
            </div>

            {/* Satış */}
            <div className="text-right">
              <div className="text-[8px] sm:text-[8.5px] uppercase font-bold text-emerald-600 leading-none mb-0.5">
                {dw.customsSaleLabel}
              </div>
              <div
                className="font-mono font-extrabold text-[10.5px] sm:text-[11.5px] leading-tight text-[#1E2A3A]"
                dir="ltr"
              >
                ₺{rate.selling > 0
                  ? rate.selling.toLocaleString("tr-TR", {
                      minimumFractionDigits: 4,
                      maximumFractionDigits: 4,
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
        compact ? "px-3 sm:px-4 py-2" : "px-5 py-3.5"
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
                ? "bg-[#44B9CD] text-white shadow-2xs"
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

      {/* 2. Orta Bölüm: Sol Ticker + Sağ Çapraz Kur Hesaplama Menüsü */}
      <div className="flex-1 min-h-0 flex overflow-hidden relative">
        {/* Sol: GPU İpeksi Akış Konteyneri */}
        <div className="flex-1 min-w-0 h-full overflow-hidden select-none relative p-2 sm:p-2.5">
          {/* Degrade Maskeler */}
          <div className="pointer-events-none absolute left-0 right-0 top-0 h-4 bg-gradient-to-b from-slate-50/90 to-transparent z-10" />
          <div className="pointer-events-none absolute left-0 right-0 bottom-0 h-5 bg-gradient-to-t from-slate-50 to-transparent z-10" />

          {loading && !data ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-2">
              <RefreshCw className="w-5 h-5 animate-spin text-[#44B9CD]" />
              <span className="text-xs">{dw.ratesLoading}</span>
            </div>
          ) : (
            <div
              className="animate-scroll-up space-y-1.5"
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

        {/* Sağ: Çapraz Kur Hesaplama Menüsü */}
        {showCalculator && (
          <div className="w-[185px] xs:w-[200px] sm:w-[220px] shrink-0 border-l border-slate-200/90 bg-gradient-to-b from-slate-900 via-[#182230] to-[#111827] text-white p-2 sm:p-2.5 flex flex-col justify-between z-20 shadow-xs">
            {/* Üst: Menü Başlığı */}
            <div className="flex items-center justify-between pb-1 border-b border-white/10 shrink-0">
              <div className="flex items-center gap-1.5">
                <div className="p-0.5 rounded bg-[#44B9CD]/20 text-[#44B9CD]">
                  <Calculator className="w-3 h-3" />
                </div>
                <span className="text-[11px] font-bold text-white tracking-wide">
                  {dw.crossRateTitle || "Çapraz Kur"}
                </span>
              </div>
              <span className="text-[8.5px] font-semibold text-[#44B9CD] bg-[#44B9CD]/15 px-1 py-0.2 rounded">
                TCMB
              </span>
            </div>

            {/* Tutar Girişi */}
            <div className="my-0.5 shrink-0">
              <input
                type="number"
                min="0"
                step="any"
                value={calcAmount === 0 ? "" : calcAmount}
                onChange={(e) => setCalcAmount(Math.max(0, Number(e.target.value) || 0))}
                placeholder="Tutar"
                className="w-full px-2 py-1 text-xs rounded-md bg-white/10 border border-white/20 text-white font-mono text-right focus:outline-none focus:border-[#44B9CD] focus:ring-1 focus:ring-[#44B9CD]"
              />
            </div>

            {/* Çapraz Kurlar & Değiştir Butonu */}
            <div className="flex items-center gap-1 my-0.5 shrink-0">
              <select
                value={fromCurrency}
                onChange={(e) => setFromCurrency(e.target.value)}
                className="flex-1 min-w-0 bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold text-[11px] rounded-md px-1 py-1 focus:outline-none focus:border-[#44B9CD] cursor-pointer"
              >
                {CURRENCY_LIST.map((c) => (
                  <option key={`from-${c.code}`} value={c.code} className="bg-slate-900 text-white">
                    {c.code}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={handleSwapCurrencies}
                title="Kurları Değiştir"
                className="p-1 rounded-md bg-white/10 hover:bg-[#44B9CD] hover:text-white text-white/80 transition-colors cursor-pointer shrink-0"
              >
                <ArrowLeftRight className="w-3 h-3" />
              </button>

              <select
                value={toCurrency}
                onChange={(e) => setToCurrency(e.target.value)}
                className="flex-1 min-w-0 bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold text-[11px] rounded-md px-1 py-1 focus:outline-none focus:border-[#44B9CD] cursor-pointer"
              >
                {CURRENCY_LIST.map((c) => (
                  <option key={`to-${c.code}`} value={c.code} className="bg-slate-900 text-white">
                    {c.code}
                  </option>
                ))}
              </select>
            </div>

            {/* Hesaplama Sonucu */}
            <div className="bg-white/[0.07] rounded-lg p-1.5 border border-white/10 text-right shrink-0 my-0.5">
              <div className="text-[9.5px] text-slate-300 font-medium truncate">
                {calcAmount.toLocaleString("tr-TR")} {fromCurrency} =
              </div>
              <div className="text-xs sm:text-sm font-extrabold text-[#44B9CD] font-mono tracking-tight leading-tight" dir="ltr">
                {formattedResult} {getCurrencySymbol(toCurrency)}
              </div>
            </div>

            {/* 1 Birim Parite Bilgisi */}
            <div className="pt-1 border-t border-white/10 text-center shrink-0">
              <span className="text-[9px] text-slate-400 font-mono inline-block truncate max-w-full">
                1 {fromCurrency} = {formattedParity} {toCurrency}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* 3. Alt Bilgi Çubuğu */}
      <div className={`bg-white border-t border-slate-200/80 flex items-center justify-between text-[11px] text-slate-500 shrink-0 z-20 ${
        compact ? "px-3 sm:px-4 py-1.5 text-[10px]" : "px-5 py-2.5 text-[11px]"
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
