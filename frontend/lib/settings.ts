import { companyInfo } from "@/data/company";
import { fetchBackendNoStore } from "./api";

export interface SiteSettings {
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
  experienceYears: string | number;
  intacRate?: string;
  supportHours?: string;
  activeCustoms?: Array<{ name: string; city: string }>;
  stats?: Array<{ value: string; label: string; prefix?: string }>;
}

export async function getSiteSettingsAsync(): Promise<SiteSettings> {
  try {
    const res = await fetchBackendNoStore("/api/public/settings");
    if (res.ok) {
      const data = await res.json();
      if (data && data.success && data.settings) {
        return {
          ...companyInfo,
          ...data.settings,
        };
      }
    }
  } catch {
    // Fallback
  }
  return companyInfo;
}

export function getSiteSettings(): SiteSettings {
  return companyInfo;
}
