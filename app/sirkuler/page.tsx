import type { Metadata } from "next";
import Link from "next/link";
import { getAllSirkuler } from "@/lib/sirkuler";
import { Calendar, Tag, ArrowRight, FileText } from "lucide-react";

export const metadata: Metadata = {
  title: "Gümrük Mevzuatı & Sirkülerler | Kalem Gümrük Müşavirliği",
  description:
    "Resmi Gazete'de yayımlanan güncel gümrük tebliğleri, vergi değişiklikleri, dahilde işleme genelgeleri ve dış ticaret mevzuat duyuruları.",
};

export default function SirkulerPage() {
  const items = getAllSirkuler();

  return (
    <div className="py-16 bg-slate-50 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Başlık */}
        <div className="text-center space-y-3">
          <span className="text-xs font-bold text-[#44B9CD] uppercase tracking-wider">
            Bilgi Merkezi
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1E2A3A]">
            Gümrük Mevzuatı & Sirkülerler
          </h1>
          <p className="text-sm text-slate-600 max-w-2xl mx-auto">
            İthalat, ihracat, gümrük vergileri ve dış ticaret mevzuatındaki en son yasal düzenlemeler
            hakkında müşavirlik bilgilendirmeleri.
          </p>
        </div>

        {/* Sirküler Listesi */}
        <div className="space-y-4">
          {items.map((item) => (
            <article
              key={item.id}
              className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200/80 hover:shadow-md hover:border-[#44B9CD]/50 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
            >
              <div className="space-y-2.5 max-w-2xl">
                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span className="inline-flex items-center gap-1 text-[#44B9CD] font-bold bg-[#44B9CD]/10 px-2.5 py-0.5 rounded-full">
                    <Tag className="w-3 h-3" />
                    {item.category}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(item.date).toLocaleDateString("tr-TR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>

                <h2 className="text-base sm:text-lg font-bold text-slate-900 hover:text-[#44B9CD] transition-colors">
                  <Link href={`/sirkuler/${item.slug}`}>{item.title}</Link>
                </h2>

                <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed">
                  {item.summary || item.content.slice(0, 160) + "..."}
                </p>
              </div>

              <Link
                href={`/sirkuler/${item.slug}`}
                className="shrink-0 flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-[#1E2A3A] text-slate-700 hover:text-white rounded-xl text-xs font-bold transition-all"
              >
                <span>Detayını Oku</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
