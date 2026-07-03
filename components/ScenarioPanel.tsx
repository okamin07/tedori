import { yen } from "@/lib/format";
import { BreakdownBar } from "./BreakdownBar";
import type { SideBreakdown, TaxBreakdown } from "@/lib/tax";

type Result = TaxBreakdown | SideBreakdown;

export function ScenarioPanel({
  title,
  subtitle,
  takeHome,
  takeHomeLabel,
  result,
  mode,
  gross,
  variant,
  metrics,
}: {
  title: string;
  subtitle: string;
  takeHome: number;
  takeHomeLabel: string;
  result: Result;
  mode: "freelance" | "side";
  gross: number;
  variant: "current" | "alternate";
  metrics: { label: string; value: string }[];
}) {
  const isCurrent = variant === "current";

  return (
    <div
      className={`saas-panel flex flex-1 flex-col p-5 sm:p-6 ${
        isCurrent ? "saas-panel--primary ring-2 ring-brand/30" : "saas-panel--alt"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p
            className={`text-[11px] font-bold uppercase tracking-widest ${
              isCurrent ? "text-brand" : "text-alt"
            }`}
          >
            {title}
          </p>
          <p className="mt-1 text-[14px] font-semibold text-ink">{subtitle}</p>
        </div>
        {isCurrent && (
          <span className="shrink-0 rounded-full bg-brand px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
            現在
          </span>
        )}
      </div>

      <p className="mt-5 text-[12px] font-medium text-muted">{takeHomeLabel}</p>
      <p
        className={`num mt-1 text-[2rem] font-bold leading-none sm:text-[2.35rem] ${
          isCurrent ? "text-brand" : "text-ink"
        }`}
      >
        {yen(takeHome)}
      </p>

      <div className="mt-4 grid grid-cols-2 gap-2">
        {metrics.map((m) => (
          <div key={m.label} className="rounded-lg bg-bg/80 px-3 py-2">
            <p className="text-[10px] font-medium text-muted">{m.label}</p>
            <p className="num mt-0.5 text-[13px] font-semibold text-ink">{m.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 flex-1">
        <BreakdownBar data={result} mode={mode} gross={gross} />
      </div>
    </div>
  );
}

export function DiffBadge({ diff, period = "年間" }: { diff: number; period?: string }) {
  const positive = diff > 0;
  return (
    <div
      className={`flex flex-col items-center justify-center rounded-2xl px-4 py-5 text-center ${
        positive ? "bg-positive-soft" : diff < 0 ? "bg-negative-soft" : "bg-bg"
      }`}
    >
      <p className="text-[10px] font-bold uppercase tracking-widest text-muted">{period}の差</p>
      <p
        className={`num mt-2 text-2xl font-bold sm:text-3xl ${
          positive ? "text-positive" : diff < 0 ? "text-negative" : "text-ink"
        }`}
      >
        {positive ? "+" : ""}
        {yen(diff)}
      </p>
      <p className="mt-1 text-[11px] text-ink-2">
        {positive ? "現在の方が多い" : diff < 0 ? "もしもの方が多い" : "差なし"}
      </p>
    </div>
  );
}
