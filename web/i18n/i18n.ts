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
    fallbackLng: "pt", // Default to Portuguese since it's the primary language
    debug: false, // Set to false to avoid console

    // Set initial language
    lng: "pt",
    initImmediate: false, // Initialize immediately
    load: "languageOnly", // Don't load country-specific variants

    interpolation: {
      escapeValue: false, // React already escapes values
    },

    detection: {
      // Options for language detection
      order: ["localStorage", "navigator", "htmlTag"],
      caches: ["localStorage"], // Cache user language preference
    },

    react: {
      useSuspense: false, // Disable Suspense to avoid dispatcher issues
    },
  });

export default i18n;
