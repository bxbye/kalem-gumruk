"use client";

import { useState, useEffect } from "react";
import {
  FileText,
  Download,
  ShieldCheck,
  Search,
  Filter,
  FileSpreadsheet,
  FileCheck,
  Building,
  CheckCircle2,
  Loader2,
} from "lucide-react";

interface DocumentItem {
  id: string;
  title: string;
  description?: string;
  category: string;
  fileUrl: string;
  fileSize: string;
  fileType: string;
  downloadCount: number;
}

export default function BelgelerPage() {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDocs() {
      try {
        setLoading(true);
        const res = await fetch("/api/documents");
        const data = await res.json();
        if (data.success) {
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
      // İndirme sayacını artır
      await fetch("/api/documents", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: doc.id }),
      });

      // İndirmeyi başlat
      const link = document.createElement("a");
      link.href = doc.fileUrl;
      link.download = doc.title;
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // UI sayacını güncelle
      setDocuments((prev) =>
        prev.map((d) =>
          d.id === doc.id ? { ...d, downloadCount: d.downloadCount + 1 } : d
        )
      );
    } catch (err) {
      console.error(err);
    } finally {
      setTimeout(() => setDownloadingId(null), 1000);
    }
  };

  const categories = [
    { key: "ALL", label: "Tüm Belgeler" },
    { key: "SERTIFIKA", label: "Yetki & Kalite Belgeleri" },
    { key: "VEKALETNAME", label: "Vekaletname Şablonları" },
    { key: "GUMRUK_FORMU", label: "Gümrük Talimat Formları" },
    { key: "KILAVUZ", label: "Mevzuat Rehberleri" },
  ];

  const filteredDocs = documents.filter((doc) => {
    const matchesCategory =
      activeCategory === "ALL" || doc.category === activeCategory;
    const matchesSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doc.description &&
        doc.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const getCategoryBadge = (cat: string) => {
    switch (cat) {
      case "SERTIFIKA":
        return { label: "Resmi Belge / Sertifika", color: "bg-blue-50 text-blue-700 border-blue-200" };
      case "VEKALETNAME":
        return { label: "Noter Vekaletnamesi", color: "bg-purple-50 text-purple-700 border-purple-200" };
      case "GUMRUK_FORMU":
        return { label: "Operasyon Formu", color: "bg-amber-50 text-amber-700 border-amber-200" };
      case "KILAVUZ":
        return { label: "Bilgi Kılavuzu", color: "bg-emerald-50 text-emerald-700 border-emerald-200" };
      default:
        return { label: "Doküman", color: "bg-slate-50 text-slate-700 border-slate-200" };
    }
  };

  return (
    <div className="py-16 bg-slate-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Üst Başlık */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#44B9CD]/10 text-[#44B9CD] text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>Doküman & Sertifika Merkezi</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1E2A3A]">
            Belgelerimiz & Müşteri Evrakları
          </h1>
          <p className="text-sm text-slate-600 max-w-2xl mx-auto">
            Kalem Gümrük Müşavirliği yetki belgeleri, ISO sertifikaları, güncel noter vekaletname
            örnekleri ve operasyon formlarını güvenle görüntüleyip indirebilirsiniz.
          </p>
        </div>

        {/* Arama ve Filtreleme */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          {/* Kategori Butonları */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  activeCategory === cat.key
                    ? "bg-[#1E2A3A] text-[#44B9CD] shadow-xs"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Arama Kutusu */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Belge adı veya konu ara..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#44B9CD]/20 focus:border-[#44B9CD] transition"
            />
          </div>
        </div>

        {/* Belge Listesi */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3 text-slate-500">
            <Loader2 className="w-7 h-7 animate-spin text-[#44B9CD]" />
            <span className="text-xs font-medium">Belgeler yükleniyor...</span>
          </div>
        ) : filteredDocs.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-3xl border border-slate-200 shadow-xs space-y-3">
            <FileText className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-700">Aramanıza Uygun Belge Bulunamadı</h3>
            <p className="text-xs text-slate-500">Lütfen farklı bir arama terimi veya kategori seçiniz.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {filteredDocs.map((doc) => {
              const badge = getCategoryBadge(doc.category);
              const isDownloading = downloadingId === doc.id;

              return (
                <div
                  key={doc.id}
                  className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:border-[#44B9CD]/50 hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${badge.color}`}
                      >
                        {badge.label}
                      </span>
                      <span className="text-[11px] font-mono text-slate-400 font-medium">
                        {doc.fileSize}
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <h3 className="text-base font-bold text-[#1E2A3A] group-hover:text-[#44B9CD] transition line-clamp-2">
                        {doc.title}
                      </h3>
                      {doc.description && (
                        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                          {doc.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="pt-6 mt-4 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                      <FileCheck className="w-3.5 h-3.5 text-slate-400" />
                      <span>{doc.downloadCount} kez indirildi</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDownload(doc)}
                      disabled={isDownloading}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-[#1E2A3A] hover:bg-[#2A3B50] text-[#44B9CD] hover:text-white rounded-xl text-xs font-bold transition-all shadow-xs disabled:opacity-50"
                    >
                      {isDownloading ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>İndiriliyor...</span>
                        </>
                      ) : (
                        <>
                          <Download className="w-3.5 h-3.5" />
                          <span>Dosyayı İndir</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Özel Belge İstek Kutusu */}
        <div className="bg-[#1E2A3A] text-white rounded-3xl p-8 sm:p-10 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <h3 className="text-lg font-bold">Farklı Bir Belgeye veya Şablona mı İhtiyacınız Var?</h3>
            <p className="text-xs text-slate-300 max-w-xl">
              Özel gümrük talimatları, antrepo sözleşmeleri veya tarife sınıflandırma evrakları için
              müşavir ekibimizle anında iletişime geçebilirsiniz.
            </p>
          </div>

          <a
            href="/iletisim"
            className="shrink-0 flex items-center gap-2 bg-[#44B9CD] hover:bg-[#2f9fb3] text-white font-bold px-6 py-3 rounded-xl text-xs transition-all shadow"
          >
            <span>Talep Oluştur</span>
          </a>
        </div>
      </div>
    </div>
  );
}
