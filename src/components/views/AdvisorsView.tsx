"use client";
import { useState, useMemo } from "react";
import { Search, SlidersHorizontal, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import AdvisorFilterPanel from "@/components/filters/AdvisorFilterPanel";
import FilterDrawer from "@/components/filters/FilterDrawer";
import AdvisorsTable from "@/components/table/AdvisorsTable";
import ColumnsPicker from "@/components/table/ColumnsPicker";
import ExportDropdown from "@/components/table/ExportDropdown";
import Pagination from "@/components/table/Pagination";
import DetailsPanel from "@/components/views/DetailsPanel";
import SaveSearchModal from "@/components/filters/SaveSearchModal";
import { MOCK_ADVISORS } from "@/lib/data/advisors";
import { useTranslation } from "@/lib/i18n/LanguageContext";
import type { AdvisorFilters, Column, SortState, Advisor } from "@/types";

const DEFAULT_FILTERS: AdvisorFilters = {
  yearsOfExperience: [], yearsAtCurrentFirm: [],
  jobTitles: [], excludeJobTitles: [], currentFirms: [],
  firmAUM: [], locationZip: "", locationRadius: "",
  locationMode: "zip", statesRegistered: [], statesMode: "is_any_of",
  compliance: [], ageRanges: [], lifeEvents: [], almaMater: [],
  smartSearch: true,
};

const DEFAULT_COLUMNS: Column[] = [
  { key: "name",              label: "Name",                  visible: true,  sortable: true },
  { key: "crd",               label: "CRD",                   visible: true,  sortable: true },
  { key: "location",          label: "Location",              visible: true,  sortable: true },
  { key: "firm",              label: "Firm",                  visible: true,  sortable: true },
  { key: "yearsOfExperience", label: "Years of Ex...",        visible: true,  sortable: true },
  { key: "age",               label: "Age",                   visible: true,  sortable: true },
  { key: "compliance",        label: "Compliance Violations", visible: true,  sortable: true },
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
  const { t } = useTranslation();
  const [filters, setFilters]       = useState<AdvisorFilters>(DEFAULT_FILTERS);
  const [columns, setColumns]       = useState<Column[]>(DEFAULT_COLUMNS);
  const [sort, setSort]             = useState<SortState>({ column: "", direction: null });
  const [selectedRow, setSelectedRow] = useState<Advisor | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(true);
  const [search, setSearch]         = useState("");
  const [page, setPage]             = useState(1);
  const [perPage, setPerPage]       = useState(10);
  const [showSave, setShowSave]     = useState(false);
  const [filterDrawer, setFilterDrawer] = useState(false);
  const [savedFilters, setSavedFilters] = useState<{name: string, filters: AdvisorFilters}[]>([]);

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

  const totalPages  = Math.max(1, Math.ceil(sortedData.length / perPage));
  const paginated   = sortedData.slice((page - 1) * perPage, page * perPage);
  const activeCount = countActiveFilters(filters);
  const resetPage   = () => setPage(1);

  const filterPanel = (
    <AdvisorFilterPanel
      filters={filters}
      onChange={f => { setFilters(f); resetPage(); }}
      totalCount={filtered.length}
      searchQuery={search}
      onSearchChange={setSearch}
      savedFilters={savedFilters}
      onApplyFilter={(f: AdvisorFilters) => { setFilters(f); resetPage(); }}
      onSaveRequest={() => setShowSave(true)}
      onClearAll={() => { setFilters(DEFAULT_FILTERS); setSearch(""); resetPage(); }}
    />
  );

  return (
    <div style={{ display: "flex", height: "100%", overflow: "hidden", position: "relative" }}>

      <button
        className="filter-panel-desktop"
        onClick={() => setIsFilterOpen(!isFilterOpen)}
        style={{
          position: "absolute",
          top: 18,
          left: isFilterOpen ? 266 : -14,
          zIndex: 200,
          width: 28, height: 28,
          borderRadius: "50%",
          background: "var(--surface)",
          border: "1px solid var(--border)",
          cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          transition: "left 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          transform: isFilterOpen ? "translateX(0)" : "translateX(28px)",
        }}
      >
        {isFilterOpen ? <ChevronLeft size={16} color="var(--text-3)" /> : <ChevronRight size={16} color="var(--text-3)" />}
      </button>

      <div
        className="filter-panel-desktop"
        style={{
          display: "flex", height: "100%", flexShrink: 0,
          width: isFilterOpen ? 280 : 0,
          transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          overflow: "hidden",
          borderRight: isFilterOpen ? "1px solid var(--border)" : "none",
        }}
      >
        <div style={{ width: 280, flexShrink: 0 }}>
          {filterPanel}
        </div>
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
          background: "var(--surface)", flexShrink: 0,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {!isFilterOpen && (
              <button
                className="filter-panel-desktop"
                onClick={() => setIsFilterOpen(true)}
                style={{
                  background: "transparent", border: "none", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "var(--text-2)", padding: 4, borderRadius: 6,
                }}
                onMouseEnter={e => (e.currentTarget.style.background = "var(--surface-2)")}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                title="Open Filters"
              >
                <SlidersHorizontal size={18} />
              </button>
            )}
            <h1 style={{ fontSize: 20, fontWeight: 600, color: "var(--text-1)" }}>
              {title === "Advisors" ? t("nav.advisors") : title === "Market Insights" ? t("nav.marketInsights") : title}
            </h1>
          </div>

          {/* Mobile filter trigger */}
          <button
            className="filter-bar-mobile"
            onClick={() => setFilterDrawer(true)}
            style={{
              alignItems: "center", gap: 6,
              padding: "6px 12px",
              border: activeCount > 0 ? "1px solid var(--brand)" : "1px solid var(--border)",
              borderRadius: 8,
              background: activeCount > 0 ? "var(--brand-light)" : "var(--surface)",
              color: activeCount > 0 ? "var(--brand)" : "var(--text-2)",
              fontSize: 13, fontWeight: 500, cursor: "pointer",
              flexShrink: 0,
            }}
          >
            <SlidersHorizontal size={14} />
            {t("common.filters")}{activeCount > 0 ? ` (${activeCount})` : ""}
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
            <ExportDropdown data={sortedData} columns={columns} filename="MarketInsights_Advisors" title={`${t("nav.marketInsights")} - ${t("nav.advisors")}`} />
          </div>
        </div>

        <div style={{ display: "flex", gap: 32, padding: "0 20px", borderBottom: "1px solid var(--border)", background: "var(--surface)", flexShrink: 0 }}>
          <button onClick={() => onTabChange("owners")} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-3)", padding: "12px 0", fontSize: 14, fontWeight: 500, borderBottom: "2px solid transparent" }}>{t("nav.owners")}</button>
          <button onClick={() => onTabChange("firms")} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-3)", padding: "12px 0", fontSize: 14, fontWeight: 500, borderBottom: "2px solid transparent" }}>{t("nav.firms")}</button>
          <button onClick={() => onTabChange("advisors")} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-1)", padding: "12px 0", fontSize: 14, fontWeight: 500, borderBottom: "2px solid var(--brand)" }}>{t("nav.advisors")}</button>
        </div>

        {/* Table */}
        <div style={{ flex: 1, overflow: "auto", background: "var(--surface)" }}>
          <AdvisorsTable 
            advisors={paginated} 
            columns={columns.map(c => ({...c, label: t(`columns.${c.key}`) !== `columns.${c.key}` ? t(`columns.${c.key}`) : c.label}))} 
            onColumnReorder={handleColumnReorder} 
            sort={sort} 
            onSort={handleSort} 
            onRowClick={setSelectedRow} 
          />
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
          onSave={name => {
            setSavedFilters(prev => [...prev, { name, filters }]);
            setShowSave(false);
          }}
        />
      )}

      <DetailsPanel
        open={!!selectedRow}
        onClose={() => setSelectedRow(null)}
        title={selectedRow?.name || t("common.advisorDetails")}
        data={selectedRow}
      />
    </div>
  );
}
