"use client";
import { useState } from "react";
import { Search, X } from "lucide-react";
import FilterAccordion from "./FilterAccordion";
import CheckboxGroup from "./CheckboxGroup";
import DropdownMulti from "./DropdownMulti";
import SavedSearches from "./SavedSearches";
import { FIRM_FILTER_OPTIONS } from "@/lib/data/firms";
import type { FirmFilters } from "@/types";

interface Props {
  filters: FirmFilters;
  onChange: (f: FirmFilters) => void;
  totalCount: number;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  savedFilters: { name: string; filters: any }[];
  onApplyFilter: (filters: any) => void;
  onSaveRequest: () => void;
  onClearAll?: () => void;
}

export default function FirmFilterPanel({ filters, onChange, totalCount, searchQuery, onSearchChange, savedFilters, onApplyFilter, onSaveRequest, onClearAll }: Props) {
  const [paramSearch, setParamSearch] = useState("");

  const set = <K extends keyof FirmFilters>(key: K, val: FirmFilters[K]) =>
    onChange({ ...filters, [key]: val });

  const activeCount =
    [
      filters.totalAUM,
      filters.hnwClientAUM,
      filters.acquisitionScore,
      filters.custodian,
      filters.ownerTenure,
      filters.hnwClientGrowth,
      filters.clientGrowth,
    ].reduce((acc, arr) => acc + arr.length, 0) +
    (filters.outpacesMarketGrowth ? 1 : 0) +
    (filters.familyOwned !== null ? 1 : 0);

  return (
    <aside
      style={{
        width: 280,
        flexShrink: 0,
        background: "var(--surface)",
        borderRight: "1px solid var(--border)",
        display: "flex",
        flexDirection: "column",
        overflowY: "auto",
        height: "100%",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "12px 16px",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 8,
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: "var(--text-1)" }}>
            Filters
          </span>
          {activeCount > 0 && (
            <span
              style={{
                background: "var(--text-1)",
                color: "white",
                fontSize: 11,
                fontWeight: 600,
                padding: "1px 7px",
                borderRadius: 10,
              }}
            >
              {activeCount}
            </span>
          )}
        </div>
        <SavedSearches savedFilters={savedFilters} onApply={onApplyFilter} onSaveRequest={onSaveRequest} />
      </div>

      {/* Global Search */}
      <div style={{ padding: "10px 16px", borderBottom: "1px solid var(--surface-3)" }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 7,
          background: "var(--surface)", border: "1px solid var(--border)",
          borderRadius: 8, padding: "6px 10px", marginBottom: 10
        }}>
          <Search size={14} color="var(--text-3)" />
          <input
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
            placeholder="Search data..."
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

      {/* Local Filter Param Search */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 7,
            background: "var(--surface-2)",
            border: "1px solid var(--border)",
            borderRadius: 8,
            padding: "6px 10px",
          }}
        >
          <Search size={13} color="var(--text-4)" />
          <input
            value={paramSearch}
            onChange={(e) => setParamSearch(e.target.value)}
            placeholder="Search by filter parameters"
            style={{
              flex: 1,
              border: "none",
              background: "transparent",
              fontSize: 12,
              color: "var(--text-1)",
              outline: "none",
            }}
          />
          {paramSearch && (
            <button
              onClick={() => setParamSearch("")}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                display: "flex",
                padding: 0,
              }}
            >
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
            Clear all filters
          </button>
        </div>
      )}

      {/* Shortcuts */}
      <div style={{ padding: "10px 16px 4px", flexShrink: 0 }}>
        <div
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: "var(--text-3)",
            marginBottom: 8,
          }}
        >
          Shortcuts
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span style={{ fontSize: 13, color: "var(--text-2)" }}>
              Smart Search
            </span>
            <label className="toggle-track">
              <input
                type="checkbox"
                checked={filters.smartSearch}
                onChange={(e) => set("smartSearch", e.target.checked)}
              />
              <span className="toggle-thumb" />
            </label>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span style={{ fontSize: 13, color: "var(--text-2)" }}>
              Outpaces market growth
            </span>
            <label className="toggle-track">
              <input
                type="checkbox"
                checked={filters.outpacesMarketGrowth}
                onChange={(e) => set("outpacesMarketGrowth", e.target.checked)}
              />
              <span className="toggle-thumb" />
            </label>
          </div>
        </div>
      </div>

      {/* Scrollable filters */}
      <div style={{ overflowY: "auto", flex: 1 }}>

        {/* Firm Metrics label */}
        <div style={{ padding: "8px 16px 4px" }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text-3)" }}>
            Firm Metrics{" "}
            <span
              style={{
                background: "var(--surface-3)",
                color: "var(--text-3)",
                fontSize: 11,
                padding: "1px 5px",
                borderRadius: 8,
              }}
            >
              {filters.totalAUM.length +
                filters.hnwClientAUM.length +
                filters.acquisitionScore.length +
                filters.custodian.length}
            </span>
          </span>
        </div>

        <FilterAccordion title="Total AUM ($M)" count={filters.totalAUM.length} defaultOpen>
          <CheckboxGroup
            options={FIRM_FILTER_OPTIONS.totalAUM}
            selected={filters.totalAUM}
            onChange={(v) => set("totalAUM", v)}
            preset
            showClear
          />
        </FilterAccordion>

        <FilterAccordion title="HNW Client AUM %" count={filters.hnwClientAUM.length}>
          <CheckboxGroup
            options={FIRM_FILTER_OPTIONS.hnwClientAUM}
            selected={filters.hnwClientAUM}
            onChange={(v) => set("hnwClientAUM", v)}
            preset
            showClear
          />
        </FilterAccordion>

        <FilterAccordion title="Acquisition Score" count={filters.acquisitionScore.length}>
          <CheckboxGroup
            options={FIRM_FILTER_OPTIONS.acquisitionScore}
            selected={filters.acquisitionScore}
            onChange={(v) => set("acquisitionScore", v)}
            showClear
          />
        </FilterAccordion>

        <FilterAccordion title="Custodian" count={filters.custodian.length}>
          <DropdownMulti
            placeholder="Search custodian"
            options={FIRM_FILTER_OPTIONS.custodians}
            selected={filters.custodian}
            onChange={(v) => set("custodian", v)}
            searchable
          />
        </FilterAccordion>

        {/* Smart Filters label */}
        <div style={{ padding: "8px 16px 4px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 13, color: "var(--brand)" }}>✦</span>
            <span
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: "var(--brand)",
              }}
            >
              Smart Filters{" "}
              <span
                style={{
                  background: "var(--brand-light)",
                  color: "var(--brand)",
                  fontSize: 11,
                  padding: "1px 5px",
                  borderRadius: 8,
                }}
              >
                {filters.hnwClientGrowth.length + filters.clientGrowth.length}
              </span>
            </span>
          </div>
        </div>

        <div
          style={{
            margin: "4px 16px 8px",
            border: "1px solid var(--brand-light)",
            borderRadius: 10,
            overflow: "hidden",
            background: "var(--brand-light)",
          }}
        >
          <FilterAccordion title="HNW Client Growth" count={filters.hnwClientGrowth.length}>
            <CheckboxGroup
              options={[
                { label: "Growing fast (>20%)", value: "fast",     count: 3245 },
                { label: "Growing (5-20%)",     value: "moderate", count: 4120 },
                { label: "Stable (0-5%)",       value: "stable",   count: 2650 },
                { label: "Declining",           value: "decline",  count: 890  },
              ]}
              selected={filters.hnwClientGrowth}
              onChange={(v) => set("hnwClientGrowth", v)}
              showClear
            />
          </FilterAccordion>

          <FilterAccordion title="Client Growth" count={filters.clientGrowth.length}>
            <CheckboxGroup
              options={[
                { label: "Growing fast (>20%)", value: "fast",     count: 3245 },
                { label: "Growing (5-20%)",     value: "moderate", count: 4120 },
                { label: "Stable (0-5%)",       value: "stable",   count: 2650 },
                { label: "Declining",           value: "decline",  count: 890  },
              ]}
              selected={filters.clientGrowth}
              onChange={(v) => set("clientGrowth", v)}
              showClear
            />
          </FilterAccordion>
        </div>

        {/* Firm Characteristics label */}
        <div style={{ padding: "8px 16px 4px" }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text-3)" }}>
            Firm Characteristics{" "}
            <span
              style={{
                background: "var(--surface-3)",
                color: "var(--text-3)",
                fontSize: 11,
                padding: "1px 5px",
                borderRadius: 8,
              }}
            >
              18
            </span>
          </span>
        </div>

        <FilterAccordion title="Location" count={filters.location.length}>
          <DropdownMulti
            placeholder="Search location"
            options={[
              "California","Texas","New York","Florida","Illinois",
              "Ohio","Georgia","Washington","Colorado","Massachusetts",
            ]}
            selected={filters.location}
            onChange={(v) => set("location", v)}
            searchable
          />
        </FilterAccordion>

        <FilterAccordion title="Office Count" count={filters.officeCount.length}>
          <CheckboxGroup
            options={[
              { label: "1 office",     value: "1",    count: 3245 },
              { label: "2-5 offices",  value: "2-5",  count: 4120 },
              { label: "6-10 offices", value: "6-10", count: 2650 },
              { label: "10+",          value: "10+",  count: 890  },
            ]}
            selected={filters.officeCount}
            onChange={(v) => set("officeCount", v)}
            showClear
          />
        </FilterAccordion>

        <FilterAccordion title="AUM per Office" count={filters.aumPerAdvisor.length}>
          <CheckboxGroup
            options={[
              { label: "Under $50M",   value: "0-50",   count: 3245 },
              { label: "$50M - $200M", value: "50-200", count: 4120 },
              { label: "$200M+",       value: "200+",   count: 2650 },
            ]}
            selected={filters.aumPerAdvisor}
            onChange={(v) => set("aumPerAdvisor", v)}
            showClear
          />
        </FilterAccordion>

        <FilterAccordion title="Advisor Count" count={filters.advisorCount.length}>
          <CheckboxGroup
            options={[
              { label: "1-5",   value: "1-5",   count: 3245 },
              { label: "6-20",  value: "6-20",  count: 4120 },
              { label: "21-50", value: "21-50", count: 2650 },
              { label: "50+",   value: "50+",   count: 890  },
            ]}
            selected={filters.advisorCount}
            onChange={(v) => set("advisorCount", v)}
            showClear
          />
        </FilterAccordion>

        <FilterAccordion title="Employees" count={filters.employees.length}>
          <CheckboxGroup
            options={[
              { label: "1-10",   value: "1-10",   count: 3245 },
              { label: "11-50",  value: "11-50",  count: 4120 },
              { label: "51-200", value: "51-200", count: 2650 },
              { label: "200+",   value: "200+",   count: 890  },
            ]}
            selected={filters.employees}
            onChange={(v) => set("employees", v)}
            showClear
          />
        </FilterAccordion>

        <FilterAccordion
          title="SEC Registration Date"
          count={filters.secRegistrationDateFrom ? 1 : 0}
        >
          <div style={{ display: "flex", gap: 8 }}>
            <input
              type="text"
              value={filters.secRegistrationDateFrom}
              onChange={(e) => set("secRegistrationDateFrom", e.target.value)}
              placeholder="dd.mm.yyyy"
              style={{
                flex: 1,
                padding: "7px 10px",
                border: "1px solid var(--border)",
                borderRadius: 8,
                fontSize: 12,
                outline: "none",
              }}
              onFocus={(e) =>
                (e.currentTarget.style.borderColor = "var(--brand)")
              }
              onBlur={(e) =>
                (e.currentTarget.style.borderColor = "var(--border)")
              }
            />
            <input
              type="text"
              value={filters.secRegistrationDateTo}
              onChange={(e) => set("secRegistrationDateTo", e.target.value)}
              placeholder="dd.mm.yyyy"
              style={{
                flex: 1,
                padding: "7px 10px",
                border: "1px solid var(--border)",
                borderRadius: 8,
                fontSize: 12,
                outline: "none",
              }}
              onFocus={(e) =>
                (e.currentTarget.style.borderColor = "var(--brand)")
              }
              onBlur={(e) =>
                (e.currentTarget.style.borderColor = "var(--border)")
              }
            />
          </div>
        </FilterAccordion>

        <FilterAccordion title="AUM CAGR" count={filters.aumCAGR.length}>
          <CheckboxGroup
            options={[
              { label: "Negative", value: "neg",  count: 1245 },
              { label: "0-5%",     value: "0-5",  count: 3245 },
              { label: "5-15%",    value: "5-15", count: 4120 },
              { label: "15%+",     value: "15+",  count: 2650 },
            ]}
            selected={filters.aumCAGR}
            onChange={(v) => set("aumCAGR", v)}
            showClear
          />
        </FilterAccordion>

        <FilterAccordion title="Past Acquisitions" count={filters.pastAcquisitions.length}>
          <CheckboxGroup
            options={[
              { label: "None", value: "0",   count: 3245 },
              { label: "1-2",  value: "1-2", count: 4120 },
              { label: "3-5",  value: "3-5", count: 2650 },
              { label: "5+",   value: "5+",  count: 890  },
            ]}
            selected={filters.pastAcquisitions}
            onChange={(v) => set("pastAcquisitions", v)}
            showClear
          />
        </FilterAccordion>

        {/* Owner Information label */}
        <div style={{ padding: "8px 16px 4px" }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text-3)" }}>
            Owner Information{" "}
            <span
              style={{
                background: "var(--surface-3)",
                color: "var(--text-3)",
                fontSize: 11,
                padding: "1px 5px",
                borderRadius: 8,
              }}
            >
              6
            </span>
          </span>
        </div>

        <FilterAccordion
          title="Owner Tenure"
          count={filters.ownerTenure.length}
          info="Find firms with at least one owner with the specified tenure length"
        >
          <CheckboxGroup
            options={FIRM_FILTER_OPTIONS.ownerTenure}
            selected={filters.ownerTenure}
            onChange={(v) => set("ownerTenure", v)}
            showClear
          />
        </FilterAccordion>

        <FilterAccordion title="Owner Age" count={filters.ownerAge.length}>
          <CheckboxGroup
            options={[
              { label: "Under 40", value: "under-40", count: 1245 },
              { label: "40-55",    value: "40-55",    count: 3245 },
              { label: "55-65",    value: "55-65",    count: 4120 },
              { label: "65+",      value: "65+",      count: 2650 },
            ]}
            selected={filters.ownerAge}
            onChange={(v) => set("ownerAge", v)}
            showClear
          />
        </FilterAccordion>

        <FilterAccordion
          title="Family Owned"
          count={filters.familyOwned !== null ? 1 : 0}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {(
              [
                { label: "Yes", value: true  },
                { label: "No",  value: false },
                { label: "Any", value: null  },
              ] as { label: string; value: boolean | null }[]
            ).map((opt) => (
              <label
                key={String(opt.value)}
                style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}
              >
                <input
                  type="radio"
                  className="custom-radio"
                  checked={filters.familyOwned === opt.value}
                  onChange={() => set("familyOwned", opt.value)}
                />
                <span style={{ fontSize: 13, color: "var(--text-2)" }}>
                  {opt.label}
                </span>
              </label>
            ))}
          </div>
        </FilterAccordion>

        {/* Other label */}
        <div style={{ padding: "8px 16px 4px" }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text-3)" }}>
            Other
          </span>
        </div>

        <FilterAccordion title="ADV Brochure" count={0}>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {["Available", "Not available"].map((opt) => (
              <label
                key={opt}
                style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}
              >
                <input type="checkbox" className="custom-checkbox" />
                <span style={{ fontSize: 13, color: "var(--text-2)" }}>{opt}</span>
              </label>
            ))}
          </div>
        </FilterAccordion>

      </div>
    </aside>
  );
}
