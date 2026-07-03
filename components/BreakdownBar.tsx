import type { TaxBreakdown } from "@/lib/tax";
import type { SideBreakdown } from "@/lib/tax";
import { yen } from "@/lib/format";

type Breakdown = TaxBreakdown | SideBreakdown;

function segments(data: TaxBreakdown) {
  const tax =
    data.incomeTax +
    data.reconstructionTax +
    data.residentTax +
    data.enterpriseTax;
  return [
    { key: "take", label: "手取り", amount: data.takeHome, color: "var(--color-bar-home)" },
    { key: "tax", label: "税金", amount: tax, color: "var(--color-bar-tax)" },
    {
      key: "social",
      label: "社保",
      amount: data.socialInsurance,
      color: "var(--color-bar-social)",
    },
  ];
}

function sideSegments(data: SideBreakdown, gross: number) {
  return [
    {
      key: "take",
      label: "手取り",
      amount: data.sideTakeHome,
      color: "var(--color-bar-home)",
    },
    {
      key: "tax",
      label: "増税",
      amount: data.totalTaxIncrease,
      color: "var(--color-bar-tax)",
    },
  ].filter((s) => s.amount > 0 || s.key === "take");
}

export function BreakdownBar({
  data,
  mode,
  gross,
}: {
  data: Breakdown;
  mode: "freelance" | "side";
  gross: number;
}) {
  const segs =
    mode === "freelance"
      ? segments(data as TaxBreakdown)
      : sideSegments(data as SideBreakdown, gross);
  const total = Math.max(gross, segs.reduce((a, s) => a + s.amount, 0), 1);

  return (
    <div>
      <div className="breakdown-bar" role="img" aria-label="内訳">
        {segs.map((s) => (
          <div
            key={s.key}
            className="breakdown-seg"
            style={{
              flexGrow: s.amount,
              background: s.color,
              minWidth: s.amount > 0 ? "4px" : 0,
            }}
          />
        ))}
      </div>
      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-ink-2">
        {segs.map((s) => (
          <span key={s.key} className="flex items-center gap-1.5">
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{ background: s.color }}
            />
            {s.label} {yen(s.amount)}
          </span>
        ))}
      </div>
    </div>
  );
}
