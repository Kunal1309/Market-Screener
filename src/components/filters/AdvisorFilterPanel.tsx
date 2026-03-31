"use client";
import { useState } from "react";
import { Search, X } from "lucide-react";
import FilterAccordion from "./FilterAccordion";
import CheckboxGroup from "./CheckboxGroup";
import DropdownMulti from "./DropdownMulti";
import SavedSearches from "./SavedSearches";
import { ADVISOR_FILTER_OPTIONS } from "@/lib/data/advisors";
import { useTranslation } from "@/lib/i18n/LanguageContext";
import type { AdvisorFilters } from "@/types";

const DEFAULT_FILTERS: AdvisorFilters = {
  yearsOfExperience: [],
  yearsAtCurrentFirm: [],
  jobTitles: [],
  excludeJobTitles: [],
  currentFirms: [],
  firmAUM: [],
  locationZip: "",
  locationRadius: "",
  locationMode: "zip",
  statesRegistered: [],
  statesMode: "is_any_of",
  compliance: [],
  ageRanges: [],
  lifeEvents: [],
  almaMater: [],
  smartSearch: true,
};

interface Props {
  filters: AdvisorFilters;
  onChange: (f: AdvisorFilters) => void;
  totalCount: number;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  savedFilters: { name: string; filters: any }[];
  onApplyFilter: (filters: any) => void;
  onSaveRequest: () => void;
  onClearAll?: () => void;
}

