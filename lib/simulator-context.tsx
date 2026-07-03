"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  alternateFiling,
  calcFreelance,
  calcSide,
  estimateSocialInsurance,
  FILING_LABELS,
  type FilingType,
} from "@/lib/tax";
import { PRESETS, type Mode } from "@/lib/presets";

interface SimulatorContextValue {
  mode: Mode;
  setMode: (m: Mode) => void;
  activePreset: string | null;
  applyPreset: (id: string) => void;
  clearPreset: () => void;
  revenue: number;
  setRevenue: (n: number) => void;
  expenses: number;
  setExpenses: (n: number) => void;
  filing: FilingType;
  setFiling: (f: FilingType) => void;
  autoSocial: boolean;
  setAutoSocial: (v: boolean) => void;
  manualSocial: number;
  setManualSocial: (n: number) => void;
  other: number;
  setOther: (n: number) => void;
  enterprise: boolean;
  setEnterprise: (v: boolean) => void;
  salary: number;
  setSalary: (n: number) => void;
  sideRev: number;
  setSideRev: (n: number) => void;
  sideExp: number;
  setSideExp: (n: number) => void;
  sideFiling: FilingType;
  setSideFiling: (f: FilingType) => void;
  social: number;
  autoEstimate: number;
  currentResult: ReturnType<typeof calcFreelance> | ReturnType<typeof calcSide>;
  altResult: ReturnType<typeof calcFreelance> | ReturnType<typeof calcSide>;
  altMeta: ReturnType<typeof alternateFiling>;
  currentLabel: string;
  takeHome: number;
  altTakeHome: number;
  diff: number;
}

const SimulatorContext = createContext<SimulatorContextValue | null>(null);

export function SimulatorProvider({ children }: { children: ReactNode }) {
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

  const value: SimulatorContextValue = {
    mode,
    setMode,
    activePreset,
    applyPreset,
    clearPreset: () => setActivePreset(null),
    revenue,
    setRevenue,
    expenses,
    setExpenses,
    filing,
    setFiling,
    autoSocial,
    setAutoSocial,
    manualSocial,
    setManualSocial,
    other,
    setOther,
    enterprise,
    setEnterprise,
    salary,
    setSalary,
    sideRev,
    setSideRev,
    sideExp,
    setSideExp,
    sideFiling,
    setSideFiling,
    social,
    autoEstimate,
    currentResult,
    altResult,
    altMeta,
    currentLabel,
    takeHome,
    altTakeHome,
    diff: takeHome - altTakeHome,
  };

  return (
    <SimulatorContext.Provider value={value}>{children}</SimulatorContext.Provider>
  );
}

export function useSimulator() {
  const ctx = useContext(SimulatorContext);
  if (!ctx) throw new Error("useSimulator must be used within SimulatorProvider");
  return ctx;
}
