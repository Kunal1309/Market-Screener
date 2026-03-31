"use client";
import { useState, useMemo } from "react";
import { Search, SlidersHorizontal, ArrowUpDown, ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";
import FirmFilterPanel from "@/components/filters/FirmFilterPanel";
import FilterDrawer from "@/components/filters/FilterDrawer";
import ColumnsPicker from "@/components/table/ColumnsPicker";
import ExportDropdown from "@/components/table/ExportDropdown";
import Pagination from "@/components/table/Pagination";
import DetailsPanel from "@/components/views/DetailsPanel";
import SaveSearchModal from "@/components/filters/SaveSearchModal";
import { MOCK_FIRMS } from "@/lib/data/firms";
import type { FirmFilters, Column, SortState, Firm } from "@/types";

const DEFAULT_FILTERS: FirmFilters = {
  totalAUM: [], hnwClientAUM: [], acquisitionScore: [],
  custodian: [], location: [], officeCount: [],
  advisorCount: [], aumPerAdvisor: [], clients: [],
  employees: [], secRegistrationDateFrom: "", secRegistrationDateTo: "",
  aumCAGR: [], pastAcquisitions: [], ownerTenure: [],
  ownerAge: [], familyOwned: null,
  smartSearch: true, outpacesMarketGrowth: false,
  hnwClientGrowth: [], clientGrowth: [],
};

const DEFAULT_COLUMNS: Column[] = [
  { key: "name", label: "Firm Name", visible: true, sortable: true },
  { key: "location", label: "Location", visible: true, sortable: true },
  { key: "totalAUM", label: "Total AUM ($)", visible: true, sortable: true },
  { key: "advisors", label: "Advisors", visible: true, sortable: true },
  { key: "hnwAUMPercent", label: "HNW AUM (%)", visible: true, sortable: true },
  { key: "acquisitionScore", label: "Acquisition Score", visible: true, sortable: true },
  { key: "decisionMaker", label: "Decision Maker", visible: true, sortable: true },
];

function countActiveFilters(f: FirmFilters) {
  return [
    f.totalAUM, f.hnwClientAUM, f.acquisitionScore,
    f.custodian, f.ownerTenure, f.hnwClientGrowth, f.clientGrowth,
  ].reduce((acc, arr) => acc + arr.length, 0) +
    (f.outpacesMarketGrowth ? 1 : 0) +
    (f.familyOwned !== null ? 1 : 0);
}

export default function FirmsView({ onTabChange }: { onTabChange: (tab: "owners" | "firms" | "advisors") => void }) {
  const [filters, setFilters] = useState<FirmFilters>(DEFAULT_FILTERS);
  const [columns, setColumns] = useState<Column[]>(DEFAULT_COLUMNS);
  const [sort, setSort] = useState<SortState>({ column: "", direction: null });
  const [selectedRow, setSelectedRow] = useState<Firm | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [showSave, setShowSave] = useState(false);
  const [filterDrawer, setFilterDrawer] = useState(false);
  const [dragOverCol, setDragOverCol] = useState<string | null>(null);

  const handleSort = (col: string) => {
    setSort(prev => {
      if (prev.column !== col) return { column: col, direction: "asc" };
      if (prev.direction === "asc") return { column: col, direction: "desc" };
      return { column: "", direction: null };
    });
  };

  const handleColumnReorder = (sourceKey: string, targetKey: string) => {
    setColumns(prev => {
      const sourceIdx = prev.findIndex(c => c.key === sourceKey);
      const targetIdx = prev.findIndex(c => c.key === targetKey);
      if (sourceIdx < 0 || targetIdx < 0) return prev;
      const newCols = [...prev];
      const [dragged] = newCols.splice(sourceIdx, 1);
      newCols.splice(targetIdx, 0, dragged);
      return newCols;
    });
  };

  const filtered = useMemo(() => {
    let data = [...MOCK_FIRMS];
    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter(f => f.name.toLowerCase().includes(q) || f.location.toLowerCase().includes(q));
    }
    if (filters.totalAUM.length) {
      data = data.filter(f =>
        filters.totalAUM.some(range => {
          const [min, max] = range.split("-").map(Number);
          return f.totalAUM >= (min ?? 0) && f.totalAUM <= (max ?? 9999);
        })
      );
    }
    if (filters.acquisitionScore.length) {
      data = data.filter(f =>
        filters.acquisitionScore.some(range => {
          if (range === "70+") return f.acquisitionScore >= 70;
          if (range === "50-70") return f.acquisitionScore >= 50 && f.acquisitionScore < 70;
          if (range === "0-50") return f.acquisitionScore < 50;
          return true;
        })
      );
    }
    if (filters.custodian.length) {
      data = data.filter(f => f.custodian.some(c => filters.custodian.includes(c)));
    }
    return data;
  }, [filters, search]);

  const sortedData = useMemo(() => {
    if (!sort.column || !sort.direction) return filtered;
    return [...filtered].sort((a, b) => {
      const av = (a as any)[sort.column];
      const bv = (b as any)[sort.column];
      const mul = sort.direction === "asc" ? 1 : -1;
      if (typeof av === "number" && typeof bv === "number") return (av - bv) * mul;
      return String(av).localeCompare(String(bv)) * mul;
    });
  }, [filtered, sort]);

  const totalPages = Math.max(1, Math.ceil(sortedData.length / perPage));
  const paginated = sortedData.slice((page - 1) * perPage, page * perPage);
  const activeCount = countActiveFilters(filters);
  const resetPage = () => setPage(1);

  const getScoreColor = (s: number) =>
    s >= 70 ? "#16A34A" : s >= 50 ? "#D97706" : "#DC2626";

  const filterPanel = (
    <FirmFilterPanel
      filters={filters}
      onChange={f => { setFilters(f); resetPage(); }}
    />
  );

  return (
    <div style={{ display: "flex", height: "100%", overflow: "hidden" }}>

      {/* Desktop filter panel */}
      <div className="filter-panel-desktop" style={{ display: "flex", height: "100%", flexShrink: 0 }}>
        {filterPanel}
      </div>

      {/* Mobile filter drawer */}
      <FilterDrawer
        open={filterDrawer}
        onClose={() => setFilterDrawer(false)}
        activeCount={activeCount}
      >
        {filterPanel}
      </FilterDrawer>

      {/* Main content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>

        {/* Toolbar */}
        <div
          className="toolbar-wrap"
          style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "12px 16px", borderBottom: "1px solid var(--border)",
            background: "white", flexShrink: 0,
          }}
        >
          <h1 style={{ fontSize: 20, fontWeight: 600, color: "var(--text-1)" }}>
            Market Insights
          </h1>

          {/* Mobile filter trigger */}
          <button
            className="filter-bar-mobile"
            onClick={() => setFilterDrawer(true)}
            style={{
              alignItems: "center", gap: 6,
              padding: "6px 12px",
              border: activeCount > 0 ? "1px solid var(--brand)" : "1px solid var(--border)",
              borderRadius: 8,
              background: activeCount > 0 ? "var(--brand-light)" : "white",
              color: activeCount > 0 ? "var(--brand)" : "var(--text-2)",
              fontSize: 13, fontWeight: 500, cursor: "pointer",
              flexShrink: 0,
            }}
          >
            <SlidersHorizontal size={14} />
            Filters{activeCount > 0 ? ` (${activeCount})` : ""}
          </button>

          {/* <div style={{ flex: 1, maxWidth: 320 }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 7,
              background: "var(--surface-2)", border: "1px solid var(--border)",
              borderRadius: 8, padding: "6px 10px",
            }}>
              <Search size={13} color="var(--text-4)" />
              <input
                value={search}
                onChange={e => { setSearch(e.target.value); resetPage(); }}
                placeholder="Search by company name…"
                style={{
                  flex: 1, border: "none", background: "transparent",
                  fontSize: 13, color: "var(--text-1)", outline: "none",
                }}
              />
            </div>
          </div> */}

          {/* <button
            onClick={() => setShowSave(true)}
            style={{
              padding: "6px 14px", border: "none", background: "none",
              fontSize: 13, fontWeight: 500, color: "var(--brand)",
              cursor: "pointer", whiteSpace: "nowrap",
            }}
          >
            Save Search
          </button> */}

          <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
            <ColumnsPicker columns={columns} onChange={setColumns} />
            <ExportDropdown data={sortedData} columns={columns} filename="MarketInsights_Firms" title="Market Insights - Firms" />
          </div>
        </div>

        <div style={{ display: "flex", gap: 32, padding: "0 20px", borderBottom: "1px solid var(--border)", background: "white", flexShrink: 0 }}>
          <button onClick={() => onTabChange("owners")} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-3)", padding: "12px 0", fontSize: 14, fontWeight: 500, borderBottom: "2px solid transparent" }}>Owners</button>
          <button onClick={() => onTabChange("firms")} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-1)", padding: "12px 0", fontSize: 14, fontWeight: 500, borderBottom: "2px solid var(--brand)" }}>Firms</button>
          <button onClick={() => onTabChange("advisors")} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-3)", padding: "12px 0", fontSize: 14, fontWeight: 500, borderBottom: "2px solid transparent" }}>Advisers</button>
        </div>

        {/* Table */}
        <div style={{ flex: 1, overflow: "auto", background: "white" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr>
                {columns.filter(c => c.visible).map(col => (
                  <th
                    key={col.key}
                    draggable
                    // onDragStart={(e) => {
                    //   e.dataTransfer.setData("text/plain", col.key);
                    // }}
                    onDragStart={(e) => {
                      e.dataTransfer.setData("text/plain", col.key);

                      const table = e.currentTarget.closest("table");
                      if (!table) return;

                      const colIndex = Array.from(e.currentTarget.parentElement!.children)
                        .indexOf(e.currentTarget);

                      const dragPreview = document.createElement("div");
                      dragPreview.style.position = "absolute";
                      dragPreview.style.top = "-9999px";
                      dragPreview.style.background = "white";
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
                      if (source && source !== col.key) {
                        handleColumnReorder(source, col.key);
                      }
                    }}
                    style={{
                      padding: "10px 14px", textAlign: "left",
                      fontSize: 12, fontWeight: 500, color: "var(--text-3)",
                      borderBottom: "1px solid var(--border)",
                      borderRight: "1px solid var(--surface-3)",
                      background: dragOverCol === col.key ? "var(--surface-2)" : "white",
                      whiteSpace: "nowrap",
                      position: "sticky", top: 0, zIndex: 1,
                    }}
                  >
                    <div
                      style={{
                        display: "flex", alignItems: "center", gap: 5,
                        cursor: "pointer",
                        userSelect: "none",
                      }}
                      onClick={() => handleSort(col.key)}
                    >
                      {col.label}
                      {sort.column !== col.key ? <ArrowUpDown size={12} color="var(--text-4)" /> : (
                        sort.direction === "asc" ? <ChevronUp size={12} color="var(--brand)" /> : <ChevronDown size={12} color="var(--brand)" />
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.map(firm => (
                <tr
                  key={firm.id}
                  className="row-hover"
                  style={{ cursor: "pointer" }}
                  onClick={() => setSelectedRow(firm)}
                >
                  {columns.filter(c => c.visible).map(col => {
                    const td = {
                      padding: "10px 14px", fontSize: 13, color: "var(--text-2)",
                      borderBottom: "1px solid var(--surface-3)",
                      borderRight: "1px solid var(--surface-3)",
                      background: dragOverCol === col.key ? "var(--surface-2)" : undefined,
                      whiteSpace: "nowrap" as const
                    };
                    if (col.key === "name") return <td key="name" style={{ ...td, fontWeight: 500, color: "var(--text-1)", maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis" }}>{firm.name}</td>;
                    if (col.key === "location") return <td key="loc" style={{ ...td, maxWidth: 130, overflow: "hidden", textOverflow: "ellipsis" }}>{firm.location}</td>;
                    if (col.key === "totalAUM") return <td key="aum" style={td}>${firm.totalAUM.toFixed(2)}B</td>;
                    if (col.key === "advisors") return <td key="adv" style={td}>{firm.advisors}</td>;
                    if (col.key === "hnwAUMPercent") return <td key="hnw" style={td}>{firm.hnwAUMPercent}%</td>;
                    if (col.key === "acquisitionScore") return <td key="score" style={td}><span style={{ fontWeight: 700, color: getScoreColor(firm.acquisitionScore) }}>{firm.acquisitionScore}</span></td>;
                    if (col.key === "decisionMaker") return <td key="dm" style={td}>{firm.decisionMaker}</td>;
                    return <td key={col.key} style={td}>—</td>;
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <Pagination
          page={page}
          totalPages={totalPages}
          perPage={perPage}
          onPage={setPage}
          onPerPage={n => { setPerPage(n); resetPage(); }}
        />
      </div>

      {showSave && (
        <SaveSearchModal
          onClose={() => setShowSave(false)}
          onSave={name => console.log("Saved:", name)}
        />
      )}

      <DetailsPanel
        open={!!selectedRow}
        onClose={() => setSelectedRow(null)}
        title={selectedRow?.name || "Firm Details"}
        data={selectedRow}
      />
    </div>
  );
}
