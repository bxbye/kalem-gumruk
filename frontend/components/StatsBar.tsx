"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";

export default function StatsBar() {
  const { t, language } = useLanguage();

  // 25+ için donanım hızlandırmalı (requestAnimationFrame) akıcı animasyonlu sayaç
  const [experienceCount, setExperienceCount] = useState(1);
  const [isCounterFinished, setIsCounterFinished] = useState(false);

  useEffect(() => {
    // Ana sayfa yüklendikten 1 sn sonra akıcı artış animasyonu başlar
    const delayTimer = setTimeout(() => {
      const startValue = 1;
      const targetValue = 25;
      const duration = 1200; // 1.2 saniyede tatlı ve pürüzsüz tamamlanma
      const startTime = performance.now();

      const animateStep = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // easeOutCubic: Hızlı başlayıp sona doğru pürüzsüzce oturan animasyon
        const ease = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(startValue + (targetValue - startValue) * ease);

        setExperienceCount(current);

        if (progress < 1) {
          requestAnimationFrame(animateStep);
        } else {
          setExperienceCount(targetValue);
          setIsCounterFinished(true);
        }
      };

      requestAnimationFrame(animateStep);
    }, 1000);

    return () => clearTimeout(delayTimer);
  }, []);

  const statsDetails = {
    tr: {
      badge: "Kurumsal Performans & Güvence",
      supportValue: "7/24",
      supportLabel: "Müşavir Takibi & Destek",
    },
    en: {
      badge: "Corporate Performance & Assurance",
      supportValue: "24/7",
      supportLabel: "Broker Tracking & Support",
    },
    ar: {
      badge: "الأداء المؤسسي والضمان",
      supportValue: "24/7",
      supportLabel: "متابعة ودعم مستمر",
    },
    es: {
      badge: "Rendimiento y Garantía Corporativa",
      supportValue: "24/7",
      supportLabel: "Control y Soporte en Vivo",
    },
  };

  const details = statsDetails[language] || statsDetails.tr;

  return (
    <section
      className="relative pt-6 sm:pt-8 pb-8 sm:pb-10 select-none overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #121B27 0%, #1A283C 65%, #F1F5F9 100%)",
        color: "#ffffff",
      }}
    >
      {/* Alttaki Açık Beyaz Alana Yumuşak Degrade Geçişi */}
      <div className="absolute bottom-0 left-0 right-0 h-14 sm:h-18 bg-gradient-to-b from-transparent via-slate-50/70 to-slate-50 pointer-events-none"></div>

      {/* Boydan Boya Kaplayan Geniş Alan */}
      <div className="relative w-full px-4 sm:px-8 lg:px-12 xl:px-16 z-10">
        
        {/* Logodaki Renklerle Kurumsal Rozet (Her Zaman Net ve Okunaklı Garantili Zemin) */}
        <div className="flex justify-center mb-4 sm:mb-5">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-[11px] sm:text-xs font-bold tracking-wider uppercase shadow-lg backdrop-blur-md"
            style={{
              backgroundColor: "#162334",
              borderColor: "rgba(68, 185, 205, 0.5)",
              color: "#ffffff",
            }}
          >
            <span className="w-2 h-2 rounded-full bg-[#44B9CD] shadow-[0_0_8px_#44B9CD] shrink-0"></span>
            <span className="text-white font-extrabold tracking-wide drop-shadow-sm">
              {details.badge}
            </span>
            <span className="text-white/40">•</span>
            <span className="text-[#C19968] font-black">1997</span>
          </div>
        </div>

        {/* 4 Metrik Kartı - Boydan Boya ve Yumuşak Renklerle */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5 lg:gap-6 items-stretch">
          
          {/* 1. METRİK: KURULUŞ YILI (2024) */}
          <div
            className="group relative rounded-2xl sm:rounded-3xl border py-4 px-3 sm:py-5 sm:px-5 lg:py-5 lg:px-6 flex flex-col items-center justify-center text-center shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 backdrop-blur-md"
            style={{
              backgroundColor: "rgba(30, 42, 58, 0.88)",
              borderColor: "rgba(255, 255, 255, 0.12)",
              color: "#ffffff",
            }}
          >
            <div className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white group-hover:scale-105 transition-transform">
              {t.stats.founded.value}
            </div>
            <div className="text-xs sm:text-sm font-bold mt-2 text-slate-300 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C19968]"></span>
              <span>{t.stats.founded.label}</span>
            </div>
          </div>

          {/* 2. METRİK: YILLIK TECRÜBE (AKICI ANİMASYONLU SAYAÇ) */}
          <div
            className="group relative rounded-2xl sm:rounded-3xl border py-4 px-3 sm:py-5 sm:px-5 lg:py-5 lg:px-6 flex flex-col items-center justify-center text-center shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 backdrop-blur-md"
            style={{
              backgroundColor: "rgba(30, 42, 58, 0.88)",
              borderColor: "rgba(68, 185, 205, 0.25)",
              color: "#ffffff",
            }}
          >
            <div className="relative flex items-center justify-center">
              {/* Sayacın arkasında hafif nefes alan aura */}
              <div className="absolute w-20 h-20 rounded-full bg-[#44B9CD]/10 blur-xl pointer-events-none"></div>

              <div className="relative text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight flex items-baseline justify-center text-[#44B9CD] group-hover:scale-105 transition-transform drop-shadow-[0_2px_12px_rgba(68,185,205,0.35)]">
                <span className="tabular-nums">{experienceCount}</span>
                <span
                  className={`text-xl sm:text-2xl lg:text-3xl font-black ml-1 text-[#C19968] transition-all duration-500 ${
                    isCounterFinished ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-50 translate-y-1"
                  }`}
                >
                  +
                </span>
              </div>
            </div>

            <div className="text-xs sm:text-sm font-bold mt-2 text-slate-300 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#44B9CD]"></span>
              <span>{t.stats.experience.label}</span>
            </div>
          </div>

          {/* 3. METRİK: ZAMANINDA İNTAÇ ORANI (%99.8 - SAYFAYI YORMAYAN AKICI ÇİFT KATMANLI DÖNER ÇEMBER) */}
          <div
            className="group relative rounded-2xl sm:rounded-3xl border py-4 px-3 sm:py-5 sm:px-5 lg:py-5 lg:px-6 flex flex-col items-center justify-center text-center shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 ring-1 ring-[#44B9CD]/30 backdrop-blur-md"
            style={{
              backgroundColor: "rgba(30, 42, 58, 0.88)",
              borderColor: "rgba(68, 185, 205, 0.4)",
              color: "#ffffff",
            }}
          >
            {/* Rakamın Etrafını Ferahça Saran Hareketli Yörünge Alanı */}
            <div className="relative my-1 w-36 sm:w-40 lg:w-44 h-12 sm:h-14 lg:h-16 flex items-center justify-center">
              
              {/* Sayının Arkasındaki Geniş ve Yumuşak Işıma (Rakamın üstünü asla kapatmaz) */}
              <div className="absolute w-32 h-10 rounded-full bg-[#44B9CD]/15 blur-lg pointer-events-none"></div>

              {/* Rakamın Etrafında Kesintisiz Dönen Canlı Çizgi Animasyonu */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 160 56">
                {/* 1. Sabit İnce Yörünge İzi */}
                <ellipse
                  cx="80"
                  cy="28"
                  rx="72"
                  ry="23"
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.15)"
                  strokeWidth="1.5"
                />

                {/* 2. Rakamın Etrafında Dönen Canlı Turkuaz Çizgi */}
                <ellipse
                  cx="80"
                  cy="28"
                  rx="72"
                  ry="23"
                  fill="none"
                  stroke="#44B9CD"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeDasharray="90 190"
                  className="drop-shadow-[0_0_8px_#44B9CD]"
                >
                  <animate
                    attributeName="stroke-dashoffset"
                    from="0"
                    to="-280"
                    dur="3.2s"
                    repeatCount="indefinite"
                  />
                </ellipse>

                {/* 3. İkincil Altın Vurgu Parıltı Çizgisi */}
                <ellipse
                  cx="80"
                  cy="28"
                  rx="72"
                  ry="23"
                  fill="none"
                  stroke="#C19968"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeDasharray="45 235"
                  className="opacity-75"
                >
                  <animate
                    attributeName="stroke-dashoffset"
                    from="140"
                    to="-140"
                    dur="3.2s"
                    repeatCount="indefinite"
                  />
                </ellipse>
              </svg>

              {/* Merkezdeki Net ve Keskin Rakam (En üst katmanda, tertemiz) */}
              <span className="relative z-20 text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white select-none drop-shadow-sm">
                {t.stats.intacRate.value}
              </span>
            </div>

            <div className="text-xs sm:text-sm font-bold mt-1.5 text-slate-300 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#44B9CD]"></span>
              <span>{t.stats.intacRate.label}</span>
            </div>
          </div>

          {/* 4. METRİK: 7/24 MÜŞAVİR TAKİBİ & DESTEK */}
          <div
            className="group relative rounded-2xl sm:rounded-3xl border py-4 px-3 sm:py-5 sm:px-5 lg:py-5 lg:px-6 flex flex-col items-center justify-center text-center shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 backdrop-blur-md"
            style={{
              backgroundColor: "rgba(30, 42, 58, 0.88)",
              borderColor: "rgba(255, 255, 255, 0.12)",
              color: "#ffffff",
            }}
          >
            <div className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white group-hover:scale-105 transition-transform flex items-center justify-center gap-1">
              <span>{details.supportValue}</span>
            </div>
            <div className="text-xs sm:text-sm font-bold mt-2 text-slate-300 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C19968]"></span>
              <span>{details.supportLabel}</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
