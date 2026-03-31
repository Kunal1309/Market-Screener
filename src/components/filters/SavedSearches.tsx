"use client";
import { useState, useRef, useEffect } from "react";
import { ChevronDown, Bookmark, Plus } from "lucide-react";

interface Props {
  savedFilters: { name: string; filters: any }[];
  onApply: (filters: any) => void;
  onSaveRequest: () => void;
}

export default function SavedSearches({ savedFilters, onApply, onSaveRequest }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          display: "flex", alignItems: "center", gap: 6,
          padding: "6px 12px", background: "var(--surface)",
          border: "1px solid var(--border)", borderRadius: 8,
          cursor: "pointer", fontSize: 13, fontWeight: 500,
          color: "var(--text-2)", whiteSpace: "nowrap",
        }}
      >
        <Bookmark size={13} color="var(--text-3)" />
        Saved Searches
        <ChevronDown size={13} color="var(--text-3)" />
      </button>

      {open && (
        <div
          className="anim-fadeUp"
          style={{
            position: "absolute", top: "calc(100% + 4px)", left: 0,
            background: "var(--surface)", border: "1px solid var(--border)",
            borderRadius: 8, boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
            zIndex: 100, minWidth: 220, overflow: "hidden",
          }}
        >
          {savedFilters.length === 0 ? (
            <div style={{ padding: "9px 14px", fontSize: 13, color: "var(--text-3)", fontStyle: "italic" }}>
              No saved filters yet
            </div>
          ) : (
            savedFilters.map((s, i) => (
              <button
                key={i}
                onClick={() => { onApply(s.filters); setOpen(false); }}
                style={{
                  display: "block", width: "100%", textAlign: "left",
                  padding: "9px 14px", background: "none", border: "none",
                  fontSize: 13, color: "var(--text-2)", cursor: "pointer",
                  borderBottom: "1px solid var(--surface-3)",
                  transition: "background 0.1s",
                }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "var(--surface-2)"}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = ""}
              >
                {s.name}
              </button>
            ))
          )}
          <button
            onClick={() => { onSaveRequest(); setOpen(false); }}
            style={{
              display: "flex", alignItems: "center", gap: 6, width: "100%", textAlign: "left",
              padding: "9px 14px", background: "var(--surface-1)", border: "none",
              fontSize: 13, color: "var(--brand)", cursor: "pointer", fontWeight: 500,
            }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "var(--surface-2)"}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "var(--surface-1)"}
          >
            <Plus size={14} />
            Save Current Filters
          </button>
        </div>
      )}
    </div>
  );
}
