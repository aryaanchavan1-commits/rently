"use client";

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import { translations, type LangKey } from "@/lib/translations";

type AnyTranslation = typeof translations["en"] | typeof translations["mr"] | typeof translations["hi"];

interface LangCtx {
  lang: LangKey;
  setLang: (l: LangKey) => void;
  t: AnyTranslation;
  mounted: boolean;
}

const LangContext = createContext<LangCtx>({
  lang: "en",
  setLang: () => {},
  t: translations.en,
  mounted: false,
});

export function LangProvider({ children, defaultLang }: { children: ReactNode; defaultLang?: LangKey }) {
  const [lang, setLangState] = useState<LangKey>(defaultLang || "en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("nivasa-lang") as LangKey;
    if (saved && (saved === "en" || saved === "mr" || saved === "hi")) {
      setLangState(saved);
    }
    setMounted(true);
  }, []);

  const setLang = useCallback((l: LangKey) => {
    setLangState(l);
    localStorage.setItem("nivasa-lang", l);
  }, []);

  return (
    <LangContext.Provider value={{ lang, setLang, t: translations[lang] as AnyTranslation, mounted }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}
