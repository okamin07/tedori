"use client";

import Link from "next/link";
import { useMemo } from "react";
import { TAX_YEAR_LABEL } from "@/lib/tax";
import { PRESETS } from "@/lib/presets";
import { insightForFreelance, insightForSide } from "@/lib/insights";
import {
  freelanceCompareLines,
  recommendStars,
  sideCompareLines,
  taxTotalFreelance,
  taxTotalSide,
} from "@/lib/scenario-stats";
import { useSimulator } from "@/lib/simulator-context";
import { SummaryHero } from "./SummaryHero";
import {
  ScenarioCompareRow,
  buildFreelanceCard,
  buildSideCard,
} from "./ScenarioCompareRow";
import { BreakdownCompareBars } from "./BreakdownCompareBars";
import { DeltaTableWireframe } from "./DeltaTableWireframe";
import { ContextualCta } from "./ContextualCta";
import type { calcFreelance, calcSide } from "@/lib/tax";

export function CompareDashboard() {
  const sim = useSimulator();
  const {
    mode,
    setMode,
    activePreset,
    applyPreset,
    clearPreset,
    currentResult,
    altResult,
    altMeta,
    currentLabel,
    takeHome,
    altTakeHome,
    diff,
  } = sim;

  const advantageLabel =
    diff > 0
      ? `${currentLabel}の方が有利です`
      : diff < 0
        ? `${altMeta.label}の方が有利です`
        : "差はほとんどありません";

  const compareLines = useMemo(() => {
    if (mode === "freelance") {
      return freelanceCompareLines(
        currentResult as ReturnType<typeof calcFreelance>,
        altResult as ReturnType<typeof calcFreelance>
      );
    }
    return sideCompareLines(
      currentResult as ReturnType<typeof calcSide>,
      altResult as ReturnType<typeof calcSide>
    );
  }, [mode, currentResult, altResult]);

  const scenarioCards = useMemo(() => {
    if (mode === "freelance") {
      const c = currentResult as ReturnType<typeof calcFreelance>;
      const a = altResult as ReturnType<typeof calcFreelance>;
      return {
        current: buildFreelanceCard("現在", "current", currentLabel, c.takeHome, c.effectiveRate, taxTotalFreelance(c), c.socialInsurance),
        alternate: buildFreelanceCard("もしも", "alt", altMeta.label, a.takeHome, a.effectiveRate, taxTotalFreelance(a), a.socialInsurance),
      };
    }
    const c = currentResult as ReturnType<typeof calcSide>;
    const a = altResult as ReturnType<typeof calcSide>;
    const base = Math.max(0, sim.sideRev - sim.sideExp);
    return {
      current: buildSideCard("現在", "current", currentLabel, c.sideTakeHome, base > 0 ? c.totalTaxIncrease / base : 0, taxTotalSide(c), c.marginalRate),
      alternate: buildSideCard("もしも", "alt", altMeta.label, a.sideTakeHome, base > 0 ? a.totalTaxIncrease / base : 0, taxTotalSide(a), a.marginalRate),
    };
  }, [mode, currentResult, altResult, currentLabel, altMeta.label, sim.sideRev, sim.sideExp]);

  const insight = useMemo(() => {
    if (mode === "freelance") {
      return insightForFreelance(currentResult as ReturnType<typeof calcFreelance>, altTakeHome, altMeta.label);
    }
    return insightForSide(currentResult as ReturnType<typeof calcSide>, altTakeHome, altMeta.label);
  }, [mode, currentResult, altTakeHome, altMeta.label]);

  const modePresets = PRESETS.filter((p) => p.mode === mode);

  return (
    <div className="page-pad mx-auto max-w-[960px] space-y-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-[13px] text-muted">{TAX_YEAR_LABEL}</p>
          <h1 className="page-title">2つのシナリオを、並べて比較</h1>
          <div className="mt-3 flex flex-wrap gap-2">
            {modePresets.map((p) => (
              <button
                key={p.id}
                type="button"
                className="chip"
                data-active={activePreset === p.id}
                onClick={() => applyPreset(p.id)}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="seg-track">
            <button type="button" className="seg-btn" data-active={mode === "side"} onClick={() => { setMode("side"); clearPreset(); }}>
              副業
            </button>
            <button type="button" className="seg-btn" data-active={mode === "freelance"} onClick={() => { setMode("freelance"); clearPreset(); }}>
              独立
            </button>
          </div>
          <Link href="/simulate" className="btn-primary">
            条件を編集
          </Link>
        </div>
      </div>

      <SummaryHero diff={diff} advantageLabel={advantageLabel} monthlyDiff={Math.round(diff / 12)} stars={recommendStars(Math.abs(diff))} />
      <ScenarioCompareRow current={scenarioCards.current} alternate={scenarioCards.alternate} />
      <BreakdownCompareBars items={compareLines} currentLabel={currentLabel} altLabel={altMeta.label} />
      <DeltaTableWireframe items={compareLines} currentLabel={currentLabel} altLabel={altMeta.label} />
      <ContextualCta {...insight} />
    </div>
  );
}
