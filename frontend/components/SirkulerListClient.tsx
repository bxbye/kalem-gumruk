"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Calendar,
  Tag,
  Search,
  X,
  ArrowRight,
  FileDown,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Clock,
  Sparkles,
  SlidersHorizontal,
} from "lucide-react";
import type { SirkulerItem } from "@/lib/sirkuler";

interface Props {
  initialItems: SirkulerItem[];
  lang: string;
}

const ITEMS_PER_PAGE = 10;

export default function SirkulerListClient({ initialItems, lang }: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "title">("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const listContainerRef = useRef<HTMLDivElement>(null);

  const isEn = lang === "en";
  const isAr = lang === "ar";
  const isEs = lang === "es";

  // Mevcut kategorileri ve sayılarını dinamik hesapla
  const categoryStats = useMemo(() => {
    const counts: Record<string, number> = { ALL: initialItems.length };
    initialItems.forEach((item) => {
      const cat = item.category || "Diğer";
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return counts;
  }, [initialItems]);

  const categories = useMemo(() => {
    const defaultOrder = [
      "ALL",
      "İthalat & Vergi",
      "İhracat Rejimi",
      "Tarife & GTİP",
      "Menşe & Dolaşım",
      "Antrepo & Transit",
    ];
    const otherCats = Object.keys(categoryStats).filter(
      (c) => !defaultOrder.includes(c)
    );
    return [...defaultOrder.filter((c) => c in categoryStats), ...otherCats];
  }, [categoryStats]);

  // Arama, filtreleme ve sıralama
  const filteredItems = useMemo(() => {
    let result = [...initialItems];

    // Kategori Filtresi
    if (selectedCategory !== "ALL") {
      result = result.filter((item) => item.category === selectedCategory);
    }

    // Arama Sorgusu
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (item) =>
          item.title?.toLowerCase().includes(q) ||
          item.summary?.toLowerCase().includes(q) ||
          item.relatedGtip?.toLowerCase().includes(q) ||
          item.officialGazetteNumber?.toLowerCase().includes(q) ||
          item.regulationType?.toLowerCase().includes(q) ||
          item.content?.toLowerCase().includes(q)
      );
    }

    // Sıralama
    if (sortBy === "newest") {
      result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } else if (sortBy === "oldest") {
      result.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    } else if (sortBy === "title") {
      result.sort((a, b) => a.title.localeCompare(b.title, "tr"));
    }

    return result;
  }, [initialItems, selectedCategory, searchQuery, sortBy]);

  // Sayfalama (Pagination)
  const totalPages = Math.max(1, Math.ceil(filteredItems.length / ITEMS_PER_PAGE));

  // Arama veya kategori değiştiğinde ilk sayfaya dön
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, sortBy]);

  // Sayfadaki öğeler
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredItems.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredItems, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    if (listContainerRef.current) {
      const topOffset = listContainerRef.current.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: topOffset, behavior: "smooth" });
    }
  };

  // Tahmini okuma süresi hesaplama
  const getReadingTime = (text: string) => {
    const wordCount = (text || "").split(/\s+/).length;
    const mins = Math.max(1, Math.ceil(wordCount / 160));
    return `${mins} ${isEn ? "min read" : "dk okuma"}`;
  };

  return (
    <div ref={listContainerRef} className="space-y-8">
      {/* 1. GELİŞMİŞ ARAMA & KONTROL ÇUBUĞU */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Arama Inputu */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                isEn
                  ? "Search by title, HS code, official gazette no..."
                  : "Mevzuat başlığı, GTİP kodu, Resmi Gazete no ile arayın..."
              }
              className="w-full pl-10 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#44B9CD]/20 focus:border-[#44B9CD] transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-md"
                title={isEn ? "Clear" : "Temizle"}
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sıralama Seçeneği */}
          <div className="flex items-center gap-2 self-end md:self-center shrink-0">
            <SlidersHorizontal className="w-4 h-4 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-medium focus:outline-none focus:border-[#44B9CD]"
            >
              <option value="newest">{isEn ? "Newest First" : "En Yeni İlk"}</option>
              <option value="oldest">{isEn ? "Oldest First" : "En Eski İlk"}</option>
              <option value="title">{isEn ? "Title (A-Z)" : "Başlık (A-Z)"}</option>
            </select>
          </div>
        </div>

        {/* 2. KATEGORİ SEKMELERİ */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 scrollbar-none text-xs font-semibold">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            const count = categoryStats[cat] || 0;
            const label = cat === "ALL" ? (isEn ? "All" : "Tümü") : cat;

            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? "bg-[#1E2A3A] text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                <span>{label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isSelected ? "bg-white/20 text-[#44B9CD]" : "bg-slate-200 text-slate-600"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Sonuç Sayacı */}
        <div className="text-[11px] sm:text-xs text-slate-400 flex items-center justify-between pt-2 border-t border-slate-100">
          <span>
            {isEn
              ? `Showing ${filteredItems.length} publications (Page ${currentPage} of ${totalPages})`
              : `Toplam ${filteredItems.length} mevzuat duyurusu listeleniyor (Sayfa ${currentPage} / ${totalPages})`}
          </span>
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("ALL");
              }}
              className="text-[#0e7490] hover:underline font-medium"
            >
              {isEn ? "Reset filters" : "Filtreleri Sıfırla"}
            </button>
          )}
        </div>
      </div>

      {/* 3. SIRKÜLER POSTLARI LİSTESİ */}
      {paginatedItems.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200/90 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <BookOpen className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-800 text-base">
            {isEn ? "No Legislation Found" : "Eşleşen Mevzuat Bulunamadı"}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
            {isEn
              ? "We couldn't find any circulars matching your search query. Try different keywords or clear the category filter."
              : "Arama kriterlerinize uygun sirküler bulunamadı. Lütfen farklı bir arama terimi deneyin veya filtreleri temizleyin."}
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("ALL");
            }}
            className="mt-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
          >
            {isEn ? "Clear Search" : "Aramayı Temizle"}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {paginatedItems.map((item) => {
            const formattedDate = new Date(item.date).toLocaleDateString(
              isEn ? "en-US" : isAr ? "ar-EG" : isEs ? "es-ES" : "tr-TR",
              {
                day: "numeric",
                month: "long",
                year: "numeric",
              }
            );
            const readingTime = getReadingTime(item.content || item.summary);

            return (
              <article
                key={item.id}
                className="group bg-white rounded-2xl p-5 sm:p-7 border border-slate-200/80 hover:border-[#44B9CD]/60 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-md transition-all flex flex-col justify-between gap-4"
              >
                <div className="space-y-3">
                  {/* Meta Etiketleri */}
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="inline-flex items-center gap-1 text-[#0e7490] font-bold bg-[#44B9CD]/15 px-2.5 py-0.5 rounded-md text-[11px]">
                      <Tag className="w-3 h-3 text-[#44B9CD]" />
                      {item.category}
                    </span>

                    {item.regulationType && (
                      <span className="font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md text-[11px]">
                        {item.regulationType}
                      </span>
                    )}

                    <span className="inline-flex items-center gap-1 text-slate-400 text-[11px]">
                      <Calendar className="w-3 h-3" />
                      {formattedDate}
                    </span>

                    {item.officialGazetteNumber && (
                      <span className="text-slate-400 font-mono text-[11px] bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">
                        RG: {item.officialGazetteNumber}
                      </span>
                    )}

                    {item.pdfUrl && (
                      <span className="inline-flex items-center gap-1 text-rose-700 bg-rose-50 px-2 py-0.5 rounded text-[11px] font-semibold border border-rose-100">
                        <FileDown className="w-3 h-3 text-rose-500" />
                        PDF Eki
                      </span>
                    )}

                    <span className="inline-flex items-center gap-1 text-slate-400 text-[11px] ml-auto">
                      <Clock className="w-3 h-3" />
                      {readingTime}
                    </span>
                  </div>

                  {/* Başlık */}
                  <h2 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-[#0e7490] leading-snug transition-colors">
                    <Link href={`/${lang}/sirkuler/${item.slug}`} className="focus:outline-none">
                      {item.title}
                    </Link>
                  </h2>

                  {/* İlgili GTİP Bilgisi */}
                  {item.relatedGtip && (
                    <div className="text-[11px] text-slate-500 font-mono bg-slate-50 px-2.5 py-1 rounded-md inline-block">
                      GTİP / Fasıl: <strong className="text-slate-700">{item.relatedGtip}</strong>
                    </div>
                  )}

                  {/* Kısa Özet */}
                  <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed font-normal">
                    {item.summary}
                  </p>
                </div>

                {/* Alt Aksiyon Çubuğu */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-400">
                    {item.author || "Kalem Gümrük Mevzuat Kurulu"}
                  </span>

                  <Link
                    href={`/${lang}/sirkuler/${item.slug}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#0e7490] group-hover:text-[#44B9CD] transition-colors"
                  >
                    <span>{isEn ? "Read Article" : "Yazıyı Oku"}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* 4. SAYFALAMA (PAGINATION) BİLEŞENİ */}
      {totalPages > 1 && (
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200">
          <div className="text-xs text-slate-500">
            {isEn
              ? `Page ${currentPage} of ${totalPages} (${filteredItems.length} total circulars)`
              : `Sayfa ${currentPage} / ${totalPages} (Toplam ${filteredItems.length} mevzuat)`}
          </div>

          <div className="flex items-center gap-1.5">
            {/* Önceki Sayfa */}
            <button
              type="button"
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none transition"
              title={isEn ? "Previous Page" : "Önceki Sayfa"}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Sayfa Numaraları */}
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((page) => {
                // İlk, son ve mevcut sayfanın çevresindeki 2 sayfayı göster
                return (
                  page === 1 ||
                  page === totalPages ||
                  Math.abs(page - currentPage) <= 1
                );
              })
              .map((page, idx, arr) => {
                const prevPage = arr[idx - 1];
                const showEllipsis = prevPage && page - prevPage > 1;

                return (
                  <div key={page} className="flex items-center gap-1">
                    {showEllipsis && <span className="text-slate-400 px-1 text-xs">...</span>}
                    <button
                      type="button"
                      onClick={() => handlePageChange(page)}
                      className={`min-w-8 h-8 px-2.5 rounded-xl text-xs font-bold transition ${
                        currentPage === page
                          ? "bg-[#1E2A3A] text-white shadow-xs"
                          : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      {page}
                    </button>
                  </div>
                );
              })}

            {/* Sonraki Sayfa */}
            <button
              type="button"
              onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none transition"
              title={isEn ? "Next Page" : "Sonraki Sayfa"}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
