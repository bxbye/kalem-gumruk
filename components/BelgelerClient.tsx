"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  FileText,
  Download,
  ShieldCheck,
  Loader2,
  Calendar,
  ArrowDown,
  ArrowUp,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface DocumentItem {
  id: string;
  title: string;
  description?: string | null;
  category: string;
  fileUrl: string;
  fileSize: string;
  fileType: string;
  downloadCount: number;
  createdAt?: string | null;
}

export default function BelgelerPage() {
  const { t, language, localePath } = useLanguage();
  const d = t.documentsPage;

  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"desc" | "asc">("desc");

  useEffect(() => {
    async function fetchDocs() {
      try {
        setLoading(true);
        const res = await fetch("/api/documents");
        const data = await res.json();
        if (data.success && Array.isArray(data.documents)) {
          setDocuments(data.documents);
        }
      } catch (err) {
        console.error("Belgeler yüklenemedi:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchDocs();
  }, []);

  const handleDownload = async (doc: DocumentItem) => {
    try {
      setDownloadingId(doc.id);
      fetch("/api/documents", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: doc.id }),
      }).catch((err) => console.warn(err));

      const link = document.createElement("a");
      link.href = doc.fileUrl;
      link.download = doc.title;
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setDocuments((prev) =>
        prev.map((item) =>
          item.id === doc.id ? { ...item, downloadCount: (item.downloadCount || 0) + 1 } : item
        )
      );
    } catch (err) {
      console.error(err);
    } finally {
      setTimeout(() => setDownloadingId(null), 800);
    }
  };

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return null;
    try {
      const dateObj = new Date(dateStr);
      if (isNaN(dateObj.getTime())) return null;
      const localeMap = {
        tr: "tr-TR",
        en: "en-US",
        ar: "ar-EG",
        es: "es-ES",
      };
      return new Intl.DateTimeFormat(localeMap[language] || "tr-TR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(dateObj);
    } catch {
      return null;
    }
  };

  // Belge türü ve format tespiti (Dinamik çok dilli)
  const getDocumentInfo = (doc: DocumentItem) => {
    const titleLower = (doc.title || "").toLowerCase();
    const fileUrlLower = (doc.fileUrl || "").toLowerCase();
    const cat = doc.category?.toUpperCase() || "";

    // Format
    const isWord =
      doc.fileType?.includes("word") ||
      doc.fileType?.includes("doc") ||
      fileUrlLower.endsWith(".doc") ||
      fileUrlLower.endsWith(".docx");

    const format = isWord ? "WORD" : "PDF";

    if (cat === "VEKALETNAME" || titleLower.includes("vekalet") || titleLower.includes("power of attorney") || titleLower.includes("poder")) {
      return {
        label: d.categories.notary,
        color: "bg-purple-50 text-purple-700 border-purple-200",
        format,
      };
    }
    if (
      cat === "SOZLESME" ||
      titleLower.includes("sözleşme") ||
      titleLower.includes("sozlesme") ||
      titleLower.includes("contract") ||
      titleLower.includes("contrato") ||
      titleLower.includes("kvkk")
    ) {
      return {
        label: d.categories.contract,
        color: "bg-blue-50 text-blue-700 border-blue-200",
        format,
      };
    }
    if (
      cat === "GUMRUK_FORMU" ||
      titleLower.includes("talimat") ||
      titleLower.includes("form") ||
      titleLower.includes("instruction")
    ) {
      return {
        label: d.categories.customsForm,
        color: "bg-amber-50 text-amber-700 border-amber-200",
        format,
      };
    }
    if (
      titleLower.includes("izin") ||
      titleLower.includes("yetki") ||
      titleLower.includes("bakanlık") ||
      titleLower.includes("permit") ||
      titleLower.includes("autoriz")
    ) {
      return {
        label: d.categories.ministryPermit,
        color: "bg-emerald-50 text-emerald-700 border-emerald-200",
        format,
      };
    }
    if (titleLower.includes("iso") || titleLower.includes("kalite") || titleLower.includes("quality") || titleLower.includes("calidad")) {
      return {
        label: d.categories.iso,
        color: "bg-cyan-50 text-cyan-700 border-cyan-200",
        format,
      };
    }
    if (cat === "KILAVUZ" || titleLower.includes("kılavuz") || titleLower.includes("rehber") || titleLower.includes("guide") || titleLower.includes("guía")) {
      return {
        label: d.categories.guide,
        color: "bg-teal-50 text-teal-700 border-teal-200",
        format,
      };
    }

    return {
      label: d.categories.corporate,
      color: "bg-slate-50 text-slate-700 border-slate-200",
      format,
    };
  };

  // Yüklenme tarihine göre sıralama
  const sortedDocuments = [...documents].sort((a, b) => {
    const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return sortDirection === "desc" ? timeB - timeA : timeA - timeB;
  });

  return (
    <div className="py-12 sm:py-16 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
        
        {/* Başlık Alanı */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#44B9CD]/10 text-[#44B9CD] text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>{d.badge}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1E2A3A]">
            {d.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
            {d.subtitle}
          </p>
        </div>

        {/* Belge Listeleme Kontrolleri (Sıralama ve Sayaç) */}
        {!loading && documents.length > 0 && (
          <div className="flex items-center justify-between gap-4 px-1 text-xs text-slate-500">
            <span className="font-medium">
              {d.totalDocsText.replace("{count}", String(sortedDocuments.length))}
            </span>

            <div className="flex items-center gap-2">
              <span className="hidden sm:inline text-slate-400">{d.uploadDateLabel}</span>
              <button
                type="button"
                onClick={() => setSortDirection((prev) => (prev === "desc" ? "asc" : "desc"))}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-[#1E2A3A] font-semibold rounded-lg shadow-2xs transition cursor-pointer"
                title={d.sortNewest}
              >
                {sortDirection === "desc" ? (
                  <>
                    <ArrowDown className="w-3.5 h-3.5 text-[#44B9CD]" />
                    <span>{d.sortNewest}</span>
                  </>
                ) : (
                  <>
                    <ArrowUp className="w-3.5 h-3.5 text-[#44B9CD]" />
                    <span>{d.sortOldest}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Belge Listesi */}
        {loading ? (
          <div className="py-16 flex flex-col items-center justify-center gap-3 text-slate-400 bg-white rounded-2xl border border-slate-200/80">
            <Loader2 className="w-6 h-6 animate-spin text-[#44B9CD]" />
            <span className="text-xs font-medium">{d.loadingText}</span>
          </div>
        ) : sortedDocuments.length === 0 ? (
          <div className="bg-white p-10 text-center rounded-2xl border border-slate-200 text-slate-500 text-xs">
            {d.emptyText}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs divide-y divide-slate-100 overflow-hidden">
            {sortedDocuments.map((doc) => {
              const info = getDocumentInfo(doc);
              const isDownloading = downloadingId === doc.id;
              const isWord = info.format === "WORD";
              const formattedDate = formatDate(doc.createdAt);

              return (
                <div
                  key={doc.id}
                  className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-slate-50/80 transition group"
                >
                  {/* Sol Kısım: İkon ve Belge Bilgileri */}
                  <div className="flex items-start sm:items-center gap-3.5 min-w-0 flex-1">
                    {/* Format İkonu */}
                    <div
                      className={`w-10 h-10 rounded-xl shrink-0 flex flex-col items-center justify-center border font-bold text-[10px] mt-0.5 sm:mt-0 ${
                        isWord
                          ? "bg-blue-50 text-blue-600 border-blue-200"
                          : "bg-rose-50 text-rose-600 border-rose-200"
                      }`}
                    >
                      <FileText className="w-4 h-4" />
                      <span className="text-[8px] font-mono leading-none mt-0.5">{info.format}</span>
                    </div>

                    {/* Belge Başlığı & Türü & Tarih */}
                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${info.color}`}
                        >
                          {info.label}
                        </span>
                        <span className="text-[11px] font-mono text-slate-400" dir="ltr">
                          {doc.fileSize}
                        </span>
                        {formattedDate && (
                          <span className="inline-flex items-center gap-1 text-[11px] text-slate-500 bg-slate-100/80 px-2 py-0.5 rounded-md font-medium">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            {formattedDate}
                          </span>
                        )}
                      </div>

                      <h2 className="text-sm sm:text-base font-bold text-[#1E2A3A] group-hover:text-[#44B9CD] transition truncate">
                        {doc.title}
                      </h2>

                      {doc.description && (
                        <p className="text-xs text-slate-500 line-clamp-1">
                          {doc.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Sağ Kısım: İndir Butonu */}
                  <div className="shrink-0 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleDownload(doc)}
                      disabled={isDownloading}
                      className="inline-flex items-center gap-2 px-3.5 py-2 bg-[#1E2A3A] hover:bg-[#2A3B50] text-[#44B9CD] hover:text-white rounded-xl text-xs font-bold transition shadow-xs disabled:opacity-50 cursor-pointer"
                    >
                      {isDownloading ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span className="hidden sm:inline">{d.downloadingBtn}</span>
                        </>
                      ) : (
                        <>
                          <Download className="w-3.5 h-3.5" />
                          <span>{d.downloadBtn}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* İletişim Notu */}
        <div className="text-center pt-2">
          <p className="text-xs text-slate-500">
            {d.contactNote}{" "}
            <Link href={localePath("/iletisim")} className="text-[#44B9CD] font-bold hover:underline">
              {d.contactLinkText}
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}
