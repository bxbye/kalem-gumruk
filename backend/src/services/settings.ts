import { db, isDbConnected } from "../db/index.js";
import { siteSettings } from "../db/schema.js";
import { eq } from "drizzle-orm";
import { companyInfo } from "../data/company.js";
import { safeJsonParse } from "../utils/http.js";

export interface CompanySettings {
  name: string;
  shortName: string;
  slogan: string;
  description: string;
  address: string;
  phone: string;
  phoneRaw: string;
  whatsapp: string;
  whatsappDefaultMessage: string;
  email: string;
  evrimPortalUrl: string;
  workingHours: string;
  foundedYear?: string | number;
  experienceYears?: string | number;
  intacRate?: string;
  supportHours?: string;
  complianceRate?: string;
}

/**
 * Veritabanındaki güncel firma/iletişim ayarlarını okur; yoksa veya DB kapalıysa
 * companyInfo varsayılanlarıyla birleştirerek döner.
 */
export async function getCompanySettings(): Promise<CompanySettings> {
  if (!isDbConnected) {
    return { ...companyInfo };
  }

  try {
    const [record] = await db
      .select()
      .from(siteSettings)
      .where(eq(siteSettings.key, "general_settings"))
      .limit(1);

    const dbSettings = safeJsonParse<Partial<CompanySettings>>(record?.value, {});
    return {
      ...companyInfo,
      ...dbSettings,
    };
  } catch {
    return { ...companyInfo };
  }
}
