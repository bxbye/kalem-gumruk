import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ChatBot from "@/components/ChatBot";
import { companyInfo } from "@/data/company";
import { LanguageProvider } from "@/context/LanguageContext";

export const metadata: Metadata = {
  title: {
    default: "Kalem Gümrük Müşavirliği | Güvenilir Dış Ticaret Çözümleri",
    template: "%s | Kalem Gümrük Müşavirliği",
  },
  description:
    "Kalem Gümrük Müşavirliği Ltd. Şti. — 25 yılı aşkın sektörel tecrübemiz ve uzman ekibimizle ithalat, ihracat, antrepo, DİR ve gümrük danışmanlığı alanında yetkili gümrük müşavirliği güvencesiyle hizmet vermektedir.",
  keywords: [
    "gümrük müşavirliği",
    "kalem gümrük",
    "istanbul gümrük müşaviri",
    "ümraniye gümrükleme",
    "erenköy gümrüğü gümrük müşaviri",
    "muratbey gümrük müşaviri",
    "ambarli limanı gümrükleme",
    "ithalat gümrük işlemleri",
    "ihracat beyannamesi",
    "dahilde işleme rejimi",
    "evrim web gümrük",
    "dış ticaret danışmanlığı",
  ],
  authors: [{ name: "Kalem Gümrük Müşavirliği" }],
  creator: "Kalem Gümrük Müşavirliği",
  publisher: "Kalem Gümrük Müşavirliği",
  metadataBase: new URL("https://kalemgumruk.com"),
  alternates: {
    canonical: "/tr",
    languages: {
      "tr": "/tr",
      "en": "/en",
      "ar": "/ar",
      "es": "/es",
      "x-default": "/tr",
    },
  },
  openGraph: {
    title: "Kalem Gümrük Müşavirliği | 25+ Yıllık Tecrübe",
    description:
      "Yetkili gümrük müşavirliği güvencemiz ve Evrim Web Gümrük altyapımızla dış ticaret operasyonlarınızı zamanında ve güvenle sonuçlandırıyoruz.",
    url: "https://kalemgumruk.com",
    siteName: "Kalem Gümrük Müşavirliği",
    locale: "tr_TR",
    alternateLocale: ["en_US", "ar_SA", "es_ES"],
    type: "website",
    images: [
      {
        url: "/kalem-gumruk-hero.jpg",
        width: 1200,
        height: 630,
        alt: "Kalem Gümrük Müşavirliği İstanbul Merkez ve Saha Operasyonları",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kalem Gümrük Müşavirliği | Güvenilir Dış Ticaret Çözümleri",
    description:
      "Yetkili gümrük müşavirliği güvencemiz ve dijital takip altyapımızla dış ticaret operasyonlarınızı yönetiyoruz.",
    images: ["/kalem-gumruk-hero.jpg"],
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/logo-mobile.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/logo-mobile.svg" },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Schema.org Structured Data (Google Zengin Sonuçları için çoklu şema)
  const schemaData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["ProfessionalService", "LocalBusiness"],
        "@id": "https://kalemgumruk.com/#organization",
        name: companyInfo.name,
        alternateName: ["Kalem Gümrük", "Kalem Gümrük Müşavirliği"],
        url: "https://kalemgumruk.com",
        logo: {
          "@type": "ImageObject",
          url: "https://kalemgumruk.com/logo.svg",
        },
        image: "https://kalemgumruk.com/kalem-gumruk-hero.jpg",
        description: companyInfo.description,
        telephone: companyInfo.phoneRaw,
        email: companyInfo.email,
        priceRange: "$$",
        currenciesAccepted: "TRY, USD, EUR",
        paymentAccepted: "Banka Havalesi, Nakit",
        address: {
          "@type": "PostalAddress",
          streetAddress: "Atatürk Mah. Alemdağ Cad. Gaffar Efendi Sok. Güler Han No:5 K:4",
          addressLocality: "Ümraniye",
          addressRegion: "İstanbul",
          postalCode: "34764",
          addressCountry: "TR",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: 41.025,
          longitude: 29.115,
        },
        openingHoursSpecification: [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
            opens: "08:30",
            closes: "18:00",
          },
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: "Saturday",
            opens: "09:00",
            closes: "13:00",
          },
        ],
        areaServed: [
          { "@type": "City", name: "İstanbul" },
          { "@type": "City", name: "Kocaeli" },
          { "@type": "City", name: "Bursa" },
          { "@type": "Country", name: "Turkey" },
        ],
        knowsAbout: [
          "İthalat Gümrükleme",
          "İhracat Gümrükleme",
          "Dahilde İşleme Rejimi (DİR)",
          "Antrepo Rejimi",
          "GTİP Tespiti",
          "Gümrük Danışmanlığı",
          "Transit Rejimi",
        ],
      },
      {
        "@type": "WebSite",
        "@id": "https://kalemgumruk.com/#website",
        url: "https://kalemgumruk.com",
        name: "Kalem Gümrük Müşavirliği",
        publisher: {
          "@id": "https://kalemgumruk.com/#organization",
        },
        inLanguage: "tr",
      },
    ],
  };

  return (
    <html lang="tr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
        />
      </head>
      <body className="font-sans min-h-screen flex flex-col bg-white text-slate-900 antialiased selection:bg-[#44B9CD] selection:text-white">
        <LanguageProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <ChatBot />
        </LanguageProvider>
      </body>
    </html>
  );
}
