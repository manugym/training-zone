import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as Localization from "expo-localization";

import homeEn from "./locales/en/home.json";
import homeEs from "./locales/es/home.json";
import trainerEn from "./locales/en/trainer.json";
import trainerEs from "./locales/es/trainer.json";
import classEn from './locales/en/class.json';
import classEs from './locales/es/class.json';

i18n.use(initReactI18next).init({
  lng: Localization.getLocales()[0]?.languageCode || "es",
  fallbackLng: "es",
  ns: ["home", "trainer", 'class'],
  defaultNS: "home",
  resources: {
    en: {
      home: homeEn,
      trainer: trainerEn,
    },
    es: {
      home: homeEs,
      trainer: trainerEs,
    },
  },
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
