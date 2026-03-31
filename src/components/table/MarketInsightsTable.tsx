"use client";
import { useState, useMemo } from "react";
import { ArrowUpDown, ChevronUp, ChevronDown } from "lucide-react";
import { getScoreColor, truncate } from "@/lib/utils";
import type { Firm, SortState, Column } from "@/types";

interface Props {
  firms: Firm[];
  columns: Column[];
}

export default function MarketInsightsTable({ firms, columns }: Props) {
  const [sort, setSort] = useState<SortState>({ column: "", direction: null });

  const visibleCols = columns.filter(c => c.visible);

  const toggleSort = (col: string) =>
    setSort(prev =>
      prev.column === col
        ? { column: col, direction: prev.direction === "asc" ? "desc" : prev.direction === "desc" ? null : "asc" }
        : { column: col, direction: "asc" }
    );

  const sorted = useMemo(() => {
    if (!sort.column || !sort.direction) return firms;
    return [...firms].sort((a, b) => {
      const av = a[sort.column as keyof Firm];
      const bv = b[sort.column as keyof Firm];
      const mul = sort.direction === "asc" ? 1 : -1;
      if (typeof av === "number" && typeof bv === "number") return (av - bv) * mul;
      return String(av).localeCompare(String(bv)) * mul;
    });
  }, [firms, sort]);

  const SortIcon = ({ col }: { col: string }) => {
    if (sort.column !== col) return <ArrowUpDown size={12} color="var(--text-4)" />;
    return sort.direction === "asc"
      ? <ChevronUp size={12} color="var(--brand)" />
      : <ChevronDown size={12} color="var(--brand)" />;
  };

  const thStyle: React.CSSProperties = {
    padding: "10px 14px", textAlign: "left",
    fontSize: 12, fontWeight: 500, color: "var(--text-3)",
    borderBottom: "1px solid var(--border)",
    background: "var(--surface)", whiteSpace: "nowrap",
    position: "sticky", top: 0, zIndex: 1,
  };

  const tdStyle: React.CSSProperties = {
    padding: "10px 14px", fontSize: 13,
    color: "var(--text-2)", borderBottom: "1px solid var(--surface-3)",
    whiteSpace: "nowrap",
  };

  return (
    <div style={{ overflowX: "auto", flex: 1 }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            {visibleCols.map(col => (
              <th key={col.key} style={thStyle}>
                <div
                  style={{
                    display: "flex", alignItems: "center", gap: 5,
                    cursor: col.sortable ? "pointer" : "default",
                    userSelect: "none",
                  }}
                  onClick={() => col.sortable && toggleSort(col.key)}
                >
                  {col.label}
                  {col.sortable && <SortIcon col={col.key} />}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map(firm => (
            <tr key={firm.id} className="row-hover">
              {visibleCols.map(col => {
                if (col.key === "name") return (
                  <td key="name" style={{ ...tdStyle, fontWeight: 500, color: "var(--text-1)" }}>
                    {truncate(firm.name, 22)}
                  </td>
                );
                if (col.key === "location") return (
                  <td key="location" style={tdStyle}>{firm.location}</td>
                );
                if (col.key === "totalAUM") return (
                  <td key="totalAUM" style={tdStyle}>${firm.totalAUM.toFixed(2)}B</td>
                );
                if (col.key === "advisors") return (
                  <td key="advisors" style={tdStyle}>{firm.advisors}</td>
                );
                if (col.key === "hnwAUMPercent") return (
                  <td key="hnw" style={tdStyle}>{firm.hnwAUMPercent}%</td>
                );
                if (col.key === "acquisitionScore") return (
                  <td key="score" style={tdStyle}>
                    <span style={{
                      fontWeight: 600,
                      color: getScoreColor(firm.acquisitionScore),
                    }}>
                      {firm.acquisitionScore}
                    </span>
                  </td>
                );
                if (col.key === "decisionMaker") return (
                  <td key="dm" style={tdStyle}>{firm.decisionMaker}</td>
                );
                return <td key={col.key} style={tdStyle}>—</td>;
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
