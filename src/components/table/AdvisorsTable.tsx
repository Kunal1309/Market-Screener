"use client";
import { useState, useMemo } from "react";
import { ArrowUpDown, ExternalLink, ChevronDown, ChevronUp } from "lucide-react";
import { getComplianceStyle, truncate } from "@/lib/utils";
import type { Advisor, SortState, Column } from "@/types";

interface Props {
  advisors: Advisor[];
  columns: Column[];
}

export default function AdvisorsTable({ advisors, columns }: Props) {
  const [sort, setSort] = useState<SortState>({ column: "", direction: null });

  const visibleCols = columns.filter(c => c.visible);

  const toggleSort = (col: string) => {
    setSort(prev =>
      prev.column === col
        ? { column: col, direction: prev.direction === "asc" ? "desc" : prev.direction === "desc" ? null : "asc" }
        : { column: col, direction: "asc" }
    );
  };

  const sorted = useMemo(() => {
    if (!sort.column || !sort.direction) return advisors;
    return [...advisors].sort((a, b) => {
      const av = a[sort.column as keyof Advisor];
      const bv = b[sort.column as keyof Advisor];
      const mul = sort.direction === "asc" ? 1 : -1;
      if (typeof av === "number" && typeof bv === "number") return (av - bv) * mul;
      return String(av).localeCompare(String(bv)) * mul;
    });
  }, [advisors, sort]);

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
    background: "white", whiteSpace: "nowrap",
    position: "sticky", top: 0, zIndex: 1,
  };

  const tdStyle: React.CSSProperties = {
    padding: "10px 14px", fontSize: 13,
    color: "var(--text-2)", borderBottom: "1px solid var(--surface-3)",
    whiteSpace: "nowrap",
  };

  return (
    <div style={{ overflowX: "auto", flex: 1 }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
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
          {sorted.map(advisor => (
            <tr
              key={advisor.id}
              className="row-hover"
              style={{ transition: "background 0.1s" }}
            >
              {visibleCols.map(col => {
                if (col.key === "name") return (
                  <td key="name" style={{ ...tdStyle, fontWeight: 500, color: "var(--text-1)" }}>
                    {advisor.name}
                  </td>
                );
                if (col.key === "crd") return (
                  <td key="crd" style={tdStyle}>
                    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      {advisor.crd}
                      <ExternalLink size={12} color="var(--text-4)" style={{ cursor: "pointer" }} />
                    </div>
                  </td>
                );
                if (col.key === "location") return (
                  <td key="location" style={tdStyle}>{advisor.location}</td>
                );
                if (col.key === "firm") return (
                  <td key="firm" style={{ ...tdStyle, fontWeight: 500 }}>
                    {truncate(advisor.firm, 18)}
                  </td>
                );
                if (col.key === "yearsOfExperience") return (
                  <td key="yoe" style={tdStyle}>{advisor.yearsOfExperience}</td>
                );
                if (col.key === "age") return (
                  <td key="age" style={tdStyle}>{advisor.age}</td>
                );
                if (col.key === "compliance") return (
                  <td key="compliance" style={tdStyle}>
                    <span style={{ ...getComplianceStyle(advisor.compliance), fontWeight: 500 }}>
                      {advisor.compliance}
                    </span>
                  </td>
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
