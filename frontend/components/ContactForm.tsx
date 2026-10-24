"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Send,
  CheckCircle2,
  AlertCircle,
  Phone,
  Mail,
  MessageCircle,
  Clock,
  ArrowRight,
  HelpCircle,
  ShieldCheck,
  FileText,
  Loader2,
  Upload,
  X,
  Copy,
  Check,
} from "lucide-react";
import { companyInfo } from "@/data/company";
import { useLanguage } from "@/context/LanguageContext";
import {
  getTranslatedFieldLabel,
  getTranslatedFieldPlaceholder,
  getTranslatedOption,
  getFormUIStrings,
} from "@/lib/formTranslations";
import { getWhatsAppUrl } from "@/lib/whatsappMessages";

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

const defaultContactForm: FormDefinition = {
  id: "form_iletisim",
  slug: "iletisim",
  title: "Genel İletişim & Danışma Formu",
  description:
    "Gümrük süreçleri, dış ticaret mevzuatı veya hizmetlerimiz hakkında doğrudan bize mesaj iletebilirsiniz.",
  category: "general",
  fields: [
    {
      name: "fullName",
      label: "Adınız Soyadınız",
      type: "text",
      required: true,
      placeholder: "Adınız Soyadınız",
    },
    {
      name: "company",
      label: "Firma / Kurum",
      type: "text",
      required: false,
      placeholder: "Firma Adı (varsa)",
    },
    {
      name: "phone",
      label: "Telefon Numarası",
      type: "tel",
      required: true,
      placeholder: "05XX XXX XX XX",
    },
    {
      name: "email",
      label: "E-Posta Adresi",
      type: "email",
      required: false,
      placeholder: "ornek@domain.com",
    },
    {
      name: "subject",
      label: "Konu / Hizmet Alanı",
      type: "select",
      required: true,
      options: [
        "Genel Bilgi & İletişim",
        "Mevzuat Danışmanlığı",
        "İthalat / İhracat Operasyonu",
        "Yetkilendirilmiş Yükümlü (YYS)",
        "Diğer",
      ],
    },
    {
      name: "message",
      label: "Mesajınız",
      type: "textarea",
      required: true,
      placeholder: "Lütfen mesajınızı detaylıca belirtiniz...",
    },
  ],
  settings: {
    successMessage:
      "Mesajınız başarıyla iletildi. Müşteri temsilcimiz en kısa sürede sizinle iletişime geçecektir.",
  },
};

