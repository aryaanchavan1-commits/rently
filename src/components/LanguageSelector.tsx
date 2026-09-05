"use client";

import { useLang } from "@/lib/lang-context";
import { translations, type LangKey } from "@/lib/translations";

const flags: Record<LangKey, string> = {
  en: "🇬🇧",
  mr: "🇮🇳",
  hi: "🇮🇳",
};

export default function LanguageSelector({ inline = false }: { inline?: boolean }) {
  const { lang, setLang } = useLang();
  const options: LangKey[] = ["en", "mr", "hi"];

  if (inline) {
    return (
      <div style={{ display: "flex", gap: 4 }}>
        {options.map((l) => (
          <button
            key={l}
            onClick={() => setLang(l)}
            style={{
              padding: "6px 10px",
              borderRadius: 8,
              border: lang === l ? "2px solid #0d6efd" : "1px solid #e3e7ef",
              background: lang === l ? "rgba(13,110,253,0.08)" : "white",
              color: "#0b1437",
              fontSize: 12,
              fontWeight: lang === l ? 700 : 500,
              cursor: "pointer",
              transition: "all 0.15s",
            }}
          >
            {flags[l]} {l.toUpperCase()}
          </button>
        ))}
      </div>
    );
  }

  return (
    <select
      value={lang}
      onChange={(e) => setLang(e.target.value as LangKey)}
      className="input"
      style={{
        width: "auto",
        padding: "7px 12px",
        fontSize: 13,
        borderRadius: 8,
        cursor: "pointer",
        background: "white",
        minWidth: 100,
      }}
    >
      {options.map((l) => (
        <option key={l} value={l}>
          {flags[l]} {translations[l].lang}
        </option>
      ))}
    </select>
  );
}
