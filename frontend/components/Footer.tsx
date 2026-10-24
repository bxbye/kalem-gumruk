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

  // Grupları navigationConfig içerisinden alıyoruz
  const corporateGroup = navigationConfig.find((item) => item.id === "kurumsal");
  const servicesGroup = navigationConfig.find((item) => item.id === "services");
  const toolsGroup = navigationConfig.find((item) => item.id === "tools");

  return (
    <footer className="bg-[#0F172A] text-slate-300 pt-12 sm:pt-16 pb-20 sm:pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 mb-10 sm:mb-12">
          {/* Katman 1: Logo & Marka (Mobilde 1. Katman - Masaüstünde 3 kolon) */}
          <div className="lg:col-span-3 space-y-4">
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

          {/* Katman 2: Kurumsal ve Hizmetlerimiz (Mobilde 2. Katman - 2 Kolon Yan Yana) */}
          <div className="lg:col-span-4 grid grid-cols-2 gap-6 sm:gap-8">
            {/* Kurumsal */}
            {corporateGroup && (
              <div className="space-y-3">
                <div className="border-l-2 border-[#44B9CD] pl-2.5">
                  <h3 className="text-white text-xs sm:text-sm font-bold uppercase tracking-wider">
                    <Link
                      href={localePath(corporateGroup.href)}
                      className="hover:text-[#44B9CD] transition-colors"
                    >
                      {corporateGroup.title(t)}
                    </Link>
                  </h3>
                </div>
                <ul className="space-y-2 text-[11px] sm:text-xs text-slate-300">
                  {corporateGroup.children?.map((child) => (
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
            )}

            {/* Hizmetlerimiz */}
            {servicesGroup && (
              <div className="space-y-3">
                <div className="border-l-2 border-[#44B9CD] pl-2.5">
                  <h3 className="text-white text-xs sm:text-sm font-bold uppercase tracking-wider">
                    <Link
                      href={localePath(servicesGroup.href)}
                      className="hover:text-[#44B9CD] transition-colors"
                    >
                      {servicesGroup.title(t)}
                    </Link>
                  </h3>
                </div>
                <ul className="space-y-2 text-[11px] sm:text-xs text-slate-300">
                  {servicesGroup.children?.map((child) => (
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
            )}
          </div>

          {/* Katman 3: Araçlar ve İletişim (Mobilde 3. Katman - 2 Kolon Yan Yana) */}
          <div className="lg:col-span-5 grid grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-8">
            {/* Bilgi & Araçlar (Mobilde 1 kolon, Desktop'ta 2 kolon) */}
            {toolsGroup && (
              <div className="space-y-3 lg:col-span-2">
                <div className="border-l-2 border-[#44B9CD] pl-2.5">
                  <h3 className="text-white text-xs sm:text-sm font-bold uppercase tracking-wider">
                    <Link
                      href={localePath(toolsGroup.href)}
                      className="hover:text-[#44B9CD] transition-colors"
                    >
                      {toolsGroup.title(t)}
                    </Link>
                  </h3>
                </div>
                <ul className="space-y-2 text-[11px] sm:text-xs text-slate-300">
                  {toolsGroup.children?.map((child) => (
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
            )}

            {/* İletişim & Lokasyon (Mobilde 1 kolon, Desktop'ta 3 kolon) */}
            <div className="space-y-3 lg:col-span-3">
              <div className="border-l-2 border-[#44B9CD] pl-2.5">
                <h3 className="text-white text-xs sm:text-sm font-bold uppercase tracking-wider">
                  <Link
                    href={localePath("/iletisim")}
                    className="hover:text-[#44B9CD] transition-colors"
                  >
                    {t.footer.contactTitle}
                  </Link>
                </h3>
              </div>
              <div className="space-y-3 text-[11px] sm:text-xs text-slate-300">
                <div className="flex items-start gap-2 sm:gap-2.5">
                  <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#44B9CD] shrink-0 mt-0.5" />
                  <span className="leading-snug">{companyInfo.address}</span>
                </div>
                <div className="flex items-center gap-2 sm:gap-2.5">
                  <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#44B9CD] shrink-0" />
                  <a
                    href={`tel:${companyInfo.phoneRaw}`}
                    className="text-white font-bold hover:text-[#44B9CD]"
                    dir="ltr"
                  >
                    {companyInfo.phone}
                  </a>
                </div>
                <div className="flex items-center gap-2 sm:gap-2.5">
                  <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#44B9CD] shrink-0" />
                  <a
                    href={`mailto:${companyInfo.email}`}
                    className="text-[#44B9CD] font-medium hover:underline break-all"
                    dir="ltr"
                  >
                    {companyInfo.email}
                  </a>
                </div>
                <div className="flex items-start gap-2 sm:gap-2.5">
                  <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#44B9CD] shrink-0 mt-0.5" />
                  <span className="leading-snug">{t.topBar.workingHours}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Alt Telif & Bilgi (En alt kısım) */}
        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="text-center sm:text-left text-[11px] sm:text-xs leading-relaxed">
            © {new Date().getFullYear()} {companyInfo.name.replace(/\.$/, "")}. {t.footer.rights}
          </div>
          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-x-4 sm:gap-x-6 gap-y-2 text-[11px] sm:text-xs text-center">
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
