"use client";

import { useState, useEffect, useRef } from "react";
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
} from "lucide-react";

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  // Karaca Gümrükçülük tarzı 4 manşet slaytı
  const slides = [
    {
      id: 1,
      slogans: [
        "Çözüm Odaklı Yaklaşım",
        "Koşulsuz Müşteri Memnuniyeti",
        "Yüksek Kaliteli Hizmet Anlayışı",
      ],
      description: "1997'den bugüne A Karne yetkili gümrük müşavirlerimizle kesintisiz güven.",
    },
    {
      id: 2,
      slogans: [
        "Sıfır Gecikme & Hızlı Tescil",
        "Evrim Web Gümrük ile 7/24 Canlı Takip",
        "%99.8 Zamanında İntaç Garantisi",
      ],
      description: "Tüm ithalat ve ihracat beyannamelerinizi ofisinizden anlık olarak takip edin.",
    },
    {
      id: 3,
      slogans: [
        "Mevzuata %100 Tam Uyum",
        "Doğru GTİP Tespiti & Vergi Analizi",
        "Dahilde İşleme (DİR) & Teşvik Danışmanlığı",
      ],
      description: "Resmi Gazete tebliğlerini anlık analiz ederek cezai riskleri sıfıra indiriyoruz.",
    },
    {
      id: 4,
      slogans: [
        "Tüm Liman & Gümrüklerde Saha Gücü",
        "Hava, Deniz, Kara ve Serbest Bölge Çözümleri",
        "Dış Ticarette Stratejik Çözüm Ortağınız",
      ],
      description: "Ambarlı, Erenköy, Muratbey, İGA ve tüm limanlarda yetkili operasyon kadrosu.",
    },
  ];

  // Otomatik kayma (6 saniye)
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isPaused, slides.length]);

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  // Mobil Dokunmatik Kaydırma (Swipe)
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 50) handleNext();
    if (diff < -50) handlePrev();
    touchStartX.current = null;
  };

  return (
    <section
      className="relative overflow-hidden bg-slate-950 text-white select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* ------------------------------------------------------------- */}
      {/* 1. GÖRSEL ARKA PLAN (Net Görünür, Karaca Tarzı Az Soluk Katman) */}
      {/* ------------------------------------------------------------- */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/kalem-gumruk-hero.jpg"
          alt="Kalem Gümrük Müşavirliği"
          fill
          priority
          className="object-cover object-center filter brightness-95"
        />
        {/* Karaca sitesindeki gibi hafif karartıcı yarı saydam perde */}
        <div className="absolute inset-0 bg-black/35"></div>
        {/* Yazıların keskin okunması için sol tarafta yumuşak gradyan */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/25 to-transparent"></div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 2. KARACA TARZI YATAY KAYAN MANŞET SLIDER ALANI */}
      {/* ------------------------------------------------------------- */}
      <div className="relative z-10 w-full min-h-[460px] sm:min-h-[500px] lg:min-h-[530px] flex items-center overflow-hidden">
        {/* Yatay Kayan Slider Bandı (Horizontal Slide Track) */}
        <div
          className="w-full flex transition-transform duration-700 ease-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {slides.map((slide, sIndex) => {
            const isActive = currentSlide === sIndex;
            return (
              <div
                key={slide.id}
                className="w-full shrink-0 max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-16 flex flex-col justify-center items-start"
              >
                <div className="max-w-3xl space-y-3.5">
                  {/* Slogan Kutuları: Karaca'daki gibi siyah zeminli, beyaz kalın yazılı kutular */}
                  <div className="space-y-3">
                    {slide.slogans.map((slogan, idx) => (
                      <div
                        key={idx}
                        className={`transition-all duration-700 ease-out ${
                          isActive
                            ? "opacity-100 translate-x-0"
                            : "opacity-0 -translate-x-12"
                        }`}
                        style={{
                          transitionDelay: isActive ? `${idx * 140}ms` : "0ms",
                        }}
                      >
                        <div className="inline-block bg-black/80 backdrop-blur-xs px-5 sm:px-7 py-2.5 sm:py-3.5 rounded-md shadow-2xl border-l-4 border-[#44B9CD]">
                          <span className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-wide">
                            {slogan}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Alt Kısa Açıklama */}
                  <div
                    className={`pt-2 transition-all duration-700 ease-out ${
                      isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                    }`}
                    style={{ transitionDelay: isActive ? "450ms" : "0ms" }}
                  >
                    <p className="inline-block text-xs sm:text-sm font-medium text-slate-200 bg-black/60 backdrop-blur-xs px-4 py-2 rounded-md border border-white/10">
                      {slide.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ------------------------------------------------------------- */}
        {/* SLIDER KARE SAYFALAMA NOKTALARI (Karaca Sitesindeki Gibi Ortada) */}
        {/* ------------------------------------------------------------- */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2.5 z-20">
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              onClick={() => setCurrentSlide(index)}
              aria-label={`Slayt ${index + 1}`}
              className={`transition-all duration-300 rounded-xs shadow-md ${
                currentSlide === index
                  ? "w-4 h-4 bg-[#44B9CD] scale-110 ring-2 ring-white/50"
                  : "w-3.5 h-3.5 bg-white/70 hover:bg-white"
              }`}
            />
          ))}
        </div>

        {/* Sağ & Sol Yönlendirme Okları */}
        <button
          onClick={handlePrev}
          aria-label="Önceki Slayt"
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-xs border border-white/20 transition-all hover:scale-110"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={handleNext}
          aria-label="Sonraki Slayt"
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-xs border border-white/20 transition-all hover:scale-110"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
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
