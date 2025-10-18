import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

// Import translation files
import enTranslations from "./locales/en.json";
import ptTranslations from "./locales/pt.json";

const resources = {
  en: {
    translation: enTranslations,
  },
  pt: {
    translation: ptTranslations,
  },
};

// Initialize i18n
void i18n
  .use(LanguageDetector) // Detects user language
  .use(initReactI18next) // Passes i18n down to react-i18next
  .init({
    resources,
    fallbackLng: "en", // Fallback to English if detection fails
    debug: false, // Keep quiet in production
    initImmediate: false, // Initialize immediately
    load: "languageOnly",

    interpolation: {
      escapeValue: false, // React already escapes values
    },

    detection: {
      // Only detect from browser, don't cache to localStorage
      // Language preference is managed by auth context
      order: ["navigator", "htmlTag"],
      caches: [], // No caching - auth context handles persistence
    },

    react: {
      useSuspense: false, // Disable Suspense to avoid dispatcher issues
    },
  });

export default i18n;
