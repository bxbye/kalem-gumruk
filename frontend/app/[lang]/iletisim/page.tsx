import type { Metadata } from "next";
import { companyInfo } from "@/data/company";
import ContactForm from "@/components/ContactForm";
import { MapPin, Phone, Mail, ExternalLink, Navigation } from "lucide-react";
import { translations, availableLanguages, Language } from "@/data/translations";
import { getWhatsAppUrl } from "@/lib/whatsappMessages";

export function generateStaticParams() {
  return availableLanguages.map((l) => ({ lang: l.code }));
}

interface Props {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const currentLang: Language =
    availableLanguages.find((l) => l.code === lang)?.code || "tr";
  const t = translations[currentLang]?.contactPage || translations.tr.contactPage;

  return {
    title: `${t.title} | Kalem Gümrük Müşavirliği`,
    description: t.subtitle,
    alternates: {
      canonical: `/${currentLang}/iletisim`,
      languages: {
        tr: "/tr/iletisim",
        en: "/en/iletisim",
        ar: "/ar/iletisim",
        es: "/es/iletisim",
        "x-default": "/tr/iletisim",
      },
    },
    openGraph: {
      title: `${t.title} | Kalem Gümrük Müşavirliği`,
      description: t.subtitle,
      url: `https://kalemgumruk.com/${currentLang}/iletisim`,
    },
  };
}

const BACKEND_INTERNAL_URL = process.env.BACKEND_INTERNAL_URL || "http://127.0.0.1:5001";

async function getContactFormData() {
  try {
    const res = await fetch(`${BACKEND_INTERNAL_URL}/api/forms/iletisim`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data?.success && data.form ? data.form : null;
  } catch (e) {
    console.error("[Contact Form Fetch Error]:", e);
    return null;
  }
}

export default async function IletisimPage({ params }: Props) {
  const { lang } = await params;
  const currentLang: Language =
    availableLanguages.find((l) => l.code === lang)?.code || "tr";
  const t = translations[currentLang]?.contactPage || translations.tr.contactPage;
  const contactForm = await getContactFormData();

  const googleMapsSearchUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    "Atatürk Mahallesi Gaffar Efendi Sokak No:5 Ümraniye İstanbul"
  )}`;

  const googleMapsEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(
    "Atatürk Mahallesi Gaffar Efendi Sokak No:5 Ümraniye İstanbul"
  )}&t=&z=16&ie=UTF8&iwloc=&output=embed`;

  return (
    <div className="py-16 bg-slate-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Başlık */}
        <div className="text-center space-y-3">
          <span className="text-xs font-bold text-[#44B9CD] uppercase tracking-wider">
            {t.badge}
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1E2A3A]">
            {t.title}
          </h1>
          <p className="text-sm text-slate-600 max-w-2xl mx-auto">
            {t.subtitle}
          </p>
        </div>

        {/* İletişim Kartları Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-7 rounded-2xl border border-slate-200/80 shadow-xs space-y-3 text-center sm:text-left">
            <div className="w-12 h-12 rounded-xl bg-[#1E2A3A] text-[#44B9CD] flex items-center justify-center mx-auto sm:mx-0">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">{t.addressTitle}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">{companyInfo.address}</p>
          </div>

          <div className="bg-white p-7 rounded-2xl border border-slate-200/80 shadow-xs space-y-3 text-center sm:text-left">
            <div className="w-12 h-12 rounded-xl bg-[#1E2A3A] text-[#44B9CD] flex items-center justify-center mx-auto sm:mx-0">
              <Phone className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">{t.phoneTitle}</h3>
            <div className="text-xs space-y-1.5">
              <div>
                <a href={`tel:${companyInfo.phoneRaw}`} className="text-slate-900 font-bold hover:text-[#44B9CD]">
                  Tel: {companyInfo.phone}
                </a>
              </div>
              <div>
                <a
                  href={getWhatsAppUrl({ type: "general", lang })}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-600 font-bold hover:text-emerald-500 inline-flex items-center gap-1"
                >
                  <span>WhatsApp: {companyInfo.phone}</span>
                </a>
              </div>
            </div>
          </div>

          <div className="bg-white p-7 rounded-2xl border border-slate-200/80 shadow-xs space-y-3 text-center sm:text-left">
            <div className="w-12 h-12 rounded-xl bg-[#1E2A3A] text-[#44B9CD] flex items-center justify-center mx-auto sm:mx-0">
              <Mail className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">{t.emailTitle}</h3>
            <div className="text-xs space-y-1 text-slate-600">
              <div>
                <a href={`mailto:${companyInfo.email}`} className="text-[#44B9CD] font-bold hover:underline">
                  {companyInfo.email}
                </a>
              </div>
              <div>{companyInfo.workingHours}</div>
            </div>
          </div>
        </div>

        {/* Harita Bölümü */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <Navigation className="w-5 h-5 text-[#44B9CD]" />
              <span>{t.mapTitle}</span>
            </h2>
            <a
              href={googleMapsSearchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs sm:text-sm text-[#44B9CD] hover:underline font-bold inline-flex items-center gap-1"
            >
              <span>{t.directionsBtn}</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          <div className="w-full h-80 sm:h-96 rounded-2xl overflow-hidden border border-slate-200 shadow-inner relative bg-slate-100">
            <iframe
              title="Kalem Gümrük Müşavirliği Merkez Ofis Konumu"
              src={googleMapsEmbedUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full grayscale-[20%] hover:grayscale-0 transition-all duration-300"
            />
          </div>
        </div>

        {/* İletişim Formu (Veritabanı Dinamik Formu) */}
        <div>
          <ContactForm initialForm={contactForm} />
        </div>
      </div>
    </div>
  );
}
