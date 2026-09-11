"use client";

import { useLang } from "@/lib/lang-context";
import type { LangKey } from "@/lib/translations";

const langMeta: Record<string, { flag: string; label: string; name: string }> = {
  en: { flag: "🇬🇧", label: "EN", name: "English" },
  mr: { flag: "🇮🇳", label: "MR", name: "मराठी" },
  hi: { flag: "🇮🇳", label: "HI", name: "हिन्दी" },
  bn: { flag: "🇮🇳", label: "BN", name: "বাংলা" },
  ta: { flag: "🇮🇳", label: "TA", name: "தமிழ்" },
  te: { flag: "🇮🇳", label: "TE", name: "తెలుగు" },
  kn: { flag: "🇮🇳", label: "KN", name: "ಕನ್ನಡ" },
  gu: { flag: "🇮🇳", label: "GU", name: "ગુજરાતી" },
  ml: { flag: "🇮🇳", label: "ML", name: "മലയാളം" },
  pa: { flag: "🇮🇳", label: "PA", name: "ਪੰਜਾਬੀ" },
  ur: { flag: "🇵🇰", label: "UR", name: "اردو" },
  or: { flag: "🇮🇳", label: "OR", name: "ଓଡ଼ିଆ" },
  as: { flag: "🇮🇳", label: "AS", name: "অসমীয়া" },
};

const allLangs = Object.keys(langMeta) as LangKey[];

const groups = [
  { label: "English", langs: ["en"] as LangKey[] },
  { label: "Hindi Belt", langs: ["hi", "mr", "pa"] as LangKey[] },
  { label: "South India", langs: ["ta", "te", "kn", "ml"] as LangKey[] },
  { label: "East India", langs: ["bn", "or", "as"] as LangKey[] },
  { label: "West India", langs: ["gu"] as LangKey[] },
  { label: "Other", langs: ["ur"] as LangKey[] },
];

export default function LanguageSelector({ inline = false }: { inline?: boolean }) {
  const { lang, setLang, mounted } = useLang();

  if (!mounted) return null;

  if (inline) {
    return (
      <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
        {allLangs.map((l) => (
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
            {langMeta[l].flag} {langMeta[l].label}
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
        minWidth: 120,
      }}
    >
      {groups.map((g) => (
        <optgroup key={g.label} label={g.label}>
          {g.langs.map((l) => (
            <option key={l} value={l}>
              {langMeta[l].flag} {langMeta[l].name}
            </option>
          ))}
        </optgroup>
      ))}
    </select>
  );
}
