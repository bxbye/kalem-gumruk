"use client";

import { useState } from "react";
import {
  Calculator,
  Search,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Sparkles,
  Info,
  DollarSign,
  TrendingDown,
  Layers,
} from "lucide-react";

interface CategoryTariff {
  id: string;
  name: string;
  gtipCode: string;
  defaultDutyRate: number; // Gümrük Vergisi %
  defaultIgvRate: number; // İlave Gümrük Vergisi %
  defaultKdvRate: number; // KDV %
  hasSpecialPermit: boolean;
  permitNote?: string;
}

const categories: CategoryTariff[] = [
  {
    id: "makine",
    name: "Sanayi Makineleri & Mekanik Parça",
    gtipCode: "Fasıl 84",
    defaultDutyRate: 2.2,
    defaultIgvRate: 0,
    defaultKdvRate: 20,
    hasSpecialPermit: true,
    permitNote: "Yatırım Teşvik Belgesi ile KDV ve GV muafiyeti uygulanabilir.",
  },
  {
    id: "elektronik",
    name: "Elektronik, Bilişim & Aksamlar",
    gtipCode: "Fasıl 85",
    defaultDutyRate: 3.3,
    defaultIgvRate: 10,
    defaultKdvRate: 20,
    hasSpecialPermit: true,
    permitNote: "CE işareti ve TAREKS denetimine tabidir.",
  },
  {
    id: "tekstil",
    name: "Tekstil, Kumaş & Hazır Giyim",
    gtipCode: "Fasıl 61 - 62",
    defaultDutyRate: 12.0,
    defaultIgvRate: 20.0,
    defaultKdvRate: 10,
    hasSpecialPermit: true,
    permitNote: "Dahilde İşleme Rejimi (DİR) ile vergisiz hammadde ithalatı yapılabilir.",
  },
  {
    id: "plastik",
    name: "Plastik Hammadde & Mamulleri",
    gtipCode: "Fasıl 39",
    defaultDutyRate: 6.5,
    defaultIgvRate: 0,
    defaultKdvRate: 20,
    hasSpecialPermit: false,
  },
  {
    id: "otomotiv",
    name: "Otomotiv Yedek Parça & Aksesuarlar",
    gtipCode: "Fasıl 8708",
    defaultDutyRate: 4.5,
    defaultIgvRate: 12.0,
    defaultKdvRate: 20,
    hasSpecialPermit: true,
    permitNote: "TSE ve Uygunluk denetimi aranabilir.",
  },
  {
    id: "kimya",
    name: "Kimya, Boya & Hammaddeler",
    gtipCode: "Fasıl 28 - 29",
    defaultDutyRate: 5.0,
    defaultIgvRate: 0,
    defaultKdvRate: 20,
    hasSpecialPermit: true,
    permitNote: "Çevre ve Şehircilik Bakanlığı / Sağlık onayları gerektirebilir.",
  },
  {
    id: "demir-celik",
    name: "Demir & Çelik Mamulleri",
    gtipCode: "Fasıl 72 - 73",
    defaultDutyRate: 6.0,
    defaultIgvRate: 0,
    defaultKdvRate: 20,
    hasSpecialPermit: false,
  },
];

