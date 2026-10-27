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
  Mail,
  HelpCircle,
  Clock,
  Share2,
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
    ? "Back to All Circulars"
    : isAr
    ? "العودة إلى جميع التعاميم"
    : isEs
    ? "Volver a Todas las Circulares"
    : "Tüm Mevzuat ve Sirkülerlere Dön";

  const formattedDate = new Date(item.date).toLocaleDateString(
    isEn ? "en-US" : isAr ? "ar-EG" : isEs ? "es-ES" : "tr-TR",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  );

  // Okuma süresi hesaplama
  const fullText = `${item.title || ""} ${item.summary || ""} ${item.content || ""}`;
  const wordCount = fullText.trim().split(/\s+/).length;
  const readingTimeMins = Math.max(1, Math.ceil(wordCount / 160));

  // Uzman notu, genel bilgilendirme uyarısını tekrar etmiyorsa özel yorum kutusu olarak göster
  const isGenericDisclaimer =
    item.expertNote &&
    (item.expertNote.toLowerCase().includes("duyuru ve bilgilendirme") ||
      item.expertNote.toLowerCase().includes("genel duyuru") ||
      item.expertNote.toLowerCase().includes("bilgilendirme amaçlıdır"));

  const hasDistinctExpertNote = Boolean(item.expertNote && !isGenericDisclaimer);

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
    <div className="py-10 sm:py-16 bg-[#FBFBFA] min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-6">
        {/* Üst Gezinme Linki */}
        <div>
          <Link
            href={`/${lang}/sirkuler`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#0e7490] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{backLinkText}</span>
          </Link>
        </div>

        {/* Ana Makale (Blog Yazısı Formatı - Göz Yormayan Tipografi) */}
        <article className="bg-white rounded-3xl p-6 sm:p-12 border border-slate-200/70 shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-8">
          {/* 1. BAŞLIK & METADATA BÖLÜMÜ */}
          <header className="space-y-4 border-b border-slate-100 pb-6">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="font-bold text-[#0e7490] bg-[#44B9CD]/15 px-2.5 py-0.5 rounded-md text-[11px]">
                {item.category}
              </span>

              {item.regulationType && (
                <span className="font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md text-[11px]">
                  {item.regulationType}
                </span>
              )}

              {item.officialGazetteNumber && (
                <span className="text-slate-500 font-mono text-[11px] bg-slate-50 border border-slate-100 px-2 py-0.5 rounded">
                  Resmi Gazete: {item.officialGazetteNumber}
                </span>
              )}

              <span className="inline-flex items-center gap-1 text-slate-400 text-[11px] ml-auto">
                <Clock className="w-3 h-3" />
                <span>{readingTimeMins} {isEn ? "min read" : "dk okuma"}</span>
              </span>
            </div>

            {/* Konu / Başlık */}
            <h1 className="text-xl sm:text-2xl lg:text-[26px] font-bold text-slate-900 leading-snug tracking-tight">
              {item.title}
            </h1>

            {/* Yazar & Tarih Bilgisi */}
            <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-[#1E2A3A] text-white flex items-center justify-center font-bold text-[10px]">
                  KG
                </div>
                <div>
                  <span className="font-semibold text-slate-700 block text-xs">
                    {item.author || "Kalem Gümrük Mevzuat Kurulu"}
                  </span>
                  <span className="text-[11px] text-slate-400">{formattedDate}</span>
                </div>
              </div>

              {item.relatedGtip && (
                <div className="text-[11px] text-slate-500 bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-lg">
                  Kapsam: <strong>{item.relatedGtip}</strong>
                </div>
              )}
            </div>
          </header>

          {/* 2. HABER ÖZETİ (Vurgulu Lead Paragraf) */}
          {item.summary && (
            <div className="p-4 sm:p-5 bg-slate-50/80 border-l-4 border-[#44B9CD] rounded-r-2xl space-y-1">
              <span className="text-[11px] font-bold text-[#0e7490] uppercase tracking-wider block">
                {isEn ? "Executive Summary" : "Haber Özeti"}
              </span>
              <p className="text-sm sm:text-base text-slate-800 leading-relaxed font-normal">
                {item.summary}
              </p>
            </div>
          )}

          {/* 3. MEVZUAT METNİ & KARŞILAŞTIRMALI MADDELER (Rahat Okuma Tipografisi) */}
          <div className="text-slate-700 text-sm sm:text-[16px] leading-[1.85] font-normal whitespace-pre-wrap space-y-4 font-sans">
            {item.content}
          </div>

          {/* 4. ÖZEL MÜŞAVİR YORUMU (SADECE GERÇEKTEN FARKLI BİR MÜŞAVİR ANALİZİ VARSA GÖSTERİLİR) */}
          {hasDistinctExpertNote && (
            <div className="p-5 bg-cyan-50/60 border border-cyan-200/70 rounded-2xl space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#0e7490]">
                <ShieldCheck className="w-4 h-4 text-[#44B9CD]" />
                <span>
                  {isEn
                    ? "Customs Advisory Opinion & Evaluation:"
                    : "Kalem Gümrük Müşavirlik Uzman Değerlendirmesi:"}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {item.expertNote}
              </p>
            </div>
          )}

          {/* 5. RESMİ BELGE / PDF VE WEB KAYNAK BAĞLANTILARI */}
          {(item.pdfUrl || item.sourceUrl) && (
            <div className="pt-2 space-y-2.5">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                {isEn ? "Official Documents & Source" : "Resmi Belge ve Kaynaklar"}
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {item.pdfUrl && (
                  <a
                    href={item.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/90 text-slate-800 hover:text-[#0e7490] flex items-center gap-3 transition-colors group"
                  >
                    <div className="w-9 h-9 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                      <FileDown className="w-4 h-4" />
                    </div>
                    <div className="text-xs leading-snug">
                      <span className="font-bold block">Resmi Tebliğ Metni (PDF)</span>
                      <span className="text-[11px] text-slate-400 group-hover:underline">
                        Görüntülemek için tıklayınız ↗
                      </span>
                    </div>
                  </a>
                )}

                {item.sourceUrl && (
                  <a
                    href={item.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/90 text-slate-800 hover:text-[#0e7490] flex items-center gap-3 transition-colors group"
                  >
                    <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                      <ExternalLink className="w-4 h-4" />
                    </div>
                    <div className="text-xs leading-snug">
                      <span className="font-bold block">Resmi Gazete / Kaynak Linki</span>
                      <span className="text-[11px] text-slate-400 group-hover:underline">
                        Mevzuat sayfasına git ↗
                      </span>
                    </div>
                  </a>
                )}
              </div>
            </div>
          )}

          {/* 6. SAYGILARIMIZLA VE TEK BİLGİLENDİRME / DANIŞMANLIK DESTEK KUTUSU */}
          <footer className="space-y-5 pt-6 border-t border-slate-100">
            {/* İmza */}
            <div className="text-slate-800 space-y-0.5 text-xs sm:text-sm">
              <p className="text-slate-500 font-medium">
                {isEn ? "Sincerely," : "Saygılarımızla,"}
              </p>
              <p className="font-bold text-[#1E2A3A]">
                {item.author || "Kalem Gümrük Mevzuat Kurulu"}
              </p>
            </div>

            {/* TEK DANIŞMANLIK & DESTEK UYARI KUTUSU */}
            <div className="p-5 bg-amber-50/60 border border-amber-200/70 rounded-2xl space-y-3.5">
              <div className="flex items-start gap-2.5">
                <HelpCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h3 className="font-bold text-amber-900 text-xs sm:text-sm">
                    {isEn ? "Information Notice & Customs Advisory:" : "Bilgilendirme & Müşavirlik Desteği:"}
                  </h3>
                  <p className="text-xs text-amber-800/90 leading-relaxed font-normal">
                    {isEn
                      ? "This publication is for general informational and announcement purposes. To get detailed operational consultancy on how this legislation affects your company, tariff rates, and how to take action, please reach out to our expert team."
                      : "Bu mevzuat paylaşımı genel duyuru ve bilgilendirme amaçlıdır. Mevzuat hükümlerinin firmanızın ürünlerine (GTİP), vergi yükümlülüklerine ve gümrükleme operasyonlarınıza özel etkileri ile nasıl hareket edilmesi gerektiği konusunda detaylı destek ve profesyonel danışmanlık almak için bizimle iletişime geçebilirsiniz."}
                  </p>
                </div>
              </div>

              {/* Hızlı Destek Butonları */}
              <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-amber-200/50">
                <a
                  href={getWhatsAppUrl({
                    type: "circular",
                    lang,
                    serviceTitle: item.title,
                  })}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp ile Danışın</span>
                </a>

                <a
                  href={`tel:${companyInfo.phoneRaw}`}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#1E2A3A] hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all"
                >
                  <Phone className="w-3.5 h-3.5 text-[#44B9CD]" />
                  <span>Müşavirimizle Görüşün: {companyInfo.phone}</span>
                </a>

                <a
                  href={`mailto:${companyInfo.email}?subject=${encodeURIComponent(`Mevzuat Destek Talebi: ${item.title}`)}`}
                  className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold border border-amber-200 transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>{companyInfo.email}</span>
                </a>
              </div>
            </div>

            {/* Alt Gezinme Butonları */}
            <div className="pt-2 flex items-center justify-between">
              <Link
                href={`/${lang}/sirkuler`}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{backLinkText}</span>
              </Link>
            </div>
          </footer>
        </article>
      </div>
    </div>
  );
}
