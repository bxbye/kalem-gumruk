"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { companyInfo } from "@/data/company";
import { navigationConfig } from "@/data/navigation";
import { useLanguage } from "@/context/LanguageContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import {
  Phone,
  Clock,
  Menu,
  X,
  ChevronDown,
  ShieldCheck,
  ExternalLink,
  Building2,
} from "lucide-react";

export default function Navbar() {
  const { t, localePath } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [openMobileAccordion, setOpenMobileAccordion] = useState<string | null>(null);

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-xs border-b border-slate-200/80">
      {/* Üst İnce Bilgi Barı */}
      <div className="bg-[#1E2A3A] text-slate-300 text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-white/90 font-medium">
              <span className="inline-block w-2 h-2 rounded-full bg-[#44B9CD]"></span>
              {t.topBar.tagline}
            </span>
            <span className="hidden md:inline text-slate-500">|</span>
            <span className="hidden md:flex items-center gap-1 text-slate-400">
              <Clock className="w-3.5 h-3.5 text-[#44B9CD]" />
              {t.topBar.workingHours}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-slate-400">{t.topBar.consultantLine}</span>
            <a
              href={`tel:${companyInfo.phoneRaw}`}
              className="flex items-center gap-1.5 text-white font-bold hover:text-[#44B9CD] transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-[#44B9CD]" />
              <span dir="ltr">{companyInfo.phone}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Ana Navigasyon */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Logo */}
        <Link href={localePath("/")} className="flex items-center gap-2">
          <div className="relative h-11 w-48 sm:w-52">
            <Image
              src="/logo.svg"
              alt="Kalem Gümrük Müşavirliği"
              fill
              className="object-contain object-left"
              priority
            />
          </div>
        </Link>

        {/* Masaüstü Dinamik Menü */}
        <div className="hidden lg:flex items-center gap-6 xl:gap-7 text-xs font-semibold text-slate-700">
          {navigationConfig.map((item) => {
            // Direkt Linkler (örn: Ana Sayfa, İletişim)
            if (item.type === "link" || !item.children || item.children.length === 0) {
              return (
                <Link
                  key={item.id}
                  href={localePath(item.href)}
                  className="hover:text-[#44B9CD] transition-colors py-2"
                >
                  {item.title(t)}
                </Link>
              );
            }

            // Mega Menü (örn: Hizmetlerimiz)
            if (item.type === "mega") {
              const halfCount = Math.ceil(item.children.length / 2);
              const leftCol = item.children.slice(0, halfCount);
              const rightCol = item.children.slice(halfCount);

              return (
                <div
                  key={item.id}
                  className="relative py-2"
                  onMouseEnter={() => setActiveDropdown(item.id)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Link
                    href={localePath(item.href)}
                    onClick={() => setActiveDropdown(null)}
                    className="flex items-center gap-1 hover:text-[#44B9CD] transition-colors font-semibold cursor-pointer"
                  >
                    <span>{item.title(t)}</span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${
                        activeDropdown === item.id ? "rotate-180 text-[#44B9CD]" : ""
                      }`}
                    />
                  </Link>

                  {activeDropdown === item.id && (
                    <div className="absolute top-full -left-20 w-[600px] bg-white rounded-2xl shadow-xl border border-slate-100 p-4 z-50 animate-in fade-in slide-in-from-top-1">
                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-3">
                        {t.nav.servicesMenuTitle}
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {/* Sol Kolon */}
                        <div className="space-y-1">
                          {leftCol.map((child) => (
                            <Link
                              key={child.id}
                              href={localePath(child.href)}
                              onClick={() => setActiveDropdown(null)}
                              className="block px-3 py-2 rounded-xl hover:bg-slate-50 hover:text-[#44B9CD] transition-colors"
                            >
                              <div className="font-bold text-xs text-slate-900">{child.title(t)}</div>
                              {child.desc && (
                                <div className="text-[11px] text-slate-500 font-normal">{child.desc(t)}</div>
                              )}
                            </Link>
                          ))}
                        </div>

                        {/* Sağ Kolon */}
                        <div className="space-y-1">
                          {rightCol.map((child) => (
                            <Link
                              key={child.id}
                              href={localePath(child.href)}
                              onClick={() => setActiveDropdown(null)}
                              className="block px-3 py-2 rounded-xl hover:bg-slate-50 hover:text-[#44B9CD] transition-colors"
                            >
                              <div className="font-bold text-xs text-slate-900">{child.title(t)}</div>
                              {child.desc && (
                                <div className="text-[11px] text-slate-500 font-normal">{child.desc(t)}</div>
                              )}
                            </Link>
                          ))}
                        </div>
                      </div>

                      <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between px-3 text-xs">
                        <span className="text-slate-400 text-[11px]">{t.nav.totalServicesCount}</span>
                        <Link
                          href={localePath(item.href)}
                          onClick={() => setActiveDropdown(null)}
                          className="font-bold text-[#44B9CD] hover:text-[#1E2A3A] transition-colors flex items-center gap-1"
                        >
                          <span>{t.nav.allServices}</span>
                          <span>→</span>
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              );
            }

            // Standart Dropdown (örn: Kurumsal, Bilgi & Araçlar)
            return (
              <div
                key={item.id}
                className="relative py-2"
                onMouseEnter={() => setActiveDropdown(item.id)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  href={localePath(item.href)}
                  onClick={() => setActiveDropdown(null)}
                  className="flex items-center gap-1 hover:text-[#44B9CD] transition-colors font-semibold cursor-pointer"
                >
                  <span>{item.title(t)}</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      activeDropdown === item.id ? "rotate-180 text-[#44B9CD]" : ""
                    }`}
                  />
                </Link>

                {activeDropdown === item.id && (
                  <div className="absolute top-full -left-4 w-76 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-50 animate-in fade-in slide-in-from-top-1">
                    <div className="space-y-1">
                      {item.children.map((child) => {
                        const Icon = child.icon || Building2;
                        return (
                          <Link
                            key={child.id}
                            href={localePath(child.href)}
                            onClick={() => setActiveDropdown(null)}
                            className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors group"
                          >
                            <div className="w-8 h-8 rounded-lg bg-teal-50 text-[#44B9CD] flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-[#1E2A3A] group-hover:text-[#44B9CD] transition-colors">
                              <Icon className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="font-bold text-xs text-slate-900 group-hover:text-[#44B9CD] transition-colors">
                                {child.title(t)}
                              </div>
                              {child.desc && (
                                <div className="text-[11px] text-slate-500 font-normal">
                                  {child.desc(t)}
                                </div>
                              )}
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Sağ Alan: Dil Değiştirici + Evrim Web Gümrük Müşteri Portalı Girişi */}
        <div className="hidden sm:flex items-center gap-3">
          <LanguageSwitcher variant="desktop" />

          <a
            href={companyInfo.evrimPortalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-[#1E2A3A] hover:bg-[#25364b] text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs border border-slate-700 hover:border-[#44B9CD]/50 group"
          >
            <ShieldCheck className="w-4 h-4 text-[#44B9CD] group-hover:scale-110 transition-transform" />
            <span>{t.nav.customerPortal}</span>
            <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-white transition-colors" />
          </a>
        </div>

        {/* Mobil Sağ Alan (Dil Seçici + Menü Butonu) */}
        <div className="flex lg:hidden items-center gap-2">
          <LanguageSwitcher variant="compact" />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-700 hover:text-slate-900 focus:outline-none cursor-pointer"
            aria-label="Menüyü aç/kapat"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobil Menü İçeriği (Akordeon Gruplu) */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 max-h-[85vh] overflow-y-auto">
          <LanguageSwitcher variant="mobile" />

          {navigationConfig.map((item) => {
            // Direkt linkler
            if (item.type === "link" || !item.children || item.children.length === 0) {
              return (
                <Link
                  key={item.id}
                  href={localePath(item.href)}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 text-xs font-bold text-slate-900 border-b border-slate-100"
                >
                  {item.title(t)}
                </Link>
              );
            }

            const isOpen = openMobileAccordion === item.id;
            return (
              <div key={item.id} className="py-2 border-b border-slate-100">
                <div className="w-full flex items-center justify-between">
                  <Link
                    href={localePath(item.href)}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-xs font-bold text-slate-900 hover:text-[#44B9CD] py-1"
                  >
                    {item.title(t)}
                  </Link>
                  <button
                    type="button"
                    onClick={() => setOpenMobileAccordion(isOpen ? null : item.id)}
                    className="p-1.5 cursor-pointer text-slate-500 hover:text-[#44B9CD]"
                    aria-label={`${item.title(t)} Alt Menüsü`}
                  >
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${
                        isOpen ? "rotate-180 text-[#44B9CD]" : ""
                      }`}
                    />
                  </button>
                </div>
                {isOpen && (
                  <div className="pt-2 pl-3 space-y-2 text-xs text-slate-600">
                    <Link
                      href={localePath(item.href)}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block font-bold text-[#44B9CD]"
                    >
                      • {t.nav.allServices || "Tüm Sayfayı Gör"}
                    </Link>
                    {item.children.map((child) => (
                      <Link
                        key={child.id}
                        href={localePath(child.href)}
                        onClick={() => setMobileMenuOpen(false)}
                        className="block hover:text-[#44B9CD]"
                      >
                        • {child.title(t)}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {/* Alt Müşteri Girişi Butonu */}
          <div className="pt-3">
            <a
              href={companyInfo.evrimPortalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 bg-[#1E2A3A] hover:bg-[#25364b] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 border border-[#44B9CD]/30"
            >
              <ShieldCheck className="w-4 h-4 text-[#44B9CD]" />
              <span>{t.nav.customerPortal}</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
