import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatAUM(value: number): string {
  if (value >= 1000) return `$${(value / 1000).toFixed(1)}T`;
  if (value >= 1)    return `$${value.toFixed(2)}B`;
  return `$${(value * 1000).toFixed(0)}M`;
}

export function getScoreColor(score: number): string {
  if (score >= 70) return "#16A34A";
  if (score >= 50) return "#D97706";
  return "#DC2626";
}

export function getScoreLabel(score: number): "HIGH" | "MODERATE" | "LOW" {
  if (score >= 70) return "HIGH";
  if (score >= 50) return "MODERATE";
  return "LOW";
}

export function getComplianceStyle(c: string): { color: string } {
  if (c === "Complaint")  return { color: "#D97706" };
  if (c === "Judgement")  return { color: "#DC2626" };
  return { color: "#16A34A" };
}

export function truncate(s: string, max: number): string {
  return s.length > max ? s.slice(0, max) + "…" : s;
}
