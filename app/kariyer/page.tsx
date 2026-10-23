"use client";

import { useState } from "react";
import { companyInfo } from "@/data/company";
import {
  Briefcase,
  Users,
  GraduationCap,
  ArrowRight,
  Mail,
  FileText,
  Upload,
  CheckCircle2,
} from "lucide-react";
import DynamicForm from "@/components/DynamicForm";

export default function KariyerPage() {
  const [selectedPosition, setSelectedPosition] = useState<string | null>(null);

  const openPositions = [
    {
      title: "Gümrük Müşavir Yardımcısı (B Karne)",
      location: "Erenköy / Muratbey / Ambarlı",
      type: "Tam Zamanlı",
      desc: "Gümrük beyannamelerinin tescili, muayene takibi ve saha operasyonlarında en az 2 yıl deneyimli çalışma arkadaşı arıyoruz.",
    },
    {
      title: "Müşteri Temsilcisi & Operasyon Uzmanı",
      location: "Ümraniye Merkez Ofis",
      type: "Tam Zamanlı",
      desc: "İthalat veya ihracat dosyalarının evrak takibi, Evrim yazılımı kullanımı ve müşteri koordinasyonunda deneyimli.",
    },
    {
      title: "Dış Ticaret & Gümrük Stajyeri",
      location: "Ümraniye Merkez Ofis",
      type: "Stajyer / Yarı Zamanlı",
      desc: "Üniversitelerin Dış Ticaret, Lojistik veya Uluslararası Ticaret bölümlerinde okuyan, kariyer hedefi olan genç yetenekler.",
    },
  ];

  const handleApplyClick = (posTitle: string) => {
    setSelectedPosition(posTitle);
    const formElement = document.getElementById("basvuru-formu");
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="py-16 bg-slate-50 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Başlık */}
        <div className="text-center space-y-3">
          <span className="text-xs font-bold text-[#44B9CD] uppercase tracking-wider">
            İnsan Kaynakları & Kariyer
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1E2A3A]">
            Kalem Gümrük Ailesine Katılın
          </h1>
          <p className="text-sm text-slate-600 max-w-2xl mx-auto">
            1997 yılından bu yana büyüyen ekibimizle; etik değerlere bağlı, sürekli gelişime açık
            ve dinamik çalışma arkadaşlarını bünyemize katmaktan gurur duyuyoruz.
          </p>
        </div>

        {/* Neden Kalem Gümrük? */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-7 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#1E2A3A] text-[#44B9CD] flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Güçlü Kurumsal Kültür</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Çeyrek asırlık tecrübemiz ve karşılıklı saygıya dayalı çalışma ortamımızla uzun vadeli
              kariyer imkanı sunuyoruz.
            </p>
          </div>

          <div className="bg-white p-7 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#1E2A3A] text-[#44B9CD] flex items-center justify-center">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Mevzuat Eğitimi & Gelişim</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Müşavirlerimiz tarafından verilen kurum içi gümrük mevzuatı eğitimleriyle mesleki
              yetkinliklerinizi daima güncel tutuyoruz.
            </p>
          </div>

          <div className="bg-white p-7 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#1E2A3A] text-[#44B9CD] flex items-center justify-center">
              <Briefcase className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Modern Dijital Altyapı</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Sektör standardı Evrim Web Gümrük ve modern bulut operasyon araçlarıyla hızlı ve
              verimli çalışma imkanı sağlıyoruz.
            </p>
          </div>
        </div>

        {/* Açık Pozisyonlar */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-[#1E2A3A]">Açık Pozisyonlarımız</h2>
            <span className="text-xs text-slate-500">Doğrudan CV yükleyerek başvurun</span>
          </div>

          <div className="space-y-3">
            {openPositions.map((pos, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-[#44B9CD]/50 transition-all"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900">{pos.title}</h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {pos.type}
                    </span>
                  </div>
                  <div className="text-xs text-[#44B9CD] font-medium">{pos.location}</div>
                  <p className="text-xs text-slate-600 max-w-2xl">{pos.desc}</p>
                </div>

                <button
                  type="button"
                  onClick={() => handleApplyClick(pos.title)}
                  className="shrink-0 flex items-center gap-1.5 px-5 py-2.5 bg-[#1E2A3A] hover:bg-[#2A3B50] text-[#44B9CD] hover:text-white rounded-xl text-xs font-bold transition-all shadow-xs"
                >
                  <span>Online Başvur</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Başvuru & CV Yükleme Formu */}
        <div id="basvuru-formu" className="pt-6">
          <div className="max-w-2xl mx-auto">
            <DynamicForm
              slug="kariyer-staj"
              titleOverride={
                selectedPosition
                  ? `"${selectedPosition}" Başvurusu`
                  : "İş & Staj Başvuru Formu"
              }
              descOverride="Özgeçmişinizi (CV) PDF veya Word formatında yükleyerek İnsan Kaynakları havuzumuza dahil olabilirsiniz."
              initialValues={
                selectedPosition ? { applicationType: selectedPosition } : {}
              }
              className="shadow-sm border-slate-200"
            />
          </div>
        </div>

        {/* Genel İletişim Bilgisi */}
        <div className="bg-[#1E2A3A] text-white rounded-3xl p-8 sm:p-10 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <h3 className="text-lg font-bold">Sorularınız mı Var?</h3>
            <p className="text-xs text-slate-300 max-w-xl">
              Staj protokolleri veya genel kariyer süreçleri hakkında İnsan Kaynakları departmanımıza
              e-posta yoluyla da ulaşabilirsiniz.
            </p>
          </div>

          <a
            href={`mailto:${companyInfo.email}?subject=${encodeURIComponent(
              "Kariyer Süreçleri Hakkında Bilgi Talebi"
            )}`}
            className="shrink-0 flex items-center gap-2 bg-[#44B9CD] hover:bg-[#2f9fb3] text-white font-bold px-6 py-3 rounded-xl text-xs transition-all shadow"
          >
            <Mail className="w-4 h-4" />
            <span>{companyInfo.email}</span>
          </a>
        </div>
      </div>
    </div>
  );
}
