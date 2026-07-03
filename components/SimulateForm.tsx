"use client";

import Link from "next/link";
import { calcFreelance, calcSide, FILING_LABELS, TAX_YEAR_LABEL, type FilingType } from "@/lib/tax";
import { yen, pct } from "@/lib/format";
import { useSimulator } from "@/lib/simulator-context";

export function SimulateForm() {
  const sim = useSimulator();

  const summary =
    sim.mode === "freelance"
      ? {
          takeHome: (sim.currentResult as ReturnType<typeof calcFreelance>).takeHome,
          effective: (sim.currentResult as ReturnType<typeof calcFreelance>).effectiveRate,
        }
      : {
          takeHome: (sim.currentResult as ReturnType<typeof calcSide>).sideTakeHome,
          effective:
            sim.sideRev - sim.sideExp > 0
              ? (sim.currentResult as ReturnType<typeof calcSide>).totalTaxIncrease /
                (sim.sideRev - sim.sideExp)
              : 0,
        };

  return (
    <div className="page-pad mx-auto max-w-[960px]">
      <p className="text-[13px] text-muted">{TAX_YEAR_LABEL}</p>
      <h1 className="page-title">シミュレーション</h1>
      <p className="mt-1 text-[14px] text-ink-2">数字を入力して、比較画面に反映します。</p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_280px]">
        <div className="wf-card p-5 sm:p-6">
          <div className="seg-track mb-6">
            <button type="button" className="seg-btn" data-active={sim.mode === "side"} onClick={() => { sim.setMode("side"); sim.clearPreset(); }}>
              副業
            </button>
            <button type="button" className="seg-btn" data-active={sim.mode === "freelance"} onClick={() => { sim.setMode("freelance"); sim.clearPreset(); }}>
              独立
            </button>
          </div>

          {sim.mode === "freelance" ? (
            <>
              <Field label="年間売上" value={sim.revenue} onChange={(v) => { sim.setRevenue(v); sim.clearPreset(); }} />
              <Field label="年間経費" value={sim.expenses} onChange={(v) => { sim.setExpenses(v); sim.clearPreset(); }} max={sim.revenue} />
              <Select label="申告区分" value={sim.filing} onChange={(v) => { sim.setFiling(v as FilingType); sim.clearPreset(); }} />
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
              <Field label="本業・額面年収" value={sim.salary} onChange={(v) => { sim.setSalary(v); sim.clearPreset(); }} />
              <Field label="副業・売上" value={sim.sideRev} onChange={(v) => { sim.setSideRev(v); sim.clearPreset(); }} />
              <Field label="副業・経費" value={sim.sideExp} onChange={(v) => { sim.setSideExp(v); sim.clearPreset(); }} max={sim.sideRev} />
              <Select label="申告区分" value={sim.sideFiling} onChange={(v) => { sim.setSideFiling(v as FilingType); sim.clearPreset(); }} />
            </>
          )}
        </div>

        <div className="space-y-4">
          <div className="wf-card p-5">
            <p className="text-[12px] font-semibold text-muted">入力内容のサマリー</p>
            <dl className="mt-4 space-y-3 text-[13px]">
              {sim.mode === "freelance" ? (
                <>
                  <Row k="売上" v={yen(sim.revenue)} />
                  <Row k="経費" v={yen(sim.expenses)} />
                  <Row k="申告" v={FILING_LABELS[sim.filing].replace(/（.+）/, "")} />
                </>
              ) : (
                <>
                  <Row k="本業年収" v={yen(sim.salary)} />
                  <Row k="副業売上" v={yen(sim.sideRev)} />
                  <Row k="申告" v={FILING_LABELS[sim.sideFiling].replace(/（.+）/, "")} />
                </>
              )}
            </dl>
            <div className="mt-5 border-t border-line pt-4">
              <p className="text-[11px] text-muted">試算手取り</p>
              <p className="num mt-1 text-2xl font-bold text-brand">{yen(summary.takeHome)}</p>
              <p className="num mt-1 text-[12px] text-ink-2">実効 {pct(summary.effective)}</p>
            </div>
          </div>
          <Link href="/" className="btn-primary block w-full text-center">
            比較画面へ
          </Link>
        </div>
      </div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-2">
      <dt className="text-muted">{k}</dt>
      <dd className="num font-semibold text-ink">{v}</dd>
    </div>
  );
}

function Field({
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

function Select({
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
