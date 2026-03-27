"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BarChart2, Search, Users, Settings, X } from "lucide-react";

const NAV = [
  { href: "/",                icon: Home,      label: "Home"            },
  { href: "/market-insights", icon: BarChart2, label: "Market Insights" },
  { href: "/search",          icon: Search,    label: "Search"          },
  { href: "/advisors",        icon: Users,     label: "Advisors"        },
  { href: "/settings",        icon: Settings,  label: "Settings"        },
];

interface Props {
  mobileOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ mobileOpen, onClose }: Props) {
  const pathname = usePathname();

  const navItems = NAV.map(({ href, icon: Icon, label }) => {
    const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
    return (
      <Link
        key={href}
        href={href}
        title={label}
        onClick={onClose}
        style={{
          width: 36, height: 36,
          borderRadius: 8,
          display: "flex", alignItems: "center", justifyContent: "center",
          color: active ? "var(--brand)" : "var(--text-3)",
          background: active ? "var(--brand-light)" : "transparent",
          textDecoration: "none",
          transition: "all 0.12s",
          flexShrink: 0,
        }}
        onMouseEnter={e => {
          if (!active) (e.currentTarget as HTMLElement).style.background = "var(--surface-3)";
        }}
        onMouseLeave={e => {
          if (!active) (e.currentTarget as HTMLElement).style.background = "transparent";
        }}
      >
        <Icon size={18} />
      </Link>
    );
  });

  const sidebarContent = (
    <aside style={{
      width: 52,
      background: "white",
      borderRight: "1px solid var(--border)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      paddingTop: 12,
      paddingBottom: 12,
      gap: 4,
      flexShrink: 0,
      zIndex: 20,
      height: "100%",
    }}>
      <Link href="/" style={{ marginBottom: 14, textDecoration: "none" }} onClick={onClose}>
        <div style={{
          width: 32, height: 32,
          // background: "var(--brand)",
          borderRadius: 8,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <svg width="26" height="22" viewBox="0 0 26 22" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4.14894 16.2381L0 12.3095L13 0L26 12.3095L21.8511 16.2381L13 7.85714L4.14894 16.2381Z" fill="#021C36"/>
            <path d="M8.57447 20.4286L5.25532 17.2857L13 9.95238L20.7447 17.2857L17.4255 20.4286L13 16.2381L8.57447 20.4286Z" fill="#021C36"/>
            <path d="M16.0426 22H9.95745L13 19.119L16.0426 22Z" fill="#021C36"/>
          </svg>
        </div>
      </Link>
      {navItems}
    </aside>
  );

  /* ── Desktop: always visible ── */
  return (
    <>
      {/* Desktop sidebar */}
      <div className="sidebar-desktop">
        {sidebarContent}
      </div>

      {/* Mobile drawer overlay */}
      {mobileOpen && (
        <div
          onClick={onClose}
          style={{
            position: "fixed", inset: 0,
            background: "rgba(0,0,0,0.4)",
            zIndex: 200,
            animation: "fadeIn 0.15s ease",
          }}
        />
      )}

      {/* Mobile drawer */}
      <div
        className="sidebar-mobile"
        style={{
          position: "fixed", top: 0, left: 0, bottom: 0,
          zIndex: 201,
          transform: mobileOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.22s cubic-bezier(0.4,0,0.2,1)",
          width: 52,
          display: "flex",
        }}
      >
        {/* Close button overlay */}
        {mobileOpen && (
          <button
            onClick={onClose}
            style={{
              position: "absolute", top: 8, right: -36,
              width: 30, height: 30, borderRadius: "50%",
              background: "white", border: "1px solid var(--border)",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", zIndex: 202,
            }}
          >
            <X size={14} color="var(--text-3)" />
          </button>
        )}
        {sidebarContent}
      </div>
    </>
  );
}
