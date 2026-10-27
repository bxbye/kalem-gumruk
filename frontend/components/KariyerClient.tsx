"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import HumanVerification from "./HumanVerification";
import { companyInfo } from "@/data/company";
import { useLanguage } from "@/context/LanguageContext";
import {
  getTranslatedFieldLabel,
  getTranslatedFieldPlaceholder,
  getTranslatedOption,
  getFormUIStrings,
} from "@/lib/formTranslations";
import {
  Users,
  GraduationCap,
  Mail,
  Upload,
  CheckCircle2,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Loader2,
  X,
  Send,
  HelpCircle,
  FileCheck2,
  TrendingUp,
  Scale,
  Phone,
  FileText,
  Copy,
  Check,
} from "lucide-react";

interface FormField {
  name: string;
  label: string;
  type: "text" | "email" | "tel" | "number" | "textarea" | "select" | "file";
  required?: boolean;
  placeholder?: string;
  options?: string[] | string;
  helpText?: string;
}

interface FormDefinition {
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

const defaultKariyerForm: FormDefinition = {
  id: "form_kariyer_staj",
  slug: "kariyer-staj",
  title: "İş & Staj Başvuru Formu",
  description: "Kalem Gümrük Müşavirliği bünyesinde kariyer fırsatları.",
  category: "career",
  fields: [
    {
      name: "fullName",
      label: "Adınız Soyadınız",
      type: "text",
      required: true,
      placeholder: "Ad Soyad",
    },
    {
      name: "email",
      label: "E-Posta Adresi",
      type: "email",
      required: true,
      placeholder: "ad.soyad@email.com",
    },
    {
      name: "phone",
      label: "Telefon Numarası",
      type: "tel",
      required: true,
      placeholder: "05XX XXX XX XX",
    },
    {
      name: "applicationType",
      label: "Başvuru Türü",
      type: "select",
      required: true,
      options: [
        "Gümrük Müşavir Yardımcısı (B Karne)",
        "Müşteri Temsilcisi & Operasyon",
        "Dış Ticaret / Gümrük Stajyeri",
        "Saha & Kurye Personeli",
        "Genel Başvuru",
      ],
    },
    {
      name: "experience",
      label: "Gümrük / Dış Ticaret Deneyiminiz",
      type: "text",
      required: false,
      placeholder: "Örn: 2 yıl ithalat operasyon deneyimi",
    },
    {
      name: "coverLetter",
      label: "Ön Yazı / Kendinizi Tanıtın",
      type: "textarea",
      required: false,
      placeholder: "Kariyer hedefleriniz, bildiğiniz programlar (Evrim vb.)...",
    },
    {
      name: "cvFile",
      label: "Özgeçmiş / CV Dosyası (PDF veya Word)",
      type: "file",
      required: true,
      helpText: "Maksimum 10MB boyutunda PDF veya Word dosyası yükleyiniz.",
    },
  ],
  settings: {
    successMessage:
      "Başvurunuz ve özgeçmişiniz İnsan Kaynakları havuzumuza başarıyla kaydedilmiştir. Teşekkür ederiz.",
  },
};

export default function KariyerClient({
  initialForm,
}: {
  initialForm?: FormDefinition | null;
}) {
  const { t, language, localePath, isRTL } = useLanguage();
  const c = t.careerPage;
  const ui = getFormUIStrings(language);

  const [form, setForm] = useState<FormDefinition>(initialForm || defaultKariyerForm);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Form State
  const [formData, setFormData] = useState<Record<string, any>>({
    applicationType: "Genel Başvuru",
    kvkkConsent: false,
    honeypot: "",
  });

  const [uploadedFiles, setUploadedFiles] = useState<
    Array<{ name: string; url: string; size: string; type?: string }>
  >([]);
  const [fileUploading, setFileUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [challengeToken, setChallengeToken] = useState("");
  const [challengeAnswer, setChallengeAnswer] = useState("");
  const [successInfo, setSuccessInfo] = useState<{
    refCode: string;
    message: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // İstemci tarafında veritabanından dinamik formu çekme / tazeleme
  useEffect(() => {
    if (!initialForm) {
      fetch("/api/forms/kariyer-staj")
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data?.success && data?.form) {
            setForm(data.form);
          }
        })
        .catch((err) => {
          console.warn("[Career Form Client Fetch]:", err);
        });
    }
  }, [initialForm]);

