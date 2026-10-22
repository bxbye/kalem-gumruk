import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getAllSirkuler, getSirkulerBySlug } from "@/lib/sirkuler";
import { companyInfo } from "@/data/company";
import {
  Calendar,
  Tag,
  ArrowLeft,
  ExternalLink,
  MessageSquare,
  Phone,
  ShieldCheck,
  FileText,
  FileDown,
  Layers,
  BookOpen,
} from "lucide-react";

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
    title: `${item.title} | Gümrük Mevzuatı | Kalem Gümrük`,
    description: item.summary || item.content.slice(0, 160),
    authors: [{ name: item.author || "Kalem Gümrük Mevzuat Kurulu" }],
    keywords: [
      item.category,
      item.regulationType || "Gümrük Tebliği",
      item.relatedGtip || "Gümrük Mevzuatı",
      "ithalat vergisi",
      "gümrük müşavirliği",
    ],
    alternates: {
      canonical: `/sirkuler/${item.slug}`,
    },
    openGraph: {
      title: item.title,
      description: item.summary,
      url: `https://kalemgumruk.com/sirkuler/${item.slug}`,
      type: "article",
      publishedTime: item.date,
    },
  };
}

export default async function SirkulerDetailPage({ params }: Props) {
  const { slug } = await params;
  const item = getSirkulerBySlug(slug);

  if (!item) {
    notFound();
  }

  // Google News & Article JSON-LD Schema
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: item.title,
    description: item.summary,
    datePublished: item.date,
    dateModified: item.date,
    author: {
      "@type": "Organization",
      name: item.author || "Kalem Gümrük Mevzuat Kurulu",
      url: "https://kalemgumruk.com",
    },
    publisher: {
      "@type": "Organization",
      name: companyInfo.name,
      logo: {
        "@type": "ImageObject",
        url: "https://kalemgumruk.com/logo.svg",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://kalemgumruk.com/sirkuler/${item.slug}`,
    },
  };

  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Geri Dön Linki */}
        <Link
          href="/sirkuler"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-[#44B9CD] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Tüm Sirküler & Mevzuat Bültenine Dön</span>
        </Link>

        {/* Ana Makale Kartı */}
        <article className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-200/80 space-y-6">
          {/* Üst Meta Bilgileri */}
          <div className="space-y-3 border-b border-slate-100 pb-6">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              {item.regulationType && (
                <span className="font-bold bg-[#1E2A3A] text-white px-2.5 py-0.5 rounded-md">
                  {item.regulationType}
                </span>
              )}
              <span className="inline-flex items-center gap-1 text-[#44B9CD] font-bold bg-[#44B9CD]/10 px-2.5 py-0.5 rounded-md">
                <Tag className="w-3 h-3" />
                {item.category}
              </span>
              <span className="inline-flex items-center gap-1 text-slate-500">
                <Calendar className="w-3.5 h-3.5" />
                {new Date(item.date).toLocaleDateString("tr-TR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
              {item.officialGazetteNumber && (
                <span className="text-slate-400 font-mono text-[11px]">
                  • RG: {item.officialGazetteNumber}
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1E2A3A] leading-tight">
              {item.title}
            </h1>

            {/* İlgili GTİP Rozeti */}
            {item.relatedGtip && (
              <div className="inline-flex items-center gap-1.5 text-xs text-slate-600 bg-slate-100 px-3 py-1 rounded-lg font-medium">
                <Layers className="w-3.5 h-3.5 text-[#44B9CD]" />
                <span>İlgili Kapsam / GTİP: <strong>{item.relatedGtip}</strong></span>
              </div>
            )}
          </div>

          {/* Hap Özet */}
          {item.summary && (
            <div className="p-4 bg-slate-50 border-l-4 border-[#44B9CD] rounded-r-xl text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
              {item.summary}
            </div>
          )}

          {/* Tebliğ İçeriği */}
          <div className="text-slate-800 text-xs sm:text-sm leading-relaxed whitespace-pre-line font-normal space-y-4">
            {item.content}
          </div>

          {/* Kalem Gümrük Müşavirlik Uzman Notu */}
          {item.expertNote && (
            <div className="p-5 bg-blue-50 border border-blue-200 rounded-2xl space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-900">
                <ShieldCheck className="w-4 h-4 text-[#44B9CD]" />
                <span>Kalem Gümrük Müşavirlik Değerlendirmesi & Tavsiyesi:</span>
              </div>
              <p className="text-xs text-blue-800 leading-relaxed font-normal">
                {item.expertNote}
              </p>
            </div>
          )}

          {/* Kaynak & PDF Butonları */}
          <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-slate-100 text-xs">
            {item.sourceUrl && (
              <a
                href={item.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:text-[#44B9CD] hover:border-[#44B9CD] transition-colors"
              >
                <span>Resmi Gazete Kaynağı</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}

            {item.pdfUrl && (
              <a
                href={item.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
              >
                <FileDown className="w-3.5 h-3.5 text-[#44B9CD]" />
                <span>Tebliğ Metnini İndir (PDF)</span>
              </a>
            )}
          </div>

          {/* Doğrudan Müşavire Sor Kutusu */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="text-[11px] text-slate-500">Bu mevzuat ürünlerinizi veya verginizi etkiliyor mu?</div>
              <div className="text-xs sm:text-sm font-bold text-slate-900">
                Gümrük Müşavirimizden Ücretsiz Ön Değerlendirme Alın
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <a
                href={`tel:${companyInfo.phoneRaw}`}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#1E2A3A] text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-[#44B9CD]" />
                <span>{companyInfo.phone}</span>
              </a>
              <a
                href={`https://wa.me/${companyInfo.whatsapp}?text=${encodeURIComponent(
                  `Merhaba, "${item.title}" başlıklı mevzuat sirküleri hakkında danışmak istiyorum.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-500 transition-colors"
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
