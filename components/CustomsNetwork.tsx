import { companyInfo } from "@/data/company";
import { MapPin, Navigation, ShieldCheck } from "lucide-react";

export default function CustomsNetwork() {
  return (
    <section className="py-20 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <span className="text-xs font-bold text-[#44B9CD] uppercase tracking-wider">
            Saha & Operasyon Gücümüz
          </span>
          <h2 className="text-3xl font-extrabold text-[#1E2A3A] sm:text-4xl">
            Aktif Çalıştığımız Gümrük ve Liman Ağı
          </h2>
          <p className="text-sm text-slate-600">
            İstanbul merkezli operasyon ofisimiz, hava gümrükleri, kara tescil merkezleri ve konteyner
            limanlarındaki yetkili müşavir kadromuzla sahadayız.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {companyInfo.activeCustoms.map((customs, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-[#44B9CD]/50 hover:bg-white hover:shadow-md transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-white group-hover:bg-[#1E2A3A] text-[#1E2A3A] group-hover:text-[#44B9CD] flex items-center justify-center border border-slate-200 group-hover:border-transparent transition-colors shadow-xs">
                  <Navigation className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 group-hover:text-[#44B9CD] transition-colors">
                    {customs.name}
                  </div>
                  <div className="text-[11px] text-slate-500">{customs.city}</div>
                </div>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            </div>
          ))}
        </div>

        <div className="mt-8 p-4 rounded-2xl bg-[#1E2A3A] text-white flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#44B9CD] shrink-0" />
            <span>
              Türkiye genelindeki tüm gümrük müdürlüklerinde tescil ve operasyon yetkisine sahibiz.
            </span>
          </div>
          <a
            href={`tel:${companyInfo.phoneRaw}`}
            className="text-[#44B9CD] hover:underline font-bold whitespace-nowrap"
          >
            Liman Temsilcimizle Görüşün: {companyInfo.phone} →
          </a>
        </div>
      </div>
    </section>
  );
}
