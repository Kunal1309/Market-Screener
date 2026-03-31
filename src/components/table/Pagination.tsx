"use client";
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";

interface Props {
  page: number;
  totalPages: number;
  perPage: number;
  onPage: (p: number) => void;
  onPerPage: (n: number) => void;
}

export default function Pagination({ page, totalPages, perPage, onPage, onPerPage }: Props) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 12,
      padding: "10px 16px", borderTop: "1px solid var(--border)",
      background: "var(--surface)", flexShrink: 0, fontSize: 13,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <select
          value={perPage}
          onChange={e => onPerPage(Number(e.target.value))}
          style={{
            padding: "4px 8px", border: "1px solid var(--border)",
            borderRadius: 6, fontSize: 13, color: "var(--text-2)",
            background: "var(--surface)", cursor: "pointer", outline: "none",
          }}
        >
          {[10, 25, 50, 100].map(n => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>
        <span style={{ color: "var(--text-3)" }}>items per page</span>
      </div>

      <span style={{ color: "var(--text-3)" }}>
        Page <strong style={{ color: "var(--text-1)" }}>{page}</strong> of{" "}
        <strong style={{ color: "var(--text-1)" }}>{totalPages}</strong>
      </span>

      <div style={{ display: "flex", gap: 4 }}>
        <button
          onClick={() => onPage(page - 1)}
          disabled={page <= 1}
          style={{
            width: 28, height: 28, border: "1px solid var(--border)",
            borderRadius: 6, background: "var(--surface)", cursor: page > 1 ? "pointer" : "not-allowed",
            display: "flex", alignItems: "center", justifyContent: "center",
            opacity: page <= 1 ? 0.4 : 1,
          }}
        >
          <ChevronLeft size={14} color="var(--text-3)" />
        </button>
        <button
          onClick={() => onPage(page + 1)}
          disabled={page >= totalPages}
          style={{
            width: 28, height: 28, border: "1px solid var(--border)",
            borderRadius: 6, background: "var(--surface)", cursor: page < totalPages ? "pointer" : "not-allowed",
            display: "flex", alignItems: "center", justifyContent: "center",
            opacity: page >= totalPages ? 0.4 : 1,
          }}
        >
          <ChevronRight size={14} color="var(--text-3)" />
        </button>
      </div>
    </div>
  );
}
