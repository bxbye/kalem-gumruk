"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Lock,
  FileText,
  Upload,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  BookOpen,
  Sparkles,
  Tag,
  ShieldCheck,
} from "lucide-react";

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginError, setLoginError] = useState("");

  // Profesyonel Form Alanları
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("İthalat & Vergi");
  const [regulationType, setRegulationType] = useState("Cumhurbaşkanı Kararı");
  const [officialGazetteNumber, setOfficialGazetteNumber] = useState("");
  const [relatedGtip, setRelatedGtip] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [expertNote, setExpertNote] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");

  const [loading, setLoading] = useState(false);
  const [publishResult, setPublishResult] = useState<{
    success: boolean;
    message: string;
    slug?: string;
  } | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setLoginError("Lütfen yönetici şifresini giriniz.");
      return;
    }
    setIsLoggedIn(true);
    setLoginError("");
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setPublishResult(null);

    try {
      const res = await fetch("/api/admin/sirkuler", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          password,
          title,
          category,
          regulationType,
          officialGazetteNumber,
          relatedGtip,
          summary,
          content,
          expertNote,
          sourceUrl,
          pdfUrl,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setPublishResult({
          success: true,
          message: data.message,
          slug: data.item?.slug,
        });
        // Temizle
        setTitle("");
        setSummary("");
        setContent("");
        setOfficialGazetteNumber("");
        setRelatedGtip("");
        setExpertNote("");
        setSourceUrl("");
        setPdfUrl("");
      } else {
        setPublishResult({
          success: false,
          message: data.error || "Yayınlama sırasında bir hata oluştu.",
        });
      }
    } catch (err) {
      console.error(err);
      setPublishResult({
        success: false,
        message: "Sunucu hatası oluştu.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-16 bg-slate-100 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {!isLoggedIn ? (
          /* Şifre Giriş Ekranı */
          <div className="max-w-md mx-auto bg-white rounded-3xl p-8 shadow-xl border border-slate-200 space-y-6 text-center">
            <div className="w-16 h-16 bg-[#1E2A3A] text-[#44B9CD] rounded-2xl flex items-center justify-center mx-auto shadow-md">
              <Lock className="w-8 h-8" />
            </div>

            <div>
              <h1 className="text-xl font-extrabold text-slate-900">
                Kalem Gümrük Mevzuat Masası
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Resmi Gazete tebliğlerini ve sirkülerleri yayımlamak için lütfen yönetici şifresini giriniz.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <input
                  type="password"
                  placeholder="Yönetici Şifresi (Varsayılan: kalem1997)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#44B9CD] text-center"
                />
              </div>

              {loginError && (
                <div className="text-xs text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-200">
                  {loginError}
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-[#1E2A3A] hover:bg-slate-800 text-white font-bold py-3 rounded-xl text-xs transition-colors"
              >
                Giriş Yap
              </button>
            </form>
          </div>
        ) : (
          /* Profesyonel Sirküler & Mevzuat Editörü */
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-200 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#1E2A3A] text-[#44B9CD] flex items-center justify-center">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h1 className="text-lg font-bold text-slate-900">
                      Profesyonel Gümrük Sirküleri Yayımla
                    </h1>
                    <p className="text-xs text-slate-500">
                      Resmi Gazete tebliğlerini, GTİP fasıllarını ve uzman yorumunuzu giriniz.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsLoggedIn(false)}
                  className="text-xs text-slate-400 hover:text-slate-600 font-semibold"
                >
                  Çıkış Yap
                </button>
              </div>

              {publishResult && (
                <div
                  className={`p-4 rounded-xl text-xs flex items-center justify-between ${
                    publishResult.success
                      ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                      : "bg-red-50 text-red-800 border border-red-200"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {publishResult.success ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-600" />
                    )}
                    <span>{publishResult.message}</span>
                  </div>

                  {publishResult.slug && (
                    <Link
                      href={`/sirkuler/${publishResult.slug}`}
                      target="_blank"
                      className="font-bold underline flex items-center gap-1 hover:text-emerald-900"
                    >
                      <span>Mevzuatı Sitede Gör</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>
              )}

              <form onSubmit={handlePublish} className="space-y-5">
                {/* 1. Başlık */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Sirküler / Tebliğ Başlığı *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Örn: İthalatta İlave Gümrük Vergisi Uygulanmasına Dair Kararda Değişiklik"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#44B9CD]"
                  />
                </div>

                {/* 2. Mevzuat Türü, Kategori, Resmi Gazete Sayısı, GTİP */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Mevzuat Türü *
                    </label>
                    <select
                      value={regulationType}
                      onChange={(e) => setRegulationType(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#44B9CD] bg-white"
                    >
                      <option value="Cumhurbaşkanı Kararı">Cumhurbaşkanı Kararı</option>
                      <option value="Gümrük Genel Tebliği">Gümrük Genel Tebliği</option>
                      <option value="İthalat Tebliği">İthalat Tebliği</option>
                      <option value="İhracat Tebliği">İhracat Tebliği</option>
                      <option value="Bakanlık Genelgesi">Bakanlık Genelgesi</option>
                      <option value="Ürün Güvenliği Tebliği">Ürün Güvenliği (TAREKS)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Kategori *
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#44B9CD] bg-white"
                    >
                      <option value="İthalat & Vergi">İthalat & Vergi</option>
                      <option value="İhracat & Dolaşım">İhracat & Dolaşım</option>
                      <option value="Dahilde İşleme (DİR)">Dahilde İşleme (DİR)</option>
                      <option value="Mevzuat & Denetim">Mevzuat & Denetim</option>
                      <option value="Antrepo & Transit">Antrepo & Transit</option>
                      <option value="Genel Gümrük">Genel Gümrük</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Resmi Gazete Sayısı
                    </label>
                    <input
                      type="text"
                      placeholder="Örn: Sayı: 32700"
                      value={officialGazetteNumber}
                      onChange={(e) => setOfficialGazetteNumber(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#44B9CD]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      İlgili GTİP / Fasıllar
                    </label>
                    <input
                      type="text"
                      placeholder="Örn: 84. ve 85. Fasıllar"
                      value={relatedGtip}
                      onChange={(e) => setRelatedGtip(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#44B9CD]"
                    />
                  </div>
                </div>

                {/* 3. Kısa Yönetici Özeti */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Hap Özet (1-2 Cümlelik Yönetici Özeti)
                  </label>
                  <input
                    type="text"
                    placeholder="Müşterilerin liste görünümünde ve Google arama sonuçlarında göreceği hap özet..."
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#44B9CD]"
                  />
                </div>

                {/* 4. Resmi Tebliğ Metni */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tebliğ / Karar Metni (Kopyala-Yapıştır Alanı) *
                  </label>
                  <textarea
                    required
                    rows={10}
                    placeholder="Resmi Gazete'den veya hazırladığınız sirkülerden tebliğ metnini doğrudan buraya yapıştırın..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full p-4 text-xs font-mono leading-relaxed rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#44B9CD] bg-slate-50/50"
                  ></textarea>
                </div>

                {/* 5. Kalem Gümrük Uzman Yorumu / Tavsiyesi */}
                <div className="p-4 bg-blue-50/60 rounded-2xl border border-blue-200/80 space-y-1.5">
                  <label className="block text-xs font-bold text-blue-900 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#44B9CD]" />
                    <span>Kalem Gümrük Müşavirlik Uzman Değerlendirmesi & Tavsiyesi</span>
                  </label>
                  <p className="text-[11px] text-blue-700">
                    Firmaların cezai yaptırımlardan kaçınması veya vergi avantajı sağlaması için müşavirlik tavsiyeniz (Sitede mavi uzman kutusu içinde görünür).
                  </p>
                  <textarea
                    rows={3}
                    placeholder="Örn: İthalatçı firmalarımızın gümrük vergisi avantajını kaybetmemek adına sevkiyat yola çıkmadan önce ATR dolaşım belgelerinin geçerlilik sürelerini operasyon ekibimizle teyit etmeleri önemle tavsiye olunur..."
                    value={expertNote}
                    onChange={(e) => setExpertNote(e.target.value)}
                    className="w-full p-3 text-xs rounded-xl border border-blue-200 focus:outline-none focus:ring-2 focus:ring-[#44B9CD] bg-white text-slate-800"
                  ></textarea>
                </div>

                {/* 6. Kaynak & PDF Bağlantıları */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Resmi Gazete / Mevzuat Linki (İsteğe Bağlı)
                    </label>
                    <input
                      type="url"
                      placeholder="Örn: https://www.resmigazete.gov.tr/..."
                      value={sourceUrl}
                      onChange={(e) => setSourceUrl(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#44B9CD]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Tebliğ PDF Bağlantısı (İsteğe Bağlı)
                    </label>
                    <input
                      type="url"
                      placeholder="Örn: https://.../teblig.pdf"
                      value={pdfUrl}
                      onChange={(e) => setPdfUrl(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#44B9CD]"
                    />
                  </div>
                </div>

                {/* Gönder */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500">
                    * Yayımlanan sirküler anında Google SEO indeksine ve siteye girer.
                  </span>

                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-[#1E2A3A] hover:bg-[#2A3B50] text-[#44B9CD] hover:text-white font-bold py-3 px-6 rounded-xl text-xs transition-all flex items-center gap-2 shadow-sm disabled:opacity-50"
                  >
                    <Upload className="w-4 h-4" />
                    <span>{loading ? "Yayımlanıyor..." : "Mevzuatı Sitede Yayımla"}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
