"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { companyInfo } from "@/data/company";
import { navigationConfig } from "@/data/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { MapPin, Phone, Mail, Clock, Shield } from "lucide-react";

export default function Footer() {
  const pathname = usePathname();
  const { t, localePath } = useLanguage();

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  // Üst menüde tanımlı alt gruplara sahip menü öğeleri
  const navGroups = navigationConfig.filter(
    (item) => item.children && item.children.length > 0
  );

  return (
    <footer className="bg-[#0F172A] text-slate-300 pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-8 mb-12">
          {/* Kolon 1: Logo & Marka (Soldaki Alan) */}
          <div className="col-span-1 md:col-span-1 lg:col-span-3 space-y-4 order-1">
            <Link href={localePath("/")} className="inline-block">
              <div className="inline-flex items-center bg-white px-4 py-2.5 rounded-xl shadow-md border border-slate-200 hover:border-slate-300 transition-colors">
                <div className="relative h-10 w-48">
                  <Image
                    src="/logo.svg"
                    alt="Kalem Gümrük Müşavirliği"
                    fill
                    className="object-contain object-left"
                  />
                </div>
              </div>
            </Link>

            <p className="text-xs text-slate-300 leading-relaxed">
              {t.footer.desc}
            </p>

            <div className="pt-1 flex items-center gap-2 text-xs text-[#44B9CD] font-medium">
              <Shield className="w-4 h-4 shrink-0 text-[#44B9CD]" />
              <span>{t.hero.features.yys.title}</span>
            </div>
          </div>

          {/* Orta Kısım: Üst Menüdeki Tüm Sayfalara Dinamik Erişim (Aradaki Alan) */}
          <div className="col-span-1 md:col-span-2 lg:col-span-6 order-2 md:order-3 lg:order-2 grid grid-cols-2 sm:grid-cols-3 gap-6">
            {navGroups.map((group) => (
              <div key={group.id} className="space-y-3">
                <div className="border-l-2 border-[#44B9CD] pl-2.5">
                  <h3 className="text-white text-xs sm:text-sm font-bold uppercase tracking-wider">
                    <Link
                      href={localePath(group.href)}
                      className="hover:text-[#44B9CD] transition-colors"
                    >
                      {group.title(t)}
                    </Link>
                  </h3>
                </div>
                <ul className="space-y-2 text-xs text-slate-300">
                  {group.children?.map((child) => (
                    <li key={child.id}>
                      <Link
                        href={localePath(child.href)}
                        className="hover:text-[#44B9CD] transition-colors block leading-snug py-0.5"
                      >
                        {child.title(t)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Kolon 3: Merkez Ofis & İletişim (Sağdaki Alan) */}
          <div className="col-span-1 md:col-span-1 lg:col-span-3 space-y-3 order-3 md:order-2 lg:order-3">
            <div className="border-l-2 border-[#44B9CD] pl-2.5 mb-4">
              <h3 className="text-white text-xs sm:text-sm font-bold uppercase tracking-wider">
                <Link
                  href={localePath("/iletisim")}
                  className="hover:text-[#44B9CD] transition-colors"
                >
                  {t.footer.contactTitle}
                </Link>
              </h3>
            </div>
            <div className="space-y-3.5 text-xs text-slate-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#44B9CD] shrink-0 mt-0.5" />
                <span>{companyInfo.address}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#44B9CD] shrink-0" />
                <a
                  href={`tel:${companyInfo.phoneRaw}`}
                  className="text-white font-bold hover:text-[#44B9CD]"
                  dir="ltr"
                >
                  {companyInfo.phone}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#44B9CD] shrink-0" />
                <a
                  href={`mailto:${companyInfo.email}`}
                  className="text-[#44B9CD] font-medium hover:underline"
                  dir="ltr"
                >
                  {companyInfo.email}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-[#44B9CD] shrink-0" />
                <span>{t.topBar.workingHours}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Alt Telif & Bilgi (En alt kısım - korundu) */}
        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            © {new Date().getFullYear()} {companyInfo.name}. {t.footer.rights}
          </div>
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <Link href={localePath("/kurumsal#kvkk")} className="hover:text-white transition-colors">
              {t.footer.privacy} &amp; {t.footer.kvkk}
            </Link>
            <Link href={localePath("/belgeler")} className="hover:text-white transition-colors">
              {t.nav.qualityCertificates}
            </Link>
            <Link href={localePath("/araclar")} className="hover:text-white transition-colors">
              {t.nav.toolsMenu}
            </Link>
            <Link href={localePath("/sirkuler")} className="hover:text-white transition-colors">
              {t.nav.circularsBulletins}
            </Link>
            <Link href="/admin" className="text-slate-400 hover:text-white transition-colors">
              Yönetici Girişi
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
