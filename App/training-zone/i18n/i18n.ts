import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as Localization from "expo-localization";

import homeEn from "./locales/en/home.json";
import homeEs from "./locales/es/home.json";
import trainerEn from "./locales/en/trainer.json";
import trainerEs from "./locales/es/trainer.json";
import classEn from "./locales/en/class.json";
import classEs from "./locales/es/class.json";
import authEn from "./locales/en/auth.json";
import authEs from "./locales/es/auth.json";
import chatEn from "./locales/en/chat.json";
import chatEs from "./locales/es/chat.json";
import userEn from "./locales/en/user.json";
import userEs from "./locales/es/user.json";

i18n.use(initReactI18next).init({
  lng: Localization.getLocales()[0]?.languageCode || "es",
  fallbackLng: "es",
  ns: ["home", "trainer", "class", "auth", "chat"],
  defaultNS: "home",
  resources: {
    en: {
      home: homeEn,
      trainer: trainerEn,
      class: classEn,
      auth: authEn,
      chat: chatEn,
      user: userEn,
    },
    es: {
      home: homeEs,
      trainer: trainerEs,
      class: classEs,
      auth: authEs,
      chat: chatEs,
      user: userEs,
    },
  },
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
