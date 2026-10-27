"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { companyInfo } from "@/data/company";
import { useLanguage } from "@/context/LanguageContext";
import {
  Send,
  Scale,
  FileText,
  Users,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
} from "lucide-react";

export default function Hero() {
  const { language, isRTL, localePath } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const touchStartX = useRef<number | null>(null);

  // Dile göre kurumsal manşet slaytları
  const slidesByLang = {
    tr: [
      {
        id: 1,
        badge: "Yetkili Gümrük Müşavirliği • 25+ Yıllık Tecrübe",
        slogans: [
          "Çözüm Odaklı Yaklaşım",
          "Koşulsuz Müşteri Memnuniyeti",
          "Yüksek Kaliteli Hizmet Anlayışı",
        ],
        description: "25 yılı aşkın sektörel tecrübemiz ve yetkili kadromuzla kesintisiz gümrükleme.",
      },
      {
        id: 2,
        badge: "Dijital Gümrükleme & Hızlı Tescil",
        slogans: [
          "Sıfır Gecikme & Hızlı Tescil",
          "Evrim Web ile 7/24 Canlı Takip",
          "%99.8 Zamanında İntaç Garantisi",
        ],
        description: "Tüm ithalat ve ihracat beyannamelerinizi ofisinizden anlık olarak takip edin.",
      },
      {
        id: 3,
        badge: "Mevzuat Analizi & Hukuki Güvence",
        slogans: [
          "Mevzuata %100 Tam Uyum",
          "Doğru GTİP Tespiti & Vergi Analizi",
          "Dahilde İşleme (DİR) & Teşvik Danışmanlığı",
        ],
        description: "Resmi Gazete tebliğlerini anlık analiz ederek cezai riskleri sıfıra indiriyoruz.",
      },
      {
        id: 4,
        badge: "Geniş Saha Ağı & Liman Hâkimiyeti",
        slogans: [
          "Tüm Liman & Gümrüklerde Saha Gücü",
          "Hava, Deniz, Kara ve Serbest Bölge Çözümleri",
          "Dış Ticarette Stratejik Çözüm Ortağınız",
        ],
        description: "Ambarlı, Erenköy, Muratbey, İGA ve tüm gümrük müdürlüklerinde yetkili saha ekipleri.",
      },
    ],
    en: [
      {
        id: 1,
        badge: "Authorized Customs Brokerage • 25+ Years Experience",
        slogans: [
          "Solution-Oriented Approach",
          "Unconditional Customer Satisfaction",
          "High Quality Brokerage Standards",
        ],
        description: "Reliable customs brokerage with accredited brokers and dedicated logistics professionals.",
      },
      {
        id: 2,
        badge: "Digital Clearance & Instant Declaration",
        slogans: [
          "Zero Delay & Fast Processing",
          "24/7 Real-Time Tracking via Evrim Web",
          "99.8% On-Time Clearance Guarantee",
        ],
        description: "Monitor all import and export customs declarations live from your office.",
      },
      {
        id: 3,
        badge: "Regulatory Compliance & Legal Security",
        slogans: [
          "100% Strict Legal Compliance",
          "Accurate HS Code & Tariff Analysis",
          "Inward Processing (IPR) Advisory",
        ],
        description: "Continuous monitoring of official gazettes and decrees to eliminate all penalty risks.",
      },
      {
        id: 4,
        badge: "Nationwide Port Network & Presence",
        slogans: [
          "Field Operations in All Major Ports",
          "Air, Ocean, Road & Free Zone Regimes",
          "Your Strategic Cross-Border Partner",
        ],
        description: "Accredited operational teams at Ambarlı, Erenköy, Muratbey, and major Turkish ports.",
      },
    ],
    ar: [
      {
        id: 1,
        badge: "تخليص واستشارات جمركية معتمدة • خبرة تتجاوز 25 عاماً",
        slogans: [
          "نهج عملي يركز على الحلول",
          "رضا مطلق وتام للعملاء",
          "أعلى معايير الخدمة الجمركية",
        ],
        description: "ثقة راسخة مع نخبة من المستشارين الجمركيين المعتمدين وفريق متخصص بخبرة تفوق 25 عاماً.",
      },
      {
        id: 2,
        badge: "تخليص رقمي فوري وتسجيل سريع",
        slogans: [
          "سرعة فائقة وبدون أي تأخير",
          "متابعة مباشرة 24/7 عبر بوابة إفريم",
          "ضمان إنجاز في الموعد بنسبة %99.8",
        ],
        description: "تابع كافة بيانات الاستيراد والتصدير الجمركية الخاصة بكم لحظة بلحظة من مكتبكم.",
      },
      {
        id: 3,
        badge: "تحليل اللوائح وحماية قانونية متكاملة",
        slogans: [
          "امتثال كامل للقوانين والتشريعات",
          "تحديد دقيق للرمز الجمركي والرسوم",
          "استشارات الإدخال المؤقت والحوافز",
        ],
        description: "تحليل فوري لقرارات الجريدة الرسمية لتجنب أي غرامات أو مخاطر جمركية.",
      },
      {
        id: 4,
        badge: "شبكة تغطية ميدانية في كافة الموانئ",
        slogans: [
          "تواجد ميداني في جميع المنافذ الجمركية",
          "حلول الشحن الجوي والبحري والبري",
          "شريككم الاستراتيجي في التجارة الخارجية",
        ],
        description: "كوادر تشغيلية معتمدة في أمبارلي، إرينكوي، مراتبك، وكافة المطارات والموانئ.",
      },
    ],
    es: [
      {
        id: 1,
        badge: "Agencia Aduanera Homologada • 25+ Años de Experiencia",
        slogans: [
          "Enfoque Orientado a Soluciones",
          "Satisfacción Incondicional del Cliente",
          "Máximos Estándares de Servicio Aduanero",
        ],
        description: "Confianza sólida y equipo de agentes aduaneros homologados con más de 25 años de experiencia.",
      },
      {
        id: 2,
        badge: "Despacho Digital y Registro Rápido",
        slogans: [
          "Cero Retrasos y Despacho Exprés",
          "Seguimiento 24/7 con Evrim Web",
          "99.8% Garantía de Despacho a Tiempo",
        ],
        description: "Supervise todas sus declaraciones de importación y exportación en vivo desde su oficina.",
      },
      {
        id: 3,
        badge: "Análisis Normativo y Seguridad Jurídica",
        slogans: [
          "Cumplimiento Legal Estricto 100%",
          "Determinación de Códigos HS y Aranceles",
          "Consultoría en Regímenes Especiales (DİR)",
        ],
        description: "Análisis permanente de los boletines oficiales para anular cualquier riesgo de sanción.",
      },
      {
        id: 4,
        badge: "Red Operativa en Todos los Puertos",
        slogans: [
          "Presencia en Todos los Recintos Aduaneros",
          "Aéreo, Marítimo, Terrestre y Zonas Francas",
          "Su Socio Estratégico en Comercio Exterior",
        ],
        description: "Equipos operativos acreditados en Ambarlı, Erenköy, Muratbey y los principales puertos.",
      },
    ],
  };

  const buttonTexts = {
    tr: {
      quote: "Fiyat Teklifi Al",
      desk: "Müşavir Masası",
      circular: "Mevzuat & Sirküler",
      career: "Kariyer Fırsatları",
    },
    en: {
      quote: "Get a Price Quote",
      desk: "Broker Desk",
      circular: "Customs Circulars",
      career: "Career Opportunities",
    },
    ar: {
      quote: "طلب عرض سعر",
      desk: "مكتب المستشار الجمركي",
      circular: "النشرات واللوائح",
      career: "فرص العمل والتوظيف",
    },
    es: {
      quote: "Solicitar Cotización",
      desk: "Mesa del Agente",
      circular: "Legislación y Circulares",
      career: "Bolsa de Trabajo",
    },
  };

  const slides = slidesByLang[language] || slidesByLang.tr;
  const btn = buttonTexts[language] || buttonTexts.tr;

  // Sayfa ilk yüklendiğinde ilk slayt animasyonlarının tetiklenmesi için mount kontrolü
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 60);
    return () => clearTimeout(timer);
  }, []);

  // Otomatik kayma: 4.8 saniyede bir diğer slayta geçer
  useEffect(() => {
    if (!isMounted) return;
    const timer = setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4800);
    return () => clearTimeout(timer);
  }, [currentSlide, slides.length, isMounted]);

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
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <h1 className="sr-only">
        Kalem Gümrük Müşavirliği — İstanbul Yetkili Gümrük Müşavirliği ve Dış Ticaret Çözümleri
      </h1>

      {/* ------------------------------------------------------------- */}
      {/* 1. GÖRSEL ARKA PLAN (Net Görünür, Sinematik ve Canlı) */}
      {/* ------------------------------------------------------------- */}
      <div className="absolute inset-0 z-0">
        <div className="sm:hidden absolute inset-0">
          <Image
            src="/kalem-gumruk-hero-mobile.webp"
            alt="Kalem Gümrük Müşavirliği — İstanbul Merkez ve Liman Gümrükleme Operasyonları"
            fill
            priority
            sizes="100vw"
            quality={90}
            className="object-cover object-[center_35%] filter brightness-105 contrast-[1.02]"
          />
        </div>

        <div className="hidden sm:block absolute inset-0">
          <Image
            src="/kalem-gumruk-hero.webp"
            alt="Kalem Gümrük Müşavirliği — İstanbul Merkez ve Liman Gümrükleme Operasyonları"
            fill
            priority
            sizes="100vw"
            quality={90}
            className="object-cover object-center filter brightness-100 contrast-[1.02]"
          />
        </div>

        {/* Yumuşak ve sinematik ışık - Görseli kapatmayan netlik */}
        <div className="absolute inset-0 bg-slate-950/25"></div>
        <div className={`absolute inset-0 ${isRTL ? "bg-gradient-to-l" : "bg-gradient-to-r"} from-slate-950/85 via-slate-950/45 to-transparent`}></div>
        <div className="sm:hidden absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-slate-950/20 pointer-events-none"></div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 2. HERO MANŞET ALANI (Ferah, Görseli Gösteren ve Dengeli) */}
      {/* ------------------------------------------------------------- */}
      <div className="relative z-10 w-full min-h-[420px] sm:min-h-[440px] lg:min-h-[480px] flex items-center overflow-hidden pb-6 sm:pb-8">
        <div
          dir="ltr"
          className="w-full flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {slides.map((slide, sIndex) => {
            const isActive = isMounted && currentSlide === sIndex;
            return (
              <div
                key={slide.id}
                dir={isRTL ? "rtl" : "ltr"}
                className="min-w-full w-full shrink-0 flex items-center"
              >
                <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-5 sm:py-8 flex flex-col justify-center items-start">
                  <div className="w-full max-w-2xl sm:max-w-3xl space-y-2 sm:space-y-2.5">
                    
                    {/* Üst Rozet */}
                    <div
                      className={`transition-all ${
                        isActive ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
                      }`}
                      style={{
                        transitionDuration: isActive ? "800ms" : "200ms",
                        transitionDelay: isActive ? "100ms" : "0ms",
                        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
                      }}
                    >
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/65 backdrop-blur-md border border-white/15 text-[10px] sm:text-xs font-semibold text-[#44B9CD] tracking-wider uppercase">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#44B9CD] animate-pulse"></span>
                        {slide.badge}
                      </div>
                    </div>

                    {/* Sloganlar - Kompakt ve Güçlü Tipografi */}
                    <div className="space-y-1.5 sm:space-y-2">
                      {slide.slogans.map((slogan, idx) => {
                        const delayMs = 250 + idx * 450;
                        return (
                          <div
                            key={idx}
                            className={`transition-all ${
                              isActive ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-6 pointer-events-none"
                            }`}
                            style={{
                              transitionDuration: isActive ? "900ms" : "250ms",
                              transitionDelay: isActive ? `${delayMs}ms` : "0ms",
                              transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
                            }}
                          >
                            <div className={`group relative inline-flex items-center max-w-full bg-slate-950/45 backdrop-blur-md ${
                              isRTL ? "pr-3.5 sm:pr-4 pl-3.5 sm:pl-5 text-right" : "pl-3.5 sm:pl-4 pr-3.5 sm:pr-5 text-left"
                            } py-1.5 sm:py-2 rounded-xl border border-white/15 shadow-md`}>
                              <span className={`absolute ${isRTL ? "right-0 rounded-l-full" : "left-0 rounded-r-full"} top-1.5 bottom-1.5 w-1 bg-gradient-to-b from-[#44B9CD] to-[#0284c7]`}></span>
                              <span className="block text-sm sm:text-xl md:text-2xl font-bold text-white tracking-tight break-words">
                                {slogan}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Alt Açıklama */}
                    <div
                      className={`pt-0.5 transition-all ${
                        isActive ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
                      }`}
                      style={{
                        transitionDuration: isActive ? "900ms" : "250ms",
                        transitionDelay: isActive ? `${250 + slide.slogans.length * 450}ms` : "0ms",
                        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
                      }}
                    >
                      <div className="inline-flex items-center gap-1.5 max-w-xl text-[11px] sm:text-xs font-medium text-slate-200/90 bg-slate-950/50 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10">
                        <span className="w-1 h-1 rounded-full bg-[#44B9CD] shrink-0"></span>
                        <p>{slide.description}</p>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Sağ & Sol Yönlendirme Okları */}
        <button
          onClick={isRTL ? handleNext : handlePrev}
          aria-label={isRTL ? "التالي" : "Önceki Slayt"}
          className="absolute left-3 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-xs border border-white/20 transition-all hover:scale-110 cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          onClick={isRTL ? handlePrev : handleNext}
          aria-label={isRTL ? "السابق" : "Sonraki Slayt"}
          className="absolute right-3 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-xs border border-white/20 transition-all hover:scale-110 cursor-pointer"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 3. HERO ORTA HİZADA KOMPAKT 4 AKSİYON BUTONU (İkon ve Yazı Yan Yana, Tek Sıra) */}
      {/* ------------------------------------------------------------- */}
      <div className="relative z-20 w-full flex justify-center px-3 sm:px-6 pb-6 sm:pb-8">
        <div className="w-full max-w-2xl sm:max-w-3xl lg:max-w-4xl bg-slate-950/50 backdrop-blur-md rounded-2xl sm:rounded-3xl border border-white/15 shadow-2xl p-1.5 sm:p-2.5">
          <div
            className="hero-buttons-grid grid grid-cols-4 gap-1.5 sm:gap-2"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
              alignItems: "center",
              width: "100%",
            }}
          >
            
            {/* Buton 1: Hızlı Teklif Formu */}
            <Link
              href={localePath("/hizmetlerimiz#teklif")}
              className="group py-2 px-1 sm:py-2.5 sm:px-3 rounded-xl sm:rounded-2xl hover:bg-white/10 active:bg-black/40 transition-all flex items-center justify-center gap-1.5 sm:gap-2 text-center cursor-pointer min-w-0"
              style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center" }}
              title={btn.quote}
            >
              <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-[#44B9CD]/20 text-[#44B9CD] group-hover:bg-[#44B9CD] group-hover:text-[#121B27] flex items-center justify-center transition-all shrink-0 group-hover:scale-105">
                <Send className={`w-3 h-3 sm:w-4 sm:h-4 ${isRTL ? "rotate-180" : ""}`} />
              </div>
              <span className="text-[10px] sm:text-xs font-bold text-white group-hover:text-[#44B9CD] transition-colors leading-tight truncate">
                {btn.quote}
              </span>
            </Link>

            {/* Buton 2: Müşavir Masası */}
            <Link
              href={localePath("/araclar")}
              className="group py-2 px-1 sm:py-2.5 sm:px-3 rounded-xl sm:rounded-2xl hover:bg-white/10 active:bg-black/40 transition-all flex items-center justify-center gap-1.5 sm:gap-2 text-center cursor-pointer min-w-0"
              style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center" }}
              title={btn.desk}
            >
              <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-sky-500/20 text-sky-400 group-hover:bg-sky-500 group-hover:text-[#121B27] flex items-center justify-center transition-all shrink-0 group-hover:scale-105">
                <Scale className="w-3 h-3 sm:w-4 sm:h-4" />
              </div>
              <span className="text-[10px] sm:text-xs font-bold text-white group-hover:text-sky-300 transition-colors leading-tight truncate">
                {btn.desk}
              </span>
            </Link>

            {/* Buton 3: Mevzuat & Sirküler */}
            <Link
              href={localePath("/sirkuler")}
              className="group py-2 px-1 sm:py-2.5 sm:px-3 rounded-xl sm:rounded-2xl hover:bg-white/10 active:bg-black/40 transition-all flex items-center justify-center gap-1.5 sm:gap-2 text-center cursor-pointer min-w-0"
              style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center" }}
              title={btn.circular}
            >
              <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-teal-500/20 text-teal-400 group-hover:bg-teal-500 group-hover:text-[#121B27] flex items-center justify-center transition-all shrink-0 group-hover:scale-105">
                <FileText className="w-3 h-3 sm:w-4 sm:h-4" />
              </div>
              <span className="text-[10px] sm:text-xs font-bold text-white group-hover:text-teal-300 transition-colors leading-tight truncate">
                {btn.circular}
              </span>
            </Link>

            {/* Buton 4: Kariyer Fırsatları */}
            <Link
              href={localePath("/kariyer")}
              className="group py-2 px-1 sm:py-2.5 sm:px-3 rounded-xl sm:rounded-2xl hover:bg-white/10 active:bg-black/40 transition-all flex items-center justify-center gap-1.5 sm:gap-2 text-center cursor-pointer min-w-0"
              style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center" }}
              title={btn.career}
            >
              <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-amber-500/20 text-amber-400 group-hover:bg-amber-500 group-hover:text-[#121B27] flex items-center justify-center transition-all shrink-0 group-hover:scale-105">
                <Users className="w-3 h-3 sm:w-4 sm:h-4" />
              </div>
              <span className="text-[10px] sm:text-xs font-bold text-white group-hover:text-amber-300 transition-colors leading-tight truncate">
                {btn.career}
              </span>
            </Link>

          </div>
        </div>
      </div>
    </section>
  );
}
