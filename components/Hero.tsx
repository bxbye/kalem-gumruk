import Link from "next/link";
import { companyInfo } from "@/data/company";
import {
  ShieldCheck,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  FileText,
  Clock,
  Sparkles,
} from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#1E2A3A] text-white pt-12 pb-20 lg:pt-20 lg:pb-28">
      {/* Arka Plan Efektleri */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-[#44B9CD]/20 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-[#44B9CD]/15 blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Sol Kolon: Başlık ve Değer Teklifi */}
          <div className="lg:col-span-7 space-y-6">
            {/* Rozet */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-[#44B9CD]/30 text-xs font-semibold text-[#44B9CD]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>1997&apos;den Bugüne — 25+ Yıllık Gümrük Müşavirliği Güvencesi</span>
            </div>

            {/* Ana Başlık */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight text-white">
              Dış Ticarette Hız, Güven ve{" "}
              <span className="text-[#44B9CD]">Mevzuata Tam Uyum</span>
            </h1>

            {/* Açıklama */}
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
              İthalat, ihracat, antrepo ve transit işlemlerinizde; A Karne yetkili gümrük
              müşavirlerimiz ve <strong>Evrim Web Gümrük</strong> dijital takip altyapımızla
              dosyalarınızı sıfır gecikmeyle sonuçlandırıyoruz.
            </p>

            {/* Öne Çıkan 3 Madde */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="flex items-center gap-2 text-xs text-slate-200 bg-white/5 p-2.5 rounded-lg border border-white/10">
                <CheckCircle2 className="w-4 h-4 text-[#44B9CD] shrink-0" />
                <span>%99.8 Zamanında İntaç</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-200 bg-white/5 p-2.5 rounded-lg border border-white/10">
                <CheckCircle2 className="w-4 h-4 text-[#44B9CD] shrink-0" />
                <span>Anlık Dijital Takip</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-200 bg-white/5 p-2.5 rounded-lg border border-white/10">
                <CheckCircle2 className="w-4 h-4 text-[#44B9CD] shrink-0" />
                <span>Tüm Liman & Gümrük Ağı</span>
              </div>
            </div>

            {/* Eylem Butonları */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
              <a
                href={companyInfo.evrimPortalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2.5 bg-[#44B9CD] hover:bg-[#2f9fb3] text-white font-bold px-6 py-3.5 rounded-xl shadow-lg transition-all duration-200 text-sm hover:scale-[1.02]"
              >
                <ShieldCheck className="w-5 h-5" />
                <span>Evrim E-Gümrük Müşteri Girişi</span>
                <ExternalLink className="w-4 h-4 text-white/80" />
              </a>

              <Link
                href="/iletisim#teklif"
                className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 text-white font-semibold px-6 py-3.5 rounded-xl border border-white/20 transition-all text-sm"
              >
                <span>Hızlı Teklif & Danışmanlık Al</span>
                <ArrowRight className="w-4 h-4 text-[#44B9CD]" />
              </Link>
            </div>
          </div>

          {/* Sağ Kolon: Hızlı Müşavir Kartı & Dijital Takip Önizlemesi */}
          <div className="lg:col-span-5">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/15 shadow-2xl space-y-5">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <div className="text-xs text-[#44B9CD] font-bold uppercase tracking-wider">
                    Online İşlemler
                  </div>
                  <div className="text-base font-bold text-white">Kalem Gümrük Müşteri Portalı</div>
                </div>
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Canlı Sistem
                </span>
              </div>

              {/* Hızlı İşlem Kartları */}
              <div className="space-y-3">
                <a
                  href={companyInfo.evrimPortalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between p-3.5 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-[#44B9CD]/20 text-[#44B9CD]">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-[#44B9CD] transition-colors">
                        Beyanname & İntaç Takibi
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Evrim portalından anlık dosya statüsü
                      </div>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-[#44B9CD]" />
                </a>

                <Link
                  href="/araclar"
                  className="group flex items-center justify-between p-3.5 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-[#44B9CD]/20 text-[#44B9CD]">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-[#44B9CD] transition-colors">
                        Gümrükçü Masası (Hızlı Araçlar)
                      </div>
                      <div className="text-[11px] text-slate-400">
                        BİLGE, TAREKS, GTİP ve TCMB kurları
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#44B9CD]" />
                </Link>
              </div>

              {/* Hızlı WhatsApp Müşavir Çağrısı */}
              <div className="pt-2">
                <a
                  href={`https://wa.me/${companyInfo.whatsapp}?text=${encodeURIComponent(
                    companyInfo.whatsappDefaultMessage
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3 px-4 rounded-xl text-xs transition-all shadow"
                >
                  <span>Müşavir WhatsApp Hattı: {companyInfo.phone}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
