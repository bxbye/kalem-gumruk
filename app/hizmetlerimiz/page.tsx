"use client";

import { useState } from "react";
import Link from "next/link";
import { servicesData, ServiceItem } from "@/data/services";
import { companyInfo } from "@/data/company";
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  Repeat,
  RefreshCw,
  Warehouse,
  Truck,
  Building2,
  Briefcase,
  Scale,
  Shield,
  ArrowRight,
  CheckCircle2,
  MessageCircle,
  Phone,
  ShieldCheck,
  Clock,
  Sparkles,
  FileCheck2,
  Search,
  Mail,
  FileText,
} from "lucide-react";

const iconMap: Record<string, React.ReactNode> = {
  ArrowDownToLine: <ArrowDownToLine className="w-6 h-6" />,
  ArrowUpFromLine: <ArrowUpFromLine className="w-6 h-6" />,
  Repeat: <Repeat className="w-6 h-6" />,
  RefreshCw: <RefreshCw className="w-6 h-6" />,
  Warehouse: <Warehouse className="w-6 h-6" />,
  Truck: <Truck className="w-6 h-6" />,
  Building2: <Building2 className="w-6 h-6" />,
  Briefcase: <Briefcase className="w-6 h-6" />,
  Scale: <Scale className="w-6 h-6" />,
  Shield: <Shield className="w-6 h-6" />,
};

const categoryLabels: Record<string, string> = {
  all: "Tüm Hizmetler (10)",
  gumruk: "Temel Gümrükleme",
  rejim: "Özel Rejimler",
  danismanlik: "Danışmanlık, Hukuk & Sigorta",
};

