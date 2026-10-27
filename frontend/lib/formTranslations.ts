// Çok dilli dinamik form çeviri ve yerelleştirme kütüphanesi
// TR, EN, AR, ES dillerinde formların bozulmadan kusursuz çalışmasını sağlar.

export type SupportedLang = "tr" | "en" | "ar" | "es";

export interface FormTranslationStrings {
  selectPlaceholder: string;
  submitBtn: string;
  submittingBtn: string;
  uploadDrop: string;
  uploadHint: string;
  uploading: string;
  successTitle: string;
  refNumber: string;
  refNote: string;
  newRequestBtn: string;
  copyRef: string;
  copiedRef: string;
  sslSecurity: string;
  badge: string;
  quoteTitle: string;
  quoteDesc: string;
  requiredWarning: string;
  connectionError: string;
  removeFile: string;
  kvkkConsent: string;
  kvkkRequired: string;
  humanVerification: string;
  humanVerificationPlaceholder: string;
  refreshQuestion: string;
  maxFilesNotice: string;
}

export const formUIStrings: Record<SupportedLang, FormTranslationStrings> = {
  tr: {
    selectPlaceholder: "Seçiniz...",
    submitBtn: "Fiyat Teklifi Talebini Gönder",
    submittingBtn: "Fiyat Teklifi Talebi Gönderiliyor...",
    uploadDrop: "Dosya Seçin veya Sürükleyin",
    uploadHint: "PDF, Word veya Görsel (En fazla 2 dosya, maks. 5 MB)",
    uploading: "Dosya Yükleniyor...",
    successTitle: "Fiyat Teklifi Talebiniz Başarıyla Alındı!",
    refNumber: "Fiyat Teklifi Referans Numaranız:",
    refNote: "Gümrük müşavirlerimiz talebinizi bu referans numarası üzerinden takip edecektir.",
    newRequestBtn: "Yeni Fiyat Teklifi Talebi Gönder",
    copyRef: "Kopyala",
    copiedRef: "Kopyalandı!",
    sslSecurity: "256-Bit SSL ile güvenli iletim",
    badge: "FİYAT TEKLİFİ İSTEME FORMU",
    quoteTitle: "Fiyat Teklifi İsteme Formu",
    quoteDesc: "İthalat, ihracat ve antrepo operasyonlarınız için gümrük müşavirimizden en kısa sürede özel fiyat teklifi alın.",
    requiredWarning: "Lütfen zorunlu alanları doldurunuz.",
    connectionError: "Sunucuya bağlanılamadı. Lütfen doğrudan telefon veya WhatsApp ile ulaşınız.",
    removeFile: "Dosyayı Kaldır",
    kvkkConsent: "6698 sayılı KVKK kapsamında kişisel verilerimin işlenmesini ve tarafımla iletişime geçilmesini onaylıyorum.",
    kvkkRequired: "Devam edebilmek için lütfen KVKK onay kutusunu işaretleyiniz.",
    humanVerification: "Güvenlik Doğrulaması (İnsan Doğrulaması)",
    humanVerificationPlaceholder: "İşlem sonucu",
    refreshQuestion: "Soruyu Yenile",
    maxFilesNotice: "Forma en fazla 2 adet dosya ekleyebilirsiniz.",
  },
  en: {
    selectPlaceholder: "Select...",
    submitBtn: "Submit Quote Request",
    submittingBtn: "Submitting Quote Request...",
    uploadDrop: "Select File or Drag & Drop Here",
    uploadHint: "PDF, Word or Image (Max 2 files, up to 5 MB each)",
    uploading: "Uploading File...",
    successTitle: "Quote Request Received Successfully!",
    refNumber: "Quote Reference Number:",
    refNote: "Our customs brokers will track your inquiry using this reference number.",
    newRequestBtn: "Submit Another Request",
    copyRef: "Copy",
    copiedRef: "Copied!",
    sslSecurity: "Secure 256-Bit SSL Encryption",
    badge: "CUSTOMS CLEARANCE QUOTE",
    quoteTitle: "Instant Customs Clearance Quote",
    quoteDesc: "Get a customized quote from our accredited customs brokers for your import, export, and warehousing operations.",
    requiredWarning: "Please fill in all required fields.",
    connectionError: "Failed to connect to the server. Please contact us directly via phone or WhatsApp.",
    removeFile: "Remove File",
    kvkkConsent: "I consent to the processing of my personal data and being contacted under data privacy regulations.",
    kvkkRequired: "Please accept the privacy consent checkbox to continue.",
    humanVerification: "Security Verification (Human Verification)",
    humanVerificationPlaceholder: "Result",
    refreshQuestion: "Refresh Challenge",
    maxFilesNotice: "You can upload a maximum of 2 files.",
  },
  ar: {
    selectPlaceholder: "اختر...",
    submitBtn: "إرسال طلب عرض السعر",
    submittingBtn: "جارٍ إرسال الطلب...",
    uploadDrop: "اختر ملفاً أو اسحبه إلى هنا",
    uploadHint: "PDF أو Word أو صورة (ملفان كحد أقصى، حتى 5 ميغابايت)",
    uploading: "جارٍ رفع الملف...",
    successTitle: "تم استلام طلب عرض السعر بنجاح!",
    refNumber: "رقم مرجع عرض السعر:",
    refNote: "سيقوم مستشارونا الجمركيون بمتابعة طلبكم عبر هذا الرقم المرجعي.",
    newRequestBtn: "إرسال طلب جديد",
    copyRef: "نسخ",
    copiedRef: "تم النسخ!",
    sslSecurity: "تشفير آمن 256-Bit SSL",
    badge: "عرض سعر التخليص الجمركي",
    quoteTitle: "طلب عرض سعر فوري للتخليص الجمركي",
    quoteDesc: "احصل على عرض سعر مخصص وسريع من خبرائنا المعتمدين لعمليات الاستيراد والتصدير والمستودعات.",
    requiredWarning: "يرجى ملء كافة الحقول الإلزامية.",
    connectionError: "تعذر الاتصال بالخادم. يرجى التواصل معنا مباشرة عبر الهاتف أو واتساب.",
    removeFile: "إزالة الملف",
    kvkkConsent: "أوافق على معالجة بياناتي والتواصل معي وفقاً للوائح حماية البيانات الشخصية.",
    kvkkRequired: "يرجى الموافقة على شروط حماية البيانات للمتابعة.",
    humanVerification: "التحقق الأمني (إثبات المستخدم البشري)",
    humanVerificationPlaceholder: "النتيجة",
    refreshQuestion: "تحديث السؤال",
    maxFilesNotice: "يمكنك رفع ملفين كحد أقصى.",
  },
  es: {
    selectPlaceholder: "Seleccionar...",
    submitBtn: "Enviar Solicitud de Cotización",
    submittingBtn: "Enviando Solicitud...",
    uploadDrop: "Seleccionar Archivo o Arrastrar Aquí",
    uploadHint: "PDF, Word o Imagen (Máximo 2 archivos, hasta 5 MB)",
    uploading: "Subiendo Archivo...",
    successTitle: "¡Solicitud de Cotización Recibida!",
    refNumber: "Número de Referencia:",
    refNote: "Nuestros agentes de aduanas gestionarán su consulta utilizando este número de referencia.",
    newRequestBtn: "Enviar Otra Solicitud",
    copyRef: "Copiar",
    copiedRef: "¡Copiado!",
    sslSecurity: "Transmisión Segura SSL de 256 Bits",
    badge: "COTIZACIÓN DE DESPACHO ADUANERO",
    quoteTitle: "Cotización Rápida de Despacho Aduanero",
    quoteDesc: "Obtenga una cotización personalizada de nuestros agentes de aduanas para importación, exportación y almacén.",
    requiredWarning: "Por favor complete todos los campos obligatorios.",
    connectionError: "No se pudo conectar con el servidor. Comuníquese directamente por teléfono o WhatsApp.",
    removeFile: "Eliminar Archivo",
    kvkkConsent: "Doy mi consentimiento para el tratamiento de mis datos y para ser contactado según la ley de privacidad.",
    kvkkRequired: "Debe aceptar la cláusula de privacidad para continuar.",
    humanVerification: "Verificación de Seguridad (Verificación Humana)",
    humanVerificationPlaceholder: "Resultado",
    refreshQuestion: "Actualizar Pregunta",
    maxFilesNotice: "Puede subir un máximo de 2 archivos.",
  },
};

