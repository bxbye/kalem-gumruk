import { XMLParser } from "fast-xml-parser";

interface CurrencyRate {
  code: string;
  name: string;
  unit: number;
  buying: number;
  selling: number;
}

interface RatesResponse {
  date: string;
  bulletinNo: string;
  updatedAt: string;
  source: string;
  rates: CurrencyRate[];
}

const FALLBACK_RATES: RatesResponse = {
  date: new Date().toLocaleDateString("tr-TR"),
  bulletinNo: "GÜNCEL",
  updatedAt: new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" }),
  source: "T.C. Merkez Bankası",
  rates: [
    { code: "USD", name: "Amerikan Doları", unit: 1, buying: 49.5647, selling: 49.654 },
    { code: "EUR", name: "Euro", unit: 1, buying: 54.123, selling: 54.2315 },
    { code: "GBP", name: "İngiliz Sterlini", unit: 1, buying: 63.854, selling: 64.195 },
    { code: "CHF", name: "İsviçre Frangı", unit: 1, buying: 56.452, selling: 56.784 },
    { code: "CNY", name: "Çin Yuanı", unit: 1, buying: 6.842, selling: 6.932 },
    { code: "JPY", name: "100 Japon Yeni", unit: 100, buying: 32.784, selling: 33.052 },
    { code: "CAD", name: "Kanada Doları", unit: 1, buying: 35.84, selling: 36.12 },
    { code: "AUD", name: "Avustralya Doları", unit: 1, buying: 34.7, selling: 34.93 },
    { code: "RUB", name: "Rus Rublesi", unit: 1, buying: 0.512, selling: 0.528 },
  ],
};

const TARGET_CODES = ["USD", "EUR", "GBP", "CHF", "CNY", "JPY", "CAD", "AUD", "RUB", "SAR", "AED"];

function formatCurrencyName(code: string, originalName: string): string {
  switch (code) {
    case "USD": return "Amerikan Doları";
    case "EUR": return "Euro";
    case "GBP": return "İngiliz Sterlini";
    case "CHF": return "İsviçre Frangı";
    case "CNY": return "Çin Yuanı";
    case "JPY": return "100 Japon Yeni";
    case "CAD": return "Kanada Doları";
    case "AUD": return "Avustralya Doları";
    case "RUB": return "Rus Rublesi";
    case "SAR": return "Suudi Arabistan Riyali";
    case "AED": return "BAE Dirhemi";
    default: return originalName;
  }
}

// Bellek İçi Önbellek (In-Memory Cache) - 15 Dakika
let cachedRates: RatesResponse | null = null;
let lastFetchTime = 0;
const CACHE_TTL = 15 * 60 * 1000; // 15 dakika

export async function getExchangeRates(): Promise<RatesResponse> {
  const now = Date.now();
  if (cachedRates && now - lastFetchTime < CACHE_TTL) {
    return cachedRates;
  }

  try {
    const res = await fetch("https://www.tcmb.gov.tr/kurlar/today.xml", {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; KalemGumruk/1.0)" },
    });

    if (!res.ok) {
      if (cachedRates) return cachedRates;
      return FALLBACK_RATES;
    }

    const xmlText = await res.text();
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: "@_",
    });
    const parsed = parser.parse(xmlText);
    const dateAttr = parsed?.Tarih_Date?.["@_Tarih"] || new Date().toLocaleDateString("tr-TR");
    const bNoAttr = parsed?.Tarih_Date?.["@_Bulten_No"] || "GÜNCEL";
    const rawCurrencies = parsed?.Tarih_Date?.Currency || [];

    const currencyList = Array.isArray(rawCurrencies) ? rawCurrencies : [rawCurrencies];
    const rates: CurrencyRate[] = [];

    // Döviz kurlarını filtrele ve ekle
    TARGET_CODES.forEach((targetCode) => {
      const item = currencyList.find((c: any) => c?.["@_Kod"] === targetCode || c?.["@_CurrencyCode"] === targetCode);
      if (item) {
        const forexBuying = parseFloat(String(item.ForexBuying).replace(",", ".")) || 0;
        const forexSelling = parseFloat(String(item.ForexSelling).replace(",", ".")) || forexBuying;
        const unit = parseInt(String(item.Unit || "1"), 10) || 1;
        const name = formatCurrencyName(targetCode, item.Isim || item.CurrencyName || targetCode);

        rates.push({
          code: targetCode,
          name,
          unit,
          buying: Number(forexBuying.toFixed(4)),
          selling: Number(forexSelling.toFixed(4)),
        });
      }
    });

    cachedRates = {
      date: dateAttr,
      bulletinNo: bNoAttr,
      updatedAt: new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" }),
      source: "T.C. Merkez Bankası (TCMB)",
      rates,
    };
    lastFetchTime = now;

    return cachedRates;
  } catch (error) {
    console.warn("[TCMB] Kur verisi çekilemedi, önbellek veya fallback kullanılıyor:", error);
    if (cachedRates) return cachedRates;
    return FALLBACK_RATES;
  }
}
