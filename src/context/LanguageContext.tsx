import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, Translations, TRANSLATIONS, CAREER_LOCALIZATION } from '../i18n/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
  getCareerTitle: (careerId: string, fallbackTitle: string) => string;
  getCareerCluster: (careerId: string, fallbackCluster: string) => string;
  getCareerDesc: (careerId: string, fallbackDesc: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Hardcode to Vietnamese as requested by user
  const [language, setLanguageState] = useState<Language>('vi');

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('edupath_language', lang);
  };

  const t = TRANSLATIONS[language];

  const getCareerTitle = (careerId: string, fallbackTitle: string): string => {
    return CAREER_LOCALIZATION[careerId]?.title || fallbackTitle;
  };

  const getCareerCluster = (careerId: string, fallbackCluster: string): string => {
    return CAREER_LOCALIZATION[careerId]?.cluster || fallbackCluster;
  };

  const getCareerDesc = (careerId: string, fallbackDesc: string): string => {
    return CAREER_LOCALIZATION[careerId]?.desc || fallbackDesc;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        getCareerTitle,
        getCareerCluster,
        getCareerDesc
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
