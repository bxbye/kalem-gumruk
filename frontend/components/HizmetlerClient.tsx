"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { servicesData, ServiceItem } from "@/data/services";
import { companyInfo } from "@/data/company";
import { useLanguage } from "@/context/LanguageContext";
import {
  getTranslatedFieldLabel,
  getTranslatedFieldPlaceholder,
  getTranslatedOption,
  getFormUIStrings,
} from "@/lib/formTranslations";
import { getWhatsAppUrl } from "@/lib/whatsappMessages";
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
  Send,
  AlertCircle,
  FileText,
  MapPin,
  ChevronRight,
  Database,
  Upload,
  Loader2,
  X,
  Copy,
  Check,
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

interface FormField {
  name: string;
  label: string;
  type: "text" | "email" | "tel" | "number" | "textarea" | "select" | "file";
  required?: boolean;
  placeholder?: string;
  options?: string[] | string;
  helpText?: string;
}

interface QuoteFormDefinition {
  id: string;
  slug: string;
  title: string;
  description?: string;
  category?: string;
  fields: FormField[];
  settings?: {
    successMessage?: string;
    autoEmailSubject?: string;
    autoEmailBody?: string;
  };
}

const defaultFallbackForm: QuoteFormDefinition = {
  id: "form_fiyat_teklifi",
  slug: "fiyat-teklifi",
  title: "Hızlı Gümrükleme Fiyat Teklifi",
  description:
    "İthalat, ihracat ve antrepo operasyonlarınız için gümrük müşavirimizden en kısa sürede özel teklif alın.",
  category: "quote",
  fields: [
    {
      name: "fullName",
      label: "Adınız Soyadınız",
      type: "text",
      required: true,
      placeholder: "Örn: Ahmet Yılmaz",
    },
    {
      name: "company",
      label: "Firma / Kurum Adı",
      type: "text",
      required: false,
      placeholder: "Örn: ABC Dış Ticaret Ltd.",
    },
    {
      name: "phone",
      label: "Telefon Numaranız",
      type: "tel",
      required: true,
      placeholder: "05XX XXX XX XX",
    },
    {
      name: "email",
      label: "E-Posta Adresiniz",
      type: "email",
      required: false,
      placeholder: "adiniz@sirketiniz.com",
    },
    {
      name: "operationType",
      label: "İşlem Türü / Gümrük Rejimi",
      type: "select",
      required: true,
      options: [
        "İthalat Gümrükleme",
        "İhracat Gümrükleme",
        "Antrepo & Depolama",
        "Transit Ticaret",
        "Dahilde İşleme (DİİB)",
        "Gümrük Danışmanlığı & Mevzuat",
      ],
    },
    {
      name: "volume",
      label: "Aylık Dosya Hacmi",
      type: "select",
      required: false,
      options: [
        "Tek Seferlik Dosya",
        "1 - 5 Dosya / Ay (Düzenli)",
        "5 - 20 Dosya / Ay (Yüksek)",
        "20+ Dosya / Ay (Kurumsal)",
      ],
    },
    {
      name: "customsOffice",
      label: "Hedef Gümrük / Liman",
      type: "select",
      required: false,
      options: [
        "İstanbul Limanları (Ambarlı / Kumport / Marport)",
        "İstanbul Karayolu (Erenköy / Muratbey)",
        "Havalimanı Kargo (İGA / SAW)",
        "Kocaeli / Dilovası / Evyapport / DP World",
        "İzmir / Mersin / Gemlik Limanları",
        "Diğer Tüm Gümrük İdareleri",
      ],
    },
    {
      name: "gtipOrProduct",
      label: "GTİP No veya Eşya Tanımı",
      type: "text",
      required: false,
      placeholder: "Örn: 8471.30 veya Endüstriyel Elektronik Kart",
    },
    {
      name: "message",
      label: "Sevkiyat ve Teklif Detayları",
      type: "textarea",
      required: true,
      placeholder:
        "Konteyner/koli adedi, çıkış ülkesi veya sormak istedikleriniz...",
    },
    {
      name: "files",
      label: "Fatura / Konşimento / Çeki Listesi (Opsiyonel)",
      type: "file",
      required: false,
      helpText: "PDF, JPG veya PNG formatında yükleyebilirsiniz.",
    },
  ],
  settings: {
    successMessage:
      "Fiyat teklif talebiniz başarıyla alındı! Gümrük müşavirimiz en kısa sürede analiz ederek tarafınıza dönecektir.",
  },
};

