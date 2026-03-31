"use client";
import Link from "next/link";
import { Globe, MapPin, Calendar, Users, Building2, FileText, Lock, TrendingUp, ChevronRight } from "lucide-react";
import AUMDonutChart from "@/components/charts/AUMDonutChart";
import AUMGrowthChart from "@/components/charts/AUMGrowthChart";
import AcquisitionGauge from "@/components/charts/AcquisitionGauge";
import { MOCK_FIRM_PROFILE } from "@/lib/data/firms";

const ORG_ITEMS = ["Owners","Advisors","Offices Locations"];
const OPS_ITEMS = ["ADV Brochure","Services","Providers","Compliance"];

export default function FirmProfilePage() {
  const firm = MOCK_FIRM_PROFILE;
  const score = firm.acquisitionScore;

  return (
    <div className="firm-page-layout" style={{ display: "flex", height: "100%", overflow: "hidden", background: "var(--surface-3)" }}>

      <aside className="firm-page-sidebar" style={{
        width: 220, flexShrink: 0, background: "var(--surface)",
        borderRight: "1px solid var(--border)",
        overflowY: "auto", padding: "16px 0",
      }}>
        {[
          { label: "Overview",    active: true  },
          { label: "Acquisition", active: false },
          { label: "Historical",  active: false },
        ].map(s => (
          <button key={s.label} style={{
            display: "flex", alignItems: "center",
            width: "100%", padding: "9px 16px",
            background: s.active ? "var(--brand-light)" : "none",
            border: "none", cursor: "pointer", textAlign: "left",
            color: s.active ? "var(--brand)" : "var(--text-2)",
            fontSize: 13, fontWeight: s.active ? 500 : 400,
            borderLeft: s.active ? "2px solid var(--brand)" : "2px solid transparent",
          }}>
            {s.label}
          </button>
        ))}

        {[
          { title: "Organization", items: ORG_ITEMS },
          { title: "Portfolio",    items: ["Assets","Funds"] },
          { title: "Operations",   items: OPS_ITEMS },
        ].map(section => (
          <div key={section.title}>
            <div style={{ padding: "12px 16px 4px", display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: "var(--text-4)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                {section.title}
              </span>
              <span style={{ fontSize: 10, background: "var(--surface-3)", color: "var(--text-3)", padding: "1px 5px", borderRadius: 4 }}>
                Premium
              </span>
            </div>
            {section.items.map(item => (
              <button key={item} style={{
                display: "flex", alignItems: "center", gap: 8,
                width: "100%", padding: "8px 16px",
                background: "none", border: "none", cursor: "pointer",
                color: "var(--text-3)", fontSize: 13,
              }}>
                <Lock size={12} color="var(--text-4)" />
                {item}
              </button>
            ))}
          </div>
        ))}
      </aside>

      <div style={{ flex: 1, overflowY: "auto", minWidth: 0 }}>

        <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "12px 24px 0", fontSize: 12, color: "var(--text-3)" }}>
          <Link href="/market-insights" style={{ color: "var(--text-3)", textDecoration: "none" }}>Firm Profiles</Link>
          <ChevronRight size={12} />
          <span style={{ color: "var(--text-2)" }}>{firm.name}</span>
        </div>

        <div className="firm-page-header" style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", padding: "16px 24px 12px" }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
            <div style={{
              width: 60, height: 60, borderRadius: 12,
              background: "var(--brand-light)", border: "1px solid var(--border)",
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>
              <Building2 size={28} color="var(--brand)" />
            </div>
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--text-1)", marginBottom: 6 }}>
                {firm.name}
              </h1>
              <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
                <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 13, color: "var(--text-3)" }}>
                  <Calendar size={13} /> Est. {firm.established}
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 13, color: "var(--text-3)" }}>
                  <MapPin size={13} /> {firm.location}
                </span>
                <a href={firm.website} target="_blank" rel="noreferrer"
                  style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 13, color: "var(--brand)", textDecoration: "none" }}>
                  <Globe size={13} /> Website
                </a>
                <a href={firm.linkedin} target="_blank" rel="noreferrer"
                  style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 13, color: "var(--brand)", textDecoration: "none" }}>
                  &#128279; LinkedIn
                </a>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 8, flexWrap: "wrap" }}>
                <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 13, color: "var(--text-3)" }}>
                  <Users size={13} /> Advisors: <strong style={{ color: "var(--text-1)" }}>{firm.advisorCount}</strong>
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 13, color: "var(--text-3)" }}>
                  <Building2 size={13} /> Offices: <strong style={{ color: "var(--text-1)" }}>{firm.officeCount}</strong>
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 13, color: "var(--text-3)" }}>
                  <FileText size={13} /> Last Filing: <strong style={{ color: "var(--text-1)" }}>{firm.lastFiling}</strong>
                </span>
              </div>
            </div>
          </div>
          <div className="firm-acq-score-mobile" style={{ textAlign: "right", flexShrink: 0 }}>
            <div style={{ fontSize: 12, color: "var(--text-3)", marginBottom: 4 }}>Acquisition Score</div>
            <div style={{ fontSize: 36, fontWeight: 800, color: score >= 70 ? "#16A34A" : score >= 50 ? "#D97706" : "#DC2626" }}>
              {score}
            </div>
          </div>
        </div>

        <div style={{ padding: "0 24px 24px" }}>

          <h2 style={{ fontSize: 18, fontWeight: 600, color: "var(--text-1)", marginBottom: 16 }}>Overview</h2>

          <div style={{ border: "1px solid var(--brand-light)", borderRadius: 12, padding: "16px 20px", marginBottom: 20, background: "var(--surface)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 14, color: "var(--brand)" }}>&#10022;</span>
                <span style={{ fontSize: 14, fontWeight: 600, color: "var(--text-1)" }}>AI Deal Brief Summary</span>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button style={{ background: "none", border: "none", cursor: "pointer", fontSize: 16 }}>&#128078;</button>
                <button style={{ background: "none", border: "none", cursor: "pointer", fontSize: 16 }}>&#128077;</button>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: "var(--text-1)" }}>{firm.aiSummary.title}</span>
              <TrendingUp size={16} color="#16A34A" />
            </div>
            <ul style={{ paddingLeft: 16, margin: 0, display: "flex", flexDirection: "column", gap: 6 }}>
              {firm.aiSummary.bullets.map((b, i) => (
                <li key={i} style={{ fontSize: 13, color: "var(--text-2)", lineHeight: 1.6 }}>{b}</li>
              ))}
            </ul>
          </div>

          <div className="firm-grid-2col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
            <div style={{ background: "var(--surface)", borderRadius: 12, padding: "16px 20px", border: "1px solid var(--border)" }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text-1)", marginBottom: 4 }}>AUM Composition</div>
              <div style={{ position: "relative" }}>
                <AUMDonutChart data={firm.aumComposition} />
                <div style={{
                  position: "absolute", top: "50%", left: "50%",
                  transform: "translate(-50%, -54%)", textAlign: "center", pointerEvents: "none",
                }}>
                  <div style={{ fontSize: 20, fontWeight: 700, color: "var(--text-1)" }}>${firm.totalAUM}B</div>
                  <div style={{ fontSize: 11, color: "var(--text-3)" }}>Total AUM</div>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 4 }}>
                {firm.aumComposition.map((seg, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 10, height: 10, borderRadius: 2, background: seg.color }} />
                      <span style={{ fontSize: 12, color: "var(--text-2)" }}>{seg.name}</span>
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 500, color: "var(--text-1)" }}>{seg.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: "var(--surface)", borderRadius: 12, padding: "16px 20px", border: "1px solid var(--border)" }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text-1)", marginBottom: 4 }}>AUM Growth Trend</div>
              <div style={{ fontSize: 12, color: "var(--text-3)", marginBottom: 12 }}>5-Year performance vs market average</div>
              <AUMGrowthChart data={firm.aumGrowthTrend} />
            </div>
          </div>

          <h2 style={{ fontSize: 18, fontWeight: 600, color: "var(--text-1)", marginBottom: 16 }}>Acquisition</h2>

          <div style={{ background: "var(--surface)", borderRadius: 12, border: "1px solid var(--border)", overflow: "hidden", marginBottom: 16 }}>
            <div style={{ padding: "14px 20px", borderBottom: "1px solid var(--surface-3)" }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: "var(--text-1)" }}>Acquisition Insights</span>
            </div>
            <div className="firm-grid-2col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
              <div style={{ padding: "20px 24px", borderRight: "1px solid var(--surface-3)" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                  <span style={{ fontSize: 13, fontWeight: 500, color: "var(--text-1)" }}>Acquisition Score</span>
                  <span style={{
                    fontSize: 11, fontWeight: 700,
                    color: score >= 70 ? "#16A34A" : score >= 50 ? "#D97706" : "#DC2626",
                    background: score >= 70 ? "#F0FDF4" : score >= 50 ? "#FFFBEB" : "#FEF2F2",
                    padding: "2px 8px", borderRadius: 4,
                  }}>
                    {score >= 70 ? "HIGH" : score >= 50 ? "MODERATE" : "LOW"}
                  </span>
                </div>
                <AcquisitionGauge score={firm.acquisitionScore} change={firm.acquisitionScoreChange} />
                <div style={{ marginTop: 16, fontSize: 12, color: "var(--text-3)", textAlign: "center" }}>
                  Based on firm size, growth trajectory, and market positioning.
                </div>
                <div style={{ marginTop: 12, padding: "12px 14px", background: "var(--surface-2)", borderRadius: 8 }}>
                  <div style={{ fontSize: 12, fontWeight: 500, color: "var(--text-2)", marginBottom: 4 }}>Benchmark:</div>
                  <div style={{ fontSize: 12, color: "var(--text-2)" }}>
                    <strong>{firm.benchmark.regionRank}</strong> of firms in {firm.benchmark.region}
                  </div>
                  <div style={{ fontSize: 12, color: "var(--text-2)" }}>
                    {firm.benchmark.higherThanAverage} for firms with {firm.benchmark.aumRange}
                  </div>
                </div>
              </div>

              <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: "var(--text-1)", marginBottom: 16, alignSelf: "flex-start" }}>Driving Factors</div>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: "var(--surface-3)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
                  <Lock size={22} color="var(--text-4)" />
                </div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text-1)", marginBottom: 6 }}>Upgrade your plan</div>
                <div style={{ fontSize: 12, color: "var(--text-3)", textAlign: "center", marginBottom: 16 }}>
                  To unlock detailed acquisition timeline, target profiles, and valuation trends.
                </div>
                <button style={{ padding: "9px 20px", background: "var(--brand)", color: "var(--surface)", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: "pointer" }}>
                  Upgrade to Premium
                </button>
              </div>
            </div>
          </div>

          <div style={{ background: "var(--surface)", borderRadius: 12, border: "1px solid var(--border)", padding: "16px 20px", marginBottom: 24 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-1)", marginBottom: 10 }}>Acquisition History:</div>
            <div style={{ display: "flex", gap: 24 }}>
              <span style={{ fontSize: 13, color: "var(--text-2)" }}>
                Total Acquired AUM: <strong style={{ color: "var(--text-1)" }}>{firm.acquisitionHistory.totalAcquiredAUM}</strong>
              </span>
              <span style={{ fontSize: 13, color: "var(--text-2)" }}>
                Total Acquisitions: <strong style={{ color: "var(--text-1)" }}>{firm.acquisitionHistory.totalAcquisitions}</strong>
              </span>
            </div>
          </div>

          <div style={{ background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)", borderRadius: 12, padding: "24px 28px" }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: "white", marginBottom: 6 }}>Try Premium</div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.8)", marginBottom: 20 }}>
              Accelerate your acquisition strategy with the only AI-native RIA research platform
            </div>
            <div className="firm-grid-2col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
              {[
                ["Unlimited Search","Screen the market using 50+ filters."],
                ["Unlimited Contact Information","Access all contact info for firm owners and advisors."],
                ["Brochure Insights","Insights parsed from ADV brochures."],
                ["Acquisition Score","Scoring from proprietary model trained on past acquisitions."],
              ].map(([title, desc]) => (
                <div key={title} style={{ display: "flex", gap: 10 }}>
                  <div style={{ width: 20, height: 20, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
                    <span style={{ fontSize: 10, color: "white" }}>&#10003;</span>
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "white", marginBottom: 2 }}>{title}</div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", lineHeight: 1.5 }}>{desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="firm-grid-2col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {[
                { period: "MONTHLY", price: "$980", note: "per user/month, billed monthly", highlight: false },
                { period: "YEARLY",  price: "$980", note: "per user/month, billed monthly", highlight: true  },
              ].map(p => (
                <div key={p.period} style={{ background: "rgba(255,255,255,0.12)", borderRadius: 10, padding: 16, border: p.highlight ? "1px solid rgba(255,255,255,0.4)" : "1px solid transparent" }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.7)", letterSpacing: "0.08em", marginBottom: 6 }}>
                    {p.period}
                    {p.highlight && <span style={{ marginLeft: 8, background: "#10B981", color: "var(--surface)", fontSize: 10, padding: "1px 6px", borderRadius: 4 }}>Save 20%</span>}
                  </div>
                  <div style={{ fontSize: 22, fontWeight: 700, color: "white", marginBottom: 2 }}>{p.price}</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", marginBottom: 12 }}>{p.note}</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", marginBottom: 12 }}>&#10003; 7 day FREE trial</div>
                  <button style={{ width: "100%", padding: "9px 0", background: "var(--surface)", color: "var(--brand)", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                    Get Started
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
