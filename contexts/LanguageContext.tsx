"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import ar from '@/locales/ar.json';
import fr from '@/locales/fr.json';
import en from '@/locales/en.json';

type Language = 'ar' | 'fr' | 'en';
type Translations = typeof ar;

interface LanguageContextType {
  language: Language;
  currentLang: Language; // Alias for language
  setLanguage: (lang: Language) => void;
  dir: 'rtl' | 'ltr';
  t: (key: string) => string;
}

const translations = { ar, fr, en };

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('ar');

  useEffect(() => {
    // Load language from localStorage if available
    const savedLang = localStorage.getItem('justivia_lang') as Language;
    if (savedLang && ['ar', 'fr', 'en'].includes(savedLang)) {
      setLanguageState(savedLang);
    }
  }, []);

  useEffect(() => {
    // Update html attributes
    const dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
    document.documentElement.dir = dir;
    localStorage.setItem('justivia_lang', language);
  }, [language]);

  const dir = language === 'ar' ? 'rtl' : 'ltr';

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[language];
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return key; // Fallback to key if not found
      }
    }
    return typeof value === 'string' ? value : key;
  };

  return (
    <LanguageContext.Provider value={{ language, currentLang: language, setLanguage: setLanguageState, dir, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
