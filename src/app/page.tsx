"use client";
import { useState } from "react";
import Link from "next/link";
import { Search, X } from "lucide-react";
import { MOCK_FIRMS } from "@/lib/data/firms";
import { MOCK_ADVISORS } from "@/lib/data/advisors";
import { LEADERBOARD_DATA } from "@/lib/data/firms";

export default function HomePage() {
  const [q, setQ]       = useState("");
  const [open, setOpen] = useState(false);

  const results = q.length > 1 ? [
    ...MOCK_FIRMS
      .filter(f => f.name.toLowerCase().includes(q.toLowerCase()))
      .slice(0, 3)
      .map(f => ({ type: "firm", name: f.name, sub: `${f.location} · AUM: $${f.totalAUM}B`, href: "/firm/aurora-wealth" })),
    ...MOCK_ADVISORS
      .filter(a => a.name.toLowerCase().includes(q.toLowerCase()))
      .slice(0, 2)
      .map(a => ({ type: "advisor", name: a.name, sub: `${a.firm} · CRD: ${a.crd}`, href: "/advisors" })),
  ] : [];

  return (
    <div style={{ flex: 1, overflowY: "auto", background: "var(--surface-3)", minHeight: "100vh" }}>

      {/* Header */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "flex-end",
        padding: "12px 24px", gap: 12,
        background: "white", borderBottom: "1px solid var(--border)",
      }}>
        <Link href="/market-insights" style={{ fontSize: 13, color: "var(--text-2)", textDecoration: "none" }}>
          Back to Website
        </Link>
        <span style={{ color: "var(--border)" }}>|</span>
        <Link href="/advisors" style={{ fontSize: 13, color: "var(--text-2)", textDecoration: "none" }}>Log In</Link>
        <Link href="/advisors" style={{
          fontSize: 13, fontWeight: 500, color: "white",
          background: "var(--brand)", padding: "7px 16px",
          borderRadius: 8, textDecoration: "none",
        }}>Sign up</Link>
      </div>

      {/* Hero */}
      <div className="hero-section" style={{
        maxWidth: 760, margin: "0 auto",
        padding: "60px 24px 40px", textAlign: "center",
      }}>
        <h1 style={{
          fontSize: "clamp(24px, 5vw, 36px)", fontWeight: 700,
          color: "var(--text-1)", marginBottom: 12, lineHeight: 1.25,
        }}>
          Make better decisions, discover companies faster
        </h1>
        <p style={{ fontSize: 16, color: "var(--text-3)", marginBottom: 32 }}>
          Discover and act on private market activity with predictive company intelligence
        </p>

        {/* Search */}
        <div style={{ position: "relative", maxWidth: 580, margin: "0 auto" }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 10,
            background: "white", border: "1px solid var(--border)",
            borderRadius: 12, padding: "12px 16px",
            boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8, background: "var(--brand)",
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>
              <Search size={16} color="white" />
            </div>
            <input
              value={q}
              onChange={e => { setQ(e.target.value); setOpen(true); }}
              onFocus={() => setOpen(true)}
              onBlur={() => setTimeout(() => setOpen(false), 150)}
              placeholder="Search by company name and CRD"
              style={{
                flex: 1, border: "none", outline: "none",
                fontSize: 15, color: "var(--text-1)", background: "transparent",
              }}
            />
            {q && (
              <button onClick={() => { setQ(""); setOpen(false); }}
                style={{ background: "none", border: "none", cursor: "pointer", display: "flex", padding: 0 }}>
                <X size={16} color="var(--text-4)" />
              </button>
            )}
          </div>

          {open && results.length > 0 && (
            <div style={{
              position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0,
              background: "white", border: "1px solid var(--border)",
              borderRadius: 10, boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
              overflow: "hidden", zIndex: 50, textAlign: "left",
            }}>
              {results.map((r, i) => (
                <Link key={i} href={r.href} style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "11px 16px", textDecoration: "none",
                  borderBottom: i < results.length - 1 ? "1px solid var(--surface-3)" : "none",
                  background: "white", transition: "background 0.1s",
                }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "var(--surface-2)"}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "white"}
                >
                  <div style={{
                    width: 28, height: 28, borderRadius: 6, flexShrink: 0,
                    background: r.type === "firm" ? "var(--brand-light)" : "#ECFDF5",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: r.type === "firm" ? "var(--brand)" : "#10B981" }} />
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 500, color: "var(--text-1)" }}>{r.name}</div>
                    <div style={{ fontSize: 12, color: "var(--text-3)", marginTop: 1 }}>{r.sub}</div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Leaderboards */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px 48px" }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: "var(--text-1)", marginBottom: 6 }}>
            Market Leaderboards
          </h2>
          <p style={{ fontSize: 13, color: "var(--text-3)" }}>
            Limited to pure Registered Investment Advisors (RIAs)
            <span style={{ marginLeft: 6, cursor: "help", color: "var(--text-4)" }}>&#9432;</span>
          </p>
        </div>

        <div
          className="leaderboard-grid"
          style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}
        >
          {/* Largest AUM */}
          <LeaderboardCard
            icon="🏆" title="Largest AUM"
            subtitle="Top firms by total assets under management"
            items={LEADERBOARD_DATA.largestAUM.map(i => ({
              rank: i.rank, name: i.name,
              right: <span style={{ fontSize: 13, fontWeight: 500, color: "var(--text-1)" }}>{i.value}</span>,
            }))}
          />

          {/* Top Growing */}
          <LeaderboardCard
            icon="📈" title="Top Growing"
            subtitle="Fastest growing firms by AUM percentage"
            items={LEADERBOARD_DATA.topGrowing.map(i => ({
              rank: i.rank, name: i.name,
              right: (
                <div style={{ textAlign: "right" }}>
                  <span style={{ fontSize: 11, color: "var(--text-3)", marginRight: 6 }}>{i.aum}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#16A34A" }}>{i.growth}</span>
                </div>
              ),
            }))}
          />

          {/* Top Acquisition Score */}
          <LeaderboardCard
            icon="🎉" title="Top Acquisition Score"
            subtitle="Focuses on the output of the scoring model"
            items={LEADERBOARD_DATA.topAcquisitionScore.map(i => ({
              rank: i.rank, name: i.name,
              right: (
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-1)" }}>{i.score.toLocaleString()}</div>
                  <div style={{ fontSize: 11, color: "var(--text-4)" }}>Score</div>
                </div>
              ),
            }))}
          />
        </div>

        {/* Premium CTA */}
        <div style={{
          marginTop: 32,
          background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)",
          borderRadius: 12, padding: "20px 28px",
          display: "flex", alignItems: "center",
          justifyContent: "space-between", gap: 16,
          flexWrap: "wrap",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10,
              background: "rgba(255,255,255,0.2)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 20, flexShrink: 0,
            }}>
              👑
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "white" }}>Try Premium</div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.75)" }}>
                Accelerate your acquisition strategy with the only AI-native RIA research platform
              </div>
            </div>
          </div>
          <Link href="/market-insights" style={{
            padding: "10px 20px", background: "white",
            color: "var(--brand)", borderRadius: 8,
            fontSize: 13, fontWeight: 600,
            textDecoration: "none", flexShrink: 0, whiteSpace: "nowrap",
          }}>
            View Pricing
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ── Reusable leaderboard card ── */
function LeaderboardCard({ icon, title, subtitle, items }: {
  icon: string;
  title: string;
  subtitle: string;
  items: { rank: number; name: string; right: React.ReactNode }[];
}) {
  return (
    <div style={{
      background: "white", borderRadius: 12,
      border: "1px solid var(--border)", overflow: "hidden",
    }}>
      <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--surface-3)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: "var(--surface-2)",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16,
          }}>
            {icon}
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text-1)" }}>{title}</div>
            <div style={{ fontSize: 11, color: "var(--text-3)" }}>{subtitle}</div>
          </div>
        </div>
      </div>
      {items.map((item, i) => (
        <div key={item.rank} style={{
          display: "flex", alignItems: "center",
          justifyContent: "space-between",
          padding: "11px 20px",
          borderBottom: i < items.length - 1 ? "1px solid var(--surface-3)" : "none",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 13, color: "var(--text-4)", minWidth: 16 }}>{item.rank}.</span>
            <span style={{ fontSize: 13, color: "var(--text-2)" }}>{item.name}</span>
          </div>
          {item.right}
        </div>
      ))}
    </div>
  );
}
