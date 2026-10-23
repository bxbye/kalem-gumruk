import { NextResponse } from "next/server";

export interface RateItem {
  code: string;
  name: string;
  unit: number;
  buying: number;
  selling: number; // Gümrük beyannamelerinde esas alınan kur (Döviz Satış)
  change?: number;
}

export interface ExchangeRatesResponse {
  date: string;
  bulletinNo: string;
  updatedAt: string;
  rates: RateItem[];
  source: string;
}

// Fallback kurlar
const FALLBACK_RATES: ExchangeRatesResponse = {
  date: new Date().toLocaleDateString("tr-TR"),
  bulletinNo: "GÜNCEL",
  updatedAt: new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" }),
  source: "T.C. Merkez Bankası & Piyasa",
  rates: [
    { code: "GA", name: "Gram Altın", unit: 1, buying: 6385.4, selling: 6415.2 },
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

// Ons altından gram altın fiyatı hesaplama fonksiyonu
async function fetchGramGoldPrice(usdSelling: number): Promise<{ buying: number; selling: number }> {
  try {
    const res = await fetch("https://api.binance.com/api/v3/ticker/price?symbol=PAXGUSDT", {
      next: { revalidate: 300 }, // 5 dakikada bir güncelle
      headers: { "User-Agent": "Mozilla/5.0" },
    });
    if (res.ok) {
      const data = await res.json();
      const ounceUsd = parseFloat(data.price);
      if (ounceUsd > 0 && usdSelling > 0) {
        // 1 Ons = 31.1034768 gram
        const gramUsd = ounceUsd / 31.1034768;
        const gramSelling = Math.round(gramUsd * usdSelling * 100) / 100;
        const gramBuying = Math.round(gramSelling * 0.995 * 100) / 100;
        return { buying: gramBuying, selling: gramSelling };
      }
    }
  } catch (err) {
    console.error("Altın fiyatı alınamadı, fallback kullanılıyor:", err);
  }
  return { buying: 6385.4, selling: 6415.2 };
}

export async function GET() {
  try {
    const res = await fetch("https://www.tcmb.gov.tr/kurlar/today.xml", {
      next: { revalidate: 1800 }, // 30 dakikada bir önbelleği yenile
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; KalemGumruk/1.0)",
      },
    });

    if (!res.ok) {
      return NextResponse.json(FALLBACK_RATES);
    }

    const xmlText = await res.text();

    // Tarih ve Bülten No ayıkla
    const tarihMatch = xmlText.match(/Tarih="([^"]+)"/);
    const bultenMatch = xmlText.match(/Bulten_No="([^"]+)"/);
    const date = tarihMatch ? tarihMatch[1] : FALLBACK_RATES.date;
    const bulletinNo = bultenMatch ? bultenMatch[1] : FALLBACK_RATES.bulletinNo;

    // Currency bloklarını regex ile parse et
    const currencyRegex = /<Currency[^>]*Kod="([^"]+)"[^>]*>([\s\S]*?)<\/Currency>/g;
    const rates: RateItem[] = [];

    let match;
    let usdSellingRate = 49.654;

    while ((match = currencyRegex.exec(xmlText)) !== null) {
      const code = match[1];
      if (!TARGET_CODES.includes(code)) continue;

      const inner = match[2];
      const nameMatch = inner.match(/<Isim>([^<]+)<\/Isim>/);
      const unitMatch = inner.match(/<Unit>([^<]+)<\/Unit>/);
      const buyingMatch = inner.match(/<ForexBuying>([^<]*)<\/ForexBuying>/);
      const sellingMatch = inner.match(/<ForexSelling>([^<]*)<\/ForexSelling>/);

      const buying = buyingMatch && buyingMatch[1] ? parseFloat(buyingMatch[1]) : 0;
      const selling = sellingMatch && sellingMatch[1] ? parseFloat(sellingMatch[1]) : 0;
      const unit = unitMatch && unitMatch[1] ? parseInt(unitMatch[1], 10) : 1;
      const name = nameMatch && nameMatch[1] ? nameMatch[1].trim() : code;

      if (code === "USD" && selling > 0) {
        usdSellingRate = selling;
      }

      if (buying > 0 || selling > 0) {
        rates.push({
          code,
          name: formatCurrencyName(code, name),
          unit,
          buying,
          selling,
        });
      }
    }

    // Gram Altını hesaplayıp listenin en başına ekle
    const gold = await fetchGramGoldPrice(usdSellingRate);
    const finalRates: RateItem[] = [
      {
        code: "GA",
        name: "Gram Altın",
        unit: 1,
        buying: gold.buying,
        selling: gold.selling,
      },
      ...rates,
    ];

    return NextResponse.json({
      date,
      bulletinNo,
      updatedAt: new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" }),
      rates: finalRates,
      source: "TCMB Resmi Gösterge & Serbest Piyasa",
    });
  } catch (error) {
    console.error("Exchange rates fetch error:", error);
    return NextResponse.json(FALLBACK_RATES);
  }
}

function formatCurrencyName(code: string, originalName: string): string {
  switch (code) {
    case "USD":
      return "Amerikan Doları";
    case "EUR":
      return "Euro";
    case "GBP":
      return "İngiliz Sterlini";
    case "CHF":
      return "İsviçre Frangı";
    case "CNY":
      return "Çin Yuanı";
    case "JPY":
      return "100 Japon Yeni";
    case "RUB":
      return "Rus Rublesi";
    case "CAD":
      return "Kanada Doları";
    case "AUD":
      return "Avustralya Doları";
    case "SAR":
      return "Suudi Arabistan Riyali";
    case "AED":
      return "BAE Dirhemi";
    default:
      return originalName;
  }
}
