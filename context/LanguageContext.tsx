"use client";

import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { translations, availableLanguages, Language, Translations } from "@/data/translations";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
  isRTL: boolean;
  localePath: (path: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const supportedCodes = availableLanguages.map((l) => l.code);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "";
  const router = useRouter();

  // URL'deki dil segmentini dinamik tespit et (/tr, /en, /ar, /es...)
  const detectedLangFromUrl: Language = useMemo(() => {
    for (const code of supportedCodes) {
      if (pathname === `/${code}` || pathname.startsWith(`/${code}/`)) {
        return code;
      }
    }
    return "tr";
  }, [pathname]);

  const [language, setLanguageState] = useState<Language>(detectedLangFromUrl);

  // URL değiştiğinde aktif dili senkronize et
  useEffect(() => {
    if (detectedLangFromUrl !== language) {
      setLanguageState(detectedLangFromUrl);
      applyLanguageToDocument(detectedLangFromUrl);
    }
  }, [detectedLangFromUrl]);

  // Sayfa yüklendiğinde document ayarlarını uygula
  useEffect(() => {
    applyLanguageToDocument(language);
  }, []);

  const applyLanguageToDocument = (lang: Language) => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = lang;
      if (lang === "ar") {
        document.documentElement.dir = "rtl";
        document.documentElement.classList.add("rtl-mode");
      } else {
        document.documentElement.dir = "ltr";
        document.documentElement.classList.remove("rtl-mode");
      }
    }
  };

  const setLanguage = (newLang: Language) => {
    if (newLang === language) return;

    setLanguageState(newLang);
    applyLanguageToDocument(newLang);

    // Çerez ve localStorage güncelle
    try {
      localStorage.setItem("kalem_preferred_lang", newLang);
      document.cookie = `kalem_lang=${newLang};path=/;max-age=31536000;SameSite=Lax`;
    } catch {
      // sessizce geç
    }

    // URL'deki dil segmentini değiştir ve yönlendirme yap
    if (pathname) {
      const parts = pathname.split("/");
      // parts[0] === ""
      if (parts[1] && supportedCodes.includes(parts[1] as Language)) {
        parts[1] = newLang;
        const newPath = parts.join("/") || `/${newLang}`;
        const search = typeof window !== "undefined" ? window.location.search : "";
        const hash = typeof window !== "undefined" ? window.location.hash : "";
        router.push(`${newPath}${search}${hash}`);
      } else {
        // Eğer URL'de henüz dil ön eki yoksa
        const newPath = `/${newLang}${pathname.startsWith("/") ? pathname : "/" + pathname}`;
        router.push(newPath);
      }
    }
  };

  // Verilen yola aktif dil ön ekini ekler (Örn: "/kurumsal" -> "/es/kurumsal")
  const localePath = (path: string): string => {
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    // Eğer yol zaten desteklenen dillerden biri ile başlıyorsa dokunma
    const alreadyHasLang = supportedCodes.some(
      (code) => cleanPath === `/${code}` || cleanPath.startsWith(`/${code}/`)
    );
    if (alreadyHasLang) {
      return cleanPath;
    }
    // Ana sayfa için
    if (cleanPath === "/") {
      return `/${language}`;
    }
    return `/${language}${cleanPath}`;
  };

  const isRTL = language === "ar";
  const t = translations[language] || translations.tr;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL, localePath }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
