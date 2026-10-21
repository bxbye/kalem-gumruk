import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ChatBot from "@/components/ChatBot";
import { companyInfo } from "@/data/company";

export const metadata: Metadata = {
  title: {
    default: "Kalem Gümrük Müşavirliği | 1997'den Bugüne Güvenilir Dış Ticaret Çözümleri",
    template: "%s | Kalem Gümrük Müşavirliği",
  },
  description:
    "Kalem Gümrük Müşavirliği Ltd. Şti. — 1997 yılından bu yana İstanbul merkezli olarak ithalat, ihracat, antrepo, DİR ve gümrük danışmanlığı alanında A karne yetkili müşavir kadrosuyla hizmet vermektedir.",
  keywords: [
    "gümrük müşavirliği",
    "kalem gümrük",
    "istanbul gümrük müşaviri",
    "ümraniye gümrükleme",
    "ithalat gümrük işlemleri",
    "ihracat beyannamesi",
    "dahilde işleme rejimi",
    "evrim web gümrük",
    "erenköy gümrüğü",
    "muratbey gümrük müşaviri",
    "ambarli limanı gümrükleme",
    "dış ticaret danışmanlığı",
  ],
  authors: [{ name: "Kalem Gümrük Müşavirliği" }],
  creator: "Kalem Gümrük Müşavirliği",
  publisher: "Kalem Gümrük Müşavirliği",
  metadataBase: new URL("https://kalemgumruk.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Kalem Gümrük Müşavirliği | 25+ Yıllık Tecrübe",
    description:
      "A Karne yetkili gümrük müşavirlerimiz ve Evrim Web Gümrük altyapımızla dış ticaret operasyonlarınızı zamanında ve güvenle sonuçlandırıyoruz.",
    url: "https://kalemgumruk.com",
    siteName: "Kalem Gümrük Müşavirliği",
    locale: "tr_TR",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Schema.org Structured Data (Google Zengin Sonuçları için)
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "CustomsBrokerage",
    name: companyInfo.name,
    legalName: companyInfo.name,
    url: "https://kalemgumruk.com",
    logo: "https://kalemgumruk.com/logo.svg",
    description: companyInfo.description,
    foundingDate: "1997",
    telephone: companyInfo.phoneRaw,
    email: companyInfo.email,
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
      latitude: "41.025",
      longitude: "29.115",
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
    areaServed: {
      "@type": "Country",
      name: "Turkey",
    },
  };

  return (
    <html lang="tr">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-white text-slate-900 antialiased selection:bg-[#44B9CD] selection:text-white">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <ChatBot />
      </body>
    </html>
  );
}