export default function ContactForm({
  initialForm,
}: {
  initialForm?: FormDefinition | null;
}) {
  const { t, localePath, language, isRTL } = useLanguage();
  const cf = t.contactForm;
  const ui = getFormUIStrings(language);

  const [form, setForm] = useState<FormDefinition>(initialForm || defaultContactForm);
  const [formData, setFormData] = useState<Record<string, any>>({
    subject: "Genel Bilgi & İletişim",
    honeypot: "",
  });

  const [uploadedFiles, setUploadedFiles] = useState<
    Array<{ name: string; url: string; size: string }>
  >([]);
  const [fileUploading, setFileUploading] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [responseMsg, setResponseMsg] = useState("");
  const [refCode, setRefCode] = useState("");
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const formLoadedAtRef = useRef<number>(Date.now());

  // İstemci tarafında veritabanından dinamik formu çekme / tazeleme
  useEffect(() => {
    if (!initialForm) {
      fetch("/api/forms/iletisim")
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data?.success && data?.form) {
            setForm(data.form);
          }
        })
        .catch((err) => {
          console.warn("[Contact Form Client Fetch]:", err);
        });
    }
  }, [initialForm]);

  const handleInputChange = (fieldName: string, value: any) => {
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (uploadedFiles.length >= 2) {
      setStatus("error");
      setResponseMsg("En fazla 2 adet dosya yükleyebilirsiniz.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setStatus("error");
      setResponseMsg("Dosya boyutu en fazla 5 MB olabilir.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    try {
      setFileUploading(true);
      setStatus("idle");
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
      setStatus("error");
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

  // Dinamik Form Gönderimi (Veritabanı /api/forms/iletisim)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setResponseMsg("");

    try {
      const res = await fetch(`/api/forms/${form.slug || "iletisim"}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formData,
          files: uploadedFiles,
          honeypot: formData.honeypot,
          formLoadedAt: formLoadedAtRef.current,
          lang: language,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setStatus("success");
        setRefCode(data.refCode || "");
        setResponseMsg(
          data.message ||
            form.settings?.successMessage ||
            cf.defaultSuccessMsg
        );
      } else {
        setStatus("error");
        setResponseMsg(data.error || cf.errorMsg);
      }
    } catch (err) {
      console.error("[Contact Form Submit Error]:", err);
      setStatus("error");
      setResponseMsg(cf.connectionError);
    }
  };

  const resetForm = () => {
    setStatus("idle");
    setResponseMsg("");
    setRefCode("");
    setFormData({
      subject: "Genel Bilgi & İletişim",
      honeypot: "",
    });
    setUploadedFiles([]);
  };

  return (
    <div id="iletisim-formu" className="scroll-mt-20">
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* Sol Kolon: Bilgilendirme ve Hızlı İletişim */}
          <div className="lg:col-span-5 bg-[#1E2A3A] text-white p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#44B9CD]/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-6">
              <div className="space-y-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#44B9CD]/15 border border-[#44B9CD]/30 text-[#44B9CD] text-xs font-bold uppercase tracking-wider">
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>{cf.badge}</span>
                </span>
                <h3 className="text-2xl font-extrabold text-white tracking-tight">
                  {cf.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {form.description || cf.desc}
                </p>
              </div>

              {/* Hızlı İletişim Kanalları */}
              <div className="space-y-4 pt-4 border-t border-slate-700/60">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-[#44B9CD] shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-400">{cf.phoneTitle}</div>
                    <a
                      href={`tel:${companyInfo.phoneRaw}`}
                      className="text-xs sm:text-sm font-bold text-white hover:text-[#44B9CD] transition-colors"
                      dir="ltr"
                    >
                      {companyInfo.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                    <MessageCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-400">{cf.waTitle}</div>
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

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-[#44B9CD] shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-400">{cf.emailTitle}</div>
                    <a
                      href={`mailto:${companyInfo.email}`}
                      className="text-xs sm:text-sm font-bold text-white hover:text-[#44B9CD] transition-colors"
                      dir="ltr"
                    >
                      {companyInfo.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-[#44B9CD] shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-400">{cf.hoursTitle}</div>
                    <span className="text-xs text-slate-200">
                      {companyInfo.workingHours}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Teklif Almak İsteyenler İçin Yönlendirme Kartı */}
            <div className="relative z-10 mt-8 pt-5 border-t border-slate-700/60 bg-white/5 rounded-2xl p-4 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#44B9CD]">
                <FileText className="w-4 h-4" />
                <span>{cf.quoteTitle}</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-normal">
                {cf.quoteDesc}
              </p>
              <Link
                href={localePath("/hizmetlerimiz#randevu-teklif")}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-white hover:text-[#44B9CD] transition-colors pt-1"
              >
                <span>{cf.quoteBtn}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Sağ Kolon: Veritabanı Destekli Dinamik İletişim Formu */}
          <div
            className="lg:col-span-7 p-8 sm:p-10 flex flex-col justify-center"
            dir={isRTL ? "rtl" : "ltr"}
          >
            {status === "success" ? (
              <div className="text-center py-12 space-y-4 animate-in fade-in duration-200">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-2xl font-bold text-slate-900">{cf.successTitle}</h4>
                {refCode && (
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold" dir="ltr">
                    <span>{cf.refNoPrefix} #{refCode}</span>
                    <button
                      type="button"
                      onClick={handleCopyRef}
                      className="text-slate-400 hover:text-slate-700 p-0.5 cursor-pointer"
                      title={ui.copyRef}
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                )}
                <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                  {responseMsg || form.settings?.successMessage || cf.defaultSuccessMsg}
                </p>
                <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
                  <a
                    href={getWhatsAppUrl({
                      type: "quote_followup",
                      lang: language,
                      refCode,
                      serviceTitle: formData.subject,
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
                    className="px-6 py-2.5 bg-[#1E2A3A] hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-xs"
                  >
                    {cf.newMsgBtn}
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="mb-6 space-y-1">
                  <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                    {cf.formTitle}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500">
                    {form.description || cf.formDesc}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
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

                  {/* Veritabanı Alanları Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {form.fields.map((field, idx) => {
                      const isFullWidth =
                        field.type === "textarea" ||
                        field.type === "file" ||
                        field.name === "message" ||
                        field.name === "subject" ||
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

                      // Açılır Menü (Select)
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
                              className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:border-[#44B9CD] focus:ring-2 focus:ring-[#44B9CD]/20 text-slate-900 bg-white transition-all font-medium"
                            >
                              <option value="">{ui.selectPlaceholder}</option>
                              {rawOptions.map((opt, oIdx) => (
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
                          <div key={idx} className="sm:col-span-2 space-y-1">
                            <label className="block text-xs font-bold text-slate-700 mb-1">
                              {translatedLabel}{" "}
                              {field.required && <span className="text-red-500">*</span>}
                            </label>
                            <textarea
                              required={field.required}
                              rows={4}
                              placeholder={translatedPlaceholder}
                              value={formData[field.name] || ""}
                              onChange={(e) =>
                                handleInputChange(field.name, e.target.value)
                              }
                              className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:border-[#44B9CD] focus:ring-2 focus:ring-[#44B9CD]/20 text-slate-900 bg-white transition-all resize-none"
                            />
                          </div>
                        );
                      }

                      // Dosya Yükleme (Opsiyonel)
                      if (field.type === "file") {
                        return (
                          <div key={idx} className="sm:col-span-2 space-y-2">
                            <label className="block text-xs font-bold text-slate-700 mb-1">
                              {translatedLabel}{" "}
                              {field.required && <span className="text-red-500">*</span>}
                            </label>

                            <div
                              onClick={() => fileInputRef.current?.click()}
                              className="border-2 border-dashed border-slate-300 hover:border-[#44B9CD] bg-slate-50 hover:bg-slate-100/70 rounded-2xl p-4 text-center cursor-pointer transition-colors"
                            >
                              <input
                                ref={fileInputRef}
                                type="file"
                                className="hidden"
                                onChange={handleFileUpload}
                                accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                              />
                              <div className="flex flex-col items-center gap-1.5">
                                <div className="w-8 h-8 rounded-full bg-[#44B9CD]/15 text-[#1b7a8a] flex items-center justify-center">
                                  {fileUploading ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                  ) : (
                                    <Upload className="w-4 h-4" />
                                  )}
                                </div>
                                <span className="text-xs font-bold text-slate-800">
                                  {fileUploading ? ui.uploading : ui.uploadDrop}
                                </span>
                                <p className="text-[10px] text-slate-400">{ui.uploadHint}</p>
                              </div>
                            </div>

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
                                      title={ui.removeFile}
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
                            placeholder={translatedPlaceholder}
                            value={formData[field.name] || ""}
                            onChange={(e) =>
                              handleInputChange(field.name, e.target.value)
                            }
                            className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:border-[#44B9CD] focus:ring-2 focus:ring-[#44B9CD]/20 text-slate-900 bg-white transition-all font-medium"
                          />
                        </div>
                      );
                    })}
                  </div>

                  {/* Hata Mesajı */}
                  {status === "error" && (
                    <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{responseMsg || cf.errorMsg}</span>
                    </div>
                  )}

                  {/* Gönder Butonu */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={status === "loading" || fileUploading}
                      className="w-full bg-[#1E2A3A] hover:bg-[#2A3B50] text-[#44B9CD] hover:text-white font-bold py-3.5 px-6 rounded-xl text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-xs disabled:opacity-50 cursor-pointer border border-[#44B9CD]/30"
                    >
                      {status === "loading" ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>{cf.submittingBtn}</span>
                        </>
                      ) : (
                        <>
                          <Send className={`w-4 h-4 ${isRTL ? "rotate-180" : ""}`} />
                          <span>{cf.submitBtn}</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="flex items-center justify-center gap-2 pt-1 text-[11px] text-slate-400">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    <span>{cf.kvkkNotice}</span>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
