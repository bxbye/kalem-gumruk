import Link from "next/link";
import Image from "next/image";
import { companyInfo } from "@/data/company";
import { MapPin, Phone, Mail, Clock, ExternalLink, Shield } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#0F172A] text-slate-300 pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Kolon 1: Logo & Hakkında */}
          <div className="space-y-4">
            {/* Beyaz zeminli şık logo kartı (Logonun karanlıkta kaybolmasını önler ve net gösterir) */}
            <div className="inline-flex items-center bg-white px-4 py-2.5 rounded-xl shadow-md border border-slate-200">
              <div className="relative h-10 w-48">
                <Image
                  src="/logo.svg"
                  alt="Kalem Gümrük Müşavirliği"
                  fill
                  className="object-contain object-left"
                />
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              1997 yılından bu yana dış ticaret sektöründe faaliyet gösteren Kalem Gümrük Müşavirliği;
              hız, mevzuata tam uyum, şeffaflık ve dijital takip prensipleriyle hizmet vermektedir.
            </p>

            <div className="pt-1 flex items-center gap-2 text-xs text-[#44B9CD] font-medium">
              <Shield className="w-4 h-4 shrink-0 text-[#44B9CD]" />
              <span>A Karne Yetkili Müşavir Kadrosu</span>
            </div>
          </div>

          {/* Kolon 2: Hızlı Hizmet Bağlantıları */}
          <div>
            <div className="flex items-center justify-between mb-4 border-l-2 border-[#44B9CD] pl-2.5">
              <h3 className="text-white text-sm font-bold uppercase tracking-wider">
                Hizmetlerimiz
              </h3>
              <Link href="/hizmetlerimiz" className="text-[11px] text-[#44B9CD] hover:underline font-semibold">
                Tümü (10) →
              </Link>
            </div>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>
                <Link href="/hizmetlerimiz/ithalat" className="hover:text-[#44B9CD] transition-colors">
                  İthalat Gümrükleme İşlemleri
                </Link>
              </li>
              <li>
                <Link href="/hizmetlerimiz/ihracat" className="hover:text-[#44B9CD] transition-colors">
                  İhracat Gümrükleme İşlemleri
                </Link>
              </li>
              <li>
                <Link
                  href="/hizmetlerimiz/dahilde-isleme"
                  className="hover:text-[#44B9CD] transition-colors"
                >
                  Dahilde İşleme Rejimi (DİR)
                </Link>
              </li>
              <li>
                <Link
                  href="/hizmetlerimiz/haricte-isleme"
                  className="hover:text-[#44B9CD] transition-colors"
                >
                  Hariçte İşleme Hizmetleri
                </Link>
              </li>
              <li>
                <Link href="/hizmetlerimiz/antrepo" className="hover:text-[#44B9CD] transition-colors">
                  Antrepo Rejimi İşlemleri
                </Link>
              </li>
              <li>
                <Link href="/hizmetlerimiz/transit" className="hover:text-[#44B9CD] transition-colors">
                  Transit Rejimi & NCTS
                </Link>
              </li>
              <li>
                <Link href="/hizmetlerimiz/serbest-bolge" className="hover:text-[#44B9CD] transition-colors">
                  Serbest Bölge İşlemleri
                </Link>
              </li>
              <li>
                <Link href="/hizmetlerimiz/danismanlik" className="hover:text-[#44B9CD] transition-colors">
                  Dış Ticaret & Gümrük Danışmanlığı
                </Link>
              </li>
              <li>
                <Link href="/hizmetlerimiz/hukuk" className="hover:text-[#44B9CD] transition-colors">
                  Gümrük Hukuk Hizmetleri & Uzlaşma
                </Link>
              </li>
              <li>
                <Link href="/hizmetlerimiz/sigorta" className="hover:text-[#44B9CD] transition-colors">
                  Emtia Nakliyat Sigortası
                </Link>
              </li>
            </ul>
          </div>

          {/* Kolon 3: Faydalı Gümrük Portalları */}
          <div>
            <h3 className="text-white text-sm font-bold uppercase tracking-wider mb-4 border-l-2 border-[#44B9CD] pl-2.5">
              Müşavir Masası
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li>
                <a
                  href={companyInfo.evrimPortalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#44B9CD] flex items-center justify-between"
                >
                  <span>Evrim Web Gümrük Girişi</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://uygulama.gtb.gov.tr/Bilge"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#44B9CD] flex items-center justify-between"
                >
                  <span>BİLGE Sistemi (E-Gümrük)</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://tareks.ticaret.gov.tr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#44B9CD] flex items-center justify-between"
                >
                  <span>TAREKS Risk Denetim</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://uygulama.gtb.gov.tr/Tara"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#44B9CD] flex items-center justify-between"
                >
                  <span>GTİP & Tarife Cetveli</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.tcmb.gov.tr/kurlar/kurlar_tr.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#44B9CD] flex items-center justify-between"
                >
                  <span>TCMB Gümrük Kurları</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://ebirlik.tim.org.tr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#44B9CD] flex items-center justify-between"
                >
                  <span>E-Birlik (TİM Onay)</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                </a>
              </li>
            </ul>
          </div>

          {/* Kolon 4: Merkez Ofis & İletişim */}
          <div>
            <h3 className="text-white text-sm font-bold uppercase tracking-wider mb-4 border-l-2 border-[#44B9CD] pl-2.5">
              İletişim & Lokasyon
            </h3>
            <div className="space-y-3.5 text-xs text-slate-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#44B9CD] shrink-0 mt-0.5" />
                <span>{companyInfo.address}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#44B9CD] shrink-0" />
                <a href={`tel:${companyInfo.phoneRaw}`} className="text-white font-bold hover:text-[#44B9CD]">
                  {companyInfo.phone}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#44B9CD] shrink-0" />
                <a href={`mailto:${companyInfo.email}`} className="text-[#44B9CD] font-medium hover:underline">
                  {companyInfo.email}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-[#44B9CD] shrink-0" />
                <span>{companyInfo.workingHours}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Alt Telif & Bilgi */}
        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            © {new Date().getFullYear()} {companyInfo.name}. Tüm Hakları Saklıdır.
          </div>
          <div className="flex items-center gap-6">
            <Link href="/kurumsal#kvkk" className="hover:text-white transition-colors">
              KVKK & Gizlilik Politikası
            </Link>
            <Link href="/sirkuler" className="hover:text-white transition-colors">
              Gümrük Sirkülerleri
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
