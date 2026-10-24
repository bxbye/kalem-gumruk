import { companyInfo } from "@/data/company";
import { Language } from "@/data/translations/types";

export interface WhatsAppMessageParams {
  type: "service" | "chatbot" | "quote_followup" | "general" | "circular";
  lang?: Language | string;
  serviceTitle?: string;
  refCode?: string;
  topic?: string;
}

/**
 * Ziyaretçinin seçtiği dile (TR, EN, AR, ES) göre dinamik WhatsApp karşılama ve yönlendirme mesajı üretir.
 */
export function getLocalizedWhatsAppMessage(params: WhatsAppMessageParams): string {
  const lang = (params.lang || "tr") as Language;
  const { type, serviceTitle = "", refCode = "", topic = "" } = params;

  switch (type) {
    case "service": {
      const sTitle = serviceTitle || "Gümrük Müşavirliği";
      switch (lang) {
        case "en":
          return `Hello Kalem Customs, I would like to get a quote and detailed information regarding your "${sTitle}" service.`;
        case "ar":
          return `مرحباً قلم للتخليص الجمركي، أود الحصول على عرض سعر ومعلومات تفصيلية حول خدمة "${sTitle}".`;
        case "es":
          return `Hola Kalem Aduanas, quisiera solicitar una cotización e información detallada sobre su servicio de "${sTitle}".`;
        case "tr":
        default:
          return `Merhaba Kalem Gümrük, "${sTitle}" hizmetiniz hakkında hızlı teklif ve bilgi almak istiyorum.`;
      }
    }

    case "chatbot": {
      const topicText = topic ? topic.trim().substring(0, 100) : "";
      switch (lang) {
        case "en":
          return `Hello Kalem Customs, I am contacting you from your website with chat consultation reference #${refCode}.${
            topicText ? `\nTopic: "${topicText}..."` : ""
          }\nI would like to speak with your licensed customs broker.`;
        case "ar":
          return `مرحباً قلم للتخليص الجمركي، أتواصل معكم عبر موقعكم الإلكتروني بالرقم المرجعي للاستشارة #${refCode}.${
            topicText ? `\nالموضوع: "${topicText}..."` : ""
          }\nأود التحدث مع المستشار الجمركي المعتمد.`;
        case "es":
          return `Hola Kalem Aduanas, me comunico desde su sitio web con la referencia de consulta #${refCode}.${
            topicText ? `\nAsunto: "${topicText}..."` : ""
          }\nMe gustaría hablar con su agente de aduanas colegiado.`;
        case "tr":
        default:
          return `Merhaba Kalem Gümrük, web sitenizden #${refCode} nolu sohbet danışma referansıyla yazıyorum.${
            topicText ? `\nKonu: "${topicText}..."` : ""
          }\nGümrük müşavirinizle görüşmek istiyorum.`;
      }
    }

    case "quote_followup": {
      const sTitle = serviceTitle ? ` (${serviceTitle})` : "";
      switch (lang) {
        case "en":
          return `Hello Kalem Customs, I have submitted my quote request #${refCode} through your website${sTitle}. I would like to follow up on the status.`;
        case "ar":
          return `مرحباً قلم للتخليص الجمركي، لقد قمت بتقديم طلب عرض سعر برقم #${refCode} عبر موقعكم${sTitle}. أود متابعة حالة الطلب.`;
        case "es":
          return `Hola Kalem Aduanas, he enviado mi solicitud de cotización #${refCode} a través de su sitio web${sTitle}. Quisiera consultar sobre el proceso.`;
        case "tr":
        default:
          return `Merhaba Kalem Gümrük, #${refCode} numaralı teklif talebimi web siteniz üzerinden ilettim${sTitle}. Süreç hakkında bilgi almak istiyorum.`;
      }
    }

    case "circular": {
      const circTitle = serviceTitle || topic || "Mevzuat Sirküleri";
      switch (lang) {
        case "en":
          return `Hello Kalem Customs, I am contacting you regarding your publication "${circTitle}". I would like to consult on its operational impact.`;
        case "ar":
          return `مرحباً قلم للتخليص الجمركي، أتواصل معكم بخصوص المنشور الجمركي "${circTitle}". أود استشارة خبرائكم حول تفاصيله.`;
        case "es":
          return `Hola Kalem Aduanas, les contacto en relación con su publicación "${circTitle}". Quisiera consultar sobre su impacto operativo.`;
        case "tr":
        default:
          return `Merhaba Kalem Gümrük, "${circTitle}" başlıklı sirküleriniz hakkında müşavirinizle görüşmek istiyorum.`;
      }
    }

    case "general":
    default: {
      switch (lang) {
        case "en":
          return "Hello Kalem Customs, I am contacting you via your website. I would like to get information regarding customs clearance and foreign trade consultancy.";
        case "ar":
          return "مرحباً قلم للتخليص الجمركي، أتواصل معكم عبر موقعكم الإلكتروني. أود الاستفسار حول خدمات التخليص والاستشارات الجمركية.";
        case "es":
          return "Hola Kalem Aduanas, me comunico a través de su sitio web. Quisiera recibir información sobre despacho aduanero y asesoría en comercio exterior.";
        case "tr":
        default:
          return companyInfo.whatsappDefaultMessage;
      }
    }
  }
}

/**
 * WhatsApp yönlendirme URL'si üretir (wa.me)
 */
export function getWhatsAppUrl(params: WhatsAppMessageParams): string {
  const text = getLocalizedWhatsAppMessage(params);
  return `https://wa.me/${companyInfo.whatsapp}?text=${encodeURIComponent(text)}`;
}
