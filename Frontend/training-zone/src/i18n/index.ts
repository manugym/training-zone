import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import navbar_en from "./en/navbar.json";
import navbar_es from "./es/navbar.json";
import dropdown_en from "./en/dropDrownMenu.json"
import dropdown_es from "./es/dropDrownMenu.json"
import home_en from "./en/home.json";
import home_es from "./es/home.json";
import chat_en from "./en/home.json";
import chat_es from "./es/home.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        navbar: navbar_en,
        dropdown: dropdown_en,
        home: home_en,
        chat: chat_en
      },
      es: {
        navbar: navbar_es,
        dropdown: dropdown_es,
        home: home_es,
        chat: chat_es
      },
    },
    fallbackLng: ['es', 'en'],
    ns: ['navbar', 'dropdown', 'home', 'chat'],
    defaultNS: 'navbar',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    }
  });

export default i18n;