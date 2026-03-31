"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { dictionaries, Language } from "./dictionaries";

type LanguageContextType = {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextType>({
  lang: "en",
  setLang: () => {},
  t: (key) => key,
});

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLangState] = useState<Language>("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("app_lang") as Language;
    if (stored && dictionaries[stored]) {
      setLangState(stored);
    }
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem("app_lang", newLang);
  };

  const t = (path: string) => {
    const keys = path.split(".");
    let current: any = dictionaries[lang];
    for (const key of keys) {
      if (current === undefined || current[key] === undefined) {
        // Fallback to english if not found
        let fallback: any = dictionaries["en"];
        for(const fbKey of keys) {
            if(fallback === undefined || fallback[fbKey] === undefined) return path;
            fallback = fallback[fbKey];
        }
        return fallback;
      }
      current = current[key];
    }
    return current as string;
  };

  if (!mounted) {
    // Prevent SSR hydration mismatch
    let current: any = dictionaries["en"];
    const fallbackT = (path: string) => {
        const keys = path.split(".");
        let c: any = current;
        for (const k of keys) {
            if(c === undefined || c[k] === undefined) return path;
            c = c[k];
        }
        return c as string;
    };
    return <LanguageContext.Provider value={{ lang: "en", setLang, t: fallbackT }}>{children}</LanguageContext.Provider>;
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => useContext(LanguageContext);
