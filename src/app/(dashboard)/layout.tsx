import AppShell from "@/components/layout/AppShell";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flex: 1 }}>
      <AppShell>{children}</AppShell>
    </div>
  );
}
