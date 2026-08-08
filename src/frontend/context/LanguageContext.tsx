'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'TA' | 'EN';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'TA',
  toggleLanguage: () => {},
  setLanguage: () => {},
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('TA');

  useEffect(() => {
    const savedLang = localStorage.getItem('akshayam_language') as Language;
    if (savedLang === 'TA' || savedLang === 'EN') {
      setLanguageState(savedLang);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('akshayam_language', lang);
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === 'TA' ? 'EN' : 'TA');
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
