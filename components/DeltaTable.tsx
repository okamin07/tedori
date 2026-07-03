import { yen, pct } from "@/lib/format";
import type { DeltaRow } from "@/lib/compare-metrics";

export function DeltaTable({ rows }: { rows: DeltaRow[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[420px] text-[13px]">
        <thead>
          <tr className="border-b border-line text-left text-[11px] font-semibold uppercase tracking-wide text-muted">
            <th className="pb-3 pr-4">項目</th>
            <th className="pb-3 px-3 text-right">現在</th>
            <th className="pb-3 px-3 text-right">もしも</th>
            <th className="pb-3 pl-3 text-right">差分</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const good =
              row.lowerIsBetter !== undefined
                ? row.lowerIsBetter
                  ? row.diff < 0
                  : row.diff > 0
                : row.diff > 0;
            const bad =
              row.lowerIsBetter !== undefined
                ? row.lowerIsBetter
                  ? row.diff > 0
                  : row.diff < 0
                : row.diff < 0;

            return (
              <tr key={row.label} className="border-b border-line/80">
                <td className="py-3 pr-4 font-medium text-ink">{row.label}</td>
                <td className="num py-3 px-3 text-right text-ink-2">{formatCell(row.current, row.label)}</td>
                <td className="num py-3 px-3 text-right text-ink-2">{formatCell(row.alternate, row.label)}</td>
                <td
                  className={`num py-3 pl-3 text-right font-semibold ${
                    good ? "text-positive" : bad ? "text-negative" : "text-muted"
                  }`}
                >
                  {formatDiff(row.diff, row.label)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function isRateLabel(label: string) {
  return label.includes("率");
}

function formatCell(value: number, label: string) {
  if (isRateLabel(label)) return pct(value);
  return yen(value);
}

function formatDiff(diff: number, label: string) {
  if (isRateLabel(label)) {
    const sign = diff > 0 ? "+" : "";
    return `${sign}${(diff * 100).toFixed(1)}pt`;
  }
  if (diff === 0) return "±0";
  return (diff > 0 ? "+" : "-") + yen(Math.abs(diff));
}
