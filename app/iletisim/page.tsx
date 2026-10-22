import type { Metadata } from "next";
import { companyInfo } from "@/data/company";
import CustomsMultiStepForm from "@/components/CustomsMultiStepForm";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  ExternalLink,
  Navigation,
  Compass,
} from "lucide-react";

export const metadata: Metadata = {
  title: "İletişim & Ofisimiz | Kalem Gümrük Müşavirliği",
  description:
    "Kalem Gümrük Müşavirliği Ltd. Şti. merkez ofis adresi, telefon numarası, WhatsApp hattı ve Google Maps harita konumu. Ümraniye / İstanbul.",
};

export default function IletisimPage() {
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
            Bize Ulaşın
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1E2A3A]">
            İletişim & Merkez Ofisimiz
          </h1>
          <p className="text-sm text-slate-600 max-w-2xl mx-auto">
            Dış ticaret ve gümrükleme süreçleriniz için bize dilediğiniz zaman telefon, WhatsApp,
            e-posta veya Ümraniye merkez ofisimiz üzerinden ulaşabilirsiniz.
          </p>
        </div>

        {/* İletişim Kartları Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-7 rounded-2xl border border-slate-200/80 shadow-xs space-y-3 text-center sm:text-left">
            <div className="w-12 h-12 rounded-xl bg-[#1E2A3A] text-[#44B9CD] flex items-center justify-center mx-auto sm:mx-0">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Merkez Ofis Adresi</h3>
            <p className="text-xs text-slate-600 leading-relaxed">{companyInfo.address}</p>
          </div>

          <div className="bg-white p-7 rounded-2xl border border-slate-200/80 shadow-xs space-y-3 text-center sm:text-left">
            <div className="w-12 h-12 rounded-xl bg-[#1E2A3A] text-[#44B9CD] flex items-center justify-center mx-auto sm:mx-0">
              <Phone className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Telefon & WhatsApp</h3>
            <div className="text-xs space-y-1.5">
              <div>
                <a href={`tel:${companyInfo.phoneRaw}`} className="text-slate-900 font-bold hover:text-[#44B9CD]">
                  Tel: {companyInfo.phone}
                </a>
              </div>
              <div>
                <a
                  href={`https://wa.me/${companyInfo.whatsapp}?text=${encodeURIComponent(companyInfo.whatsappDefaultMessage)}`}
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
            <h3 className="text-sm font-bold text-slate-900">E-Posta & Mesai</h3>
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

        {/* Google Maps Harita Bölümü */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-[#44B9CD] uppercase tracking-wider">
                <Compass className="w-4 h-4" />
                <span>Google Harita Konumu</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900">
                Kalem Gümrük Müşavirliği — Ümraniye Merkez Ofis
              </h2>
              <p className="text-xs text-slate-500">
                Güler Han No:5 Kat:4, Gaffar Efendi Sokak, Alemdağ Caddesi, Atatürk Mahallesi, Ümraniye / İstanbul
              </p>
            </div>

            <a
              href={googleMapsSearchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#1E2A3A] hover:bg-[#2A3B50] text-[#44B9CD] hover:text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs shrink-0"
            >
              <Navigation className="w-4 h-4" />
              <span>Yol Tarifi Al (Google Maps)</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Harita Çerçevesi */}
          <div className="relative w-full h-[420px] rounded-2xl overflow-hidden border border-slate-200 shadow-inner bg-slate-100">
            <iframe
              title="Kalem Gümrük Müşavirliği Ofis Konumu"
              src={googleMapsEmbedUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full"
            ></iframe>
          </div>
        </div>

        {/* Teklif ve İletişim Formu */}
        <CustomsMultiStepForm />
      </div>
    </div>
  );
}
