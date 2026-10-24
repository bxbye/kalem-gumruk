import { tr } from "./tr";
import { en } from "./en";
import { ar } from "./ar";
import { es } from "./es";
import { Language, Translations } from "./types";

export const translations: Record<Language, Translations> = {
  tr,
  en,
  ar,
  es,
};

export const availableLanguages: {
  code: Language;
  name: string;
  nativeName: string;
  flag: string;
  dir: "ltr" | "rtl";
}[] = [
  { code: "tr", name: "Türkçe", nativeName: "Türkçe", flag: "🇹🇷", dir: "ltr" },
  { code: "en", name: "English", nativeName: "English", flag: "🇬🇧", dir: "ltr" },
  { code: "ar", name: "Arabic", nativeName: "العربية", flag: "🇸🇦", dir: "rtl" },
  { code: "es", name: "Español", nativeName: "Español", flag: "🇪🇸", dir: "ltr" },
];

export * from "./types";
