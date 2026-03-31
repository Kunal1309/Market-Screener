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
}

export default function MarketInsightsFilterPanel({ filters, onChange }: Props) {
  const [paramSearch, setParamSearch] = useState("");

  const set = <K extends keyof FirmFilters>(key: K, val: FirmFilters[K]) =>
    onChange({ ...filters, [key]: val });

  const activeCount =
    filters.totalAUM.length +
    filters.hnwClientAUM.length +
    filters.acquisitionScore.length +
    filters.custodian.length +
    filters.hnwClientGrowth.length +
    filters.clientGrowth.length +
    filters.ownerTenure.length +
    filters.aumCAGR.length +
    (filters.outpacesMarketGrowth ? 1 : 0);

  return (
    <aside style={{
      width: 280, flexShrink: 0,
      background: "var(--surface)",
      borderRight: "1px solid var(--border)",
      display: "flex", flexDirection: "column",
      height: "100%",
    }}>
      {/* Header */}
      <div style={{
        padding: "12px 16px",
        borderBottom: "1px solid var(--border)",
        display: "flex", alignItems: "center",
        justifyContent: "space-between", gap: 8, flexShrink: 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: "var(--text-1)" }}>Filters</span>
          {activeCount > 0 && (
            <span style={{
              background: "var(--text-1)", color: "var(--surface)",
              fontSize: 11, fontWeight: 600,
              padding: "1px 7px", borderRadius: 10,
            }}>{activeCount}</span>
          )}
        </div>
        <SavedSearches />
      </div>

      {/* Param search */}
      <div style={{ padding: "10px 16px", borderBottom: "1px solid var(--surface-3)", flexShrink: 0 }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 7,
          background: "var(--surface-2)", border: "1px solid var(--border)",
          borderRadius: 8, padding: "6px 10px",
        }}>
          <Search size={13} color="var(--text-4)" />
          <input
            value={paramSearch}
            onChange={e => setParamSearch(e.target.value)}
            placeholder="Search by filter parameters"
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

      {/* Shortcuts */}
      <div style={{ padding: "10px 16px 4px", flexShrink: 0 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-3)", marginBottom: 8 }}>Shortcuts</div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
          <span style={{ fontSize: 13, color: "var(--text-2)" }}>Smart Search</span>
          <label className="toggle-track">
            <input type="checkbox" checked={filters.smartSearch}
              onChange={e => set("smartSearch", e.target.checked)} />
            <span className="toggle-thumb" />
          </label>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 13, color: "var(--text-2)" }}>Outpaces market growth</span>
          <label className="toggle-track">
            <input type="checkbox" checked={filters.outpacesMarketGrowth}
              onChange={e => set("outpacesMarketGrowth", e.target.checked)} />
            <span className="toggle-thumb" />
          </label>
        </div>
      </div>

      {/* Scrollable filters */}
      <div style={{ overflowY: "auto", flex: 1 }}>

        <div style={{ padding: "8px 16px 4px" }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text-3)" }}>
            Firm Metrics{" "}
            <span style={{
              background: "var(--surface-3)", color: "var(--text-3)",
              fontSize: 11, padding: "1px 5px", borderRadius: 8,
            }}>
              {filters.totalAUM.length + filters.hnwClientAUM.length +
               filters.acquisitionScore.length + filters.custodian.length}
            </span>
          </span>
        </div>

        <FilterAccordion title="Total AUM ($M)" count={filters.totalAUM.length} defaultOpen>
          <CheckboxGroup
            options={FIRM_FILTER_OPTIONS.totalAUM}
            selected={filters.totalAUM}
            onChange={v => set("totalAUM", v)}
            preset showClear
          />
        </FilterAccordion>

        <FilterAccordion title="HNW Client AUM %" count={filters.hnwClientAUM.length}>
          <CheckboxGroup
            options={FIRM_FILTER_OPTIONS.hnwClientAUM}
            selected={filters.hnwClientAUM}
            onChange={v => set("hnwClientAUM", v)}
            preset showClear
          />
        </FilterAccordion>

        <FilterAccordion title="Acquisition Score" count={filters.acquisitionScore.length}>
          <CheckboxGroup
            options={FIRM_FILTER_OPTIONS.acquisitionScore}
            selected={filters.acquisitionScore}
            onChange={v => set("acquisitionScore", v)}
            showClear
          />
        </FilterAccordion>

        <FilterAccordion title="Custodian" count={filters.custodian.length}>
          <CheckboxGroup
            options={FIRM_FILTER_OPTIONS.custodians.map(c => ({ label: c, value: c }))}
            selected={filters.custodian}
            onChange={v => set("custodian", v)}
            showClear
          />
        </FilterAccordion>

        {/* Smart Filters */}
        <div style={{ padding: "8px 16px 4px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 13, color: "var(--brand)" }}>&#10022;</span>
            <span style={{ fontSize: 12, fontWeight: 600, color: "var(--brand)" }}>
              Smart Filters{" "}
              <span style={{
                background: "var(--brand-light)", color: "var(--brand)",
                fontSize: 11, padding: "1px 5px", borderRadius: 8,
              }}>
                {filters.hnwClientGrowth.length + filters.clientGrowth.length}
              </span>
            </span>
          </div>
        </div>

        <div style={{
          margin: "4px 16px 8px",
          border: "1px solid var(--brand-light)",
          borderRadius: 8, overflow: "hidden",
        }}>
          <FilterAccordion title="HNW Client Growth" count={filters.hnwClientGrowth.length}>
            <CheckboxGroup
              options={[
                { label: "High growth (>20%)",   value: "high",   count: 1240 },
                { label: "Medium growth (5-20%)", value: "medium", count: 2840 },
                { label: "Low growth (<5%)",      value: "low",    count: 1200 },
              ]}
              selected={filters.hnwClientGrowth}
              onChange={v => set("hnwClientGrowth", v)}
              showClear
            />
          </FilterAccordion>

          <FilterAccordion title="Client Growth" count={filters.clientGrowth.length}>
            <CheckboxGroup
              options={[
                { label: "High growth (>20%)",   value: "high",   count: 980  },
                { label: "Medium growth (5-20%)", value: "medium", count: 3100 },
                { label: "Low growth (<5%)",      value: "low",    count: 1540 },
              ]}
              selected={filters.clientGrowth}
              onChange={v => set("clientGrowth", v)}
              showClear
            />
          </FilterAccordion>
        </div>

        {/* Firm Characteristics */}
        <div style={{ padding: "8px 16px 4px" }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text-3)" }}>
            Firm Characteristics{" "}
            <span style={{
              background: "var(--surface-3)", color: "var(--text-3)",
              fontSize: 11, padding: "1px 5px", borderRadius: 8,
            }}>18</span>
          </span>
        </div>

        <FilterAccordion title="Location" count={filters.location.length}>
          <DropdownMulti
            placeholder="Search location"
            options={["California","Texas","New York","Florida","Illinois","Ohio","Pennsylvania"]}
            selected={filters.location}
            onChange={v => set("location", v)}
            searchable
          />
        </FilterAccordion>

        <FilterAccordion title="AUM CAGR" count={filters.aumCAGR.length}>
          <CheckboxGroup
            options={[
              { label: "5%+",  value: "5+",  count: 3245 },
              { label: "10%+", value: "10+", count: 2100 },
              { label: "15%+", value: "15+", count: 890  },
            ]}
            selected={filters.aumCAGR}
            onChange={v => set("aumCAGR", v)}
            showClear
          />
        </FilterAccordion>

        {/* Owner Information */}
        <div style={{ padding: "8px 16px 4px" }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text-3)" }}>
            Owner Information{" "}
            <span style={{
              background: "var(--surface-3)", color: "var(--text-3)",
              fontSize: 11, padding: "1px 5px", borderRadius: 8,
            }}>6</span>
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
            onChange={v => set("ownerTenure", v)}
            showClear
          />
        </FilterAccordion>

        <FilterAccordion title="SEC Registration Date" count={0}>
          <div style={{ display: "flex", gap: 8 }}>
            <input
              type="text"
              placeholder="dd.mm.yyyy"
              value={filters.secRegistrationDateFrom}
              onChange={e => set("secRegistrationDateFrom", e.target.value)}
              style={{
                flex: 1, padding: "7px 10px",
                border: "1px solid var(--border)", borderRadius: 8,
                fontSize: 12, outline: "none", color: "var(--text-2)",
              }}
            />
            <input
              type="text"
              placeholder="dd.mm.yyyy"
              value={filters.secRegistrationDateTo}
              onChange={e => set("secRegistrationDateTo", e.target.value)}
              style={{
                flex: 1, padding: "7px 10px",
                border: "1px solid var(--border)", borderRadius: 8,
                fontSize: 12, outline: "none", color: "var(--text-2)",
              }}
            />
          </div>
        </FilterAccordion>

      </div>
    </aside>
  );
}
