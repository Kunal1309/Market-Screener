"use client";
import { useState, useRef, useEffect } from "react";
import { Columns, ChevronDown } from "lucide-react";
import type { Column } from "@/types";

interface Props {
  columns: Column[];
  onChange: (cols: Column[]) => void;
}

export default function ColumnsPicker({ columns, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const visibleCount = columns.filter(c => c.visible).length;

  const toggle = (key: string) => {
    onChange(columns.map(c => c.key === key ? { ...c, visible: !c.visible } : c));
  };

  const allOn = columns.every(c => c.visible);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          display: "flex", alignItems: "center", gap: 6,
          padding: "6px 12px", background: open ? "var(--brand-light)" : "white",
          border: `1px solid ${open ? "var(--brand)" : "var(--border)"}`,
          borderRadius: 8, cursor: "pointer",
          fontSize: 13, fontWeight: 500,
          color: open ? "var(--brand)" : "var(--text-2)",
        }}
      >
        <Columns size={14} />
        Columns {visibleCount}
        <ChevronDown size={13} />
      </button>

      {open && (
        <div
          className="anim-fadeUp"
          style={{
            position: "absolute", top: "calc(100% + 4px)", right: 0,
            background: "white", border: "1px solid var(--border)",
            borderRadius: 8, boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            zIndex: 100, width: 220, overflow: "hidden",
          }}
        >
          {/* All toggle */}
          <label style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "9px 14px", cursor: "pointer",
            borderBottom: "1px solid var(--surface-3)",
          }}>
            <input
              type="checkbox"
              className="custom-checkbox"
              checked={allOn}
              onChange={() => onChange(columns.map(c => ({ ...c, visible: !allOn })))}
            />
            <span style={{ fontSize: 13, color: "var(--text-1)", fontWeight: 500 }}>All</span>
          </label>

          {columns.map(col => (
            <label
              key={col.key}
              style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "9px 14px", cursor: "pointer",
                borderBottom: "1px solid var(--surface-3)",
                background: "white", transition: "background 0.1s",
              }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "var(--surface-2)"}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "white"}
            >
              <input
                type="checkbox"
                className="custom-checkbox"
                checked={col.visible}
                onChange={() => toggle(col.key)}
              />
              <span style={{ fontSize: 13, color: "var(--text-2)" }}>{col.label}</span>
            </label>
          ))}

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, padding: "10px 14px" }}>
            <button
              onClick={() => setOpen(false)}
              style={{
                padding: "6px 14px", border: "1px solid var(--border)",
                borderRadius: 6, background: "white", fontSize: 13,
                cursor: "pointer", color: "var(--text-2)",
              }}
            >Cancel</button>
            <button
              onClick={() => setOpen(false)}
              style={{
                padding: "6px 14px", border: "none",
                borderRadius: 6, background: "var(--brand)",
                color: "white", fontSize: 13, fontWeight: 500, cursor: "pointer",
              }}
            >Apply</button>
          </div>
        </div>
      )}
    </div>
  );
}
