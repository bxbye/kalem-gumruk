import path from "path";
import { fixUtf8Mojibake } from "./storage.js";

// Standart Alan Adı -> İnsan Okur Başlık Eşlemesi
export const FIELD_LABEL_MAP: Record<string, string> = {
  fullName: "Adı Soyadı",
  adsoyad: "Adı Soyadı",
  name: "Adı Soyadı",
  company: "Firma / Kurum Adı",
  firma: "Firma / Kurum Adı",
  phone: "Telefon Numarası",
  tel: "Telefon Numarası",
  telephone: "Telefon Numarası",
  email: "E-Posta Adresi",
  eposta: "E-Posta Adresi",
  mail: "E-Posta Adresi",
  applicationType: "Başvuru Türü / Pozisyon",
  position: "Başvuru Pozisyonu",
  experience: "Deneyim Bilgisi",
  coverLetter: "Ön Yazı / Açıklama",
  onyazi: "Ön Yazı / Açıklama",
  message: "Mesaj / Açıklama",
  mesaj: "Mesaj / Açıklama",
  subject: "Konu / Hizmet Alanı",
  konu: "Konu / Hizmet Alanı",
  serviceType: "Talep Edilen Hizmet",
  operationType: "İşlem Türü / Rejim",
  volume: "Aylık Dosya Hacmi",
  customsOffice: "Hedef Gümrük / Liman",
  gtipOrProduct: "GTİP No / Eşya Tanımı",
  gtip: "GTİP No",
  taxNumber: "Vergi Kimlik Numarası",
  taxOffice: "Vergi Dairesi",
  country: "Ülke",
  originCountry: "Menşe Ülke",
  destinationCountry: "Varış Ülkesi",
  transportMode: "Taşıma Şekli",
  urgency: "Öncelik Durumu",
  city: "Şehir",
  address: "Adres",
  birthDate: "Doğum Tarihi",
  education: "Eğitim Durumu",
  university: "Üniversite / Bölüm",
  notes: "Ek Notlar",
};

// Tabloda gösterilmeyecek teknik veya gizli alanlar
export const HIDDEN_FORM_KEYS = new Set([
  "_lang",
  "lang",
  "honeypot",
  "formLoadedAt",
  "challengeToken",
  "challengeAnswer",
  "kvkkConsent",
  "files",
  "uploadedFilesSummary",
  "filesSummary",
  "refCode",
]);

// Ayrı kurumsal metin alanında (callout) gösterilecek alanlar
export const LONG_TEXT_KEYS = new Set([
  "coverLetter",
  "onyazi",
  "message",
  "mesaj",
  "notes",
  "details",
]);

export interface FormSubmissionEmailParams {
  formSlug: string;
  formTitle: string;
  refCode: string;
  data: Record<string, any>;
  fieldsDef?: Array<{ name: string; label: string; type?: string }>;
  files?: Array<{ name: string; url?: string; size?: string; key?: string }>;
  lang?: string;
  createdAt?: Date;
  siteBaseUrl?: string;
}

/**
 * CamelCase veya snake_case anahtarı okunaklı başlığa çevirir
 */
