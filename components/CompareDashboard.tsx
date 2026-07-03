"use client";

import Link from "next/link";
import { useMemo } from "react";
import {
  FILING_LABELS,
  TAX_YEAR_LABEL,
  type FilingType,
  type calcFreelance,
  type calcSide,
} from "@/lib/tax";
import { yen } from "@/lib/format";
import { PRESETS } from "@/lib/presets";
import { ARTICLES } from "@/lib/articles";
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
    altTakeHome,
    diff,
  } = sim;

  const advantageLabel =
    diff > 0
      ? `${currentLabel}の方が有利です`
      : diff < 0
        ? `${altMeta.label}の方が有利です`
        : "差はほとんどありません";

  const inputSummary =
    mode === "freelance"
      ? `売上 ${yen(sim.revenue)} / 経費 ${yen(sim.expenses)} / ${FILING_LABELS[sim.filing]}`
      : `本業 ${yen(sim.salary)} / 副業売上 ${yen(sim.sideRev)} / 経費 ${yen(sim.sideExp)} / ${FILING_LABELS[sim.sideFiling]}`;

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
  const featuredArticles = ARTICLES.slice(0, 4);

  return (
    <div id="tool" className="page-pad mx-auto max-w-[960px] space-y-5 scroll-mt-14">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-[13px] text-muted">{TAX_YEAR_LABEL}</p>
          <h1 className="page-title">副業・フリーランスの手取り比較</h1>
        </div>
        <div className="seg-track shrink-0 self-start">
          <button type="button" className="seg-btn" data-active={mode === "side"} onClick={() => { setMode("side"); clearPreset(); }}>
            副業
          </button>
          <button type="button" className="seg-btn" data-active={mode === "freelance"} onClick={() => { setMode("freelance"); clearPreset(); }}>
            独立
          </button>
        </div>
      </div>

      <section id="inputs" className="wf-card scroll-mt-20">
        <div className="border-b border-line px-5 py-4 sm:px-6">
          <h2 className="text-[15px] font-bold text-ink">試算条件を入力</h2>
          <p className="mt-1 text-[13px] text-ink-2">
            {mode === "side"
              ? "本業の年収と副業の売上・経費を入れてください。"
              : "独立（個人事業）の売上・経費・申告区分を入れてください。"}
          </p>
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
        <div className="px-5 py-2 sm:px-6">
          {mode === "freelance" ? (
            <>
              <Field label="年間売上" value={sim.revenue} onChange={(v) => { sim.setRevenue(v); clearPreset(); }} />
              <Field label="年間経費" value={sim.expenses} onChange={(v) => { sim.setExpenses(v); clearPreset(); }} max={sim.revenue} />
              <Select label="申告区分" value={sim.filing} onChange={(v) => { sim.setFiling(v as FilingType); clearPreset(); }} />
              <div className="field-row">
                <div>
                  <p className="text-[14px] font-medium text-ink">社会保険料</p>
                  <label className="mt-1 flex items-center gap-2 text-[12px] text-muted">
                    <input type="checkbox" checked={sim.autoSocial} onChange={(e) => sim.setAutoSocial(e.target.checked)} className="accent-brand" />
                    概算
                  </label>
                </div>
                <p className="num text-lg font-bold">{yen(sim.social)}</p>
              </div>
              <Field label="その他控除" value={sim.other} onChange={sim.setOther} />
            </>
          ) : (
            <>
              <Field label="本業・額面年収" value={sim.salary} onChange={(v) => { sim.setSalary(v); clearPreset(); }} />
              <Field label="副業・売上" value={sim.sideRev} onChange={(v) => { sim.setSideRev(v); clearPreset(); }} />
              <Field label="副業・経費" value={sim.sideExp} onChange={(v) => { sim.setSideExp(v); clearPreset(); }} max={sim.sideRev} />
              <Select label="申告区分" value={sim.sideFiling} onChange={(v) => { sim.setSideFiling(v as FilingType); clearPreset(); }} />
            </>
          )}
        </div>
      </section>

      <div className="flex items-center justify-between gap-3">
        <h2 className="text-[15px] font-bold text-ink">比較結果</h2>
        <p className="text-[12px] text-muted">{inputSummary}</p>
      </div>

      <SummaryHero diff={diff} advantageLabel={advantageLabel} monthlyDiff={Math.round(diff / 12)} stars={recommendStars(Math.abs(diff))} />
      <ScenarioCompareRow current={scenarioCards.current} alternate={scenarioCards.alternate} />
      <BreakdownCompareBars items={compareLines} currentLabel={currentLabel} altLabel={altMeta.label} />
      <DeltaTableWireframe items={compareLines} currentLabel={currentLabel} altLabel={altMeta.label} />

      <ContextualCta {...insight} />

      <section className="wf-card p-5 sm:p-6">
        <h2 className="text-[15px] font-bold text-ink">税金・手取りの読みもの</h2>
        <p className="mt-2 text-[13px] leading-relaxed text-ink-2">
          確定申告、青色申告、住民税、経費の基礎から解説。検索で迷った方はこちら。
        </p>
        <ul className="mt-4 space-y-2">
          {featuredArticles.map((a) => (
            <li key={a.slug}>
              <Link href={`/media/${a.slug}`} className="text-[14px] font-medium text-brand hover:underline">
                {a.title}
              </Link>
            </li>
          ))}
        </ul>
        <Link href="/media" className="mt-4 inline-block text-[13px] font-semibold text-ink-2 hover:text-brand">
          すべての記事 →
        </Link>
      </section>
    </div>
  );
}

function Field({ label, value, onChange, max = 50_000_000 }: { label: string; value: number; onChange: (n: number) => void; max?: number }) {
  return (
    <div className="field-row">
      <label className="text-[14px] font-medium text-ink">{label}</label>
      <input
        type="text"
        inputMode="numeric"
        value={value.toLocaleString("ja-JP")}
        onChange={(e) => {
          const n = Number(e.target.value.replace(/[^\d]/g, ""));
          if (!Number.isNaN(n)) onChange(Math.min(Math.max(0, n), max));
        }}
        className="input-field num"
      />
    </div>
  );
}

function Select({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="field-row">
      <label className="text-[14px] font-medium text-ink">{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="max-w-[58%] rounded-lg border border-line-strong bg-bg px-3 py-2 text-[13px] font-medium outline-none focus:border-brand">
        {Object.entries(FILING_LABELS).map(([k, v]) => (
          <option key={k} value={k}>{v}</option>
        ))}
      </select>
    </div>
  );
}
