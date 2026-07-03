"use client";

import { useMemo, useState } from "react";
import {
  alternateFiling,
  blueDeduction,
  calcFreelance,
  calcSide,
  estimateSocialInsurance,
  FILING_LABELS,
  freelanceRevenueSteps,
  sideRevenueSteps,
  TAX_YEAR_LABEL,
  type FilingType,
} from "@/lib/tax";
import { yen, pct } from "@/lib/format";
import { PRESETS, type Mode } from "@/lib/presets";
import { insightForFreelance, insightForSide } from "@/lib/insights";
import {
  buildRadarAxes,
  deltaRows,
  type ScenarioMetrics,
} from "@/lib/compare-metrics";
import { CompareRadar } from "./CompareRadar";
import { DeltaTable } from "./DeltaTable";
import { ScenarioPanel, DiffBadge } from "./ScenarioPanel";
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

  const takeHome =
    mode === "freelance"
      ? (currentResult as ReturnType<typeof calcFreelance>).takeHome
      : (currentResult as ReturnType<typeof calcSide>).sideTakeHome;
  const altTakeHome =
    mode === "freelance"
      ? (altResult as ReturnType<typeof calcFreelance>).takeHome
      : (altResult as ReturnType<typeof calcSide>).sideTakeHome;
  const diff = takeHome - altTakeHome;

  const gross =
    mode === "freelance"
      ? (currentResult as ReturnType<typeof calcFreelance>).businessIncome
      : Math.max(0, sideRev - sideExp);

  const currentMetrics: ScenarioMetrics = useMemo(() => {
    if (mode === "freelance") {
      const r = currentResult as ReturnType<typeof calcFreelance>;
      return {
        label: FILING_LABELS[filing],
        takeHome: r.takeHome,
        totalOutflow: r.totalDeduction,
        effectiveRate: r.effectiveRate,
        marginalRate: r.marginalRate,
        deductionBenefit: blueDeduction(filing),
        grossBase: r.businessIncome,
      };
    }
    const r = currentResult as ReturnType<typeof calcSide>;
    const base = Math.max(0, sideRev - sideExp);
    return {
      label: FILING_LABELS[sideFiling],
      takeHome: r.sideTakeHome,
      totalOutflow: r.totalTaxIncrease,
      effectiveRate: base > 0 ? r.totalTaxIncrease / base : 0,
      marginalRate: r.marginalRate,
      deductionBenefit: blueDeduction(sideFiling),
      grossBase: base,
    };
  }, [mode, currentResult, filing, sideFiling, sideRev, sideExp]);

  const altMetrics: ScenarioMetrics = useMemo(() => {
    if (mode === "freelance") {
      const r = altResult as ReturnType<typeof calcFreelance>;
      return {
        label: altMeta.label,
        takeHome: r.takeHome,
        totalOutflow: r.totalDeduction,
        effectiveRate: r.effectiveRate,
        marginalRate: r.marginalRate,
        deductionBenefit: blueDeduction(altMeta.filing),
        grossBase: r.businessIncome,
      };
    }
    const r = altResult as ReturnType<typeof calcSide>;
    const base = Math.max(0, sideRev - sideExp);
    return {
      label: altMeta.label,
      takeHome: r.sideTakeHome,
      totalOutflow: r.totalTaxIncrease,
      effectiveRate: base > 0 ? r.totalTaxIncrease / base : 0,
      marginalRate: r.marginalRate,
      deductionBenefit: blueDeduction(altMeta.filing),
      grossBase: base,
    };
  }, [mode, altResult, altMeta, sideRev, sideExp]);

  const radarAxes = useMemo(
    () => buildRadarAxes(currentMetrics, altMetrics),
    [currentMetrics, altMetrics]
  );

  const tableRows = useMemo(() => {
    if (mode === "freelance") {
      const c = currentResult as ReturnType<typeof calcFreelance>;
      const a = altResult as ReturnType<typeof calcFreelance>;
      return deltaRows([
        { label: "手取り", current: c.takeHome, alternate: a.takeHome },
        { label: "所得税", current: c.incomeTax, alternate: a.incomeTax, lowerIsBetter: true },
        { label: "住民税", current: c.residentTax, alternate: a.residentTax, lowerIsBetter: true },
        { label: "社会保険料", current: c.socialInsurance, alternate: a.socialInsurance, lowerIsBetter: true },
        { label: "実効税率", current: c.effectiveRate, alternate: a.effectiveRate, lowerIsBetter: true },
        { label: "限界税率", current: c.marginalRate, alternate: a.marginalRate, lowerIsBetter: true },
      ]);
    }
    const c = currentResult as ReturnType<typeof calcSide>;
    const a = altResult as ReturnType<typeof calcSide>;
    return deltaRows([
      { label: "手取り", current: c.sideTakeHome, alternate: a.sideTakeHome },
      { label: "増税合計", current: c.totalTaxIncrease, alternate: a.totalTaxIncrease, lowerIsBetter: true },
      { label: "限界税率", current: c.marginalRate, alternate: a.marginalRate, lowerIsBetter: true },
    ]);
  }, [mode, currentResult, altResult]);

  const revenueSteps = useMemo(() => {
    if (mode === "freelance") {
      return freelanceRevenueSteps(freelanceInput, 5, 100_000);
    }
    return sideRevenueSteps(sideInput, 5, 100_000);
  }, [mode, freelanceInput, sideInput]);

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
  const currentFilingLabel =
    mode === "freelance" ? FILING_LABELS[filing] : FILING_LABELS[sideFiling];

  const currentPanelMetrics =
    mode === "freelance"
      ? [
          {
            label: "実効税率",
            value: pct((currentResult as ReturnType<typeof calcFreelance>).effectiveRate),
          },
          {
            label: "限界税率",
            value: pct((currentResult as ReturnType<typeof calcFreelance>).marginalRate, 0),
          },
        ]
      : [
          {
            label: "増税",
            value: yen((currentResult as ReturnType<typeof calcSide>).totalTaxIncrease),
          },
          {
            label: "限界税率",
            value: pct((currentResult as ReturnType<typeof calcSide>).marginalRate, 0),
          },
        ];

  const altPanelMetrics =
    mode === "freelance"
      ? [
          {
            label: "実効税率",
            value: pct((altResult as ReturnType<typeof calcFreelance>).effectiveRate),
          },
          {
            label: "限界税率",
            value: pct((altResult as ReturnType<typeof calcFreelance>).marginalRate, 0),
          },
        ]
      : [
          {
            label: "増税",
            value: yen((altResult as ReturnType<typeof calcSide>).totalTaxIncrease),
          },
          {
            label: "限界税率",
            value: pct((altResult as ReturnType<typeof calcSide>).marginalRate, 0),
          },
        ];

  return (
    <div id="simulator" className="scroll-mt-16">
      {/* ツールバー */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="section-label">{TAX_YEAR_LABEL}</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-ink sm:text-3xl">
            2つのシナリオを、並べて比較
          </h1>
        </div>
        <div className="seg-track shrink-0">
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

      <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
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

      {/* ★ 比較ヒーロー：横並び */}
      <section className="mt-8">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <p className="section-label">Scenario Compare</p>
            <h2 className="text-lg font-bold text-ink">申告区分を変えた場合</h2>
          </div>
          <p className="hidden text-[13px] text-ink-2 sm:block">
            左が現在 · 右が{altMeta.label}
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1fr_auto_1fr] lg:items-stretch">
          <ScenarioPanel
            title="Scenario A"
            subtitle={currentFilingLabel}
            takeHome={takeHome}
            takeHomeLabel={mode === "freelance" ? "年間手取り" : "副業手取り"}
            result={currentResult}
            mode={mode}
            gross={gross}
            variant="current"
            metrics={currentPanelMetrics}
          />
          <div className="flex items-center justify-center lg:w-36">
            <DiffBadge diff={diff} />
          </div>
          <ScenarioPanel
            title="Scenario B"
            subtitle={altMeta.label}
            takeHome={altTakeHome}
            takeHomeLabel={mode === "freelance" ? "年間手取り" : "副業手取り"}
            result={altResult}
            mode={mode}
            gross={gross}
            variant="alternate"
            metrics={altPanelMetrics}
          />
        </div>
      </section>

      {/* レーダー + 差分表 */}
      <section className="saas-card-lg mt-6 overflow-hidden p-5 sm:p-8">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          <div>
            <p className="section-label">Balance Radar</p>
            <h2 className="text-lg font-bold text-ink">5軸バランス比較</h2>
            <p className="mt-1 text-[13px] text-ink-2">
              手取り・税負担・控除などを正規化して重ね表示
            </p>
            <div className="mt-4 flex justify-center lg:justify-start">
              <CompareRadar axes={radarAxes} />
            </div>
          </div>
          <div>
            <p className="section-label">Delta Table</p>
            <h2 className="text-lg font-bold text-ink">項目別の差分</h2>
            <p className="mt-1 text-[13px] text-ink-2">緑=現在が有利 · 赤=もしもが有利</p>
            <div className="mt-4">
              <DeltaTable rows={tableRows} />
            </div>
          </div>
        </div>
      </section>

      {/* 入力 + 売上ステップ */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section className="saas-card p-5 sm:p-6">
          <p className="section-label">Parameters</p>
          <h2 className="text-lg font-bold text-ink">試算条件</h2>
          <div className="mt-4">
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
                    <p className="num text-lg font-bold">{yen(autoEstimate)}</p>
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
          {mode === "side" && (
            <p className="mt-4 rounded-xl bg-brand-soft px-4 py-3 text-[12px] text-ink-2">
              {(currentResult as ReturnType<typeof calcSide>).needsFiling
                ? "副業所得20万円超 — 確定申告が必要"
                : "所得税の確定申告は原則不要 · 住民税申告は必要"}
            </p>
          )}
        </section>

        <section className="saas-card p-5 sm:p-6">
          <p className="section-label">Marginal Steps</p>
          <h2 className="text-lg font-bold text-ink">
            {mode === "freelance" ? "売上 +10万" : "副業売上 +10万"}
          </h2>
          <p className="mt-1 text-[13px] text-ink-2">限界の手取り増分</p>
          <div className="mt-4 overflow-x-auto">
            <table className="step-table">
              <thead>
                <tr>
                  <th>{mode === "freelance" ? "売上" : "副業売上"}</th>
                  <th>手取り</th>
                  <th>増分</th>
                </tr>
              </thead>
              <tbody>
                {revenueSteps.map((row, i) => (
                  <tr key={row.revenue}>
                    <td className="num">{yen(row.revenue)}</td>
                    <td className="num font-semibold">{yen(row.takeHome)}</td>
                    <td className="num">
                      {i === 0 ? (
                        <span className="text-muted">—</span>
                      ) : (
                        <span className="font-semibold text-positive">+{yen(row.increment)}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <section className="mt-6">
        <ContextualCta {...insight} />
      </section>
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
        className="max-w-[58%] rounded-lg border border-line-strong bg-bg px-3 py-2 text-[13px] font-medium outline-none focus:border-brand focus:ring-2 focus:ring-brand/15"
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
