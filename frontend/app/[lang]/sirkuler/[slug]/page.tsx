import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getAllSirkulerAsync, getSirkulerBySlugAsync } from "@/lib/sirkuler";
import { companyInfo } from "@/data/company";
import {
  Calendar,
  Tag,
  ArrowLeft,
  ExternalLink,
  MessageSquare,
  Phone,
  ShieldCheck,
  FileDown,
  Layers,
} from "lucide-react";
import { availableLanguages } from "@/data/translations";
import { getWhatsAppUrl } from "@/lib/whatsappMessages";

export const dynamic = "force-dynamic";
export const dynamicParams = true;

interface Props {
  params: Promise<{ slug: string; lang: string }>;
}

export async function generateStaticParams() {
  const items = await getAllSirkulerAsync("tr");
  const locales = availableLanguages.map((l) => l.code);
  const paramsList: { slug: string; lang: string }[] = [];
  for (const lang of locales) {
    for (const item of items) {
      paramsList.push({ lang, slug: item.slug });
    }
  }
  return paramsList;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, lang } = await params;
  const item = await getSirkulerBySlugAsync(slug, lang);
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
      canonical: `/${lang}/sirkuler/${item.slug}`,
      languages: {
        tr: `/tr/sirkuler/${item.slug}`,
        en: `/en/sirkuler/${item.slug}`,
        ar: `/ar/sirkuler/${item.slug}`,
        es: `/es/sirkuler/${item.slug}`,
        "x-default": `/tr/sirkuler/${item.slug}`,
      },
    },
    openGraph: {
      title: item.title,
      description: item.summary,
      url: `https://kalemgumruk.com/${lang}/sirkuler/${item.slug}`,
      type: "article",
      publishedTime: item.date,
    },
  };
}

export default async function SirkulerDetailPage({ params }: Props) {
  const { slug, lang } = await params;
  const item = await getSirkulerBySlugAsync(slug, lang);

  if (!item) {
    notFound();
  }

  const isEn = lang === "en";
  const isAr = lang === "ar";
  const isEs = lang === "es";

  const backLinkText = isEn
    ? "Back to All Circulars & Bulletins"
    : isAr
    ? "العودة إلى جميع التعاميم والقرارات"
    : isEs
    ? "Volver a Todas las Circulares y Boletines"
    : "Tüm Sirküler & Mevzuat Bültenine Dön";
  const advisorNoteTitle = isEn
    ? "Kalem Customs Advisory Opinion & Recommendation:"
    : isAr
    ? "رأي وتوصية مستشاري قلم للتخليص الجمركي:"
    : isEs
    ? "Opinión y Recomendación del Consejo Aduanero Kalem:"
    : "Kalem Gümrük Müşavirlik Değerlendirmesi & Tavsiyesi:";
  const officialSourceText = isEn
    ? "Official Gazette Source"
    : isAr
    ? "المصدر بالجريدة الرسمية"
    : isEs
    ? "Fuente del Boletín Oficial"
    : "Resmi Gazete Kaynağı";
  const downloadPdfText = isEn
    ? "Download PDF Communiqué"
    : isAr
    ? "تحميل نص القرار (PDF)"
    : isEs
    ? "Descargar Texto de la Disposición (PDF)"
    : "Tebliğ Metnini İndir (PDF)";
  const advisorPrompt = isEn
    ? "Does this legislation affect your import duties or shipments?"
    : isAr
    ? "هل تؤثر هذه التعديلات التشريعية على بضائعكم أو الرسوم الجمركية؟"
    : isEs
    ? "¿Afecta esta modificación arancelaria a sus mercancías?"
    : "Bu mevzuat ürünlerinizi veya verginizi etkiliyor mu?";
  const advisorBtn = isEn
    ? "Get Free Expert Assessment"
    : isAr
    ? "احصل على تقييم مجاني من مستشارنا"
    : isEs
    ? "Solicite Evaluación Gratuita de Nuestro Agente"
    : "Gümrük Müşavirimizden Ücretsiz Ön Değerlendirme Alın";

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
      "@id": `https://kalemgumruk.com/${lang}/sirkuler/${item.slug}`,
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
          href={`/${lang}/sirkuler`}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-[#44B9CD] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{backLinkText}</span>
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
                {new Date(item.date).toLocaleDateString(
                  isEn ? "en-US" : isAr ? "ar-EG" : isEs ? "es-ES" : "tr-TR",
                  {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  }
                )}
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
                <span>{advisorNoteTitle}</span>
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
                <span>{officialSourceText}</span>
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
                <span>{downloadPdfText}</span>
              </a>
            )}
          </div>

          {/* Doğrudan Müşavire Sor Kutusu */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="text-[11px] text-slate-500">{advisorPrompt}</div>
              <div className="text-xs sm:text-sm font-bold text-slate-900">
                {advisorBtn}
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <a
                href={`tel:${companyInfo.phoneRaw}`}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#1E2A3A] text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-[#44B9CD]" />
                <span dir="ltr">{companyInfo.phone}</span>
              </a>
              <a
                href={getWhatsAppUrl({
                  type: "circular",
                  lang,
                  serviceTitle: item.title,
                })}
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
