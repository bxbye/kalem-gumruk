import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getAllSirkuler, getSirkulerBySlug } from "@/lib/sirkuler";
import { companyInfo } from "@/data/company";
import { Calendar, Tag, ArrowLeft, ExternalLink, MessageSquare, Phone } from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const items = getAllSirkuler();
  return items.map((item) => ({
    slug: item.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = getSirkulerBySlug(slug);
  if (!item) return {};

  return {
    title: `${item.title} | Kalem Gümrük Sirküler`,
    description: item.summary || item.content.slice(0, 160),
    alternates: {
      canonical: `/sirkuler/${item.slug}`,
    },
  };
}

export default async function SirkulerDetailPage({ params }: Props) {
  const { slug } = await params;
  const item = getSirkulerBySlug(slug);

  if (!item) {
    notFound();
  }

  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Geri Dön Linki */}
        <Link
          href="/sirkuler"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-[#44B9CD] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Tüm Sirkülerlere Dön</span>
        </Link>

        {/* Ana Makale Kartı */}
        <article className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-slate-200/80 space-y-6">
          <div className="space-y-3 border-b border-slate-100 pb-6">
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

            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1E2A3A] leading-tight">
              {item.title}
            </h1>
          </div>

          {/* İçerik */}
          <div className="text-slate-800 text-sm sm:text-base leading-relaxed whitespace-pre-line space-y-4 font-normal">
            {item.content}
          </div>

          {/* Kaynak Linki Varsa */}
          {item.sourceUrl && (
            <div className="pt-4 border-t border-slate-100">
              <a
                href={item.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#44B9CD] hover:underline"
              >
                <span>Resmi Kaynak / Dayanak Belgesi</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}

          {/* Müşavirlik Danışma Kutusu */}
          <div className="mt-8 p-6 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="text-xs text-slate-500 font-medium">Bu mevzuat ürünlerinizi nasıl etkiliyor?</div>
              <div className="text-sm font-bold text-slate-900">
                GTİP Bazlı Özel Değerlendirme Talep Edin
              </div>
            </div>
            <div className="flex items-center gap-3">
              <a
                href={`tel:${companyInfo.phoneRaw}`}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-[#1E2A3A] text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-[#44B9CD]" />
                <span>{companyInfo.phone}</span>
              </a>
              <a
                href={`https://wa.me/${companyInfo.whatsapp}?text=${encodeURIComponent(
                  `Merhaba, "${item.title}" başlıklı sirküler hakkında bilgi almak istiyorum.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-4 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-500 transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
