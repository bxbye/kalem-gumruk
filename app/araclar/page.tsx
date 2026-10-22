import type { Metadata } from "next";
import ToolsSection from "@/components/ToolsSection";
import DutyCostCalculator from "@/components/DutyCostCalculator";
import GerekliBaglantilarSection from "@/components/GerekliBaglantilarSection";
import { companyInfo } from "@/data/company";
import { ShieldCheck, ExternalLink, HelpCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Gümrükçü Masası & Faydalı Araçlar | Kalem Gümrük Müşavirliği",
  description:
    "Evrim Web Gümrük müşteri girişi, BİLGE Sistemi, TAREKS, GTİP Arama ve TCMB resmi gümrük kurlarına hızlı erişim portalı.",
};

export default function AraclarPage() {
  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Üst Vurgulu Evrim Banner */}
        <div className="bg-[#1E2A3A] text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-slate-700 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3">
            <span className="text-xs font-bold text-[#44B9CD] uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              <span>Kalem Gümrük Müşteri Takip Sistemi</span>
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Evrim Web Gümrük Portalı
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Müşterilerimiz, kendilerine tanımlanan kullanıcı adı ve şifreleriyle; açılan
              beyannamelerinin anlık durumunu, intaç tarihlerini, ardiye ve dekont dökümlerini 7/24
              takip edebilirler.
            </p>
          </div>

          <a
            href={companyInfo.evrimPortalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 flex items-center gap-2 bg-[#44B9CD] hover:bg-[#2f9fb3] text-white font-bold px-7 py-4 rounded-2xl shadow-lg transition-all text-sm hover:scale-105"
          >
            <span>Evrim Portalına Giriş Yap</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        {/* GTİP & Masraf Hesaplama Simülatörü */}
        <DutyCostCalculator />

        {/* Kalem Gümrük Gerekli Bağlantılar Portalı (Kargo, Liman, Resmi Sistemler) */}
        <GerekliBaglantilarSection />

        {/* Tüm Araçlar */}
        <ToolsSection />

        {/* Yardım Kutusu */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex items-center gap-4 text-xs text-slate-600">
          <HelpCircle className="w-6 h-6 text-[#44B9CD] shrink-0" />
          <div>
            <span className="font-bold text-slate-900">Sistem Girişi veya Şifre Desteği mi Gerekiyor? </span>
            Evrim Web Gümrük kullanıcı adı veya şifreniz için müşteri temsilcimizle{" "}
            <a href={`tel:${companyInfo.phoneRaw}`} className="text-[#44B9CD] font-bold hover:underline">
              {companyInfo.phone}
            </a>{" "}
            numaralı telefondan iletişime geçebilirsiniz.
          </div>
        </div>
      </div>
    </div>
  );
}
