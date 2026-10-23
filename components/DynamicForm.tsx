"use client";

import { useState, useEffect } from "react";
import {
  Send,
  CheckCircle2,
  AlertCircle,
  Upload,
  FileText,
  X,
  Loader2,
  Sparkles,
} from "lucide-react";

interface FormField {
  name: string;
  label: string;
  type: string;
  required?: boolean;
  placeholder?: string;
  options?: string[];
  helpText?: string;
}

interface FormDefinition {
  id: string;
  slug: string;
  title: string;
  description?: string;
  fields: FormField[];
  settings: {
    successMessage?: string;
    autoEmailSubject?: string;
  };
}

interface DynamicFormProps {
  slug: string;
  titleOverride?: string;
  descOverride?: string;
  initialValues?: Record<string, any>;
  onSuccess?: (refCode: string) => void;
  className?: string;
}

export default function DynamicForm({
  slug,
  titleOverride,
  descOverride,
  initialValues = {},
  onSuccess,
  className = "",
}: DynamicFormProps) {
  const [formDef, setFormDef] = useState<FormDefinition | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>(initialValues);
  const [uploadedFiles, setUploadedFiles] = useState<
    Array<{ name: string; url: string; size: string; type: string }>
  >([]);
  const [fileUploading, setFileUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successInfo, setSuccessInfo] = useState<{
    refCode: string;
    message: string;
  } | null>(null);

  // Form tanımını API'den çek
  useEffect(() => {
    let isMounted = true;
    async function loadForm() {
      try {
        setLoading(true);
        const res = await fetch(`/api/forms/${slug}`);
        const data = await res.json();
        if (data.success && isMounted) {
          setFormDef(data.form);
          // initialValues ile state'i doldur
          if (initialValues) {
            setFormData((prev) => ({ ...prev, ...initialValues }));
          }
        } else if (isMounted) {
          setErrorMsg(data.error || "Form yüklenemedi.");
        }
      } catch (err) {
        if (isMounted) setErrorMsg("Sunucuyla bağlantı kurulamadı.");
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadForm();
    return () => {
      isMounted = false;
    };
  }, [slug]);

  const handleInputChange = (name: string, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Dosya Yükleme (CV, PDF vb.)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

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
      if (result.success && result.file) {
        setUploadedFiles((prev) => [...prev, result.file]);
        // İlgili dosya alanının değerine dosya adını kaydet
        setFormData((prev) => ({
          ...prev,
          uploadedFilesSummary: (prev.uploadedFilesSummary || "") + " " + result.file.name,
        }));
      } else {
        setErrorMsg(result.error || "Dosya yüklenemedi.");
      }
    } catch (err) {
      setErrorMsg("Dosya yüklenirken bağlantı hatası oluştu.");
    } finally {
      setFileUploading(false);
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Form Gönderme
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formDef) return;

    setErrorMsg("");
    setSubmitting(true);

    try {
      const res = await fetch(`/api/forms/${slug}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formData,
          files: uploadedFiles,
        }),
      });

      const result = await res.json();
      if (result.success) {
        setSuccessInfo({
          refCode: result.refCode,
          message: result.message,
        });
        if (onSuccess) onSuccess(result.refCode);
      } else {
        setErrorMsg(result.error || "Form gönderilirken bir hata oluştu.");
      }
    } catch (err) {
      setErrorMsg("Bağlantı hatası. Lütfen daha sonra tekrar deneyiniz.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center justify-center space-x-3 text-slate-500">
        <Loader2 className="w-5 h-5 animate-spin text-[#44B9CD]" />
        <span className="text-sm">Form yükleniyor...</span>
      </div>
    );
  }

  if (errorMsg && !formDef) {
    return (
      <div className="p-6 bg-red-50 text-red-700 border border-red-200 rounded-2xl text-sm flex items-center gap-3">
        <AlertCircle className="w-5 h-5 shrink-0" />
        <span>{errorMsg}</span>
      </div>
    );
  }

  if (!formDef) return null;

  // Başarılı Gönderim Ekranı
  if (successInfo) {
    return (
      <div className="p-8 sm:p-10 bg-white rounded-3xl border border-emerald-100 shadow-md text-center space-y-5 animate-in fade-in duration-300">
        <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto ring-8 ring-emerald-50/50">
          <CheckCircle2 className="w-9 h-9" />
        </div>
        <div className="space-y-2">
          <span className="text-[11px] font-bold tracking-wider text-emerald-700 uppercase bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Kayıt Alındı
          </span>
          <h3 className="text-2xl font-extrabold text-[#1E2A3A]">Teşekkür Ederiz</h3>
          <p className="text-sm text-slate-600 max-w-md mx-auto">{successInfo.message}</p>
        </div>

        <div className="inline-block bg-slate-50 border border-slate-200 rounded-xl p-4 max-w-sm mx-auto">
          <div className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">
            Takip Referans Numaranız
          </div>
          <div className="text-xl font-mono font-extrabold text-[#1E2A3A] tracking-wider mt-1">
            {successInfo.refCode}
          </div>
        </div>

        <div>
          <button
            type="button"
            onClick={() => {
              setSuccessInfo(null);
              setFormData({});
              setUploadedFiles([]);
            }}
            className="text-xs font-semibold text-[#44B9CD] hover:underline"
          >
            ← Yeni Bir Form Doldur
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs ${className}`}>
      {/* Form Başlık & Açıklama */}
      <div className="mb-6 space-y-1">
        <h3 className="text-xl sm:text-2xl font-bold text-[#1E2A3A]">
          {titleOverride || formDef.title}
        </h3>
        {(descOverride || formDef.description) && (
          <p className="text-xs sm:text-sm text-slate-500">
            {descOverride || formDef.description}
          </p>
        )}
      </div>

      {errorMsg && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {formDef.fields.map((field) => {
          if (field.type === "file") {
            return (
              <div key={field.name} className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  {field.label} {field.required && <span className="text-red-500">*</span>}
                </label>

                {/* Yüklenmiş Dosyalar */}
                {uploadedFiles.length > 0 && (
                  <div className="space-y-2 mb-2">
                    {uploadedFiles.map((f, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <FileText className="w-4 h-4 text-[#44B9CD] shrink-0" />
                          <span className="font-medium text-slate-800 truncate">{f.name}</span>
                          <span className="text-[10px] text-slate-400 shrink-0">({f.size})</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(idx)}
                          className="p-1 hover:bg-slate-200 rounded text-slate-400 hover:text-red-600 transition"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Dosya Yükleme Butonu */}
                <label className="flex flex-col items-center justify-center p-5 border-2 border-dashed border-slate-200 hover:border-[#44B9CD] rounded-2xl cursor-pointer bg-slate-50/50 hover:bg-slate-50 transition group">
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleFileUpload}
                    disabled={fileUploading}
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.webp,.xlsx"
                  />
                  {fileUploading ? (
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Loader2 className="w-4 h-4 animate-spin text-[#44B9CD]" />
                      <span>Dosya yükleniyor...</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-1.5 text-center">
                      <div className="w-9 h-9 rounded-xl bg-white shadow-xs border border-slate-200 flex items-center justify-center text-slate-600 group-hover:text-[#44B9CD] transition">
                        <Upload className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-semibold text-slate-700">
                        Dosya seçmek için tıklayın
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {field.helpText || "PDF, Word veya Resim (Maks. 15MB)"}
                      </span>
                    </div>
                  )}
                </label>
              </div>
            );
          }

          if (field.type === "select") {
            return (
              <div key={field.name} className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  {field.label} {field.required && <span className="text-red-500">*</span>}
                </label>
                <select
                  value={formData[field.name] || ""}
                  onChange={(e) => handleInputChange(field.name, e.target.value)}
                  required={field.required}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#44B9CD]/20 focus:border-[#44B9CD] transition"
                >
                  <option value="">Seçiniz...</option>
                  {field.options?.map((opt, i) => (
                    <option key={i} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            );
          }

          if (field.type === "textarea") {
            return (
              <div key={field.name} className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  {field.label} {field.required && <span className="text-red-500">*</span>}
                </label>
                <textarea
                  rows={3}
                  value={formData[field.name] || ""}
                  onChange={(e) => handleInputChange(field.name, e.target.value)}
                  required={field.required}
                  placeholder={field.placeholder}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#44B9CD]/20 focus:border-[#44B9CD] transition resize-none"
                />
              </div>
            );
          }

          return (
            <div key={field.name} className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                {field.label} {field.required && <span className="text-red-500">*</span>}
              </label>
              <input
                type={field.type || "text"}
                value={formData[field.name] || ""}
                onChange={(e) => handleInputChange(field.name, e.target.value)}
                required={field.required}
                placeholder={field.placeholder}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#44B9CD]/20 focus:border-[#44B9CD] transition"
              />
            </div>
          );
        })}

        {/* Gönder Butonu */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={submitting || fileUploading}
            className="w-full py-3.5 px-6 bg-[#1E2A3A] hover:bg-[#2A3B50] text-[#44B9CD] hover:text-white font-bold rounded-xl text-xs sm:text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Gönderiliyor...</span>
              </>
            ) : (
              <>
                <span>Gönder & Talebi İlet</span>
                <Send className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
