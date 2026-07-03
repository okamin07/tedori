import { yen } from "@/lib/format";
import type { CompareLineItem } from "@/lib/scenario-stats";

export function BreakdownCompareBars({
  items,
  currentLabel,
  altLabel,
}: {
  items: CompareLineItem[];
  currentLabel: string;
  altLabel: string;
}) {
  return (
    <div className="wf-card p-5 sm:p-6">
      <h2 className="text-[15px] font-bold text-ink">内訳の比較（年間）</h2>
      <div className="mt-4 flex flex-wrap gap-4 text-[12px] text-ink-2">
        <span className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-brand" />
          現在：{currentLabel}
        </span>
        <span className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-alt-bar" />
          もしも：{altLabel}
        </span>
      </div>
      <div className="mt-6 space-y-6">
        {items.map((item) => (
          <CompareBarRow key={item.label} item={item} />
        ))}
      </div>
    </div>
  );
}

function CompareBarRow({ item }: { item: CompareLineItem }) {
  const max = Math.max(item.current, item.alternate, 1);
  const diff = item.current - item.alternate;
  const good =
    item.lowerIsBetter !== undefined
      ? item.lowerIsBetter
        ? diff < 0
        : diff > 0
      : diff > 0;
  const bad =
    item.lowerIsBetter !== undefined
      ? item.lowerIsBetter
        ? diff > 0
        : diff < 0
      : diff < 0;

  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between gap-4">
        <span className="text-[13px] font-semibold text-ink">{item.label}</span>
        <span
          className={`num text-[13px] font-bold ${
            good ? "text-positive" : bad ? "text-negative" : "text-muted"
          }`}
        >
          {diff === 0 ? "±0" : `${diff > 0 ? "+" : "-"}${yen(Math.abs(diff))}`}
        </span>
      </div>
      <div className="space-y-1.5">
        <Bar value={item.current} max={max} tone="current" amount={item.current} />
        <Bar value={item.alternate} max={max} tone="alt" amount={item.alternate} />
      </div>
    </div>
  );
}

function Bar({
  value,
  max,
  tone,
  amount,
}: {
  value: number;
  max: number;
  tone: "current" | "alt";
  amount: number;
}) {
  const pctWidth = Math.max(4, (value / max) * 100);
  return (
    <div className="flex items-center gap-3">
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-line">
        <div
          className={`h-full rounded-full transition-all ${tone === "current" ? "bg-brand" : "bg-alt-bar"}`}
          style={{ width: `${pctWidth}%` }}
        />
      </div>
      <span className="num w-24 shrink-0 text-right text-[12px] font-medium text-ink-2">
        {yen(amount)}
      </span>
    </div>
  );
}
