import { yen } from "@/lib/format";
import { recommendStars } from "@/lib/scenario-stats";

export function SummaryHero({
  diff,
  advantageLabel,
  monthlyDiff,
  stars,
}: {
  diff: number;
  advantageLabel: string;
  monthlyDiff: number;
  stars: number;
}) {
  const positive = diff >= 0;
  const absDiff = Math.abs(diff);

  return (
    <div className="wf-card wf-card-hero">
      <div className="grid gap-6 lg:grid-cols-[1fr_auto_1fr] lg:items-center">
        <div>
          <p className="text-[13px] font-medium text-muted">年間の差額</p>
          <p
            className={`num mt-1 text-[2.75rem] font-bold leading-none sm:text-[3.25rem] ${
              positive ? "text-positive" : diff < 0 ? "text-negative" : "text-ink"
            }`}
          >
            {positive && diff > 0 ? "+" : ""}
            {yen(absDiff)}
          </p>
          <p className="mt-2 text-[14px] text-ink-2">{advantageLabel}</p>
        </div>

        <div className="hidden h-16 w-px bg-line lg:block" />

        <div className="flex flex-wrap items-center gap-8 lg:justify-end">
          <div>
            <p className="text-[12px] text-muted">月換算で</p>
            <p className="num mt-0.5 text-xl font-bold text-ink">
              {monthlyDiff >= 0 ? "+" : ""}
              {yen(Math.abs(monthlyDiff))}
            </p>
          </div>
          <div>
            <p className="text-[12px] text-muted">おすすめ度</p>
            <StarRating value={stars} />
          </div>
          <TrendMini diff={diff} />
        </div>
      </div>
    </div>
  );
}

function StarRating({ value }: { value: number }) {
  return (
    <div className="mt-1 flex gap-0.5" aria-label={`おすすめ度 ${value}/5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <svg
          key={i}
          viewBox="0 0 20 20"
          className={`h-5 w-5 ${i < value ? "text-amber-400" : "text-line-strong"}`}
          fill="currentColor"
        >
          <path d="M10 1.5l2.47 5.01 5.53.8-4 3.9.94 5.5L10 14.77l-4.94 2.94.94-5.5-4-3.9 5.53-.8L10 1.5z" />
        </svg>
      ))}
    </div>
  );
}

function TrendMini({ diff }: { diff: number }) {
  const h1 = 28;
  const h2 = 18;
  const up = diff >= 0;
  return (
    <svg viewBox="0 0 120 56" className="h-14 w-[120px]" aria-hidden>
      <rect x="8" y={56 - h2} width="14" height={h2} rx="3" fill="#E0E7FF" />
      <rect x="28" y={56 - h1} width="14" height={h1} rx="3" fill="#3B4ED8" opacity="0.35" />
      <rect x="48" y={56 - h2 - 6} width="14" height={h2 + 6} rx="3" fill="#3B4ED8" />
      <path
        d={up ? "M70 36 L92 18 L108 24" : "M70 20 L92 38 L108 32"}
        fill="none"
        stroke="#10B981"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="108" cy={up ? 24 : 32} r="4" fill="#10B981" />
    </svg>
  );
}

export { recommendStars };
