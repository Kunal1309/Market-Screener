"use client";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import type { AUMSegment } from "@/types";

interface Props { data: AUMSegment[] }

export default function AUMDonutChart({ data }: Props) {
  return (
    <div style={{ width: "100%", height: 220 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={100}
            paddingAngle={2}
            dataKey="percentage"
          >
            {data.map((seg, i) => (
              <Cell key={i} fill={seg.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(val: any, name: any) => [`${val}%`, name]}
            contentStyle={{
              fontSize: 12, borderRadius: 8,
              border: "1px solid var(--border)",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
