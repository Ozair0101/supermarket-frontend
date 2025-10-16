import React from 'react';
import i18n from '../i18n';

const LanguageSwitcher = () => {
  const current = i18n.resolvedLanguage || i18n.language || 'en';

  const changeLanguage = (lng) => {
    if (lng === current) return;
    i18n.changeLanguage(lng);
    try {
      window.localStorage.setItem('i18nextLng', lng);
    } catch {}
  };

  return (
    <div className="inline-flex items-center gap-2">
      <button
        type="button"
        onClick={() => changeLanguage('en')}
        className={`px-2 py-1 rounded border text-sm ${current === 'en' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white dark:bg-gray-700 dark:text-white border-gray-300 dark:border-gray-600 text-gray-700'}`}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => changeLanguage('fa')}
        className={`px-2 py-1 rounded border text-sm ${current === 'fa' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white dark:bg-gray-700 dark:text-white border-gray-300 dark:border-gray-600 text-gray-700'}`}
      >
        فا
      </button>
    </div>
  );
};

export default LanguageSwitcher;


