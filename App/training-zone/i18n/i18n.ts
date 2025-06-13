import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';

import homeEn from './locales/en/home.json';
import homeEs from './locales/es/home.json';

i18n.use(initReactI18next).init({
  lng: Localization.getLocales()[0]?.languageCode || 'es',
  fallbackLng: 'es',
  ns: ['home'],
  defaultNS: 'home',
  resources: {
    en: { home: homeEn },
    es: { home: homeEs },
  },
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
