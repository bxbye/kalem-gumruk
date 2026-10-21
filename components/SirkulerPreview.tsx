import Link from "next/link";
import { getAllSirkuler } from "@/lib/sirkuler";
import { FileText, ArrowRight, Calendar, Tag } from "lucide-react";

export default function SirkulerPreview() {
  const allSirkuler = getAllSirkuler();
  const latestSirkuler = allSirkuler.slice(0, 3);

  return (
    <section className="py-20 bg-slate-50 border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs font-bold text-[#44B9CD] uppercase tracking-wider">
              Güncel Dış Ticaret Mevzuatı
            </span>
            <h2 className="text-3xl font-extrabold text-[#1E2A3A] sm:text-4xl mt-1">
              Gümrük Sirkülerleri & Tebliğler
            </h2>
            <p className="text-sm text-slate-600 mt-2 max-w-xl">
              Resmi Gazete&apos;de yayımlanan güncel gümrük tebliğleri, vergi değişiklikleri ve dış ticaret
              kararları hakkında müşavir yorumlarımız.
            </p>
          </div>

          <Link
            href="/sirkuler"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1E2A3A] hover:text-[#44B9CD] transition-colors"
          >
            <span>Tüm Sirkülerleri İncele ({allSirkuler.length})</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {latestSirkuler.map((item) => (
            <article
              key={item.id}
              className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 hover:shadow-md hover:border-[#44B9CD]/50 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span className="inline-flex items-center gap-1 text-[#44B9CD] font-semibold bg-[#44B9CD]/10 px-2 py-0.5 rounded-md">
                    <Tag className="w-3 h-3" />
                    {item.category}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(item.date).toLocaleDateString("tr-TR")}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 line-clamp-2 hover:text-[#44B9CD] transition-colors">
                  <Link href={`/sirkuler/${item.slug}`}>{item.title}</Link>
                </h3>

                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {item.summary || item.content.slice(0, 140) + "..."}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                <Link
                  href={`/sirkuler/${item.slug}`}
                  className="text-xs font-bold text-[#1E2A3A] hover:text-[#44B9CD] inline-flex items-center gap-1 transition-colors"
                >
                  <span>Mevzuatı Oku</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
