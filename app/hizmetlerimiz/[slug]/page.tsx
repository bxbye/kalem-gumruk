import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { servicesData } from "@/data/services";
import { companyInfo } from "@/data/company";
import { CheckCircle2, ArrowLeft, Phone, MessageSquare, ShieldCheck } from "lucide-react";
import CustomsMultiStepForm from "@/components/CustomsMultiStepForm";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return servicesData.map((s) => ({
    slug: s.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = servicesData.find((s) => s.slug === slug);
  if (!service) return {};

  return {
    title: `${service.title} | Kalem Gümrük Müşavirliği`,
    description: service.shortDesc,
    alternates: {
      canonical: `/hizmetlerimiz/${service.slug}`,
    },
  };
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const service = servicesData.find((s) => s.slug === slug);

  if (!service) {
    notFound();
  }

  return (
    <div className="py-12 bg-slate-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Breadcrumb & Geri Dön */}
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Link href="/" className="hover:text-[#44B9CD]">
            Ana Sayfa
          </Link>
          <span>/</span>
          <span>Hizmetlerimiz</span>
          <span>/</span>
          <span className="text-slate-900 font-semibold">{service.title}</span>
        </div>

        {/* Başlık Kartı */}
        <div className="bg-[#1E2A3A] text-white rounded-3xl p-8 sm:p-12 space-y-4 shadow-lg">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[#44B9CD] uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>Kalem Gümrük Uzmanlık Alanı</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">{service.title}</h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
            {service.shortDesc}
          </p>
        </div>

        {/* Detaylı Açıklama & Hizmet Kapsamı */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-slate-200/80 space-y-8">
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900">Operasyonel Kapsam ve Süreçler</h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {service.detailedContent}
            </p>
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h3 className="text-sm font-bold text-[#1E2A3A]">
              Bu Hizmetimiz Kapsamında Yürüttüğümüz Başlıca İşlemler:
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
              <div className="text-xs text-slate-500 font-medium">Bu işlem için anında bilgi alın:</div>
              <div className="text-sm font-bold text-slate-900">
                Gümrük Müşavirimiz ile Doğrudan Görüşün
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
                  `Merhaba, ${service.title} hakkında detaylı bilgi ve teklif almak istiyorum.`
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
        </div>

        {/* Alt Form */}
        <CustomsMultiStepForm />
      </div>
    </div>
  );
}
