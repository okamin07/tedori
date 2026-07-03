"use client";

import { useMemo, useState } from "react";
import {
  calcFreelance,
  calcSide,
  compareFreelanceFiling,
  compareSideFiling,
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
import { BreakdownBar } from "./BreakdownBar";
import { ContextualCta } from "./ContextualCta";

export function Simulator() {
  const [mode, setMode] = useState<Mode>("side");
  const [activePreset, setActivePreset] = useState<string | null>("side-30");

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

  const freelanceResult = useMemo(
    () =>
      calcFreelance({
        revenue,
        expenses,
        filing,
        socialInsurance: social,
        otherDeductions: other,
        applyEnterpriseTax: enterprise,
      }),
    [revenue, expenses, filing, social, other, enterprise]
  );

  const sideResult = useMemo(
    () =>
      calcSide({
        salaryGross: salary,
        sideRevenue: sideRev,
        sideExpenses: sideExp,
        filing: sideFiling,
      }),
    [salary, sideRev, sideExp, sideFiling]
  );

  const freelanceCompare = useMemo(
    () =>
      compareFreelanceFiling({
        revenue,
        expenses,
        filing,
        socialInsurance: social,
        otherDeductions: other,
        applyEnterpriseTax: enterprise,
      }),
    [revenue, expenses, filing, social, other, enterprise]
  );

  const sideCompare = useMemo(
    () =>
      compareSideFiling({
        salaryGross: salary,
        sideRevenue: sideRev,
        sideExpenses: sideExp,
        filing: sideFiling,
      }),
    [salary, sideRev, sideExp, sideFiling]
  );

  const revenueSteps = useMemo(() => {
    if (mode === "freelance") {
      return freelanceRevenueSteps(
        {
          revenue,
          expenses,
          filing,
          socialInsurance: social,
          otherDeductions: other,
          applyEnterpriseTax: enterprise,
        },
        5,
        100_000
      );
    }
    return sideRevenueSteps(
      {
        salaryGross: salary,
        sideRevenue: sideRev,
        sideExpenses: sideExp,
        filing: sideFiling,
      },
      5,
      100_000
    );
  }, [mode, revenue, expenses, filing, social, other, enterprise, salary, sideRev, sideExp, sideFiling]);

  const insight = useMemo(() => {
    if (mode === "freelance") {
      return insightForFreelance(
        freelanceResult,
        freelanceCompare.takeHome,
        freelanceCompare.label
      );
    }
    return insightForSide(sideResult, sideCompare.takeHome, sideCompare.label);
  }, [mode, freelanceResult, freelanceCompare, sideResult, sideCompare]);

  const takeHome = mode === "freelance" ? freelanceResult.takeHome : sideResult.sideTakeHome;
  const compare = mode === "freelance" ? freelanceCompare : sideCompare;
  const gross =
    mode === "freelance"
      ? freelanceResult.businessIncome
      : Math.max(0, sideRev - sideExp);
  const resultData = mode === "freelance" ? freelanceResult : sideResult;

  const modePresets = PRESETS.filter((p) => p.mode === mode);

  return (
    <div id="simulator" className="scroll-mt-14">
      <p className="text-[12px] font-medium text-muted">{TAX_YEAR_LABEL}</p>
      <h1 className="mt-1 text-xl font-bold leading-snug text-ink sm:text-2xl">
        もしもを並べて、手取りの差で決める
      </h1>

      {/* プリセット */}
      <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
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

      {/* モード */}
      <div className="seg-track mt-4">
        <button
          type="button"
          className="seg-btn"
          data-active={mode === "side"}
          onClick={() => {
            setMode("side");
            setActivePreset(null);
          }}
        >
          副業（会社員）
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
          独立・フリーランス
        </button>
      </div>

      {/* 固定手取り */}
      <div className="sticky-hero -mx-4 mt-5 px-4 py-4 sm:-mx-0 sm:rounded-xl sm:border sm:border-line sm:px-5">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">
          {mode === "freelance" ? "年間手取り" : "副業の手取り"}
        </p>
        <p className="num mt-0.5 text-[2.5rem] font-bold leading-none text-brand sm:text-[3rem]">
          {yen(takeHome)}
        </p>
        <p className="mt-2 text-[13px] text-ink-2">
          {mode === "freelance" ? (
            <>
              実効 {pct(freelanceResult.effectiveRate)} · 限界 {pct(freelanceResult.marginalRate, 0)}
            </>
          ) : (
            <>
              増税 {yen(sideResult.totalTaxIncrease)} · 限界 {pct(sideResult.marginalRate, 0)}
            </>
          )}
        </p>
        <div className="mt-3">
          <BreakdownBar data={resultData} mode={mode} gross={gross} />
        </div>
      </div>

      {/* 比較 */}
      <section className="mt-6 rounded-xl border border-line bg-surface p-4">
        <h2 className="text-[13px] font-semibold text-ink">申告を変えたら</h2>
        <div className="compare-grid mt-3">
          <CompareCard label="現在" takeHome={takeHome} highlight />
          <CompareCard
            label={compare.label}
            takeHome={compare.takeHome}
            diff={compare.diff}
          />
        </div>
      </section>

      {/* 入力 */}
      <section className="mt-6 rounded-xl border border-line bg-surface px-4">
        <h2 className="border-b border-line py-3 text-[13px] font-semibold text-ink">
          条件
        </h2>
        {mode === "freelance" ? (
          <>
            <MoneyField label="年間売上" value={revenue} onChange={(v) => { setRevenue(v); setActivePreset(null); }} />
            <MoneyField label="年間経費" value={expenses} onChange={(v) => { setExpenses(v); setActivePreset(null); }} max={revenue} />
            <SelectField label="申告区分" value={filing} onChange={(v) => { setFiling(v as FilingType); setActivePreset(null); }} />
            <div className="field-row">
              <div>
                <p className="text-[14px] text-ink">社会保険料</p>
                <label className="mt-1 flex cursor-pointer items-center gap-1.5 text-[12px] text-muted">
                  <input
                    type="checkbox"
                    checked={autoSocial}
                    onChange={(e) => setAutoSocial(e.target.checked)}
                    className="accent-brand"
                  />
                  概算を使う
                </label>
              </div>
              {autoSocial ? (
                <p className="num text-lg font-semibold">{yen(autoEstimate)}</p>
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
      </section>

      {/* 売上ステップ */}
      <section className="mt-6 rounded-xl border border-line bg-surface p-4">
        <h2 className="text-[13px] font-semibold text-ink">
          {mode === "freelance" ? "売上を10万円ずつ増やすと" : "副業売上を10万円ずつ増やすと"}
        </h2>
        <p className="mt-1 text-[12px] text-muted">手取りの増え方（限界の目安）</p>
        <div className="mt-3 overflow-x-auto">
          <table className="step-table">
            <thead>
              <tr>
                <th>{mode === "freelance" ? "売上" : "副業売上"}</th>
                <th>手取り</th>
                <th>+10万の増分</th>
              </tr>
            </thead>
            <tbody>
              {revenueSteps.map((row, i) => (
                <tr key={row.revenue} className={i === 0 ? "text-muted" : ""}>
                  <td className="num">{yen(row.revenue)}</td>
                  <td className="num font-medium text-ink">{yen(row.takeHome)}</td>
                  <td className="num">
                    {i === 0 ? "—" : (
                      <span className={row.increment > 0 ? "text-positive" : ""}>
                        +{yen(row.increment)}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 内訳 */}
      <section className="mt-6 rounded-xl border border-line bg-surface p-4">
        <h2 className="text-[13px] font-semibold text-ink">内訳</h2>
        <dl className="mt-3 space-y-2 text-[13px]">
          {mode === "freelance" ? (
            <>
              <Row label="所得" value={yen(freelanceResult.businessIncome)} />
              <Row label="所得税" value={yen(freelanceResult.incomeTax)} muted />
              <Row label="復興特別所得税" value={yen(freelanceResult.reconstructionTax)} muted />
              <Row label="住民税" value={yen(freelanceResult.residentTax)} muted />
              {freelanceResult.enterpriseTax > 0 && (
                <Row label="個人事業税" value={yen(freelanceResult.enterpriseTax)} muted />
              )}
              <Row label="社会保険料" value={yen(freelanceResult.socialInsurance)} muted />
            </>
          ) : (
            <>
              <Row label="副業所得" value={yen(sideResult.sideIncome)} />
              <Row label="増える所得税" value={yen(sideResult.incomeTaxIncrease)} muted />
              <Row label="復興特別所得税" value={yen(sideResult.reconstructionIncrease)} muted />
              <Row label="増える住民税" value={yen(sideResult.residentIncrease)} muted />
            </>
          )}
        </dl>
        {mode === "side" && (
          <p className="mt-4 rounded-lg bg-bg px-3 py-2 text-[12px] text-ink-2">
            {sideResult.needsFiling
              ? "副業所得20万円超 — 確定申告が必要です。"
              : "所得税の確定申告は原則不要。住民税の申告は必要です。"}
          </p>
        )}
      </section>

      {/* コンテキストCTA */}
      <section className="mt-6">
        <ContextualCta {...insight} />
      </section>
    </div>
  );
}

function CompareCard({
  label,
  takeHome,
  diff,
  highlight,
}: {
  label: string;
  takeHome: number;
  diff?: number;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-lg border p-3 ${
        highlight ? "border-brand bg-brand-soft" : "border-line bg-bg"
      }`}
    >
      <p className="text-[11px] font-medium text-muted">{label}</p>
      <p className="num mt-1 text-xl font-bold text-ink">{yen(takeHome)}</p>
      {diff !== undefined && diff !== 0 && (
        <p
          className={`num mt-1 text-[12px] font-medium ${
            diff > 0 ? "text-positive" : "text-negative"
          }`}
        >
          {diff > 0 ? "+" : ""}
          {yen(diff)} vs 現在
        </p>
      )}
    </div>
  );
}

function Row({
  label,
  value,
  muted,
}: {
  label: string;
  value: string;
  muted?: boolean;
}) {
  return (
    <div className="flex justify-between gap-4">
      <dt className={muted ? "text-muted" : "text-ink-2"}>{label}</dt>
      <dd className={`num font-medium ${muted ? "text-ink-2" : "text-ink"}`}>{value}</dd>
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
      <label className="text-[14px] text-ink">{label}</label>
      <input
        type="text"
        inputMode="numeric"
        value={value.toLocaleString("ja-JP")}
        onChange={(e) => {
          const n = Number(e.target.value.replace(/[^\d]/g, ""));
          if (!Number.isNaN(n)) onChange(Math.min(Math.max(0, n), max));
        }}
        className="num w-28 rounded-lg border border-line bg-bg px-2 py-1.5 text-right text-[15px] font-semibold outline-none focus:border-brand"
      />
    </div>
  );
}

function NumberInput({
  value,
  onChange,
}: {
  value: number;
  onChange: (n: number) => void;
}) {
  return (
    <input
      type="number"
      value={value}
      step={10000}
      min={0}
      onChange={(e) => onChange(Math.max(0, Number(e.target.value)))}
      className="num w-28 rounded-lg border border-line bg-bg px-2 py-1.5 text-right text-[15px] font-semibold outline-none focus:border-brand"
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
      <label className="text-[14px] text-ink">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="max-w-[55%] rounded-lg border border-line bg-bg px-2 py-1.5 text-[13px] outline-none focus:border-brand"
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
