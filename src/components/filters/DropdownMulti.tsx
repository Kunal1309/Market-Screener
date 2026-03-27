"use client";
import { useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronUp, X, Search } from "lucide-react";

interface Props {
  placeholder: string;
  options: string[];
  selected: string[];
  onChange: (values: string[]) => void;
  searchable?: boolean;
}

export default function DropdownMulti({ placeholder, options, selected, onChange, searchable }: Props) {
  const [open, setOpen]     = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const filtered = options.filter(o =>
    o.toLowerCase().includes(search.toLowerCase())
  );

  const toggle = (v: string) =>
    onChange(selected.includes(v) ? selected.filter(s => s !== v) : [...selected, v]);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      {/* Trigger */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%", display: "flex", alignItems: "center",
          justifyContent: "space-between", padding: "7px 11px",
          background: "white",
          border: `1px solid ${open ? "var(--brand)" : "var(--border)"}`,
          borderRadius: 8, cursor: "pointer",
          fontSize: 13, color: "var(--text-3)",
          transition: "border-color 0.12s",
        }}
      >
        <span>{placeholder}</span>
        {open ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
      </button>

      {/* Selected chips */}
      {selected.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 6 }}>
          {selected.map(v => (
            <span
              key={v}
              style={{
                display: "flex", alignItems: "center", gap: 4,
                background: "var(--surface-3)",
                border: "1px solid var(--border)",
                borderRadius: 20, padding: "2px 8px",
                fontSize: 12, color: "var(--text-2)",
              }}
            >
              {v}
              <button
                onClick={() => toggle(v)}
                style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex" }}
              >
                <X size={11} color="var(--text-4)" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Dropdown */}
      {open && (
        <div
          className="anim-fadeUp"
          style={{
            position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0,
            background: "white", border: "1px solid var(--border)",
            borderRadius: 8, boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
            zIndex: 100, overflow: "hidden", display: "flex", flexDirection: "column",
          }}
        >
          {searchable && (
            <div style={{
              padding: "7px 10px", borderBottom: "1px solid var(--surface-3)",
              display: "flex", alignItems: "center", gap: 6,
            }}>
              <Search size={12} color="var(--text-4)" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search…"
                autoFocus
                style={{ flex: 1, border: "none", outline: "none", fontSize: 13, color: "var(--text-1)" }}
              />
            </div>
          )}

          <div style={{ overflowY: "auto", maxHeight: 220 }}>
            {filtered.length === 0 && (
              <div style={{ padding: "10px 12px", fontSize: 13, color: "var(--text-4)" }}>
                No results
              </div>
            )}
            {filtered.map(opt => (
              <label
                key={opt}
                style={{
                  display: "flex", alignItems: "center", gap: 8,
                  padding: "8px 12px", cursor: "pointer",
                  borderBottom: "1px solid var(--surface-3)",
                  background: "white", transition: "background 0.1s",
                }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "var(--surface-2)"}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "white"}
              >
                <input
                  type="checkbox"
                  className="custom-checkbox"
                  checked={selected.includes(opt)}
                  onChange={() => toggle(opt)}
                />
                <span style={{ fontSize: 13, color: "var(--text-2)" }}>{opt}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
