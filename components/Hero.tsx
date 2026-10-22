"use client";

import { useState, useEffect } from "react";
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
  ChevronLeft,
  ChevronRight,
  Briefcase,
  Layers,
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
        "İthalat, ihracat ve antrepo operasyonlarınızda çeyrek asrı aşkın tecrübemiz ve %99.8 zamanında intaç oranımızla yanınızdayız.",
      primaryCta: {
        text: "Hemen Fiyat & Süreç Teklifi Al",
        href: "#teklif",
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
        "Resmi Gazete'deki en son gümrük tebliğlerini anlık analiz ederek firmanızı olası cezai risklerden koruyor, maliyet avantajı sağlıyoruz.",
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
      {/* Arka Plan Glow & Görsel Efektleri */}
      <div className="absolute inset-0 opacity-15 pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-[#44B9CD]/25 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] rounded-full bg-[#1E2A3A] blur-3xl"></div>
      </div>

      {/* Grid Arka Plan Çizgileri */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>

      {/* Ana Slider Gövdesi */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24 lg:pt-24 lg:pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Sol Kolon: Dinamik Slayt İçeriği */}
          <div className="lg:col-span-8 space-y-6 animate-in fade-in duration-500 key={activeSlide.id}">
            {/* Rozet */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-[#44B9CD]/40 text-xs font-semibold text-[#44B9CD]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{activeSlide.badge}</span>
            </div>

            {/* Başlık */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight text-white min-h-[70px] sm:min-h-[85px] lg:min-h-[110px]">
              {activeSlide.titlePrefix}
              <span className="text-[#44B9CD] underline decoration-[#44B9CD]/30 decoration-wavy">
                {activeSlide.titleHighlight}
              </span>
            </h1>

            {/* Karaca Gümrük Tarzı Güven Veren 3 Temel Slogan */}
            <div className="space-y-2.5 pt-2">
              {activeSlide.slogans.map((slogan, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 text-sm sm:text-base font-semibold text-white/95"
                >
                  <div className="w-6 h-6 rounded-md bg-[#44B9CD]/20 border border-[#44B9CD]/40 flex items-center justify-center text-[#44B9CD] shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <span>{slogan}</span>
                </div>
              ))}
            </div>

            {/* Açıklama */}
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl pt-2">
              {activeSlide.description}
            </p>

            {/* Butonlar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
              {activeSlide.primaryCta.isExternal ? (
                <a
                  href={activeSlide.primaryCta.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2.5 bg-[#44B9CD] hover:bg-[#2f9fb3] text-white font-bold px-7 py-4 rounded-xl shadow-lg transition-all duration-200 text-sm hover:scale-[1.02]"
                >
                  <Lock className="w-4 h-4" />
                  <span>{activeSlide.primaryCta.text}</span>
                  <ExternalLink className="w-4 h-4 text-white/80" />
                </a>
              ) : (
                <Link
                  href={activeSlide.primaryCta.href}
                  className="flex items-center justify-center gap-2.5 bg-[#44B9CD] hover:bg-[#2f9fb3] text-white font-bold px-7 py-4 rounded-xl shadow-lg transition-all duration-200 text-sm hover:scale-[1.02]"
                >
                  <Send className="w-4 h-4" />
                  <span>{activeSlide.primaryCta.text}</span>
                  <ArrowRight className="w-4 h-4 text-white/80" />
                </Link>
              )}

              <a
                href={companyInfo.evrimPortalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 text-white font-semibold px-6 py-4 rounded-xl border border-white/20 transition-all text-sm"
              >
                <ShieldCheck className="w-4 h-4 text-[#44B9CD]" />
                <span>Evrim Web Gümrük Portalı</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </a>
            </div>
          </div>

          {/* Sağ Kolon: Müşavir Masası & Canlı Özet Kartı */}
          <div className="lg:col-span-4 hidden lg:block">
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-7 border border-white/15 shadow-2xl space-y-5">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <div className="text-[11px] text-[#44B9CD] font-bold uppercase tracking-wider">
                    Kurumsal Statü
                  </div>
                  <div className="text-base font-bold text-white">Kalem Müşavir Masası</div>
                </div>
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Canlı Sistem
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-slate-300">Kuruluş Yılı:</span>
                  <span className="font-bold text-white">1997 (25+ Yıl)</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-slate-300">Yetki Belgesi:</span>
                  <span className="font-bold text-[#44B9CD]">A & B Karne Kadrosu</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
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
                className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3 px-4 rounded-xl text-xs transition-all shadow"
              >
                <span>Müşavir WhatsApp: {companyInfo.phone}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Slider Kontrolleri & Göstergeleri (Dots / Kareler) */}
        <div className="flex items-center justify-between pt-10 border-t border-white/10 mt-8">
          {/* Kare Göstergeler (Karaca Sitesindeki Gibi) */}
          <div className="flex items-center gap-2.5">
            {slides.map((slide, index) => (
              <button
                key={slide.id}
                onClick={() => setCurrentSlide(index)}
                aria-label={`Slayt ${index + 1}`}
                className={`transition-all duration-300 rounded-sm ${
                  currentSlide === index
                    ? "w-8 h-3 bg-[#44B9CD] shadow-sm shadow-[#44B9CD]/50"
                    : "w-3 h-3 bg-white/30 hover:bg-white/60"
                }`}
              />
            ))}
          </div>

          {/* İleri / Geri Okları */}
          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1))
              }
              aria-label="Önceki Slayt"
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
              aria-label="Sonraki Slayt"
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* HERO ALTI HIZLI AKSİYON DOCK'I (Görseldeki Mantıkta 5'li Band) */}
      {/* ------------------------------------------------------------- */}
      <div className="relative z-20 bg-white border-b border-slate-200 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 divide-y lg:divide-y-0 lg:divide-x divide-slate-200/80">
            {/* 1. Hızlı Teklif */}
            <Link
              href="/iletisim#teklif"
              className="group p-5 sm:p-6 bg-white hover:bg-slate-50 transition-all flex items-center justify-between"
            >
              <div className="space-y-1">
                <div className="text-[10px] uppercase tracking-wider text-slate-600 font-bold">
                  İşlem Başlat
                </div>
                <div className="text-sm font-bold text-[#1E2A3A] group-hover:text-[#44B9CD] transition-colors">
                  Hızlı Teklif Al
                </div>
                <div className="text-[11px] text-slate-600 hidden sm:block">
                  Maliyet fizibilitesi isteyin
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-slate-100 group-hover:bg-[#1E2A3A] text-slate-700 group-hover:text-[#44B9CD] flex items-center justify-center transition-all shrink-0">
                <Send className="w-5 h-5" />
              </div>
            </Link>

            {/* 2. Müşavir Masası */}
            <Link
              href="/araclar"
              className="group p-5 sm:p-6 bg-white hover:bg-slate-50 transition-all flex items-center justify-between"
            >
              <div className="space-y-1">
                <div className="text-[10px] uppercase tracking-wider text-slate-600 font-bold">
                  Sorgulama & Portallar
                </div>
                <div className="text-sm font-bold text-[#1E2A3A] group-hover:text-[#44B9CD] transition-colors">
                  Müşavir Masası
                </div>
                <div className="text-[11px] text-slate-600 hidden sm:block">
                  BİLGE, TAREKS, GTİP, TCMB
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-slate-100 group-hover:bg-[#1E2A3A] text-slate-700 group-hover:text-[#44B9CD] flex items-center justify-center transition-all shrink-0">
                <Scale className="w-5 h-5" />
              </div>
            </Link>

            {/* 3. Mevzuat Haberleri */}
            <Link
              href="/sirkuler"
              className="group p-5 sm:p-6 bg-white hover:bg-slate-50 transition-all flex items-center justify-between"
            >
              <div className="space-y-1">
                <div className="text-[10px] uppercase tracking-wider text-slate-600 font-bold">
                  Resmi Gazete
                </div>
                <div className="text-sm font-bold text-[#1E2A3A] group-hover:text-[#44B9CD] transition-colors">
                  Mevzuat Haberleri
                </div>
                <div className="text-[11px] text-slate-600 hidden sm:block">
                  Güncel sirküler ve tebliğler
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-slate-100 group-hover:bg-[#1E2A3A] text-slate-700 group-hover:text-[#44B9CD] flex items-center justify-center transition-all shrink-0">
                <FileText className="w-5 h-5" />
              </div>
            </Link>

            {/* 4. Kariyer */}
            <Link
              href="/kariyer"
              className="group p-5 sm:p-6 bg-white hover:bg-slate-50 transition-all flex items-center justify-between"
            >
              <div className="space-y-1">
                <div className="text-[10px] uppercase tracking-wider text-slate-600 font-bold">
                  İnsan Kaynakları
                </div>
                <div className="text-sm font-bold text-[#1E2A3A] group-hover:text-[#44B9CD] transition-colors">
                  Kariyer Alanı
                </div>
                <div className="text-[11px] text-slate-600 hidden sm:block">
                  Açık pozisyonlar ve staj
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-slate-100 group-hover:bg-[#1E2A3A] text-slate-700 group-hover:text-[#44B9CD] flex items-center justify-center transition-all shrink-0">
                <Users className="w-5 h-5" />
              </div>
            </Link>

            {/* 5. Evrim Web Gümrük (Görseldeki Turuncu Buton Mantığıyla Vurgulu Kart) */}
            <a
              href={companyInfo.evrimPortalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="col-span-2 sm:col-span-1 p-5 sm:p-6 bg-gradient-to-r from-[#1E2A3A] to-[#25364b] hover:from-[#44B9CD] hover:to-[#2f9fb3] text-white transition-all flex items-center justify-between shadow-md group"
            >
              <div className="space-y-1">
                <div className="text-[10px] uppercase tracking-wider text-[#44B9CD] group-hover:text-white font-extrabold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                  Canlı Müşteri Portalı
                </div>
                <div className="text-sm font-extrabold text-white">
                  Evrim Web Gümrük
                </div>
                <div className="text-[11px] text-slate-300 group-hover:text-white/90">
                  Dosya & İntaç Takibi →
                </div>
              </div>
              <div className="w-11 h-11 rounded-xl bg-white/10 group-hover:bg-white text-[#44B9CD] group-hover:text-[#1E2A3A] flex items-center justify-center transition-all shrink-0 shadow-inner">
                <Lock className="w-5 h-5" />
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
