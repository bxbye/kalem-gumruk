import type { Metadata } from "next";
import GerekliBaglantilarSection from "@/components/GerekliBaglantilarSection";

export const metadata: Metadata = {
  title: "Müşavir Masası & Gerekli Bağlantılar | Kalem Gümrük Müşavirliği",
  description:
    "Kargo takip, liman konteyner sorgulama, GİB e-arşiv ve GTB resmi gümrükleme sistemlerine tek merkezden hızlı erişim portalı.",
};

export default function AraclarPage() {
  return (
    <div className="py-12 sm:py-16 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <GerekliBaglantilarSection />
      </div>
    </div>
  );
}
