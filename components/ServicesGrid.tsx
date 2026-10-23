import Link from "next/link";
import { servicesData } from "@/data/services";
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  Repeat,
  RefreshCw,
  Warehouse,
  Truck,
  Building2,
  Briefcase,
  Scale,
  Shield,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

const iconMap: Record<string, React.ReactNode> = {
  ArrowDownToLine: <ArrowDownToLine className="w-6 h-6" />,
  ArrowUpFromLine: <ArrowUpFromLine className="w-6 h-6" />,
  Repeat: <Repeat className="w-6 h-6" />,
  RefreshCw: <RefreshCw className="w-6 h-6" />,
  Warehouse: <Warehouse className="w-6 h-6" />,
  Truck: <Truck className="w-6 h-6" />,
  Building2: <Building2 className="w-6 h-6" />,
  Briefcase: <Briefcase className="w-6 h-6" />,
  Scale: <Scale className="w-6 h-6" />,
  Shield: <Shield className="w-6 h-6" />,
};

export default function ServicesGrid() {
  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-[#44B9CD]">
            Uzmanlık Alanlarımız
          </div>
          <h2 className="text-3xl font-extrabold text-[#1E2A3A] sm:text-4xl">
            Kapsamlı Gümrükleme &amp; Dış Ticaret Hizmetleri
          </h2>
          <p className="text-sm text-slate-600">
            Tüm gümrük rejimlerinde A Karne yetkili gümrük müşavirlerimiz ve mevzuat uzmanlarımızla
            operasyonlarınızı uçtan uca yönetiyoruz.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {servicesData.map((service, index) => (
            <div
              key={service.slug}
              className="bg-white rounded-3xl p-7 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-200/80 flex flex-col justify-between group hover:-translate-y-1"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-[#1E2A3A] text-[#44B9CD] flex items-center justify-center group-hover:scale-110 transition-transform">
                    {iconMap[service.iconName] || <Briefcase className="w-6 h-6" />}
                  </div>
                  <span className="text-lg font-black text-slate-200">
                    {index + 1 < 10 ? `0${index + 1}` : index + 1}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#44B9CD] transition-colors">
                  {service.title}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {service.shortDesc}
                </p>

                <div className="space-y-2 pt-2 border-t border-slate-100">
                  {service.features.slice(0, 3).map((feat, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#44B9CD] shrink-0 mt-0.5" />
                      <span className="line-clamp-1">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 mt-4 border-t border-slate-100">
                <Link
                  href={`/hizmetlerimiz/${service.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1E2A3A] group-hover:text-[#44B9CD] transition-colors"
                >
                  <span>Detaylı İncele</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
