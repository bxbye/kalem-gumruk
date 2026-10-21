"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { companyInfo } from "@/data/company";
import {
  Phone,
  Mail,
  Clock,
  Menu,
  X,
  ExternalLink,
  MessageCircle,
  ShieldCheck,
  ChevronDown,
} from "lucide-react";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdown, setServicesDropdown] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm">
      {/* Üst Bilgi Barı */}
      <div className="bg-[#1E2A3A] text-slate-300 text-xs py-2 px-4 border-b border-slate-700">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-4 flex-wrap justify-center">
            <span className="flex items-center gap-1.5 text-white/90">
              <span className="inline-block w-2 h-2 rounded-full bg-[#44B9CD] animate-pulse"></span>
              <strong>1997&apos;den Bugüne</strong> 25+ Yıllık Tecrübe
            </span>
            <span className="hidden sm:inline text-slate-500">|</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#44B9CD]" />
              {companyInfo.workingHours}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href={`tel:${companyInfo.phoneRaw}`}
              className="flex items-center gap-1.5 hover:text-[#44B9CD] transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-[#44B9CD]" />
              <span className="font-semibold text-white">{companyInfo.phone}</span>
            </a>
            <span className="text-slate-600">|</span>
            <a
              href={`https://wa.me/${companyInfo.whatsapp}?text=${encodeURIComponent(companyInfo.whatsappDefaultMessage)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 transition-colors font-medium"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              WhatsApp Müşavir Hattı
            </a>
          </div>
        </div>
      </div>

      {/* Ana Navigasyon */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="relative h-12 w-48 sm:w-56">
            <Image
              src="/logo.svg"
              alt="Kalem Gümrük Müşavirliği"
              fill
              className="object-contain object-left"
              priority
            />
          </div>
        </Link>

        {/* Masaüstü Menü */}
        <div className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-700">
          <Link href="/" className="hover:text-[#44B9CD] transition-colors py-2">
            Ana Sayfa
          </Link>
          <Link href="/kurumsal" className="hover:text-[#44B9CD] transition-colors py-2">
            Kurumsal
          </Link>

          {/* Hizmetler Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setServicesDropdown(true)}
            onMouseLeave={() => setServicesDropdown(false)}
          >
            <button className="flex items-center gap-1 hover:text-[#44B9CD] transition-colors py-2">
              <span>Hizmetlerimiz</span>
              <ChevronDown className="w-4 h-4" />
            </button>

            {servicesDropdown && (
              <div className="absolute top-full left-0 w-72 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                <Link
                  href="/hizmetlerimiz/ithalat"
                  className="block px-4 py-2.5 text-slate-700 hover:bg-slate-50 hover:text-[#44B9CD] transition-colors"
                >
                  <div className="font-semibold text-xs text-slate-900">İthalat Gümrükleme</div>
                  <div className="text-[11px] text-slate-500">Tescil, vergi hesabı ve teslimat</div>
                </Link>
                <Link
                  href="/hizmetlerimiz/ihracat"
                  className="block px-4 py-2.5 text-slate-700 hover:bg-slate-50 hover:text-[#44B9CD] transition-colors"
                >
                  <div className="font-semibold text-xs text-slate-900">İhracat Gümrükleme</div>
                  <div className="text-[11px] text-slate-500">A.TR, EUR.1, Birlik ve intaç</div>
                </Link>
                <Link
                  href="/hizmetlerimiz/dahilde-haricte-isleme"
                  className="block px-4 py-2.5 text-slate-700 hover:bg-slate-50 hover:text-[#44B9CD] transition-colors"
                >
                  <div className="font-semibold text-xs text-slate-900">Dahilde & Hariçte İşleme (DİR)</div>
                  <div className="text-[11px] text-slate-500">DİİB alımı, revize ve taahhüt kapatma</div>
                </Link>
                <Link
                  href="/hizmetlerimiz/antrepo-transit"
                  className="block px-4 py-2.5 text-slate-700 hover:bg-slate-50 hover:text-[#44B9CD] transition-colors"
                >
                  <div className="font-semibold text-xs text-slate-900">Antrepo & Transit Ticaret</div>
                  <div className="text-[11px] text-slate-500">Gümrüklü depolama ve transit sevk</div>
                </Link>
                <Link
                  href="/hizmetlerimiz/serbest-bolge"
                  className="block px-4 py-2.5 text-slate-700 hover:bg-slate-50 hover:text-[#44B9CD] transition-colors"
                >
                  <div className="font-semibold text-xs text-slate-900">Serbest Bölge İşlemleri</div>
                  <div className="text-[11px] text-slate-500">SBİF ve özel rejim yönetimi</div>
                </Link>
                <Link
                  href="/hizmetlerimiz/danismanlik"
                  className="block px-4 py-2.5 text-slate-700 hover:bg-slate-50 hover:text-[#44B9CD] transition-colors"
                >
                  <div className="font-semibold text-xs text-slate-900">Gümrük Danışmanlığı & YYS</div>
                  <div className="text-[11px] text-slate-500">Sonradan kontrol ve teşvikler</div>
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
          <Link href="/iletisim" className="hover:text-[#44B9CD] transition-colors py-2">
            İletişim
          </Link>
        </div>

        {/* Sağ Butonlar (Evrim Müşteri Girişi & Hızlı İletişim) */}
        <div className="hidden sm:flex items-center gap-3">
          <a
            href={companyInfo.evrimPortalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-[#1E2A3A] hover:bg-[#2A3B50] text-[#44B9CD] border border-[#44B9CD]/40 px-4 py-2.5 rounded-lg text-xs font-bold transition-all shadow-sm hover:shadow"
          >
            <ShieldCheck className="w-4 h-4 text-[#44B9CD]" />
            <span>Evrim E-Gümrük Girişi</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </a>

          <Link
            href="/iletisim#teklif"
            className="bg-[#44B9CD] hover:bg-[#2f9fb3] text-white px-4 py-2.5 rounded-lg text-xs font-bold transition-all shadow-sm"
          >
            Hızlı Teklif Al
          </Link>
        </div>

        {/* Mobil Menü Butonu */}
        <div className="flex sm:hidden items-center gap-2">
          <a
            href={companyInfo.evrimPortalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#1E2A3A] text-[#44B9CD] p-2 rounded-lg text-xs font-bold flex items-center gap-1 border border-[#44B9CD]/30"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Evrim</span>
          </a>
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
            className="block py-2 text-sm font-semibold text-slate-900 border-b border-slate-100"
          >
            Ana Sayfa
          </Link>
          <Link
            href="/kurumsal"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-slate-900 border-b border-slate-100"
          >
            Kurumsal (1997&apos;den Bugüne)
          </Link>
          <div className="py-2 border-b border-slate-100">
            <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
              Hizmetlerimiz
            </span>
            <div className="pl-3 space-y-2 text-sm text-slate-700">
              <Link
                href="/hizmetlerimiz/ithalat"
                onClick={() => setMobileMenuOpen(false)}
                className="block hover:text-[#44B9CD]"
              >
                • İthalat Gümrükleme
              </Link>
              <Link
                href="/hizmetlerimiz/ihracat"
                onClick={() => setMobileMenuOpen(false)}
                className="block hover:text-[#44B9CD]"
              >
                • İhracat Gümrükleme
              </Link>
              <Link
                href="/hizmetlerimiz/dahilde-haricte-isleme"
                onClick={() => setMobileMenuOpen(false)}
                className="block hover:text-[#44B9CD]"
              >
                • Dahilde & Hariçte İşleme (DİR)
              </Link>
              <Link
                href="/hizmetlerimiz/antrepo-transit"
                onClick={() => setMobileMenuOpen(false)}
                className="block hover:text-[#44B9CD]"
              >
                • Antrepo & Transit Ticaret
              </Link>
              <Link
                href="/hizmetlerimiz/serbest-bolge"
                onClick={() => setMobileMenuOpen(false)}
                className="block hover:text-[#44B9CD]"
              >
                • Serbest Bölge İşlemleri
              </Link>
              <Link
                href="/hizmetlerimiz/danismanlik"
                onClick={() => setMobileMenuOpen(false)}
                className="block hover:text-[#44B9CD]"
              >
                • Gümrük Danışmanlığı & YYS
              </Link>
            </div>
          </div>
          <Link
            href="/araclar"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-slate-900 border-b border-slate-100"
          >
            Gümrükçü Masası (Faydalı Araçlar)
          </Link>
          <Link
            href="/sirkuler"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-slate-900 border-b border-slate-100"
          >
            Mevzuat & Sirküler
          </Link>
          <Link
            href="/iletisim"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-slate-900"
          >
            İletişim
          </Link>

          <div className="pt-4 flex flex-col gap-2">
            <a
              href={companyInfo.evrimPortalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full text-center bg-[#1E2A3A] text-[#44B9CD] py-2.5 rounded-lg text-sm font-bold border border-[#44B9CD]/40 flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              Evrim E-Gümrük Müşteri Girişi
            </a>
            <Link
              href="/iletisim#teklif"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center bg-[#44B9CD] text-white py-2.5 rounded-lg text-sm font-bold"
            >
              Hızlı Teklif Al
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
