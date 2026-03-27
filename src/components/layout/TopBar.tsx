"use client";
import { useState, useRef, useEffect } from "react";
import { Search, X, Menu } from "lucide-react";
import { MOCK_FIRMS } from "@/lib/data/firms";
import { MOCK_ADVISORS } from "@/lib/data/advisors";

interface Props {
  onHamburger?: () => void;
}

export default function TopBar({ onHamburger }: Props) {
  const [q, setQ]       = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const results = q.length > 1 ? [
    ...MOCK_FIRMS
      .filter(f => f.name.toLowerCase().includes(q.toLowerCase()))
      .slice(0, 3)
      .map(f => ({ type: "firm", name: f.name, sub: `${f.location} · AUM: $${f.totalAUM}B` })),
    ...MOCK_ADVISORS
      .filter(a => a.name.toLowerCase().includes(q.toLowerCase()))
      .slice(0, 2)
      .map(a => ({ type: "advisor", name: a.name, sub: `${a.firm} · CRD: ${a.crd}` })),
  ] : [];

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  return (
    <header style={{
      height: 56,
      background: "white",
      borderBottom: "1px solid var(--border)",
      display: "flex",
      alignItems: "center",
      padding: "0 16px",
      gap: 10,
      flexShrink: 0,
      width: "100%",
      zIndex: 10,
    }}>
      {/* Hamburger — mobile only */}
      <button
        onClick={onHamburger}
        className="hamburger-btn"
        style={{
          width: 34, height: 34, borderRadius: 8,
          border: "1px solid var(--border)",
          background: "white", cursor: "pointer",
          display: "none",
          alignItems: "center", justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Menu size={17} color="var(--text-2)" />
      </button>

      {/* Search */}
      <div ref={ref} style={{ flex: 1, maxWidth: 400, position: "relative" }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          background: "var(--surface-2)",
          border: "1px solid var(--border)",
          borderRadius: 8, padding: "6px 12px",
        }}>
          <Search size={14} color="var(--text-4)" />
          <input
            value={q}
            onChange={e => { setQ(e.target.value); setOpen(true); }}
            onFocus={() => setOpen(true)}
            placeholder="Search by name or CRD…"
            style={{
              flex: 1, border: "none", background: "transparent",
              fontSize: 13, color: "var(--text-1)", outline: "none", minWidth: 0,
            }}
          />
          {q && (
            <button onClick={() => { setQ(""); setOpen(false); }}
              style={{ background: "none", border: "none", cursor: "pointer", display: "flex", padding: 0 }}>
              <X size={13} color="var(--text-4)" />
            </button>
          )}
        </div>

        {open && results.length > 0 && (
          <div style={{
            position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0,
            background: "white", border: "1px solid var(--border)",
            borderRadius: 8, boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            overflow: "hidden", zIndex: 50,
          }} className="anim-fadeUp">
            {results.map((r, i) => (
              <div key={i} onClick={() => { setQ(""); setOpen(false); }}
                style={{
                  padding: "9px 14px", cursor: "pointer",
                  display: "flex", alignItems: "center", gap: 10,
                  borderBottom: i < results.length - 1 ? "1px solid var(--surface-3)" : "none",
                  background: "white", transition: "background 0.1s",
                }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "var(--surface-2)"}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "white"}
              >
                <div style={{
                  width: 7, height: 7, borderRadius: "50%", flexShrink: 0,
                  background: r.type === "firm" ? "var(--brand)" : "#10B981",
                }} />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: "var(--text-1)" }}>{r.name}</div>
                  <div style={{ fontSize: 11, color: "var(--text-3)", marginTop: 1 }}>{r.sub}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Avatar */}
      <div style={{ marginLeft: "auto" }}>
        <div style={{
          width: 30, height: 30, borderRadius: "50%",
          background: "var(--brand)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 12, fontWeight: 600, color: "white",
          cursor: "pointer", userSelect: "none", flexShrink: 0,
        }}>
          U
        </div>
      </div>
    </header>
  );
}
