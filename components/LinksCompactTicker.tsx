"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { gerekliBaglantilarData } from "@/data/gerekliBaglantilar";
import { ExternalLink, ArrowRight, Pause, Play, Globe } from "lucide-react";

export default function LinksCompactTicker() {
  const [isManuallyPaused, setIsManuallyPaused] = useState(false);

  // Kesintisiz sonsuz akış için listeyi 2 kez tekrarlıyoruz
  const marqueeItems = [...gerekliBaglantilarData, ...gerekliBaglantilarData];

  return (
    <section className="bg-gradient-to-b from-slate-50 via-slate-100/60 to-slate-50 border-y border-slate-200/90 py-8 sm:py-10 select-none overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Üst Başlık ve Eylemler */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-cyan-50 border border-cyan-200/60 text-[#258190]">
              <span className="w-2 h-2 rounded-full bg-[#44B9CD] animate-pulse"></span>
              <span className="text-[11px] font-bold uppercase tracking-wider">
                Hızlı Erişim & Entegrasyonlar
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#1E2A3A] tracking-tight">
              Gerekli Bağlantılar ve Portallar
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
              Kargo takip, liman ardiye sorgulama ve resmi gümrükleme sistemlerine tek tıkla doğrudan erişin.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {/* Duraklat / Oynat Kontrolü */}
            <button
              onClick={() => setIsManuallyPaused((prev) => !prev)}
              aria-label={isManuallyPaused ? "Akışı Başlat" : "Akışı Duraklat"}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-900 text-xs font-semibold shadow-2xs transition-all"
              title={isManuallyPaused ? "Akışı devam ettir" : "Akışı duraklat"}
            >
              {isManuallyPaused ? (
                <>
                  <Play className="w-3.5 h-3.5 text-[#44B9CD] fill-current" />
                  <span className="hidden xs:inline">Devam Ettir</span>
                </>
              ) : (
                <>
                  <Pause className="w-3.5 h-3.5 text-slate-400" />
                  <span className="hidden xs:inline">Duraklat</span>
                </>
              )}
            </button>

            {/* Tümünü Gör Linki */}
            <Link
              href="/araclar#gerekli-baglantilar"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#1E2A3A] hover:bg-[#2A3B50] text-white text-xs font-bold transition-all shadow-xs hover:shadow"
            >
              <span>Tüm Portallar</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#44B9CD]" />
            </Link>
          </div>
        </div>
      </div>

      {/* Marquee Taşıyıcı ve Kenar Karartma / Fade Efektleri */}
      <div className="relative w-full overflow-hidden marquee-container py-2">
        {/* Sol yumuşak solma degrade maskesi */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-r from-slate-100 via-slate-100/90 to-transparent z-10" />

        {/* Sağ yumuşak solma degrade maskesi */}
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-l from-slate-100 via-slate-100/90 to-transparent z-10" />

        {/* Sağdan Sola Yavaş Akan Kart Bandı */}
        <div
          className="animate-marquee-slow flex items-center gap-4 sm:gap-5 px-4"
          style={{
            animationPlayState: isManuallyPaused ? "paused" : undefined,
          }}
        >
          {marqueeItems.map((item, index) => (
            <a
              key={`${item.id}-${index}`}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative shrink-0 w-[300px] sm:w-[340px] bg-white hover:bg-slate-50/90 border border-slate-200/90 hover:border-[#44B9CD] rounded-2xl p-4 sm:p-5 shadow-xs hover:shadow-lg transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between"
            >
              {/* Üst Kısım: Logo + Başlık + Kategori Rozeti */}
              <div className="flex items-start gap-3.5">
                {/* Logo Kutusu */}
                <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-slate-50 border border-slate-100 shadow-2xs p-2 shrink-0 flex items-center justify-center overflow-hidden group-hover:bg-white group-hover:border-cyan-100 transition-colors">
                  <Image
                    src={item.image}
                    alt={item.shortTitle}
                    fill
                    className="object-contain p-1.5 transition-transform duration-300 group-hover:scale-105"
                    sizes="64px"
                  />
                </div>

                {/* Başlık ve Kategori */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-cyan-800 bg-cyan-50 border border-cyan-100/80 px-2 py-0.5 rounded-md truncate max-w-[170px]">
                      {item.tag}
                    </span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-300 group-hover:text-[#44B9CD] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" />
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-[#44B9CD] transition-colors truncate">
                    {item.shortTitle}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Alt Bilgi & Doğrudan Giriş Butonu Görünümü */}
              <div className="mt-3.5 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 group-hover:text-slate-700">
                <span className="flex items-center gap-1.5 text-[11px] text-slate-400 group-hover:text-slate-500 font-medium">
                  <Globe className="w-3 h-3 text-[#44B9CD]" />
                  Resmi Sistem
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#44B9CD] group-hover:text-[#288696] transition-colors">
                  <span>Portala Git</span>
                  <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