// Standart Alan Adı Çevirileri
const fieldLabelMap: Record<string, Record<SupportedLang, string>> = {
  fullName: {
    tr: "Adınız Soyadınız",
    en: "Full Name",
    ar: "الاسم الكامل",
    es: "Nombre y Apellidos",
  },
  company: {
    tr: "Firma / Kurum Adı",
    en: "Company / Organization",
    ar: "اسم الشركة / المؤسسة",
    es: "Nombre de la Empresa",
  },
  phone: {
    tr: "Telefon Numaranız",
    en: "Phone Number",
    ar: "رقم الهاتف",
    es: "Número de Teléfono",
  },
  email: {
    tr: "E-Posta Adresiniz",
    en: "Email Address",
    ar: "البريد الإلكتروني",
    es: "Correo Electrónico",
  },
  operationType: {
    tr: "İşlem Türü / Gümrük Rejimi",
    en: "Operation Type / Customs Regime",
    ar: "نوع العملية / النظام الجمركي",
    es: "Tipo de Operación / Régimen Aduanero",
  },
  volume: {
    tr: "Aylık Dosya Hacmi",
    en: "Estimated Monthly Volume",
    ar: "حجم المعاملات الشهري المقدر",
    es: "Volumen Mensual Estimado",
  },
  customsOffice: {
    tr: "Hedef Gümrük / Liman",
    en: "Target Customs / Port",
    ar: "الجمرك / الميناء المستهدف",
    es: "Aduana / Puerto de Destino",
  },
  customsPort: {
    tr: "Hedef Gümrük / Liman",
    en: "Target Customs / Port",
    ar: "الجمرك / الميناء المستهدف",
    es: "Aduana / Puerto de Destino",
  },
  gtipOrProduct: {
    tr: "GTİP No veya Eşya Tanımı",
    en: "HS Code (GTIP) or Goods Description",
    ar: "رمز النظام المنسق أو وصف البضاعة",
    es: "Código Arancelario (GTIP) o Descripción",
  },
  message: {
    tr: "Sevkiyat ve Fiyat Teklifi Detayları",
    en: "Shipment Details & Notes",
    ar: "تفاصيل الشحنة والملاحظات",
    es: "Detalles del Envío y Notas",
  },
  subject: {
    tr: "Konu / Hizmet Alanı",
    en: "Subject / Service Area",
    ar: "الموضوع / مجال الخدمة",
    es: "Asunto / Área de Servicio",
  },
  applicationType: {
    tr: "Başvuru Türü / Pozisyon",
    en: "Application Type / Position",
    ar: "نوع التقديم / الوظيفة",
    es: "Tipo de Solicitud / Puesto",
  },
  position: {
    tr: "Başvurulan Pozisyon",
    en: "Applied Position",
    ar: "الوظيفة المتقدم لها",
    es: "Puesto Solicitado",
  },
  experience: {
    tr: "Gümrük / Dış Ticaret Deneyimi",
    en: "Customs / Foreign Trade Experience",
    ar: "الخبرة في الجمارك والتجارة الخارجية",
    es: "Experiencia en Aduanas y Comercio Exterior",
  },
  coverLetter: {
    tr: "Ön Yazı / Kendinizi Tanıtın",
    en: "Cover Letter / About Yourself",
    ar: "خطاب التقديم / نبذة عنك",
    es: "Carta de Presentación / Sobre Usted",
  },
  cvFile: {
    tr: "Özgeçmiş / CV Dosyası (PDF veya Word)",
    en: "Resume / CV Document (PDF or Word)",
    ar: "السيرة الذاتية (PDF أو Word)",
    es: "Currículum Vítae (PDF o Word)",
  },
  files: {
    tr: "Evrak Yükleme (Fatura, Konşimento vb.)",
    en: "Document Upload (Invoice, B/L, etc.)",
    ar: "تحميل المستندات (فاتورة، بوليصة شحن، إلخ)",
    es: "Subir Documentos (Factura, B/L, etc.)",
  },
};

