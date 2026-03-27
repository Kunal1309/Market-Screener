"use client";
import { useState, useMemo } from "react";
import { Search, Download, SlidersHorizontal } from "lucide-react";
import FirmFilterPanel from "@/components/filters/FirmFilterPanel";
import FilterDrawer from "@/components/filters/FilterDrawer";
import ColumnsPicker from "@/components/table/ColumnsPicker";
import Pagination from "@/components/table/Pagination";
import SaveSearchModal from "@/components/filters/SaveSearchModal";
import { MOCK_FIRMS } from "@/lib/data/firms";
import type { FirmFilters, Column } from "@/types";

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
  { key: "name",             label: "Firm Name",          visible: true,  sortable: false },
  { key: "location",         label: "Location",           visible: true,  sortable: false },
  { key: "totalAUM",         label: "Total AUM ($)",      visible: true,  sortable: true  },
  { key: "advisors",         label: "Advisors",           visible: true,  sortable: true  },
  { key: "hnwAUMPercent",    label: "HNW AUM (%)",        visible: true,  sortable: true  },
  { key: "acquisitionScore", label: "Acquisition Score",  visible: true,  sortable: true  },
  { key: "decisionMaker",    label: "Decision Maker",     visible: true,  sortable: false },
];

function countActiveFilters(f: FirmFilters) {
  return [
    f.totalAUM, f.hnwClientAUM, f.acquisitionScore,
    f.custodian, f.ownerTenure, f.hnwClientGrowth, f.clientGrowth,
  ].reduce((acc, arr) => acc + arr.length, 0) +
    (f.outpacesMarketGrowth ? 1 : 0) +
    (f.familyOwned !== null ? 1 : 0);
}

export default function MarketInsightsPage() {
  const [filters, setFilters]       = useState<FirmFilters>(DEFAULT_FILTERS);
  const [columns, setColumns]       = useState<Column[]>(DEFAULT_COLUMNS);
  const [search, setSearch]         = useState("");
  const [page, setPage]             = useState(1);
  const [perPage, setPerPage]       = useState(10);
  const [showSave, setShowSave]     = useState(false);
  const [filterDrawer, setFilterDrawer] = useState(false);

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
          if (range === "70+")  return f.acquisitionScore >= 70;
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

  const totalPages  = Math.max(1, Math.ceil(filtered.length / perPage));
  const paginated   = filtered.slice((page - 1) * perPage, page * perPage);
  const activeCount = countActiveFilters(filters);
  const resetPage   = () => setPage(1);

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

          <div style={{ flex: 1, maxWidth: 320 }}>
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
          </div>

          <button
            onClick={() => setShowSave(true)}
            style={{
              padding: "6px 14px", border: "none", background: "none",
              fontSize: 13, fontWeight: 500, color: "var(--brand)",
              cursor: "pointer", whiteSpace: "nowrap",
            }}
          >
            Save Search
          </button>

          <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
            <ColumnsPicker columns={columns} onChange={setColumns} />
            <button style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "6px 12px", border: "1px solid var(--border)",
              borderRadius: 8, background: "white", cursor: "pointer",
              fontSize: 13, color: "var(--text-2)",
            }}>
              <Download size={14} />
              <span className="col-hide-mobile">Export</span>
            </button>
          </div>
        </div>

        {/* Table */}
        <div style={{ flex: 1, overflow: "auto", background: "white" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr>
                {columns.filter(c => c.visible).map(col => (
                  <th key={col.key} style={{
                    padding: "10px 14px", textAlign: "left",
                    fontSize: 12, fontWeight: 500, color: "var(--text-3)",
                    borderBottom: "1px solid var(--border)",
                    background: "white", whiteSpace: "nowrap",
                    position: "sticky", top: 0, zIndex: 1,
                  }}>
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.map(firm => (
                <tr key={firm.id} className="row-hover">
                  {columns.filter(c => c.visible).map(col => {
                    const td = { padding: "10px 14px", fontSize: 13, color: "var(--text-2)", borderBottom: "1px solid var(--surface-3)", whiteSpace: "nowrap" as const };
                    if (col.key === "name")             return <td key="name"  style={{ ...td, fontWeight: 500, color: "var(--text-1)", maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis" }}>{firm.name}</td>;
                    if (col.key === "location")         return <td key="loc"   style={{ ...td, maxWidth: 130, overflow: "hidden", textOverflow: "ellipsis" }}>{firm.location}</td>;
                    if (col.key === "totalAUM")         return <td key="aum"   style={td}>${firm.totalAUM.toFixed(2)}B</td>;
                    if (col.key === "advisors")         return <td key="adv"   style={td}>{firm.advisors}</td>;
                    if (col.key === "hnwAUMPercent")    return <td key="hnw"   style={td}>{firm.hnwAUMPercent}%</td>;
                    if (col.key === "acquisitionScore") return <td key="score" style={td}><span style={{ fontWeight: 700, color: getScoreColor(firm.acquisitionScore) }}>{firm.acquisitionScore}</span></td>;
                    if (col.key === "decisionMaker")    return <td key="dm"    style={td}>{firm.decisionMaker}</td>;
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
    </div>
  );
}