export default function AdvisorFilterPanel({ filters, onChange, totalCount, searchQuery, onSearchChange, savedFilters, onApplyFilter, onSaveRequest, onClearAll }: Props) {
  const { t } = useTranslation();
  const [paramSearch, setParamSearch] = useState("");

  const set = <K extends keyof AdvisorFilters>(key: K, val: AdvisorFilters[K]) =>
    onChange({ ...filters, [key]: val });

  const activeCount = [
    filters.yearsOfExperience,
    filters.yearsAtCurrentFirm,
    filters.jobTitles,
    filters.currentFirms,
    filters.firmAUM,
    filters.statesRegistered,
    filters.compliance,
    filters.ageRanges,
    filters.lifeEvents,
    filters.almaMater,
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

      {/* Popular Filters label */}
      <div style={{ padding: "8px 16px 4px", flexShrink: 0 }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text-3)" }}>
          {t("common.popularFilters")}{" "}
          <span style={{
            background: "var(--surface-3)", color: "var(--text-3)",
            fontSize: 11, padding: "1px 5px", borderRadius: 8,
          }}>9</span>
        </span>
      </div>

      {/* Scrollable filter list */}
      <div style={{ overflowY: "auto", flex: 1 }}>

        <FilterAccordion title={t("filters.yearsOfExperience")} count={filters.yearsOfExperience.length} defaultOpen>
          <CheckboxGroup
            options={ADVISOR_FILTER_OPTIONS.yearsOfExperience}
            selected={filters.yearsOfExperience}
            onChange={v => set("yearsOfExperience", v)}
            preset showClear
          />
        </FilterAccordion>

        <FilterAccordion title={t("filters.yearsAtCurrentFirm")} count={filters.yearsAtCurrentFirm.length}>
          <CheckboxGroup
            options={ADVISOR_FILTER_OPTIONS.yearsAtCurrentFirm}
            selected={filters.yearsAtCurrentFirm}
            onChange={v => set("yearsAtCurrentFirm", v)}
            preset showClear
          />
        </FilterAccordion>

        <FilterAccordion title={t("filters.jobTitle")} count={filters.jobTitles.length}>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 500, color: "var(--text-2)", marginBottom: 6 }}>{t("filters.isAnyOf")}</div>
              <DropdownMulti
                placeholder="Enter Job title"
                options={ADVISOR_FILTER_OPTIONS.jobTitles}
                selected={filters.jobTitles}
                onChange={v => set("jobTitles", v)}
                searchable
              />
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 500, color: "var(--text-2)", marginBottom: 6 }}>{t("filters.isNotAnyOf")}</div>
              <DropdownMulti
                placeholder="Enter Job title to exclude"
                options={ADVISOR_FILTER_OPTIONS.jobTitles}
                selected={filters.excludeJobTitles}
                onChange={v => set("excludeJobTitles", v)}
                searchable
              />
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 500, color: "var(--text-2)", marginBottom: 6 }}>{t("filters.includePastTitles")}</div>
              <DropdownMulti
                placeholder="Enter past Job title"
                options={ADVISOR_FILTER_OPTIONS.jobTitles}
                selected={[]}
                onChange={() => {}}
                searchable
              />
            </div>
          </div>
        </FilterAccordion>

        <FilterAccordion title={t("filters.location")} count={filters.locationZip ? 1 : 0}>
          <div>
            <div style={{ display: "flex", borderBottom: "1px solid var(--border)", marginBottom: 12 }}>
              {(["zip", "drive"] as const).map(m => (
                <button
                  key={m}
                  onClick={() => set("locationMode", m)}
                  style={{
                    flex: 1, padding: "6px 0", fontSize: 13,
                    background: "none", border: "none", cursor: "pointer",
                    borderBottom: filters.locationMode === m
                      ? "2px solid var(--brand)" : "2px solid transparent",
                    color: filters.locationMode === m ? "var(--brand)" : "var(--text-3)",
                    fontWeight: filters.locationMode === m ? 500 : 400,
                    transition: "all 0.12s",
                  }}
                >
                  {m === "zip" ? t("filters.zipRadius") : t("filters.driveTime")}
                </button>
              ))}
            </div>
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
            <div style={{ fontSize: 12, fontWeight: 500, color: "var(--text-2)", marginBottom: 6 }}>
              {filters.locationMode === "zip" ? t("filters.milesAroundZip") : t("filters.driveTime")}
            </div>
            <DropdownMulti
              placeholder="Select radius"
              options={filters.locationMode === "zip"
                ? ["10 miles","25 miles","50 miles","100 miles"]
                : ["1 hour","2 hours","3 hours","4 hours","5 hours"]
              }
              selected={filters.locationRadius ? [filters.locationRadius] : []}
              onChange={v => set("locationRadius", v[v.length - 1] ?? "")}
            />
          </div>
        </FilterAccordion>

        <div style={{ padding: "8px 16px 4px" }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text-3)" }}>
            {t("common.firmDetails")}{" "}
            <span style={{
              background: "var(--surface-3)", color: "var(--text-3)",
              fontSize: 11, padding: "1px 5px", borderRadius: 8,
            }}>
              {filters.currentFirms.length + filters.firmAUM.length}
            </span>
          </span>
        </div>

        <FilterAccordion title={t("filters.currentFirm")} count={filters.currentFirms.length}>
          <div style={{ marginBottom: 4, fontSize: 12, color: "var(--text-3)" }}>
            {t("filters.clearAllShown")}
          </div>
          <DropdownMulti
            placeholder="Enter Firm title"
            options={ADVISOR_FILTER_OPTIONS.firms}
            selected={filters.currentFirms}
            onChange={v => set("currentFirms", v)}
            searchable
          />
        </FilterAccordion>

        <FilterAccordion title={t("filters.firmAUM")} count={filters.firmAUM.length}>
          <CheckboxGroup
            options={ADVISOR_FILTER_OPTIONS.firmAUM}
            selected={filters.firmAUM}
            onChange={v => set("firmAUM", v)}
            preset showClear
          />
        </FilterAccordion>

        <div style={{ padding: "8px 16px 4px" }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text-3)" }}>
            {t("common.advisorDetails")}{" "}
            <span style={{
              background: "var(--surface-3)", color: "var(--text-3)",
              fontSize: 11, padding: "1px 5px", borderRadius: 8,
            }}>
              {filters.statesRegistered.length + filters.compliance.length}
            </span>
          </span>
        </div>

        <FilterAccordion title={t("filters.statesRegistered")} count={filters.statesRegistered.length}>
          <div style={{ marginBottom: 8 }}>
            {(["is_any_of","is_not_any_of","is_all_of"] as const).map(m => (
              <label key={m} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, cursor: "pointer" }}>
                <input
                  type="radio"
                  className="custom-radio"
                  checked={filters.statesMode === m}
                  onChange={() => set("statesMode", m)}
                />
                <span style={{ fontSize: 13, color: "var(--text-2)" }}>
                  {m === "is_any_of" ? t("filters.isAnyOf") : m === "is_not_any_of" ? t("filters.isNotAnyOf") : t("filters.isAllOf")}
                </span>
              </label>
            ))}
          </div>
          <DropdownMulti
            placeholder="Search state"
            options={ADVISOR_FILTER_OPTIONS.states}
            selected={filters.statesRegistered}
            onChange={v => set("statesRegistered", v)}
            searchable
          />
        </FilterAccordion>

        <FilterAccordion title={t("filters.compliance")} count={filters.compliance.length}>
          <CheckboxGroup
            options={ADVISOR_FILTER_OPTIONS.compliance}
            selected={filters.compliance}
            onChange={v => set("compliance", v)}
            showClear
          />
        </FilterAccordion>

        <FilterAccordion title={t("filters.age")} count={filters.ageRanges.length}>
          <CheckboxGroup
            options={ADVISOR_FILTER_OPTIONS.ageRanges}
            selected={filters.ageRanges}
            onChange={v => set("ageRanges", v)}
            showClear
          />
        </FilterAccordion>

        <FilterAccordion title={t("filters.lifeEvents")} count={filters.lifeEvents.length}>
          <DropdownMulti
            placeholder="Search events"
            options={ADVISOR_FILTER_OPTIONS.lifeEvents}
            selected={filters.lifeEvents}
            onChange={v => set("lifeEvents", v)}
            searchable
          />
        </FilterAccordion>

        <FilterAccordion title={t("filters.almaMater")} count={filters.almaMater.length}>
          <DropdownMulti
            placeholder="Search Alma Mater"
            options={[]}
            selected={filters.almaMater}
            onChange={v => set("almaMater", v)}
            searchable
          />
        </FilterAccordion>

      </div>
    </aside>
  );
}
