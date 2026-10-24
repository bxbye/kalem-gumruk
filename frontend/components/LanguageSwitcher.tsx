"use client";

import { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { availableLanguages, Language } from "@/data/translations";
import { ChevronDown, Globe } from "lucide-react";

interface LanguageSwitcherProps {
  variant?: "desktop" | "mobile" | "compact";
}

export default function LanguageSwitcher({ variant = "desktop" }: LanguageSwitcherProps) {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLang = availableLanguages.find((l) => l.code === language) || availableLanguages[0];

  // Dışarı tıklandığında dropdown'ı kapat
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (code: Language) => {
    setLanguage(code);
    setIsOpen(false);
  };

  if (variant === "mobile") {
    return (
      <div className="flex items-center gap-2 p-2 bg-slate-100/80 rounded-xl">
        <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5 pl-1">
          <Globe className="w-3.5 h-3.5 text-slate-600" />
          Dil / Language:
        </span>
        <div className="flex items-center gap-1.5 ml-auto">
          {availableLanguages.map((l) => {
            const isActive = l.code === language;
            return (
              <button
                key={l.code}
                type="button"
                onClick={() => handleSelect(l.code)}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? "bg-[#1E2A3A] text-white shadow-xs"
                    : "bg-white text-slate-700 hover:bg-slate-200 border border-slate-200"
                }`}
              >
                <span>{l.flag}</span>
                <span className="uppercase">{l.code}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100/90 border border-slate-200/90 transition-all cursor-pointer shadow-2xs"
        aria-label="Dil Seçimi / Select Language"
      >
        <span className="text-sm leading-none">{currentLang.flag}</span>
        <span className="uppercase font-bold tracking-wide text-[11px] text-slate-800">
          {currentLang.code}
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
            isOpen ? "rotate-180 text-[#44B9CD]" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1.5 w-36 bg-white rounded-xl shadow-xl border border-slate-100 p-1.5 z-50 animate-in fade-in slide-in-from-top-1">
          <div className="space-y-0.5">
            {availableLanguages.map((l) => {
              const isActive = l.code === language;
              return (
                <button
                  key={l.code}
                  type="button"
                  onClick={() => handleSelect(l.code)}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer text-left ${
                    isActive
                      ? "bg-slate-100 text-[#44B9CD] font-bold"
                      : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="text-base">{l.flag}</span>
                    <span>{l.nativeName}</span>
                  </span>
                  <span className="text-[10px] uppercase text-slate-400 font-mono">
                    {l.code}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
