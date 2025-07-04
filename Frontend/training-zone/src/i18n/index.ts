import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import navbar_en from "./en/navbar.json";
import navbar_es from "./es/navbar.json";
import dropdown_en from "./en/dropDrownMenu.json"
import dropdown_es from "./es/dropDrownMenu.json"
import home_en from "./en/home.json";
import home_es from "./es/home.json";
import chat_en from "./en/chat.json";
import chat_es from "./es/chat.json";
import trainer_en from "./en/trainers.json";
import trainer_es from "./es/trainers.json";
import class_en from "./en/class.json";
import class_es from "./es/class.json";
import user_en from "./en/user.json";
import user_es from "./es/user.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        navbar: navbar_en,
        dropdown: dropdown_en,
        home: home_en,
        chat: chat_en,
        trainer: trainer_en,
        class: class_en,
        user: user_en
      },
      es: {
        navbar: navbar_es,
        dropdown: dropdown_es,
        home: home_es,
        chat: chat_es,
        trainer: trainer_es,
        class: class_es,
        user: user_es
      },
    },
    fallbackLng: ['es', 'en'],
    ns: ['navbar', 'dropdown', 'home', 'chat', 'trainer', 'class', 'user'],
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