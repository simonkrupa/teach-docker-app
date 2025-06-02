import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enLang from '../data/i18n/locales/en/translation.json';
import skLang from '../data/i18n/locales/sk/translation.json';

const resources = {
  en: {
    translation: enLang,
  },
  sk: {
    translation: skLang,
  },
};

i18n.use(initReactI18next).init({
  resources,
  fallbackLng: 'en',
  lng: 'sk',
  debug: false,
  interpolation: {
    escapeValue: false,
  },
});

i18n.languages = ['en', 'sk'];

export default i18n;
