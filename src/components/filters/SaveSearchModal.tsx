"use client";
import { useState } from "react";
import { X } from "lucide-react";

interface Props {
  onClose: () => void;
  onSave: (name: string) => void;
}

export default function SaveSearchModal({ onClose, onSave }: Props) {
  const [name, setName] = useState("");

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 200,
      background: "rgba(0,0,0,0.3)",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <div
        className="anim-fadeUp"
        style={{
          background: "white", borderRadius: 12,
          padding: "24px 28px", width: 440,
          boxShadow: "0 8px 40px rgba(0,0,0,0.12)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <span style={{ fontSize: 15, fontWeight: 600, color: "var(--text-1)" }}>
            Save Search
          </span>
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", cursor: "pointer", display: "flex" }}
          >
            <X size={18} color="var(--text-3)" />
          </button>
        </div>

        <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "var(--text-2)", marginBottom: 6 }}>
          Search Name
        </label>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Enter search name"
          autoFocus
          style={{
            width: "100%", padding: "9px 12px",
            border: "1px solid var(--border)", borderRadius: 8,
            fontSize: 14, color: "var(--text-1)", outline: "none",
            transition: "border-color 0.12s",
          }}
          onFocus={e => (e.currentTarget.style.borderColor = "var(--brand)")}
          onBlur={e => (e.currentTarget.style.borderColor = "var(--border)")}
        />

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 20 }}>
          <button
            onClick={onClose}
            style={{
              padding: "8px 18px", borderRadius: 8,
              border: "1px solid var(--border)", background: "white",
              fontSize: 14, cursor: "pointer", color: "var(--text-2)",
            }}
          >
            Cancel
          </button>
          <button
            onClick={() => { if (name.trim()) { onSave(name.trim()); onClose(); } }}
            disabled={!name.trim()}
            style={{
              padding: "8px 18px", borderRadius: 8, border: "none",
              background: name.trim() ? "var(--brand)" : "var(--border)",
              color: "white", fontSize: 14, fontWeight: 500,
              cursor: name.trim() ? "pointer" : "not-allowed",
              transition: "background 0.12s",
            }}
          >
            Save Search
          </button>
        </div>
      </div>
    </div>
  );
}
