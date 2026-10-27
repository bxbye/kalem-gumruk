"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import Link from "next/link";
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
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { companyInfo } from "@/data/company";
import { getLocalizedWhatsAppMessage } from "@/lib/whatsappMessages";

interface Message {
  id: string;
  sender: "bot" | "user";
  text: string;
  time: string;
  link?: {
    href: string;
    text: string;
  };
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

  // Oturum ve Referans Kodu
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
  const [kvkkConsent, setKvkkConsent] = useState(false);
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
        return "Welcome to Kalem Customs Brokerage Desk. You can submit your customs clearance, import, export, or regulatory questions here. Your inquiry will be forwarded directly to our licensed customs broker.";
      case "ar":
        return "مرحباً بكم في مكتب قلم للاستشارات الجمركية. يمكنكم كتابة استفساراتكم حول التخليص الجمركي، الاستيراد، التصدير أو اللوائح هنا لتصل مباشرة إلى المستشار الجمركي المعتمد.";
      case "es":
        return "Bienvenido a la mesa de asesoría de Kalem Aduanas. Puede enviar su consulta sobre despacho aduanero, importación o exportación aquí. Se remitirá directamente a nuestro agente colegiado.";
      case "tr":
      default:
        return "Kalem Gümrük Danışma Masasına hoş geldiniz. İthalat, ihracat, tarife veya mevzuat sorularınızı buraya yazabilirsiniz. Talebiniz doğrudan yetkili gümrük müşavirimize iletilecektir.";
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

  // Karşılama mesajını dil değişiminde güncelle
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

  // WhatsApp Yönlendirme Linki
  const whatsappUrl = useMemo(() => {
    const waText = getLocalizedWhatsAppMessage({
      type: "chatbot",
      lang: language,
      refCode,
      topic: userFirstQuestion,
    });
    return `https://wa.me/${companyInfo.whatsapp}?text=${encodeURIComponent(waText)}`;
  }, [refCode, userFirstQuestion, language]);

