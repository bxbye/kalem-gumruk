"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { companyInfo } from "@/data/company";
import {
  Phone,
  Clock,
  Menu,
  X,
  ChevronDown,
  ArrowRight,
  FileText,
} from "lucide-react";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdown, setServicesDropdown] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-xs border-b border-slate-200/80">
      {/* Üst İnce Bilgi Barı */}
      <div className="bg-[#1E2A3A] text-slate-300 text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-white/90 font-medium">
              <span className="inline-block w-2 h-2 rounded-full bg-[#44B9CD]"></span>
              Kalem Gümrük Müşavirliği — 1997&apos;den Bugüne
            </span>
            <span className="hidden md:inline text-slate-500">|</span>
            <span className="hidden md:flex items-center gap-1 text-slate-400">
              <Clock className="w-3.5 h-3.5 text-[#44B9CD]" />
              {companyInfo.workingHours}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-slate-400">Doğrudan Müşavir Hattı:</span>
            <a
              href={`tel:${companyInfo.phoneRaw}`}
              className="flex items-center gap-1.5 text-white font-bold hover:text-[#44B9CD] transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-[#44B9CD]" />
              <span>{companyInfo.phone}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Ana Navigasyon (Yalnızca Site İçi Gezinme) */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
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

        {/* Masaüstü Menü (Sadece Site İçi Sayfalar) */}
        <div className="hidden lg:flex items-center gap-6 text-xs font-semibold text-slate-700">
          <Link href="/" className="hover:text-[#44B9CD] transition-colors py-2">
            Ana Sayfa
          </Link>
          <Link href="/kurumsal" className="hover:text-[#44B9CD] transition-colors py-2">
            Kurumsal
          </Link>

          {/* Hizmetler Açılır Menü */}
          <div
            className="relative"
            onMouseEnter={() => setServicesDropdown(true)}
            onMouseLeave={() => setServicesDropdown(false)}
          >
            <button className="flex items-center gap-1 hover:text-[#44B9CD] transition-colors py-2">
              <span>Hizmetlerimiz</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            {servicesDropdown && (
              <div className="absolute top-full left-0 w-72 bg-white rounded-2xl shadow-xl border border-slate-100 py-2.5 z-50 animate-in fade-in slide-in-from-top-1">
                <Link
                  href="/hizmetlerimiz/ithalat"
                  className="block px-4 py-2 hover:bg-slate-50 hover:text-[#44B9CD] transition-colors"
                >
                  <div className="font-bold text-xs text-slate-900">İthalat Gümrükleme</div>
                  <div className="text-[11px] text-slate-500 font-normal">Tescil, vergi hesabı ve teslimat</div>
                </Link>
                <Link
                  href="/hizmetlerimiz/ihracat"
                  className="block px-4 py-2 hover:bg-slate-50 hover:text-[#44B9CD] transition-colors"
                >
                  <div className="font-bold text-xs text-slate-900">İhracat Gümrükleme</div>
                  <div className="text-[11px] text-slate-500 font-normal">A.TR, EUR.1, Birlik ve intaç</div>
                </Link>
                <Link
                  href="/hizmetlerimiz/dahilde-haricte-isleme"
                  className="block px-4 py-2 hover:bg-slate-50 hover:text-[#44B9CD] transition-colors"
                >
                  <div className="font-bold text-xs text-slate-900">Dahilde & Hariçte İşleme (DİR)</div>
                  <div className="text-[11px] text-slate-500 font-normal">DİİB alımı ve taahhüt kapatma</div>
                </Link>
                <Link
                  href="/hizmetlerimiz/antrepo-transit"
                  className="block px-4 py-2 hover:bg-slate-50 hover:text-[#44B9CD] transition-colors"
                >
                  <div className="font-bold text-xs text-slate-900">Antrepo & Transit Ticaret</div>
                  <div className="text-[11px] text-slate-500 font-normal">Gümrüklü depolama ve sevk</div>
                </Link>
                <Link
                  href="/hizmetlerimiz/serbest-bolge"
                  className="block px-4 py-2 hover:bg-slate-50 hover:text-[#44B9CD] transition-colors"
                >
                  <div className="font-bold text-xs text-slate-900">Serbest Bölge Rejimi</div>
                  <div className="text-[11px] text-slate-500 font-normal">SBİF ve özel rejim yönetimi</div>
                </Link>
                <Link
                  href="/hizmetlerimiz/danismanlik"
                  className="block px-4 py-2 hover:bg-slate-50 hover:text-[#44B9CD] transition-colors"
                >
                  <div className="font-bold text-xs text-slate-900">Gümrük Danışmanlığı & YYS</div>
                  <div className="text-[11px] text-slate-500 font-normal">Sonradan kontrol ve teşvikler</div>
                </Link>
              </div>
            )}
          </div>

          <Link href="/araclar" className="hover:text-[#44B9CD] transition-colors py-2">
            Gümrükçü Masası
          </Link>
          <Link href="/sirkuler" className="hover:text-[#44B9CD] transition-colors py-2">
            Mevzuat & Sirküler
          </Link>
          <Link href="/kariyer" className="hover:text-[#44B9CD] transition-colors py-2">
            Kariyer
          </Link>
          <Link href="/iletisim" className="hover:text-[#44B9CD] transition-colors py-2">
            İletişim
          </Link>
        </div>

        {/* Sağ Buton: Teklif Formuna Hızlı Geçiş */}
        <div className="hidden sm:flex items-center gap-3">
          <Link
            href="/#teklif"
            className="flex items-center gap-1.5 bg-[#1E2A3A] hover:bg-[#2A3B50] text-[#44B9CD] hover:text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs border border-[#44B9CD]/30"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Gümrükleme Teklifi Al</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Mobil Menü Butonu */}
        <div className="flex lg:hidden items-center gap-2">
          <Link
            href="/#teklif"
            className="bg-[#1E2A3A] text-[#44B9CD] text-[11px] font-bold px-3 py-1.5 rounded-lg border border-[#44B9CD]/30"
          >
            Teklif Al
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-700 hover:text-slate-900 focus:outline-none"
            aria-label="Menüyü aç"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobil Menü İçeriği */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-xs font-bold text-slate-900 border-b border-slate-100"
          >
            Ana Sayfa
          </Link>
          <Link
            href="/kurumsal"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-xs font-bold text-slate-900 border-b border-slate-100"
          >
            Kurumsal
          </Link>
          <div className="py-2 border-b border-slate-100">
            <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Hizmetlerimiz
            </span>
            <div className="pl-3 space-y-1.5 text-xs text-slate-700">
              <Link href="/hizmetlerimiz/ithalat" onClick={() => setMobileMenuOpen(false)} className="block hover:text-[#44B9CD]">
                • İthalat Gümrükleme
              </Link>
              <Link href="/hizmetlerimiz/ihracat" onClick={() => setMobileMenuOpen(false)} className="block hover:text-[#44B9CD]">
                • İhracat Gümrükleme
              </Link>
              <Link href="/hizmetlerimiz/dahilde-haricte-isleme" onClick={() => setMobileMenuOpen(false)} className="block hover:text-[#44B9CD]">
                • Dahilde & Hariçte İşleme (DİR)
              </Link>
              <Link href="/hizmetlerimiz/antrepo-transit" onClick={() => setMobileMenuOpen(false)} className="block hover:text-[#44B9CD]">
                • Antrepo & Transit Ticaret
              </Link>
              <Link href="/hizmetlerimiz/serbest-bolge" onClick={() => setMobileMenuOpen(false)} className="block hover:text-[#44B9CD]">
                • Serbest Bölge Rejimi
              </Link>
              <Link href="/hizmetlerimiz/danismanlik" onClick={() => setMobileMenuOpen(false)} className="block hover:text-[#44B9CD]">
                • Gümrük Danışmanlığı & YYS
              </Link>
            </div>
          </div>
          <Link
            href="/araclar"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-xs font-bold text-slate-900 border-b border-slate-100"
          >
            Gümrükçü Masası
          </Link>
          <Link
            href="/sirkuler"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-xs font-bold text-slate-900 border-b border-slate-100"
          >
            Mevzuat & Sirküler
          </Link>
          <Link
            href="/kariyer"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-xs font-bold text-slate-900 border-b border-slate-100"
          >
            Kariyer
          </Link>
          <Link
            href="/iletisim"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-xs font-bold text-slate-900"
          >
            İletişim
          </Link>
        </div>
      )}
    </header>
  );
}
