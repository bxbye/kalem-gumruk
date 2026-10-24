import { servicesData } from "@/data/services";
import { translations, Language } from "@/data/translations";

export interface ServiceItem {
  id: string;
  slug: string;
  title: string;
  shortDesc: string;
  iconName: string;
  category: "gumruk" | "rejim" | "danismanlik";
  features: string[];
  detailedContent: string;
  orderIndex: number;
  isActive: boolean;
  translations?: Record<
    string,
    {
      title?: string;
      shortDesc?: string;
      detailedContent?: string;
      features?: string[];
    }
  >;
}

export const serviceSlugToTranslationKey: Record<string, string> = {
  ithalat: "import",
  ihracat: "export",
  "dahilde-isleme": "dir",
  "haricte-isleme": "haricte",
  antrepo: "antrepo",
  transit: "transit",
  "serbest-bolge": "serbestBolge",
  danismanlik: "danismanlik",
  hukuk: "hukuk",
  sigorta: "sigorta",
};

// Çok dilli hizmet detayları (features & detailedContent)
const localizedServiceContent: Record<
  string,
  Record<
    "en" | "ar" | "es",
    {
      detailedContent: string;
      features: string[];
    }
  >
> = {
  ithalat: {
    en: {
      detailedContent:
        "The import regime is one of the most critical and cost-sensitive phases of international trade. With over 25 years of field experience and digital EDI tracking since 1997, Kalem Customs Brokerage initiates pre-checks before cargo reaches Turkish ports, eliminating delays and demurrage expenses. We manage all regulatory compliance, ministry permits, and tariff audits with zero-defect accuracy.",
      features: [
        "Comprehensive feasibility and cost analysis for imported goods",
        "Harmonized System (HS / GTİP) code classification and duty calculation",
        "Document collection, carrier tracking and delivery order (ordino) receipt",
        "Regulatory ministry permits (TAREKS, TSE, Ministry of Agriculture/Health)",
        "On-site physical inspection at major seaports, airports and land customs",
        "Payment of duties, collateral deposits and formal tax assessments",
        "Direct bonded or free circulation transport organization to your warehouse",
      ],
    },
    ar: {
      detailedContent:
        "يعد نظام الاستيراد أحد أكثر مراحل التجارة الدولية حساسية وأهمية. بفضل خبرتنا الميدانية الممتدة منذ عام 1997 وبنيتنا التحتية الرقمية، تبدأ قلم للتخليص الجمركي الفحص المسبق قبل وصول البضائع إلى الموانئ التركية لمنع أي تأخير أو رسوم أرضيات إضافية، مع إنجاز جميع التراخيص والتدقيق الضريبي باحترافية كاملة.",
      features: [
        "إجراء دراسة جدوى وتكلفة تفصيلية للبضائع المستوردة",
        "تحديد الرمز الجمركي (GTİP / HS Code) وحساب الرسوم بدقة",
        "متابعة بوالص الشحن واستلام إذن التسليم (الأردينو) من الناقل",
        "استخراج أذونات الاستيراد الوزارية ومطابقة المواصفات (TSE, TAREKS)",
        "المعاينة الميدانية في الموانئ والمطارات والمنافذ الجمركية البرية",
        "تسديد الرسوم الجمركية والضريبية والضمانات البنكية المعتمدة",
        "تنظيم الشحن والنقل الداخلي وتسليم البضاعة إلى مستودعات العميل",
      ],
    },
    es: {
      detailedContent:
        "El régimen de importación es una de las fases más exigentes y de mayor impacto económico en el comercio exterior. Respaldados por más de 25 años de experiencia y seguimiento digital, en Kalem Aduanas anticipamos las gestiones antes de la llegada de la carga a los puertos turcos, evitando demoras y costes de almacenaje imprevistos.",
      features: [
        "Estudio de viabilidad previa y simulación de costes arancelarios",
        "Clasificación arancelaria rigurosa (código GTİP / SA) y liquidación de tributos",
        "Gestión documental con navieras/aerolíneas y recogida de albaranes de entrega",
        "Tramitación de permisos regulatorios y certificaciones oficiales (TAREKS, TSE)",
        "Inspección física y despacho presencial en recintos aduaneros y puertos",
        "Gestión del pago de aranceles, IVA y formalización de avales bancarios",
        "Coordinación del transporte y entrega directa en las instalaciones del cliente",
      ],
    },
  },
  ihracat: {
    en: {
      detailedContent:
        "Speed and documentary accuracy are vital for export success. Kalem Customs Brokerage ensures instantaneous customs declaration closure, digital certificate issuance, and integration with Turkish Exporters' Associations, ensuring smooth VAT refund processes and expedited exit operations across all custom boundaries.",
      features: [
        "Pre-export feasibility and HS Code determination",
        "Registration with Exporters' Associations and declaration approvals",
        "Issuance of A.TR, EUR.1, Certificate of Origin, and Form A documents",
        "Consular and embassy legalizations according to destination country requirements",
        "Preparation, submission and expedited clearance of Export Declarations (GCB)",
        "Real-time departure tracking (intaç) for instant VAT rebate compliance",
      ],
    },
    ar: {
      detailedContent:
        "تعتبر السرعة والدقة الوثائقية ركيزتين أساسيتين في عمليات التصدير. تضمن شركة قلم للتخليص الجمركي إغلاق البيانات الجمركية فورياً، وإصدار شهادات المنشأ والحركة الدولية، ومتابعة خروج الشحنات إلكترونياً بما يضمن استرداد الضرائب والامتثال التام للأنظمة.",
      features: [
        "دراسة الجدوى وتحديد الرمز الجمركي والتحليل التصديري",
        "التسجيل في اتحادات المصدرين واعتماد البيانات إلكترونياً",
        "إصدار وتصديق شهادات A.TR و EUR.1 وشهادة المنشأ ونماذج FORM A",
        "التصديقات القنصلية والسفارات بحسب متطلبات الدولة المستقبلة",
        "تنظيم البيان الجمركي للتصدير ومتابعة إنهاء الإجراءات بسرعة",
        "متابعة إتمام الخروج الفعلي لتسهيل إجراءات استرداد ضريبة القيمة المضافة",
      ],
    },
    es: {
      detailedContent:
        "La agilidad operativa y la precisión documental son fundamentales en exportación. En Kalem Aduanas tramitamos sus declaraciones aduaneras y certificados de origen con máxima rapidez, garantizando la correcta salida física de las mercancías y facilitando la recuperación ágil del IVA soportado.",
      features: [
        "Análisis de viabilidad arancelaria y comprobación de partidas GTİP",
        "Tramitación ante Asociaciones de Exportadores y validación de expedientes",
        "Emisión de certificados de circulación A.TR, EUR.1, Certificado de Origen y FORM A",
        "Gestiones de visado consular y legalizaciones diplomáticas requeridas",
        "Despacho y registro telemático del Documento Único Aduanero de Exportación",
        "Seguimiento de la salida efectiva (intaç) para la liquidación fiscal del IVA",
      ],
    },
  },
  "dahilde-isleme": {
    en: {
      detailedContent:
        "The Inward Processing Regime (DİR / IPR) provides immense duty and VAT exemption advantages for raw material and packaging imports intended for export manufacturing. Kalem Customs meticulously manages DİİB permits from inception to collateral release, safeguarding your business from deadlines and penalties.",
      features: [
        "Acquisition and management of Inward Processing Authorization Certificates (DİİB)",
        "Real-time stock balance tracking of imported materials versus exported finished goods",
        "Proactive expiration warnings and time-extension petitions",
        "Commitment closure documentation preparation and ministry audit defense",
        "Resolution and refund of customs letters of guarantee",
      ],
    },
    ar: {
      detailedContent:
        "يوفر نظام المعالجة الداخلية (DİR) إعفاءات جمركية وضريبية هامة للصناعيين والمصدرين على المواد الأولية المستوردة بهدف التصنيع والتصدير. تتولى قلم إدارة وثائق DİİB بدقة متناهية من استخراجها ومتابعة مددها حتى فك الضمانات البنكية وإغلاق الملفات.",
      features: [
        "استخراج وتجديد شهادات تصريح المعالجة الداخلية (DİİB)",
        "متابعة حركة الأرصدة والمخزون بين المواد المستوردة والمنتجات المصدرة",
        "نظام إنذار مبكر لمدد الوثائق لتفادي أي غرامات جمركية",
        "إعداد ملفات إغلاق التعهدات الجمركية ومتابعتها لدى الوزارة المختصة",
        "استرداد وفك خطابات الضمان المصرفية المودعة لدى الجمارك",
      ],
    },
    es: {
      detailedContent:
        "El Régimen de Perfeccionamiento Activo (DİR) otorga exenciones arancelarias e impositivas a la importación de materias primas destinadas a la producción exportadora. En Kalem gestionamos sus certificados DİİB de principio a fin, asegurando el cumplimiento de plazos y la devolución de garantías.",
      features: [
        "Obtención y gestión de permisos de Perfeccionamiento Activo (DİİB)",
        "Control exhaustivo de saldos entre compras importadas y productos exportados",
        "Supervisión proactiva de vencimientos y prórrogas reglamentarias",
        "Preparación de expedientes para la cancelación y cierre de compromisos",
        "Liberación y devolución de avales bancarios depositados ante la aduana",
      ],
    },
  },
};