export default function ServicesPage({
  initialServices,
  initialQuoteForm,
}: {
  initialServices?: ServiceItem[];
  initialQuoteForm?: QuoteFormDefinition | null;
} = {}) {
  const { t, localePath, language, isRTL } = useLanguage();
  const uiStrings = getFormUIStrings(language);
  const currentServices =
    initialServices && initialServices.length > 0 ? initialServices : servicesData;
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
    "serbest-bolge": "serbestBolge",
    danismanlik: "danismanlik",
    hukuk: "hukuk",
    sigorta: "sigorta",
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

  // Dinamik Form Tanımı (Veritabanından 'fiyat-teklifi')
  const [quoteForm, setQuoteForm] = useState<QuoteFormDefinition>(
    initialQuoteForm || defaultFallbackForm
  );

  // Form Verileri ve Dosya Yükleme
  const [formData, setFormData] = useState<Record<string, any>>({
    operationType: "İthalat Gümrükleme",
    volume: "1 - 5 Dosya / Ay (Düzenli)",
    customsOffice: "İstanbul Limanları (Ambarlı / Kumport / Marport)",
    honeypot: "",
  });
  const [uploadedFiles, setUploadedFiles] = useState<
    Array<{ name: string; url: string; size: string }>
  >([]);
  const [fileUploading, setFileUploading] = useState(false);
  const [formStatus, setFormStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );
  const [responseMsg, setResponseMsg] = useState("");
  const [refCode, setRefCode] = useState("");
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // İstemci tarafında veritabanından form tanımını tazeleme
  useEffect(() => {
    if (!initialQuoteForm) {
      fetch("/api/forms/fiyat-teklifi")
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data?.success && data?.form) {
            setQuoteForm(data.form);
          }
        })
        .catch((err) => {
          console.warn("[Quote Form Client Fetch]:", err);
        });
    }
  }, [initialQuoteForm]);

  // URL hash (#teklif, #randevu, #randevu-teklif) ve ?service= parametresi
  useEffect(() => {
    const handleHash = () => {
      if (typeof window === "undefined") return;
      const hash = window.location.hash;
      if (
        hash === "#teklif" ||
        hash === "#randevu-teklif" ||
        hash === "#randevu"
      ) {
        const el = document.getElementById("randevu-teklif");
        if (el) {
          setTimeout(() => {
            el.scrollIntoView({ behavior: "smooth" });
          }, 150);
        }
      }
    };

    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const serviceParam = urlParams.get("service");
      if (serviceParam) {
        const matched = currentServices.find(
          (s) => s.slug === serviceParam || s.title.toLowerCase() === serviceParam.toLowerCase()
        );
        if (matched) {
          const matchedTitle = getServiceTitle(matched);
          setFormData((prev) => ({
            ...prev,
            operationType: matchedTitle,
          }));
          setTimeout(() => {
            const el = document.getElementById("randevu-teklif");
            if (el) el.scrollIntoView({ behavior: "smooth" });
          }, 250);
        }
      }
    }

    handleHash();
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, [currentServices]);

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

  // Hizmet kartına tıklandığında formu ilgili hizmete ayarlayıp form alanına odaklanma
  const handleSelectServiceForQuote = (serviceTitle: string) => {
    setFormData((prev) => ({
      ...prev,
      operationType: serviceTitle,
    }));
    const formElement = document.getElementById("randevu-teklif");
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleInputChange = (fieldName: string, value: any) => {
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 20 * 1024 * 1024) {
      setFormStatus("error");
      setResponseMsg("Dosya boyutu 20 MB'dan küçük olmalıdır.");
      return;
    }

    try {
      setFileUploading(true);
      setFormStatus("idle");
      setResponseMsg("");

      const bodyData = new FormData();
      bodyData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: bodyData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Dosya yükleme başarısız.");
      }

      const uploadedItem = data.file || {
        name: file.name,
        url: data.fileUrl,
        size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
      };

      setUploadedFiles((prev) => [
        ...prev,
        {
          name: uploadedItem.name || file.name,
          url: uploadedItem.url || data.fileUrl,
          size: uploadedItem.size || `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        },
      ]);
    } catch (err: any) {
      setFormStatus("error");
      setResponseMsg(err.message || "Dosya yüklenirken bir sorun oluştu.");
    } finally {
      setFileUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCopyRef = () => {
    if (refCode) {
      navigator.clipboard.writeText(refCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Dinamik Form Gönderimi (Veritabanı /api/forms/fiyat-teklifi)
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus("loading");
    setResponseMsg("");

    try {
      const res = await fetch(`/api/forms/${quoteForm.slug || "fiyat-teklifi"}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formData,
          files: uploadedFiles,
          honeypot: formData.honeypot,
          lang: language,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setFormStatus("success");
        setRefCode(data.refCode || "");
        setResponseMsg(
          data.message ||
            quoteForm.settings?.successMessage ||
            uiStrings.quoteDesc
        );
      } else {
        setFormStatus("error");
        setResponseMsg(data.error || uiStrings.requiredWarning);
      }
    } catch (err) {
      console.error("[Quote Form Submit Error]:", err);
      setFormStatus("error");
      setResponseMsg(uiStrings.connectionError);
    }
  };

  const resetForm = () => {
    setFormStatus("idle");
    setResponseMsg("");
    setRefCode("");
    setFormData({
      operationType: "İthalat Gümrükleme",
      volume: "1 - 5 Dosya / Ay (Düzenli)",
      customsOffice: "İstanbul Limanları (Ambarlı / Kumport / Marport)",
      honeypot: "",
    });
    setUploadedFiles([]);
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* 1. Üst Kompakt Karşılama Alanı */}
      <section className="bg-gradient-to-b from-[#1E2A3A] via-[#172230] to-[#121B27] text-white py-8 sm:py-10 relative overflow-hidden border-b border-slate-800">
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-[#44B9CD]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-3xl space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#44B9CD]/15 border border-[#44B9CD]/30 text-[#44B9CD] text-xs font-bold tracking-wide">
                <Sparkles className="w-3.5 h-3.5" />
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
                <FileText className="w-4 h-4" />
                <span>{t.servicesPage.quoteAppointmentBtn}</span>
              </a>

              <a
                href={getWhatsAppUrl({ type: "general", lang: language })}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md hover:scale-[1.02] flex items-center gap-1.5"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{t.servicesPage.whatsappBtn}</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Filtreler & Arama Barı */}
      <section className="bg-white border-b border-slate-200/80 sticky top-16 z-30 shadow-2xs backdrop-blur-md bg-white/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Kategori Butonları */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
              {(["all", "gumruk", "rejim", "danismanlik"] as const).map((catKey) => {
                const isSelected = selectedCategory === catKey;
                return (
                  <button
                    key={catKey}
                    type="button"
                    onClick={() => setSelectedCategory(catKey)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                      isSelected
                        ? "bg-[#1E2A3A] text-[#44B9CD] shadow-xs"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900"
                    }`}
                  >
                    {categoryLabels[catKey]}
                  </button>
                );
              })}
            </div>

            {/* Arama Input */}
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.servicesPage.searchPlaceholder}
                className="w-full pl-8.5 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-[#44B9CD] focus:bg-white transition-all"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 3. Hizmet Kartları Grid */}
      <section className="py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredServices.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-200/80 p-8">
              <Search className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-600">
                {t.servicesPage.noResults}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {filteredServices.map((service) => {
                const icon = iconMap[service.iconName] || (
                  <ArrowDownToLine className="w-5 h-5" />
                );
                const title = getServiceTitle(service);
                const desc = getServiceDesc(service);

                return (
                  <div
                    key={service.slug}
                    id={`service-${service.slug}`}
                    className="bg-white rounded-2xl border border-slate-200/90 hover:border-[#44B9CD]/50 p-5 sm:p-6 shadow-2xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#44B9CD]/10 to-transparent rounded-bl-3xl pointer-events-none group-hover:scale-110 transition-transform" />

                    <div>
                      {/* Üst Alan: İkon ve Kategori */}
                      <div className="flex items-center justify-between mb-3.5">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 text-[#1E2A3A] group-hover:bg-[#1E2A3A] group-hover:text-[#44B9CD] flex items-center justify-center transition-all duration-300">
                          {icon}
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-100/80 px-2.5 py-1 rounded-md">
                          {categoryLabels[service.category]}
                        </span>
                      </div>

                      {/* Başlık ve Açıklama */}
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-[#1E2A3A] transition-colors mb-2">
                        {title}
                      </h3>
                      <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-4">
                        {desc}
                      </p>

                      {/* Özellik Maddeleri */}
                      <ul className="space-y-1.5 mb-5 border-t border-slate-100 pt-3">
                        {service.features.slice(0, 3).map((feat, idx) => (
                          <li
                            key={idx}
                            className="flex items-center gap-2 text-[11px] text-slate-600"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                            <span className="truncate">{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Aksiyon Butonları (Detay, WhatsApp, Doğrudan Teklif Al) */}
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
                        {/* 2. WhatsApp'a Yönlendirme (Seçili Dilde Dinamik Mesaj) */}
                        <a
                          href={getWhatsAppUrl({
                            type: "service",
                            lang: language,
                            serviceTitle: title,
                          })}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white text-[11px] font-bold transition-all"
                          title="WhatsApp"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span className="hidden xs:inline">WhatsApp</span>
                        </a>

                        {/* 3. Teklif Formuna Yönlendirme (Randevu kaldırıldı, sadece Teklif Al) */}
                        <button
                          type="button"
                          onClick={() => handleSelectServiceForQuote(title)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#44B9CD]/15 hover:bg-[#44B9CD] text-[#1b7a8a] hover:text-white text-[11px] font-bold transition-all cursor-pointer"
                          title={t.servicesPage.actionQuote}
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>{t.servicesPage.actionQuote}</span>
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

      {/* 4. SADECE FİYAT TEKLİFİ ALMA FORMU (Veritabanı Dinamik Formu, Randevu Yok Edildi) */}
      <section
        id="randevu-teklif"
        className="py-14 sm:py-20 bg-gradient-to-b from-slate-100 via-white to-slate-50 relative scroll-mt-20"
      >
        <div id="teklif" className="absolute -top-24 left-0 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10 space-y-2.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#44B9CD]/15 border border-[#44B9CD]/30 text-[#44B9CD] text-xs font-bold uppercase tracking-wider">
              <FileText className="w-3.5 h-3.5" />
              <span>{uiStrings.badge}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1E2A3A] tracking-tight">
              {uiStrings.quoteTitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              {uiStrings.quoteDesc}
            </p>
          </div>

          {/* İki Kolonlu Geniş Kurumsal Kart */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch max-w-6xl mx-auto">
            {/* Sol Taraf: Kalem Gümrük Kurumsal Bilgileri */}
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
                      <div className="text-[11px] text-slate-400">
                        {t.contactForm.phoneTitle}
                      </div>
                      <a
                        href={`tel:${companyInfo.phoneRaw}`}
                        className="text-xs sm:text-sm font-bold text-white hover:text-[#44B9CD] transition-colors"
                        dir="ltr"
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
                      <div className="text-[11px] text-slate-400">
                        {t.contactForm.waTitle}
                      </div>
                      <a
                        href={getWhatsAppUrl({ type: "general", lang: language })}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs sm:text-sm font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
                        dir="ltr"
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
                      <div className="text-[11px] text-slate-400">
                        {t.contactForm.emailTitle}
                      </div>
                      <a
                        href={`mailto:${companyInfo.email}`}
                        className="text-xs sm:text-sm font-bold text-white hover:text-[#44B9CD] transition-colors"
                        dir="ltr"
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
                      <div className="text-[11px] text-slate-400">
                        {t.contactPage.addressTitle}
                      </div>
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

            {/* Sağ Taraf: Veritabanı Destekli Dinamik Teklif Formu */}
            <div
              className="lg:col-span-8 bg-white rounded-3xl p-7 sm:p-9 shadow-xl border border-slate-200 flex flex-col justify-between"
              dir={isRTL ? "rtl" : "ltr"}
            >
              {formStatus === "success" ? (
                <div className="text-center py-12 space-y-5 my-auto animate-in fade-in duration-200">
                  <div className="w-16 h-16 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>

                  <div className="space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3.5 py-1 rounded-full border border-emerald-200">
                      {uiStrings.badge}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                      {uiStrings.successTitle}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
                      {responseMsg || quoteForm.settings?.successMessage || uiStrings.quoteDesc}
                    </p>
                  </div>

                  {/* Referans Kodu Kartı */}
                  {refCode && (
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 max-w-md mx-auto space-y-2 text-center">
                      <span className="text-xs text-slate-500 font-medium block">
                        {uiStrings.refNumber}
                      </span>
                      <div className="flex items-center justify-center gap-3">
                        <span
                          className="text-xl sm:text-2xl font-mono font-black text-[#1E2A3A] tracking-wider"
                          dir="ltr"
                        >
                          {refCode}
                        </span>
                        <button
                          type="button"
                          onClick={handleCopyRef}
                          className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                          title={uiStrings.copyRef}
                        >
                          {copied ? (
                            <Check className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        {uiStrings.refNote}
                      </p>
                    </div>
                  )}

                  <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                    <a
                      href={getWhatsAppUrl({
                        type: "quote_followup",
                        lang: language,
                        refCode,
                        serviceTitle: formData.operationType,
                      })}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center gap-1.5"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>
                        {language === "en"
                          ? "Notify Broker on WhatsApp"
                          : language === "ar"
                          ? "إشعار المستشار عبر الواتساب"
                          : language === "es"
                          ? "Notificar por WhatsApp"
                          : "WhatsApp'tan Müşavire Bildir"}
                      </span>
                    </a>
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-6 py-2.5 bg-[#1E2A3A] hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-md"
                    >
                      {uiStrings.newRequestBtn}
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-4.5">
                  {/* Honeypot Spam Koruması */}
                  <input
                    type="text"
                    name="honeypot"
                    value={formData.honeypot || ""}
                    onChange={(e) => handleInputChange("honeypot", e.target.value)}
                    className="hidden"
                    tabIndex={-1}
                    autoComplete="off"
                  />

                  {/* Dinamik Alanlar Grid Yerleşimi */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {quoteForm.fields.map((field, fIdx) => {
                      const isFullWidth =
                        field.type === "textarea" ||
                        field.type === "file" ||
                        field.name === "message" ||
                        field.name === "files";

                      const translatedLabel = getTranslatedFieldLabel(
                        field.name,
                        field.label,
                        language
                      );
                      const translatedPlaceholder = getTranslatedFieldPlaceholder(
                        field.name,
                        field.placeholder,
                        language
                      );

                      // Açılır Menü (Select / Breakdown Menü)
                      if (field.type === "select") {
                        const rawOptions: string[] = Array.isArray(field.options)
                          ? field.options
                          : typeof field.options === "string"
                          ? field.options.split(",").map((s) => s.trim())
                          : [];

                        // operationType ise mevcut servisleri de kapsayabilir
                        let finalOptions = [...rawOptions];
                        if (
                          field.name === "operationType" &&
                          currentServices.length > 0
                        ) {
                          const serviceTitles = currentServices.map((s) =>
                            getServiceTitle(s)
                          );
                          const setOpts = new Set([...finalOptions, ...serviceTitles]);
                          finalOptions = Array.from(setOpts);
                        }

                        return (
                          <div
                            key={fIdx}
                            className={isFullWidth ? "sm:col-span-2 space-y-1" : "space-y-1"}
                          >
                            <label className="block text-xs font-bold text-slate-700 mb-1">
                              {translatedLabel}{" "}
                              {field.required && <span className="text-red-500">*</span>}
                            </label>
                            <select
                              required={field.required}
                              value={formData[field.name] || ""}
                              onChange={(e) =>
                                handleInputChange(field.name, e.target.value)
                              }
                              className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-[#44B9CD] focus:bg-white text-slate-900 font-medium transition-all"
                            >
                              <option value="">{uiStrings.selectPlaceholder}</option>
                              {finalOptions.map((opt, oIdx) => (
                                <option key={oIdx} value={opt}>
                                  {getTranslatedOption(opt, language)}
                                </option>
                              ))}
                            </select>
                          </div>
                        );
                      }

                      // Uzun Metin (Textarea)
                      if (field.type === "textarea") {
                        return (
                          <div key={fIdx} className="sm:col-span-2 space-y-1">
                            <label className="block text-xs font-bold text-slate-700 mb-1">
                              {translatedLabel}{" "}
                              {field.required && <span className="text-red-500">*</span>}
                            </label>
                            <textarea
                              required={field.required}
                              rows={3}
                              placeholder={translatedPlaceholder}
                              value={formData[field.name] || ""}
                              onChange={(e) =>
                                handleInputChange(field.name, e.target.value)
                              }
                              className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:border-[#44B9CD] text-slate-900 resize-none transition-all"
                            />
                          </div>
                        );
                      }

                      // Dosya Yükleme (File Upload)
                      if (field.type === "file") {
                        return (
                          <div key={fIdx} className="sm:col-span-2 space-y-2">
                            <label className="block text-xs font-bold text-slate-700 mb-1">
                              {translatedLabel}{" "}
                              {field.required && <span className="text-red-500">*</span>}
                            </label>

                            <div
                              onClick={() => fileInputRef.current?.click()}
                              className="border-2 border-dashed border-slate-300 hover:border-[#44B9CD] bg-slate-50 hover:bg-slate-100/70 rounded-2xl p-4 sm:p-5 text-center cursor-pointer transition-colors"
                            >
                              <input
                                ref={fileInputRef}
                                type="file"
                                className="hidden"
                                onChange={handleFileUpload}
                                accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg,.zip"
                              />
                              <div className="flex flex-col items-center gap-1.5">
                                <div className="w-9 h-9 rounded-full bg-[#44B9CD]/15 text-[#1b7a8a] flex items-center justify-center">
                                  {fileUploading ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                  ) : (
                                    <Upload className="w-4 h-4" />
                                  )}
                                </div>
                                <span className="text-xs font-bold text-slate-800">
                                  {fileUploading
                                    ? uiStrings.uploading
                                    : uiStrings.uploadDrop}
                                </span>
                                <p className="text-[11px] text-slate-400">
                                  {uiStrings.uploadHint}
                                </p>
                              </div>
                            </div>

                            {/* Ekli Dosyalar Listesi */}
                            {uploadedFiles.length > 0 && (
                              <div className="space-y-1.5 pt-1">
                                {uploadedFiles.map((f, fIndex) => (
                                  <div
                                    key={fIndex}
                                    className="flex items-center justify-between p-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs"
                                  >
                                    <div className="flex items-center gap-2 overflow-hidden">
                                      <FileText className="w-4 h-4 text-[#44B9CD] shrink-0" />
                                      <span className="truncate font-medium text-slate-800">
                                        {f.name}
                                      </span>
                                      <span className="text-[10px] text-slate-500 shrink-0">
                                        ({f.size})
                                      </span>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() => removeFile(fIndex)}
                                      className="p-1 text-slate-400 hover:text-red-600 rounded transition-colors cursor-pointer"
                                      title={uiStrings.removeFile}
                                    >
                                      <X className="w-4 h-4" />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      }

                      // Standart Metin Girişleri (Text, Tel, Email, Number)
                      return (
                        <div
                          key={fIdx}
                          className={isFullWidth ? "sm:col-span-2 space-y-1" : "space-y-1"}
                        >
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            {translatedLabel}{" "}
                            {field.required && <span className="text-red-500">*</span>}
                          </label>
                          <input
                            type={field.type || "text"}
                            required={field.required}
                            placeholder={translatedPlaceholder}
                            value={formData[field.name] || ""}
                            onChange={(e) =>
                              handleInputChange(field.name, e.target.value)
                            }
                            className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:border-[#44B9CD] text-slate-900 transition-all font-medium"
                          />
                        </div>
                      );
                    })}
                  </div>

                  {/* Hata Bildirimi */}
                  {formStatus === "error" && (
                    <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{responseMsg || uiStrings.requiredWarning}</span>
                    </div>
                  )}

                  {/* Gönder Butonu ve Güvenlik Bildirimi */}
                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>{uiStrings.sslSecurity}</span>
                    </div>

                    <button
                      type="submit"
                      disabled={formStatus === "loading" || fileUploading}
                      className="w-full sm:w-auto h-12 bg-[#1E2A3A] hover:bg-[#2A3B50] text-[#44B9CD] hover:text-white font-bold px-7 rounded-xl text-xs sm:text-sm transition-all flex items-center justify-center gap-2.5 shadow-md cursor-pointer disabled:opacity-50"
                    >
                      {formStatus === "loading" ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>{uiStrings.submittingBtn}</span>
                        </>
                      ) : (
                        <>
                          <Send className={`w-4 h-4 ${isRTL ? "rotate-180" : ""}`} />
                          <span>{uiStrings.submitBtn}</span>
                        </>
                      )}
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
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 mb-1">
                Yetkili Gümrük Müşavirliği
              </h3>
              <p className="text-[11px] text-slate-500 leading-normal">
                Tüm gümrük idarelerinde resmi imza ve lisanslı temsil gücü.
              </p>
            </div>

            <div className="p-4.5 rounded-2xl bg-slate-50 border border-slate-200/80 shadow-2xs hover:shadow-md transition-all">
              <div className="w-9 h-9 rounded-xl bg-[#1E2A3A] text-[#44B9CD] flex items-center justify-center mb-3">
                <Clock className="w-4.5 h-4.5" />
              </div>
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 mb-1">
                %99.8 İntaç Başarısı
              </h3>
              <p className="text-[11px] text-slate-500 leading-normal">
                Ardiye ve demuraj oluşturmayan hızlı operasyon disiplini.
              </p>
            </div>

            <div className="p-4.5 rounded-2xl bg-slate-50 border border-slate-200/80 shadow-2xs hover:shadow-md transition-all">
              <div className="w-9 h-9 rounded-xl bg-[#1E2A3A] text-[#44B9CD] flex items-center justify-center mb-3">
                <Sparkles className="w-4.5 h-4.5" />
              </div>
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 mb-1">
                Evrim Web Portal
              </h3>
              <p className="text-[11px] text-slate-500 leading-normal">
                7/24 beyanname, tarife ve gümrük evraklarına dijital erişim.
              </p>
            </div>

            <div className="p-4.5 rounded-2xl bg-slate-50 border border-slate-200/80 shadow-2xs hover:shadow-md transition-all">
              <div className="w-9 h-9 rounded-xl bg-[#1E2A3A] text-[#44B9CD] flex items-center justify-center mb-3">
                <Phone className="w-4.5 h-4.5" />
              </div>
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 mb-1">
                Birebir Müşavir Desteği
              </h3>
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
