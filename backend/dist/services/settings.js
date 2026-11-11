import { db, isDbConnected } from "../db/index.js";
import { siteSettings } from "../db/schema.js";
import { eq } from "drizzle-orm";
import { companyInfo } from "../data/company.js";
import { safeJsonParse } from "../utils/http.js";
/**
 * Veritabanındaki güncel firma/iletişim ayarlarını okur; yoksa veya DB kapalıysa
 * companyInfo varsayılanlarıyla birleştirerek döner.
 */
export async function getCompanySettings() {
    if (!isDbConnected) {
        return { ...companyInfo };
    }
    try {
        const [record] = await db
            .select()
            .from(siteSettings)
            .where(eq(siteSettings.key, "general_settings"))
            .limit(1);
        const dbSettings = safeJsonParse(record?.value, {});
        return {
            ...companyInfo,
            ...dbSettings,
        };
    }
    catch {
        return { ...companyInfo };
    }
}
