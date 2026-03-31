"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslation } from "@/lib/i18n/LanguageContext";
import { Language } from "@/lib/i18n/dictionaries";

export default function LanguageSwitcher() {
  const { lang, setLang } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const languages: { code: Language; label: string }[] = [
    { code: "en", label: "English" },
    { code: "es", label: "Español" },
    { code: "fr", label: "Français" },
  ];

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          display: "flex", alignItems: "center", gap: 4,
          padding: "6px 10px", borderRadius: 8,
          border: "1px solid var(--border)", background: "var(--surface)",
          cursor: "pointer", color: "var(--text-1)", fontSize: 13, fontWeight: 600,
          textTransform: "uppercase"
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface-2)")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "var(--surface)")}
        title="Change Language"
      >
        {lang}
      </button>

      {open && (
        <div style={{
          position: "absolute", top: "100%", right: 0, marginTop: 8,
          background: "var(--surface)", border: "1px solid var(--border)",
          borderRadius: 8, boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          minWidth: 120, zIndex: 1000, overflow: "hidden"
        }}>
          {languages.map((l) => (
            <button
              key={l.code}
              onClick={() => {
                setLang(l.code);
                setOpen(false);
              }}
              style={{
                display: "block", width: "100%", padding: "10px 14px",
                textAlign: "left", background: "none", border: "none",
                cursor: "pointer", fontSize: 13,
                color: lang === l.code ? "var(--brand)" : "var(--text-1)",
                fontWeight: lang === l.code ? 600 : 400,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface-2)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
            >
              {l.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
