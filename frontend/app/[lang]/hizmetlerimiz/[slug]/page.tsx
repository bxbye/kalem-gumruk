import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getServiceBySlugAsync, getAllServices } from "@/lib/services";
import { companyInfo } from "@/data/company";
import { CheckCircle2, Phone, MessageSquare, ShieldCheck, FileText } from "lucide-react";
import { availableLanguages } from "@/data/translations";
import { getWhatsAppUrl } from "@/lib/whatsappMessages";

interface Props {
  params: Promise<{ slug: string; lang: string }>;
}

export function generateStaticParams() {
  const services = getAllServices("tr");
  const locales = availableLanguages.map((l) => l.code);
  const paramsList: { slug: string; lang: string }[] = [];
  for (const lang of locales) {
    for (const s of services) {
      paramsList.push({ lang, slug: s.slug });
    }
  }
  return paramsList;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, lang } = await params;
  const service = await getServiceBySlugAsync(slug, lang);
  if (!service) return {};

  return {
    title: `${service.title} | Kalem Gümrük Müşavirliği`,
    description: service.shortDesc,
    keywords: [
      service.title.toLowerCase(),
      "gümrük müşavirliği",
      "customs brokerage turkey",
      "istanbul gümrükleme",
      "ithalat ihracat operasyonları",
      "kalem gümrük",
    ],
    alternates: {
      canonical: `/${lang}/hizmetlerimiz/${service.slug}`,
      languages: {
        tr: `/tr/hizmetlerimiz/${service.slug}`,
        en: `/en/hizmetlerimiz/${service.slug}`,
        ar: `/ar/hizmetlerimiz/${service.slug}`,
        es: `/es/hizmetlerimiz/${service.slug}`,
        "x-default": `/tr/hizmetlerimiz/${service.slug}`,
      },
    },
    openGraph: {
      title: `${service.title} | Kalem Gümrük Müşavirliği`,
      description: service.shortDesc,
      url: `https://kalemgumruk.com/${lang}/hizmetlerimiz/${service.slug}`,
      type: "article",
    },
  };
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug, lang } = await params;
  const service = await getServiceBySlugAsync(slug, lang);

  if (!service) {
    notFound();
  }

  const isEn = lang === "en";
  const isAr = lang === "ar";
  const isEs = lang === "es";

  const breadcrumbHome = isEn ? "Home" : isAr ? "الرئيسية" : isEs ? "Inicio" : "Ana Sayfa";
  const breadcrumbServices = isEn ? "Services" : isAr ? "خدماتنا" : isEs ? "Servicios" : "Hizmetlerimiz";
  const badgeText = isEn
    ? "Kalem Customs Area of Expertise"
    : isAr
    ? "مجال اختصاص قلم للتخليص الجمركي"
    : isEs
    ? "Área de Especialidad de Kalem Aduanas"
    : "Kalem Gümrük Uzmanlık Alanı";
  const scopeTitle = isEn
    ? "Operational Scope & Procedures"
    : isAr
    ? "النطاق التشغيلي والإجراءات"
    : isEs
    ? "Alcance Operativo y Procedimientos"
    : "Operasyonel Kapsam ve Süreçler";
  const featuresTitle = isEn
    ? "Key Procedures Executed Under This Service:"
    : isAr
    ? "أبرز المعاملات التي ننجزها ضمن هذه الخدمة:"
    : isEs
    ? "Principales Operaciones Gestionadas en este Régimen:"
    : "Bu Hizmetimiz Kapsamında Yürüttüğümüz Başlıca İşlemler:";
  const consultantPrompt = isEn
    ? "Get immediate advice for this procedure:"
    : isAr
    ? "احصل على استشارة فورية لهذه المعاملة:"
    : isEs
    ? "Obtenga asesoramiento inmediato para este trámite:"
    : "Bu işlem için anında bilgi alın:";
  const consultantBtn = isEn
    ? "Speak Directly with Our Customs Broker"
    : isAr
    ? "تواصل مباشرة مع المستشار الجمركي"
    : isEs
    ? "Consulte Directamente con Nuestro Agente de Aduanas"
    : "Gümrük Müşavirimiz ile Doğrudan Görüşün";
  const quoteBtnText = isEn
    ? "Request a Quote"
    : isAr
    ? "طلب عرض سعر"
    : isEs
    ? "Solicitar Cotización"
    : "Fiyat Teklifi Al";

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: breadcrumbHome,
        item: `https://kalemgumruk.com/${lang}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: breadcrumbServices,
        item: `https://kalemgumruk.com/${lang}/hizmetlerimiz`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: service.title,
        item: `https://kalemgumruk.com/${lang}/hizmetlerimiz/${service.slug}`,
      },
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.detailedContent || service.shortDesc,
    provider: {
      "@type": "LocalBusiness",
      name: companyInfo.name,
      url: "https://kalemgumruk.com",
      telephone: companyInfo.phoneRaw,
      address: {
        "@type": "PostalAddress",
        addressLocality: "Ümraniye",
        addressRegion: "İstanbul",
        addressCountry: "TR",
      },
    },
    areaServed: {
      "@type": "Country",
      name: "Turkey",
    },
    serviceType: "Gümrük Müşavirliği",
    url: `https://kalemgumruk.com/${lang}/hizmetlerimiz/${service.slug}`,
  };

  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Breadcrumb & Geri Dön */}
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Link href={`/${lang}`} className="hover:text-[#44B9CD] transition-colors">
            {breadcrumbHome}
          </Link>
          <span>/</span>
          <Link href={`/${lang}/hizmetlerimiz`} className="hover:text-[#44B9CD] transition-colors">
            {breadcrumbServices}
          </Link>
          <span>/</span>
          <span className="text-slate-900 font-semibold">{service.title}</span>
        </div>

        {/* Başlık Kartı */}
        <div className="bg-[#1E2A3A] text-white rounded-3xl p-8 sm:p-12 space-y-4 shadow-lg">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[#44B9CD] uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>{badgeText}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">{service.title}</h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
            {service.shortDesc}
          </p>
        </div>

        {/* Detaylı Açıklama & Hizmet Kapsamı */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-slate-200/80 space-y-8">
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900">{scopeTitle}</h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {service.detailedContent}
            </p>
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h3 className="text-sm font-bold text-[#1E2A3A]">
              {featuresTitle}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {service.features.map((feat, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/60 text-xs text-slate-800"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#44B9CD] shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Müşavir İletişim Kutusu */}
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="text-xs text-slate-500 font-medium">{consultantPrompt}</div>
              <div className="text-sm font-bold text-slate-900">
                {consultantBtn}
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2.5">
              <Link
                href={`/${lang}/hizmetlerimiz?service=${service.slug}#randevu-teklif`}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-[#44B9CD] hover:bg-[#3597a8] text-white rounded-xl text-xs font-bold transition-all shadow-sm"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>{quoteBtnText}</span>
              </Link>
              <a
                href={getWhatsAppUrl({
                  type: "service",
                  lang,
                  serviceTitle: service.title,
                })}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </a>
              <a
                href={`tel:${companyInfo.phoneRaw}`}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-[#1E2A3A] hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-[#44B9CD]" />
                <span dir="ltr">{companyInfo.phone}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
