"use client";
import { getScoreColor, getScoreLabel } from "@/lib/utils";

interface Props {
  score: number;
  change: number;
}

export default function AcquisitionGauge({ score, change }: Props) {
  const color = getScoreColor(score);
  const label = getScoreLabel(score);

  const angle = -90 + (score / 100) * 180;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const cx = 100, cy = 100, r = 75;
  const needleX = cx + r * Math.cos(toRad(angle));
  const needleY = cy + r * Math.sin(toRad(angle));

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ position: "relative", width: 200, height: 110 }}>
        <svg width="200" height="110" viewBox="0 0 200 110">
          {/* Background arc */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none" stroke="#F3F4F6" strokeWidth="16"
            strokeLinecap="round"
          />
          {/* Score arc */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none" stroke={color} strokeWidth="16"
            strokeLinecap="round"
            strokeDasharray={`${(score / 100) * 251.2} 251.2`}
            opacity={0.9}
          />
          {/* Needle */}
          <line
            x1={cx} y1={cy}
            x2={needleX} y2={needleY}
            stroke="#374151" strokeWidth="2.5"
            strokeLinecap="round"
          />
          <circle cx={cx} cy={cy} r={4} fill="#374151" />
        </svg>
        {/* Score number */}
        <div style={{
          position: "absolute", bottom: 0, left: "50%",
          transform: "translateX(-50%)",
          textAlign: "center",
        }}>
          <div style={{ fontSize: 32, fontWeight: 700, color: "var(--text-1)", lineHeight: 1 }}>
            {score}
          </div>
        </div>
      </div>

      {/* Change */}
      <div style={{ marginTop: 4, fontSize: 13, color: "var(--text-3)", textAlign: "center" }}>
        <span style={{ color: change >= 0 ? "#16A34A" : "#DC2626", fontWeight: 500 }}>
          {change >= 0 ? "↑" : "↓"} {Math.abs(change)}%
        </span>{" "}
        since last year
      </div>

      {/* Label */}
      <span style={{
        marginTop: 12, fontSize: 11, fontWeight: 700,
        color, letterSpacing: "0.06em",
      }}>
        {label}
      </span>
    </div>
  );
}