function humanizeKey(key: string): string {
  if (FIELD_LABEL_MAP[key]) return FIELD_LABEL_MAP[key];

  const spaced = key
    .replace(/([A-Z])/g, " $1")
    .replace(/[_-]+/g, " ")
    .trim();

  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

/**
 * WhatsApp için temiz telefon numarası oluşturur
 */
function formatWhatsAppPhone(rawPhone?: string): string {
  if (!rawPhone) return "";
  const cleaned = rawPhone.replace(/[^0-9]/g, "");
  if (cleaned.startsWith("90") && cleaned.length >= 12) return cleaned;
  if (cleaned.startsWith("0") && cleaned.length === 11) return "90" + cleaned.slice(1);
  if (cleaned.length === 10) return "90" + cleaned;
  return cleaned;
}

/**
 * 1. FORM BİLDİRİMİ E-POSTASI (Yetkili Müşavir / Admin İçin)
 * Kalem Gümrük Marka Renkleri (#1E2A3A Navy, #44B9CD Teal) ve Şirket Logosu ile Kurumsal Tasarım
 */
export function renderFormSubmissionAdminEmail({
  formTitle,
  refCode,
  data,
  fieldsDef = [],
  files = [],
  lang = "tr",
  createdAt = new Date(),
  siteBaseUrl = "https://kalemgumruk.com",
}: FormSubmissionEmailParams): { subject: string; html: string } {
  const cleanLang = (lang || "tr").toLowerCase();
  const langLabels: Record<string, string> = {
    tr: "Türkçe",
    en: "English",
    ar: "العربية",
    es: "Español",
  };
  const langBadges: Record<string, string> = {
    tr: "TR",
    en: "EN",
    ar: "AR",
    es: "ES",
  };
  const langLabel = langLabels[cleanLang] || cleanLang.toUpperCase();
  const langBadge = langBadges[cleanLang] || cleanLang.toUpperCase();

  const customerName = fixUtf8Mojibake(data.fullName || data.adsoyad || data.name || "İsimsiz Bildirim");
  const customerEmail = data.email || data.eposta || data.mail;
  const customerPhone = data.phone || data.tel || data.telephone;
  const customerCompany = fixUtf8Mojibake(data.company || data.firma);
  const applicationType = fixUtf8Mojibake(data.applicationType || data.position || data.operationType || data.serviceType || data.subject);

  const labelMap = new Map<string, string>();
  for (const f of fieldsDef) {
    if (f.name && f.label) {
      labelMap.set(f.name, fixUtf8Mojibake(f.label));
    }
  }

  let highlightNote: { title: string; content: string } | null = null;
  const tableRows: Array<{ label: string; valueHtml: string }> = [];
  const hasFiles = Array.isArray(files) && files.length > 0;

  for (const [rawKey, rawVal] of Object.entries(data)) {
    if (HIDDEN_FORM_KEYS.has(rawKey)) continue;
    if (hasFiles && (rawKey === "cvFile" || rawKey === "uploadedFilesSummary" || rawKey === "filesSummary")) {
      continue;
    }

    if (rawVal === undefined || rawVal === null || String(rawVal).trim() === "") continue;

    const label = labelMap.get(rawKey) || humanizeKey(rawKey);
    const cleanedStringVal = fixUtf8Mojibake(typeof rawVal === "object" ? JSON.stringify(rawVal) : String(rawVal));

    if (LONG_TEXT_KEYS.has(rawKey) && !highlightNote && cleanedStringVal.length > 0) {
      highlightNote = {
        title: label,
        content: cleanedStringVal,
      };
      continue;
    }

    let formattedValueHtml = cleanedStringVal;

    if (rawKey.toLowerCase().includes("email") && cleanedStringVal.includes("@")) {
      formattedValueHtml = `<a href="mailto:${cleanedStringVal}" style="color: #44B9CD; text-decoration: none; font-weight: 600;">${cleanedStringVal}</a>`;
    } else if (rawKey.toLowerCase().includes("phone") || rawKey.toLowerCase().includes("tel")) {
      formattedValueHtml = `<a href="tel:${cleanedStringVal.replace(/\s+/g, "")}" style="color: #1E2A3A; text-decoration: none; font-weight: 600;">${cleanedStringVal}</a>`;
    } else if (rawKey === "experience" && /^\d+$/.test(cleanedStringVal.trim())) {
      formattedValueHtml = `<strong>${cleanedStringVal} Yıl</strong> Deneyim`;
    }

    tableRows.push({
      label,
      valueHtml: formattedValueHtml,
    });
  }

  // Hızlı Aksiyon Butonları (Kurumsal Lacivert & Teal)
  const waPhone = formatWhatsAppPhone(customerPhone);
  const waMessage = encodeURIComponent(
    `Sayın ${customerName}, Kalem Gümrük Müşavirliği (#${refCode}) talebiniz ile ilgili iletişime geçiyoruz.`
  );

  const actionButtonsHtml = `
    <div style="margin-top: 14px; padding-top: 12px; border-top: 1px solid #E2E8F0;">
      <table cellpadding="0" cellspacing="0" border="0">
        <tr>
          ${
            customerPhone
              ? `
            <td style="padding-right: 8px; padding-bottom: 6px;">
              <a href="tel:${String(customerPhone).replace(/\s+/g, "")}" style="display: inline-block; background-color: #1E2A3A; color: #FFFFFF; padding: 7px 14px; border-radius: 6px; text-decoration: none; font-size: 11.5px; font-weight: 600; border: 1px solid #1E2A3A;">
                Telefon ile Ara
              </a>
            </td>
          `
              : ""
          }
          ${
            waPhone
              ? `
            <td style="padding-right: 8px; padding-bottom: 6px;">
              <a href="https://wa.me/${waPhone}?text=${waMessage}" target="_blank" style="display: inline-block; background-color: #1E2A3A; color: #44B9CD; padding: 7px 14px; border-radius: 6px; text-decoration: none; font-size: 11.5px; font-weight: 700; border: 1px solid #44B9CD;">
                WhatsApp ile İletişim
              </a>
            </td>
          `
              : ""
          }
          ${
            customerEmail
              ? `
            <td style="padding-bottom: 6px;">
              <a href="mailto:${customerEmail}?subject=${encodeURIComponent(`[${refCode}] Kalem Gümrük Müşavirliği - Başvurunuz Hk.`)}" style="display: inline-block; background-color: #F8FAFC; color: #1E2A3A; padding: 7px 14px; border-radius: 6px; text-decoration: none; font-size: 11.5px; font-weight: 600; border: 1px solid #CBD5E1;">
                E-Posta Yanıtla
              </a>
            </td>
          `
              : ""
          }
        </tr>
      </table>
    </div>
  `;

  // Form Tablosu (Sade ve Kurumsal)
  const rowsHtml = tableRows
    .map((row, index) => {
      const bg = index % 2 === 0 ? "#FFFFFF" : "#F8FAFC";
      return `
        <tr style="background-color: ${bg}; border-bottom: 1px solid #EDF2F7;">
          <td style="padding: 10px 14px; font-size: 12.5px; font-weight: 600; color: #475569; width: 36%; vertical-align: top;">
            ${row.label}:
          </td>
          <td style="padding: 10px 14px; font-size: 12.5px; color: #0F172A; vertical-align: top; word-break: break-word;">
            ${row.valueHtml}
          </td>
        </tr>
      `;
    })
    .join("");

  // Mesaj / Ön Yazı Kartı (Kurumsal Teal Sol Kenarlık)
  const highlightNoteHtml = highlightNote
    ? `
      <div style="margin-top: 16px; border: 1px solid #E2E8F0; border-left: 3px solid #44B9CD; background-color: #F8FAFC; border-radius: 6px; padding: 14px 18px;">
        <div style="font-size: 11.5px; font-weight: 700; color: #1E2A3A; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px;">
          ${highlightNote.title}
        </div>
        <div style="font-size: 13px; color: #334155; line-height: 1.6; white-space: pre-wrap; word-break: break-word;">
          ${highlightNote.content}
        </div>
      </div>
    `
    : "";

  // Ekli Belgeler Kartı
  let filesSectionHtml = "";
  if (Array.isArray(files) && files.length > 0) {
    const fileItemsHtml = files
      .map((f: any) => {
        const fixedName = fixUtf8Mojibake(f.name || f.key || "Belge");
        const ext = path.extname(fixedName).toUpperCase().replace(".", "") || "BELGE";
        const fullUrl = f.url?.startsWith("http") ? f.url : `${siteBaseUrl.replace(/\/$/, "")}${f.url || ""}`;

        return `
          <div style="background-color: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 6px; padding: 10px 14px; margin-top: 6px;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td style="width: 44px; vertical-align: middle;">
                  <span style="display: inline-block; background-color: #1E2A3A; color: #44B9CD; font-weight: 800; font-size: 10px; padding: 4px 6px; border-radius: 4px; letter-spacing: 0.5px;">
                    ${ext}
                  </span>
                </td>
                <td style="vertical-align: middle; padding-left: 8px;">
                  <div style="font-size: 12.5px; font-weight: 600; color: #0F172A; word-break: break-all;">
                    ${fixedName}
                  </div>
                  <div style="font-size: 11px; color: #64748B; margin-top: 1px;">
                    ${f.size || "Belge"} • E-postaya iliştirildi
                  </div>
                </td>
                <td style="text-align: right; vertical-align: middle; width: 90px;">
                  ${
                    f.url
                      ? `<a href="${fullUrl}" target="_blank" style="display: inline-block; background-color: #F8FAFC; color: #1E2A3A; border: 1px solid #CBD5E1; padding: 5px 10px; border-radius: 4px; font-size: 11px; font-weight: 600; text-decoration: none;">
                          İndir
                        </a>`
                      : ""
                  }
                </td>
              </tr>
            </table>
          </div>
        `;
      })
      .join("");

    filesSectionHtml = `
      <div style="margin-top: 16px; border: 1px solid #E2E8F0; background-color: #F8FAFC; border-radius: 8px; padding: 14px 18px;">
        <div style="font-size: 11.5px; font-weight: 700; color: #1E2A3A; text-transform: uppercase; letter-spacing: 0.5px;">
          Ekli Belgeler (${files.length} Adet)
        </div>
        ${fileItemsHtml}
      </div>
    `;
  }

  const formattedDate = createdAt.toLocaleString("tr-TR", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  const emailHtml = `
<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${formTitle}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F8FAFC; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1E293B;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #F8FAFC; padding: 20px 10px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; background-color: #FFFFFF; border-radius: 8px; overflow: hidden; border: 1px solid #E2E8F0;">
          
          <!-- Üst Başlık (Kalem Gümrük Logo & Lacivert Zemin) -->
          <tr>
            <td style="background-color: #1E2A3A; padding: 22px 24px; color: #FFFFFF;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="vertical-align: middle;">
                    <a href="${siteBaseUrl}" target="_blank" style="text-decoration: none; display: inline-block;">
                      <img src="${siteBaseUrl}/logo-white.png" alt="Kalem Gümrük Müşavirliği" width="145" height="42" style="display: block; border: 0; max-width: 145px; height: auto;" />
                    </a>
                  </td>
                  <td align="right" style="vertical-align: middle;">
                    <span style="display: inline-block; background-color: rgba(68, 185, 205, 0.15); border: 1px solid #44B9CD; color: #44B9CD; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 4px; font-family: monospace;">
                      ${refCode}
                    </span>
                  </td>
                </tr>
              </table>

              <div style="margin-top: 14px; padding-top: 12px; border-top: 1px solid rgba(255, 255, 255, 0.12);">
                <div style="font-size: 16px; font-weight: 700; color: #FFFFFF;">
                  ${formTitle}
                </div>
                <div style="font-size: 11px; color: #94A3B8; margin-top: 2px;">
                  ${formattedDate} • ${langLabel} (${langBadge})
                </div>
              </div>
            </td>
          </tr>

          <!-- Başvuru Sahibi Kartı -->
          <tr>
            <td style="padding: 18px 24px 10px 24px;">
              <div style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 6px; padding: 16px 18px;">
                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td style="vertical-align: middle;">
                      <div style="font-size: 16px; font-weight: 700; color: #0F172A;">
                        ${customerName}
                      </div>
                      ${
                        customerCompany && customerCompany !== "-"
                          ? `<div style="font-size: 12.5px; color: #475569; margin-top: 2px;">
                              ${customerCompany}
                            </div>`
                          : ""
                      }
                      ${
                        applicationType
                          ? `<div style="margin-top: 6px;">
                              <span style="display: inline-block; background-color: #E2E8F0; color: #1E2A3A; font-weight: 600; font-size: 11.5px; padding: 3px 8px; border-radius: 4px;">
                                ${applicationType}
                              </span>
                            </div>`
                          : ""
                      }
                    </td>
                  </tr>
                </table>
                ${actionButtonsHtml}
              </div>
            </td>
          </tr>

          <!-- Form Alanları Tablosu -->
          <tr>
            <td style="padding: 10px 24px 18px 24px;">
              <div style="font-size: 11.5px; font-weight: 700; color: #475569; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px;">
                Form Detayları
              </div>
              <div style="border: 1px solid #E2E8F0; border-radius: 6px; overflow: hidden;">
                <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse;">
                  ${rowsHtml}
                </table>
              </div>

              ${highlightNoteHtml}
              ${filesSectionHtml}
            </td>
          </tr>

          <!-- Kurumsal Altbilgi -->
          <tr>
            <td style="background-color: #1E2A3A; padding: 18px 24px; text-align: center; color: #94A3B8; font-size: 11px; line-height: 1.5;">
              <div style="font-weight: 700; color: #FFFFFF; font-size: 12px; margin-bottom: 2px;">
                Kalem Gümrük Müşavirliği Ltd. Şti.
              </div>
              <div>
                Saray Mah. Dr. Adnan Büyükdeniz Cad. Akkom Ofis Park No:4 Ümraniye / İstanbul
              </div>
              <div style="margin-top: 4px;">
                Tel: +90 (216) 481 80 80 • <a href="https://kalemgumruk.com" style="color: #44B9CD; text-decoration: none;">kalemgumruk.com</a>
              </div>
              <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid rgba(255, 255, 255, 0.1); font-size: 10px; color: #64748B;">
                Ref: #${refCode} • Kalem Gümrük Müşavirliği Portalı Otomatik Bildirimi
              </div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  const shortTitle = formTitle
    .replace(/Fiyat Teklifi İsteme Formu/gi, "Fiyat Teklifi")
    .replace(/Hızlı Gümrükleme Fiyat Teklifi/gi, "Fiyat Teklifi")
    .replace(/Genel İletişim & Danışma Formu/gi, "İletişim")
    .replace(/Gümrükleme/gi, "")
    .replace(/İşlemleri/gi, "")
    .trim() || "Form";

  const companyTag = customerCompany && customerCompany !== "Bireysel" && customerCompany !== "-" ? ` (${customerCompany})` : "";
  const mailSubject = `[${refCode}] [${langBadge}] ${shortTitle}: ${customerName}${companyTag}`;

  return {
    subject: mailSubject,
    html: emailHtml,
  };
}

/**
 * 2. MÜŞTERİ / BAŞVURU SAHİBİNE GİDEN ONAY E-POSTASI
 * Kurumsal kimlik ve marka logosu ile güven veren tasarım
 */
export function renderCustomerConfirmationEmail({
  refCode,
  fullName,
  serviceOrTitle,
  lang = "tr",
  siteBaseUrl = "https://kalemgumruk.com",
}: {
  refCode: string;
  fullName: string;
  serviceOrTitle: string;
  lang?: string;
  siteBaseUrl?: string;
}): { subject: string; html: string } {
  const cleanLang = (lang || "tr").toLowerCase();
  const cleanName = fixUtf8Mojibake(fullName || "Değerli Müşterimiz");
  const cleanService = fixUtf8Mojibake(serviceOrTitle || "Gümrük Danışmanlığı");

  switch (cleanLang) {
    case "en":
      return {
        subject: `[${refCode}] Application Received - Kalem Customs Brokerage`,
        html: buildCustomerEmailHtml({
          lang: "en",
          siteBaseUrl,
          refCode,
          titleText: "Inquiry Confirmation",
          greeting: `Dear <strong>${cleanName}</strong>,`,
          intro: `Your inquiry regarding <strong>${cleanService}</strong> has been received by our operations department.`,
          statusLabel: "Status:",
          statusValue: "Assigned to Licensed Customs Broker",
          refLabel: "Reference Code:",
          nextStepsTitle: "Next Steps:",
          step1: "Our licensed customs broker is reviewing your requirements.",
          step2: "We will contact you during business hours.",
          footerNote: "Kalem Customs Brokerage Ltd. | Istanbul, Turkey",
        }),
      };

    case "ar":
      return {
        subject: `[${refCode}] استلام الطلب - شركة قلم للتخليص الجمركي`,
        html: buildCustomerEmailHtml({
          lang: "ar",
          dir: "rtl",
          siteBaseUrl,
          refCode,
          titleText: "تأكيد استلام الطلب",
          greeting: `السادة / <strong>${cleanName}</strong> المحترمون،`,
          intro: `تم استلام طلبكم المتعلق بـ <strong>${cleanService}</strong> بنجاح لدى قسم العمليات الجمركية.`,
          statusLabel: "الحالة:",
          statusValue: "قيد التدقيق من قبل المستشار الجمركي المعتمد",
          refLabel: "رقم المرجع:",
          nextStepsTitle: "الخطوات التالية:",
          step1: "يقوم المستشار الجمركي بدراسة التفاصيل وبنود المعاملة.",
          step2: "سيتواصل معكم أحد خبرائنا خلال ساعات العمل الرسمية.",
          footerNote: "شركة قلم للتخليص الجمركي المحدودة | إسطنبول - تركيا",
        }),
      };

    case "es":
      return {
        subject: `[${refCode}] Solicitud Recibida - Kalem Aduanas`,
        html: buildCustomerEmailHtml({
          lang: "es",
          siteBaseUrl,
          refCode,
          titleText: "Confirmación de Solicitud",
          greeting: `Estimado/a <strong>${cleanName}</strong>,`,
          intro: `Hemos recibido su solicitud referente a <strong>${cleanService}</strong> en nuestro departamento de operaciones.`,
          statusLabel: "Estado:",
          statusValue: "Asignado a Agente de Aduanas Colegiado",
          refLabel: "Código de Referencia:",
          nextStepsTitle: "Próximos pasos:",
          step1: "Nuestro agente colegiado analizará la documentación.",
          step2: "Nos pondremos en contacto con usted en horario comercial.",
          footerNote: "Kalem Gümrük Müşavirliği | Estambul, Turquía",
        }),
      };

    case "tr":
    default:
      return {
        subject: `[${refCode}] Talebiniz Alındı - Kalem Gümrük Müşavirliği`,
        html: buildCustomerEmailHtml({
          lang: "tr",
          siteBaseUrl,
          refCode,
          titleText: "Başvuru Teyidi",
          greeting: `Sayın <strong>${cleanName}</strong>,`,
          intro: `<strong>${cleanService}</strong> konulu başvurunuz operasyon ve müşavirlik birimimize ulaşmıştır.`,
          statusLabel: "İşlem Durumu:",
          statusValue: "Yetkili Gümrük Müşavirine Atandı",
          refLabel: "Referans Numaranız:",
          nextStepsTitle: "İşlem Süreci:",
          step1: "Yetkili gümrük müşavirimiz başvuru detaylarınızı incelemektedir.",
          step2: "Uzmanımız mesai saatleri içerisinde tarafınızla iletişime geçecektir.",
          footerNote: "Kalem Gümrük Müşavirliği Ltd. Şti. | Ümraniye, İstanbul",
        }),
      };
  }
}

/**
 * Müşteri onay e-postası şablonu (Marka Logolu ve Şık)
 */
function buildCustomerEmailHtml({
  lang = "tr",
  dir = "ltr",
  siteBaseUrl = "https://kalemgumruk.com",
  refCode,
  titleText,
  greeting,
  intro,
  statusLabel,
  statusValue,
  refLabel,
  nextStepsTitle,
  step1,
  step2,
  footerNote,
}: {
  lang: string;
  dir?: string;
  siteBaseUrl?: string;
  refCode: string;
  titleText: string;
  greeting: string;
  intro: string;
  statusLabel: string;
  statusValue: string;
  refLabel: string;
  nextStepsTitle: string;
  step1: string;
  step2: string;
  footerNote: string;
}): string {
  return `
<!DOCTYPE html>
<html lang="${lang}" dir="${dir}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #F8FAFC; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1E293B; direction: ${dir}; text-align: ${dir === "rtl" ? "right" : "left"};">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #F8FAFC; padding: 20px 10px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 580px; background-color: #FFFFFF; border-radius: 8px; overflow: hidden; border: 1px solid #E2E8F0;">
          
          <!-- Üst Başlık (Marka Logosu ile) -->
          <tr>
            <td style="background-color: #1E2A3A; padding: 22px 24px; color: #FFFFFF;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="vertical-align: middle;">
                    <a href="${siteBaseUrl}" target="_blank" style="text-decoration: none; display: inline-block;">
                      <img src="${siteBaseUrl}/logo-white.png" alt="Kalem Gümrük Müşavirliği" width="145" height="42" style="display: block; border: 0; max-width: 145px; height: auto;" />
                    </a>
                  </td>
                  <td align="${dir === "rtl" ? "left" : "right"}" style="vertical-align: middle;">
                    <span style="font-size: 11px; color: #94A3B8;">1997'den Beri Güvenle</span>
                  </td>
                </tr>
              </table>
              <div style="font-size: 15px; font-weight: 700; color: #FFFFFF; margin-top: 12px; padding-top: 10px; border-top: 1px solid rgba(255, 255, 255, 0.12);">
                ${titleText}
              </div>
            </td>
          </tr>

          <!-- İçerik -->
          <tr>
            <td style="padding: 22px 24px; font-size: 13.5px; line-height: 1.6; color: #334155;">
              <p style="margin-top: 0; font-size: 14.5px; color: #0F172A;">${greeting}</p>
              <p>${intro}</p>

              <!-- Referans Kutusu (Brand Navy & Teal) -->
              <div style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-left: 3px solid #44B9CD; border-radius: 6px; padding: 12px 16px; margin: 16px 0;">
                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td style="font-size: 12px; color: #64748B; font-weight: 600;">
                      ${refLabel}
                    </td>
                    <td align="${dir === "rtl" ? "left" : "right"}" style="font-family: monospace; font-size: 15px; font-weight: 700; color: #1E2A3A;">
                      ${refCode}
                    </td>
                  </tr>
                  <tr>
                    <td style="font-size: 12px; color: #64748B; padding-top: 4px;">
                      ${statusLabel}
                    </td>
                    <td align="${dir === "rtl" ? "left" : "right"}" style="font-size: 12px; font-weight: 600; color: #1E2A3A; padding-top: 4px;">
                      ${statusValue}
                    </td>
                  </tr>
                </table>
              </div>

              <!-- Süreç Bilgisi -->
              <div style="margin: 16px 0 8px 0;">
                <div style="font-weight: 700; color: #0F172A; margin-bottom: 6px; font-size: 13px;">
                  ${nextStepsTitle}
                </div>
                <div style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 6px; padding: 10px 14px; font-size: 12.5px; line-height: 1.6; color: #475569;">
                  <div>1. ${step1}</div>
                  <div style="margin-top: 3px;">2. ${step2}</div>
                </div>
              </div>

              <p style="margin-bottom: 0; margin-top: 16px; font-size: 12px; color: #64748B;">
                ${footerNote}
              </p>
            </td>
          </tr>

          <!-- Altbilgi -->
          <tr>
            <td style="background-color: #F8FAFC; padding: 12px 24px; text-align: center; border-top: 1px solid #E2E8F0; font-size: 11px; color: #64748B;">
              Kalem Gümrük Müşavirliği Ltd. Şti. | Ümraniye, İstanbul | Tel: +90 (216) 481 80 80
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}