  // Kullanıcının yazdığı mesaja göre kısa ve net kurumsal yönlendirme
  const getSmartBotReply = (text: string, currentCount: number): { text: string; link?: { href: string; text: string } } => {
    const lower = text.toLowerCase();

    // 1. İthalat
    if (
      lower.includes("ithalat") ||
      lower.includes("ithal") ||
      lower.includes("gumruk vergisi") ||
      lower.includes("gümrük vergisi") ||
      lower.includes("import") ||
      lower.includes("arancel") ||
      lower.includes("استيراد")
    ) {
      return {
        text:
          language === "en"
            ? "For import regulations, duties, and operational procedures, please visit our Import Services page."
            : language === "ar"
            ? "للاطلاع على إجراءات الاستيراد والرسوم الجمركية، يرجى مراجعة صفحة خدمات الاستيراد."
            : language === "es"
            ? "Para normativas de importación y aranceles, consulte nuestra página de Importación."
            : "İthalat mevzuatı, vergilendirme ve gümrükleme süreçleri hakkında detaylı bilgiye İthalat sayfamızdan ulaşabilirsiniz.",
        link: {
          href: `/${language}/hizmetlerimiz/ithalat-gumrukleme-islemleri`,
          text:
            language === "en"
              ? "View Import Services"
              : language === "ar"
              ? "صفحة الاستيراد"
              : language === "es"
              ? "Ver Importación"
              : "İthalat Hizmetleri Sayfası",
        },
      };
    }

    // 2. İhracat
    if (
      lower.includes("ihracat") ||
      lower.includes("ihrac") ||
      lower.includes("atr") ||
      lower.includes("eur1") ||
      lower.includes("mensei") ||
      lower.includes("menşei") ||
      lower.includes("export") ||
      lower.includes("تصدير") ||
      lower.includes("exportacion")
    ) {
      return {
        text:
          language === "en"
            ? "For export declarations, origin, and movement certificates (A.TR, EUR.1), please review our Export Services page."
            : language === "ar"
            ? "للحصول على معلومات حول الإقرارات التصديرية وشهادات المنشأ، يرجى مراجعة صفحة خدمات التصدير."
            : language === "es"
            ? "Para declaraciones de exportación y certificados de origen, consulte nuestra página de Exportación."
            : "İhracat beyannamesi, dolaşım belgeleri (A.TR, EUR.1) ve operasyon detayları için İhracat sayfamızı inceleyebilirsiniz.",
        link: {
          href: `/${language}/hizmetlerimiz/ihracat-gumrukleme-islemleri`,
          text:
            language === "en"
              ? "View Export Services"
              : language === "ar"
              ? "صفحة التصدير"
              : language === "es"
              ? "Ver Exportación"
              : "İhracat Hizmetleri Sayfası",
        },
      };
    }

    // 3. Transit & Antrepo
    if (
      lower.includes("transit") ||
      lower.includes("antrepo") ||
      lower.includes("serbest bolge") ||
      lower.includes("serbest bölge") ||
      lower.includes("depolama") ||
      lower.includes("warehouse") ||
      lower.includes("ترانزيت") ||
      lower.includes("مستودع")
    ) {
      return {
        text:
          language === "en"
            ? "For transit accompanying documents (NCTS) and bonded warehouse solutions, please visit our Warehousing page."
            : language === "ar"
            ? "لإجراءات الترانزيت والتخزين الجمركي، يرجى مراجعة صفحة الترانزيت والمستودعات."
            : language === "es"
            ? "Para tránsito y depósitos aduaneros, consulte nuestra página de Tránsito y Almacén."
            : "Transit refakat belgesi (NCTS) ve antrepo depolama çözümleri için Transit ve Antrepo sayfamızı inceleyebilirsiniz.",
        link: {
          href: `/${language}/hizmetlerimiz/transit-ve-antrepo-hizmetleri`,
          text:
            language === "en"
              ? "View Warehousing"
              : language === "ar"
              ? "صفحة المستودعات"
              : language === "es"
              ? "Ver Tránsito"
              : "Transit & Antrepo Sayfası",
        },
      };
    }

    // 4. Mevzuat, Sirküler & GTİP
    if (
      lower.includes("mevzuat") ||
      lower.includes("sirkuler") ||
      lower.includes("sirküler") ||
      lower.includes("gtip") ||
      lower.includes("gti̇p") ||
      lower.includes("tarife") ||
      lower.includes("kanun") ||
      lower.includes("hs code") ||
      lower.includes("circular") ||
      lower.includes("تعميم")
    ) {
      return {
        text:
          language === "en"
            ? "For the latest customs circulars and official trade regulations, please visit our Circulars page."
            : language === "ar"
            ? "للاطلاع على أحدث التعاميم واللوائح الجمركية الرسمية، يرجى زيارة صفحة التعاميم."
            : language === "es"
            ? "Para las últimas circulares y normativas aduaneras oficiales, visite nuestra página de Circulares."
            : "Güncel gümrük mevzuatı değişiklikleri ve tarife sirküleri için Sirküler sayfamızı inceleyebilirsiniz.",
        link: {
          href: `/${language}/sirkuler`,
          text:
            language === "en"
              ? "View Circulars"
              : language === "ar"
              ? "صفحة التعاميم"
              : language === "es"
              ? "Ver Circulares"
              : "Sirkülerleri İncele",
        },
      };
    }

    // 5. Belgeler & Vekaletname
    if (
      lower.includes("vekalet") ||
      lower.includes("vekaletname") ||
      lower.includes("belge") ||
      lower.includes("evrak") ||
      lower.includes("noter") ||
      lower.includes("document") ||
      lower.includes("power of attorney") ||
      lower.includes("وكالة")
    ) {
      return {
        text:
          language === "en"
            ? "Standard notary power of attorney templates and required forms are available on our Documents page."
            : language === "ar"
            ? "نماذج الوكالات الرسمية والاستمارات المطلوبة متاحة للتحميل في صفحة الوثائق."
            : language === "es"
            ? "Las plantillas de poder notarial y formularios oficiales están disponibles en la página de Documentos."
            : "Gümrükleme işlemleri için standart noter vekaletname örneği ve işlem formlarına Belgeler sayfamızdan ulaşabilirsiniz.",
        link: {
          href: `/${language}/belgeler`,
          text:
            language === "en"
              ? "View Documents"
              : language === "ar"
              ? "صفحة الوثائق"
              : language === "es"
              ? "Ver Documentos"
              : "Belgeler Sayfası",
        },
      };
    }

    // 6. Fiyat & Teklif
    if (
      lower.includes("fiyat") ||
      lower.includes("teklif") ||
      lower.includes("ucret") ||
      lower.includes("ücret") ||
      lower.includes("maliyet") ||
      lower.includes("quote") ||
      lower.includes("price") ||
      lower.includes("سعر")
    ) {
      return {
        text:
          language === "en"
            ? "For a customs quote, you can fill out our form or leave your contact details below for a broker review."
            : language === "ar"
            ? "للحصول على عرض سعر فوري، يمكنكم تعبئة نموذج صفحة الاتصال أو إدخال بياناتكم أدناه."
            : language === "es"
            ? "Para cotizaciones aduaneras, complete nuestro formulario o deje sus datos de contacto abajo."
            : "Gümrükleme hizmetlerimiz için fiyat teklifi almak istiyorsanız aşağıdaki form bağlantısına tıklayabilir veya İletişim sayfamızı ziyaret edebilirsiniz.",
        link: {
          href: `/${language}/hizmetlerimiz#randevu-teklif`,
          text:
            language === "en"
              ? "Price Quote Request Form"
              : language === "ar"
              ? "نموذج طلب عرض السعر"
              : language === "es"
              ? "Formulario de Solicitud de Cotización"
              : "Fiyat Teklifi İsteme Formu",
        },
      };
    }

    // 7. İletişim & Adres
    if (
      lower.includes("adres") ||
      lower.includes("nerede") ||
      lower.includes("telefon") ||
      lower.includes("numara") ||
      lower.includes("konum") ||
      lower.includes("address") ||
      lower.includes("phone") ||
      lower.includes("عنوان") ||
      lower.includes("هاتف")
    ) {
      return {
        text:
          language === "en"
            ? "You can view our Istanbul headquarters address and direct contact information on our Contact page."
            : language === "ar"
            ? "تجدون بيانات الاتصال وعنوان مكتبنا الرئيسي في إسطنبول في صفحة الاتصال."
            : language === "es"
            ? "Puede consultar la dirección de nuestra sede en Estambul y teléfonos en la página de Contacto."
            : "İstanbul Ümraniye merkez ofisimiz ve operasyon birimlerimizin iletişim bilgilerine İletişim sayfasından ulaşabilirsiniz.",
        link: {
          href: `/${language}/iletisim`,
          text:
            language === "en"
              ? "Contact Info"
              : language === "ar"
              ? "معلومات الاتصال"
              : language === "es"
              ? "Información de Contacto"
              : "İletişim Bilgileri",
        },
      };
    }

    // 8. Kariyer & Staj
    if (
      lower.includes("kariyer") ||
      lower.includes("staj") ||
      lower.includes("cv") ||
      lower.includes("ise alim") ||
      lower.includes("işe alım") ||
      lower.includes("career") ||
      lower.includes("وظيفة") ||
      lower.includes("تدريب")
    ) {
      return {
        text:
          language === "en"
            ? "You can check our open positions and submit your resume via our Careers page."
            : language === "ar"
            ? "يمكنكم الاطلاع على الوظائف الشاغرة والتقديم عبر صفحة التوظيف."
            : language === "es"
            ? "Puede consultar las vacantes disponibles y enviar su CV en la página de Empleo."
            : "Açık pozisyonlar ve staj başvuruları için Kariyer sayfamızı ziyaret edebilirsiniz.",
        link: {
          href: `/${language}/kariyer`,
          text:
            language === "en"
              ? "Careers Page"
              : language === "ar"
              ? "صفحة التوظيف"
              : language === "es"
              ? "Página de Empleo"
              : "Kariyer Sayfası",
        },
      };
    }

    // 9. Varsayılan (Kısa, kurumsal, laf kalabalığı yapmayan yanıt)
    if (currentCount >= MAX_MESSAGES) {
      return {
        text:
          language === "en"
            ? "You have reached the 5-message consultation limit. Please fill out your contact details below so our licensed customs broker can review your file and contact you directly."
            : language === "ar"
            ? "لقد بلغت الحد الأقصى للاستشارة (5 رسائل). يرجى إدخال بيانات الاتصال أدناه ليتمكن المستشار الجمركي المعتمد من مراجعة طلبكم والتواصل معكم مباشرة."
            : language === "es"
            ? "Ha alcanzado el límite de 5 mensajes de consulta. Por favor, complete sus datos abajo para que nuestro agente colegiado pueda revisar su caso y responderle."
            : "5 mesajlık danışma limitine ulaştınız. Gümrük müşavirimizin dosyanızı doğrudan inceleyip tarafınıza dönüş yapabilmesi için lütfen aşağıdaki formu doldurunuz.",
      };
    }

    return {
      text:
        language === "en"
          ? "Your inquiry has been registered. To allow our customs broker to evaluate your inquiry and reply directly, please provide your contact details below."
          : language === "ar"
          ? "تم تسجيل استفساركم. ليتسنى للمستشار الجمركي دراسة ملفكم والتواصل معكم مباشرة، يرجى ملء بيانات الاتصال أدناه."
          : language === "es"
          ? "Consulta registrada. Para que nuestro agente de aduanas revise su expediente y le responda directamente, indique sus datos abajo."
          : "Talebiniz kaydedilmiştir. Yetkili gümrük müşavirimizin konuyu değerlendirip size doğrudan dönüş yapabilmesi için aşağıdaki formu doldurabilirsiniz.",
    };
  };