export default function ServicesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredServices = servicesData.filter((service) => {
    const matchesCategory =
      selectedCategory === "all" || service.category === selectedCategory;
    const matchesSearch =
      service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.shortDesc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.features.some((f) =>
        f.toLowerCase().includes(searchQuery.toLowerCase())
      );
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* 1. Üst Kompakt Karşılama Alanı */}
      <section className="bg-gradient-to-b from-[#1E2A3A] via-[#172230] to-[#121B27] text-white py-8 sm:py-10 relative overflow-hidden border-b border-slate-800">
        {/* Dekoratif Arka Plan Işık Efekti */}
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-[#44B9CD]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-[11px] text-slate-400 mb-3">
            <Link href="/" className="hover:text-[#44B9CD] transition-colors">
              Ana Sayfa
            </Link>
            <span>/</span>
            <span className="text-[#44B9CD] font-medium">Hizmetlerimiz</span>
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="max-w-2xl space-y-2.5">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#44B9CD]/15 border border-[#44B9CD]/30 text-[#44B9CD] text-[11px] font-bold uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>1997&apos;den Bugüne A Karne Müşavir Güvencesi</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Gümrükleme &amp; Dış Ticaret Hizmetlerimiz
              </h1>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                İthalat, ihracat ve tüm gümrük rejim süreçlerinizi 25 yılı aşkın tecrübemiz ve
                A Karne yetkili gümrük müşavirlerimizle mevzuata %100 uyumlu, hızlı ve güvenle
                yönetiyoruz.
              </p>
            </div>

            {/* Fiyat Teklifi, WhatsApp ve E-Posta Butonları */}
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 shrink-0">
              <Link
                href="/iletisim#teklif"
                className="px-4 py-2.5 rounded-xl bg-[#44B9CD] hover:bg-[#3597a8] text-white text-xs font-bold transition-all shadow-md hover:scale-[1.02] flex items-center gap-1.5"
              >
                <FileText className="w-4 h-4" />
                <span>Fiyat Teklifi Al</span>
              </Link>

              <a
                href={`https://wa.me/${companyInfo.whatsapp}?text=${encodeURIComponent(
                  companyInfo.whatsappDefaultMessage
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md hover:scale-[1.02] flex items-center gap-1.5"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp İletişim</span>
              </a>

              <a
                href={`mailto:${companyInfo.email}?subject=${encodeURIComponent(
                  "Gümrük Hizmetleri Bilgi ve Teklif Talebi"
                )}`}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold transition-all border border-white/20 flex items-center gap-1.5"
              >
                <Mail className="w-4 h-4 text-slate-300" />
                <span>E-Posta Gönder</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Filtreleme ve Arama Çubuğu */}
      <section id="hizmet-listesi" className="sticky top-16 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Kategori Sekmeleri */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 no-scrollbar">
              {Object.entries(categoryLabels).map(([key, label]) => {
                const isActive = selectedCategory === key;
                return (
                  <button
                    key={key}
                    onClick={() => setSelectedCategory(key)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                      isActive
                        ? "bg-[#1E2A3A] text-white shadow-xs"
                        : "bg-slate-100 hover:bg-slate-200/80 text-slate-700"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            {/* Arama Kutusu */}
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Hizmet veya işlem ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-[#44B9CD] focus:bg-white transition-all text-slate-900"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 3. Tüm 10 Hizmetin Detaylı Kart Listesi */}
      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredServices.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8">
              <p className="text-sm text-slate-500 mb-3">
                &ldquo;{searchQuery}&rdquo; aramasına uygun bir hizmet bulunamadı.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory("all");
                  setSearchQuery("");
                }}
                className="text-xs font-bold text-[#44B9CD] hover:underline"
              >
                Filtreleri Temizle
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredServices.map((service, idx) => {
                const serviceIndex = servicesData.findIndex((s) => s.slug === service.slug) + 1;
                const formattedNumber = serviceIndex < 10 ? `0${serviceIndex}` : `${serviceIndex}`;

                return (
                  <div
                    key={service.slug}
                    className="bg-white rounded-3xl p-6 sm:p-7 shadow-xs hover:shadow-xl transition-all duration-300 border border-slate-200/90 flex flex-col justify-between group hover:-translate-y-1 relative overflow-hidden"
                  >
                    {/* Üst Dekoratif Arka Plan Çizgisi */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#44B9CD]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                    <div>
                      {/* Üst Sıra: İkon + Sıra Numarası */}
                      <div className="flex items-center justify-between mb-5">
                        <div className="w-12 h-12 rounded-2xl bg-[#1E2A3A] text-[#44B9CD] flex items-center justify-center group-hover:scale-105 group-hover:bg-[#44B9CD] group-hover:text-white transition-all shadow-xs">
                          {iconMap[service.iconName] || <Briefcase className="w-6 h-6" />}
                        </div>
                        <span className="text-xl font-extrabold text-slate-200 group-hover:text-cyan-100 transition-colors">
                          {formattedNumber}
                        </span>
                      </div>

                      {/* Başlık */}
                      <h2 className="text-lg font-bold text-slate-900 group-hover:text-[#44B9CD] transition-colors mb-2.5 leading-snug">
                        <Link href={`/hizmetlerimiz/${service.slug}`}>
                          {service.title}
                        </Link>
                      </h2>

                      {/* Kısa Açıklama */}
                      <p className="text-xs text-slate-600 leading-relaxed mb-4">
                        {service.shortDesc}
                      </p>

                      {/* Başlıca Operasyon Maddeleri (Eski Sitedeki İşlem Kapsamı) */}
                      <div className="space-y-2 pt-3 border-t border-slate-100">
                        <div className="text-[11px] font-bold text-[#1E2A3A] uppercase tracking-wider flex items-center gap-1 mb-2">
                          <FileCheck2 className="w-3.5 h-3.5 text-[#44B9CD]" />
                          <span>Hizmet Kapsamı &amp; İşlemler</span>
                        </div>
                        {service.features.slice(0, 4).map((feat, fIdx) => (
                          <div key={fIdx} className="flex items-start gap-2 text-xs text-slate-700">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#44B9CD] shrink-0 mt-0.5" />
                            <span className="line-clamp-2">{feat}</span>
                          </div>
                        ))}
                        {service.features.length > 4 && (
                          <div className="text-[11px] font-semibold text-slate-400 pl-5">
                            + {service.features.length - 4} ilave operasyonel süreç...
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Alt Kısım: Butonlar */}
                    <div className="pt-5 mt-6 border-t border-slate-100 flex items-center justify-between gap-2">
                      <Link
                        href={`/hizmetlerimiz/${service.slug}`}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-[#1E2A3A] text-slate-900 hover:text-white text-xs font-bold transition-all shadow-2xs group/btn"
                      >
                        <span>Detaylı İncele</span>
                        <ArrowRight className="w-3.5 h-3.5 text-[#44B9CD] group-hover/btn:translate-x-1 transition-transform" />
                      </Link>

                      <a
                        href={`https://wa.me/${companyInfo.whatsapp}?text=${encodeURIComponent(
                          `Merhaba Kalem Gümrük, ${service.title} hizmetiniz hakkında bilgi ve teklif almak istiyorum.`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white text-xs font-bold transition-all"
                        title="Bu hizmet için WhatsApp ile danışın"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Danış</span>
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* 4. Kalem Gümrük Müşavirlik Güvenceleri & Neden Kalem Gümrük? */}
      <section className="py-16 bg-gradient-to-b from-white via-slate-50/60 to-white border-t border-slate-200/90 relative overflow-hidden">
        {/* Arka plan dekoratif hafif ışıltı */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-48 bg-[#44B9CD]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#44B9CD]/10 border border-[#44B9CD]/25 text-[#44B9CD] text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Kurumsal Standartlarımız</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1E2A3A] tracking-tight">
              Dış Ticarette Kalem Gümrük Farkı
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              1997 yılından beri her ölçekten ithalatçı ve ihracatçı firmamıza mevzuata tam uyum,
              sıfır gecikme ve kesintisiz müşavir desteği taahhüt ediyoruz.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Kart 1: A Karne Yetkili Kadro */}
            <div className="group relative p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-[#44B9CD]/50 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#1E2A3A] via-[#44B9CD] to-[#1E2A3A] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#1E2A3A] text-[#44B9CD] flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-[#44B9CD] group-hover:text-white transition-all duration-300 shadow-xs group-hover:shadow-md group-hover:shadow-[#44B9CD]/30">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#1E2A3A] transition-colors mb-2">
                  A Karne Yetkili Kadro
                </h3>
                <p className="text-xs text-slate-600 group-hover:text-slate-700 leading-relaxed">
                  Alanında en üst yetki seviyesine sahip gümrük müşavirlerimiz ile tüm gümrük idarelerinde resmi temsil.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 group-hover:text-[#44B9CD] transition-colors">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Resmi &amp; Lisanslı Temsil</span>
              </div>
            </div>

            {/* Kart 2: %99.8 İntaç Başarısı */}
            <div className="group relative p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-[#44B9CD]/50 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#1E2A3A] via-[#44B9CD] to-[#1E2A3A] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#1E2A3A] text-[#44B9CD] flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-[#44B9CD] group-hover:text-white transition-all duration-300 shadow-xs group-hover:shadow-md group-hover:shadow-[#44B9CD]/30">
                  <Clock className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#1E2A3A] transition-colors mb-2">
                  %99.8 İntaç Başarısı
                </h3>
                <p className="text-xs text-slate-600 group-hover:text-slate-700 leading-relaxed">
                  Beyanname açılışından kapanışına kadar ardiye ve demuraj oluşturmayan hızlı operasyon disiplini.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 group-hover:text-[#44B9CD] transition-colors">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Minimum Bekleme Süresi</span>
              </div>
            </div>

            {/* Kart 3: Evrim Entegrasyonu */}
            <div className="group relative p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-[#44B9CD]/50 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#1E2A3A] via-[#44B9CD] to-[#1E2A3A] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#1E2A3A] text-[#44B9CD] flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-[#44B9CD] group-hover:text-white transition-all duration-300 shadow-xs group-hover:shadow-md group-hover:shadow-[#44B9CD]/30">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#1E2A3A] transition-colors mb-2">
                  Evrim Entegrasyonu
                </h3>
                <p className="text-xs text-slate-600 group-hover:text-slate-700 leading-relaxed">
                  7/24 Web Gümrük portalımız üzerinden tüm beyanname, fatura ve intaç evraklarınıza anlık online erişim.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 group-hover:text-[#44B9CD] transition-colors">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Canlı Dijital Takip</span>
              </div>
            </div>

            {/* Kart 4: Doğrudan Müşavir Erişimi */}
            <div className="group relative p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-[#44B9CD]/50 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#1E2A3A] via-[#44B9CD] to-[#1E2A3A] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#1E2A3A] text-[#44B9CD] flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-[#44B9CD] group-hover:text-white transition-all duration-300 shadow-xs group-hover:shadow-md group-hover:shadow-[#44B9CD]/30">
                  <Phone className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#1E2A3A] transition-colors mb-2">
                  Doğrudan Müşavir Erişimi
                </h3>
                <p className="text-xs text-slate-600 group-hover:text-slate-700 leading-relaxed">
                  Çağrı merkezleri yerine dosyanızı bizzat yürüten gümrük müşavirinizle kesintisiz doğrudan iletişim imkanı.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 group-hover:text-[#44B9CD] transition-colors">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Birebir İletişim</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
