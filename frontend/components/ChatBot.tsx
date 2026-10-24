"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { usePathname } from "next/navigation";
import {
  X,
  Send,
  Bot,
  User,
  CheckCircle2,
  Phone,
  MessageSquare,
} from "lucide-react";
import { companyInfo } from "@/data/company";
import { getLocalizedWhatsAppMessage } from "@/lib/whatsappMessages";

interface Message {
  id: string;
  sender: "bot" | "user";
  text: string;
  time: string;
}

export default function ChatBot() {
  const pathname = usePathname();
  const { language, isRTL } = useLanguage();

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const [isOpen, setIsOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // Oturum ve Referans Kodu (WhatsApp ve CRM için)
  const [sessionId] = useState(() => `sess-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`);
  const [refCode] = useState(() => `TK-CHAT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`);

  // Ziyaretçi iletişim ve mesaj sınırlaması durumu
  const [userMessageCount, setUserMessageCount] = useState(0);
  const MAX_MESSAGES = 5;
  const MAX_CHARS = 200;

  const [hasProvidedContact, setHasProvidedContact] = useState(false);
  const [userFirstQuestion, setUserFirstQuestion] = useState("");

  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactCompany, setContactCompany] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);
  const [, setLeadSuccessMsg] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const nowText = useMemo(() => {
    switch (language) {
      case "en":
        return "Now";
      case "ar":
        return "الآن";
      case "es":
        return "Ahora";
      case "tr":
      default:
        return "Şimdi";
    }
  }, [language]);

  const welcomeText = useMemo(() => {
    switch (language) {
      case "en":
        return "Hello! Welcome to Kalem Customs Advisory Assistant. Please write your customs clearance, import, export, or foreign trade inquiry here. Your request will be forwarded directly to our licensed customs broker.";
      case "ar":
        return "مرحباً بكم في مساعد قلم للاستشارات الجمركية! يمكنكم كتابة استفساركم حول عمليات التخليص الجمركي، الاستيراد، التصدير أو اللوائح هنا، وسيتم تحويله مباشرة إلى مستشارنا الجمركي المعتمد.";
      case "es":
        return "¡Hola! Bienvenido al asistente de asesoría de Kalem Aduanas. Puede enviar su consulta sobre despacho aduanero, importación, exportación o normativa exterior aquí. Su mensaje se remitirá directamente a nuestro agente colegiado.";
      case "tr":
      default:
        return "Merhaba! Kalem Gümrük Danışma Asistanına hoş geldiniz. İthalat, ihracat, mevzuat veya danışmanlık talebinizi buraya yazabilirsiniz. Yazdıklarınız doğrudan yetkili gümrük müşavirimize iletilecektir.";
    }
  }, [language]);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome-1",
      sender: "bot",
      text: welcomeText,
      time: nowText,
    },
  ]);

  // Kullanıcı henüz mesaj atmadıysa ve dil değişirse karşılama mesajını otomatik güncelle
  useEffect(() => {
    if (userMessageCount === 0) {
      setMessages([
        {
          id: "welcome-1",
          sender: "bot",
          text: welcomeText,
          time: nowText,
        },
      ]);
    }
  }, [language, welcomeText, nowText, userMessageCount]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      setHasUnread(false);
      scrollToBottom();
    }
  }, [isOpen, messages]);

  // WhatsApp Yönlendirme Linki (Chat Referansı ve Soru Özetiyle, Aktif Dilde Dinamik Üretilir)
  const whatsappUrl = useMemo(() => {
    const waText = getLocalizedWhatsAppMessage({
      type: "chatbot",
      lang: language,
      refCode,
      topic: userFirstQuestion,
    });
    return `https://wa.me/${companyInfo.whatsapp}?text=${encodeURIComponent(waText)}`;
  }, [refCode, userFirstQuestion, language]);

  // Kullanıcı Mesaj Gönderdiğinde
  const handleSendMessage = async (customText?: string) => {
    const rawText = customText || inputText;
    const trimmed = rawText.trim();
    if (!trimmed) return;

    if (userMessageCount >= MAX_MESSAGES) {
      return;
    }

    const currentMsgCount = userMessageCount + 1;
    setUserMessageCount(currentMsgCount);

    const timeString = new Date().toLocaleTimeString(
      language === "en" ? "en-GB" : language === "ar" ? "ar-EG" : language === "es" ? "es-ES" : "tr-TR",
      { hour: "2-digit", minute: "2-digit" }
    );

    const userMsg: Message = {
      id: "msg-" + Date.now(),
      sender: "user",
      text: trimmed,
      time: timeString,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");

    if (!userFirstQuestion) {
      setUserFirstQuestion(trimmed);
    }

    // CRM'e anlık mesaj kaydı yap (Aktif Dil Parametresiyle)
    fetch("/api/chat-lead/message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId,
        lang: language,
        message: trimmed,
        sender: "user",
      }),
    }).catch((err) => console.error("[Chat sync error]:", err));

    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);

      let botReply = "";
      const remaining = MAX_MESSAGES - currentMsgCount;

      if (currentMsgCount === 1) {
        switch (language) {
          case "en":
            botReply = `Thank you for the details. You can add more information if needed (remaining messages: ${remaining}). To allow our licensed customs broker to review your file and contact you directly, please provide your contact details below.`;
            break;
          case "ar":
            botReply = `شكراً لتوضيحكم وتزويدنا بهذه المعلومات. يمكنكم إضافة مزيد من التفاصيل (الرسائل المتبقية: ${remaining}). ليتسنى لمستشارنا الجمركي دراسة ملفكم والتواصل معكم مباشرة، يرجى ملء بيانات الاتصال أدناه.`;
            break;
          case "es":
            botReply = `Gracias por su mensaje. Puede añadir más detalles si lo desea (mensajes restantes: ${remaining}). Para que nuestro agente de aduanas pueda examinar su consulta y responderle directamente, complete sus datos de contacto abajo.`;
            break;
          case "tr":
          default:
            botReply = `Notunuzu ve talebinizi aldım. Eklemek istediğiniz başka detaylar varsa yazabilirsiniz (kalan hakkınız: ${remaining}). Gümrük müşavirimizin dosyanızı inceleyip doğrudan size dönüş yapabilmesi için lütfen aşağıdaki iletişim bilgilerinizi iletiniz.`;
            break;
        }
      } else if (currentMsgCount >= MAX_MESSAGES) {
        switch (language) {
          case "en":
            botReply = "You have reached the 5-message consultation limit. Please fill out your contact details below so our customs broker can review your file and reply promptly.";
            break;
          case "ar":
            botReply = "لقد بلغت الحد الأقصى للاستشارة (5 رسائل). يرجى إدخال بيانات الاتصال في النموذج أدناه ليتمكن المستشار الجمركي من الرد عليكم فوراً.";
            break;
          case "es":
            botReply = "Ha alcanzado el límite de 5 mensajes de consulta. Por favor, complete sus datos en el formulario inferior para que nuestro agente pueda responderle a la brevedad.";
            break;
          case "tr":
          default:
            botReply = "5 mesajlık soru/talep iletme limitinize ulaştınız. Gümrük müşavirimizin dosyanızı detaylıca inceleyip size dönüş yapabilmesi için lütfen aşağıdaki formu doldurunuz.";
            break;
        }
      } else {
        switch (language) {
          case "en":
            botReply = `Noted. You have ${remaining} message(s) left. Don't forget to submit your contact details below so our broker can reach you.`;
            break;
          case "ar":
            botReply = `تم تسجيل رسالتكم الإضافية (تبقى لديكم ${remaining} رسائل). يرجى إدخال بيانات الاتصال أدناه حتى يتمكن المستشار من الاتصال بكم.`;
            break;
          case "es":
            botReply = `Mensaje registrado (mensajes restantes: ${remaining}). No olvide indicar sus datos abajo para que el agente pueda contactarle.`;
            break;
          case "tr":
          default:
            botReply = `Ek mesajınızı kaydettim (Kalan mesaj hakkınız: ${remaining}). Müşavirimizin arayabilmesi için lütfen iletişim bilgilerinizi aşağıdaki formdan onaylayınız.`;
            break;
        }
      }

      setMessages((prev) => [
        ...prev,
        {
          id: "bot-" + Date.now(),
          sender: "bot",
          text: botReply,
          time: new Date().toLocaleTimeString(
            language === "en" ? "en-GB" : language === "ar" ? "ar-EG" : language === "es" ? "es-ES" : "tr-TR",
            { hour: "2-digit", minute: "2-digit" }
          ),
        },
      ]);
    }, 600);
  };

  // İletişim Bilgilerini Gönder (CRM'e kaydet ve mail gönder)
  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactPhone.trim() || !contactName.trim()) return;

    if (honeypot) {
      setHasProvidedContact(true);
      return;
    }

    setIsSubmittingLead(true);

    const contactSummary = `${contactName.trim()} (${contactCompany.trim() || "Bireysel"}) - Tel: ${contactPhone.trim()} [Lang: ${language}]`;

    try {
      const res = await fetch("/api/chat-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          lang: language,
          contactName: contactName.trim(),
          contactPhone: contactPhone.trim(),
          contactCompany: contactCompany.trim(),
          contactInfo: contactSummary,
          question: userFirstQuestion || "Chatbot Danışma Talebi",
          honeypot,
          messages: messages.map((m) => ({
            sender: m.sender,
            text: m.text,
            time: m.time,
          })),
        }),
      });

      const data = await res.json();
      setHasProvidedContact(true);

      let fallbackSuccess = "";
      switch (language) {
        case "en":
          fallbackSuccess = `✅ Thank you, ${contactName}! Your inquiry and contact details have been successfully forwarded to our customs broker under reference #${refCode}. We will reach out to you shortly.`;
          break;
        case "ar":
          fallbackSuccess = `✅ شكراً لكم سيد/سيدة ${contactName}! تم إرسال استفساركم وبيانات التواصل بنجاح إلى المستشار الجمركي تحت الرقم المرجعي #${refCode}. سنتواصل معكم في أقرب وقت.`;
          break;
        case "es":
          fallbackSuccess = `✅ ¡Muchas gracias, ${contactName}! Su consulta y datos de contacto han sido remitidos con éxito a nuestro agente de aduanas con la referencia #${refCode}. Nos pondremos en contacto muy pronto.`;
          break;
        case "tr":
        default:
          fallbackSuccess = `✅ Teşekkürler Sayın ${contactName}! Mesajlarınız ve iletişim bilgileriniz gümrük müşavirimize (#${refCode}) referansıyla başarıyla iletildi. En kısa sürede sizinle irtibata geçilecektir.`;
          break;
      }

      const successText = data.message || fallbackSuccess;
      setLeadSuccessMsg(successText);

      setMessages((prev) => [
        ...prev,
        {
          id: "bot-lead-ok-" + Date.now(),
          sender: "bot",
          text: successText,
          time: new Date().toLocaleTimeString(
            language === "en" ? "en-GB" : language === "ar" ? "ar-EG" : language === "es" ? "es-ES" : "tr-TR",
            { hour: "2-digit", minute: "2-digit" }
          ),
        },
      ]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmittingLead(false);
    }
  };

  // WhatsApp Butonuna Tıklandığında CRM'e Log At ve Mail Gönder
  const handleWhatsAppClick = () => {
    fetch("/api/chat-lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId,
        lang: language,
        contactInfo: `WhatsApp Referral [${language.toUpperCase()}]`,
        question: userFirstQuestion || "WhatsApp Danışma Yönlendirmesi",
        messages: messages.map((m) => ({
          sender: m.sender,
          text: m.text,
          time: m.time,
        })),
      }),
    }).catch((err) => console.error("[WhatsApp log error]:", err));
  };

  const uiLabels = useMemo(() => {
    const remaining = MAX_MESSAGES - userMessageCount;
    switch (language) {
      case "en":
        return {
          askPrompt: "Submit Inquiry to Broker",
          title: "Kalem Customs Desk",
          subTitle: "Licensed Broker Advisory",
          leadHeader: "For Our Customs Broker to Contact You:",
          namePlaceholder: "Full Name *",
          phonePlaceholder: "Phone Number *",
          companyPlaceholder: "Company Name (Optional)",
          submitBtn: "Forward to Broker",
          submittingBtn: "Sending...",
          waBtn: "Chat on WhatsApp",
          inputPlaceholder: "Type your customs inquiry...",
          msgLimitText: `Remaining messages: ${remaining} / ${MAX_MESSAGES}`,
          charsLabel: "chars",
          limitReached: "You reached the 5-message limit. Please share your contact details below.",
          leadForwardedWa: "Inquiry forwarded. For urgent queries, continue on WhatsApp:",
        };
      case "ar":
        return {
          askPrompt: "إرسال استفسار للمستشار",
          title: "مساعد قلم الجمركي",
          subTitle: "مكتب استشارات التخليص المعتمد",
          leadHeader: "لكي يتمكن مستشارنا الجمركي من التواصل معكم:",
          namePlaceholder: "الاسم الكامل *",
          phonePlaceholder: "رقم الهاتف *",
          companyPlaceholder: "اسم الشركة (اختياري)",
          submitBtn: "إرسال للمستشار الجمركي",
          submittingBtn: "جارٍ الإرسال...",
          waBtn: "المحادثة عبر الواتساب",
          inputPlaceholder: "اكتب استفسارك الجمركي...",
          msgLimitText: `الرسائل المتبقية: ${remaining} / ${MAX_MESSAGES}`,
          charsLabel: "حرف",
          limitReached: "بلغت الحد الأقصى للرسائل (5). يرجى إدخال بيانات الاتصال أدناه.",
          leadForwardedWa: "تم تحويل الطلب للمستشار. للاستفسار العاجل، تابع عبر الواتساب:",
        };
      case "es":
        return {
          askPrompt: "Consultar con el Agente",
          title: "Asistente Kalem Aduanas",
          subTitle: "Mesa de Asesoría Aduanera",
          leadHeader: "Para que nuestro agente pueda contactarle:",
          namePlaceholder: "Nombre y Apellidos *",
          phonePlaceholder: "Teléfono de Contacto *",
          companyPlaceholder: "Empresa (Opcional)",
          submitBtn: "Enviar al Agente de Aduanas",
          submittingBtn: "Enviando...",
          waBtn: "Escribir por WhatsApp",
          inputPlaceholder: "Escriba su consulta aquí...",
          msgLimitText: `Mensajes restantes: ${remaining} / ${MAX_MESSAGES}`,
          charsLabel: "caracteres",
          limitReached: "Límite de 5 mensajes alcanzado. Facilítenos sus datos de contacto abajo.",
          leadForwardedWa: "Consulta enviada. Si es urgente, continúe por WhatsApp:",
        };
      case "tr":
      default:
        return {
          askPrompt: "Müşavire Soru / Talep İletin",
          title: "Kalem Gümrük Asistanı",
          subTitle: "Müşavir İletişim Masası",
          leadHeader: "Müşavirimizin Size Dönüş Yapabilmesi İçin:",
          namePlaceholder: "Adınız Soyadınız *",
          phonePlaceholder: "Telefon Numaranız *",
          companyPlaceholder: "Firma Adı (varsa)",
          submitBtn: "Müşavirimize İlet",
          submittingBtn: "İletiliyor...",
          waBtn: "WhatsApp'tan Müşavire Yaz",
          inputPlaceholder: "Talebinizi veya sorunuzu yazınız...",
          msgLimitText: `Kalan mesaj hakkınız: ${remaining} / ${MAX_MESSAGES}`,
          charsLabel: "karakter",
          limitReached: "Maksimum 5 mesaj sınırına ulaştınız. Lütfen iletişim bilgilerinizi giriniz.",
          leadForwardedWa: "Müşavire iletildi. Acilse WhatsApp'tan devam edin:",
        };
    }
  }, [language, userMessageCount]);

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
        <div
          dir={isRTL ? "rtl" : "ltr"}
          className="w-[92vw] sm:w-[420px] h-[610px] max-h-[88vh] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200"
        >
          {/* Header */}
          <div className="bg-[#1E2A3A] text-white p-4 flex items-center justify-between border-b border-slate-700">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-full bg-[#44B9CD]/20 border border-[#44B9CD]/50 flex items-center justify-center text-[#44B9CD]">
                <Bot className="w-6 h-6" />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-[#1E2A3A]"></span>
              </div>
              <div>
                <div className="font-bold text-sm flex items-center gap-1.5 text-white">
                  <span>{uiLabels.title}</span>
                </div>
                <div className="text-[11px] text-[#44B9CD] flex items-center gap-1">
                  <span>Ref: #{refCode}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {/* WhatsApp Butonu (Chat Referansıyla ve Kullanıcının Diliyle) */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleWhatsAppClick}
                title="WhatsApp"
                className="p-2 text-emerald-400 hover:text-white hover:bg-emerald-600/30 rounded-xl transition-colors flex items-center gap-1 text-xs"
              >
                <Phone className="w-4 h-4" />
                <span className="hidden sm:inline font-semibold">WhatsApp</span>
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
                  <div className="w-7 h-7 rounded-full bg-[#1E2A3A] text-[#44B9CD] flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
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
                  <div
                    className={`text-[10px] text-slate-400 px-1 ${
                      m.sender === "user" ? "text-right" : "text-left"
                    }`}
                  >
                    {m.time}
                  </div>
                </div>

                {m.sender === "user" && (
                  <div className="w-7 h-7 rounded-full bg-[#44B9CD] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
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

            {/* İletişim Bilgisi Formu (En az 1 mesaj yazıldıktan sonra veya 5 mesaja ulaşıldığında) */}
            {userMessageCount >= 1 && !hasProvidedContact && (
              <div className="mt-4 p-4 bg-white border border-[#44B9CD]/40 rounded-2xl shadow-sm space-y-3 animate-in fade-in">
                <div className="flex items-center gap-2 text-slate-800 font-semibold text-xs border-b border-slate-100 pb-2">
                  <MessageSquare className="w-4 h-4 text-[#44B9CD]" />
                  <span>{uiLabels.leadHeader}</span>
                </div>
                <form onSubmit={handleLeadSubmit} className="space-y-2.5">
                  {/* Honeypot Spam Koruması */}
                  <input
                    type="text"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                    className="hidden"
                    tabIndex={-1}
                    autoComplete="off"
                  />

                  <input
                    type="text"
                    required
                    maxLength={80}
                    placeholder={uiLabels.namePlaceholder}
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-[#44B9CD] bg-slate-50/50"
                  />
                  <input
                    type="tel"
                    required
                    maxLength={30}
                    placeholder={uiLabels.phonePlaceholder}
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-[#44B9CD] bg-slate-50/50"
                  />
                  <input
                    type="text"
                    maxLength={100}
                    placeholder={uiLabels.companyPlaceholder}
                    value={contactCompany}
                    onChange={(e) => setContactCompany(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-[#44B9CD] bg-slate-50/50"
                  />
                  <button
                    type="submit"
                    disabled={isSubmittingLead || !contactName.trim() || !contactPhone.trim()}
                    className="w-full py-2.5 bg-[#1E2A3A] hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition disabled:opacity-50 cursor-pointer shadow-xs"
                  >
                    {isSubmittingLead ? uiLabels.submittingBtn : uiLabels.submitBtn}
                  </button>
                </form>
              </div>
            )}

            {/* İletişim Bilgisi Gönderildikten Sonra WhatsApp Desteği */}
            {hasProvidedContact && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-emerald-800 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{uiLabels.leadForwardedWa}</span>
                </div>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleWhatsAppClick}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition shrink-0"
                >
                  WhatsApp
                </a>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Mesaj Sınırı ve Karakter Sayacı Bilgi Barı */}
          <div className="px-4 py-1.5 bg-slate-100 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
            <span>{uiLabels.msgLimitText}</span>
            <span className={inputText.length > 180 ? "text-amber-600 font-bold" : "text-slate-400"}>
              {inputText.length} / {MAX_CHARS} {uiLabels.charsLabel}
            </span>
          </div>

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
              maxLength={MAX_CHARS}
              disabled={userMessageCount >= MAX_MESSAGES}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                userMessageCount >= MAX_MESSAGES ? uiLabels.limitReached : uiLabels.inputPlaceholder
              }
              className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#44B9CD] transition disabled:bg-slate-100 disabled:cursor-not-allowed"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || userMessageCount >= MAX_MESSAGES}
              className="p-2.5 bg-[#1E2A3A] hover:bg-slate-800 text-white rounded-xl disabled:opacity-40 transition cursor-pointer"
              aria-label="Gönder"
            >
              <Send className={`w-4 h-4 ${isRTL ? "rotate-180" : ""}`} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
