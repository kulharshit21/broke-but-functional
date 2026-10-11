"use client";

import React, { memo } from "react";
import { formatINR } from "@/lib/engine";
import type { ForecastDay } from "@/lib/types";

export interface ForecastLineProps {
  forecast: ForecastDay[];
  comparison?: ForecastDay[];
  width?: number;
  height?: number;
}

/**
 * High-fidelity interactive SVG chart plotting actual historical burn
 * alongside projected balance curves and buffer floor thresholds.
 */
export const ForecastLine = memo(function ForecastLine({
  forecast,
  comparison,
  width = 600,
  height = 240,
}: ForecastLineProps) {
  const pad = 24;
  const values = [
    ...forecast.map((d) => d.balance),
    ...(comparison?.map((d) => d.balance) || []),
  ];
  const min = Math.min(0, ...values);
  const max = Math.max(10000, ...values);
  const range = Math.max(1, max - min);

  const points = (data: ForecastDay[]) =>
    data
      .map((d, i) => {
        const x = pad + (i * (width - pad * 2)) / Math.max(1, data.length - 1);
        const y = pad + ((max - d.balance) * (height - pad * 2)) / range;
        return `${x},${y}`;
      })
      .join(" ");

  const dangerY = pad + ((max - 750) * (height - pad * 2)) / range;

  return (
    <div className="chart-wrap">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label={`Cashflow forecast ending at ${formatINR((comparison || forecast).at(-1)?.balance || 0)}`}
      >
        <defs>
          <linearGradient id="area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#0e5b3a" stopOpacity=".2" />
            <stop offset="1" stopColor="#0e5b3a" stopOpacity="0" />
          </linearGradient>
        </defs>
        <line
          x1={pad}
          x2={width - pad}
          y1={dangerY}
          y2={dangerY}
          className="threshold"
        />
        <text x={pad + 4} y={Math.max(12, dangerY - 7)} className="chart-label">
          ₹750 BUFFER
        </text>
        <polyline className="baseline" points={points(forecast)} />
        {comparison && (
          <polyline className="comparison" points={points(comparison)} />
        )}
        {forecast.map((d, i) => (
          <circle
            key={d.day}
            cx={
              pad + (i * (width - pad * 2)) / Math.max(1, forecast.length - 1)
            }
            cy={pad + ((max - d.balance) * (height - pad * 2)) / range}
            r={d.events.length ? 3 : 1.3}
            className={d.isDanger ? "danger-dot" : "event-dot"}
          >
            <title>{`Day ${d.day}: ${formatINR(d.balance)} ${d.events.join(", ")}`}</title>
          </circle>
        ))}
      </svg>
      <div className="chart-axis">
        <span>DAY {forecast[0]?.day}</span>
        <span>DAY {forecast.at(-1)?.day}</span>
      </div>
    </div>
  );
});
