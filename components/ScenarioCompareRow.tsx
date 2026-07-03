import { yen, pct } from "@/lib/format";

export interface ScenarioCardData {
  badge: string;
  badgeVariant: "current" | "alt";
  title: string;
  amount: number;
  stats: { label: string; value: string }[];
}

export function ScenarioCompareRow({
  current,
  alternate,
}: {
  current: ScenarioCardData;
  alternate: ScenarioCardData;
}) {
  return (
    <div className="grid items-stretch gap-3 md:grid-cols-[1fr_auto_1fr]">
      <ScenarioCard data={current} />
      <div className="flex items-center justify-center py-2 md:py-0">
        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-surface shadow-sm">
          <svg viewBox="0 0 24 24" className="h-5 w-5 text-brand" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h12M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
      <ScenarioCard data={alternate} />
    </div>
  );
}

function ScenarioCard({ data }: { data: ScenarioCardData }) {
  const isCurrent = data.badgeVariant === "current";
  return (
    <div className="wf-card flex flex-col p-5 sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <span
          className={`rounded-md px-2 py-0.5 text-[11px] font-bold ${
            isCurrent ? "bg-brand text-white" : "bg-alt-soft text-alt"
          }`}
        >
          {data.badge}
        </span>
        <DocIcon variant={data.badgeVariant} />
      </div>
      <p className="mt-4 text-[14px] font-semibold text-ink">{data.title}</p>
      <p className="num mt-2 text-[1.75rem] font-bold leading-tight text-ink sm:text-[2rem]">
        {yen(data.amount)}
      </p>
      <div className="mt-5 grid grid-cols-3 gap-2">
        {data.stats.map((s) => (
          <div key={s.label} className="rounded-lg border border-line bg-bg px-2 py-2.5 text-center">
            <p className="text-[10px] font-medium text-muted">{s.label}</p>
            <p className="num mt-1 text-[12px] font-bold text-ink sm:text-[13px]">{s.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function DocIcon({ variant }: { variant: "current" | "alt" }) {
  const fill = variant === "current" ? "#3B4ED8" : "#93C5FD";
  return (
    <svg viewBox="0 0 32 32" className="h-8 w-8 shrink-0" aria-hidden>
      <rect x="6" y="4" width="20" height="24" rx="3" fill={fill} opacity={variant === "current" ? 1 : 0.7} />
      <rect x="10" y="10" width="12" height="2" rx="1" fill="#fff" opacity="0.9" />
      <rect x="10" y="15" width="9" height="2" rx="1" fill="#fff" opacity="0.7" />
      <rect x="10" y="20" width="11" height="2" rx="1" fill="#fff" opacity="0.7" />
    </svg>
  );
}

export function buildFreelanceCard(
  badge: string,
  badgeVariant: "current" | "alt",
  title: string,
  takeHome: number,
  effectiveRate: number,
  tax: number,
  social: number
): ScenarioCardData {
  return {
    badge,
    badgeVariant,
    title,
    amount: takeHome,
    stats: [
      { label: "実効税率", value: pct(effectiveRate) },
      { label: "税金", value: yen(tax) },
      { label: "社会保険料", value: yen(social) },
    ],
  };
}

export function buildSideCard(
  badge: string,
  badgeVariant: "current" | "alt",
  title: string,
  takeHome: number,
  effectiveRate: number,
  tax: number,
  marginalRate: number
): ScenarioCardData {
  return {
    badge,
    badgeVariant,
    title,
    amount: takeHome,
    stats: [
      { label: "実効負担", value: pct(effectiveRate) },
      { label: "増税", value: yen(tax) },
      { label: "限界税率", value: pct(marginalRate, 0) },
    ],
  };
}
