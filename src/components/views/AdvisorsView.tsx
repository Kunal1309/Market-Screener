"use client";
import { useState, useMemo } from "react";
import { Search, Download, SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import AdvisorFilterPanel from "@/components/filters/AdvisorFilterPanel";
import FilterDrawer from "@/components/filters/FilterDrawer";
import AdvisorsTable from "@/components/table/AdvisorsTable";
import ColumnsPicker from "@/components/table/ColumnsPicker";
import Pagination from "@/components/table/Pagination";
import SaveSearchModal from "@/components/filters/SaveSearchModal";
import { MOCK_ADVISORS } from "@/lib/data/advisors";
import type { AdvisorFilters, Column } from "@/types";

const DEFAULT_FILTERS: AdvisorFilters = {
  yearsOfExperience: [], yearsAtCurrentFirm: [],
  jobTitles: [], excludeJobTitles: [], currentFirms: [],
  firmAUM: [], locationZip: "", locationRadius: "",
  locationMode: "zip", statesRegistered: [], statesMode: "is_any_of",
  compliance: [], ageRanges: [], lifeEvents: [], almaMater: [],
  smartSearch: true,
};

const DEFAULT_COLUMNS: Column[] = [
  { key: "name",              label: "Name",                  visible: true,  sortable: false },
  { key: "crd",               label: "CRD",                   visible: true,  sortable: false },
  { key: "location",          label: "Location",              visible: true,  sortable: false },
  { key: "firm",              label: "Firm",                  visible: true,  sortable: false },
  { key: "yearsOfExperience", label: "Years of Ex...",        visible: true,  sortable: true  },
  { key: "age",               label: "Age",                   visible: true,  sortable: true  },
  { key: "compliance",        label: "Compliance Violations", visible: true,  sortable: false },
];

function applyFilters(advisors: typeof MOCK_ADVISORS, f: AdvisorFilters) {
  return advisors.filter(a => {
    if (f.yearsOfExperience.length) {
      const match = f.yearsOfExperience.some(range => {
        if (range === "15+") return a.yearsOfExperience >= 15;
        const [min, max] = range.split("-").map(Number);
        return a.yearsOfExperience >= (min ?? 0) && a.yearsOfExperience <= (max ?? 999);
      });
      if (!match) return false;
    }
    if (f.compliance.length && !f.compliance.includes(a.compliance)) return false;
    if (f.jobTitles.length && !f.jobTitles.includes(a.jobTitle)) return false;
    if (f.currentFirms.length && !f.currentFirms.includes(a.firm)) return false;
    if (f.statesRegistered.length) {
      const overlap = a.statesRegistered.some(s => f.statesRegistered.includes(s));
      if (!overlap) return false;
    }
    if (f.ageRanges.length) {
      const match = f.ageRanges.some(r => {
        if (r === "60+") return a.age >= 60;
        const [lo, hi] = r.split("-").map(Number);
        return a.age >= (lo ?? 0) && a.age <= (hi ?? 999);
      });
      if (!match) return false;
    }
    if (f.lifeEvents.length) {
      const overlap = a.lifeEvents.some(e => f.lifeEvents.includes(e));
      if (!overlap) return false;
    }
    return true;
  });
}

function countActiveFilters(f: AdvisorFilters) {
  return [
    f.yearsOfExperience, f.yearsAtCurrentFirm, f.jobTitles,
    f.currentFirms, f.firmAUM, f.statesRegistered,
    f.compliance, f.ageRanges, f.lifeEvents, f.almaMater,
  ].reduce((acc, arr) => acc + arr.length, 0) + (f.locationZip ? 1 : 0);
}

export default function AdvisorsView({ onTabChange, title = "Advisors" }: { onTabChange: (tab: "owners" | "firms" | "advisors") => void, title?: string }) {
  const [filters, setFilters]       = useState<AdvisorFilters>(DEFAULT_FILTERS);
  const [columns, setColumns]       = useState<Column[]>(DEFAULT_COLUMNS);
  const [search, setSearch]         = useState("");
  const [page, setPage]             = useState(1);
  const [perPage, setPerPage]       = useState(10);
  const [showSave, setShowSave]     = useState(false);
  const [filterDrawer, setFilterDrawer] = useState(false);

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
    let data = applyFilters(MOCK_ADVISORS, filters);
    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter(a =>
        a.name.toLowerCase().includes(q) ||
        a.firm.toLowerCase().includes(q) ||
        a.crd.includes(q)
      );
    }
    return data;
  }, [filters, search]);

  const totalPages  = Math.max(1, Math.ceil(filtered.length / perPage));
  const paginated   = filtered.slice((page - 1) * perPage, page * perPage);
  const activeCount = countActiveFilters(filters);
  const resetPage   = () => setPage(1);

  const filterPanel = (
    <AdvisorFilterPanel
      filters={filters}
      onChange={f => { setFilters(f); resetPage(); }}
      totalCount={filtered.length}
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
            {title}
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
                placeholder="Search by name…"
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

        <div style={{ display: "flex", gap: 32, padding: "0 20px", borderBottom: "1px solid var(--border)", background: "white", flexShrink: 0 }}>
          <button onClick={() => onTabChange("owners")} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-3)", padding: "12px 0", fontSize: 14, fontWeight: 500, borderBottom: "2px solid transparent" }}>Owners</button>
          <button onClick={() => onTabChange("firms")} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-3)", padding: "12px 0", fontSize: 14, fontWeight: 500, borderBottom: "2px solid transparent" }}>Firms</button>
          <button onClick={() => onTabChange("advisors")} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-1)", padding: "12px 0", fontSize: 14, fontWeight: 500, borderBottom: "2px solid var(--brand)" }}>Advisers</button>
        </div>

        {/* Table */}
        <div style={{ flex: 1, overflow: "auto", background: "white" }}>
          <AdvisorsTable advisors={paginated} columns={columns} onColumnReorder={handleColumnReorder} />
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
