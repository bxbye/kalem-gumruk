import type { Metadata } from "next";
import { companyInfo } from "@/data/company";
import { ShieldCheck, Award, Users, CheckCircle, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Kurumsal | 1997'den Bugüne Kalem Gümrük Müşavirliği",
  description:
    "1997 yılından bu yana dış ticaret ve gümrük müşavirliği alanında güven, hız ve etik ilkelerle hizmet veriyoruz. Kadromuz, vizyonumuz ve değerlerimiz.",
};

export default function KurumsalPage() {
  return (
    <div className="py-16 bg-slate-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Başlık */}
        <div className="text-center space-y-3">
          <span className="text-xs font-bold text-[#44B9CD] uppercase tracking-wider">
            Kurumsal Kimlik
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1E2A3A]">
            1997&apos;den Bugüne Güven ve Tecrübe
          </h1>
          <p className="text-sm text-slate-600 max-w-2xl mx-auto">
            Dış ticaretin kalbinde, mevzuatın güvencesinde çeyrek asrı aşkın süredir Türk sanayicisine
            ve ihracatçısına yol arkadaşlığı yapıyoruz.
          </p>
        </div>

        {/* Hikayemiz & Vizyon */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-slate-200/80 space-y-8">
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-[#44B9CD]" />
              <span>Hakkımızda</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              <strong>Kalem Gümrük Müşavirliği Ltd. Şti.</strong>, 1997 yılında kurulmuş olup,
              sektör fark etmeksizin tüm ithalatçı ve ihracatçı firmalara en hızlı, ekonomik ve
              yasal mevzuata %100 uyumlu gümrükleme hizmeti sunmayı ilke edinmiştir.
            </p>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Gümrükleme, dış ticaret işlemlerinin en kritik halkasıdır. Yanlış bir GTİP tespiti veya
              gecikmiş bir beyanname kapanışı, firmalar için telafisi zor cezalar ve yüksek ardiye
              maliyetleri doğurabilir. Kalem Gümrük olarak, A ve B karne yetkili müşavir kadromuz,
              güçlü saha operasyonumuz ve sektör standardı <strong>Evrim Web Gümrük</strong> dijital
              altyapımızla riskleri sıfıra indiriyoruz.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-[#1E2A3A]">Vizyonumuz</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Gelişen küresel ticaret kuralları ve dijitalleşen gümrük sistemlerinde en hızlı
                adapte olan, müşterilerine operasyonel hız ve hukuki güven sağlayan öncü müşavirlik
                kurumu olmak.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-[#1E2A3A]">Misyonumuz</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Müşterilerimizin dış ticaret maliyetlerini minimize ederken, 4458 sayılı Gümrük Kanunu
                ve ilgili tüm dış ticaret mevzuatına tam uyumu garanti altına almak.
              </p>
            </div>
          </div>
        </div>

        {/* Değerlerimiz */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#1E2A3A] text-[#44B9CD] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Mevzuata Tam Uyum</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Resmi Gazete ve Bakanlık tebliğlerini anlık takip eder, işlemlerinizi güncel hukuki
              zemin üzerinde hatasız yürütürüz.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#1E2A3A] text-[#44B9CD] flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Operasyonel Hız</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Ordino alımından intaç tesciline kadar her aşamayı dijital takip eder, liman ve ardiye
              beklemelerini minimuma indiririz.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#1E2A3A] text-[#44B9CD] flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Şeffaf Raporlama</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Evrim Web Gümrük portalımız ile beyanname durumu, vergi dekontları ve arşivinize 7/24
              erişim sağlarsınız.
            </p>
          </div>
        </div>

        {/* KVKK Bildirimi */}
        <div id="kvkk" className="bg-white rounded-2xl p-8 border border-slate-200/80 space-y-3">
          <h2 className="text-base font-bold text-slate-900">
            Kişisel Verilerin Korunması (KVKK) ve Gizlilik Taahhüdü
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Kalem Gümrük Müşavirliği Ltd. Şti. olarak, 6698 sayılı Kişisel Verilerin Korunması Kanunu
            kapsamında müşterilerimizin, iş ortaklarımızın ve web sitemizi ziyaret eden kullanıcılarımızın
            özel ticari sırlarını, ithalat/ihracat fatura ve beyanname verilerini en üst düzey güvenlik
            standartlarıyla koruruz. Web sitemiz üzerindeki iletişim ve teklif formları yalnızca hizmet
            sağlama amacıyla işlenmekte olup, üçüncü şahıslarla asla paylaşılmaz.
          </p>
        </div>
      </div>
    </div>
  );
}
