'use client';

import { createContext, useContext, useCallback, useState, useEffect } from 'react';

export type Lang = 'es' | 'en' | 'ca' | 'fr' | 'it' | 'pt' | 'de' | 'nl' | 'ja';

export type LocaleMap = Record<string, string>;

export type I18n = {
  t: (key: string, params?: Record<string, string | number>) => string;
  lang: Lang;
  setLang: (lang: Lang) => void;
  langs: Lang[];
};

const DEFAULT_LANG: Lang = 'es';
const STORAGE_KEY = 'belentani-lang';

const loadLang = (): Lang => {
  if (typeof window === 'undefined') return DEFAULT_LANG;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && isLang(stored)) return stored;
  } catch {}
  return DEFAULT_LANG;
};

const isLang = (value: string): value is Lang => {
  return ['es', 'en', 'ca', 'fr', 'it', 'pt', 'de', 'nl', 'ja'].includes(value);
};

export const createI18n = (locales: Record<Lang, LocaleMap>) => {
  const I18nContext = createContext<I18n | null>(null);

  const I18nProvider = ({ children }: { children: React.ReactNode }) => {
    const [lang, setLangState] = useState<Lang>(loadLang);

    useEffect(() => {
      try {
        localStorage.setItem(STORAGE_KEY, lang);
      } catch {}
    }, [lang]);

    const t = useCallback(
      (key: string, params?: Record<string, string | number>): string => {
        const dict = locales[lang] || locales[DEFAULT_LANG];
        let value = dict[key];
        if (!value) {
          value = locales[DEFAULT_LANG][key];
        }
        if (!value) return key;
        if (params) {
          value = value.replace(/\{(\w+)\}/g, (_, k) => {
            const v = params[k];
            return v !== undefined ? String(v) : `{${k}}`;
          });
        }
        return value;
      },
      [lang, locales]
    );

    const setLang = useCallback((next: Lang) => {
      setLangState(next);
    }, []);

    const value: I18n = {
      t,
      lang,
      setLang,
      langs: ['es', 'en', 'ca', 'fr', 'it', 'pt', 'de', 'nl', 'ja'],
    };

    return (
      <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
    );
  };

  const useTranslation = (): I18n => {
    const ctx = useContext(I18nContext);
    if (!ctx)
      return {
        t: (key: string) => key,
        lang: DEFAULT_LANG,
        setLang: () => {},
        langs: [],
      };
    return ctx;
  };

  return { I18nProvider, useTranslation };
};

import locales from '@/locales';

const { I18nProvider: DefaultI18nProvider, useTranslation: defaultUseTranslation } =
  createI18n(
    locales as Record<string, Record<string, string>>,
  );

export { DefaultI18nProvider as I18nProvider, defaultUseTranslation as useTranslation };