export default function DutyCostCalculator() {
  const [selectedCatId, setSelectedCatId] = useState<string>("makine");
  const [invoiceAmount, setInvoiceAmount] = useState<number>(25000);
  const [currency, setCurrency] = useState<"USD" | "EUR">("USD");
  const [origin, setOrigin] = useState<"diger" | "ab">("diger"); // ab = ATR muafiyetli

  const selectedCategory =
    categories.find((c) => c.id === selectedCatId) || categories[0];

  // Hesaplamalar
  const baseDutyRate =
    origin === "ab" ? 0 : selectedCategory.defaultDutyRate;
  const baseIgvRate =
    origin === "ab" ? 0 : selectedCategory.defaultIgvRate;
  const kdvRate = selectedCategory.defaultKdvRate;

  // Vergiler
  const calculatedDuty = (invoiceAmount * baseDutyRate) / 100;
  const calculatedIgv = (invoiceAmount * baseIgvRate) / 100;
  const vatBase = invoiceAmount + calculatedDuty + calculatedIgv;
  const calculatedKdv = (vatBase * kdvRate) / 100;
  const totalTaxes = calculatedDuty + calculatedIgv + calculatedKdv;

  const quickAmounts = [10000, 25000, 50000, 100000];

  const handleTransferToForm = () => {
    // Form alanına scroll yap ve özel event fırlat
    const formElement = document.getElementById("teklif");
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth" });
    }
    // Custom event ile form bileşenine verileri ilet
    const event = new CustomEvent("customs_calc_transfer", {
      detail: {
        categoryName: selectedCategory.name,
        gtip: selectedCategory.gtipCode,
        amount: invoiceAmount,
        currency,
        origin: origin === "ab" ? "Avrupa Birliği (ATR)" : "Diğer Ülkeler",
      },
    });
    window.dispatchEvent(event);
  };

  return (
    <section className="py-16 bg-slate-100/70 border-y border-slate-200/80" id="hesaplama">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Başlık */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#44B9CD]/15 text-[#1E2A3A] text-xs font-bold uppercase tracking-wider">
            <Calculator className="w-3.5 h-3.5 text-[#44B9CD]" />
            <span>Maliyet Analiz Aracı</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1E2A3A]">
            Gümrük Vergisi & Masraf Ön Hesaplama Simülatörü
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            İthal etmeyi planladığınız eşya grubunu seçin; yaklaşık gümrük vergisi, İGV, KDV ve yasal
            maliyet kalemlerini anında simüle edin.
          </p>
        </div>

        {/* Ana Simülatör Kartı */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-slate-200 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Sol Kolon: Girdi Alanları */}
          <div className="lg:col-span-7 space-y-6">
            {/* 1. Eşya Kategorisi Seçimi */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                1. Eşya Kategorisi / Fasıl Seçimi
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCatId(cat.id)}
                    className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                      selectedCatId === cat.id
                        ? "border-[#44B9CD] bg-[#44B9CD]/5 ring-2 ring-[#44B9CD]/20"
                        : "border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    <span className="text-xs font-bold text-slate-900 line-clamp-1">
                      {cat.name}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono mt-1">
                      {cat.gtipCode} • GV: %{cat.defaultDutyRate}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Menşe Ülke Grubu */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                2. Menşe Grubu / Ticaret Anlaşması
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setOrigin("diger")}
                  className={`p-3 rounded-xl border text-center text-xs font-bold transition-all ${
                    origin === "diger"
                      ? "border-[#1E2A3A] bg-[#1E2A3A] text-white shadow-xs"
                      : "border-slate-200 text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <div>Uzak Doğu / Diğer Ülkeler</div>
                  <div className="text-[10px] opacity-80 font-normal">Standart Vergi Oranı</div>
                </button>

                <button
                  type="button"
                  onClick={() => setOrigin("ab")}
                  className={`p-3 rounded-xl border text-center text-xs font-bold transition-all ${
                    origin === "ab"
                      ? "border-[#44B9CD] bg-[#44B9CD] text-white shadow-xs"
                      : "border-slate-200 text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <div>Avrupa Birliği (A.TR / EUR.1)</div>
                  <div className="text-[10px] opacity-80 font-normal">Gümrük Vergisi: %0 Muaf</div>
                </button>
              </div>
            </div>

            {/* 3. Fatura CIF Tutarı & Para Birimi */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-700">
                  3. Fatura Bedeli (Mal + Navlun Bedeli)
                </label>
                <div className="flex items-center gap-1">
                  {(["USD", "EUR"] as const).map((curr) => (
                    <button
                      key={curr}
                      type="button"
                      onClick={() => setCurrency(curr)}
                      className={`px-2.5 py-1 text-[11px] font-bold rounded-lg border transition-all ${
                        currency === curr
                          ? "bg-[#1E2A3A] text-white border-transparent"
                          : "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200"
                      }`}
                    >
                      {curr}
                    </button>
                  ))}
                </div>
              </div>

              <div className="relative">
                <span className="absolute left-3.5 top-3 text-slate-400 font-bold text-sm">
                  {currency === "USD" ? "$" : "€"}
                </span>
                <input
                  type="number"
                  min="1000"
                  step="1000"
                  value={invoiceAmount}
                  onChange={(e) => setInvoiceAmount(Math.max(0, Number(e.target.value)))}
                  className="w-full pl-8 pr-4 py-2.5 text-base font-bold text-slate-900 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#44B9CD]"
                />
              </div>

              {/* Hızlı Tutar Çipleri */}
              <div className="flex flex-wrap gap-2 mt-2">
                {quickAmounts.map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setInvoiceAmount(amt)}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors"
                  >
                    {currency === "USD" ? "$" : "€"}
                    {amt.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>

            {/* Varsa Özel Not / Teşvik Bildirimi */}
            {selectedCategory.hasSpecialPermit && selectedCategory.permitNote && (
              <div className="p-3 bg-blue-50 border border-blue-200/80 rounded-xl flex items-start gap-2.5 text-xs text-blue-900">
                <Info className="w-4 h-4 text-[#44B9CD] shrink-0 mt-0.5" />
                <span className="leading-relaxed">{selectedCategory.permitNote}</span>
              </div>
            )}
          </div>

          {/* Sağ Kolon: Canlı Maliyet Dökümü Paneli */}
          <div className="lg:col-span-5 bg-[#1E2A3A] text-white rounded-2xl p-6 sm:p-7 shadow-xl space-y-5">
            <div className="border-b border-slate-700 pb-3 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-[#44B9CD] uppercase tracking-wider">
                  Simülasyon Özeti
                </span>
                <h3 className="text-base font-bold text-white">Tahmini Vergi Dökümü</h3>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-md bg-white/10 text-slate-300">
                {selectedCategory.gtipCode}
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-slate-800 text-slate-300">
                <span>Fatura CIF Bedeli:</span>
                <span className="font-bold text-white">
                  {currency === "USD" ? "$" : "€"}
                  {invoiceAmount.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-slate-800 text-slate-300">
                <span>Gümrük Vergisi (%{baseDutyRate}):</span>
                <span className="font-bold text-white">
                  {currency === "USD" ? "$" : "€"}
                  {calculatedDuty.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </span>
              </div>

              {baseIgvRate > 0 && (
                <div className="flex items-center justify-between py-1 border-b border-slate-800 text-slate-300">
                  <span>İlave Gümrük Vergisi (İGV %{baseIgvRate}):</span>
                  <span className="font-bold text-amber-400">
                    {currency === "USD" ? "$" : "€"}
                    {calculatedIgv.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between py-1 border-b border-slate-800 text-slate-300">
                <span>KDV (%{kdvRate}):</span>
                <span className="font-bold text-white">
                  {currency === "USD" ? "$" : "€"}
                  {calculatedKdv.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-slate-800 text-slate-400 text-[11px]">
                <span>Damga & Gümrük Tescil Harcı:</span>
                <span>Standart Bakanlık Tarifesi</span>
              </div>
            </div>

            {/* Toplam Vergi Kutusu */}
            <div className="p-4 bg-white/10 rounded-xl border border-white/10 space-y-1">
              <div className="text-[11px] text-slate-300">Tahmini Toplam Vergi Yükü:</div>
              <div className="text-2xl font-extrabold text-[#44B9CD]">
                {currency === "USD" ? "$" : "€"}
                {totalTaxes.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </div>
              <div className="text-[10px] text-slate-400">
                *Fatura bedelinin yaklaşık %{((totalTaxes / invoiceAmount) * 100).toFixed(1)}&apos;i oranında.
              </div>
            </div>

            <div className="text-[10px] text-slate-400 leading-relaxed italic">
              * Bu hesaplama gösterge niteliğinde simülasyondur. Eşyanızın net GTİP tespitine, menşe
              ispat belgelerine ve muafiyet haklarına göre nihai maliyet müşavirimiz tarafından
              çıkarılır.
            </div>

            {/* Aksiyon Butonu */}
            <button
              type="button"
              onClick={handleTransferToForm}
              className="w-full bg-[#44B9CD] hover:bg-[#2f9fb3] text-white font-bold py-3.5 px-4 rounded-xl text-xs transition-all flex items-center justify-center gap-2 shadow-md hover:scale-[1.01]"
            >
              <span>Bu Dosya İçin Resmi Teklif İste</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
