"use client";

import { useLang } from "@/lib/lang-context";

const flags: Record<string, string> = {
  en: "🇬🇧",
  mr: "🇮🇳",
  hi: "🇮🇳",
};

const labels: Record<string, string> = {
  en: "EN",
  mr: "MR",
  hi: "HI",
};

export default function LanguageSelector({ inline = false }: { inline?: boolean }) {
  const { lang, setLang, mounted } = useLang();
  const options = ["en", "mr", "hi"] as const;

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
              border: lang === l ? "2px solid var(--nivasa-primary)" : "1px solid var(--nivasa-border-light)",
              background: lang === l ? "var(--nivasa-primary-light)" : "white",
              color: "var(--nivasa-text)",
              fontSize: 12,
              fontWeight: lang === l ? 700 : 500,
              cursor: "pointer",
              transition: "all 0.15s",
            }}
          >
            {flags[l]} {labels[l]}
          </button>
        ))}
      </div>
    );
  }

  return (
    <select
      value={lang}
      onChange={(e) => setLang(e.target.value as "en" | "mr" | "hi")}
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
          {flags[l]} {l === "en" ? "English" : l === "mr" ? "मराठी" : "हिन्दी"}
        </option>
      ))}
    </select>
  );
}
