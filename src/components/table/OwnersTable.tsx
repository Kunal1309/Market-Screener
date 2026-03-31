"use client";
import { useState, useMemo } from "react";
import { ArrowUpDown, ChevronDown, ChevronUp } from "lucide-react";
import { truncate } from "@/lib/utils";
import type { Owner, SortState, Column } from "@/types";

interface Props {
  owners: Owner[];
  columns: Column[];
  onColumnReorder?: (sourceKey: string, targetKey: string) => void;
  sort: SortState;
  onSort: (col: string) => void;
  onRowClick: (owner: Owner) => void;
}

export default function OwnersTable({ owners, columns, onColumnReorder, sort, onSort, onRowClick }: Props) {
  const [dragOverCol, setDragOverCol] = useState<string | null>(null);

  const visibleCols = columns.filter(c => c.visible);

  const SortIcon = ({ col }: { col: string }) => {
    if (sort.column !== col) return <ArrowUpDown size={12} color="var(--text-4)" />;
    return sort.direction === "asc"
      ? <ChevronUp size={12} color="var(--brand)" />
      : <ChevronDown size={12} color="var(--brand)" />;
  };

  const getThStyle = (key: string): React.CSSProperties => ({
    padding: "10px 14px", textAlign: "left",
    fontSize: 12, fontWeight: 500, color: "var(--text-3)",
    borderBottom: "1px solid var(--border)",
    borderRight: "1px solid var(--surface-3)",
    background: dragOverCol === key ? "var(--surface-2)" : "var(--surface)",
    whiteSpace: "nowrap",
    position: "sticky", top: 0, zIndex: 1,
  });

  const getTdStyle = (key: string): React.CSSProperties => ({
    padding: "10px 14px", fontSize: 13,
    color: "var(--text-2)", borderBottom: "1px solid var(--surface-3)",
    borderRight: "1px solid var(--surface-3)",
    background: dragOverCol === key ? "var(--surface-2)" : undefined,
    whiteSpace: "nowrap",
  });

  return (
    <div style={{ overflowX: "auto", flex: 1 }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
        <thead>
          <tr>
            {visibleCols.map(col => (
              <th
                key={col.key}
                style={getThStyle(col.key)}
                draggable={!!onColumnReorder}
                onDragStart={(e) => {
                  e.dataTransfer.setData("text/plain", col.key);

                  const table = e.currentTarget.closest("table");
                  if (!table) return;

                  const colIndex = Array.from(e.currentTarget.parentElement!.children)
                    .indexOf(e.currentTarget);

                  const dragPreview = document.createElement("div");
                  dragPreview.style.position = "absolute";
                  dragPreview.style.top = "-9999px";
                  dragPreview.style.background = "var(--surface)";
                  dragPreview.style.border = "1px solid #ddd";

                  // ✅ 1. Add HEADER first
                  const headerRow = table.querySelector("thead tr");
                  if (headerRow) {
                    const headerCell = headerRow.children[colIndex]?.cloneNode(true) as HTMLElement;
                    if (headerCell) {
                      headerCell.style.display = "block";
                      headerCell.style.fontWeight = "bold";
                      dragPreview.appendChild(headerCell);
                    }
                  }

                  // ✅ 2. Then add BODY rows
                  const bodyRows = table.querySelectorAll("tbody tr");
                  bodyRows.forEach(row => {
                    const cell = row.children[colIndex]?.cloneNode(true) as HTMLElement;
                    if (cell) {
                      cell.style.display = "block";
                      dragPreview.appendChild(cell);
                    }
                  });

                  document.body.appendChild(dragPreview);

                  e.dataTransfer.setDragImage(dragPreview, 0, 0);

                  setTimeout(() => {
                    document.body.removeChild(dragPreview);
                  }, 0);
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOverCol(col.key);
                }}
                onDragLeave={() => setDragOverCol(null)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragOverCol(null);
                  const source = e.dataTransfer.getData("text/plain");
                  if (source && source !== col.key && onColumnReorder) {
                    onColumnReorder(source, col.key);
                  }
                }}
              >
                <div
                  style={{
                    display: "flex", alignItems: "center", gap: 5,
                    cursor: col.sortable ? "pointer" : (onColumnReorder ? "grab" : "default"),
                    userSelect: "none",
                  }}
                  onClick={() => col.sortable && onSort(col.key)}
                >
                  {col.label}
                  {col.sortable && <SortIcon col={col.key} />}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {owners.map(owner => (
            <tr
              key={owner.id}
              className="row-hover"
              style={{ transition: "background 0.1s", cursor: "pointer" }}
              onClick={() => onRowClick(owner)}
            >
              {visibleCols.map(col => {
                if (col.key === "name") return (
                  <td key="name" style={{ ...getTdStyle(col.key), fontWeight: 500, color: "var(--text-1)" }}>
                    {owner.name}
                  </td>
                );
                if (col.key === "firm") return (
                  <td key="firm" style={{ ...getTdStyle(col.key), fontWeight: 500 }}>
                    {truncate(owner.firm, 18)}
                  </td>
                );
                if (col.key === "ownershipPercentage") return (
                  <td key="ownership" style={getTdStyle(col.key)}>{owner.ownershipPercentage}%</td>
                );
                if (col.key === "role") return (
                  <td key="role" style={getTdStyle(col.key)}>{owner.role}</td>
                );
                if (col.key === "age") return (
                  <td key="age" style={getTdStyle(col.key)}>{owner.age}</td>
                );
                if (col.key === "tenure") return (
                  <td key="tenure" style={getTdStyle(col.key)}>{owner.tenure} yrs</td>
                );
                if (col.key === "location") return (
                  <td key="location" style={getTdStyle(col.key)}>{owner.location}</td>
                );
                return <td key={col.key} style={getTdStyle(col.key)}>—</td>;
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
