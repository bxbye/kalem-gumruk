"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { companyInfo } from "@/data/company";
import {
  ShieldCheck,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  FileText,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Lock,
  Scale,
  Send,
  Users,
} from "lucide-react";

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const slides = [
    {
      id: 1,
      badge: "⭐ 1997'DEN BUGÜNE KESİNTİSİZ GÜVEN",
      titlePrefix: "Çözüm Odaklı Yaklaşım & ",
      titleHighlight: "Sıfır Gecikme",
      slogans: [
        "Koşulsuz Müşteri Memnuniyeti",
        "Yüksek Kaliteli Hizmet Anlayışı",
        "A Karne Yetkili Müşavir Kadrosu",
      ],
      description:
        "İthalat, ihracat ve antrepo operasyonlarınızda 25+ yıllık tecrübemiz ve %99.8 zamanında intaç oranımızla yanınızdayız.",
      primaryCta: {
        text: "Hemen Fiyat & Süreç Teklifi Al",
        href: "/iletisim#teklif",
      },
    },
    {
      id: 2,
      badge: "🚀 DİJİTAL GÜMRÜKLEME & ANLIK İZLEME",
      titlePrefix: "Evrim Web Gümrük ile ",
      titleHighlight: "7/24 Canlı Dosya Takibi",
      slogans: [
        "Anlık Beyanname & İntaç İzleme",
        "Dijital Arşiv, Dekont ve Fatura Erişimi",
        "Liman & Antrepo Süreçlerinde Şeffaf Raporlama",
      ],
      description:
        "Tüm dış ticaret dosyalarınızı ofisinizden veya cep telefonunuzdan adım adım, anlık olarak takip edin.",
      primaryCta: {
        text: "Evrim Portalına Giriş Yap",
        href: companyInfo.evrimPortalUrl,
        isExternal: true,
      },
    },
    {
      id: 3,
      badge: "🛡️ MEVZUATA %100 TAM UYUM & DANIŞMANLIK",
      titlePrefix: "Hukuki Güvence & ",
      titleHighlight: "Stratejik Dış Ticaret Danışmanlığı",
      slogans: [
        "Doğru GTİP Tespiti & Vergi Maliyet Analizi",
        "Dahilde İşleme Rejimi (DİR) & Teşvik Yönetimi",
        "TAREKS, DTS ve Bakanlık İzinlerinde Tam Yetki",
      ],
      description:
        "Resmi Gazete'deki en son tebliğleri anlık analiz ederek firmanızı cezai risklerden koruyor, maliyet avantajı sağlıyoruz.",
      primaryCta: {
        text: "Gümrükçü Masası Araçlarını İncele",
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
      className="relative overflow-hidden bg-[#1E2A3A] text-white"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* ------------------------------------------------------------- */}
      {/* KULLANICININ EKLEDİĞİ KALEM GÜMRÜK HERO GÖRSELİ (SOLUK ARKA PLAN) */}
      {/* ------------------------------------------------------------- */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Image
          src="/kalem-gumruk-hero.jpg"
          alt="Kalem Gümrük Müşavirliği"
          fill
          priority
          className="object-cover object-center opacity-22 filter contrast-125"
        />
        {/* Zarif Koyu Gradyan Katmanı (Yazıların kusursuz okunması için) */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#1E2A3A]/95 via-[#1E2A3A]/85 to-[#1E2A3A]/70"></div>
        {/* Hafif Turkuaz Vurgu Işığı */}
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-[#44B9CD]/20 blur-3xl"></div>
      </div>

      {/* Kompakt Slider Gövdesi */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-10 lg:pt-12 lg:pb-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Sol Kolon: Dinamik Slayt İçeriği (Her slaytta tek tek hareketli efektlerle gelen manşetler) */}
          <div key={currentSlide} className="lg:col-span-8 space-y-4">
            {/* 1. Rozet: Yukarıdan süzülerek gelir */}
            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs border border-[#44B9CD]/40 text-[11px] font-semibold text-[#44B9CD]">
                <Sparkles className="w-3 h-3" />
                <span>{activeSlide.badge}</span>
              </div>
            </div>

            {/* 2. Manşet Başlığı: Soldan süzülerek gelir */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight text-white animate-in fade-in slide-in-from-left-4 duration-500 fill-mode-both">
              {activeSlide.titlePrefix}
              <span className="text-[#44B9CD] underline decoration-[#44B9CD]/30 decoration-wavy">
                {activeSlide.titleHighlight}
              </span>
            </h1>

            {/* 3. Güven Veren 3 Temel Slogan: Sırayla (Staggered) hareketli gelir */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
              {activeSlide.slogans.map((slogan, idx) => (
                <div
                  key={idx}
                  style={{ animationDelay: `${(idx + 1) * 120}ms` }}
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-white/10 backdrop-blur-xs border border-white/15 text-xs font-semibold text-white animate-in fade-in slide-in-from-bottom-2 duration-400 fill-mode-both shadow-xs"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#44B9CD] shrink-0" />
                  <span className="line-clamp-1">{slogan}</span>
                </div>
              ))}
            </div>

            {/* 4. Açıklama: Yumuşak geçişle belirir */}
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed max-w-2xl animate-in fade-in duration-500 delay-300 fill-mode-both">
              {activeSlide.description}
            </p>

            {/* 5. Aksiyon Butonları: Büyüyerek gelir */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2 animate-in fade-in zoom-in-95 duration-500 delay-350 fill-mode-both">
              {activeSlide.primaryCta.isExternal ? (
                <a
                  href={activeSlide.primaryCta.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-[#44B9CD] hover:bg-[#2f9fb3] text-white font-bold px-5 py-3 rounded-xl shadow-md transition-all text-xs hover:scale-[1.02]"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>{activeSlide.primaryCta.text}</span>
                  <ExternalLink className="w-3.5 h-3.5 text-white/80" />
                </a>
              ) : (
                <Link
                  href={activeSlide.primaryCta.href}
                  className="inline-flex items-center justify-center gap-2 bg-[#44B9CD] hover:bg-[#2f9fb3] text-white font-bold px-5 py-3 rounded-xl shadow-md transition-all text-xs hover:scale-[1.02]"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{activeSlide.primaryCta.text}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-white/80" />
                </Link>
              )}

              <a
                href={companyInfo.evrimPortalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 text-white font-semibold px-5 py-3 rounded-xl border border-white/20 transition-all text-xs backdrop-blur-xs"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#44B9CD]" />
                <span>Evrim Web Gümrük Portalı</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>
            </div>
          </div>

          {/* Sağ Kolon: Kompakt Kurumsal Statü Kartı */}
          <div className="lg:col-span-4 hidden lg:block">
            <div className="bg-[#1E2A3A]/85 backdrop-blur-md rounded-2xl p-5 border border-white/20 shadow-2xl space-y-3.5">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div>
                  <div className="text-[10px] text-[#44B9CD] font-bold uppercase tracking-wider">
                    Yetkinlik & Statü
                  </div>
                  <div className="text-sm font-bold text-white">Kalem Müşavir Masası</div>
                </div>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Canlı Sistem
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-white/10">
                  <span className="text-slate-300">Kuruluş Yılı:</span>
                  <span className="font-bold text-white">1997 (25+ Yıl)</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-white/10">
                  <span className="text-slate-300">Yetki Belgesi:</span>
                  <span className="font-bold text-[#44B9CD]">A & B Karne Kadrosu</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-white/10">
                  <span className="text-slate-300">Zamanında İntaç:</span>
                  <span className="font-bold text-emerald-400">%99.8 Başarı Oranı</span>
                </div>
              </div>

              <a
                href={`https://wa.me/${companyInfo.whatsapp}?text=${encodeURIComponent(
                  companyInfo.whatsappDefaultMessage
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2.5 px-3 rounded-xl text-xs transition-all shadow"
              >
                <span>Müşavir WhatsApp: {companyInfo.phone}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Kompakt Slider Kontrolleri & Dots */}
        <div className="flex items-center justify-between pt-6 border-t border-white/10 mt-6">
          <div className="flex items-center gap-2">
            {slides.map((slide, index) => (
              <button
                key={slide.id}
                onClick={() => setCurrentSlide(index)}
                aria-label={`Slayt ${index + 1}`}
                className={`transition-all duration-300 rounded-sm ${
                  currentSlide === index
                    ? "w-7 h-2.5 bg-[#44B9CD] shadow-sm shadow-[#44B9CD]/50"
                    : "w-2.5 h-2.5 bg-white/30 hover:bg-white/60"
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() =>
                setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1))
              }
              aria-label="Önceki Slayt"
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
              aria-label="Sonraki Slayt"
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* HERO ALTI HIZLI AKSİYON DOCK'I (Kompakt ve Şık 5'li Band) */}
      {/* ------------------------------------------------------------- */}
      <div className="relative z-20 bg-white border-b border-slate-200 shadow-lg">
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