  const handleInputChange = (fieldName: string, value: any) => {
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
  };

  // Dosya Yükleme (CV)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 15 * 1024 * 1024) {
      setErrorMsg(c.form.errors.fileSizeExceeded);
      return;
    }

    try {
      setFileUploading(true);
      setErrorMsg("");

      const uploadData = new FormData();
      uploadData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: uploadData,
      });

      const result = await res.json();
      if (result.success) {
        const fileObj = result.file || {
          name: file.name,
          url: result.fileUrl,
          size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        };
        setUploadedFiles([fileObj]);
        setFormData((prev) => ({ ...prev, cvFile: fileObj.name }));
      } else {
        setErrorMsg(result.error || c.form.errors.genericError);
      }
    } catch {
      setErrorMsg(c.form.errors.connectionError);
    } finally {
      setFileUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removeFile = () => {
    setUploadedFiles([]);
    setFormData((prev) => ({ ...prev, cvFile: "" }));
  };

  const handleCopyRef = () => {
    if (successInfo?.refCode) {
      navigator.clipboard.writeText(successInfo.refCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Form Gönderimi (Veritabanı /api/forms/kariyer-staj)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    const hasCvField = form.fields.some((f) => f.name === "cvFile" && f.required);
    if (hasCvField && uploadedFiles.length === 0) {
      setErrorMsg(c.form.errors.cvRequired);
      return;
    }
    if (!formData.kvkkConsent) {
      setErrorMsg(c.form.errors.kvkkRequired);
      return;
    }
    if (!challengeAnswer.trim()) {
      setErrorMsg("Lütfen güvenlik doğrulamasını (insan doğrulaması) yanıtlayınız.");
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        formData: {
          ...formData,
          challengeToken,
          challengeAnswer,
          cvFile: uploadedFiles[0]?.name || formData.cvFile || "",
        },
        files: uploadedFiles,
        honeypot: formData.honeypot,
        challengeToken,
        challengeAnswer,
        kvkkConsent: formData.kvkkConsent,
      };

      const res = await fetch(`/api/forms/${form.slug || "kariyer-staj"}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (result.success) {
        setSuccessInfo({
          refCode: result.refCode,
          message: result.message || form.settings?.successMessage || c.form.successDefaultMsg,
        });
      } else {
        setErrorMsg(result.error || c.form.errors.genericError);
      }
    } catch {
      setErrorMsg(c.form.errors.connectionError);
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setSuccessInfo(null);
    setFormData({
      applicationType: "Genel Başvuru",
      kvkkConsent: false,
      honeypot: "",
    });
    setUploadedFiles([]);
  };

  const waCareerMessage =
    language === "en"
      ? "Hello, I would like to get information regarding Kalem Customs careers and job opportunities."
      : language === "ar"
      ? "مرحباً، أود الاستفسار حول فرص العمل والتدريب لدى شركة قلم للتخليص الجمركي."
      : language === "es"
      ? "Hola, desearía consultar información sobre oportunidades de carrera y empleo en Kalem Aduanas."
      : "Merhaba, Kalem Gümrük kariyer ve iş başvuruları hakkında bilgi almak istiyorum.";

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* 1. ÜST KOMPAKT KARŞILAMA ALANI */}
      <section className="bg-gradient-to-b from-[#1E2A3A] via-[#172230] to-[#121B27] text-white py-8 sm:py-10 relative overflow-hidden border-b border-slate-800">
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-[#44B9CD]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-[11px] text-slate-400 mb-3">
            <Link href={localePath("/")} className="hover:text-[#44B9CD] transition-colors">
              {c.breadcrumbHome}
            </Link>
            <span>/</span>
            <span className="text-[#44B9CD] font-medium">{c.breadcrumbCurrent}</span>
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="max-w-2xl space-y-2.5">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#44B9CD]/15 border border-[#44B9CD]/30 text-[#44B9CD] text-[11px] font-bold uppercase tracking-wider">
                <Users className="w-3.5 h-3.5" />
                <span>{c.badge}</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {c.title}
              </h1>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {c.subtitle}
              </p>
            </div>

            {/* Hızlı Aksiyon Butonları */}
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 shrink-0">
              <a
                href="#basvuru-formu"
                className="px-4 py-2.5 rounded-xl bg-[#44B9CD] hover:bg-[#3597a8] text-white text-xs font-bold transition-all shadow-md hover:scale-[1.02] flex items-center gap-1.5 cursor-pointer"
              >
                <FileText className="w-4 h-4" />
                <span>{c.goToFormBtn}</span>
              </a>

              <a
                href={`mailto:${companyInfo.email}?subject=${encodeURIComponent(
                  `${companyInfo.name} - ${c.title}`
                )}`}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold transition-all border border-white/20 flex items-center gap-1.5"
              >
                <Mail className="w-4 h-4 text-slate-300" />
                <span dir="ltr">{companyInfo.email}</span>
              </a>

              <a
                href={`https://wa.me/${companyInfo.whatsapp}?text=${encodeURIComponent(waCareerMessage)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md hover:scale-[1.02] flex items-center gap-1.5"
              >
                <Phone className="w-4 h-4" />
                <span>{c.contactWaBtn}</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 2. İK POLİTİKAMIZ BÖLÜMÜ */}
      <section className="py-12 bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <span className="text-xs font-bold text-[#44B9CD] uppercase tracking-wider">
              {c.policyBadge}
            </span>
            <h2 className="text-2xl font-bold text-[#1E2A3A]">
              {c.policyTitle}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/80 space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#1E2A3A] text-[#44B9CD] flex items-center justify-center">
                <Scale className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">{c.policyItems.meritTitle}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {c.policyItems.meritDesc}
              </p>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/80 space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#1E2A3A] text-[#44B9CD] flex items-center justify-center">
                <GraduationCap className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">{c.policyItems.growthTitle}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {c.policyItems.growthDesc}
              </p>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/80 space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#1E2A3A] text-[#44B9CD] flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">{c.policyItems.stepsTitle}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {c.policyItems.stepsDesc}
              </p>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/80 space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#1E2A3A] text-[#44B9CD] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">{c.policyItems.safetyTitle}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {c.policyItems.safetyDesc}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. İŞE ALIM SÜRECİ */}
      <section className="py-12 bg-slate-50 border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <span className="text-xs font-bold text-[#44B9CD] uppercase tracking-wider">
              {c.hiringProcessBadge}
            </span>
            <h2 className="text-2xl font-bold text-[#1E2A3A]">
              {c.hiringProcessTitle}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {c.processSteps.map((st, idx) => (
              <div
                key={idx}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2"
              >
                <div className="text-2xl font-black text-[#44B9CD] font-mono">
                  {st.step}
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-slate-900">{st.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{st.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. VERİTABANI DESTEKLİ BAŞVURU FORMU */}
      <section id="basvuru-formu" className="py-14 sm:py-16 bg-white border-b border-slate-200 scroll-mt-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold text-[#44B9CD] uppercase tracking-wider">
              {c.form.badge}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1E2A3A]">
              {form.title || c.form.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
              {form.description || c.form.subtitle}
            </p>
          </div>

          {successInfo ? (
            <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-8 text-center space-y-5 animate-in fade-in duration-200">
              <div className="w-14 h-14 bg-emerald-600 text-white rounded-xl flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-xl font-bold text-slate-900">{c.form.successTitle}</h3>
                <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
                  {successInfo.message}
                </p>
              </div>

              <div className="inline-block bg-white border border-emerald-200 rounded-xl p-3.5 text-center">
                <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                  {c.form.refCodeLabel}
                </div>
                <div className="flex items-center justify-center gap-2 mt-1">
                  <span className="text-xl font-mono font-bold text-[#1E2A3A] tracking-wider" dir="ltr">
                    {successInfo.refCode}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyRef}
                    className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
                    title={ui.copyRef}
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-5 py-2.5 bg-[#1E2A3A] hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition cursor-pointer shadow-md"
                >
                  {c.form.newApplicationBtn}
                </button>
              </div>
            </div>
          ) : (
            <div
              className="bg-slate-50 rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-2xs space-y-5"
              dir={isRTL ? "rtl" : "ltr"}
            >
              {errorMsg && (
                <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4.5">
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

                {/* Dinamik Form Alanları */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {form.fields.map((field, idx) => {
                    const isFullWidth =
                      field.type === "textarea" ||
                      field.type === "file" ||
                      field.name === "coverLetter" ||
                      field.name === "cvFile" ||
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

                      return (
                        <div
                          key={idx}
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
                            className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:border-[#44B9CD] transition font-medium"
                          >
                            <option value="">{ui.selectPlaceholder}</option>
                            {rawOptions.map((pos, pIdx) => (
                              <option key={pIdx} value={pos}>
                                {getTranslatedOption(pos, language)}
                              </option>
                            ))}
                          </select>
                        </div>
                      );
                    }

                    // Uzun Metin (Textarea)
                    if (field.type === "textarea") {
                      return (
                        <div key={idx} className="sm:col-span-2 space-y-1">
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            {translatedLabel}{" "}
                            {field.required && <span className="text-red-500">*</span>}
                          </label>
                          <textarea
                            rows={3}
                            required={field.required}
                            value={formData[field.name] || ""}
                            onChange={(e) =>
                              handleInputChange(field.name, e.target.value)
                            }
                            placeholder={translatedPlaceholder}
                            className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:border-[#44B9CD] transition resize-none"
                          />
                        </div>
                      );
                    }

                    // Dosya Yükleme (CV)
                    if (field.type === "file") {
                      return (
                        <div key={idx} className="sm:col-span-2 space-y-1.5">
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            {translatedLabel}{" "}
                            {field.required && <span className="text-red-500">*</span>}
                          </label>

                          {uploadedFiles.length > 0 ? (
                            <div className="p-3.5 bg-white border border-emerald-200 rounded-xl flex items-center justify-between">
                              <div className="flex items-center gap-2.5">
                                <FileCheck2 className="w-5 h-5 text-emerald-600 shrink-0" />
                                <div>
                                  <div className="text-xs font-bold text-slate-900 truncate max-w-xs">
                                    {uploadedFiles[0].name}
                                  </div>
                                  <div className="text-[10px] text-slate-400">
                                    {uploadedFiles[0].size || "OK"}
                                  </div>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={removeFile}
                                className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-red-600 transition cursor-pointer"
                                title={ui.removeFile}
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <label className="flex flex-col items-center justify-center p-5 border-2 border-dashed border-slate-200 hover:border-[#44B9CD] rounded-xl cursor-pointer bg-white hover:bg-slate-50 transition group">
                              <input
                                ref={fileInputRef}
                                type="file"
                                className="hidden"
                                onChange={handleFileUpload}
                                disabled={fileUploading}
                                accept=".pdf,.doc,.docx"
                              />
                              {fileUploading ? (
                                <div className="flex items-center gap-2 text-xs text-slate-500 py-1">
                                  <Loader2 className="w-4 h-4 animate-spin text-[#44B9CD]" />
                                  <span>{c.form.cvUploading}</span>
                                </div>
                              ) : (
                                <div className="flex flex-col items-center gap-1.5 text-center">
                                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 group-hover:text-[#44B9CD] transition">
                                    <Upload className="w-4 h-4" />
                                  </div>
                                  <span className="text-xs font-semibold text-slate-800">
                                    {c.form.cvHint}
                                  </span>
                                  <span className="text-[10px] text-slate-400">
                                    {c.form.cvSubHint}
                                  </span>
                                </div>
                              )}
                            </label>
                          )}
                        </div>
                      );
                    }

                    // Standart Metin Girişleri (Text, Tel, Email)
                    return (
                      <div
                        key={idx}
                        className={isFullWidth ? "sm:col-span-2 space-y-1" : "space-y-1"}
                      >
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {translatedLabel}{" "}
                          {field.required && <span className="text-red-500">*</span>}
                        </label>
                        <input
                          type={field.type || "text"}
                          required={field.required}
                          value={formData[field.name] || ""}
                          onChange={(e) =>
                            handleInputChange(field.name, e.target.value)
                          }
                          placeholder={translatedPlaceholder}
                          className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:border-[#44B9CD] transition font-medium"
                        />
                      </div>
                    );
                  })}
                </div>

                {/* İnsan Doğrulaması (Anti-Bot Challenge - Dev ve Prod Tam Uyumlu) */}
                <div className="pt-2">
                  <HumanVerification
                    label="Güvenlik Doğrulaması (İnsan Doğrulaması)"
                    placeholder="Sonuç"
                    refreshText="Yenile"
                    value={challengeAnswer}
                    onChange={(tok, ans) => {
                      setChallengeToken(tok);
                      setChallengeAnswer(ans);
                    }}
                    isRTL={isRTL}
                  />
                </div>

                {/* KVKK Onay Kutusu */}
                <div className="pt-1">
                  <label className="flex items-start gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={formData.kvkkConsent || false}
                      onChange={(e) =>
                        handleInputChange("kvkkConsent", e.target.checked)
                      }
                      className="mt-0.5 h-4 w-4 rounded border-slate-300 text-[#44B9CD] focus:ring-[#44B9CD]"
                    />
                    <span className="text-xs text-slate-600 leading-relaxed">
                      {c.form.kvkkConsent}
                    </span>
                  </label>
                </div>

                {/* Gönder Butonu */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={submitting || fileUploading}
                    className="w-full py-3.5 px-6 bg-[#1E2A3A] hover:bg-slate-800 text-white font-bold rounded-xl text-xs sm:text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 cursor-pointer"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>{c.form.submittingBtn}</span>
                      </>
                    ) : (
                      <>
                        <span>{c.form.submitBtn}</span>
                        <Send className={`w-4 h-4 ${isRTL ? "rotate-180" : ""}`} />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </section>

      {/* 5. SIKÇA SORULAN SORULAR */}
      <section className="py-12 bg-slate-50 border-b border-slate-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="text-center space-y-1">
            <h2 className="text-xl font-bold text-[#1E2A3A]">
              {c.faqsTitle}
            </h2>
            <p className="text-xs text-slate-600">
              {c.faqsSubtitle}
            </p>
          </div>

          <div className="space-y-2.5">
            {c.faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-xl border border-slate-200/80 overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full p-4 text-left flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-slate-800 hover:text-[#44B9CD] transition cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <HelpCircle className="w-4 h-4 text-[#44B9CD] shrink-0" />
                      <span>{faq.q}</span>
                    </span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-4 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. İLETİŞİM ALANI */}
      <section className="py-10 bg-[#121B27] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white">{c.contactTitle}</h3>
              <p className="text-xs text-slate-300">
                {c.contactSubtitle}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <a
                href={`mailto:${companyInfo.email}`}
                className="px-4 py-2.5 bg-[#44B9CD] hover:bg-[#3597a8] text-white font-bold rounded-xl text-xs transition flex items-center gap-1.5"
              >
                <Mail className="w-3.5 h-3.5" />
                <span dir="ltr">{companyInfo.email}</span>
              </a>

              <a
                href={`https://wa.me/${companyInfo.whatsapp}?text=${encodeURIComponent(waCareerMessage)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition flex items-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>{c.contactWaBtn}</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
