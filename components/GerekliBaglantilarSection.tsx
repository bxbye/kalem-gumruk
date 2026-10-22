"use client";

import { useState } from "react";
import Image from "next/image";
import { gerekliBaglantilarData, GerekliBaglanti } from "@/data/gerekliBaglantilar";
import { ExternalLink, Globe, Search } from "lucide-react";

export default function GerekliBaglantilarSection() {
  const [selectedCat, setSelectedCat] = useState<string>("Tümü");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const categories = [
    "Tümü",
    "Kargo & Hava/Deniz",
    "Liman & Konteyner",
    "Resmi Sistemler",
    "Maliye & E-Belge",
  ];

  const filteredLinks = gerekliBaglantilarData.filter((item) => {
    const matchesCat = selectedCat === "Tümü" || item.category === selectedCat;
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
            <span>Hızlı Erişim Masası</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1E2A3A]">
            Gerekli Bağlantılar & Resmi Portallar
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
            Kargo takip, liman konteyner sorgulama, GİB e-arşiv ve GTB resmi gümrükleme sistemlerine
            tek merkezden doğrudan erişim sağlayın.
          </p>
        </div>

        {/* Arama Girişi */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Bağlantı veya sistem ara..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-hidden focus:border-[#44B9CD] focus:bg-white transition-all text-slate-800 placeholder-slate-400"
          />
        </div>
      </div>

      {/* Kategori Sekmeleri */}
      <div className="flex flex-wrap items-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCat(cat)}
            className={`text-xs px-4 py-2 rounded-xl font-bold transition-all ${
              selectedCat === cat
                ? "bg-[#1E2A3A] text-white shadow-sm"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {cat}
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
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-contain p-2"
                  sizes="(max-width: 768px) 100vw, 300px"
                />
              </div>

              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#44B9CD]/15 text-[#1E2A3A]">
                  {item.tag}
                </span>
                <span className="text-[10px] text-slate-500 font-medium">
                  {item.category}
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
              <span>Sisteme Git</span>
              <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
