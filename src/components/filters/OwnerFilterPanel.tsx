"use client";
import { useState } from "react";
import { Search, X } from "lucide-react";
import FilterAccordion from "./FilterAccordion";
import CheckboxGroup from "./CheckboxGroup";
import DropdownMulti from "./DropdownMulti";
import SavedSearches from "./SavedSearches";
import { OWNER_FILTER_OPTIONS } from "@/lib/data/owners";
import { useTranslation } from "@/lib/i18n/LanguageContext";
import type { OwnerFilters } from "@/types";

interface Props {
  filters: OwnerFilters;
  onChange: (f: OwnerFilters) => void;
  totalCount: number;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  savedFilters: { name: string; filters: any }[];
  onApplyFilter: (filters: any) => void;
  onSaveRequest: () => void;
  onClearAll?: () => void;
}

export default function OwnerFilterPanel({ filters, onChange, totalCount, searchQuery, onSearchChange, savedFilters, onApplyFilter, onSaveRequest, onClearAll }: Props) {
  const { t } = useTranslation();
  const [paramSearch, setParamSearch] = useState("");

  const set = <K extends keyof OwnerFilters>(key: K, val: OwnerFilters[K]) =>
    onChange({ ...filters, [key]: val });

  const activeCount = [
    filters.ownershipRanges,
    filters.roles,
    filters.ageRanges,
    filters.tenureRanges,
  ].reduce((acc, arr) => acc + arr.length, 0) +
    (filters.locationZip ? 1 : 0);

  return (
    <aside style={{
      width: 280, flexShrink: 0,
      background: "var(--surface)",
      borderRight: "1px solid var(--border)",
      display: "flex", flexDirection: "column",
      overflowY: "auto", height: "100%",
    }}>
      {/* Header */}
      <div style={{
        padding: "12px 16px",
        borderBottom: "1px solid var(--border)",
        display: "flex", alignItems: "center",
        justifyContent: "space-between", gap: 8, flexShrink: 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: "var(--text-1)" }}>{t("common.filters")}</span>
          {activeCount > 0 && (
            <span style={{
              background: "var(--text-1)", color: "var(--surface)",
              fontSize: 11, fontWeight: 600,
              padding: "1px 7px", borderRadius: 10,
            }}>{activeCount}</span>
          )}
        </div>
        <SavedSearches savedFilters={savedFilters} onApply={onApplyFilter} onSaveRequest={onSaveRequest} />
      </div>

      {/* Global Search */}
      <div style={{ padding: "10px 16px", borderBottom: "1px solid var(--surface-3)", flexShrink: 0 }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 7,
          background: "var(--surface)", border: "1px solid var(--border)",
          borderRadius: 8, padding: "6px 10px", marginBottom: 10
        }}>
          <Search size={14} color="var(--text-3)" />
          <input
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
            placeholder={t("common.searchData")}
            style={{
              flex: 1, border: "none", background: "transparent",
              fontSize: 13, color: "var(--text-1)", outline: "none",
            }}
          />
          {searchQuery && (
            <button onClick={() => onSearchChange("")}
              style={{ background: "none", border: "none", cursor: "pointer", display: "flex", padding: 0 }}>
              <X size={14} color="var(--text-3)" />
            </button>
          )}
        </div>

      {/* Search by param */}
        <div style={{
          display: "flex", alignItems: "center", gap: 7,
          background: "var(--surface-2)", border: "1px solid var(--border)",
          borderRadius: 8, padding: "6px 10px",
        }}>
          <Search size={13} color="var(--text-4)" />
          <input
            value={paramSearch}
            onChange={e => setParamSearch(e.target.value)}
            placeholder={t("common.searchByParam")}
            style={{
              flex: 1, border: "none", background: "transparent",
              fontSize: 12, color: "var(--text-1)", outline: "none",
            }}
          />
          {paramSearch && (
            <button onClick={() => setParamSearch("")}
              style={{ background: "none", border: "none", cursor: "pointer", display: "flex", padding: 0 }}>
              <X size={12} color="var(--text-4)" />
            </button>
          )}
        </div>
      </div>

      {activeCount > 0 && onClearAll && (
        <div style={{ padding: "12px 16px 0", flexShrink: 0 }}>
          <button
            onClick={onClearAll}
            style={{
              width: "100%", padding: "7px 0",
              background: "var(--surface)", border: "1px solid var(--border)",
              color: "var(--text-1)", borderRadius: 6,
              fontSize: 12, fontWeight: 500, cursor: "pointer",
              transition: "0.1s"
            }}
            onMouseEnter={e => (e.currentTarget.style.background = "var(--surface-2)")}
            onMouseLeave={e => (e.currentTarget.style.background = "var(--surface)")}
          >
            {t("common.clearAll")}
          </button>
        </div>
      )}

      {/* Shortcuts */}
      <div style={{ padding: "10px 16px 4px", flexShrink: 0 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-3)", marginBottom: 8 }}>{t("common.shortcuts")}</div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 13, color: "var(--text-2)" }}>{t("common.smartSearch")}</span>
          <label className="toggle-track">
            <input
              type="checkbox"
              checked={filters.smartSearch}
              onChange={e => set("smartSearch", e.target.checked)}
            />
            <span className="toggle-thumb" />
          </label>
        </div>
      </div>

      <div style={{ padding: "8px 16px 4px", flexShrink: 0 }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text-3)" }}>
          {t("common.ownerDetails")}
        </span>
      </div>

      <div style={{ overflowY: "auto", flex: 1 }}>
        <FilterAccordion title={t("filters.ownershipPercent")} count={filters.ownershipRanges.length} defaultOpen>
          <CheckboxGroup
            options={OWNER_FILTER_OPTIONS.ownershipRanges}
            selected={filters.ownershipRanges}
            onChange={v => set("ownershipRanges", v)}
            preset showClear
          />
        </FilterAccordion>

        <FilterAccordion title={t("filters.role")} count={filters.roles.length}>
          <DropdownMulti
            placeholder="Select Roles"
            options={OWNER_FILTER_OPTIONS.roles}
            selected={filters.roles}
            onChange={v => set("roles", v)}
            searchable
          />
        </FilterAccordion>

        <FilterAccordion title={t("filters.age")} count={filters.ageRanges.length}>
          <CheckboxGroup
            options={OWNER_FILTER_OPTIONS.ageRanges}
            selected={filters.ageRanges}
            onChange={v => set("ageRanges", v)}
            showClear
          />
        </FilterAccordion>

        <FilterAccordion title={t("filters.tenure")} count={filters.tenureRanges.length}>
          <CheckboxGroup
            options={OWNER_FILTER_OPTIONS.tenureRanges}
            selected={filters.tenureRanges}
            onChange={v => set("tenureRanges", v)}
            showClear
          />
        </FilterAccordion>

        <FilterAccordion title={t("filters.location")} count={filters.locationZip ? 1 : 0}>
          <div style={{ marginBottom: 8 }}>
            <input
              value={filters.locationZip}
              onChange={e => set("locationZip", e.target.value)}
              placeholder="Enter ZIP code"
              style={{
                width: "100%", padding: "7px 10px",
                border: "1px solid var(--border)", borderRadius: 8,
                fontSize: 13, outline: "none",
              }}
            />
          </div>
        </FilterAccordion>

      </div>
    </aside>
  );
}
