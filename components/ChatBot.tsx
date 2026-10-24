"use client";

import { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import {
  X,
  Send,
  Bot,
  User,
  CheckCircle2,
  Phone,
} from "lucide-react";
import { companyInfo } from "@/data/company";

interface Message {
  id: string;
  sender: "bot" | "user";
  text: string;
  time: string;
  action?: "ask_contact" | "lead_success";
}

export default function ChatBot() {
  const { t, language, isRTL } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // Ziyaretçi iletişim bilgileri durumu
  const [hasProvidedContact, setHasProvidedContact] = useState(false);
  const [userQuestion, setUserQuestion] = useState("");

  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactCompany, setContactCompany] = useState("");
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const nowText = language === "en" ? "Now" : language === "ar" ? "الآن" : language === "es" ? "Ahora" : "Şimdi";

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome-1",
      sender: "bot",
      text: t.chatbot.welcomeMessage,
      time: nowText,
    },
  ]);

  // Dil değiştiğinde eğer henüz kullanıcı mesaj yazmamışsa karşılama mesajını güncelle
  useEffect(() => {
    setMessages((prev) => {
      if (prev.length === 1 && prev[0].id === "welcome-1") {
        return [
          {
            id: "welcome-1",
            sender: "bot",
            text: t.chatbot.welcomeMessage,
            time: nowText,
          },
        ];
      }
      return prev;
    });
  }, [language, t.chatbot.welcomeMessage, nowText]);

  const quickPrompts = t.chatbot.quickQuestions;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      setHasUnread(false);
      scrollToBottom();
    }
  }, [isOpen, messages]);

  // Akıllı Yanıt Üretimi (Çok Dilli)
  const generateBotReply = (text: string) => {
    const lower = text.toLowerCase();
    let reply = "";

    if (language === "en") {
      if (lower.includes("import") || lower.includes("duty") || lower.includes("tax")) {
        reply =
          "In import operations, Customs Duty, Additional Duty, VAT, SCT, and applicable TAREKS/TSE approvals are determined based on your product's HS Code. We manage your declarations with zero demurrage and strict legal compliance.";
      } else if (lower.includes("export") || lower.includes("abroad")) {
        reply =
          "For export operations, we issue invoices, packing lists, A.TR, EUR.1, Certificate of Origin, and handle exporter union approvals and exit confirmation seamlessly.";
      } else if (lower.includes("quote") || lower.includes("price") || lower.includes("cost")) {
        reply =
          "We offer competitive brokerage fees and precise landed duty feasibility studies for all Turkish customs ports.";
      } else {
        reply =
          "Thank you for your message. Since 1997, our licensed customs brokers have provided comprehensive foreign trade solutions across all Turkish customs offices.";
      }
      return (
        reply +
        "\n\n📋 **To enable our licensed broker to examine your shipment and provide a custom duty calculation:** Please share your name, company, and phone number below."
      );
    } else if (language === "ar") {
      if (lower.includes("استيراد") || lower.includes("جمارك") || lower.includes("ضريبة")) {
        reply =
          "في عمليات الاستيراد، يتم تحديد الرسوم الجمركية وضريبة القيمة المضافة وموافقات الفحص وفقاً للرمز الجمركي HS Code للبضاعة. نحرص على إنهاء المعاملات دون أي تأخير في الموانئ.";
      } else if (lower.includes("تصدير") || lower.includes("شحن")) {
        reply =
          "في عمليات التصدير، نتولى إصدار شهادات المنشأ A.TR و EUR.1 وموافقات اتحادات المصدرين وتسجيل البيانات الجمركية بسرعة فائقة.";
      } else if (lower.includes("سعر") || lower.includes("تكلفة")) {
        reply =
          "نقدم دراسة تكاليف مفصلة وأسعار تخليص تنافسية لكافة الموانئ والمنافذ الجمركية التركية.";
      } else {
        reply =
          "شكراً لاستفساركم. تقدم شركة قلم خدمات التخليص والاستشارات الجمركية المتكاملة في جميع المنافذ التركية منذ عام 1997.";
      }
      return (
        reply +
        "\n\n📋 **ليتمكن مستشارنا الجمركي من دراسة شحنتكم وتزويدكم بعرض سعر مخصص:** يرجى تزويدنا بالاسم ورقم الهاتف واسم الشركة أدناه."
      );
    } else if (language === "es") {
      if (lower.includes("import") || lower.includes("arancel") || lower.includes("impuesto")) {
        reply =
          "En despachos de importación, los aranceles, gravámenes compensatorios, IVA y controles TAREKS/TSE se calculan según la clasificación arancelaria HS de su mercancía. Gestionamos su expediente con cero demoras.";
      } else if (lower.includes("export") || lower.includes("salida")) {
        reply =
          "Para operaciones de exportación, tramitamos certificados de circulación A.TR, EUR.1, certificados de origen y visados de exportación con máxima agilidad.";
      } else if (lower.includes("precio") || lower.includes("cotiz") || lower.includes("presupuesto")) {
        reply =
          "Elaboramos estudios previos de costes de importación y honorarios competitivos para todas las aduanas de Turquía.";
      } else {
        reply =
          "Agradecemos su consulta. Desde 1997 prestamos servicios integrales de despacho de aduanas homologado en todas las direcciones aduaneras de Turquía.";
      }
      return (
        reply +
        "\n\n📋 **Para que nuestro agente colegiado pueda evaluar su expediente y enviarle una estimación detallada:** ¿Podría facilitarnos su nombre, empresa y teléfono a continuación?"
      );
    } else {
      // Türkçe
      if (lower.includes("ithalat") || lower.includes("getir") || lower.includes("vergi")) {
        reply =
          "İthalat işlemlerinde ürününüzün GTİP (Gümrük Tarife İstatistik Pozisyonu) koduna göre Gümrük Vergisi, İlave Gümrük Vergisi (İGV), KDV, ÖTV ve varsa TAREKS/TSE izinleri belirlenir. Liman ardiye ve navlun masraflarını önceden planlayarak dosyanızı sıfır gecikmeyle sonuçlandırıyoruz.";
      } else if (lower.includes("ihracat") || lower.includes("gönder") || lower.includes("yurtdışı")) {
        reply =
          "İhracat operasyonlarında fatura, çeki listesi ve ATR / EUR.1 / Menşe şahadetnamesi düzenlenerek ilgili ihracatçı birliği onayı ve gümrük beyannamesi tescili ivedilikle kapatılır. KDV iadesi süreçleriniz için intaç takibini Evrim portalımızdan anlık sunuyoruz.";
      } else if (lower.includes("gtip") || lower.includes("tarife") || lower.includes("kod")) {
        reply =
          "Eşyanın GTİP tespiti, ödenecek tüm vergileri ve gerekli bakanlık izinlerini belirleyen en kritik adımdır. Ürününüzün ticari tanımı, teknik özellikleri veya katalog bilgisiyle uzman gümrük müşavirliğimiz doğru GTİP tespitini yapmaktadır.";
      } else {
        reply =
          "Sorunuzu aldım. 1997'den bugüne yetkili gümrük müşavirliği ve liman operasyon ekibimizle tüm dış ticaret rejimlerinde tam yetkiyle hizmet veriyoruz.";
      }
      return (
        reply +
        "\n\n📋 **Gümrük müşavirimizin dosyanızı inceleyip size özel maliyet çalışmasıyla dönüş yapabilmesi için:** Lütfen adınızı, firmanızı ve telefon numaranızı paylaşabilir misiniz?"
      );
    }
  };

  // Kullanıcı Mesaj Gönderdiğinde
  const handleSendMessage = (textToSend?: string) => {
    const message = textToSend || inputText;
    if (!message.trim()) return;

    const userMsg: Message = {
      id: "msg-" + Date.now(),
      sender: "user",
      text: message.trim(),
      time: new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    if (!userQuestion) {
      setUserQuestion(message.trim());
    }

    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const botResponse = generateBotReply(message);
      const botMsg: Message = {
        id: "bot-" + Date.now(),
        sender: "bot",
        text: botResponse,
        time: new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" }),
        action: hasProvidedContact ? undefined : "ask_contact",
      };
      setMessages((prev) => [...prev, botMsg]);
    }, 900);
  };

  // İletişim Bilgilerini Gönder
  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactPhone || !contactName) return;

    setIsSubmittingLead(true);

    const contactSummary = `${contactName} (${contactCompany || "Corporate"}) - Tel: ${contactPhone}`;

    try {
      await fetch("/api/chat-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contactInfo: contactSummary,
          question: userQuestion || "Customs Advisory Inquiry",
          conversationHistory: messages.map((m) => ({
            sender: m.sender,
            text: m.text,
          })),
        }),
      });

      setHasProvidedContact(true);

      const successText =
        language === "en"
          ? `✅ **Thank you, ${contactName}!**\n\nYour inquiry has been relayed directly to our licensed broker. We will contact you at **${contactPhone}** shortly.`
          : language === "ar"
          ? `✅ **شكراً جزيلاً، ${contactName}!**\n\nتم تحويل استفساركم لمستشارنا الجمركي وسنتواصل معكم على الرقم **${contactPhone}** قريباً.`
          : language === "es"
          ? `✅ **¡Muchas gracias, ${contactName}!**\n\nSu consulta ha sido trasladada a nuestro agente de aduanas. Nos pondremos en contacto al teléfono **${contactPhone}** a la brevedad.`
          : `✅ **Teşekkürler Sayın ${contactName}!**\n\nTalebiniz ve sorunuz gümrük müşavirimize anında iletildi. **${contactPhone}** numaranızdan en kısa sürede sizinle irtibata geçilecektir.`;

      setMessages((prev) => [
        ...prev,
        {
          id: "bot-lead-ok-" + Date.now(),
          sender: "bot",
          text: successText,
          time: new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" }),
          action: "lead_success",
        },
      ]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmittingLead(false);
    }
  };

  const whatsappUrl = `https://wa.me/${companyInfo.whatsapp}?text=${encodeURIComponent(
    userQuestion
      ? `Merhaba Kalem Gümrük: "${userQuestion}"`
      : companyInfo.whatsappDefaultMessage
  )}`;

  const uiLabels = {
    tr: {
      askPrompt: "Müşavir Asistanına Sorun",
      namePlaceholder: "Adınız Soyadınız *",
      phonePlaceholder: "Telefon Numaranız *",
      companyPlaceholder: "Firma Adı (İsteğe bağlı)",
      submitBtn: "Müşavire İlet",
      submittingBtn: "İletiliyor...",
      waBtn: "WhatsApp'tan Dosya/Evrak Gönder",
    },
    en: {
      askPrompt: "Ask Customs Assistant",
      namePlaceholder: "Full Name *",
      phonePlaceholder: "Phone Number *",
      companyPlaceholder: "Company (Optional)",
      submitBtn: "Contact Customs Broker",
      submittingBtn: "Sending...",
      waBtn: "Send Documents via WhatsApp",
    },
    ar: {
      askPrompt: "اسأل المساعد الجمركي",
      namePlaceholder: "الاسم الكامل *",
      phonePlaceholder: "رقم الهاتف *",
      companyPlaceholder: "اسم الشركة (اختياري)",
      submitBtn: "إرسال للمستشار الجمركي",
      submittingBtn: "جارٍ الإرسال...",
      waBtn: "إرسال الوثائق عبر الواتساب",
    },
    es: {
      askPrompt: "Consulte al Asistente Aduanero",
      namePlaceholder: "Nombre y Apellidos *",
      phonePlaceholder: "Teléfono de Contacto *",
      companyPlaceholder: "Empresa (Opcional)",
      submitBtn: "Consultar con el Agente",
      submittingBtn: "Enviando...",
      waBtn: "Enviar Documentos por WhatsApp",
    },
  }[language] || {
    askPrompt: "Müşavir Asistanına Sorun",
    namePlaceholder: "Adınız Soyadınız *",
    phonePlaceholder: "Telefon Numaranız *",
    companyPlaceholder: "Firma Adı (İsteğe bağlı)",
    submitBtn: "Müşavire İlet",
    submittingBtn: "İletiliyor...",
    waBtn: "WhatsApp'tan Dosya/Evrak Gönder",
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Tetikleyici Buton */}
      {!isOpen && (
        <div className="relative group">
          {hasUnread && (
            <div className="hidden sm:flex absolute bottom-full right-0 mb-3 items-center gap-2 bg-[#1E2A3A] text-white text-xs py-2 px-3.5 rounded-2xl shadow-2xl border border-[#44B9CD]/40 animate-bounce">
              <span className="w-2 h-2 rounded-full bg-[#44B9CD] animate-ping"></span>
              <span className="font-semibold">{uiLabels.askPrompt}</span>
            </div>
          )}

          <button
            onClick={() => setIsOpen(true)}
            aria-label="Kalem Gümrük Asistanı"
            className="flex items-center justify-center w-14 h-14 bg-[#1E2A3A] hover:bg-[#2A3B50] text-[#44B9CD] hover:text-white rounded-full shadow-2xl transition-all duration-300 border-2 border-[#44B9CD] hover:scale-105 active:scale-95 cursor-pointer"
          >
            <Bot className="w-7 h-7" />
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white"></span>
          </button>
        </div>
      )}

      {/* Açık Sohbet Penceresi */}
      {isOpen && (
        <div className="w-[92vw] sm:w-[410px] h-[580px] max-h-[85vh] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* Header */}
          <div className="bg-[#1E2A3A] text-white p-4 flex items-center justify-between border-b border-slate-700">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-full bg-[#44B9CD]/20 border border-[#44B9CD]/50 flex items-center justify-center text-[#44B9CD]">
                <Bot className="w-6 h-6" />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-[#1E2A3A]"></span>
              </div>
              <div>
                <div className="font-bold text-sm flex items-center gap-1.5 text-white">
                  <span>{t.chatbot.assistantName}</span>
                </div>
                <div className="text-[11px] text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>{t.chatbot.status}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="WhatsApp"
                className="p-2 text-slate-300 hover:text-emerald-400 rounded-lg hover:bg-white/10 transition-colors"
              >
                <Phone className="w-4 h-4" />
              </a>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-slate-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Kapat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Mesaj Listesi */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/70 text-xs">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2.5 ${m.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {m.sender === "bot" && (
                  <div className="w-7 h-7 rounded-full bg-[#1E2A3A] text-[#44B9CD] flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div className="max-w-[85%] space-y-1">
                  <div
                    className={`p-3.5 rounded-2xl leading-relaxed whitespace-pre-line ${
                      m.sender === "user"
                        ? "bg-[#1E2A3A] text-white rounded-tr-xs"
                        : "bg-white text-slate-800 border border-slate-200/90 shadow-2xs rounded-tl-xs"
                    }`}
                  >
                    {m.text}
                  </div>

                  {/* İletişim Formu (Müşavir Bilgi Toplama) */}
                  {m.action === "ask_contact" && !hasProvidedContact && (
                    <form
                      onSubmit={handleLeadSubmit}
                      className="mt-2.5 p-3.5 bg-white border border-[#44B9CD]/40 rounded-2xl shadow-sm space-y-2.5 animate-in fade-in"
                    >
                      <input
                        type="text"
                        required
                        placeholder={uiLabels.namePlaceholder}
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-[#44B9CD]"
                      />
                      <input
                        type="tel"
                        required
                        placeholder={uiLabels.phonePlaceholder}
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-[#44B9CD]"
                      />
                      <input
                        type="text"
                        placeholder={uiLabels.companyPlaceholder}
                        value={contactCompany}
                        onChange={(e) => setContactCompany(e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-[#44B9CD]"
                      />
                      <button
                        type="submit"
                        disabled={isSubmittingLead}
                        className="w-full py-2 bg-[#1E2A3A] hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition disabled:opacity-50 cursor-pointer"
                      >
                        {isSubmittingLead ? uiLabels.submittingBtn : uiLabels.submitBtn}
                      </button>
                    </form>
                  )}

                  {/* Başarılı Lead Durumunda WhatsApp Aksiyonu */}
                  {m.action === "lead_success" && (
                    <div className="pt-1">
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition shadow-xs"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>{uiLabels.waBtn}</span>
                      </a>
                    </div>
                  )}

                  <div
                    className={`text-[10px] text-slate-400 px-1 ${
                      m.sender === "user" ? "text-right" : "text-left"
                    }`}
                  >
                    {m.time}
                  </div>
                </div>

                {m.sender === "user" && (
                  <div className="w-7 h-7 rounded-full bg-[#44B9CD] text-white flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-slate-400 text-xs">
                <div className="w-7 h-7 rounded-full bg-[#1E2A3A] text-[#44B9CD] flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#44B9CD] animate-bounce"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#44B9CD] animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#44B9CD] animate-bounce [animation-delay:0.4s]"></span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Hızlı Soru Çipleri */}
          {messages.length <= 3 && (
            <div className="px-4 py-2 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {quickPrompts.map((q, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSendMessage(q)}
                  className="shrink-0 px-3 py-1.5 bg-slate-100 hover:bg-[#44B9CD]/15 hover:text-[#1E2A3A] text-slate-700 rounded-full text-[11px] font-medium transition cursor-pointer border border-slate-200"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Mesaj Yazma Alanı */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={t.chatbot.inputPlaceholder}
              className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#44B9CD] transition"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-2.5 bg-[#1E2A3A] hover:bg-slate-800 text-white rounded-xl disabled:opacity-40 transition cursor-pointer"
              aria-label={t.chatbot.send}
            >
              <Send className={`w-4 h-4 ${isRTL ? "rotate-180" : ""}`} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
