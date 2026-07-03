/** レーダーチャート用：2シナリオの指標を0–100に正規化 */
export interface ScenarioMetrics {
  label: string;
  takeHome: number;
  totalOutflow: number; // 税金+社保
  effectiveRate: number;
  marginalRate: number;
  deductionBenefit: number; // 青色控除等
  grossBase: number;
}

export interface RadarAxis {
  key: string;
  label: string;
  current: number;
  alternate: number;
}

function clamp(n: number) {
  return Math.max(0, Math.min(100, n));
}

/** 高いほど良い指標として0–100化 */
export function buildRadarAxes(
  current: ScenarioMetrics,
  alternate: ScenarioMetrics
): RadarAxis[] {
  const maxTake = Math.max(current.takeHome, alternate.takeHome, 1);
  const maxDed = Math.max(current.deductionBenefit, alternate.deductionBenefit, 1);

  const takeHomeScore = (m: ScenarioMetrics) =>
    clamp((m.takeHome / maxTake) * 100);

  const retentionScore = (m: ScenarioMetrics) =>
    m.grossBase > 0 ? clamp((m.takeHome / m.grossBase) * 100) : 0;

  const taxLightScore = (m: ScenarioMetrics) =>
    clamp((1 - m.effectiveRate) * 100);

  const marginalScore = (m: ScenarioMetrics) =>
    clamp((1 - m.marginalRate) * 100);

  const deductionScore = (m: ScenarioMetrics) =>
    clamp((m.deductionBenefit / maxDed) * 100);

  const defs: { key: string; label: string; score: (m: ScenarioMetrics) => number }[] = [
    { key: "take", label: "手取り額", score: takeHomeScore },
    { key: "retention", label: "手取り率", score: retentionScore },
    { key: "tax", label: "税負担の軽さ", score: taxLightScore },
    { key: "marginal", label: "限界税率", score: marginalScore },
    { key: "deduction", label: "控除活用", score: deductionScore },
  ];

  return defs.map((d) => ({
    key: d.key,
    label: d.label,
    current: d.score(current),
    alternate: d.score(alternate),
  }));
}

export interface DeltaRow {
  label: string;
  current: number;
  alternate: number;
  diff: number;
  /** true = 低いほど良い（税金等） */
  lowerIsBetter?: boolean;
}

export function deltaRows(
  rows: { label: string; current: number; alternate: number; lowerIsBetter?: boolean }[]
): DeltaRow[] {
  return rows.map((r) => ({
    ...r,
    diff: r.current - r.alternate,
  }));
}
