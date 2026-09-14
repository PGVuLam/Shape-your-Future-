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
  // Default to Vietnamese ('vi') as requested by user
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('edupath_language');
    return saved === 'en' ? 'en' : 'vi';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('edupath_language', lang);
  };

  const t = TRANSLATIONS[language];

  const getCareerTitle = (careerId: string, fallbackTitle: string): string => {
    if (language === 'vi' && CAREER_LOCALIZATION[careerId]?.title) {
      return CAREER_LOCALIZATION[careerId].title;
    }
    return fallbackTitle;
  };

  const getCareerCluster = (careerId: string, fallbackCluster: string): string => {
    if (language === 'vi' && CAREER_LOCALIZATION[careerId]?.cluster) {
      return CAREER_LOCALIZATION[careerId].cluster;
    }
    return fallbackCluster;
  };

  const getCareerDesc = (careerId: string, fallbackDesc: string): string => {
    if (language === 'vi' && CAREER_LOCALIZATION[careerId]?.desc) {
      return CAREER_LOCALIZATION[careerId].desc;
    }
    return fallbackDesc;
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
