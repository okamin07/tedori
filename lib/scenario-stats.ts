import type { TaxBreakdown } from "@/lib/tax";
import type { SideBreakdown } from "@/lib/tax";

export function taxTotalFreelance(r: TaxBreakdown): number {
  return r.incomeTax + r.reconstructionTax + r.residentTax + r.enterpriseTax;
}

export function taxTotalSide(r: SideBreakdown): number {
  return r.totalTaxIncrease;
}

export interface CompareLineItem {
  label: string;
  current: number;
  alternate: number;
  /** 増えるほどユーザーに不利（税金など） */
  lowerIsBetter?: boolean;
}

export function freelanceCompareLines(
  current: TaxBreakdown,
  alternate: TaxBreakdown
): CompareLineItem[] {
  return [
    { label: "手取り", current: current.takeHome, alternate: alternate.takeHome },
    {
      label: "税金",
      current: taxTotalFreelance(current),
      alternate: taxTotalFreelance(alternate),
      lowerIsBetter: true,
    },
    {
      label: "社会保険料",
      current: current.socialInsurance,
      alternate: alternate.socialInsurance,
      lowerIsBetter: true,
    },
  ];
}

export function sideCompareLines(
  current: SideBreakdown,
  alternate: SideBreakdown
): CompareLineItem[] {
  return [
    { label: "手取り", current: current.sideTakeHome, alternate: alternate.sideTakeHome },
    {
      label: "増税",
      current: current.totalTaxIncrease,
      alternate: alternate.totalTaxIncrease,
      lowerIsBetter: true,
    },
  ];
}

/** おすすめ度 1–5 */
export function recommendStars(absDiff: number): number {
  if (absDiff >= 150_000) return 5;
  if (absDiff >= 100_000) return 4;
  if (absDiff >= 50_000) return 3;
  if (absDiff >= 20_000) return 2;
  return absDiff > 0 ? 1 : 0;
}
