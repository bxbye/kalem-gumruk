"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { gerekliBaglantilarData, GerekliBaglanti } from "@/data/gerekliBaglantilar";
import { ExternalLink, Globe, Search } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface GerekliBaglantilarSectionProps {
  initialLinks?: GerekliBaglanti[];
}

export default function GerekliBaglantilarSection({ initialLinks }: GerekliBaglantilarSectionProps = {}) {
  const { t } = useLanguage();
  const [selectedCat, setSelectedCat] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [links, setLinks] = useState<GerekliBaglanti[]>(
    initialLinks && initialLinks.length > 0 ? initialLinks : []
  );

  useEffect(() => {
    let isMounted = true;
    const fetchFreshLinks = async () => {
      try {
        const res = await fetch("/api/public/baglantilar", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (data.baglantilar && Array.isArray(data.baglantilar) && data.baglantilar.length > 0) {
            if (isMounted) setLinks(data.baglantilar);
          }
        }
      } catch (err) {
        console.error("Bağlantılar alınamadı:", err);
      }
    };
    fetchFreshLinks();
    return () => {
      isMounted = false;
    };
  }, []);

  const activeData =
    links.length > 0
      ? links
      : initialLinks && initialLinks.length > 0
      ? initialLinks
      : gerekliBaglantilarData;

  const categoryDefs = [
    { key: "all", label: t.usefulLinksSection.categories.all, filterValue: "Tümü" },
    { key: "cargo", label: t.usefulLinksSection.categories.cargo, filterValue: "Kargo & Hava/Deniz" },
    { key: "port", label: t.usefulLinksSection.categories.port, filterValue: "Liman & Konteyner" },
    { key: "official", label: t.usefulLinksSection.categories.official, filterValue: "Resmi Sistemler" },
    { key: "finance", label: t.usefulLinksSection.categories.finance, filterValue: "Maliye & E-Belge" },
  ];

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case "Kargo & Hava/Deniz":
        return t.usefulLinksSection.categories.cargo;
      case "Liman & Konteyner":
        return t.usefulLinksSection.categories.port;
      case "Resmi Sistemler":
        return t.usefulLinksSection.categories.official;
      case "Maliye & E-Belge":
        return t.usefulLinksSection.categories.finance;
      default:
        return cat;
    }
  };

  const filteredLinks = activeData.filter((item) => {
    const activeDef = categoryDefs.find((c) => c.key === selectedCat);
    const matchesCat = selectedCat === "all" || item.category === activeDef?.filterValue;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.shortTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tag.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-sm space-y-8" id="gerekli-baglantilar">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-100 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#44B9CD]/15 text-[#1E2A3A] text-xs font-bold uppercase tracking-wider mb-2">
            <Globe className="w-3.5 h-3.5 text-[#44B9CD]" />
            <span>{t.usefulLinksSection.badge}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1E2A3A]">
            {t.usefulLinksSection.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
            {t.usefulLinksSection.desc}
          </p>
        </div>

        {/* Arama Girişi */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.usefulLinksSection.searchPlaceholder}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-hidden focus:border-[#44B9CD] focus:bg-white transition-all text-slate-800 placeholder-slate-400"
          />
        </div>
      </div>

      {/* Kategori Sekmeleri */}
      <div className="flex flex-wrap items-center gap-2">
        {categoryDefs.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setSelectedCat(cat.key)}
            className={`text-xs px-4 py-2 rounded-xl font-bold transition-all cursor-pointer ${
              selectedCat === cat.key
                ? "bg-[#1E2A3A] text-white shadow-sm"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Bağlantılar Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filteredLinks.map((item) => (
          <a
            key={item.id}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-slate-50 hover:bg-white rounded-2xl p-4 border border-slate-200 hover:border-[#44B9CD] hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              {/* Görsel Kartı */}
              <div className="relative w-full h-24 bg-white rounded-xl overflow-hidden border border-slate-200/80 mb-3.5 flex items-center justify-center p-2 group-hover:scale-[1.02] transition-transform">
                {item.image && (item.image.startsWith("/") || item.image.startsWith("http")) ? (
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    unoptimized
                    className="object-contain p-2"
                    sizes="(max-width: 768px) 100vw, 300px"
                  />
                ) : (
                  <Globe className="w-8 h-8 text-slate-400 group-hover:text-[#44B9CD] transition-colors" />
                )}
              </div>

              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#44B9CD]/15 text-[#1E2A3A]">
                  {item.tag === "Resmi Sistem" ? t.usefulLinksSection.officialSystem : item.tag}
                </span>
                <span className="text-[10px] text-slate-500 font-medium">
                  {getCategoryLabel(item.category)}
                </span>
              </div>

              <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-[#44B9CD] transition-colors line-clamp-1">
                {item.shortTitle}
              </h3>

              <p className="text-[11px] text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                {item.description}
              </p>
            </div>

            <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#1E2A3A] group-hover:text-[#44B9CD] transition-colors">
              <span>{t.usefulLinksSection.visitSystem}</span>
              <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
