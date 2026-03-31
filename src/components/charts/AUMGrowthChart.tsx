"use client";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, ReferenceLine,
} from "recharts";
import type { AUMDataPoint } from "@/types";

interface Props { data: AUMDataPoint[] }

export default function AUMGrowthChart({ data }: Props) {
  return (
    <div style={{ width: "100%", height: 220 }}>
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 8, right: 16, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
          <XAxis
            dataKey="year"
            tick={{ fontSize: 11, fill: "var(--text-4)" }}
            axisLine={false} tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "var(--text-4)" }}
            axisLine={false} tickLine={false}
          />
          <Tooltip
            contentStyle={{
              fontSize: 12, borderRadius: 8,
              border: "1px solid var(--border)",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            }}
            formatter={(val: any, name: any) => [
              `$${val}B`,
              name === "firmAUM" ? "Firm AUM" : "Market Average",
            ]}
          />
          <Legend
            formatter={val => val === "firmAUM" ? "Firm AUM" : "Market Average"}
            iconType="circle" iconSize={8}
            wrapperStyle={{ fontSize: 11, paddingTop: 8 }}
          />
          <Line
            type="monotone" dataKey="firmAUM"
            stroke="#4F46E5" strokeWidth={2}
            dot={{ r: 3, fill: "#4F46E5" }}
            activeDot={{ r: 5 }}
          />
          <Line
            type="monotone" dataKey="marketAverage"
            stroke="#F97316" strokeWidth={2}
            dot={{ r: 3, fill: "#F97316" }}
            activeDot={{ r: 5 }}
            strokeDasharray="4 4"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
