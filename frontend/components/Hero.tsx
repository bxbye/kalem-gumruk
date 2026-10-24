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
  Lock,
  ChevronLeft,
  ChevronRight,
  Sparkles,
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
        badge: "Yetkili Gümrük Müşavirliği • 1997'den Bugüne",
        slogans: [
          "Çözüm Odaklı Yaklaşım",
          "Koşulsuz Müşteri Memnuniyeti",
          "Yüksek Kaliteli Hizmet Anlayışı",
        ],
        description: "1997'den bugüne yetkili gümrük müşavirliği ve uzman ekibimizle kesintisiz güven.",
      },
      {
        id: 2,
        badge: "Dijital Gümrükleme & Hızlı Tescil",
        slogans: [
          "Sıfır Gecikme & Hızlı Tescil",
          "Evrim Web Gümrük ile 7/24 Canlı Takip",
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
        description: "Ambarlı, Erenköy, Muratbey, İGA ve tüm limanlarda yetkili operasyon kadrosu.",
      },
    ],
    en: [
      {
        id: 1,
        badge: "Authorized Customs Brokerage • Since 1997",
        slogans: [
          "Solution-Oriented Approach",
          "Unconditional Customer Satisfaction",
          "High Quality Brokerage Standards",
        ],
        description: "Enduring reliability with accredited customs brokers and dedicated logistics professionals since 1997.",
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
        description: "Accredited operational teams at Ambarlı, Erenköy, Muratbey, Istanbul Airports and seaports.",
      },
    ],
    ar: [
      {
        id: 1,
        badge: "تخليص واستشارات جمركية معتمدة • منذ عام 1997",
        slogans: [
          "نهج عملي يركز على الحلول",
          "رضا مطلق وتام للعملاء",
          "أعلى معايير الخدمة الجمركية",
        ],
        description: "ثقة راسخة مع نخبة من المستشارين الجمركيين المعتمدين وفريق متخصص منذ عام 1997.",
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
        badge: "Agencia Aduanera Homologada • Desde 1997",
        slogans: [
          "Enfoque Orientado a Soluciones",
          "Satisfacción Incondicional del Cliente",
          "Máximos Estándares de Servicio Aduanero",
        ],
        description: "Confianza perdurable con agentes aduaneros colegiados y profesionales dedicados desde 1997.",
      },
      {
        id: 2,
        badge: "Despacho Digital y Registro Inmediato",
        slogans: [
          "Cero Demoras y Tramitación Ágil",
          "Seguimiento 24/7 en Tiempo Real vía Evrim",
          "99.8% de Despachos en Plazo Garantizado",
        ],
        description: "Monitorice todas sus declaraciones de importación y exportación en directo desde su oficina.",
      },
      {
        id: 3,
        badge: "Análisis Normativo y Seguridad Jurídica",
        slogans: [
          "100% de Cumplimiento Legal Estricto",
          "Determinación Exacta de Código HS y Aranceles",
          "Asesoría en Perfeccionamiento Activo (DİR)",
        ],
        description: "Análisis continuo del boletín oficial para eliminar cualquier riesgo de sanción o contingencia.",
      },
      {
        id: 4,
        badge: "Presencia y Red Operativa en Todos los Puertos",
        slogans: [
          "Operatividad en Todas las Aduanas y Puertos",
          "Regímenes Aéreos, Marítimos, Terrestres y Francos",
          "Su Socio Estratégico en Comercio Exterior",
        ],
        description: "Equipos operativos autorizados en Ambarlı, Erenköy, Muratbey y principales aeropuertos.",
      },
    ],
  };

  const slides = slidesByLang[language] || slidesByLang.tr;

  const dockTexts = {
    tr: {
      quoteBadge: "Online Talep & Fiyat",
      quoteTitle: "Hızlı Teklif Formu",
      quoteDesc: "Anında gümrük maliyet teklifi alın",
      deskBadge: "Sorgulama & Analiz",
      deskTitle: "Müşavir Masası",
      deskDesc: "BİLGE, TAREKS, GTİP & Kurlar",
      circularBadge: "Resmi Gazete & Bülten",
      circularTitle: "Mevzuat & Sirküler",
      circularDesc: "Güncel tebliğ ve sirkülerler",
      careerBadge: "İK & Kariyer",
      careerTitle: "Kariyer Fırsatları",
      careerDesc: "Açık pozisyonlar ve staj",
      portalBadge: "Canlı Müşteri Girişi",
      portalTitle: "Evrim Web Gümrük",
      portalDesc: "Dosya & İntaç Takibi →",
    },
    en: {
      quoteBadge: "Online Rate & Quote",
      quoteTitle: "Quick Quote Form",
      quoteDesc: "Get an instant customs brokerage estimate",
      deskBadge: "Search & Inquiry",
      deskTitle: "Broker Desk",
      deskDesc: "BİLGE, TAREKS, HS Code & Tariffs",
      circularBadge: "Official Gazettes",
      circularTitle: "Customs Circulars",
      circularDesc: "Current decrees & trade regulations",
      careerBadge: "HR & Careers",
      careerTitle: "Career Opportunities",
      careerDesc: "Open positions & internships",
      portalBadge: "Live Client Access",
      portalTitle: "Evrim Web Customs",
      portalDesc: "Tracking & Clearance Status →",
    },
    ar: {
      quoteBadge: "طلب فوري وعروض أسعار",
      quoteTitle: "نموذج عرض سعر سريع",
      quoteDesc: "احصل على تسعيرة فورية لتكاليف التخليص",
      deskBadge: "استعلام وتحليل",
      deskTitle: "مكتب المستشار الجمركي",
      deskDesc: "الرموز الجمركية والضرائب والأنظمة",
      circularBadge: "الجريدة الرسمية والنشرات",
      circularTitle: "النشرات واللوائح الجمركية",
      circularDesc: "أحدث القرارات والتوجيهات الرسمية",
      careerBadge: "الموارد البشرية والتوظيف",
      careerTitle: "فرص العمل والوظائف",
      careerDesc: "الوظائف المتاحة وبرامج التدريب",
      portalBadge: "دخول مباشر للعملاء",
      portalTitle: "بوابة إفريم الجمركية",
      portalDesc: "متابعة المعاملات والإنجاز →",
    },
    es: {
      quoteBadge: "Presupuesto Online",
      quoteTitle: "Formulario de Cotización",
      quoteDesc: "Obtenga estimación aduanera inmediata",
      deskBadge: "Consulta y Análisis",
      deskTitle: "Mesa del Agente",
      deskDesc: "Código HS, Aranceles y Divisas",
      circularBadge: "Boletín Oficial y Circulares",
      circularTitle: "Legislación y Circulares",
      circularDesc: "Disposiciones arancelarias actuales",
      careerBadge: "RRHH y Empleo",
      careerTitle: "Bolsa de Trabajo",
      careerDesc: "Vacantes activas y prácticas",
      portalBadge: "Acceso Clientes",
      portalTitle: "Portal Evrim Aduanas",
      portalDesc: "Seguimiento de Despachos →",
    },
  };

  const dock = dockTexts[language] || dockTexts.tr;

  // Sayfa ilk yüklendiğinde ilk slayt animasyonlarının tetiklenmesi için mount kontrolü
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 60);
    return () => clearTimeout(timer);
  }, []);

  // Otomatik kayma: Tüm yazılar geldikten sonra (~2.8s) tam 2 saniye bekleyip diğer slayta geçer (Toplam 4.8 saniye)
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
      {/* SEO Semantik H1 - Arama motorları ve ekran okuyucular için birincil odak başlığı */}
      <h1 className="sr-only">
        Kalem Gümrük Müşavirliği — İstanbul Yetkili Gümrük Müşavirliği ve Dış Ticaret Çözümleri
      </h1>

      {/* ------------------------------------------------------------- */}
      {/* 1. GÖRSEL ARKA PLAN (Net Görünür, Sinematik ve Yumuşak Işık) */}
      {/* ------------------------------------------------------------- */}
      <div className="absolute inset-0 z-0">
        {/* Mobil Görsel (< sm / mobil ekranlar) */}
        <div className="sm:hidden absolute inset-0">
          <Image
            src="/kalem-gumruk-hero-mobile.webp"
            alt="Kalem Gümrük Müşavirliği — İstanbul Merkez ve Liman Gümrükleme Operasyonları"
            fill
            priority
            sizes="100vw"
            quality={85}
            className="object-cover object-center filter brightness-95"
          />
        </div>

        {/* Masaüstü ve Tablet Görsel (>= sm) */}
        <div className="hidden sm:block absolute inset-0">
          <Image
            src="/kalem-gumruk-hero.webp"
            alt="Kalem Gümrük Müşavirliği — İstanbul Merkez ve Liman Gümrükleme Operasyonları"
            fill
            priority
            sizes="100vw"
            quality={85}
            className="object-cover object-center filter brightness-95"
          />
        </div>

        {/* Yumuşak karartıcı yarı saydam perde */}
        <div className="absolute inset-0 bg-slate-950/40"></div>
        {/* Yazıların soft ve berrak okunması için sol/sağ tarafta sinematik gradyan */}
        <div className={`absolute inset-0 ${isRTL ? "bg-gradient-to-l" : "bg-gradient-to-r"} from-slate-950/85 via-slate-950/45 to-transparent`}></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/30 via-transparent to-black/20 pointer-events-none"></div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 2. KARACA TARZI YATAY KAYAN MANŞET SLIDER ALANI */}
      {/* ------------------------------------------------------------- */}
      <div className="relative z-10 w-full min-h-[440px] sm:min-h-[480px] lg:min-h-[520px] flex items-center overflow-hidden">
        {/* Yatay Kayan Slider Bandı (Horizontal Slide Track - daima LTR koordinat sisteminde kesintisiz kayar) */}
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
                <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-12 sm:py-16 flex flex-col justify-center items-start">
                  <div className="w-full max-w-2xl sm:max-w-3xl space-y-3.5">
                    {/* Üst Rozet / Prestij Hapı */}
                    <div
                      className={`transition-all ${
                        isActive
                          ? "opacity-100 translate-y-0"
                          : "opacity-0 -translate-y-4 pointer-events-none"
                      }`}
                      style={{
                        transitionDuration: isActive ? "800ms" : "200ms",
                        transitionDelay: isActive ? "100ms" : "0ms",
                        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
                      }}
                    >
                      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/55 backdrop-blur-md border border-white/15 shadow-sm text-[11px] sm:text-xs font-semibold text-[#44B9CD] tracking-wider uppercase">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#44B9CD] animate-pulse"></span>
                        {slide.badge}
                      </div>
                    </div>

                    {/* Slogan Kartları: Soft, cam dokulu, zarif ve karizmatik kurumsal tipografi */}
                    <div className="space-y-2 sm:space-y-2.5">
                      {slide.slogans.map((slogan, idx) => {
                        // Sıralı gecikme: 1. slogan 250ms, 2. slogan 750ms, 3. slogan 1250ms
                        const delayMs = 250 + idx * 500;
                        return (
                          <div
                            key={idx}
                            className={`transition-all ${
                              isActive
                                ? "opacity-100 translate-y-0"
                                : "opacity-0 -translate-y-6 pointer-events-none"
                            }`}
                            style={{
                              transitionDuration: isActive ? "900ms" : "250ms",
                              transitionDelay: isActive ? `${delayMs}ms` : "0ms",
                              transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
                            }}
                          >
                            <div className={`group relative inline-flex items-center max-w-full bg-slate-950/40 hover:bg-slate-950/50 backdrop-blur-md ${
                              isRTL ? "pr-4 sm:pr-5 pl-4 sm:pl-6 text-right" : "pl-4 sm:pl-5 pr-4 sm:pr-6 text-left"
                            } py-2 sm:py-2.5 rounded-xl border border-white/15 shadow-[0_8px_24px_rgba(0,0,0,0.25)] transition-colors`}>
                              {/* Turkuaz aksan çizgisi (RTL'de sağda, LTR'de solda) */}
                              <span className={`absolute ${isRTL ? "right-0 rounded-l-full" : "left-0 rounded-r-full"} top-2 bottom-2 w-1 bg-gradient-to-b from-[#44B9CD] via-[#38bdf8] to-[#0284c7]`}></span>
                              <span className="block text-base sm:text-2xl md:text-[28px] font-bold text-white tracking-tight break-words drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
                                {slogan}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Alt Kısa Açıklama - Sloganlardan hemen sonra sırayla yumuşakça gelsin */}
                    <div
                      className={`pt-1 transition-all ${
                        isActive
                          ? "opacity-100 translate-y-0"
                          : "opacity-0 -translate-y-4 pointer-events-none"
                      }`}
                      style={{
                        transitionDuration: isActive ? "900ms" : "250ms",
                        transitionDelay: isActive
                          ? `${250 + slide.slogans.length * 500}ms`
                          : "0ms",
                        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
                      }}
                    >
                      <div className="inline-flex items-center gap-2 max-w-xl text-xs sm:text-sm font-medium text-slate-200/90 bg-slate-950/45 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 shadow-sm">
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
          onClick={isRTL ? handleNext : handlePrev}
          aria-label={isRTL ? "التالي" : "Önceki Slayt"}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-xs border border-white/20 transition-all hover:scale-110 cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={isRTL ? handlePrev : handleNext}
          aria-label={isRTL ? "السابق" : "Sonraki Slayt"}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-xs border border-white/20 transition-all hover:scale-110 cursor-pointer"
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
            {/* 1. Hızlı Teklif Formu - Vurgulu & Dikkat Çekici */}
            <Link
              href={localePath("/hizmetlerimiz#teklif")}
              className="group relative p-4 sm:p-5 bg-gradient-to-br from-[#0284c7] via-[#0369a1] to-[#0f4c81] text-white hover:from-[#0369a1] hover:to-[#075985] transition-all flex items-center justify-between shadow-md overflow-hidden"
            >
              {/* Parlama efekti */}
              <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-white/10 rounded-full blur-xl pointer-events-none group-hover:scale-150 transition-transform"></div>
              <div className="relative z-10 space-y-0.5">
                <div className="text-[10px] uppercase tracking-wider text-[#a5f3fc] font-extrabold flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-[#38bdf8] animate-pulse" />
                  <span>{dock.quoteBadge}</span>
                </div>
                <div className="text-xs sm:text-sm font-extrabold text-white group-hover:text-[#e0f2fe] transition-colors">
                  {dock.quoteTitle}
                </div>
                <div className="text-[11px] text-cyan-100 hidden sm:block">
                  {dock.quoteDesc}
                </div>
              </div>
              <div className="relative z-10 w-9 h-9 rounded-xl bg-white/20 group-hover:bg-white text-white group-hover:text-[#0369a1] flex items-center justify-center transition-all shrink-0 shadow-xs group-hover:scale-110">
                <Send className={`w-4 h-4 ${isRTL ? "rotate-180" : ""}`} />
              </div>
            </Link>

            {/* 2. Müşavir Masası */}
            <Link
              href={localePath("/araclar")}
              className="group p-4 sm:p-5 bg-gradient-to-br from-indigo-50/70 via-white to-slate-50/60 hover:from-indigo-100/70 hover:to-indigo-50/40 text-slate-800 transition-all flex items-center justify-between"
            >
              <div className="space-y-0.5">
                <div className="text-[10px] uppercase tracking-wider text-indigo-600 font-extrabold">
                  {dock.deskBadge}
                </div>
                <div className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-indigo-700 transition-colors">
                  {dock.deskTitle}
                </div>
                <div className="text-[11px] text-slate-500 hidden sm:block">
                  {dock.deskDesc}
                </div>
              </div>
              <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white flex items-center justify-center transition-all shrink-0 shadow-xs group-hover:scale-105">
                <Scale className="w-4 h-4" />
              </div>
            </Link>

            {/* 3. Mevzuat Haberleri */}
            <Link
              href={localePath("/sirkuler")}
              className="group p-4 sm:p-5 bg-gradient-to-br from-emerald-50/70 via-white to-slate-50/60 hover:from-emerald-100/70 hover:to-emerald-50/40 text-slate-800 transition-all flex items-center justify-between"
            >
              <div className="space-y-0.5">
                <div className="text-[10px] uppercase tracking-wider text-emerald-600 font-extrabold">
                  {dock.circularBadge}
                </div>
                <div className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                  {dock.circularTitle}
                </div>
                <div className="text-[11px] text-slate-500 hidden sm:block">
                  {dock.circularDesc}
                </div>
              </div>
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white flex items-center justify-center transition-all shrink-0 shadow-xs group-hover:scale-105">
                <FileText className="w-4 h-4" />
              </div>
            </Link>

            {/* 4. Kariyer */}
            <Link
              href={localePath("/kariyer")}
              className="group p-4 sm:p-5 bg-gradient-to-br from-amber-50/70 via-white to-slate-50/60 hover:from-amber-100/70 hover:to-amber-50/40 text-slate-800 transition-all flex items-center justify-between"
            >
              <div className="space-y-0.5">
                <div className="text-[10px] uppercase tracking-wider text-amber-600 font-extrabold">
                  {dock.careerBadge}
                </div>
                <div className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-amber-700 transition-colors">
                  {dock.careerTitle}
                </div>
                <div className="text-[11px] text-slate-500 hidden sm:block">
                  {dock.careerDesc}
                </div>
              </div>
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-600 group-hover:bg-amber-600 group-hover:text-white flex items-center justify-center transition-all shrink-0 shadow-xs group-hover:scale-105">
                <Users className="w-4 h-4" />
              </div>
            </Link>

            {/* 5. Evrim Web Gümrük (Canlı Müşteri Girişi - Vurgulu Kart) */}
            <a
              href={companyInfo.evrimPortalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="col-span-2 sm:col-span-1 p-4 sm:p-5 bg-gradient-to-br from-[#1E2A3A] via-[#15202D] to-[#0F172A] hover:from-[#25364B] hover:to-[#1E2A3A] text-white transition-all flex items-center justify-between shadow-md group relative overflow-hidden"
            >
              <div className="space-y-0.5">
                <div className="text-[10px] uppercase tracking-wider text-[#44B9CD] group-hover:text-[#44B9CD] font-extrabold flex items-center gap-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  {dock.portalBadge}
                </div>
                <div className="text-xs sm:text-sm font-extrabold text-white">
                  {dock.portalTitle}
                </div>
                <div className="text-[11px] text-slate-300 group-hover:text-white">
                  {dock.portalDesc}
                </div>
              </div>
              <div className="w-9 h-9 rounded-xl bg-white/10 group-hover:bg-[#44B9CD] text-[#44B9CD] group-hover:text-[#1E2A3A] flex items-center justify-center transition-all shrink-0 shadow-inner group-hover:scale-105">
                <Lock className="w-4 h-4" />
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
