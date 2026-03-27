"use client";
import { useState, ReactNode } from "react";
import { ChevronRight, ChevronDown } from "lucide-react";

interface Props {
  title: string;
  count?: number;
  defaultOpen?: boolean;
  children: ReactNode;
  info?: string;
}

export default function FilterAccordion({ title, count, defaultOpen = false, children, info }: Props) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div style={{ borderBottom: "1px solid var(--surface-3)" }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%", display: "flex", alignItems: "center",
          justifyContent: "space-between", padding: "10px 16px",
          background: "none", border: "none", cursor: "pointer",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 13, fontWeight: 500, color: "var(--text-1)" }}>
            {title}
          </span>

          {info && (
            <div
              title={info}
              style={{
                width: 15, height: 15, borderRadius: "50%",
                border: "1.5px solid var(--text-4)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 9, color: "var(--text-4)", cursor: "help", flexShrink: 0,
              }}
            >
              i
            </div>
          )}

          {count !== undefined && count > 0 && (
            <span style={{
              background: "var(--surface-3)", color: "var(--text-2)",
              fontSize: 11, fontWeight: 600,
              padding: "1px 6px", borderRadius: 10,
              minWidth: 20, textAlign: "center",
            }}>
              {count}
            </span>
          )}
        </div>

        {open
          ? <ChevronDown  size={14} color="var(--text-4)" />
          : <ChevronRight size={14} color="var(--text-4)" />
        }
      </button>

      {open && (
        <div style={{ padding: "0 16px 12px" }} className="anim-slideIn">
          {children}
        </div>
      )}
    </div>
  );
}
