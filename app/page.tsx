import Hero from "@/components/Hero";
import StatsBar from "@/components/StatsBar";
import LinksCompactTicker from "@/components/LinksCompactTicker";
import ServicesCarousel from "@/components/ServicesCarousel";
import CircularsCarousel from "@/components/CircularsCarousel";
import Link from "next/link";
import { companyInfo } from "@/data/company";
import { getAllSirkuler } from "@/lib/sirkuler";
import { ArrowRight, MessageCircle } from "lucide-react";

export default function HomePage() {
  const allSirkuler = getAllSirkuler();

  return (
    <>
      {/* 1. Karşılama Alanı (Soluk Fotoğraf Arka Planlı & Karaca Tarzı Kayan Manşetli Hero + 5'li Hızlı Erişim Bandı) */}
      <Hero />

      {/* 2. Gerekli Bağlantılar ve Resmi Portallar (Kompakt Kayan Bant) */}
      <LinksCompactTicker />

      {/* 3. Kurumsal Güven İstatistikleri (1997, 25+ Yıl, %99.8 İntaç) */}
      <StatsBar />

      {/* 4. Başlıca Hizmetlerimiz (Otomatik Kayan ve Elle Kaydırılabilir Carousel) */}
      <ServicesCarousel />

      {/* 5. Güncel Mevzuat & Sirküler Bülteni (Otomatik Kayan ve Elle Kaydırılabilir Carousel) */}
      <CircularsCarousel items={allSirkuler} />

      {/* 6. Sade & Prestijli Eylem / İletişim Çağrısı */}
      <section className="py-14 bg-gradient-to-r from-[#1E2A3A] to-[#121B27] text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 text-center md:text-left">
            <span className="text-[11px] font-bold text-[#44B9CD] uppercase tracking-wider">
              Dış Ticarette Güvenilir Çözüm Ortağınız
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">
              Gümrükleme Operasyonunuz İçin Teklif Almaya Hazır mısınız?
            </h2>
            <p className="text-xs text-slate-300 max-w-xl">
              İthalat, ihracat ve antrepo süreçleriniz için 4 adımlı akıllı teklif formumuzu doldurabilir
              veya doğrudan nöbetçi gümrük müşavirimize WhatsApp üzerinden danışabilirsiniz.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/iletisim#teklif"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#44B9CD] hover:bg-[#2f9fb3] text-white text-xs font-bold transition-all shadow-md hover:scale-[1.02]"
            >
              <span>4 Adımda Teklif Al</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <a
              href={`https://wa.me/${companyInfo.whatsapp}?text=${encodeURIComponent(
                companyInfo.whatsappDefaultMessage
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
