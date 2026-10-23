import Hero from "@/components/Hero";
import StatsBar from "@/components/StatsBar";
import LinksCompactTicker from "@/components/LinksCompactTicker";
import ServicesCarousel from "@/components/ServicesCarousel";
import CircularsCarousel from "@/components/CircularsCarousel";
import ReferencesSection from "@/components/ReferencesSection";
import { getAllSirkuler } from "@/lib/sirkuler";

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

      {/* 6. Referanslarımız (Küçük Müşteri Logoları - Periyodik Değişen Slider) */}
      <ReferencesSection />
    </>
  );
}
