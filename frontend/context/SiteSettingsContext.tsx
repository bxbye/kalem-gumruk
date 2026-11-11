"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { companyInfo } from "@/data/company";
import type { SiteSettings } from "@/lib/settings";

interface SiteSettingsContextValue {
  settings: SiteSettings;
  refreshSettings: () => Promise<void>;
}

const SiteSettingsContext = createContext<SiteSettingsContextValue>({
  settings: companyInfo,
  refreshSettings: async () => {},
});

export function SiteSettingsProvider({
  initialSettings,
  children,
}: {
  initialSettings?: SiteSettings;
  children: React.ReactNode;
}) {
  const [settings, setSettings] = useState<SiteSettings>({
    ...companyInfo,
    ...(initialSettings || {}),
  });

  useEffect(() => {
    if (initialSettings) {
      setSettings({ ...companyInfo, ...initialSettings });
    }
  }, [initialSettings]);

  const refreshSettings = useCallback(async () => {
    try {
      const res = await fetch("/api/public/settings", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        if (data?.success && data.settings) {
          setSettings({ ...companyInfo, ...data.settings });
        }
      }
    } catch {
      // Varsayılan/mevcut ayarlarla devam et
    }
  }, []);

  useEffect(() => {
    const handler = () => {
      void refreshSettings();
    };
    window.addEventListener("kalem:settings-updated", handler);
    return () => window.removeEventListener("kalem:settings-updated", handler);
  }, [refreshSettings]);

  return (
    <SiteSettingsContext.Provider value={{ settings, refreshSettings }}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings(): SiteSettings {
  return useContext(SiteSettingsContext).settings;
}
