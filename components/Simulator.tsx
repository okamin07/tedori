"use client";

import { useMemo, useState } from "react";
import {
  alternateFiling,
  calcFreelance,
  calcSide,
  estimateSocialInsurance,
  FILING_LABELS,
  TAX_YEAR_LABEL,
  type FilingType,
} from "@/lib/tax";
import { PRESETS, type Mode } from "@/lib/presets";
import { insightForFreelance, insightForSide } from "@/lib/insights";
import {
  freelanceCompareLines,
  recommendStars,
  sideCompareLines,
  taxTotalFreelance,
  taxTotalSide,
} from "@/lib/scenario-stats";
import { SummaryHero } from "./SummaryHero";
import {
  ScenarioCompareRow,
  buildFreelanceCard,
  buildSideCard,
} from "./ScenarioCompareRow";
import { BreakdownCompareBars } from "./BreakdownCompareBars";
import { DeltaTableWireframe } from "./DeltaTableWireframe";
import { ContextualCta } from "./ContextualCta";

export function Simulator() {
  const [mode, setMode] = useState<Mode>("freelance");
  const [activePreset, setActivePreset] = useState<string | null>("freelance-500");

  const [revenue, setRevenue] = useState(5_000_000);
  const [expenses, setExpenses] = useState(1_000_000);
  const [filing, setFiling] = useState<FilingType>("blue65");
  const [autoSocial, setAutoSocial] = useState(true);
  const [manualSocial, setManualSocial] = useState(600_000);
  const [other, setOther] = useState(0);
  const [enterprise, setEnterprise] = useState(false);

  const [salary, setSalary] = useState(5_000_000);
  const [sideRev, setSideRev] = useState(300_000);
  const [sideExp, setSideExp] = useState(30_000);
  const [sideFiling, setSideFiling] = useState<FilingType>("white");

  function applyPreset(id: string) {
    const p = PRESETS.find((x) => x.id === id);
    if (!p) return;
    setActivePreset(id);
    setMode(p.mode);
    if (p.freelance) {
      setRevenue(p.freelance.revenue);
      setExpenses(p.freelance.expenses);
      setFiling(p.freelance.filing);
      setOther(p.freelance.otherDeductions);
      setEnterprise(p.freelance.applyEnterpriseTax);
    }
    if (p.side) {
      setSalary(p.side.salaryGross);
      setSideRev(p.side.sideRevenue);
      setSideExp(p.side.sideExpenses);
      setSideFiling(p.side.filing);
    }
  }

  const autoEstimate = useMemo(
    () => estimateSocialInsurance(Math.max(0, revenue - expenses)),
    [revenue, expenses]
  );
  const social = autoSocial ? autoEstimate : manualSocial;

  const freelanceInput = useMemo(
    () => ({
      revenue,
      expenses,
      filing,
      socialInsurance: social,
      otherDeductions: other,
      applyEnterpriseTax: enterprise,
    }),
    [revenue, expenses, filing, social, other, enterprise]
  );

  const sideInput = useMemo(
    () => ({
      salaryGross: salary,
      sideRevenue: sideRev,
      sideExpenses: sideExp,
      filing: sideFiling,
    }),
    [salary, sideRev, sideExp, sideFiling]
  );

  const currentResult = useMemo(
    () => (mode === "freelance" ? calcFreelance(freelanceInput) : calcSide(sideInput)),
    [mode, freelanceInput, sideInput]
  );

  const altMeta = useMemo(
    () => alternateFiling(mode === "freelance" ? filing : sideFiling),
    [mode, filing, sideFiling]
  );

  const altResult = useMemo(() => {
    if (mode === "freelance") {
      return calcFreelance({ ...freelanceInput, filing: altMeta.filing });
    }
    return calcSide({ ...sideInput, filing: altMeta.filing });
  }, [mode, freelanceInput, sideInput, altMeta.filing]);

  const currentLabel =
    mode === "freelance" ? FILING_LABELS[filing] : FILING_LABELS[sideFiling];

  const takeHome =
    mode === "freelance"
      ? (currentResult as ReturnType<typeof calcFreelance>).takeHome
      : (currentResult as ReturnType<typeof calcSide>).sideTakeHome;
  const altTakeHome =
    mode === "freelance"
      ? (altResult as ReturnType<typeof calcFreelance>).takeHome
      : (altResult as ReturnType<typeof calcSide>).sideTakeHome;
  const diff = takeHome - altTakeHome;

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
        current: buildFreelanceCard(
          "現在",
          "current",
          currentLabel,
          c.takeHome,
          c.effectiveRate,
          taxTotalFreelance(c),
          c.socialInsurance
        ),
        alternate: buildFreelanceCard(
          "もしも",
          "alt",
          altMeta.label,
          a.takeHome,
          a.effectiveRate,
          taxTotalFreelance(a),
          a.socialInsurance
        ),
      };
    }
    const c = currentResult as ReturnType<typeof calcSide>;
    const a = altResult as ReturnType<typeof calcSide>;
    const base = Math.max(0, sideRev - sideExp);
    return {
      current: buildSideCard(
        "現在",
        "current",
        currentLabel,
        c.sideTakeHome,
        base > 0 ? c.totalTaxIncrease / base : 0,
        taxTotalSide(c),
        c.marginalRate
      ),
      alternate: buildSideCard(
        "もしも",
        "alt",
        altMeta.label,
        a.sideTakeHome,
        base > 0 ? a.totalTaxIncrease / base : 0,
        taxTotalSide(a),
        a.marginalRate
      ),
    };
  }, [mode, currentResult, altResult, currentLabel, altMeta.label, sideRev, sideExp]);

  const insight = useMemo(() => {
    if (mode === "freelance") {
      return insightForFreelance(
        currentResult as ReturnType<typeof calcFreelance>,
        altTakeHome,
        altMeta.label
      );
    }
    return insightForSide(
      currentResult as ReturnType<typeof calcSide>,
      altTakeHome,
      altMeta.label
    );
  }, [mode, currentResult, altTakeHome, altMeta.label]);

  const modePresets = PRESETS.filter((p) => p.mode === mode);

  return (
    <div id="simulator" className="scroll-mt-16 space-y-5">
      {/* タイトル行 */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-[13px] text-muted">{TAX_YEAR_LABEL}</p>
          <h1 className="mt-1 text-[1.625rem] font-bold leading-snug text-ink sm:text-[1.875rem]">
            2つのシナリオを、並べて比較
          </h1>
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
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
        <div className="seg-track shrink-0 self-start">
          <button
            type="button"
            className="seg-btn"
            data-active={mode === "side"}
            onClick={() => {
              setMode("side");
              setActivePreset(null);
            }}
          >
            副業
          </button>
          <button
            type="button"
            className="seg-btn"
            data-active={mode === "freelance"}
            onClick={() => {
              setMode("freelance");
              setActivePreset(null);
            }}
          >
            独立
          </button>
        </div>
      </div>

      {/* サマリーヒーロー */}
      <SummaryHero
        diff={diff}
        advantageLabel={advantageLabel}
        monthlyDiff={Math.round(diff / 12)}
        stars={recommendStars(Math.abs(diff))}
      />

      {/* 2カード比較 */}
      <ScenarioCompareRow current={scenarioCards.current} alternate={scenarioCards.alternate} />

      {/* 内訳バー比較 */}
      <BreakdownCompareBars
        items={compareLines}
        currentLabel={currentLabel}
        altLabel={altMeta.label}
      />

      {/* 差分表 */}
      <DeltaTableWireframe
        items={compareLines}
        currentLabel={currentLabel}
        altLabel={altMeta.label}
      />

      {/* 条件編集（折りたたみ） */}
      <details className="details-panel wf-card group">
        <summary className="flex items-center justify-between px-5 py-4 sm:px-6">
          <span className="text-[14px] font-bold text-ink">試算条件を編集</span>
          <span className="text-[12px] font-medium text-brand group-open:hidden">開く</span>
          <span className="hidden text-[12px] font-medium text-muted group-open:inline">閉じる</span>
        </summary>
        <div className="border-t border-line px-5 pb-5 sm:px-6">
          {mode === "freelance" ? (
            <>
              <MoneyField label="年間売上" value={revenue} onChange={(v) => { setRevenue(v); setActivePreset(null); }} />
              <MoneyField label="年間経費" value={expenses} onChange={(v) => { setExpenses(v); setActivePreset(null); }} max={revenue} />
              <SelectField label="申告区分" value={filing} onChange={(v) => { setFiling(v as FilingType); setActivePreset(null); }} />
              <div className="field-row">
                <div>
                  <p className="text-[14px] font-medium text-ink">社会保険料</p>
                  <label className="mt-1 flex cursor-pointer items-center gap-2 text-[12px] text-muted">
                    <input type="checkbox" checked={autoSocial} onChange={(e) => setAutoSocial(e.target.checked)} className="accent-brand" />
                    概算
                  </label>
                </div>
                {autoSocial ? (
                  <p className="num text-lg font-bold">{autoEstimate.toLocaleString("ja-JP")}円</p>
                ) : (
                  <NumberInput value={manualSocial} onChange={setManualSocial} />
                )}
              </div>
              <MoneyField label="その他控除" value={other} onChange={setOther} />
            </>
          ) : (
            <>
              <MoneyField label="本業・額面年収" value={salary} onChange={(v) => { setSalary(v); setActivePreset(null); }} />
              <MoneyField label="副業・売上" value={sideRev} onChange={(v) => { setSideRev(v); setActivePreset(null); }} />
              <MoneyField label="副業・経費" value={sideExp} onChange={(v) => { setSideExp(v); setActivePreset(null); }} max={sideRev} />
              <SelectField label="申告区分" value={sideFiling} onChange={(v) => { setSideFiling(v as FilingType); setActivePreset(null); }} />
            </>
          )}
        </div>
      </details>

      <ContextualCta {...insight} />
    </div>
  );
}

function MoneyField({
  label,
  value,
  onChange,
  max = 50_000_000,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
  max?: number;
}) {
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

function NumberInput({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  return (
    <input
      type="number"
      value={value}
      step={10000}
      min={0}
      onChange={(e) => onChange(Math.max(0, Number(e.target.value)))}
      className="input-field num"
    />
  );
}

function SelectField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="field-row">
      <label className="text-[14px] font-medium text-ink">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="max-w-[58%] rounded-lg border border-line-strong bg-bg px-3 py-2 text-[13px] font-medium outline-none focus:border-brand"
      >
        {Object.entries(FILING_LABELS).map(([k, v]) => (
          <option key={k} value={k}>
            {v}
          </option>
        ))}
      </select>
    </div>
  );
}
