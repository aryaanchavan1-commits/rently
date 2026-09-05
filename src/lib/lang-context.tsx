"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { translations, type LangKey } from "@/lib/translations";

type AnyTranslation = typeof translations["en"] | typeof translations["mr"] | typeof translations["hi"];

interface LangCtx {
  lang: LangKey;
  setLang: (l: LangKey) => void;
  t: AnyTranslation;
}

const LangContext = createContext<LangCtx>({
  lang: "mr",
  setLang: () => {},
  t: translations.mr,
});

export function LangProvider({ children, defaultLang }: { children: ReactNode; defaultLang?: LangKey }) {
  const [lang, setLangState] = useState<LangKey>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("rently-lang") as LangKey) || defaultLang || "mr";
    }
    return defaultLang || "mr";
  });

  const setLang = useCallback((l: LangKey) => {
    setLangState(l);
    if (typeof window !== "undefined") {
      localStorage.setItem("rently-lang", l);
    }
  }, []);

  return (
    <LangContext.Provider value={{ lang, setLang, t: translations[lang] as AnyTranslation }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}
