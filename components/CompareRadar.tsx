"use client";

import type { RadarAxis } from "@/lib/compare-metrics";

const SIZE = 280;
const CENTER = SIZE / 2;
const RADIUS = 96;
const LEVELS = 4;

function point(angle: number, r: number) {
  const rad = ((angle - 90) * Math.PI) / 180;
  return {
    x: CENTER + r * Math.cos(rad),
    y: CENTER + r * Math.sin(rad),
  };
}

function polygon(values: number[], max = 100) {
  const n = values.length;
  return values
    .map((v, i) => {
      const r = (v / max) * RADIUS;
      const { x, y } = point((360 / n) * i, r);
      return `${x},${y}`;
    })
    .join(" ");
}

export function CompareRadar({ axes }: { axes: RadarAxis[] }) {
  const n = axes.length;
  const currentValues = axes.map((a) => a.current);
  const altValues = axes.map((a) => a.alternate);

  return (
    <div className="flex flex-col items-center">
      <svg
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className="h-[220px] w-[220px] sm:h-[280px] sm:w-[280px]"
        role="img"
        aria-label="シナリオ比較レーダーチャート"
      >
        {/* グリッド */}
        {Array.from({ length: LEVELS }, (_, lv) => {
          const r = ((lv + 1) / LEVELS) * RADIUS;
          const pts = Array.from({ length: n }, (_, i) => {
            const { x, y } = point((360 / n) * i, r);
            return `${x},${y}`;
          }).join(" ");
          return (
            <polygon
              key={lv}
              points={pts}
              fill="none"
              stroke="var(--color-line-strong)"
              strokeWidth="1"
              opacity={0.6}
            />
          );
        })}
        {/* 軸線 */}
        {axes.map((_, i) => {
          const { x, y } = point((360 / n) * i, RADIUS);
          return (
            <line
              key={i}
              x1={CENTER}
              y1={CENTER}
              x2={x}
              y2={y}
              stroke="var(--color-line-strong)"
              strokeWidth="1"
            />
          );
        })}
        {/* シリーズ */}
        <polygon
          points={polygon(altValues)}
          fill="var(--color-alt)"
          fillOpacity="0.12"
          stroke="var(--color-alt)"
          strokeWidth="2"
        />
        <polygon
          points={polygon(currentValues)}
          fill="var(--color-brand)"
          fillOpacity="0.2"
          stroke="var(--color-brand)"
          strokeWidth="2.5"
        />
        {/* ラベル */}
        {axes.map((axis, i) => {
          const { x, y } = point((360 / n) * i, RADIUS + 22);
          return (
            <text
              key={axis.key}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-[var(--color-ink-2)] text-[10px] font-medium"
            >
              {axis.label}
            </text>
          );
        })}
      </svg>
      <div className="mt-2 flex gap-5 text-[12px] font-medium">
        <span className="flex items-center gap-2 text-ink">
          <span className="h-2.5 w-2.5 rounded-full bg-brand" />
          現在
        </span>
        <span className="flex items-center gap-2 text-ink-2">
          <span className="h-2.5 w-2.5 rounded-full bg-alt" />
          もしも
        </span>
      </div>
    </div>
  );
}