function getFallbackServices(lang: string = "tr"): ServiceItem[] {
  const currentLang = (lang || "tr") as Language;
  const langKey = (["en", "ar", "es"].includes(currentLang) ? currentLang : "tr") as "tr" | "en" | "ar" | "es";

  return servicesData.map((item, idx) => {
    const tKey = serviceSlugToTranslationKey[item.slug];
    const trans = translations[langKey];
    const serviceTrans = tKey && trans?.services ? (trans.services as any)[tKey] : null;

    const title = serviceTrans?.title || item.title;
    const shortDesc = serviceTrans?.desc || item.shortDesc;

    // Özel çevrilmiş içerik ve özellik maddeleri
    let features = item.features;
    let detailedContent = item.detailedContent;

    if (langKey !== "tr" && localizedServiceContent[item.slug]?.[langKey]) {
      const loc = localizedServiceContent[item.slug][langKey];
      features = loc.features;
      detailedContent = loc.detailedContent;
    }

    return {
      id: `service-${item.slug}`,
      slug: item.slug,
      title,
      shortDesc,
      iconName: item.iconName,
      category: item.category,
      features,
      detailedContent,
      orderIndex: idx,
      isActive: true,
    };
  });
}

export async function getAllServicesAsync(lang: string = "tr"): Promise<ServiceItem[]> {
  const backendUrl = process.env.BACKEND_INTERNAL_URL || "http://localhost:5001";
  try {
    const res = await fetch(`${backendUrl}/api/public/services?lang=${lang}`, {
      next: { revalidate: 60 },
    });
    if (res.ok) {
      const data = await res.json();
      if (data.services && data.services.length > 0) {
        return data.services;
      }
    }
  } catch {
    // Fallback
  }
  return getFallbackServices(lang);
}

export function getAllServices(lang: string = "tr"): ServiceItem[] {
  return getFallbackServices(lang);
}

export function getServiceBySlug(slug: string, lang: string = "tr"): ServiceItem | undefined {
  const all = getFallbackServices(lang);
  return all.find((s) => s.slug === slug);
}