  // Kullanıcı Mesaj Gönderdiğinde
  const handleSendMessage = async (customText?: string) => {
    const rawText = customText || inputText;
    const trimmed = rawText.trim();
    if (!trimmed) return;

    if (userMessageCount >= MAX_MESSAGES || hasProvidedContact) {
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

    // CRM'e anlık mesaj kaydı yap
    fetch("/api/chat-lead/message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId,
        refCode,
        lang: language,
        message: trimmed,
        sender: "user",
      }),
    }).catch((err) => console.error("[Chat sync error]:", err));

    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const reply = getSmartBotReply(trimmed, currentMsgCount);

      setMessages((prev) => [
        ...prev,
        {
          id: "bot-" + Date.now(),
          sender: "bot",
          text: reply.text,
          link: reply.link,
          time: new Date().toLocaleTimeString(
            language === "en" ? "en-GB" : language === "ar" ? "ar-EG" : language === "es" ? "es-ES" : "tr-TR",
            { hour: "2-digit", minute: "2-digit" }
          ),
        },
      ]);
    }, 450);
  };

  // İletişim Bilgilerini Gönder (CRM'e kaydet, yetkili müşavir mailine gönder ve konuyu kapat)
  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactPhone.trim() || !contactName.trim()) return;

    if (!kvkkConsent) {
      alert("Lütfen KVKK aydınlatma metnini onaylayınız.");
      return;
    }

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
          refCode,
          lang: language,
          contactName: contactName.trim(),
          contactPhone: contactPhone.trim(),
          contactCompany: contactCompany.trim(),
          contactInfo: contactSummary,
          question: userFirstQuestion || "Chatbot Danışma Talebi",
          honeypot,
          kvkkConsent,
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
          fallbackSuccess = `Thank you, ${contactName}. Your inquiry and message history have been forwarded to our licensed customs broker under reference #${refCode}. We will contact you shortly.`;
          break;
        case "ar":
          fallbackSuccess = `شكراً لكم سيد/سيدة ${contactName}. تم إرسال استفساركم وسجل المحادثة إلى المستشار الجمركي المعتمد برقم المرجع #${refCode}. سنتواصل معكم في أقرب وقت.`;
          break;
        case "es":
          fallbackSuccess = `Muchas gracias, ${contactName}. Su consulta e historial han sido remitidos a nuestro agente de aduanas con la referencia #${refCode}. Nos pondremos en contacto a la brevedad.`;
          break;
        case "tr":
        default:
          fallbackSuccess = `Teşekkür ederiz Sayın ${contactName}. Talebiniz ve mesaj geçmişiniz yetkili gümrük müşavirimize (#${refCode}) referansıyla başarıyla iletilmiştir. Tarafınızla en kısa sürede irtibat kurulacaktır.`;
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

  const handleWhatsAppClick = () => {
    fetch("/api/chat-lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId,
        refCode,
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
          leadHeader: "To Forward Your File to Licensed Customs Broker:",
          namePlaceholder: "Full Name *",
          phonePlaceholder: "Phone Number *",
          companyPlaceholder: "Company Name (Optional)",
          submitBtn: "Forward to Broker",
          submittingBtn: "Transmitting...",
          waBtn: "Chat on WhatsApp",
          inputPlaceholder: "Type your customs inquiry...",
          msgLimitText: `Remaining messages: ${remaining} / ${MAX_MESSAGES}`,
          charsLabel: "chars",
          limitReached: "You reached the 5-message limit. Please share your contact details below.",
          leadForwardedWa: "Inquiry forwarded. For urgent queries, continue on WhatsApp:",
          topicClosed: "Inquiry closed. Forwarded to licensed customs broker.",
        };
      case "ar":
        return {
          askPrompt: "إرسال استفسار للمستشار",
          title: "مساعد قلم الجمركي",
          subTitle: "مكتب استشارات التخليص المعتمد",
          leadHeader: "لتحويل ملفكم إلى المستشار الجمركي المعتمد:",
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
          topicClosed: "اكتملت المحادثة وتم إرسال طلبكم للمستشار.",
        };
      case "es":
        return {
          askPrompt: "Consultar con el Agente",
          title: "Asistente Kalem Aduanas",
          subTitle: "Mesa de Asesoría Aduanera",
          leadHeader: "Para remitir su caso al agente colegiado:",
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
          topicClosed: "Consulta completada. Remitida al agente de aduanas.",
        };
      case "tr":
      default:
        return {
          askPrompt: "Müşavire Soru / Talep İletin",
          title: "Kalem Gümrük Masası",
          subTitle: "Yetkili Müşavir Masası",
          leadHeader: "Dosyanızın Yetkili Gümrük Müşavirine Aktarılması İçin:",
          namePlaceholder: "Adınız Soyadınız *",
          phonePlaceholder: "Telefon Numaranız *",
          companyPlaceholder: "Firma Adı (varsa)",
          submitBtn: "Müşavirimize İlet",
          submittingBtn: "İletiliyor...",
          waBtn: "WhatsApp'tan Müşavire Yaz",
          inputPlaceholder: "Talebinizi veya sorunuzu yazınız...",
          msgLimitText: `Kalan mesaj hakkınız: ${remaining} / ${MAX_MESSAGES}`,
          charsLabel: "karakter",
          limitReached: "Maksimum 5 mesaj sınırına ulaştınız. Lütfen bilgilerinizi giriniz.",
          leadForwardedWa: "Müşavire iletildi. Acil konularda WhatsApp'tan ulaşabilirsiniz:",
          topicClosed: "Görüşme tamamlandı. Talebiniz gümrük müşavirimize aktarılmıştır.",
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
              {/* WhatsApp Butonu */}
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

                <div className="max-w-[85%] space-y-1.5">
                  <div
                    className={`p-3.5 rounded-2xl leading-relaxed whitespace-pre-line ${
                      m.sender === "user"
                        ? "bg-[#1E2A3A] text-white rounded-tr-xs"
                        : "bg-white text-slate-800 border border-slate-200/90 shadow-2xs rounded-tl-xs"
                    }`}
                  >
                    {m.text}

                    {/* Akıllı Yönlendirme Bağlantısı */}
                    {m.link && (
                      <div className="mt-2.5 pt-2 border-t border-slate-100">
                        <Link
                          href={m.link.href}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1E2A3A] hover:bg-[#2A3B50] text-[#44B9CD] hover:text-white font-bold text-[11px] transition-colors"
                        >
                          <span>{m.link.text}</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    )}
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

            {/* İletişim Bilgisi Formu (En az 1 mesaj yazıldığında veya limit dolduğunda) */}
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
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-[#44B9CD] bg-slate-50/50 text-slate-800 font-medium"
                  />
                  <input
                    type="tel"
                    required
                    maxLength={30}
                    placeholder={uiLabels.phonePlaceholder}
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-[#44B9CD] bg-slate-50/50 text-slate-800 font-medium"
                  />
                  <input
                    type="text"
                    maxLength={100}
                    placeholder={uiLabels.companyPlaceholder}
                    value={contactCompany}
                    onChange={(e) => setContactCompany(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-[#44B9CD] bg-slate-50/50 text-slate-800 font-medium"
                  />

                  {/* Zorunlu KVKK Onayı */}
                  <label className="flex items-start gap-2 text-[11px] text-slate-600 cursor-pointer select-none pt-1">
                    <input
                      type="checkbox"
                      required
                      checked={kvkkConsent}
                      onChange={(e) => setKvkkConsent(e.target.checked)}
                      className="mt-0.5 w-3.5 h-3.5 text-[#44B9CD] border-slate-300 rounded focus:ring-[#44B9CD] accent-[#1E2A3A]"
                    />
                    <span>
                      6698 sayılı KVKK kapsamında iletişim bilgilerimin işlenmesini onaylıyorum. <span className="text-red-500">*</span>
                    </span>
                  </label>

                  <button
                    type="submit"
                    disabled={isSubmittingLead || !contactName.trim() || !contactPhone.trim() || !kvkkConsent}
                    className="w-full py-2.5 bg-[#1E2A3A] hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition disabled:opacity-50 cursor-pointer shadow-xs"
                  >
                    {isSubmittingLead ? uiLabels.submittingBtn : uiLabels.submitBtn}
                  </button>
                </form>
              </div>
            )}

            {/* İletişim Bilgisi Gönderildikten Sonra Konu Kapanır */}
            {hasProvidedContact && (
              <div className="p-3.5 bg-slate-100 border border-slate-200 rounded-2xl space-y-2">
                <div className="flex items-center gap-2 text-slate-800 text-xs font-semibold">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{uiLabels.topicClosed}</span>
                </div>
                <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-200 text-xs text-slate-600">
                  <span>{uiLabels.leadForwardedWa}</span>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleWhatsAppClick}
                    className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition shrink-0"
                  >
                    WhatsApp
                  </a>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Mesaj Sınırı ve Karakter Sayacı Bilgi Barı */}
          <div className="px-4 py-1.5 bg-slate-100 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
            <span>{hasProvidedContact ? uiLabels.topicClosed : uiLabels.msgLimitText}</span>
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
              disabled={userMessageCount >= MAX_MESSAGES || hasProvidedContact}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                hasProvidedContact
                  ? uiLabels.topicClosed
                  : userMessageCount >= MAX_MESSAGES
                  ? uiLabels.limitReached
                  : uiLabels.inputPlaceholder
              }
              className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#44B9CD] transition disabled:bg-slate-100 disabled:cursor-not-allowed"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || userMessageCount >= MAX_MESSAGES || hasProvidedContact}
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
