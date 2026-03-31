"use client";
import { useState, useMemo } from "react";
import { SlidersHorizontal } from "lucide-react";
import OwnerFilterPanel from "@/components/filters/OwnerFilterPanel";
import FilterDrawer from "@/components/filters/FilterDrawer";
import OwnersTable from "@/components/table/OwnersTable";
import ColumnsPicker from "@/components/table/ColumnsPicker";
import ExportDropdown from "@/components/table/ExportDropdown";
import Pagination from "@/components/table/Pagination";
import DetailsPanel from "@/components/views/DetailsPanel";
import { MOCK_OWNERS } from "@/lib/data/owners";
import type { OwnerFilters, Column, Owner, SortState } from "@/types";

const DEFAULT_FILTERS: OwnerFilters = {
  ownershipRanges: [],
  roles: [],
  ageRanges: [],
  tenureRanges: [],
  locationZip: "",
  smartSearch: true,
};

const DEFAULT_COLUMNS: Column[] = [
  { key: "name",                label: "Name",          visible: true,  sortable: true  },
  { key: "firm",                label: "Firm",          visible: true,  sortable: true  },
  { key: "ownershipPercentage", label: "Ownership %",   visible: true,  sortable: true  },
  { key: "role",                label: "Role",          visible: true,  sortable: true  },
  { key: "tenure",              label: "Tenure",        visible: true,  sortable: true  },
  { key: "age",                 label: "Age",           visible: true,  sortable: true  },
  { key: "location",            label: "Location",      visible: true,  sortable: true  },
];

function applyFilters(owners: Owner[], f: OwnerFilters) {
  return owners.filter(o => {
    if (f.ownershipRanges.length) {
      const match = f.ownershipRanges.some(range => {
        if (range === "100%") return o.ownershipPercentage === 100;
        if (range === "51-99%") return o.ownershipPercentage >= 51 && o.ownershipPercentage <= 99;
        if (range === "21-50%") return o.ownershipPercentage >= 21 && o.ownershipPercentage <= 50;
        if (range === "0-20%") return o.ownershipPercentage <= 20;
        return true;
      });
      if (!match) return false;
    }
    if (f.roles.length && !f.roles.includes(o.role)) return false;
    if (f.ageRanges.length) {
      const match = f.ageRanges.some(r => {
        if (r === "70+") return o.age >= 70;
        if (r === "Under 40") return o.age < 40;
        const [lo, hi] = r.split("-").map(Number);
        return o.age >= (lo ?? 0) && o.age <= (hi ?? 999);
      });
      if (!match) return false;
    }
    if (f.tenureRanges.length) {
      const match = f.tenureRanges.some(r => {
        if (r === "20+ years") return o.tenure >= 20;
        if (r === "0-5 years") return o.tenure <= 5;
        if (r === "6-10 years") return o.tenure >= 6 && o.tenure <= 10;
        if (r === "11-20 years") return o.tenure >= 11 && o.tenure <= 20;
        return true;
      });
      if (!match) return false;
    }
    return true;
  });
}

function countActiveFilters(f: OwnerFilters) {
  return [
    f.ownershipRanges, f.roles, f.ageRanges, f.tenureRanges
  ].reduce((acc, arr) => acc + arr.length, 0) + (f.locationZip ? 1 : 0);
}

export default function OwnersView({ onTabChange, title = "Market Insights" }: { onTabChange: (tab: "owners" | "firms" | "advisors") => void, title?: string }) {
  const [filters, setFilters]       = useState<OwnerFilters>(DEFAULT_FILTERS);
  const [columns, setColumns]       = useState<Column[]>(DEFAULT_COLUMNS);
  const [sort, setSort]             = useState<SortState>({ column: "", direction: null });
  const [selectedRow, setSelectedRow] = useState<Owner | null>(null);
  const [page, setPage]             = useState(1);
  const [perPage, setPerPage]       = useState(10);
  const [filterDrawer, setFilterDrawer] = useState(false);

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
    return applyFilters(MOCK_OWNERS, filters);
  }, [filters]);

  const sortedData = useMemo(() => {
    if (!sort.column || !sort.direction) return filtered;
    return [...filtered].sort((a, b) => {
      const av = a[sort.column as keyof Owner];
      const bv = b[sort.column as keyof Owner];
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
    <OwnerFilterPanel
      filters={filters}
      onChange={f => { setFilters(f); resetPage(); }}
      totalCount={filtered.length}
    />
  );

  return (
    <div style={{ display: "flex", height: "100%", overflow: "hidden" }}>

      <div className="filter-panel-desktop" style={{ display: "flex", height: "100%", flexShrink: 0 }}>
        {filterPanel}
      </div>

      <FilterDrawer
        open={filterDrawer}
        onClose={() => setFilterDrawer(false)}
        activeCount={activeCount}
      >
        {filterPanel}
      </FilterDrawer>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>

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

          <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
            <ColumnsPicker columns={columns} onChange={setColumns} />
            <ExportDropdown data={sortedData} columns={columns} filename="MarketInsights_Owners" title="Market Insights - Owners" />
          </div>
        </div>

        <div style={{ display: "flex", gap: 32, padding: "0 20px", borderBottom: "1px solid var(--border)", background: "white", flexShrink: 0 }}>
          <button onClick={() => onTabChange("owners")} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-1)", padding: "12px 0", fontSize: 14, fontWeight: 500, borderBottom: "2px solid var(--brand)" }}>Owners</button>
          <button onClick={() => onTabChange("firms")} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-3)", padding: "12px 0", fontSize: 14, fontWeight: 500, borderBottom: "2px solid transparent" }}>Firms</button>
          <button onClick={() => onTabChange("advisors")} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-3)", padding: "12px 0", fontSize: 14, fontWeight: 500, borderBottom: "2px solid transparent" }}>Advisers</button>
        </div>

        <div style={{ flex: 1, overflow: "auto", background: "white" }}>
          <OwnersTable owners={paginated} columns={columns} onColumnReorder={handleColumnReorder} sort={sort} onSort={handleSort} onRowClick={setSelectedRow} />
        </div>

        <Pagination
          page={page}
          totalPages={totalPages}
          perPage={perPage}
          onPage={setPage}
          onPerPage={n => { setPerPage(n); resetPage(); }}
        />
      </div>

      <DetailsPanel
        open={!!selectedRow}
        onClose={() => setSelectedRow(null)}
        title={selectedRow?.name || "Owner Details"}
        data={selectedRow}
      />
    </div>
  );
}
