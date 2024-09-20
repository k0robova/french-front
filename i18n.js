import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as Localization from "expo-localization";
import translationUK from "./locales/uk/translationUK.json";
import translationEN from "./locales/en/translationEN.json";

// Тексти для англійської та української мов
const resources = {
  en: {
    translation: translationEN,
  },
  ua: {
    translation: translationUK,
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: Localization.locale.includes("uk") ? "ua" : "en", // автоматичне визначення мови
  fallbackLng: "en", // мова за замовчуванням
  interpolation: {
    escapeValue: false, // для безпеки React
  },
});

export default i18n;
