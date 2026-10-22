"use client";

import { useState, useEffect } from "react";
import {
  Send,
  CheckCircle2,
  AlertCircle,
  Phone,
  ArrowRight,
  ArrowLeft,
  Ship,
  Plane,
  Truck,
  Train,
  Upload,
  FileCheck,
  FileText,
  Sparkles,
  Building,
  ShieldCheck,
  MessageCircle,
} from "lucide-react";
import { companyInfo } from "@/data/company";

interface MultiStepFormData {
  // Adım 1: İşlem Türü
  operationType: "ithalat" | "ihracat" | "transit" | "danismanlik";
  // Adım 2: Taşıma & Eşya Bilgisi
  transportMode: "deniz" | "hava" | "kara" | "demiryolu";
  productName: string;
  gtipCode: string;
  originCountry: string;
  destinationCustoms: string;
  // Adım 3: Hacim & Evrak
  volumeInfo: string; // Konteyner adedi / tonaj / koli
  uploadedFilesSummary: string;
  notes: string;
  // Adım 4: İletişim
  fullName: string;
  companyName: string;
  phone: string;
  email: string;
}

export default function CustomsMultiStepForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [referenceCode, setReferenceCode] = useState("");

  const [formData, setFormData] = useState<MultiStepFormData>({
    operationType: "ithalat",
    transportMode: "deniz",
    productName: "",
    gtipCode: "",
    originCountry: "",
    destinationCustoms: "Ambarlı / Erenköy Gümrüğü",
    volumeInfo: "1 x 40' HC Konteyner",
    uploadedFilesSummary: "",
    notes: "",
    fullName: "",
    companyName: "",
    phone: "",
    email: "",
  });

  const [selectedFileName, setSelectedFileName] = useState<string>("");

  // Simülatörden gelen veriyi otomatik yakalama
  useEffect(() => {
    const handleTransfer = (e: any) => {
      const detail = e.detail;
      if (detail) {
        setFormData((prev) => ({
          ...prev,
          productName: detail.categoryName || prev.productName,
          gtipCode: detail.gtip || prev.gtipCode,
          originCountry: detail.origin || prev.originCountry,
          notes: `Simülasyondan aktarıldı: Fatura Tutarı: ${detail.amount} ${detail.currency}`,
        }));
        setCurrentStep(2); // Doğrudan detay adımına geçir
      }
    };

    window.addEventListener("customs_calc_transfer", handleTransfer);
    return () => window.removeEventListener("customs_calc_transfer", handleTransfer);
  }, []);

  // Adım Geçiş Doğrulamaları
  const handleNextStep = () => {
    setErrorMsg("");
    if (currentStep === 2) {
      if (!formData.productName.trim()) {
        setErrorMsg("Lütfen ürün cinsini veya tanımını belirtiniz.");
        return;
      }
    }
    setCurrentStep((prev) => Math.min(prev + 1, 4));
  };

  const handlePrevStep = () => {
    setErrorMsg("");
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  // Dosya Yükleme Simülasyonu
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFileName(`${file.name} (${(file.size / 1024).toFixed(0)} KB)`);
      setFormData((prev) => ({
        ...prev,
        uploadedFilesSummary: file.name,
      }));
    }
  };

  // Nihai Form Gönderimi
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!formData.fullName.trim() || !formData.phone.trim()) {
      setErrorMsg("Lütfen Ad Soyad ve Telefon alanlarını doldurunuz.");
      return;
    }

    setStatus("loading");

    const fullMessage = `
--- GÜMRÜKLEME TALEBİ DETAYLARI ---
• İşlem Türü: ${formData.operationType.toUpperCase()}
• Taşıma Şekli: ${formData.transportMode.toUpperCase()}
• Ürün Cinsi: ${formData.productName}
• GTİP Kodu: ${formData.gtipCode || "Belirtilmedi"}
• Çıkış Ülkesi: ${formData.originCountry || "Belirtilmedi"}
• Varış Gümrüğü: ${formData.destinationCustoms}
• Hacim/Konteyner: ${formData.volumeInfo || "-"}
• Eklenen Evrak: ${formData.uploadedFilesSummary || "Yok"}
• Özel Notlar: ${formData.notes || "-"}
    `.trim();

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.fullName,
          company: formData.companyName,
          phone: formData.phone,
          email: formData.email,
          serviceType: `${formData.operationType.toUpperCase()} Gümrükleme`,
          message: fullMessage,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setReferenceCode("KLM-" + Math.floor(100000 + Math.random() * 900000));
      } else {
        setStatus("error");
        setErrorMsg(data.error || "Form gönderilirken bir hata oluştu.");
      }
    } catch (err) {
      console.error(err);
      setStatus("error");
      setErrorMsg("Sunucuya bağlanılamadı. Lütfen doğrudan telefon veya WhatsApp ile ulaşınız.");
    }
  };

  return (
    <section className="py-16 bg-white" id="teklif">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Başlık */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1E2A3A] text-[#44B9CD] text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Akıllı Gümrük Talep Formu</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1E2A3A]">
            Gümrükleme & Masraf Teklifi Alın
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Dış ticaret operasyonunuz için 4 adımda bilgilerinizi girin; uzman müşavirimiz size özel
            maliyet fizibilitesini hazırlasın.
          </p>
        </div>

        {/* Ana Form Kartı */}
        <div className="bg-slate-50 rounded-3xl border border-slate-200/80 shadow-lg overflow-hidden">
          {/* Adım Göstergesi (Step Indicator) */}
          <div className="bg-[#1E2A3A] px-6 py-4 text-white">
            <div className="flex items-center justify-between max-w-2xl mx-auto text-xs font-semibold">
              <div
                className={`flex items-center gap-2 ${
                  currentStep >= 1 ? "text-[#44B9CD]" : "text-slate-400"
                }`}
              >
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    currentStep >= 1
                      ? "bg-[#44B9CD] text-[#1E2A3A]"
                      : "bg-slate-700 text-slate-400"
                  }`}
                >
                  1
                </span>
                <span className="hidden sm:inline">İşlem Türü</span>
              </div>
              <div className="w-8 sm:w-16 h-0.5 bg-slate-700"></div>

              <div
                className={`flex items-center gap-2 ${
                  currentStep >= 2 ? "text-[#44B9CD]" : "text-slate-400"
                }`}
              >
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    currentStep >= 2
                      ? "bg-[#44B9CD] text-[#1E2A3A]"
                      : "bg-slate-700 text-slate-400"
                  }`}
                >
                  2
                </span>
                <span className="hidden sm:inline">Taşıma & Eşya</span>
              </div>
              <div className="w-8 sm:w-16 h-0.5 bg-slate-700"></div>

              <div
                className={`flex items-center gap-2 ${
                  currentStep >= 3 ? "text-[#44B9CD]" : "text-slate-400"
                }`}
              >
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    currentStep >= 3
                      ? "bg-[#44B9CD] text-[#1E2A3A]"
                      : "bg-slate-700 text-slate-400"
                  }`}
                >
                  3
                </span>
                <span className="hidden sm:inline">Hacim & Evrak</span>
              </div>
              <div className="w-8 sm:w-16 h-0.5 bg-slate-700"></div>

              <div
                className={`flex items-center gap-2 ${
                  currentStep >= 4 ? "text-[#44B9CD]" : "text-slate-400"
                }`}
              >
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    currentStep >= 4
                      ? "bg-[#44B9CD] text-[#1E2A3A]"
                      : "bg-slate-700 text-slate-400"
                  }`}
                >
                  4
                </span>
                <span className="hidden sm:inline">İletişim & Onay</span>
              </div>
            </div>
          </div>

          {/* Form Gövdesi */}
          <div className="p-6 sm:p-10">
            {status === "success" ? (
              /* Başarı Ekranı */
              <div className="text-center py-8 space-y-4">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-xs">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <div className="inline-block px-3 py-1 rounded-full bg-slate-100 text-slate-700 font-mono text-xs font-bold">
                  Referans Takip Kodu: {referenceCode}
                </div>
                <h3 className="text-xl font-bold text-slate-900">
                  Gümrükleme Talebiniz Başarıyla Alındı!
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                  Dosyanız ilgili liman ve rejim müşavirimize iletildi. Maliyet fizibilitesi ve işlem
                  adımları için telefon numaranızdan en kısa sürede sizinle irtibata geçilecektir.
                </p>

                <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <a
                    href={`https://wa.me/${companyInfo.whatsapp}?text=${encodeURIComponent(
                      `Merhaba Kalem Gümrük, web sitenizden ${referenceCode} referans numaralı ${formData.productName} için teklif talebi oluşturdum. Detayları WhatsApp üzerinden de paylaşmak istiyorum.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Evrakları WhatsApp&apos;tan Gönder</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => {
                      setStatus("idle");
                      setCurrentStep(1);
                    }}
                    className="px-5 py-3 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold transition-colors"
                  >
                    Yeni Talep Oluştur
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* ----------------- ADIM 1: İŞLEM TÜRÜ ----------------- */}
                {currentStep === 1 && (
                  <div className="space-y-4 animate-in fade-in duration-200">
                    <div>
                      <h3 className="text-base font-bold text-slate-900">
                        1. Hangi Gümrük Rejimi İçin Teklif İstiyorsunuz?
                      </h3>
                      <p className="text-xs text-slate-500">
                        Gerçekleştirmek istediğiniz ana dış ticaret operasyonunu seçiniz.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                      {[
                        {
                          id: "ithalat",
                          title: "İthalat Gümrükleme",
                          desc: "Yurtdışından mal getirme, vergi tescili, izinler ve adresinize teslimat.",
                        },
                        {
                          id: "ihracat",
                          title: "İhracat Gümrükleme",
                          desc: "Türkiye'den yurtdışına satış, A.TR, EUR.1, birlik tasdiki ve KDV kapanışı.",
                        },
                        {
                          id: "transit",
                          title: "Antrepo & Transit Ticaret",
                          desc: "Gümrüklü antrepo depolama, millileştirme veya 3. ülkeye sevk (NCTS/T1).",
                        },
                        {
                          id: "danismanlik",
                          title: "Dış Ticaret & DİR Danışmanlığı",
                          desc: "Dahilde İşleme Belgesi (DİİB), YYS, sonradan kontrol ve yatırım teşvik.",
                        },
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              operationType: item.id as any,
                            }))
                          }
                          className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                            formData.operationType === item.id
                              ? "border-[#44B9CD] bg-white ring-2 ring-[#44B9CD]/20 shadow-sm"
                              : "border-slate-200 hover:border-slate-300 bg-white/70"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-bold text-slate-900">
                              {item.title}
                            </span>
                            <span
                              className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                                formData.operationType === item.id
                                  ? "border-[#44B9CD] bg-[#44B9CD]"
                                  : "border-slate-300"
                              }`}
                            >
                              {formData.operationType === item.id && (
                                <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                              )}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 leading-relaxed">
                            {item.desc}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* ----------------- ADIM 2: TAŞIMA & EŞYA TİPİ ----------------- */}
                {currentStep === 2 && (
                  <div className="space-y-4 animate-in fade-in duration-200">
                    <div>
                      <h3 className="text-base font-bold text-slate-900">
                        2. Taşıma Şekli ve Eşya Bilgileri
                      </h3>
                      <p className="text-xs text-slate-500">
                        Sevkiyat yöntemi ve ürün detayları maliyet hesaplamasını doğrudan etkiler.
                      </p>
                    </div>

                    {/* Taşıma Modu Seçimi */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Taşıma Modu *
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {[
                          { id: "deniz", title: "Denizyolu", icon: Ship },
                          { id: "hava", title: "Havayolu", icon: Plane },
                          { id: "kara", title: "Karayolu (TIR)", icon: Truck },
                          { id: "demiryolu", title: "Demiryolu", icon: Train },
                        ].map((m) => {
                          const IconComp = m.icon;
                          const isSelected = formData.transportMode === m.id;
                          return (
                            <button
                              key={m.id}
                              type="button"
                              onClick={() =>
                                setFormData((prev) => ({
                                  ...prev,
                                  transportMode: m.id as any,
                                }))
                              }
                              className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all ${
                                isSelected
                                  ? "border-[#1E2A3A] bg-[#1E2A3A] text-[#44B9CD]"
                                  : "border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
                              }`}
                            >
                              <IconComp className="w-4 h-4" />
                              <span>{m.title}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Ürün Cinsi / Eşya Tanımı *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Örn: Sanayi tipi CNC freze tezgâhı veya Pamuklu Kumaş"
                          value={formData.productName}
                          onChange={(e) =>
                            setFormData({ ...formData, productName: e.target.value })
                          }
                          className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#44B9CD] bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          GTİP Kodu (Varsa veya Tahmini)
                        </label>
                        <input
                          type="text"
                          placeholder="Örn: 8459.29.00.00.00 veya boş bırakın"
                          value={formData.gtipCode}
                          onChange={(e) =>
                            setFormData({ ...formData, gtipCode: e.target.value })
                          }
                          className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#44B9CD] bg-white font-mono"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Çıkış Ülkesi / Limanı
                        </label>
                        <input
                          type="text"
                          placeholder="Örn: Almanya (Hamburg) veya Çin (Ningbo)"
                          value={formData.originCountry}
                          onChange={(e) =>
                            setFormData({ ...formData, originCountry: e.target.value })
                          }
                          className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#44B9CD] bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Varış Gümrüğü / Liman
                        </label>
                        <select
                          value={formData.destinationCustoms}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              destinationCustoms: e.target.value,
                            })
                          }
                          className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#44B9CD] bg-white"
                        >
                          <option value="Ambarlı Gümrük Müdürlüğü (Liman)">Ambarlı Gümrük Müdürlüğü (Liman)</option>
                          <option value="Erenköy Gümrük Müdürlüğü (Kara)">Erenköy Gümrük Müdürlüğü (Kara)</option>
                          <option value="Muratbey Gümrük Müdürlüğü (Kara)">Muratbey Gümrük Müdürlüğü (Kara)</option>
                          <option value="İstanbul Havalimanı (İGA) Gümrüğü">İstanbul Havalimanı (İGA) Gümrüğü</option>
                          <option value="Sabiha Gökçen Havalimanı Gümrüğü">Sabiha Gökçen Havalimanı Gümrüğü</option>
                          <option value="Dilovası / Gebze Gümrükleri">Dilovası / Gebze Gümrükleri</option>
                          <option value="Gemlik / Bursa Gümrükleri">Gemlik / Bursa Gümrükleri</option>
                          <option value="İzmir / Mersin Limanları">İzmir / Mersin Limanları</option>
                          <option value="Diğer / Emin Değilim">Diğer / Emin Değilim</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* ----------------- ADIM 3: HACİM & EVRAK / DOSYA DROPZONE ----------------- */}
                {currentStep === 3 && (
                  <div className="space-y-4 animate-in fade-in duration-200">
                    <div>
                      <h3 className="text-base font-bold text-slate-900">
                        3. Hacim Bilgisi & Taslak Evraklar
                      </h3>
                      <p className="text-xs text-slate-500">
                        Varsa proforma fatura veya konşimento yükleyerek teklif sürecini hızlandırabilirsiniz.
                      </p>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Hacim, Konteyner veya Ağırlık Bilgisi
                      </label>
                      <input
                        type="text"
                        placeholder="Örn: 1 x 40' HC Konteyner veya 3 Palet / 1200 Kg"
                        value={formData.volumeInfo}
                        onChange={(e) =>
                          setFormData({ ...formData, volumeInfo: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#44B9CD] bg-white"
                      />
                    </div>

                    {/* Evrak Yükleme Dropzone */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Proforma Fatura / Konşimento Taslağı Yükleyin (İsteğe Bağlı)
                      </label>
                      <div className="relative border-2 border-dashed border-slate-300 hover:border-[#44B9CD] rounded-2xl p-6 text-center transition-all bg-white hover:bg-slate-50/50 cursor-pointer">
                        <input
                          type="file"
                          accept=".pdf,.png,.jpg,.jpeg,.doc,.docx,.xlsx"
                          onChange={handleFileChange}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div className="flex flex-col items-center justify-center space-y-2">
                          <div className="w-10 h-10 rounded-xl bg-[#44B9CD]/15 text-[#1E2A3A] flex items-center justify-center">
                            <Upload className="w-5 h-5 text-[#44B9CD]" />
                          </div>
                          {selectedFileName ? (
                            <div className="text-xs font-bold text-emerald-700 flex items-center gap-1.5">
                              <FileCheck className="w-4 h-4" />
                              <span>{selectedFileName}</span>
                            </div>
                          ) : (
                            <>
                              <div className="text-xs font-bold text-slate-800">
                                Dosyayı buraya sürükleyin veya <span className="text-[#44B9CD] underline">bilgisayarınızdan seçin</span>
                              </div>
                              <div className="text-[11px] text-slate-400">
                                PDF, JPG, PNG, Excel veya Word (Maks: 10 MB)
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Ek Talepler & Özel Notlar (Varsa)
                      </label>
                      <textarea
                        rows={2}
                        placeholder="Örn: Ardiye süresi kısıtlıdır, hızlı intaç gerekmektedir veya menşe şahadetnamesi mevcuttur..."
                        value={formData.notes}
                        onChange={(e) =>
                          setFormData({ ...formData, notes: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#44B9CD] bg-white"
                      ></textarea>
                    </div>
                  </div>
                )}

                {/* ----------------- ADIM 4: İLETİŞİM & ONAY ----------------- */}
                {currentStep === 4 && (
                  <div className="space-y-4 animate-in fade-in duration-200">
                    <div>
                      <h3 className="text-base font-bold text-slate-900">
                        4. İletişim Bilgileriniz
                      </h3>
                      <p className="text-xs text-slate-500">
                        Teklif dosyasını ve maliyet analizini ileteceğimiz yetkili iletişim bilgileri.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Adınız Soyadınız *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Örn: Mehmet Özkan"
                          value={formData.fullName}
                          onChange={(e) =>
                            setFormData({ ...formData, fullName: e.target.value })
                          }
                          className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#44B9CD] bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Firma Unvanı *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Örn: Özkan Makine Sanayi Ltd."
                          value={formData.companyName}
                          onChange={(e) =>
                            setFormData({ ...formData, companyName: e.target.value })
                          }
                          className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#44B9CD] bg-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Telefon Numaranız *
                        </label>
                        <input
                          type="tel"
                          required
                          placeholder="Örn: 05xx xxx xx xx"
                          value={formData.phone}
                          onChange={(e) =>
                            setFormData({ ...formData, phone: e.target.value })
                          }
                          className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#44B9CD] bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          E-Posta Adresiniz (Teklif Gönderimi İçin)
                        </label>
                        <input
                          type="email"
                          placeholder="Örn: mehmet@ozkanmakine.com"
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                          className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#44B9CD] bg-white"
                        />
                      </div>
                    </div>

                    {/* Özet Kartı */}
                    <div className="p-3.5 bg-slate-100 rounded-xl border border-slate-200 text-xs text-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                      <div>
                        <span className="font-bold">Özet:</span> {formData.operationType.toUpperCase()} — {formData.productName || "Eşya belirtildi"} ({formData.transportMode.toUpperCase()})
                      </div>
                      <span className="text-[11px] text-slate-500 font-medium">
                        Varış: {formData.destinationCustoms}
                      </span>
                    </div>
                  </div>
                )}

                {/* Hata Mesajı Varsa */}
                {errorMsg && (
                  <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* Alt Navigasyon Butonları */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                  {currentStep > 1 ? (
                    <button
                      type="button"
                      onClick={handlePrevStep}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-xs font-bold text-slate-700 transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Geri</span>
                    </button>
                  ) : (
                    <div></div>
                  )}

                  {currentStep < 4 ? (
                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#1E2A3A] hover:bg-[#2A3B50] text-[#44B9CD] hover:text-white text-xs font-bold transition-all shadow-xs"
                    >
                      <span>Sonraki Adım</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={status === "loading"}
                      className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-[#44B9CD] hover:bg-[#2f9fb3] text-white text-xs font-bold transition-all shadow-md disabled:opacity-50"
                    >
                      <Send className="w-4 h-4" />
                      <span>{status === "loading" ? "İletiliyor..." : "Gümrükleme Talebini Gönder"}</span>
                    </button>
                  )}
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
