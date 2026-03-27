"use client";
import { useState } from "react";
import { Search } from "lucide-react";
import { MOCK_FIRMS } from "@/lib/data/firms";
import { MOCK_ADVISORS } from "@/lib/data/advisors";
import Link from "next/link";

export default function SearchPage() {
  const [q, setQ] = useState("");

  const firmResults = q.length > 1
    ? MOCK_FIRMS.filter(f => f.name.toLowerCase().includes(q.toLowerCase())).slice(0, 8)
    : [];

  const advisorResults = q.length > 1
    ? MOCK_ADVISORS.filter(a => a.name.toLowerCase().includes(q.toLowerCase())).slice(0, 8)
    : [];

  return (
    <div style={{ padding: 32, maxWidth: 800, margin: "0 auto" }}>
      <h1 style={{ fontSize: 22, fontWeight: 600, color: "var(--text-1)", marginBottom: 24 }}>Search</h1>

      <div style={{
        display: "flex", alignItems: "center", gap: 10,
        background: "white", border: "1px solid var(--border)",
        borderRadius: 10, padding: "10px 16px", marginBottom: 28,
        boxShadow: "0 1px 6px rgba(0,0,0,0.05)",
      }}>
        <Search size={16} color="var(--text-4)" />
        <input
          value={q}
          onChange={e => setQ(e.target.value)}
          placeholder="Search firms or advisors by name or CRD…"
          autoFocus
          style={{
            flex: 1, border: "none", outline: "none",
            fontSize: 15, color: "var(--text-1)", background: "transparent",
          }}
        />
      </div>

      {q.length > 1 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {firmResults.length > 0 && (
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-3)", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                Firms ({firmResults.length})
              </div>
              <div style={{ background: "white", borderRadius: 10, border: "1px solid var(--border)", overflow: "hidden" }}>
                {firmResults.map((firm, i) => (
                  <Link key={firm.id} href="/firm/aurora-wealth" style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "12px 16px", textDecoration: "none",
                    borderBottom: i < firmResults.length - 1 ? "1px solid var(--surface-3)" : "none",
                    background: "white", transition: "background 0.1s",
                  }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "var(--surface-2)"}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "white"}
                  >
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 500, color: "var(--text-1)" }}>{firm.name}</div>
                      <div style={{ fontSize: 12, color: "var(--text-3)", marginTop: 2 }}>{firm.location} · AUM: ${firm.totalAUM}B</div>
                    </div>
                    <span style={{
                      fontSize: 12, fontWeight: 600,
                      color: firm.acquisitionScore >= 70 ? "#16A34A" : firm.acquisitionScore >= 50 ? "#D97706" : "#DC2626",
                    }}>
                      Score: {firm.acquisitionScore}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {advisorResults.length > 0 && (
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-3)", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                Advisors ({advisorResults.length})
              </div>
              <div style={{ background: "white", borderRadius: 10, border: "1px solid var(--border)", overflow: "hidden" }}>
                {advisorResults.map((a, i) => (
                  <Link key={a.id} href="/advisors" style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "12px 16px", textDecoration: "none",
                    borderBottom: i < advisorResults.length - 1 ? "1px solid var(--surface-3)" : "none",
                    background: "white", transition: "background 0.1s",
                  }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "var(--surface-2)"}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "white"}
                  >
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 500, color: "var(--text-1)" }}>{a.name}</div>
                      <div style={{ fontSize: 12, color: "var(--text-3)", marginTop: 2 }}>{a.firm} · CRD: {a.crd}</div>
                    </div>
                    <span style={{ fontSize: 12, color: "var(--text-3)" }}>{a.location}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {firmResults.length === 0 && advisorResults.length === 0 && (
            <div style={{ textAlign: "center", padding: "48px 0", color: "var(--text-4)", fontSize: 14 }}>
              No results found for "{q}"
            </div>
          )}
        </div>
      )}

      {q.length <= 1 && (
        <div style={{ textAlign: "center", padding: "48px 0" }}>
          <Search size={40} color="var(--text-4)" style={{ margin: "0 auto 12px", display: "block" }} />
          <p style={{ fontSize: 14, color: "var(--text-4)" }}>Start typing to search firms and advisors</p>
        </div>
      )}
    </div>
  );
}
