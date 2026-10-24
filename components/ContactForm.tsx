"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Send,
  CheckCircle2,
  AlertCircle,
  Phone,
  Mail,
  MessageCircle,
  Clock,
  ArrowRight,
  HelpCircle,
  ShieldCheck,
  FileText,
} from "lucide-react";
import { companyInfo } from "@/data/company";
import { useLanguage } from "@/context/LanguageContext";

export default function ContactForm() {
  const { t, localePath, isRTL } = useLanguage();
  const cf = t.contactForm;

  const [formData, setFormData] = useState({
    fullName: "",
    company: "",
    phone: "",
    email: "",
    subject: cf.subjects[0] || "Genel Bilgi & Danışma",
    message: "",
    honeypot: "",
  });

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [responseMsg, setResponseMsg] = useState("");
  const [refCode, setRefCode] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setResponseMsg("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.fullName,
          company: formData.company,
          phone: formData.phone,
          email: formData.email,
          serviceType: `[İletişim Formu] ${formData.subject}`,
          message: formData.message,
          honeypot: formData.honeypot,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setRefCode(data.refCode || "");
        setResponseMsg(data.message || cf.defaultSuccessMsg);
        setFormData({
          fullName: "",
          company: "",
          phone: "",
          email: "",
          subject: cf.subjects[0] || "Genel Bilgi & Danışma",
          message: "",
          honeypot: "",
        });
      } else {
        setStatus("error");
        setResponseMsg(data.error || cf.errorMsg);
      }
    } catch (err) {
      console.error(err);
      setStatus("error");
      setResponseMsg(cf.connectionError);
    }
  };

  return (
    <div id="iletisim-formu" className="scroll-mt-20">
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* Sol Kolon: Bilgilendirme ve Hızlı İletişim */}
          <div className="lg:col-span-5 bg-[#1E2A3A] text-white p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#44B9CD]/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-6">
              <div className="space-y-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#44B9CD]/15 border border-[#44B9CD]/30 text-[#44B9CD] text-xs font-bold uppercase tracking-wider">
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>{cf.badge}</span>
                </span>
                <h3 className="text-2xl font-extrabold text-white tracking-tight">
                  {cf.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {cf.desc}
                </p>
              </div>

              {/* Hızlı İletişim Kanalları */}
              <div className="space-y-4 pt-4 border-t border-slate-700/60">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-[#44B9CD] shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-400">{cf.phoneTitle}</div>
                    <a
                      href={`tel:${companyInfo.phoneRaw}`}
                      className="text-xs sm:text-sm font-bold text-white hover:text-[#44B9CD] transition-colors"
                      dir="ltr"
                    >
                      {companyInfo.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                    <MessageCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-400">{cf.waTitle}</div>
                    <a
                      href={`https://wa.me/${companyInfo.whatsapp}?text=${encodeURIComponent(
                        companyInfo.whatsappDefaultMessage
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs sm:text-sm font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
                      dir="ltr"
                    >
                      {companyInfo.phone} (WhatsApp)
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-[#44B9CD] shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-400">{cf.emailTitle}</div>
                    <a
                      href={`mailto:${companyInfo.email}`}
                      className="text-xs sm:text-sm font-bold text-white hover:text-[#44B9CD] transition-colors"
                      dir="ltr"
                    >
                      {companyInfo.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-[#44B9CD] shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-400">{cf.hoursTitle}</div>
                    <span className="text-xs text-slate-200">
                      {companyInfo.workingHours}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Teklif Almak İsteyenler İçin Yönlendirme Kartı */}
            <div className="relative z-10 mt-8 pt-5 border-t border-slate-700/60 bg-white/5 rounded-2xl p-4 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#44B9CD]">
                <FileText className="w-4 h-4" />
                <span>{cf.quoteTitle}</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-normal">
                {cf.quoteDesc}
              </p>
              <Link
                href={localePath("/hizmetlerimiz#randevu-teklif")}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-white hover:text-[#44B9CD] transition-colors pt-1"
              >
                <span>{cf.quoteBtn}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Sağ Kolon: İletişim Formu */}
          <div className="lg:col-span-7 p-8 sm:p-10 flex flex-col justify-center">
            {status === "success" ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-2xl font-bold text-slate-900">{cf.successTitle}</h4>
                {refCode && (
                  <div className="inline-block px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold" dir="ltr">
                    {cf.refNoPrefix} #{refCode}
                  </div>
                )}
                <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                  {responseMsg}
                </p>
                <div className="pt-4">
                  <button
                    type="button"
                    onClick={() => setStatus("idle")}
                    className="px-6 py-2.5 bg-[#1E2A3A] hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-xs"
                  >
                    {cf.newMsgBtn}
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="mb-6 space-y-1">
                  <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                    {cf.formTitle}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500">
                    {cf.formDesc}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Honeypot Spam Koruması */}
                  <input
                    type="text"
                    name="honeypot"
                    value={formData.honeypot}
                    onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
                    className="hidden"
                    tabIndex={-1}
                    autoComplete="off"
                  />

                  {/* Ad Soyad & Firma */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        {cf.fullNameLabel} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder={cf.fullNamePlaceholder}
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:border-[#44B9CD] focus:ring-2 focus:ring-[#44B9CD]/20 text-slate-900 bg-white transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        {cf.companyLabel}
                      </label>
                      <input
                        type="text"
                        placeholder={cf.companyPlaceholder}
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:border-[#44B9CD] focus:ring-2 focus:ring-[#44B9CD]/20 text-slate-900 bg-white transition-all"
                      />
                    </div>
                  </div>

                  {/* Telefon & E-Posta */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        {cf.phoneLabel} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder={cf.phonePlaceholder}
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:border-[#44B9CD] focus:ring-2 focus:ring-[#44B9CD]/20 text-slate-900 bg-white transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        {cf.emailLabel}
                      </label>
                      <input
                        type="email"
                        placeholder={cf.emailPlaceholder}
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:border-[#44B9CD] focus:ring-2 focus:ring-[#44B9CD]/20 text-slate-900 bg-white transition-all"
                      />
                    </div>
                  </div>

                  {/* İletişim Konusu */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      {cf.subjectLabel}
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:border-[#44B9CD] focus:ring-2 focus:ring-[#44B9CD]/20 text-slate-900 bg-white transition-all font-medium"
                    >
                      {cf.subjects.map((sub, i) => (
                        <option key={i} value={sub}>
                          {sub}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Mesaj */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      {cf.messageLabel} <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder={cf.messagePlaceholder}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:border-[#44B9CD] focus:ring-2 focus:ring-[#44B9CD]/20 text-slate-900 bg-white transition-all resize-none"
                    ></textarea>
                  </div>

                  {/* Hata Mesajı */}
                  {status === "error" && (
                    <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{responseMsg}</span>
                    </div>
                  )}

                  {/* Gönder Butonu */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={status === "loading"}
                      className="w-full bg-[#1E2A3A] hover:bg-[#2A3B50] text-[#44B9CD] hover:text-white font-bold py-3.5 px-6 rounded-xl text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-xs disabled:opacity-50 cursor-pointer border border-[#44B9CD]/30"
                    >
                      <Send className={`w-4 h-4 ${isRTL ? "rotate-180" : ""}`} />
                      <span>{status === "loading" ? cf.submittingBtn : cf.submitBtn}</span>
                    </button>
                  </div>

                  <div className="flex items-center justify-center gap-2 pt-1 text-[11px] text-slate-400">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    <span>{cf.kvkkNotice}</span>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
