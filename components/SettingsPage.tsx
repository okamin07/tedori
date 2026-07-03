"use client";

import { useState } from "react";

const TABS = ["プロフィール", "通知", "プラン", "アカウント"] as const;

export function SettingsPage() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("プロフィール");

  return (
    <div className="page-pad mx-auto max-w-[960px]">
      <h1 className="page-title">設定</h1>

      <div className="mt-6 flex gap-1 overflow-x-auto border-b border-line">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`settings-tab ${tab === t ? "settings-tab--active" : ""}`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "プロフィール" && (
        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_240px]">
          <div className="wf-card p-5 sm:p-6">
            <Field label="名前" defaultValue="ゲスト" />
            <Field label="メール" defaultValue="demo@tedori.app" />
            <Field label="職業" defaultValue="フリーランス" />
            <button type="button" className="btn-primary mt-4">
              保存
            </button>
          </div>
          <div className="wf-card p-5">
            <p className="text-[13px] font-bold text-ink">アカウント</p>
            <button type="button" className="mt-4 w-full rounded-lg border border-line py-2 text-[13px] font-medium text-ink-2 hover:bg-bg">
              パスワードを変更
            </button>
            <button type="button" className="mt-2 w-full rounded-lg py-2 text-[13px] font-medium text-negative hover:bg-negative-soft">
              ログアウト
            </button>
          </div>
        </div>
      )}

      {tab === "プラン" && (
        <div id="plan" className="mt-6 grid gap-4 lg:grid-cols-3">
          <PlanCard name="Free" price="¥0" features={["基本比較", "記事閲覧", "広告表示"]} />
          <PlanCard
            name="Standard"
            price="¥980"
            highlight
            features={["3シナリオ保存", "PDF出力", "広告非表示", "売上ステップ表"]}
          />
          <PlanCard name="Premium" price="¥1,980" features={["無制限保存", "税理士相談割引", "優先サポート"]} />
        </div>
      )}

      {(tab === "通知" || tab === "アカウント") && (
        <div className="wf-card mt-6 p-8 text-center text-[14px] text-muted">
          {tab}設定は準備中です
        </div>
      )}
    </div>
  );
}

function Field({ label, defaultValue }: { label: string; defaultValue: string }) {
  return (
    <div className="field-row">
      <label className="text-[14px] font-medium text-ink">{label}</label>
      <input defaultValue={defaultValue} className="input-field flex-1 max-w-none sm:max-w-[280px]" />
    </div>
  );
}

function PlanCard({
  name,
  price,
  features,
  highlight,
}: {
  name: string;
  price: string;
  features: string[];
  highlight?: boolean;
}) {
  return (
    <div className={`wf-card p-5 ${highlight ? "ring-2 ring-brand" : ""}`}>
      {highlight && (
        <span className="mb-2 inline-block rounded-full bg-brand px-2 py-0.5 text-[10px] font-bold text-white">
          おすすめ
        </span>
      )}
      <p className="text-lg font-bold text-ink">{name}</p>
      <p className="num mt-1 text-2xl font-bold text-ink">
        {price}
        <span className="text-[13px] font-normal text-muted"> / 月</span>
      </p>
      <ul className="mt-4 space-y-2 text-[13px] text-ink-2">
        {features.map((f) => (
          <li key={f} className="flex gap-2">
            <span className="text-positive">✓</span>
            {f}
          </li>
        ))}
      </ul>
      <button type="button" className={`mt-5 w-full ${highlight ? "btn-primary" : "rounded-lg border border-line py-2.5 text-[13px] font-semibold text-ink hover:bg-bg"}`}>
        このプランを選ぶ
      </button>
    </div>
  );
}
