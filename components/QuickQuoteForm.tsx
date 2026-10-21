"use client";

import { useState } from "react";
import { Send, CheckCircle2, AlertCircle, Phone, MessageSquare } from "lucide-react";
import { companyInfo } from "@/data/company";

export default function QuickQuoteForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    company: "",
    phone: "",
    email: "",
    serviceType: "İthalat Gümrükleme",
    message: "",
    honeypot: "",
  });

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [responseMsg, setResponseMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setResponseMsg("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setResponseMsg(data.message || "Talebiniz başarıyla alındı.");
        setFormData({
          fullName: "",
          company: "",
          phone: "",
          email: "",
          serviceType: "İthalat Gümrükleme",
          message: "",
          honeypot: "",
        });
      } else {
        setStatus("error");
        setResponseMsg(data.error || "Bir hata oluştu. Lütfen tekrar deneyiniz.");
      }
    } catch (err) {
      console.error(err);
      setStatus("error");
      setResponseMsg("Sunucuya bağlanılamadı. Lütfen doğrudan telefon veya WhatsApp ile ulaşınız.");
    }
  };

  return (
    <section className="py-20 bg-[#1E2A3A] text-white relative overflow-hidden" id="teklif">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Sol Kolon: Açıklama & İletişim Bilgileri */}
          <div className="lg:col-span-5 space-y-6">
            <span className="text-xs font-bold text-[#44B9CD] uppercase tracking-wider">
              Hızlı Danışmanlık & Fiyat Teklifi
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight">
              Gümrük Operasyonunuz İçin{" "}
              <span className="text-[#44B9CD]">Hemen Teklif Alın</span>
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              İthalat, ihracat veya antrepo süreçleriniz için maliyet fizibilitesi ve gümrükleme
              süreci hakkında uzman gümrük müşavirlerimizden anında bilgi alın.
            </p>

            <div className="space-y-4 pt-4 border-t border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-[#44B9CD]">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-slate-400">Doğrudan Telefon Hattı</div>
                  <a href={`tel:${companyInfo.phoneRaw}`} className="text-sm font-bold text-white hover:text-[#44B9CD]">
                    {companyInfo.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-slate-400">Nöbetçi Müşavir WhatsApp</div>
                  <a
                    href={`https://wa.me/${companyInfo.whatsapp}?text=${encodeURIComponent(companyInfo.whatsappDefaultMessage)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-bold text-emerald-400 hover:text-emerald-300"
                  >
                    {companyInfo.phone} (WhatsApp)
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Sağ Kolon: Form */}
          <div className="lg:col-span-7 bg-white text-slate-900 rounded-3xl p-8 sm:p-10 shadow-2xl">
            {status === "success" ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Talebiniz Alındı!</h3>
                <p className="text-sm text-slate-600 max-w-md mx-auto">{responseMsg}</p>
                <button
                  onClick={() => setStatus("idle")}
                  className="mt-4 px-6 py-2.5 bg-[#1E2A3A] text-white text-xs font-bold rounded-lg hover:bg-slate-800 transition-colors"
                >
                  Yeni Form Doldur
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Honeypot Spam Alanı (Görünmez) */}
                <input
                  type="text"
                  name="honeypot"
                  value={formData.honeypot}
                  onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
                  className="hidden"
                  tabIndex={-1}
                  autoComplete="off"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Adınız Soyadınız *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Örn: Ahmet Yılmaz"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#44B9CD] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Firma Adı
                    </label>
                    <input
                      type="text"
                      placeholder="Örn: ABC Dış Ticaret Ltd."
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#44B9CD] focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Telefon Numaranız *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="Örn: 0532 xxx xx xx"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#44B9CD] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      E-Posta Adresiniz
                    </label>
                    <input
                      type="email"
                      placeholder="Örn: ahmet@firma.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#44B9CD] focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    İlgilendiğiniz Hizmet Türü
                  </label>
                  <select
                    value={formData.serviceType}
                    onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#44B9CD] focus:border-transparent bg-white"
                  >
                    <option value="İthalat Gümrükleme">İthalat Gümrükleme</option>
                    <option value="İhracat Gümrükleme">İhracat Gümrükleme</option>
                    <option value="Dahilde & Hariçte İşleme (DİR)">Dahilde & Hariçte İşleme (DİR)</option>
                    <option value="Antrepo & Transit Rejimi">Antrepo & Transit Rejimi</option>
                    <option value="Serbest Bölge İşlemleri">Serbest Bölge İşlemleri</option>
                    <option value="Gümrük & Dış Ticaret Danışmanlığı">Gümrük & Dış Ticaret Danışmanlığı</option>
                    <option value="YYS & Teşvik Danışmanlığı">YYS & Teşvik Danışmanlığı</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Mesajınız & Eşya/GTİP Detayları *
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Eşya cinsi, menşe ülke, tahmini GTİP kodu veya özel talebinizi yazabilirsiniz..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#44B9CD] focus:border-transparent"
                  ></textarea>
                </div>

                {status === "error" && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{responseMsg}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full bg-[#1E2A3A] hover:bg-[#2A3B50] text-[#44B9CD] hover:text-white font-bold py-3.5 px-6 rounded-xl text-xs transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{status === "loading" ? "İletiliyor..." : "Teklif Talebini Gönder"}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
