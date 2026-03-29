'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'fr' | 'en' | 'wo' | 'ar' | 'zh';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'fr',
  setLanguage: () => {},
  t: (key) => key,
  isRTL: false,
});

type TranslationData = Record<string, unknown>;

const translationCache: Partial<Record<Language, TranslationData>> = {};

async function loadTranslations(lang: Language): Promise<TranslationData> {
  if (translationCache[lang]) return translationCache[lang]!;
  try {
    const res = await fetch(`/locales/${lang}/common.json`);
    const data = await res.json();
    translationCache[lang] = data;
    return data;
  } catch {
    return {};
  }
}

function getNestedValue(obj: TranslationData, path: string): string {
  const keys = path.split('.');
  let current: unknown = obj;
  for (const key of keys) {
    if (current && typeof current === 'object' && key in (current as Record<string, unknown>)) {
      current = (current as Record<string, unknown>)[key];
    } else {
      return path;
    }
  }
  return typeof current === 'string' ? current : path;
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('fr');
  const [translations, setTranslations] = useState<TranslationData>({});

  useEffect(() => {
    const saved = localStorage.getItem('borbi_lang') as Language | null;
    if (saved && ['fr', 'en', 'wo', 'ar', 'zh'].includes(saved)) {
      setLanguageState(saved);
    }
  }, []);

  useEffect(() => {
    loadTranslations(language).then(setTranslations);
    // Set RTL for Arabic
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('borbi_lang', lang);
  };

  const t = (key: string): string => getNestedValue(translations, key);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL: language === 'ar' }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}

export const LANGUAGES: Array<{ code: Language; label: string; flag: string; nativeName: string }> = [
  { code: 'fr', label: 'Français', flag: '🇫🇷', nativeName: 'Français' },
  { code: 'en', label: 'English', flag: '🇬🇧', nativeName: 'English' },
  { code: 'wo', label: 'Wolof', flag: '🇸🇳', nativeName: 'Wolof' },
  { code: 'ar', label: 'العربية', flag: '🇸🇦', nativeName: 'العربية' },
  { code: 'zh', label: '中文', flag: '🇨🇳', nativeName: '中文' },
];
