import { yen, pct } from "@/lib/format";
import type { CompareLineItem } from "@/lib/scenario-stats";

export function DeltaTableWireframe({
  items,
  currentLabel,
  altLabel,
}: {
  items: CompareLineItem[];
  currentLabel: string;
  altLabel: string;
}) {
  return (
    <div className="wf-card overflow-hidden">
      <div className="border-b border-line px-5 py-4 sm:px-6">
        <h2 className="text-[15px] font-bold text-ink">項目別の差分一覧（年間）</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="wf-table w-full min-w-[480px]">
          <thead>
            <tr>
              <th>項目</th>
              <th>現在（{shortLabel(currentLabel)}）</th>
              <th>もしも（{shortLabel(altLabel)}）</th>
              <th>差分</th>
            </tr>
          </thead>
          <tbody>
            {items.map((row) => {
              const diff = row.current - row.alternate;
              const good =
                row.lowerIsBetter !== undefined
                  ? row.lowerIsBetter
                    ? diff < 0
                    : diff > 0
                  : diff > 0;
              const bad =
                row.lowerIsBetter !== undefined
                  ? row.lowerIsBetter
                    ? diff > 0
                    : diff < 0
                  : diff < 0;

              return (
                <tr key={row.label}>
                  <td className="font-semibold text-ink">{row.label}</td>
                  <td className="num">{formatVal(row)}</td>
                  <td className="num">{formatVal(row, true)}</td>
                  <td
                    className={`num font-bold ${
                      good ? "text-positive" : bad ? "text-negative" : "text-muted"
                    }`}
                  >
                    {formatDiff(diff, row.label)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function shortLabel(label: string) {
  if (label.includes("青色")) return label.replace(/（.+）/, "").slice(0, 8) || label;
  return label.length > 10 ? label.slice(0, 10) : label;
}

function formatVal(row: CompareLineItem, alt = false) {
  const v = alt ? row.alternate : row.current;
  if (row.label.includes("率")) return pct(v);
  return yen(v);
}

function formatDiff(diff: number, label: string) {
  if (label.includes("率")) {
    const sign = diff > 0 ? "+" : "";
    return `${sign}${(diff * 100).toFixed(1)}pt`;
  }
  if (diff === 0) return "±0";
  return (diff > 0 ? "+" : "-") + yen(Math.abs(diff));
}
