"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Lock,
  FileText,
  Upload,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ExternalLink,
  ShieldAlert,
} from "lucide-react";

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginError, setLoginError] = useState("");

  // Form Verileri
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("İthalat & Vergi");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");

  const [loading, setLoading] = useState(false);
  const [publishResult, setPublishResult] = useState<{
    success: boolean;
    message: string;
    slug?: string;
  } | null>(null);

  // Giriş Yap
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setLoginError("Lütfen yönetici şifresini giriniz.");
      return;
    }
    // Basit doğrulama (sunucuya da gönderilecek)
    setIsLoggedIn(true);
    setLoginError("");
  };

  // Yayınla
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
          summary,
          content,
          sourceUrl,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setPublishResult({
          success: true,
          message: data.message,
          slug: data.item?.slug,
        });
        // Formu temizle
        setTitle("");
        setSummary("");
        setContent("");
        setSourceUrl("");
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
                Kalem Gümrük Yönetim Paneli
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Mevzuat ve sirküler yayımlamak için lütfen yönetici şifrenizi giriniz.
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

            <div className="text-[11px] text-slate-400">
              * Varsayılan sistem şifresi: <code className="bg-slate-100 px-1 py-0.5 rounded">kalem1997</code>
            </div>
          </div>
        ) : (
          /* Yönetici Sirküler Ekleme Formu */
          <div className="space-y-8">
            <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-sm border border-slate-200 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#1E2A3A] text-[#44B9CD] flex items-center justify-center">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h1 className="text-lg font-bold text-slate-900">
                      Yeni Mevzuat / Sirküler Yayımla
                    </h1>
                    <p className="text-xs text-slate-500">
                      Resmi Gazete veya Bakanlık tebliğini kopyalayıp doğrudan yapıştırabilirsiniz.
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
                      <span>Sitede Gör</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>
              )}

              <form onSubmit={handlePublish} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Sirküler / Tebliğ Başlığı *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Örn: İthalatta İlave Gümrük Vergisi Uygulanmasına Dair Karar"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#44B9CD]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Kategori *
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#44B9CD] bg-white"
                    >
                      <option value="İthalat & Vergi">İthalat & Vergi</option>
                      <option value="İhracat & Birlikler">İhracat & Birlikler</option>
                      <option value="Dahilde İşleme">Dahilde İşleme</option>
                      <option value="Mevzuat & Denetim">Mevzuat & Denetim</option>
                      <option value="Antrepo & Transit">Antrepo & Transit</option>
                      <option value="Genel Sirküler">Genel Sirküler</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Kısa Özet (İsteğe Bağlı)
                  </label>
                  <input
                    type="text"
                    placeholder="Müşterilerin liste görünümünde göreceği 1-2 cümlelik kısa özet (Boş bırakırsanız içerikten otomatik alınır)"
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#44B9CD]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Mevzuat / Tebliğ Metni (Kopyala & Yapıştır Alanı) *
                  </label>
                  <div className="text-[11px] text-slate-500 mb-1.5">
                    Resmi Gazete&apos;den veya hazırladığınız bültenden metni doğrudan kopyalayıp buraya
                    yapıştırabilirsiniz. Paragraflar ve maddeleme düzeni korunacaktır.
                  </div>
                  <textarea
                    required
                    rows={12}
                    placeholder="Tebliğ metnini veya müşavirlik açıklamasını buraya yapıştırın..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full p-4 text-xs font-mono leading-relaxed rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#44B9CD] bg-slate-50/50"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Resmi Gazete / Kaynak Linki (İsteğe Bağlı)
                  </label>
                  <input
                    type="url"
                    placeholder="Örn: https://www.resmigazete.gov.tr/eskiler/2026/..."
                    value={sourceUrl}
                    onChange={(e) => setSourceUrl(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#44B9CD]"
                  />
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-xs text-slate-500">
                    * Yayınlanan sirküler anında ana sayfada ve Sirküler sayfasında görünür.
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-[#1E2A3A] hover:bg-[#2A3B50] text-[#44B9CD] hover:text-white font-bold py-3 px-6 rounded-xl text-xs transition-all flex items-center gap-2 shadow-sm disabled:opacity-50"
                  >
                    <Upload className="w-4 h-4" />
                    <span>{loading ? "Yayımlanıyor..." : "Web Sitesinde Yayınla"}</span>
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
