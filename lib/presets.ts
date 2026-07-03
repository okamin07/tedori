import type { FilingType } from "./tax";

export type Mode = "freelance" | "side";

export interface FreelancePresetValues {
  revenue: number;
  expenses: number;
  filing: FilingType;
  otherDeductions: number;
  applyEnterpriseTax: boolean;
}

export interface SidePresetValues {
  salaryGross: number;
  sideRevenue: number;
  sideExpenses: number;
  filing: FilingType;
}

export interface Preset {
  id: string;
  label: string;
  description: string;
  mode: Mode;
  freelance?: FreelancePresetValues;
  side?: SidePresetValues;
}

export const PRESETS: Preset[] = [
  {
    id: "side-30",
    label: "副業30万",
    description: "会社員のまま副業",
    mode: "side",
    side: {
      salaryGross: 5_000_000,
      sideRevenue: 300_000,
      sideExpenses: 30_000,
      filing: "white",
    },
  },
  {
    id: "side-50",
    label: "副業50万",
    description: "本業500万・副業50万",
    mode: "side",
    side: {
      salaryGross: 5_000_000,
      sideRevenue: 500_000,
      sideExpenses: 50_000,
      filing: "white",
    },
  },
  {
    id: "side-blue",
    label: "副業＋青色",
    description: "副業を青色申告",
    mode: "side",
    side: {
      salaryGross: 6_000_000,
      sideRevenue: 800_000,
      sideExpenses: 100_000,
      filing: "blue65",
    },
  },
  {
    id: "freelance-300",
    label: "独立・300万",
    description: "売上300万・経費50万",
    mode: "freelance",
    freelance: {
      revenue: 3_000_000,
      expenses: 500_000,
      filing: "blue65",
      otherDeductions: 0,
      applyEnterpriseTax: false,
    },
  },
  {
    id: "freelance-500",
    label: "独立・500万",
    description: "売上500万・経費100万",
    mode: "freelance",
    freelance: {
      revenue: 5_000_000,
      expenses: 1_000_000,
      filing: "blue65",
      otherDeductions: 0,
      applyEnterpriseTax: false,
    },
  },
];
