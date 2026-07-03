"use client";

import { useMemo, useState } from "react";
import {
  calcFreelance,
  calcSide,
  estimateSocialInsurance,
  FILING_LABELS,
  type FilingType,
  TAX_YEAR_LABEL,
} from "@/lib/tax";
import { yen, pct, man } from "@/lib/format";
import { offersByIds } from "@/lib/affiliate";
import { AffiliateCard } from "./AffiliateCard";

type Mode = "freelance" | "side";

export function Simulator() {
  const [mode, setMode] = useState<Mode>("freelance");

  const [revenue, setRevenue] = useState(5_000_000);
  const [expenses, setExpenses] = useState(1_000_000);
  const [filing, setFiling] = useState<FilingType>("blue65");
  const [autoSocial, setAutoSocial] = useState(true);
  const [manualSocial, setManualSocial] = useState(600_000);
  const [other, setOther] = useState(0);
  const [enterprise, setEnterprise] = useState(false);

  const [salary, setSalary] = useState(5_000_000);
  const [sideRev, setSideRev] = useState(600_000);
  const [sideExp, setSideExp] = useState(100_000);
  const [sideFiling, setSideFiling] = useState<FilingType>("white");

  const autoEstimate = useMemo(
    () => estimateSocialInsurance(Math.max(0, revenue - expenses)),
    [revenue, expenses]
  );
  const social = autoSocial ? autoEstimate : manualSocial;

  const f = useMemo(
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

  const s = useMemo(
    () =>
      calcSide({
        salaryGross: salary,
        sideRevenue: sideRev,
        sideExpenses: sideExp,
        filing: sideFiling,
      }),
    [salary, sideRev, sideExp, sideFiling]
  );

  const affiliateIds =
    mode === "freelance"
      ? (["accounting", "kaigyo", "card", "tax-advisor"] as const)
      : (["accounting", "kaigyo", "card"] as const);

  return (
    <div id="simulator" className="scroll-mt-16">
      {/* イントロ：マーケコピーではなく、ツールの前置き */}
      <div className="mb-8 max-w-2xl">
        <p className="text-[13px] tracking-wide text-muted">{TAX_YEAR_LABEL}</p>
        <h1 className="serif mt-2 text-[1.75rem] font-bold leading-snug text-ink sm:text-[2.125rem]">
          売上から手取りまで、
          <br className="hidden sm:block" />
          一度に試算する。
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed text-ink-2">
          入力は下の欄だけ。所得税・住民税・社会保険料を差し引いた残りを表示します。
        </p>
      </div>

      <div className="tab-track mb-0">
        <button
          type="button"
          className="tab-btn"
          data-active={mode === "freelance"}
          onClick={() => setMode("freelance")}
        >
          個人事業・フリーランス
        </button>
        <button
          type="button"
          className="tab-btn"
          data-active={mode === "side"}
          onClick={() => setMode("side")}
        >
          副業（会社員）
        </button>
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-12">
        {/* 入力 */}
        <div className="border border-line bg-sheet px-5 py-6 sm:px-6">
          <p className="mb-6 text-[11px] font-medium tracking-[0.15em] text-muted">
            入力
          </p>
          {mode === "freelance" ? (
            <div className="flex flex-col gap-6">
              <MoneyField label="年間売上" value={revenue} onChange={setRevenue} max={20_000_000} step={100_000} />
              <MoneyField label="年間経費" value={expenses} onChange={setExpenses} max={revenue} step={50_000} />
              <SelectField label="申告区分" value={filing} onChange={(v) => setFiling(v as FilingType)} />
              <div className="field-block">
                <div className="flex items-baseline justify-between">
                  <label className="text-[13px] text-ink-2">社会保険料</label>
                  <label className="flex cursor-pointer items-center gap-1.5 text-[11px] text-muted">
                    <input
                      type="checkbox"
                      checked={autoSocial}
                      onChange={(e) => setAutoSocial(e.target.checked)}
                      className="accent-[var(--color-ink)]"
                    />
                    概算
                  </label>
                </div>
                {autoSocial ? (
                  <p className="num mt-2 text-xl font-medium text-ink">{yen(autoEstimate)}</p>
                ) : (
                  <NumberInput value={manualSocial} onChange={setManualSocial} step={10_000} />
                )}
                <p className="mt-1 text-[11px] text-muted">国民年金＋国保（自治体により変動）</p>
              </div>
              <MoneyField label="その他控除（iDeCo・扶養等）" value={other} onChange={setOther} max={3_000_000} step={10_000} />
              <label className="flex cursor-pointer items-start gap-2 text-[13px] text-ink-2">
                <input
                  type="checkbox"
                  checked={enterprise}
                  onChange={(e) => setEnterprise(e.target.checked)}
                  className="mt-1 accent-[var(--color-ink)]"
                />
                個人事業税を含める（290万円超・5%）
              </label>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              <MoneyField label="本業・額面年収" value={salary} onChange={setSalary} max={20_000_000} step={100_000} />
              <MoneyField label="副業・売上" value={sideRev} onChange={setSideRev} max={5_000_000} step={50_000} />
              <MoneyField label="副業・経費" value={sideExp} onChange={setSideExp} max={sideRev} step={10_000} />
              <SelectField label="副業の申告区分" value={sideFiling} onChange={(v) => setSideFiling(v as FilingType)} />
            </div>
          )}
        </div>

        {/* 結果：帳票 */}
        <div className="sheet">
          <div className="sheet-header">
            <span>試算結果</span>
            <span className="num">{new Date().toLocaleDateString("ja-JP")}</span>
          </div>
          <div className="px-5 py-6 sm:px-6 sm:py-8">
            {mode === "freelance" ? <FreelanceResult data={f} /> : <SideResult data={s} />}
          </div>
        </div>
      </div>

      {/* 関連 */}
      <section className="mt-16 border-t border-line-strong pt-10">
        <h2 className="text-[13px] font-medium tracking-[0.12em] text-muted">
          関連
        </h2>
        <div className="mt-2 divide-y divide-line border-b border-line">
          {offersByIds([...affiliateIds]).map((o) => (
            <AffiliateCard key={o.id} offer={o} />
          ))}
        </div>
      </section>
    </div>
  );
}

function FreelanceResult({ data }: { data: ReturnType<typeof calcFreelance> }) {
  return (
    <div key={data.takeHome}>
      <p className="text-[11px] tracking-[0.1em] text-muted">年間手取り</p>
      <p className="num mt-1 text-[2.75rem] font-semibold leading-none text-in sm:text-[3.25rem]">
        {yen(data.takeHome)}
      </p>
      <p className="mt-3 text-[13px] text-muted">
        所得 {man(data.businessIncome)}　実効 {pct(data.effectiveRate)}
      </p>

      <div className="mt-8 space-y-2 border-t border-line pt-6">
        <LeaderRow label="所得（売上 − 経費）" value={yen(data.businessIncome)} />
        <LeaderRow label="所得税" value={yen(data.incomeTax)} out />
        <LeaderRow label="復興特別所得税" value={yen(data.reconstructionTax)} out />
        <LeaderRow label="住民税" value={yen(data.residentTax)} out />
        {data.enterpriseTax > 0 && (
          <LeaderRow label="個人事業税" value={yen(data.enterpriseTax)} out />
        )}
        <LeaderRow label="社会保険料" value={yen(data.socialInsurance)} out />
        <div className="leader-row pt-3">
          <span className="leader-label text-[13px] font-semibold text-ink">手取り</span>
          <span className="leader-dots" />
          <span className="leader-value num text-lg font-semibold text-in">{yen(data.takeHome)}</span>
        </div>
      </div>
    </div>
  );
}

function SideResult({ data }: { data: ReturnType<typeof calcSide> }) {
  return (
    <div key={data.sideTakeHome}>
      <p className="text-[11px] tracking-[0.1em] text-muted">副業の手取り</p>
      <p className="num mt-1 text-[2.75rem] font-semibold leading-none text-in sm:text-[3.25rem]">
        {yen(data.sideTakeHome)}
      </p>
      <p className="mt-3 text-[13px] text-muted">
        増税 {yen(data.totalTaxIncrease)}　限界 {pct(data.marginalRate, 0)}
      </p>

      <div className="mt-8 space-y-2 border-t border-line pt-6">
        <LeaderRow label="副業所得" value={yen(data.sideIncome)} />
        <LeaderRow label="増える所得税" value={yen(data.incomeTaxIncrease)} out />
        <LeaderRow label="復興特別所得税" value={yen(data.reconstructionIncrease)} out />
        <LeaderRow label="増える住民税" value={yen(data.residentIncrease)} out />
        <div className="leader-row pt-3">
          <span className="leader-label text-[13px] font-semibold text-ink">手取り</span>
          <span className="leader-dots" />
          <span className="leader-value num text-lg font-semibold text-in">{yen(data.sideTakeHome)}</span>
        </div>
      </div>

      <p className="mt-6 border-l-2 border-out pl-3 text-[13px] leading-relaxed text-ink-2">
        {data.needsFiling
          ? "副業所得20万円超のため、確定申告が必要です。"
          : "所得税の確定申告は原則不要ですが、住民税の申告は必要です。"}
      </p>
    </div>
  );
}

function LeaderRow({
  label,
  value,
  out,
}: {
  label: string;
  value: string;
  out?: boolean;
}) {
  return (
    <div className="leader-row">
      <span className="leader-label text-[13px] text-ink-2">{label}</span>
      <span className="leader-dots" />
      <span className={`leader-value num text-[13px] ${out ? "text-out" : "text-ink"}`}>{value}</span>
    </div>
  );
}

function MoneyField({
  label,
  value,
  onChange,
  max,
  step,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
  max: number;
  step: number;
}) {
  return (
    <div className="field-block">
      <div className="flex items-baseline justify-between gap-4">
        <label className="text-[13px] text-ink-2">{label}</label>
        <input
          type="text"
          inputMode="numeric"
          value={value.toLocaleString("ja-JP")}
          onChange={(e) => {
            const n = Number(e.target.value.replace(/[^\d]/g, ""));
            if (!Number.isNaN(n)) onChange(Math.min(Math.max(0, n), max));
          }}
          className="num w-32 border-b border-line-strong bg-transparent py-1 text-right text-lg font-medium text-ink outline-none focus:border-ink"
        />
      </div>
      <input
        type="range"
        min={0}
        max={max}
        step={step}
        value={Math.min(value, max)}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={label}
      />
    </div>
  );
}

function NumberInput({
  value,
  onChange,
  step,
}: {
  value: number;
  onChange: (n: number) => void;
  step: number;
}) {
  return (
    <input
      type="number"
      value={value}
      step={step}
      min={0}
      onChange={(e) => onChange(Math.max(0, Number(e.target.value)))}
      className="num mt-2 w-full border-b border-line-strong bg-transparent py-1 text-right text-lg font-medium text-ink outline-none focus:border-ink"
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
    <div className="field-block">
      <label className="text-[13px] text-ink-2">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full border-b border-line-strong bg-transparent py-2 text-[14px] text-ink outline-none focus:border-ink"
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