// Standart Placeholder Çevirileri
const fieldPlaceholderMap: Record<string, Record<SupportedLang, string>> = {
  fullName: {
    tr: "Örn: Ahmet Yılmaz",
    en: "e.g. John Doe",
    ar: "مثال: أحمد محمد",
    es: "ej. Juan Pérez",
  },
  company: {
    tr: "Örn: ABC Dış Ticaret Ltd.",
    en: "e.g. ABC Trade Inc.",
    ar: "مثال: شركة التجارة الدولية",
    es: "ej. ABC Comercio S.L.",
  },
  phone: {
    tr: "05XX XXX XX XX",
    en: "+90 5XX XXX XX XX",
    ar: "+90 5XX XXX XX XX",
    es: "+90 5XX XXX XX XX",
  },
  email: {
    tr: "adiniz@sirketiniz.com",
    en: "name@company.com",
    ar: "name@company.com",
    es: "nombre@empresa.com",
  },
  gtipOrProduct: {
    tr: "Örn: 8471.30 veya Endüstriyel Elektronik Kart",
    en: "e.g. 8471.30 or Industrial Electronic Board",
    ar: "مثال: 8471.30 أو لوحات إلكترونية صناعية",
    es: "ej. 8471.30 o Placas Electrónicas Industriales",
  },
  experience: {
    tr: "Örn: 2 yıl ithalat operasyon deneyimi",
    en: "e.g. 2 years of import operations experience",
    ar: "مثال: سنتان من الخبرة في عمليات الاستيراد",
    es: "ej. 2 años de experiencia en importaciones",
  },
  coverLetter: {
    tr: "Kariyer hedefleriniz, bildiğiniz programlar (Evrim vb.)...",
    en: "Your career goals, relevant software (Evrim etc.)...",
    ar: "أهدافك المهنية، البرامج التي تجيدها...",
    es: "Sus metas profesionales, software conocido...",
  },
  message: {
    tr: "Konteyner/koli adedi, çıkış ülkesi veya sormak istedikleriniz...",
    en: "Container/package count, origin country or special requirements...",
    ar: "عدد الحاويات أو الطرود، بلد المنشأ أو متطلباتكم الخاصة...",
    es: "Cantidad de contenedores/bultos, país de origen o requerimientos...",
  },
};

