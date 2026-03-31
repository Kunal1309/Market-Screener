"use client";
import { useEffect } from "react";
import { X, Info } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  title: string;
  data: any | null;
}

export default function DetailsPanel({ open, onClose, title, data }: Props) {
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

      {/* Panel */}
      <div style={{
        position: "fixed",
        top: 0, right: 0, bottom: 0,
        width: "min(400px, 90vw)",
        background: "var(--surface)",
        zIndex: 160,
        display: "flex", flexDirection: "column",
        transform: open ? "translateX(0)" : "translateX(100%)",
        transition: "transform 0.25s cubic-bezier(0.4,0,0.2,1)",
        boxShadow: open ? "-4px 0 32px rgba(0,0,0,0.15)" : "none",
      }}>
        {/* Header */}
        <div style={{
          display: "flex", alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 20px",
          borderBottom: "1px solid var(--border)",
          flexShrink: 0,
          background: "var(--surface-1)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Info size={18} color="var(--brand)" />
            <h2 style={{ fontSize: 16, fontWeight: 600, color: "var(--text-1)", margin: 0 }}>
              {title}
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 32, height: 32, borderRadius: 8,
              border: "1px solid var(--border)",
              background: "var(--surface)", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <X size={16} color="var(--text-3)" />
          </button>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px" }}>
          {!data ? (
            <p style={{ color: "var(--text-3)", fontSize: 14 }}>No data selected.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {Object.entries(data).map(([key, value]) => {
                if (key === "id") return null;

                const formattedKey = key.replace(/([A-Z])/g, " $1").replace(/^./, str => str.toUpperCase());
                let displayValue = "—";

                if (value !== null && value !== undefined) {
                  if (Array.isArray(value)) {
                    displayValue = value.join(", ");
                  } else if (typeof value === "boolean") {
                    displayValue = value ? "Yes" : "No";
                  } else {
                    displayValue = String(value);
                  }
                }

                return (
                  <div key={key} style={{
                    padding: "12px",
                    background: "var(--surface-1)",
                    borderRadius: "8px",
                    border: "1px solid var(--surface-3)"
                  }}>
                    <div style={{ fontSize: 12, fontWeight: 500, color: "var(--text-3)", marginBottom: 4 }}>
                      {formattedKey}
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 500, color: "var(--text-1)", wordBreak: "break-word" }}>
                      {displayValue}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
