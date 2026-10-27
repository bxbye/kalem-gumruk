"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import HumanVerification from "./HumanVerification";
import {
  Send,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Upload,
  FileText,
  X,
  Copy,
  Check,
  ArrowLeft,
  ShieldCheck,
  Building2,
  Clock,
  MessageCircle,
} from "lucide-react";
import { getWhatsAppUrl } from "@/lib/whatsappMessages";
import {
  getTranslatedFieldLabel,
  getTranslatedFieldPlaceholder,
  getTranslatedOption,
  getFormUIStrings,
} from "@/lib/formTranslations";

interface FormField {
  name: string;
  label: string;
  type: "text" | "email" | "tel" | "number" | "textarea" | "select" | "file";
  required?: boolean;
  placeholder?: string;
  options?: string[] | string;
}

interface DynamicFormProps {
  form: {
    id: string;
    slug: string;
    title: string;
    description?: string;
    category?: string;
    fields: FormField[];
    settings?: {
      autoEmailSubject?: string;
      autoEmailBody?: string;
      successMessage?: string;
    };
  };
  lang: string;
}

export default function DynamicFormClient({ form, lang }: DynamicFormProps) {
  const ui = getFormUIStrings(lang as any);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [uploadedFiles, setUploadedFiles] = useState<
    Array<{ name: string; url: string; size: string }>
  >([]);
  const [fileUploading, setFileUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [kvkkConsent, setKvkkConsent] = useState(false);
  const [challengeToken, setChallengeToken] = useState("");
  const [challengeAnswer, setChallengeAnswer] = useState("");
  const [successInfo, setSuccessInfo] = useState<{
    refCode: string;
    message: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const formLoadedAtRef = useRef<number>(Date.now());

  const handleInputChange = (name: string, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (uploadedFiles.length >= 2) {
      setErrorMsg("En fazla 2 adet dosya yükleyebilirsiniz.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg("Dosya boyutu en fazla 5 MB olabilir.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    try {
      setFileUploading(true);
      setErrorMsg("");

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

      setUploadedFiles((prev) => [
        ...prev,
        {
          name: data.originalName || file.name,
          url: data.fileUrl,
          size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        },
      ]);
    } catch (err: any) {
      setErrorMsg(err.message || "Dosya yüklenirken bir sorun oluştu.");
    } finally {
      setFileUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!kvkkConsent) {
      setErrorMsg(ui.kvkkRequired || "Devam edebilmek için lütfen KVKK onay kutusunu işaretleyiniz.");
      return;
    }

    if (!challengeAnswer.trim()) {
      setErrorMsg("Lütfen güvenlik doğrulamasını (insan doğrulaması) yanıtlayınız.");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch(`/api/forms/${form.slug}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formData: {
            ...formData,
            kvkkConsent,
            challengeToken,
            challengeAnswer,
          },
          files: uploadedFiles,
          honeypot: formData.honeypot,
          formLoadedAt: formLoadedAtRef.current,
          challengeToken,
          challengeAnswer,
          kvkkConsent,
          lang,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Form gönderilemedi.");
      }

      setSuccessInfo({
        refCode: data.refCode || "TK-" + Math.floor(1000 + Math.random() * 9000),
        message: data.message || form.settings?.successMessage || "Talebiniz başarıyla alınmıştır.",
      });
    } catch (err: any) {
      setErrorMsg(err.message || "Form iletilirken bir hata oluştu. Lütfen tekrar deneyiniz.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopyRef = () => {
    if (successInfo?.refCode) {
      navigator.clipboard.writeText(successInfo.refCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="py-12 sm:py-16 bg-slate-50 min-h-[80vh]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Üst Geri Dön Butonu */}
        <div className="mb-6">
          <Link
            href={`/${lang}`}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Ana Sayfaya Dön</span>
          </Link>
        </div>

        {/* Başarı Ekranı */}
        {successInfo ? (
          <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-slate-200 text-center space-y-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Talep Başarıyla Alındı
              </span>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                Teşekkür Ederiz!
              </h2>
              <p className="text-sm text-slate-600 max-w-lg mx-auto">
                {successInfo.message}
              </p>
            </div>

            {/* Referans Kodu Kartı */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 max-w-md mx-auto space-y-2">
              <span className="text-xs text-slate-500 font-medium">Başvuru Referans Numaranız:</span>
              <div className="flex items-center justify-center gap-3">
                <span className="text-xl sm:text-2xl font-mono font-black text-[#1E2A3A] tracking-wider">
                  {successInfo.refCode}
                </span>
                <button
                  type="button"
                  onClick={handleCopyRef}
                  className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded-lg transition-colors"
                  title="Kopyala"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[11px] text-slate-400">
                Bu kodu gümrük müşavirlerimiz ile görüşmelerinizde referans olarak kullanabilirsiniz.
              </p>
            </div>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
              {successInfo?.refCode && (
                <a
                  href={getWhatsAppUrl({
                    type: "quote_followup",
                    lang,
                    refCode: successInfo.refCode,
                    serviceTitle: form.title,
                  })}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md transition-colors flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>
                    {lang === "en"
                      ? "Notify Broker on WhatsApp"
                      : lang === "ar"
                      ? "إشعار المستشار عبر الواتساب"
                      : lang === "es"
                      ? "Notificar por WhatsApp"
                      : "WhatsApp'tan Müşavire Bildir"}
                  </span>
                </a>
              )}
              <button
                type="button"
                onClick={() => {
                  setSuccessInfo(null);
                  setFormData({});
                  setUploadedFiles([]);
                }}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
              >
                Yeni Form Gönder
              </button>
              <Link
                href={`/${lang}`}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#1E2A3A] hover:bg-slate-900 text-white text-xs font-bold shadow-md transition-colors"
              >
                Ana Sayfaya Git
              </Link>
            </div>
          </div>
        ) : (
          /* Form Kartı */
          <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-slate-200/80 space-y-8">
            <div className="space-y-3 pb-6 border-b border-slate-100">
              {form.category && (
                <span className="inline-block px-3 py-1 bg-cyan-50 border border-cyan-100 text-[#0e7490] rounded-full text-xs font-bold tracking-wide uppercase">
                  {form.category}
                </span>
              )}
              <h1 className="text-2xl sm:text-3xl font-black text-[#1E2A3A] tracking-tight">
                {form.title}
              </h1>
              {form.description && (
                <p className="text-sm text-slate-600 leading-relaxed">
                  {form.description}
                </p>
              )}
            </div>

            {errorMsg && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-800 flex items-start gap-3">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
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
              {form.fields.map((field, idx) => {
                const ui = getFormUIStrings(lang);
                const translatedLabel = getTranslatedFieldLabel(field.name, field.label, lang);
                const translatedPlaceholder = getTranslatedFieldPlaceholder(field.name, field.placeholder, lang);

                const options = Array.isArray(field.options)
                  ? field.options
                  : typeof field.options === "string"
                  ? field.options.split(",").map((s) => s.trim())
                  : [];

                if (field.type === "textarea") {
                  return (
                    <div key={idx} className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                        <span>
                          {translatedLabel} {field.required && <span className="text-red-500">*</span>}
                        </span>
                      </label>
                      <textarea
                        required={field.required}
                        rows={4}
                        value={formData[field.name] || ""}
                        onChange={(e) => handleInputChange(field.name, e.target.value)}
                        placeholder={translatedPlaceholder || `${translatedLabel} yazınız...`}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#44B9CD]/20 focus:border-[#44B9CD] transition-all"
                      />
                    </div>
                  );
                }

                if (field.type === "select") {
                  return (
                    <div key={idx} className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">
                        {translatedLabel} {field.required && <span className="text-red-500">*</span>}
                      </label>
                      <select
                        required={field.required}
                        value={formData[field.name] || ""}
                        onChange={(e) => handleInputChange(field.name, e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#44B9CD]/20 focus:border-[#44B9CD] transition-all"
                      >
                        <option value="">{ui.selectPlaceholder}</option>
                        {options.map((opt, oIdx) => (
                          <option key={oIdx} value={opt}>
                            {getTranslatedOption(opt, lang)}
                          </option>
                        ))}
                      </select>
                    </div>
                  );
                }

                if (field.type === "file") {
                  return (
                    <div key={idx} className="space-y-2">
                      <label className="text-xs font-bold text-slate-700">
                        {translatedLabel} {field.required && <span className="text-red-500">*</span>}
                      </label>

                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-slate-300 hover:border-[#44B9CD] bg-slate-50 hover:bg-slate-100/50 rounded-2xl p-6 text-center cursor-pointer transition-colors"
                      >
                        <input
                          ref={fileInputRef}
                          type="file"
                          className="hidden"
                          onChange={handleFileUpload}
                          accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                        />
                        <div className="flex flex-col items-center gap-2">
                          <div className="w-10 h-10 rounded-full bg-cyan-50 text-[#0e7490] flex items-center justify-center">
                            {fileUploading ? (
                              <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                              <Upload className="w-5 h-5" />
                            )}
                          </div>
                          <div>
                            <span className="text-xs font-bold text-slate-800">
                              {fileUploading ? ui.uploading : ui.uploadDrop}
                            </span>
                            <p className="text-[11px] text-slate-400">{ui.uploadHint}</p>
                          </div>
                        </div>
                      </div>

                      {uploadedFiles.length > 0 && (
                        <div className="space-y-2 pt-2">
                          {uploadedFiles.map((f, fIdx) => (
                            <div
                              key={fIdx}
                              className="flex items-center justify-between p-3 bg-slate-100 border border-slate-200 rounded-xl text-xs"
                            >
                              <div className="flex items-center gap-2 overflow-hidden">
                                <FileText className="w-4 h-4 text-[#44B9CD] shrink-0" />
                                <span className="truncate font-medium text-slate-800">{f.name}</span>
                                <span className="text-[10px] text-slate-500 shrink-0">({f.size})</span>
                              </div>
                              <button
                                type="button"
                                onClick={() => removeFile(fIdx)}
                                className="p-1 text-slate-400 hover:text-red-600 rounded"
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

                return (
                  <div key={idx} className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">
                      {translatedLabel} {field.required && <span className="text-red-500">*</span>}
                    </label>
                    <input
                      type={field.type || "text"}
                      required={field.required}
                      value={formData[field.name] || ""}
                      onChange={(e) => handleInputChange(field.name, e.target.value)}
                      placeholder={translatedPlaceholder || `${translatedLabel} giriniz`}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#44B9CD]/20 focus:border-[#44B9CD] transition-all"
                    />
                  </div>
                );
              })}

              {/* İnsan Doğrulaması (Anti-Bot Challenge - Dev ve Prod Uyumlu) */}
              <div className="pt-2">
                <HumanVerification
                  label={ui.humanVerification || "Güvenlik Doğrulaması (İnsan Doğrulaması)"}
                  placeholder={ui.humanVerificationPlaceholder || "Sonuç"}
                  refreshText={ui.refreshQuestion || "Yenile"}
                  value={challengeAnswer}
                  onChange={(tok, ans) => {
                    setChallengeToken(tok);
                    setChallengeAnswer(ans);
                  }}
                  isRTL={lang === "ar"}
                />
              </div>

              {/* KVKK Onay Kutusu (Zorunlu) */}
              <div className="pt-1">
                <label className="flex items-start gap-2.5 text-xs text-slate-700 cursor-pointer select-none bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <input
                    type="checkbox"
                    required
                    checked={kvkkConsent}
                    onChange={(e) => setKvkkConsent(e.target.checked)}
                    className="mt-0.5 w-4 h-4 text-[#44B9CD] border-slate-300 rounded focus:ring-[#44B9CD] accent-[#1E2A3A]"
                  />
                  <span className="leading-relaxed">
                    <Link
                      href={`/${lang}/kurumsal#kvkk`}
                      target="_blank"
                      className="text-[#44B9CD] hover:underline font-bold"
                    >
                      6698 sayılı KVKK
                    </Link>{" "}
                    {ui.kvkkConsent || "kapsamında kişisel verilerimin işlenmesine ve tarafımla iletişime geçilmesine açık rıza veriyorum."}{" "}
                    <span className="text-red-500">*</span>
                  </span>
                </label>
              </div>

              {errorMsg && (
                <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="pt-4 flex items-center justify-between border-t border-slate-100">
                <div className="flex items-center gap-2 text-[11px] text-slate-400">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>256-Bit SSL ile güvenli iletim</span>
                </div>

                <button
                  type="submit"
                  disabled={submitting || fileUploading}
                  className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#1E2A3A] hover:bg-slate-900 disabled:bg-slate-400 text-white rounded-xl text-xs font-bold shadow-lg shadow-slate-900/10 transition-all"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Gönderiliyor...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 text-[#44B9CD]" />
                      <span>Talebi Gönder</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
