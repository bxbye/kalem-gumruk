"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { companyInfo } from "@/data/company";
import {
  Send,
  Scale,
  FileText,
  Users,
  Lock,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const slides = [
    {
      id: 1,
      badge: "⭐ 1997'DEN BUGÜNE GÜVENLE",
      slogans: [
        "Çözüm Odaklı Yaklaşım",
        "Koşulsuz Müşteri Memnuniyeti",
        "Yüksek Kaliteli Hizmet Anlayışı",
      ],
      description:
        "A Karne yetkili gümrük müşavirlerimiz ve 25+ yıllık saha tecrübemizle dış ticaret operasyonlarınızı sıfır gecikmeyle yönetiyoruz.",
      cta: {
        text: "Hızlı Teklif Al",
        href: "/iletisim#teklif",
      },
    },
    {
      id: 2,
      badge: "🚀 DİJİTAL GÜMRÜK & ŞEFFAFLIK",
      slogans: [
        "Sıfır Gecikme & Hızlı Tescil",
        "Evrim Web Gümrük ile 7/24 Canlı Takip",
        "%99.8 Zamanında İntaç Güvencesi",
      ],
      description:
        "Tüm ithalat ve ihracat dosyalarınızı, beyanname kapanışlarını ve dijital arşivinizi cebinizden an be an izleyin.",
      cta: {
        text: "Evrim Müşteri Girişi",
        href: companyInfo.evrimPortalUrl,
        isExternal: true,
      },
    },
    {
      id: 3,
      badge: "🛡️ HUKUKİ GÜVENCE & DANIŞMANLIK",
      slogans: [
        "Mevzuata %100 Tam Uyum",
        "Doğru GTİP Tespiti & Vergi Analizi",
        "DİR & Yatırım Teşvik Uzmanlığı",
      ],
      description:
        "Resmi Gazete tebliğlerini anlık analiz ederek firmanızı olası cezai yaptırımlardan koruyor, maliyet avantajı sağlıyoruz.",
      cta: {
        text: "Gümrük Araçlarını İncele",
        href: "/araclar",
      },
    },
  ];

  // 6 saniyede bir otomatik geçiş
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isPaused, slides.length]);

  const activeSlide = slides[currentSlide];

  return (
    <section
      className="relative overflow-hidden bg-slate-900 text-white"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* ------------------------------------------------------------- */}
      {/* 1. GÖRSEL ALANI (Fotoğraf Net Şekilde Görünür, Az Soluk Karartma) */}
      {/* ------------------------------------------------------------- */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/kalem-gumruk-hero.jpg"
          alt="Kalem Gümrük Müşavirliği"
          fill
          priority
          className="object-cover object-center filter brightness-90"
        />
        {/* Az soluklaştıran yarı saydam katman (Fotoğraf görünür, yazılar parlar) */}
        <div className="absolute inset-0 bg-slate-950/45"></div>
        {/* Sol tarafta yazıların rahat okunması için yumuşak gölge geçişi */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-950/40 to-transparent"></div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 2. GÖRSEL ÜZERİNDE HAREKETLİ GELEN SLOGAN MESAJLAR */}
      {/* ------------------------------------------------------------- */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[440px] sm:min-h-[480px] lg:min-h-[500px] flex flex-col justify-center py-12">
        <div key={currentSlide} className="max-w-3xl space-y-5">
          {/* Rozet */}
          <div className="animate-in fade-in slide-in-from-top-3 duration-400">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-[11px] font-bold text-[#44B9CD] shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{activeSlide.badge}</span>
            </span>
          </div>

          {/* Slogan Mesajlar: Tek tek hareketli efektlerle gelen satırlar */}
          <div className="space-y-2.5">
            {activeSlide.slogans.map((slogan, idx) => (
              <div
                key={idx}
                style={{ animationDelay: `${idx * 160}ms` }}
                className="animate-in fade-in slide-in-from-left-6 duration-500 fill-mode-both"
              >
                <div className="inline-flex items-center gap-3 bg-slate-950/65 backdrop-blur-md px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl border border-white/15 shadow-xl hover:border-[#44B9CD]/50 transition-colors">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#44B9CD] shadow-sm shadow-[#44B9CD]"></span>
                  <span className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-white drop-shadow-md">
                    {slogan}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Açıklama */}
          <div className="animate-in fade-in duration-600 delay-450 fill-mode-both pt-1">
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed max-w-xl bg-slate-950/50 backdrop-blur-xs p-3 rounded-xl border border-white/10">
              {activeSlide.description}
            </p>
          </div>

          {/* Eylem Butonu */}
          <div className="animate-in fade-in zoom-in-95 duration-500 delay-500 fill-mode-both pt-2 flex items-center gap-3">
            {activeSlide.cta.isExternal ? (
              <a
                href={activeSlide.cta.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#44B9CD] hover:bg-[#2f9fb3] text-white font-bold px-6 py-3 rounded-xl text-xs transition-all shadow-lg hover:scale-105"
              >
                <Lock className="w-4 h-4" />
                <span>{activeSlide.cta.text}</span>
              </a>
            ) : (
              <Link
                href={activeSlide.cta.href}
                className="inline-flex items-center gap-2 bg-[#44B9CD] hover:bg-[#2f9fb3] text-white font-bold px-6 py-3 rounded-xl text-xs transition-all shadow-lg hover:scale-105"
              >
                <span>{activeSlide.cta.text}</span>
              </Link>
            )}

            <a
              href={`https://wa.me/${companyInfo.whatsapp}?text=${encodeURIComponent(
                companyInfo.whatsappDefaultMessage
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-black/40 hover:bg-black/60 backdrop-blur-md text-white font-semibold px-5 py-3 rounded-xl border border-white/20 text-xs transition-colors"
            >
              <span>Müşavir Hattı: {companyInfo.phone}</span>
            </a>
          </div>
        </div>

        {/* Slider Sayfalama Noktaları (Karaca örneğindeki gibi ortalanmış kare indikatörler) */}
        <div className="absolute bottom-6 left-4 sm:left-8 flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-950/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/15">
            {slides.map((slide, index) => (
              <button
                key={slide.id}
                onClick={() => setCurrentSlide(index)}
                aria-label={`Slayt ${index + 1}`}
                className={`transition-all duration-300 rounded-xs ${
                  currentSlide === index
                    ? "w-6 h-2 bg-[#44B9CD] shadow-xs shadow-[#44B9CD]"
                    : "w-2 h-2 bg-white/40 hover:bg-white/70"
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() =>
                setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1))
              }
              aria-label="Önceki"
              className="p-1.5 rounded-lg bg-slate-950/60 backdrop-blur-md hover:bg-slate-950 text-white border border-white/15 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
              aria-label="Sonraki"
              className="p-1.5 rounded-lg bg-slate-950/60 backdrop-blur-md hover:bg-slate-950 text-white border border-white/15 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 3. HERO ALTI HIZLI AKSİYON DOCK'I (5 Fonksiyonel Kart) */}
      {/* ------------------------------------------------------------- */}
      <div className="relative z-20 bg-white border-b border-slate-200 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
            {/* 1. Hızlı Teklif */}
            <Link
              href="/iletisim#teklif"
              className="group p-4 sm:p-5 bg-white hover:bg-slate-50 transition-all flex items-center justify-between"
            >
              <div className="space-y-0.5">
                <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">
                  İşlem Başlat
                </div>
                <div className="text-xs sm:text-sm font-bold text-[#1E2A3A] group-hover:text-[#44B9CD] transition-colors">
                  Hızlı Teklif Formu
                </div>
                <div className="text-[11px] text-slate-500 hidden sm:block">
                  4 adımda talep oluşturun
                </div>
              </div>
              <div className="w-9 h-9 rounded-xl bg-slate-100 group-hover:bg-[#1E2A3A] text-slate-700 group-hover:text-[#44B9CD] flex items-center justify-center transition-all shrink-0">
                <Send className="w-4 h-4" />
              </div>
            </Link>

            {/* 2. Müşavir Masası */}
            <Link
              href="/araclar"
              className="group p-4 sm:p-5 bg-white hover:bg-slate-50 transition-all flex items-center justify-between"
            >
              <div className="space-y-0.5">
                <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">
                  Sorgulama
                </div>
                <div className="text-xs sm:text-sm font-bold text-[#1E2A3A] group-hover:text-[#44B9CD] transition-colors">
                  Müşavir Masası
                </div>
                <div className="text-[11px] text-slate-500 hidden sm:block">
                  BİLGE, TAREKS, GTİP
                </div>
              </div>
              <div className="w-9 h-9 rounded-xl bg-slate-100 group-hover:bg-[#1E2A3A] text-slate-700 group-hover:text-[#44B9CD] flex items-center justify-center transition-all shrink-0">
                <Scale className="w-4 h-4" />
              </div>
            </Link>

            {/* 3. Mevzuat Haberleri */}
            <Link
              href="/sirkuler"
              className="group p-4 sm:p-5 bg-white hover:bg-slate-50 transition-all flex items-center justify-between"
            >
              <div className="space-y-0.5">
                <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">
                  Resmi Gazete
                </div>
                <div className="text-xs sm:text-sm font-bold text-[#1E2A3A] group-hover:text-[#44B9CD] transition-colors">
                  Mevzuat Haberleri
                </div>
                <div className="text-[11px] text-slate-500 hidden sm:block">
                  Güncel sirkülerler
                </div>
              </div>
              <div className="w-9 h-9 rounded-xl bg-slate-100 group-hover:bg-[#1E2A3A] text-slate-700 group-hover:text-[#44B9CD] flex items-center justify-center transition-all shrink-0">
                <FileText className="w-4 h-4" />
              </div>
            </Link>

            {/* 4. Kariyer */}
            <Link
              href="/kariyer"
              className="group p-4 sm:p-5 bg-white hover:bg-slate-50 transition-all flex items-center justify-between"
            >
              <div className="space-y-0.5">
                <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">
                  İK & Ekip
                </div>
                <div className="text-xs sm:text-sm font-bold text-[#1E2A3A] group-hover:text-[#44B9CD] transition-colors">
                  Kariyer Alanı
                </div>
                <div className="text-[11px] text-slate-500 hidden sm:block">
                  Açık pozisyonlar ve staj
                </div>
              </div>
              <div className="w-9 h-9 rounded-xl bg-slate-100 group-hover:bg-[#1E2A3A] text-slate-700 group-hover:text-[#44B9CD] flex items-center justify-center transition-all shrink-0">
                <Users className="w-4 h-4" />
              </div>
            </Link>

            {/* 5. Evrim Web Gümrük (Canlı Müşteri Girişi - Vurgulu Kart) */}
            <a
              href={companyInfo.evrimPortalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="col-span-2 sm:col-span-1 p-4 sm:p-5 bg-gradient-to-r from-[#1E2A3A] to-[#25364b] hover:from-[#44B9CD] hover:to-[#2f9fb3] text-white transition-all flex items-center justify-between shadow-xs group"
            >
              <div className="space-y-0.5">
                <div className="text-[10px] uppercase tracking-wider text-[#44B9CD] group-hover:text-white font-extrabold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                  Canlı Müşteri Portalı
                </div>
                <div className="text-xs sm:text-sm font-extrabold text-white">
                  Evrim Web Gümrük
                </div>
                <div className="text-[11px] text-slate-300 group-hover:text-white/90">
                  Dosya & İntaç Takibi →
                </div>
              </div>
              <div className="w-9 h-9 rounded-xl bg-white/10 group-hover:bg-white text-[#44B9CD] group-hover:text-[#1E2A3A] flex items-center justify-center transition-all shrink-0 shadow-inner">
                <Lock className="w-4 h-4" />
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