// Açılır Menü (Select / Breakdown Menü) Seçenek Çevirileri
const optionTranslations: Record<string, Record<SupportedLang, string>> = {
  // İletişim Konuları
  "Genel Bilgi & İletişim": {
    tr: "Genel Bilgi & İletişim",
    en: "General Inquiries & Contact",
    ar: "معلومات عامة وتواصل",
    es: "Información General y Contacto",
  },
  "Mevzuat Danışmanlığı": {
    tr: "Mevzuat Danışmanlığı",
    en: "Customs Legislation Advisory",
    ar: "استشارات التشريعات الجمركية",
    es: "Asesoría en Legislación Aduanera",
  },
  "İthalat / İhracat Operasyonu": {
    tr: "İthalat / İhracat Operasyonu",
    en: "Import / Export Operations",
    ar: "عمليات الاستيراد / التصدير",
    es: "Operaciones de Importación / Exportación",
  },
  "Yetkilendirilmiş Yükümlü (YYS)": {
    tr: "Yetkilendirilmiş Yükümlü (YYS)",
    en: "Authorized Economic Operator (AEO)",
    ar: "المشغل الاقتصادي المعتمد (AEO)",
    es: "Operador Económico Autorizado (OEA)",
  },
  "Diğer": {
    tr: "Diğer",
    en: "Other",
    ar: "أخرى",
    es: "Otro",
  },

  // Kariyer Başvuru Pozisyonları
  "Gümrük Müşavir Yardımcısı (B Karne)": {
    tr: "Gümrük Müşavir Yardımcısı (B Karne)",
    en: "Assistant Customs Broker (B License)",
    ar: "مساعد مخلص جمركي (ترخيص B)",
    es: "Asistente de Agente de Aduanas (Licencia B)",
  },
  "Müşteri Temsilcisi & Operasyon": {
    tr: "Müşteri Temsilcisi & Operasyon",
    en: "Customer Representative & Operations",
    ar: "ممثل خدمة العملاء والعمليات",
    es: "Representante de Clientes y Operaciones",
  },
  "Dış Ticaret / Gümrük Stajyeri": {
    tr: "Dış Ticaret / Gümrük Stajyeri",
    en: "Foreign Trade / Customs Intern",
    ar: "متدرب في التجارة الخارجية والجمارك",
    es: "Becario de Comercio Exterior y Aduanas",
  },
  "Saha & Kurye Personeli": {
    tr: "Saha & Kurye Personeli",
    en: "Field & Courier Personnel",
    ar: "موظف ميداني ومراسلات",
    es: "Personal de Campo y Mensajería",
  },
  "Genel Başvuru": {
    tr: "Genel Başvuru",
    en: "General Application",
    ar: "تقديم عام",
    es: "Solicitud General",
  },
  // Rejimler & Hizmetler
  "İthalat Gümrükleme": {
    tr: "İthalat Gümrükleme",
    en: "Import Customs Clearance",
    ar: "التخليص الجمركي للواردات",
    es: "Despacho de Importación",
  },
  "İthalat İşlemleri": {
    tr: "İthalat İşlemleri",
    en: "Import Customs Clearance",
    ar: "التخليص الجمركي للواردات",
    es: "Despacho de Importación",
  },
  "İhracat Gümrükleme": {
    tr: "İhracat Gümrükleme",
    en: "Export Customs Clearance",
    ar: "التخليص الجمركي للصادرات",
    es: "Despacho de Exportación",
  },
  "İhracat İşlemleri": {
    tr: "İhracat İşlemleri",
    en: "Export Customs Clearance",
    ar: "التخليص الجمركي للصادرات",
    es: "Despacho de Exportación",
  },
  "Antrepo & Depolama": {
    tr: "Antrepo & Depolama",
    en: "Bonded Warehousing & Storage",
    ar: "المستودعات الجمركية والتخزين",
    es: "Depósito Aduanero y Almacén",
  },
  "Transit Ticaret": {
    tr: "Transit Ticaret",
    en: "Transit Trade Operations",
    ar: "تجارة الترانزيت",
    es: "Comercio de Tránsito",
  },
  "Dahilde İşleme (DİİB)": {
    tr: "Dahilde İşleme (DİİB)",
    en: "Inward Processing Regime (IPR)",
    ar: "نظام التجهيز الداخلي (DİİB)",
    es: "Régimen de Perfeccionamiento Activo",
  },
  "Hariçte İşleme": {
    tr: "Hariçte İşleme",
    en: "Outward Processing Regime",
    ar: "نظام التجهيز الخارجي",
    es: "Régimen de Perfeccionamiento Pasivo",
  },
  "Gümrük Danışmanlığı & Mevzuat": {
    tr: "Gümrük Danışmanlığı & Mevzuat",
    en: "Customs & Trade Compliance Advisory",
    ar: "استشارات جمركية والامتثال التجاري",
    es: "Consultoría y Cumplimiento Aduanero",
  },
  "Gümrük Danışmanlığı": {
    tr: "Gümrük Danışmanlığı",
    en: "Customs & Trade Advisory",
    ar: "استشارات جمركية وتجارة خارجية",
    es: "Consultoría Aduanera y Comercio",
  },

  // Hacim Seçenekleri
  "Tek Seferlik Dosya": {
    tr: "Tek Seferlik Dosya",
    en: "One-Time Shipment",
    ar: "معاملة لمرة واحدة",
    es: "Envío Único",
  },
  "1 - 5 Dosya / Ay (Düzenli)": {
    tr: "1 - 5 Dosya / Ay (Düzenli)",
    en: "1 - 5 Files / Month (Regular)",
    ar: "1 - 5 ملفات / شهر (منتظم)",
    es: "1 - 5 Expedientes / Mes (Regular)",
  },
  "1-5 Dosya / Ay": {
    tr: "1 - 5 Dosya / Ay (Düzenli)",
    en: "1 - 5 Files / Month (Regular)",
    ar: "1 - 5 ملفات / شهر (منتظم)",
    es: "1 - 5 Expedientes / Mes (Regular)",
  },
  "5 - 20 Dosya / Ay (Yüksek)": {
    tr: "5 - 20 Dosya / Ay (Yüksek)",
    en: "5 - 20 Files / Month (High)",
    ar: "5 - 20 ملفاً / شهر (مرتفع)",
    es: "5 - 20 Expedientes / Mes (Alto)",
  },
  "5-20 Dosya / Ay": {
    tr: "5 - 20 Dosya / Ay (Yüksek)",
    en: "5 - 20 Files / Month (High)",
    ar: "5 - 20 ملفاً / شهر (مرتفع)",
    es: "5 - 20 Expedientes / Mes (Alto)",
  },
  "20+ Dosya / Ay (Kurumsal)": {
    tr: "20+ Dosya / Ay (Kurumsal)",
    en: "20+ Files / Month (Corporate)",
    ar: "+20 ملفاً / شهر (مؤسسي)",
    es: "20+ Expedientes / Mes (Corporativo)",
  },
  "20+ Dosya / Ay": {
    tr: "20+ Dosya / Ay (Kurumsal)",
    en: "20+ Files / Month (Corporate)",
    ar: "+20 ملفاً / شهر (مؤسسي)",
    es: "20+ Expedientes / Mes (Corporativo)",
  },

  // Gümrük ve Liman Seçenekleri
  "İstanbul Limanları (Ambarlı / Kumport / Marport)": {
    tr: "İstanbul Limanları (Ambarlı / Kumport / Marport)",
    en: "Istanbul Seaports (Ambarli / Kumport / Marport)",
    ar: "موانئ إسطنبول البحرية (أمبرلي / كومبورت)",
    es: "Puertos de Estambul (Ambarli / Kumport / Marport)",
  },
  "İstanbul Limanları & Karayolu": {
    tr: "İstanbul Limanları & Karayolu",
    en: "Istanbul Seaports & Road Customs",
    ar: "موانئ إسطنبول والجمارك البرية",
    es: "Puertos y Aduanas de Estambul",
  },
  "İstanbul Karayolu (Erenköy / Muratbey)": {
    tr: "İstanbul Karayolu (Erenköy / Muratbey)",
    en: "Istanbul Road Customs (Erenkoy / Muratbey)",
    ar: "الجمارك البرية في إسطنبول (إيرينكوي / مراد بيه)",
    es: "Aduana Terrestre de Estambul (Erenkoy / Muratbey)",
  },
  "Havalimanı Kargo (İGA / SAW)": {
    tr: "Havalimanı Kargo (İGA / SAW)",
    en: "Airport Air Cargo (IST / SAW)",
    ar: "شحن جوي بالمطارات (IST / SAW)",
    es: "Carga Aérea Aeropuerto (IST / SAW)",
  },
  "Kocaeli / Dilovası / Evyapport / DP World": {
    tr: "Kocaeli / Dilovası / Evyapport / DP World",
    en: "Kocaeli / Dilovasi / Evyapport / DP World",
    ar: "كوجالي / ديلوفاسي / إيفيابورت / دي بي وورلد",
    es: "Kocaeli / Dilovasi / Evyapport / DP World",
  },
  "İzmir / Mersin / Gemlik Limanları": {
    tr: "İzmir / Mersin / Gemlik Limanları",
    en: "Izmir / Mersin / Gemlik Seaports",
    ar: "موانئ إزمير / مرسين / جمليك",
    es: "Puertos de Izmir / Mersin / Gemlik",
  },
  "Diğer Tüm Gümrük İdareleri": {
    tr: "Diğer Tüm Gümrük İdareleri",
    en: "All Other Customs Directorates",
    ar: "جميع الإدارات الجمركية الأخرى",
    es: "Todas las Demás Direcciones Aduaneras",
  },
};

