"use client";
import { useEffect } from "react";
import { X, SlidersHorizontal } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  activeCount: number;
  children: React.ReactNode;
}

export default function FilterDrawer({ open, onClose, activeCount, children }: Props) {
  /* Lock body scroll when drawer open */
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed", inset: 0,
          background: "rgba(0,0,0,0.45)",
          zIndex: 150,
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          transition: "opacity 0.2s ease",
        }}
      />

      {/* Drawer panel */}
      <div style={{
        position: "fixed",
        top: 0, left: 0, bottom: 0,
        width: "min(320px, 88vw)",
        background: "white",
        zIndex: 160,
        display: "flex", flexDirection: "column",
        transform: open ? "translateX(0)" : "translateX(-100%)",
        transition: "transform 0.25s cubic-bezier(0.4,0,0.2,1)",
        boxShadow: open ? "4px 0 32px rgba(0,0,0,0.15)" : "none",
      }}>
        {/* Drawer header */}
        <div style={{
          display: "flex", alignItems: "center",
          justifyContent: "space-between",
          padding: "14px 16px",
          borderBottom: "1px solid var(--border)",
          flexShrink: 0,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <SlidersHorizontal size={16} color="var(--brand)" />
            <span style={{ fontSize: 15, fontWeight: 600, color: "var(--text-1)" }}>
              Filters
            </span>
            {activeCount > 0 && (
              <span style={{
                background: "var(--brand)", color: "white",
                fontSize: 11, fontWeight: 700,
                padding: "1px 7px", borderRadius: 10,
              }}>
                {activeCount}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            style={{
              width: 30, height: 30, borderRadius: 8,
              border: "1px solid var(--border)",
              background: "white", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <X size={15} color="var(--text-3)" />
          </button>
        </div>

        {/* Scrollable filter content */}
        <div style={{ flex: 1, overflowY: "auto" }}>
          {children}
        </div>

        {/* Footer with apply button */}
        <div style={{
          padding: "12px 16px",
          borderTop: "1px solid var(--border)",
          flexShrink: 0,
        }}>
          <button
            onClick={onClose}
            style={{
              width: "100%", padding: "11px 0",
              background: "var(--brand)", color: "white",
              border: "none", borderRadius: 8,
              fontSize: 14, fontWeight: 600, cursor: "pointer",
              transition: "background 0.12s",
            }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "var(--brand-dark)"}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "var(--brand)"}
          >
            Apply Filters
            {activeCount > 0 && ` (${activeCount})`}
          </button>
        </div>
      </div>
    </>
  );
}
