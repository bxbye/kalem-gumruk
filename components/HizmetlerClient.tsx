"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { servicesData, ServiceItem } from "@/data/services";
import { companyInfo } from "@/data/company";
import { useLanguage } from "@/context/LanguageContext";
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
  CheckCircle2,
  MessageCircle,
  Phone,
  ShieldCheck,
  Clock,
  Sparkles,
  Search,
  Mail,
  Calendar,
  Send,
  AlertCircle,
  FileText,
  MapPin,
  ChevronRight,
  Database,
} from "lucide-react";

const iconMap: Record<string, React.ReactNode> = {
  ArrowDownToLine: <ArrowDownToLine className="w-5 h-5" />,
  ArrowUpFromLine: <ArrowUpFromLine className="w-5 h-5" />,
  Repeat: <Repeat className="w-5 h-5" />,
  RefreshCw: <RefreshCw className="w-5 h-5" />,
  Warehouse: <Warehouse className="w-5 h-5" />,
  Truck: <Truck className="w-5 h-5" />,
  Building2: <Building2 className="w-5 h-5" />,
  Briefcase: <Briefcase className="w-5 h-5" />,
  Scale: <Scale className="w-5 h-5" />,
  Shield: <Shield className="w-5 h-5" />,
};

export default function ServicesPage({ initialServices }: { initialServices?: ServiceItem[] } = {}) {
  const { t, localePath } = useLanguage();
  const currentServices = initialServices && initialServices.length > 0 ? initialServices : servicesData;
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const categoryLabels: Record<string, string> = {
    all: t.servicesPage.categories.all,
    gumruk: t.servicesPage.categories.gumruk,
    rejim: t.servicesPage.categories.rejim,
    danismanlik: t.servicesPage.categories.danismanlik,
  };

  const serviceSlugToTranslationKey: Record<string, keyof typeof t.services> = {
    ithalat: "import",
    ihracat: "export",
    "dahilde-isleme": "dir",
    "haricte-isleme": "haricte",
    antrepo: "antrepo",
    transit: "transit",
  };

  const getServiceTitle = (service: ServiceItem) => {
    const key = serviceSlugToTranslationKey[service.slug];
    if (key && t.services[key]?.title) {
      return t.services[key].title;
    }
    return service.title;
  };

  const getServiceDesc = (service: ServiceItem) => {
    const key = serviceSlugToTranslationKey[service.slug];
    if (key && t.services[key]?.desc) {
      return t.services[key].desc;
    }
    return service.shortDesc;
  };

  // Form State
  const [requestType, setRequestType] = useState<"teklif" | "randevu">("teklif");
  const [meetingMode, setMeetingMode] = useState<"ofis" | "online" | "telefon">("ofis");
  const [selectedServiceForForm, setSelectedServiceForForm] = useState<string>(currentServices[0]?.title || "İthalat Gümrükleme İşlemleri");
  const [preferredDate, setPreferredDate] = useState<string>("");
  const [preferredTime, setPreferredTime] = useState<string>("morning");

  // Teklif Ek Alanları
  const [volumeEstimate, setVolumeEstimate] = useState<string>("1-5 Dosya / Ay");
  const [customsPort, setCustomsPort] = useState<string>("İstanbul Limanları & Karayolu");

  const [formData, setFormData] = useState({
    fullName: "",
    company: "",
    phone: "",
    email: "",
    message: "",
    honeypot: "",
  });

  const [formStatus, setFormStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [responseMsg, setResponseMsg] = useState("");

  // URL hash (#teklif, #randevu) dinleyici & form alanına yumuşak kaydırma
  useEffect(() => {
    const handleHash = () => {
      if (typeof window === "undefined") return;
      const hash = window.location.hash;
      if (hash === "#teklif" || hash === "#randevu-teklif") {
        setRequestType("teklif");
        const el = document.getElementById("randevu-teklif");
        if (el) {
          setTimeout(() => {
            el.scrollIntoView({ behavior: "smooth" });
          }, 150);
        }
      } else if (hash === "#randevu") {
        setRequestType("randevu");
        const el = document.getElementById("randevu-teklif");
        if (el) {
          setTimeout(() => {
            el.scrollIntoView({ behavior: "smooth" });
          }, 150);
        }
      }
    };

    handleHash();
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);

  const filteredServices = currentServices.filter((service) => {
    const title = getServiceTitle(service);
    const desc = getServiceDesc(service);
    const matchesCategory =
      selectedCategory === "all" || service.category === selectedCategory;
    const matchesSearch =
      title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.shortDesc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Karta tıklandığında alttaki form alanına odaklanma ve hizmeti otomatik seçme
  const handleSelectServiceForQuote = (serviceTitle: string, type: "teklif" | "randevu" = "teklif") => {
    setSelectedServiceForForm(serviceTitle);
    setRequestType(type);
    const formElement = document.getElementById("randevu-teklif");
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus("loading");
    setResponseMsg("");

    try {
      const typeLabel = requestType === "randevu" ? "Müşavir Randevusu" : "Fiyat Teklifi";
      
      let detailsSuffix = "";
      if (requestType === "randevu") {
        const modeText =
          meetingMode === "ofis"
            ? "Ofisimizde Yüz Yüze"
            : meetingMode === "online"
            ? "Online (Meet/Zoom)"
            : "Telefon Görüşmesi";
        detailsSuffix = ` (Randevu Tercihi: ${modeText}${preferredDate ? ` - Tarih: ${preferredDate}` : ""}${
          preferredTime === "morning" ? " Sabah (09:00 - 12:00)" : " Öğleden Sonra (13:30 - 17:30)"
        })`;
      } else {
        detailsSuffix = ` (Teklif Detayı: Hacim: ${volumeEstimate} - Kapı/Liman: ${customsPort})`;
      }

      const fullServiceType = `[${typeLabel}] ${selectedServiceForForm}${detailsSuffix}`;

      // /api/contact endpoint'i D1/SQLite veritabanına kaydeder ve e-posta bildirimi gönderir
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.fullName,
          company: formData.company,
          phone: formData.phone,
          email: formData.email,
          serviceType: fullServiceType,
          message: formData.message,
          honeypot: formData.honeypot,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setFormStatus("success");
        setResponseMsg(
          data.message ||
            "Talebiniz veritabanımıza başarıyla kaydedildi. Uzman gümrük müşavirimiz en kısa sürede sizinle iletişime geçecektir."
        );
        setFormData({
          fullName: "",
          company: "",
          phone: "",
          email: "",
          message: "",
          honeypot: "",
        });
      } else {
        setFormStatus("error");
        setResponseMsg(data.error || "Talebiniz iletilirken bir hata oluştu. Lütfen tekrar deneyiniz.");
      }
    } catch (err) {
      console.error(err);
      setFormStatus("error");
      setResponseMsg("Sunucuya bağlanılamadı. Lütfen doğrudan telefon veya WhatsApp ile ulaşınız.");
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* 1. Üst Kompakt Karşılama Alanı */}
      <section className="bg-gradient-to-b from-[#1E2A3A] via-[#172230] to-[#121B27] text-white py-8 sm:py-10 relative overflow-hidden border-b border-slate-800">
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-[#44B9CD]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-[11px] text-slate-400 mb-3">
            <Link href={localePath("/")} className="hover:text-[#44B9CD] transition-colors">
              {t.servicesPage.breadcrumbHome}
            </Link>
            <span>/</span>
            <span className="text-[#44B9CD] font-medium">{t.servicesPage.breadcrumbCurrent}</span>
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="max-w-2xl space-y-2.5">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#44B9CD]/15 border border-[#44B9CD]/30 text-[#44B9CD] text-[11px] font-bold uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{t.servicesPage.badge}</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {t.servicesPage.title}
              </h1>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {t.servicesPage.desc}
              </p>
            </div>

            {/* Hızlı Aksiyon Butonları */}
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 shrink-0">
              <a
                href="#randevu-teklif"
                className="px-4 py-2.5 rounded-xl bg-[#44B9CD] hover:bg-[#3597a8] text-white text-xs font-bold transition-all shadow-md hover:scale-[1.02] flex items-center gap-1.5 cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                <span>{t.servicesPage.quoteAppointmentBtn}</span>
              </a>

              <a
                href={`https://wa.me/${companyInfo.whatsapp}?text=${encodeURIComponent(
                  companyInfo.whatsappDefaultMessage
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md hover:scale-[1.02] flex items-center gap-1.5"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{t.servicesPage.whatsappBtn}</span>
              </a>

              <a
                href={`tel:${companyInfo.phoneRaw}`}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold transition-all border border-white/20 flex items-center gap-1.5"
              >
                <Phone className="w-4 h-4 text-slate-300" />
                <span>{companyInfo.phone}</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Filtreleme ve Arama Çubuğu */}
      <section id="hizmet-listesi" className="sticky top-16 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs py-3.5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3.5">
            {/* Kategori Sekmeleri */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 no-scrollbar">
              {Object.entries(categoryLabels).map(([key, label]) => {
                const isActive = selectedCategory === key;
                return (
                  <button
                    key={key}
                    onClick={() => setSelectedCategory(key)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
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
                placeholder={t.servicesPage.searchPlaceholder}
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

      {/* 3. Kompakt Hizmet Kartları */}
      <section className="py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredServices.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-8">
              <p className="text-sm text-slate-500 mb-3">
                {t.servicesPage.noResults}
              </p>
              <button
                onClick={() => {
                  setSelectedCategory("all");
                  setSearchQuery("");
                }}
                className="text-xs font-bold text-[#44B9CD] hover:underline cursor-pointer"
              >
                {t.usefulLinksSection.allBtn || "Tümü"}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {filteredServices.map((service) => {
                const serviceIndex = currentServices.findIndex((s) => s.slug === service.slug) + 1;
                const formattedNumber = serviceIndex < 10 ? `0${serviceIndex}` : `${serviceIndex}`;
                const title = getServiceTitle(service);
                const desc = getServiceDesc(service);
                const catLabel =
                  service.category === "gumruk"
                    ? t.servicesPage.categories.gumruk
                    : service.category === "rejim"
                    ? t.servicesPage.categories.rejim
                    : t.servicesPage.categories.danismanlik;

                return (
                  <div
                    key={service.slug}
                    className="bg-white rounded-2xl p-5 shadow-2xs hover:shadow-lg transition-all duration-300 border border-slate-200 hover:border-[#44B9CD]/50 flex flex-col justify-between group relative overflow-hidden"
                  >
                    {/* Üst Vurgu Çizgisi */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#44B9CD] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                    <div>
                      {/* Üst Satır: İkon, Kategori Rozeti ve Numara */}
                      <div className="flex items-center justify-between mb-3.5">
                        <div className="w-10 h-10 rounded-xl bg-[#1E2A3A] text-[#44B9CD] flex items-center justify-center group-hover:bg-[#44B9CD] group-hover:text-white transition-all shadow-2xs">
                          {iconMap[service.iconName] || <Briefcase className="w-5 h-5" />}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                            {catLabel}
                          </span>
                          <span className="text-sm font-extrabold text-slate-300">
                            #{formattedNumber}
                          </span>
                        </div>
                      </div>

                      {/* Başlık */}
                      <h2 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-[#44B9CD] transition-colors mb-1.5 leading-snug line-clamp-1">
                        <Link href={localePath(`/hizmetlerimiz/${service.slug}`)} title={title}>
                          {title}
                        </Link>
                      </h2>

                      {/* Kısa Açıklama */}
                      <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 min-h-[36px]">
                        {desc}
                      </p>
                    </div>

                    {/* Aksiyon Butonları (Detay, WhatsApp, Teklif/Randevu) */}
                    <div className="pt-3.5 mt-3.5 border-t border-slate-100 flex items-center justify-between gap-1.5">
                      {/* 1. Detaya Git */}
                      <Link
                        href={localePath(`/hizmetlerimiz/${service.slug}`)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-[#1E2A3A] text-slate-800 hover:text-white text-[11px] font-bold transition-all"
                        title={t.servicesPage.actionDetails}
                      >
                        <span>{t.servicesPage.actionDetails}</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>

                      <div className="flex items-center gap-1.5">
                        {/* 2. WhatsApp'a Yönlendirme */}
                        <a
                          href={`https://wa.me/${companyInfo.whatsapp}?text=${encodeURIComponent(
                            `Merhaba Kalem Gümrük, ${title} hizmetiniz hakkında hızlı bilgi almak istiyorum.`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white text-[11px] font-bold transition-all"
                          title="WhatsApp"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span className="hidden xs:inline">WhatsApp</span>
                        </a>

                        {/* 3. Randevu / Teklif Formuna Yönlendirme */}
                        <button
                          type="button"
                          onClick={() => handleSelectServiceForQuote(title, "teklif")}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#44B9CD]/10 hover:bg-[#44B9CD] text-[#2b8897] hover:text-white text-[11px] font-bold transition-all cursor-pointer"
                          title={`${t.servicesPage.actionQuote} / ${t.servicesPage.actionAppointment}`}
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>{t.servicesPage.actionQuote} / {t.servicesPage.actionAppointment}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* 4. Randevu Alma & Fiyat Teklifi Alma Formu (Hemen Hizmetlerin Altında) */}
      <section id="randevu-teklif" className="py-14 sm:py-20 bg-gradient-to-b from-slate-100 via-white to-slate-50 relative scroll-mt-20">
        <div id="teklif" className="absolute -top-24 left-0 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10 space-y-2.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#44B9CD]/15 border border-[#44B9CD]/30 text-[#44B9CD] text-xs font-bold uppercase tracking-wider">
              <Calendar className="w-3.5 h-3.5" />
              <span>{t.contactForm.badge}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1E2A3A] tracking-tight">
              {t.servicesPage.quoteAppointmentBtn}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              {t.contactForm.desc}
            </p>
          </div>

          {/* Geniş ve Ferah Container (items-stretch ile eşit boyda iki kolon) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch max-w-6xl mx-auto">
            {/* Sol Taraf: Bilgilendirme ve İletişim Detayları */}
            <div className="lg:col-span-4 bg-[#1E2A3A] text-white rounded-3xl p-7 sm:p-8 shadow-xl flex flex-col justify-between">
              <div className="space-y-5">
                <div>
                  <span className="text-[11px] font-bold text-[#44B9CD] uppercase tracking-wider block mb-1">
                    Kalem Gümrük Müşavirliği
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
                    {t.corporatePage.badge}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {t.contactForm.quoteDesc}
                  </p>
                </div>

                <div className="space-y-4 pt-4 border-t border-slate-700/60">
                  {/* Telefon */}
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-[#44B9CD] shrink-0 mt-0.5">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[11px] text-slate-400">{t.contactForm.phoneTitle}</div>
                      <a
                        href={`tel:${companyInfo.phoneRaw}`}
                        className="text-xs sm:text-sm font-bold text-white hover:text-[#44B9CD] transition-colors"
                      >
                        {companyInfo.phone}
                      </a>
                    </div>
                  </div>

                  {/* WhatsApp */}
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                      <MessageCircle className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[11px] text-slate-400">{t.contactForm.waTitle}</div>
                      <a
                        href={`https://wa.me/${companyInfo.whatsapp}?text=${encodeURIComponent(
                          companyInfo.whatsappDefaultMessage
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs sm:text-sm font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
                      >
                        {companyInfo.phone} (WhatsApp)
                      </a>
                    </div>
                  </div>

                  {/* E-Posta */}
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-[#44B9CD] shrink-0 mt-0.5">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[11px] text-slate-400">{t.contactForm.emailTitle}</div>
                      <a
                        href={`mailto:${companyInfo.email}`}
                        className="text-xs sm:text-sm font-bold text-white hover:text-[#44B9CD] transition-colors"
                      >
                        {companyInfo.email}
                      </a>
                    </div>
                  </div>

                  {/* Adres */}
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-[#44B9CD] shrink-0 mt-0.5">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[11px] text-slate-400">{t.contactPage.addressTitle}</div>
                      <span className="text-xs text-slate-200 leading-snug block">
                        {companyInfo.address}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Veritabanı ve KVKK Güvencesi */}
              <div className="mt-6 pt-4 border-t border-slate-700/60 bg-white/5 rounded-2xl p-4 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-[#44B9CD]">
                  <Database className="w-4 h-4" />
                  <span>{t.contactForm.badge}</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-normal">
                  {t.contactForm.kvkkNotice}
                </p>
              </div>
            </div>

            {/* Sağ Taraf: Geniş Boyutlu ve Sabit Ebatlı İnteraktif Form */}
            <div className="lg:col-span-8 bg-white rounded-3xl p-7 sm:p-9 shadow-xl border border-slate-200 flex flex-col justify-between">
              {formStatus === "success" ? (
                <div className="text-center py-20 space-y-4 my-auto">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">{t.contactForm.successTitle}</h3>
                  <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
                    {responseMsg || t.contactForm.defaultSuccessMsg}
                  </p>
                  <div className="pt-4">
                    <button
                      type="button"
                      onClick={() => setFormStatus("idle")}
                      className="px-6 py-2.5 bg-[#1E2A3A] text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      {t.contactForm.newMsgBtn}
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-4.5">
                  {/* Honeypot Spam Koruması */}
                  <input
                    type="text"
                    name="honeypot"
                    value={formData.honeypot}
                    onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
                    className="hidden"
                    tabIndex={-1}
                    autoComplete="off"
                  />

                  {/* 1. Talep Türü Seçimi (Sekmeler) */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2">
                      {t.contactForm.subjectLabel}
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setRequestType("teklif")}
                        className={`h-13 px-4 rounded-xl border text-xs sm:text-sm font-bold flex items-center justify-center gap-2.5 transition-all cursor-pointer ${
                          requestType === "teklif"
                            ? "bg-[#1E2A3A] text-white border-[#1E2A3A] shadow-md scale-[1.01]"
                            : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        <FileText className="w-4 h-4 text-[#44B9CD]" />
                        <span>{t.servicesPage.actionQuote}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setRequestType("randevu")}
                        className={`h-13 px-4 rounded-xl border text-xs sm:text-sm font-bold flex items-center justify-center gap-2.5 transition-all cursor-pointer ${
                          requestType === "randevu"
                            ? "bg-[#1E2A3A] text-white border-[#1E2A3A] shadow-md scale-[1.01]"
                            : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        <Calendar className="w-4 h-4 text-[#44B9CD]" />
                        <span>{t.servicesPage.actionAppointment}</span>
                      </button>
                    </div>
                  </div>

                  {/* 2. DİNAMİK ALAN - Sabit Kilitli Yükseklik (h-[120px]) Sayfa Kesinlikle Zıplamaz */}
                  <div className="h-[124px] rounded-2xl bg-slate-50/90 border border-slate-200 p-3.5 flex flex-col justify-between overflow-hidden">
                    {requestType === "randevu" ? (
                      /* Randevu Modu Alanları */
                      <div className="flex flex-col justify-between h-full">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-bold text-slate-800">
                            Görüşme Tercihi:
                          </span>
                          <div className="grid grid-cols-3 gap-1.5 w-auto">
                            <button
                              type="button"
                              onClick={() => setMeetingMode("ofis")}
                              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                                meetingMode === "ofis"
                                  ? "bg-[#44B9CD] text-white border-[#44B9CD] shadow-xs"
                                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                              }`}
                            >
                              Ofis
                            </button>
                            <button
                              type="button"
                              onClick={() => setMeetingMode("online")}
                              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                                meetingMode === "online"
                                  ? "bg-[#44B9CD] text-white border-[#44B9CD] shadow-xs"
                                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                              }`}
                            >
                              Online
                            </button>
                            <button
                              type="button"
                              onClick={() => setMeetingMode("telefon")}
                              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                                meetingMode === "telefon"
                                  ? "bg-[#44B9CD] text-white border-[#44B9CD] shadow-xs"
                                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                              }`}
                            >
                              {t.contactForm.phoneTitle}
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                          <div className="flex items-center gap-2">
                            <label className="text-xs font-semibold text-slate-600 shrink-0 w-24">
                              Tarih:
                            </label>
                            <input
                              type="date"
                              value={preferredDate}
                              onChange={(e) => setPreferredDate(e.target.value)}
                              className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:border-[#44B9CD] text-slate-800"
                            />
                          </div>

                          <div className="flex items-center gap-2">
                            <label className="text-xs font-semibold text-slate-600 shrink-0 w-24">
                              Zaman Dilimi:
                            </label>
                            <select
                              value={preferredTime}
                              onChange={(e) => setPreferredTime(e.target.value)}
                              className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:border-[#44B9CD] text-slate-800 font-medium"
                            >
                              <option value="morning">Sabah (09:00 - 12:00)</option>
                              <option value="afternoon">Öğleden Sonra (13:30 - 17:30)</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* Fiyat Teklifi Modu Alanları */
                      <div className="flex flex-col justify-between h-full">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-bold text-slate-800">
                            {t.contactForm.quoteTitle}:
                          </span>
                          <span className="text-[11px] text-[#44B9CD] font-medium bg-[#44B9CD]/10 px-2.5 py-1 rounded-md">
                            {t.contactForm.desc}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                          <div className="flex items-center gap-2">
                            <label className="text-xs font-semibold text-slate-600 shrink-0 w-24">
                              Hacim:
                            </label>
                            <select
                              value={volumeEstimate}
                              onChange={(e) => setVolumeEstimate(e.target.value)}
                              className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:border-[#44B9CD] text-slate-800 font-medium"
                            >
                              <option value="Tek Seferlik Dosya">Tek Seferlik Dosya</option>
                              <option value="1-5 Dosya / Ay">1 - 5 Dosya / Ay (Düzenli)</option>
                              <option value="5-20 Dosya / Ay">5 - 20 Dosya / Ay (Yüksek)</option>
                              <option value="20+ Dosya / Ay">20+ Dosya / Ay (Kurumsal)</option>
                            </select>
                          </div>

                          <div className="flex items-center gap-2">
                            <label className="text-xs font-semibold text-slate-600 shrink-0 w-24">
                              Gümrük / Liman:
                            </label>
                            <select
                              value={customsPort}
                              onChange={(e) => setCustomsPort(e.target.value)}
                              className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:border-[#44B9CD] text-slate-800 font-medium"
                            >
                              <option value="İstanbul Limanları & Karayolu">İstanbul (Ambarlı / Erenköy / Muratbey)</option>
                              <option value="Havalimanı Kargo (İGA / SAW)">Havalimanı (İGA / SAW)</option>
                              <option value="İzmir / Mersin / Gemlik Limanları">İzmir / Mersin / Gemlik</option>
                              <option value="Diğer Gümrük İdareleri">Diğer Tüm Gümrük İdareleri</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 3. İlgilenilen Hizmet Seçimi */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {t.contactForm.subjectLabel}
                    </label>
                    <select
                      value={selectedServiceForForm}
                      onChange={(e) => setSelectedServiceForForm(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-[#44B9CD] focus:bg-white text-slate-900 font-medium"
                    >
                      {currentServices.map((s) => (
                        <option key={s.slug} value={getServiceTitle(s)}>
                          {getServiceTitle(s)}
                        </option>
                      ))}
                      <option value="Genel Gümrük Danışmanlığı & Diğer">
                        {t.servicesPage.categories.danismanlik}
                      </option>
                    </select>
                  </div>

                  {/* 4. Ad Soyad & Firma */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        {t.contactForm.fullNameLabel} *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder={t.contactForm.fullNamePlaceholder}
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:border-[#44B9CD] text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        {t.contactForm.companyLabel}
                      </label>
                      <input
                        type="text"
                        placeholder={t.contactForm.companyPlaceholder}
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:border-[#44B9CD] text-slate-900"
                      />
                    </div>
                  </div>

                  {/* 5. Telefon & E-Posta */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        {t.contactForm.phoneLabel} *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder={t.contactForm.phonePlaceholder}
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:border-[#44B9CD] text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        {t.contactForm.emailLabel}
                      </label>
                      <input
                        type="email"
                        placeholder={t.contactForm.emailPlaceholder}
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:border-[#44B9CD] text-slate-900"
                      />
                    </div>
                  </div>

                  {/* 6. Mesaj / Detay */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {t.contactForm.messageLabel} *
                    </label>
                    <textarea
                      required
                      rows={3}
                      placeholder={t.contactForm.messagePlaceholder}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:border-[#44B9CD] text-slate-900 resize-none"
                    />
                  </div>

                  {formStatus === "error" && (
                    <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{responseMsg || t.contactForm.errorMsg}</span>
                    </div>
                  )}

                  {/* Gönder Butonu */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={formStatus === "loading"}
                      className="w-full h-12 bg-[#1E2A3A] hover:bg-[#2A3B50] text-[#44B9CD] hover:text-white font-bold px-6 rounded-xl text-xs sm:text-sm transition-all flex items-center justify-center gap-2.5 shadow-md cursor-pointer disabled:opacity-50"
                    >
                      <Send className="w-4 h-4" />
                      <span>
                        {formStatus === "loading"
                          ? t.contactForm.submittingBtn
                          : t.contactForm.submitBtn}
                      </span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 5. Kalem Gümrük Müşavirlik Standartları & Güvenceleri (Footer Öncesi) */}
      <section className="py-12 bg-white border-t border-slate-200/90 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            <div className="p-4.5 rounded-2xl bg-slate-50 border border-slate-200/80 shadow-2xs hover:shadow-md transition-all">
              <div className="w-9 h-9 rounded-xl bg-[#1E2A3A] text-[#44B9CD] flex items-center justify-center mb-3">
                <ShieldCheck className="w-4.5 h-4.5" />
              </div>
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 mb-1">Yetkili Gümrük Müşavirliği</h3>
              <p className="text-[11px] text-slate-500 leading-normal">
                Tüm gümrük idarelerinde resmi imza ve lisanslı temsil gücü.
              </p>
            </div>

            <div className="p-4.5 rounded-2xl bg-slate-50 border border-slate-200/80 shadow-2xs hover:shadow-md transition-all">
              <div className="w-9 h-9 rounded-xl bg-[#1E2A3A] text-[#44B9CD] flex items-center justify-center mb-3">
                <Clock className="w-4.5 h-4.5" />
              </div>
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 mb-1">%99.8 İntaç Başarısı</h3>
              <p className="text-[11px] text-slate-500 leading-normal">
                Ardiye ve demuraj oluşturmayan hızlı operasyon disiplini.
              </p>
            </div>

            <div className="p-4.5 rounded-2xl bg-slate-50 border border-slate-200/80 shadow-2xs hover:shadow-md transition-all">
              <div className="w-9 h-9 rounded-xl bg-[#1E2A3A] text-[#44B9CD] flex items-center justify-center mb-3">
                <Sparkles className="w-4.5 h-4.5" />
              </div>
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 mb-1">Evrim Web Portal</h3>
              <p className="text-[11px] text-slate-500 leading-normal">
                7/24 beyanname, tarife ve gümrük evraklarına dijital erişim.
              </p>
            </div>

            <div className="p-4.5 rounded-2xl bg-slate-50 border border-slate-200/80 shadow-2xs hover:shadow-md transition-all">
              <div className="w-9 h-9 rounded-xl bg-[#1E2A3A] text-[#44B9CD] flex items-center justify-center mb-3">
                <Phone className="w-4.5 h-4.5" />
              </div>
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 mb-1">Birebir Müşavir Desteği</h3>
              <p className="text-[11px] text-slate-500 leading-normal">
                Çağrı merkezi değil; doğrudan dosyanızı yürüten müşavire erişim.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
