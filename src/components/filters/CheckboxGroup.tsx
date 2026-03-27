"use client";

interface Option {
  label: string;
  value: string;
  count?: number;
  level?: string;
}

interface Props {
  options: Option[];
  selected: string[];
  onChange: (values: string[]) => void;
  preset?: boolean;
  showClear?: boolean;
}

const LEVEL_COLOR: Record<string, string> = {
  HIGH:     "#16A34A",
  MODERATE: "#D97706",
  LOW:      "#DC2626",
};

export default function CheckboxGroup({ options, selected, onChange, preset, showClear }: Props) {
  const toggle = (v: string) =>
    onChange(selected.includes(v) ? selected.filter(x => x !== v) : [...selected, v]);

  return (
    <div>
      {showClear && selected.length > 0 && (
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 6 }}>
          <button
            onClick={() => onChange([])}
            style={{ background: "none", border: "none", cursor: "pointer", fontSize: 12, color: "var(--text-3)" }}
          >
            Clear All
          </button>
        </div>
      )}

      {preset && (
        <div className="seg" style={{ marginBottom: 10 }}>
          <button className="seg-btn on">Preset</button>
          <button className="seg-btn">Custom</button>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
        {options.map(opt => (
          <label
            key={opt.value}
            style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}
          >
            <input
              type="checkbox"
              className="custom-checkbox"
              checked={selected.includes(opt.value)}
              onChange={() => toggle(opt.value)}
            />
            <span style={{ flex: 1, fontSize: 13, color: "var(--text-2)" }}>
              {opt.label}
            </span>
            {opt.level && (
              <span style={{ fontSize: 11, fontWeight: 600, color: LEVEL_COLOR[opt.level] ?? "var(--text-3)" }}>
                {opt.level}
              </span>
            )}
            {opt.count !== undefined && (
              <span style={{ fontSize: 12, color: "var(--text-4)" }}>
                ({opt.count.toLocaleString()})
              </span>
            )}
          </label>
        ))}
      </div>
    </div>
  );
}
