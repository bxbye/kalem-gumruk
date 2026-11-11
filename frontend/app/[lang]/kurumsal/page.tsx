import type { Metadata } from "next";
import Link from "next/link";
import { Award, ShieldCheck, Clock, Users, FileDown, FileText } from "lucide-react";
import { translations, availableLanguages, Language } from "@/data/translations";
import { getSiteSettingsAsync } from "@/lib/settings";

export const dynamic = "force-dynamic";

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
  const t = translations[currentLang]?.corporatePage || translations.tr.corporatePage;

  return {
    title: `${t.title} | Kalem Gümrük Müşavirliği`,
    description: t.subtitle,
    alternates: {
      canonical: `/${currentLang}/kurumsal`,
      languages: {
        tr: "/tr/kurumsal",
        en: "/en/kurumsal",
        ar: "/ar/kurumsal",
        es: "/es/kurumsal",
        "x-default": "/tr/kurumsal",
      },
    },
    openGraph: {
      title: `${t.title} | Kalem Gümrük Müşavirliği`,
      description: t.subtitle,
      url: `https://kalemgumruk.com/${currentLang}/kurumsal`,
    },
  };
}

export default async function KurumsalPage({ params }: Props) {
  const { lang } = await params;
  const currentLang: Language =
    availableLanguages.find((l) => l.code === lang)?.code || "tr";
  const t = translations[currentLang]?.corporatePage || translations.tr.corporatePage;
  const siteSettings = await getSiteSettingsAsync();

  return (
    <div className="py-16 bg-slate-50 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
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

        {/* Hikayemiz & Vizyon */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-slate-200/80 space-y-8">
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-[#44B9CD]" />
              <span>{t.aboutTitle}</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {t.aboutP1}
            </p>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {t.aboutP2}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-[#1E2A3A]">{t.visionTitle}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {t.visionDesc}
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-[#1E2A3A]">{t.missionTitle}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {t.missionDesc}
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
            <h3 className="text-sm font-bold text-slate-900">{t.complianceTitle}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t.complianceDesc}
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#1E2A3A] text-[#44B9CD] flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">{t.speedTitle}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t.speedDesc}
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#1E2A3A] text-[#44B9CD] flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">{t.reportingTitle}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t.reportingDesc}
            </p>
          </div>
        </div>

        {/* KVKK / Veri Koruma Aydınlatma Metni */}
        <section
          id="kvkk"
          className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-xs space-y-6 scroll-mt-24"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
            <div className="space-y-1.5">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#0e7490] uppercase tracking-wider bg-[#44B9CD]/15 px-2.5 py-0.5 rounded-full">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>6698 Sayılı KVKK</span>
              </span>
              <h2 className="text-lg sm:text-xl font-extrabold text-[#1E2A3A]">
                {t.kvkkTitle}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {t.kvkkDesc}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <a
                href="/api/documents/kvkk-pdf"
                target="_blank"
                rel="noopener noreferrer"
                download="Kalem-Gumruk-KVKK-Aydinlatma-Metni.pdf"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#1E2A3A] hover:bg-slate-800 text-[#44B9CD] hover:text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
              >
                <FileDown className="w-4 h-4" />
                <span>
                  {currentLang === "en"
                    ? "Download KVKK PDF"
                    : currentLang === "ar"
                    ? "تحميل وثيقة KVKK (PDF)"
                    : currentLang === "es"
                    ? "Descargar PDF KVKK"
                    : "KVKK Metni (PDF İndir)"}
                </span>
              </a>
              <Link
                href={`/${currentLang}/belgeler`}
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
              >
                <FileText className="w-4 h-4 text-[#44B9CD]" />
                <span>
                  {currentLang === "en"
                    ? "All Documents"
                    : currentLang === "ar"
                    ? "جميع الوثائق"
                    : currentLang === "es"
                    ? "Documentos"
                    : "Belgeler Sayfası"}
                </span>
              </Link>
            </div>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200/80 border-l-4 border-l-[#44B9CD] rounded-r-xl text-xs text-slate-700 space-y-1">
            <div>
              <strong>Veri Sorumlusu:</strong> {siteSettings.name}
            </div>
            <div>
              <strong>Adres:</strong> {siteSettings.address}
            </div>
            <div>
              <strong>Telefon:</strong>{" "}
              <span dir="ltr">{siteSettings.phone}</span> &nbsp;|&nbsp;{" "}
              <strong>E-Posta:</strong>{" "}
              <a href={`mailto:${siteSettings.email}`} className="text-[#0e7490] hover:underline">
                {siteSettings.email}
              </a>
            </div>
          </div>

          <div className="space-y-5 text-xs sm:text-[13px] text-slate-600 leading-relaxed">
            <div className="space-y-1.5">
              <h3 className="text-sm font-bold text-[#1E2A3A]">1. İşlenen Kişisel Veriler ve Toplama Yöntemi</h3>
              <p>
                Web sitemizde yer alan iletişim, fiyat teklifi, kariyer/staj, değerlendirme ve dinamik formlar ile dijital asistan (chatbot), e-posta, telefon ve WhatsApp kanalları üzerinden elektronik ortamda; ad-soyad, telefon numarası, e-posta adresi, firma/kurum unvanı, sevkiyat ve GTİP bilgileri, yüklenen ticari belgeler (fatura, konşimento vb.) veya özgeçmiş (CV) dosyaları ile işlem güvenliği kayıtları (IP adresi, referans kodu ve onay zamanı) toplanmaktadır.
              </p>
            </div>

            <div className="space-y-1.5">
              <h3 className="text-sm font-bold text-[#1E2A3A]">2. Kişisel Verilerin İşlenme Amaçları ve Hukuki Sebepler</h3>
              <p>
                Kişisel verileriniz; gümrükleme, dış ticaret ve mevzuat danışmanlığı hizmetlerinin yürütülmesi, fiyat teklifi ve bilgi taleplerinin yanıtlanması, insan kaynakları başvurularının değerlendirilmesi, 4458 sayılı Gümrük Kanunu ile ilgili mevzuattan doğan yükümlülüklerin yerine getirilmesi ve bilgi güvenliğinin sağlanması amaçlarıyla; KVKK m. 5/2’de yer alan kanunlarda öngörülme, sözleşmenin kurulması/ifası, hukuki yükümlülük ve meşru menfaat sebeplerine dayanılarak; ayrıca müşteri değerlendirmesi yayını, İK havuzunda değerlendirme ve iletişime geçilmesi hallerinde <strong>açık rızanız</strong> kapsamında işlenmektedir.
              </p>
            </div>

            <div className="space-y-1.5">
              <h3 className="text-sm font-bold text-[#1E2A3A]">3. Kişisel Verilerin Aktarılması ve Güvenliği</h3>
              <p>
                Ticari sırlarınız ve kişisel verileriniz hiçbir koşulda üçüncü kişilere pazarlama amacıyla satılmaz veya devredilmez. Verileriniz yalnızca hizmetin ifası ve yasal zorunluluklar çerçevesinde T.C. Ticaret Bakanlığı, Gümrük Müdürlükleri, yetkili kamu kurumları, lojistik/antrepo iş ortakları ve hukuken yetkili mercilerle mevzuata uygun biçimde paylaşılabilir; 256-bit SSL şifreleme ve erişim kontrolü tedbirleriyle korunur.
              </p>
            </div>

            <div className="space-y-1.5">
              <h3 className="text-sm font-bold text-[#1E2A3A]">4. KVKK Madde 11 Kapsamındaki Haklarınız ve Başvuru</h3>
              <p>
                KVKK m. 11 uyarınca kişisel verilerinizin işlenip işlenmediğini öğrenme, bilgi talep etme, düzeltilmesini veya silinmesini/yok edilmesini isteme, aktarılan üçüncü kişileri bilme ve kanuna aykırı işleme nedeniyle zararın giderilmesini talep etme haklarına sahipsiniz. Taleplerinizi ıslak imzalı dilekçe ile{" "}
                <strong>{siteSettings.address}</strong> adresimize veya sistemimizde kayıtlı e-posta adresiniz üzerinden{" "}
                <a href={`mailto:${siteSettings.email}`} className="text-[#0e7490] font-semibold hover:underline">
                  {siteSettings.email}
                </a>{" "}
                adresine iletebilirsiniz; başvurularınız en geç 30 gün içinde ücretsiz sonuçlandırılır.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