/**
 * Alan etiketini aktif dile çevirir.
 */
export function getTranslatedFieldLabel(
  fieldName: string,
  rawLabel: string,
  lang: string
): string {
  const currentLang = (["tr", "en", "ar", "es"].includes(lang) ? lang : "tr") as SupportedLang;
  if (currentLang === "tr") return rawLabel;

  if (fieldLabelMap[fieldName]?.[currentLang]) {
    return fieldLabelMap[fieldName][currentLang];
  }

  // Raw label eşleşmesi
  for (const [key, trans] of Object.entries(fieldLabelMap)) {
    if (trans.tr.toLowerCase() === rawLabel.trim().toLowerCase()) {
      return trans[currentLang];
    }
  }

  return rawLabel;
}

/**
 * Placeholder metnini aktif dile çevirir.
 */
export function getTranslatedFieldPlaceholder(
  fieldName: string,
  rawPlaceholder: string | undefined,
  lang: string
): string {
  const currentLang = (["tr", "en", "ar", "es"].includes(lang) ? lang : "tr") as SupportedLang;
  if (currentLang === "tr" && rawPlaceholder) return rawPlaceholder;

  if (fieldPlaceholderMap[fieldName]?.[currentLang]) {
    return fieldPlaceholderMap[fieldName][currentLang];
  }

  return rawPlaceholder || "";
}

/**
 * Açılır menüdeki (select) seçeneği aktif dile çevirir.
 */
export function getTranslatedOption(optionStr: string, lang: string): string {
  const currentLang = (["tr", "en", "ar", "es"].includes(lang) ? lang : "tr") as SupportedLang;
  if (currentLang === "tr") return optionStr;

  const trimmed = optionStr.trim();
  if (optionTranslations[trimmed]?.[currentLang]) {
    return optionTranslations[trimmed][currentLang];
  }

  return optionStr;
}

/**
 * UI genel metinlerini getirir.
 */
export function getFormUIStrings(lang: string): FormTranslationStrings {
  const currentLang = (["tr", "en", "ar", "es"].includes(lang) ? lang : "tr") as SupportedLang;
  return formUIStrings[currentLang] || formUIStrings.tr;
}
