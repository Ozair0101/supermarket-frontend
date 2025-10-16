import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en.json';
import fa from './locales/fa.json';

const resources = {
  en: { translation: en },
  fa: { translation: fa },
};

function applyDirection(lang) {
  const isRtl = lang === 'fa';
  const dir = isRtl ? 'rtl' : 'ltr';
  if (typeof document !== 'undefined') {
    const html = document.documentElement;
    if (html) {
      html.setAttribute('lang', lang);
      html.setAttribute('dir', dir);
    }
  }
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    supportedLngs: ['en', 'fa'],
    defaultNS: 'translation',
    interpolation: { escapeValue: false },
    detection: {
      // Use localStorage first, then navigator
      order: ['localStorage', 'navigator', 'htmlTag'],
      lookupLocalStorage: 'i18nextLng',
      caches: ['localStorage'],
    },
    returnEmptyString: false,
  }, (err, t) => {
    const current = i18n.resolvedLanguage || i18n.language || 'en';
    applyDirection(current);
  });

i18n.on('languageChanged', (lng) => {
  applyDirection(lng);
});

export default i18n;


