export default function SettingsPage() {
  return (
    <div style={{ padding: 32, maxWidth: 600, margin: "0 auto" }}>
      <h1 style={{ fontSize: 22, fontWeight: 600, color: "var(--text-1)", marginBottom: 8 }}>Settings</h1>
      <p style={{ fontSize: 14, color: "var(--text-3)", marginBottom: 32 }}>Manage your account and preferences.</p>

      {[
        { label: "Account", items: ["Profile", "Email", "Password"] },
        { label: "Preferences", items: ["Notifications", "Display", "Language"] },
        { label: "Billing", items: ["Plan", "Payment method", "Invoices"] },
      ].map(section => (
        <div key={section.label} style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>
            {section.label}
          </div>
          <div style={{ background: "white", borderRadius: 10, border: "1px solid var(--border)", overflow: "hidden" }}>
            {section.items.map((item, i) => (
              <div key={item} style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "14px 16px", fontSize: 14, color: "var(--text-2)",
                borderBottom: i < section.items.length - 1 ? "1px solid var(--surface-3)" : "none",
                cursor: "pointer",
              }}>
                {item}
                <span style={{ color: "var(--text-4)", fontSize: 18 }}>›</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
