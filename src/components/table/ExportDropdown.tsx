"use client";
import { useState, useRef, useEffect } from "react";
import { Download } from "lucide-react";
import type { Column } from "@/types";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface ExportDropdownProps {
  data: any[];
  columns: Column[];
  filename: string;
  title?: string;
}

export default function ExportDropdown({ data, columns, filename, title }: ExportDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const visibleColumns = columns.filter(c => c.visible);

  const exportCSV = () => {
    // 1. Get ordered headers
    const headers = visibleColumns.map(c => c.label);
    
    // 2. Get ordered rows
    const rows = data.map(item => {
      return visibleColumns.map(c => {
        let val = item[c.key];
        // Clean up or format specific values if necessary, generally just convert to string
        if (val === null || val === undefined) val = "";
        return `"${String(val).replace(/"/g, '""')}"`;
      });
    });

    const csvContentRows = [
      headers.map(h => `"${h.replace(/"/g, '""')}"`).join(","),
      ...rows.map(r => r.join(","))
    ];
    
    if (title) {
      csvContentRows.unshift(`"${title.replace(/"/g, '""')}"\n`);
    }

    const csvContent = csvContentRows.join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setOpen(false);
  };

  const exportPDF = () => {
    const doc = new jsPDF("landscape");
    
    const head = [visibleColumns.map(c => c.label)];
    const body = data.map(item => {
      return visibleColumns.map(c => {
        let val = item[c.key];
        if (val === null || val === undefined) return "";
        return String(val);
      });
    });

    let startY = 10;
    if (title) {
      doc.setFontSize(14);
      doc.text(title, 14, 15);
      startY = 25;
    }

    autoTable(doc, {
      startY,
      head,
      body,
      theme: "grid",
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [40, 50, 60] },
    });

    doc.save(`${filename}.pdf`);
    setOpen(false);
  };

  return (
    <div style={{ position: "relative" }} ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          display: "flex", alignItems: "center", gap: 6,
          padding: "6px 12px", border: "1px solid var(--border)",
          borderRadius: 8, background: "white", cursor: "pointer",
          fontSize: 13, color: "var(--text-2)",
        }}
      >
        <Download size={14} />
        <span className="col-hide-mobile">Export</span>
      </button>

      {open && (
        <div style={{
          position: "absolute", top: "100%", right: 0, marginTop: 4,
          background: "white", border: "1px solid var(--border)",
          borderRadius: 8, boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          zIndex: 50, minWidth: 140, padding: 4,
        }}>
          <button
            onClick={exportCSV}
            style={{
              display: "block", width: "100%", textAlign: "left",
              padding: "8px 12px", background: "none", border: "none",
              cursor: "pointer", fontSize: 13, color: "var(--text-1)",
              borderRadius: 4,
            }}
            onMouseEnter={e => e.currentTarget.style.background = "var(--surface-2)"}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
          >
            Export as CSV
          </button>
          <button
            onClick={exportPDF}
            style={{
              display: "block", width: "100%", textAlign: "left",
              padding: "8px 12px", background: "none", border: "none",
              cursor: "pointer", fontSize: 13, color: "var(--text-1)",
              borderRadius: 4,
            }}
            onMouseEnter={e => e.currentTarget.style.background = "var(--surface-2)"}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
          >
            Export as PDF
          </button>
        </div>
      )}
    </div>
  );
}
