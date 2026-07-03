/**
 * 手取り計算エンジン（2025年分・令和7年ベースの概算）
 *
 * すべて「概算・目安」。最終的な税額・保険料は個別事情や自治体により変動する。
 * - 所得税: 課税所得 × 税率 − 速算控除（超過累進7段階）
 * - 復興特別所得税: 所得税 × 2.1%
 * - 住民税: 課税所得（住民税基礎控除43万）× 10% + 均等割5,000円
 */

export const TAX_YEAR_LABEL = "2025年分（令和7年）概算";

/** 所得税の速算表（課税所得ベース） */
const INCOME_TAX_BRACKETS: { upto: number; rate: number; deduct: number }[] = [
  { upto: 1_950_000, rate: 0.05, deduct: 0 },
  { upto: 3_300_000, rate: 0.1, deduct: 97_500 },
  { upto: 6_950_000, rate: 0.2, deduct: 427_500 },
  { upto: 9_000_000, rate: 0.23, deduct: 636_000 },
  { upto: 18_000_000, rate: 0.33, deduct: 1_536_000 },
  { upto: 40_000_000, rate: 0.4, deduct: 2_796_000 },
  { upto: Infinity, rate: 0.45, deduct: 4_796_000 },
];

const BASIC_DEDUCTION_INCOME = 480_000; // 所得税の基礎控除
const BASIC_DEDUCTION_RESIDENT = 430_000; // 住民税の基礎控除
const RESIDENT_TAX_RATE = 0.1;
const RESIDENT_PER_CAPITA = 5_000; // 均等割
const RECONSTRUCTION_RATE = 0.021; // 復興特別所得税
const ENTERPRISE_TAX_RATE = 0.05; // 個人事業税（標準・業種簡易）
const ENTERPRISE_TAX_DEDUCTION = 2_900_000; // 事業主控除

/** 申告区分 */
export type FilingType = "blue65" | "blue55" | "blue10" | "white";

export const FILING_LABELS: Record<FilingType, string> = {
  blue65: "青色申告（65万円控除）",
  blue55: "青色申告（55万円控除）",
  blue10: "青色申告（10万円控除）",
  white: "白色申告",
};

const BLUE_DEDUCTION: Record<FilingType, number> = {
  blue65: 650_000,
  blue55: 550_000,
  blue10: 100_000,
  white: 0,
};

const round = (n: number) => Math.max(0, Math.floor(n));

/** 所得税額（本税、復興税を除く） */
export function calcIncomeTax(taxableIncome: number): number {
  const base = Math.floor(Math.max(0, taxableIncome) / 1000) * 1000; // 1000円未満切り捨て
  const bracket = INCOME_TAX_BRACKETS.find((b) => base <= b.upto)!;
  return round(base * bracket.rate - bracket.deduct);
}

/** 適用される限界税率（所得税、%表示用に小数で返す） */
export function marginalRate(taxableIncome: number): number {
  const bracket = INCOME_TAX_BRACKETS.find((b) => taxableIncome <= b.upto)!;
  return bracket.rate;
}

/** 住民税額（所得割 + 均等割） */
export function calcResidentTax(residentTaxableIncome: number): number {
  const base = Math.max(0, residentTaxableIncome);
  if (base <= 0) return 0;
  return round(base * RESIDENT_TAX_RATE) + RESIDENT_PER_CAPITA;
}

/** 給与所得控除（2020年以降） */
export function salaryIncomeDeduction(gross: number): number {
  if (gross <= 1_625_000) return 550_000;
  if (gross <= 1_800_000) return round(gross * 0.4 - 100_000);
  if (gross <= 3_600_000) return round(gross * 0.3 + 80_000);
  if (gross <= 6_600_000) return round(gross * 0.2 + 440_000);
  if (gross <= 8_500_000) return round(gross * 0.1 + 1_100_000);
  return 1_950_000;
}

/** 給与所得 */
export function salaryIncome(gross: number): number {
  return round(gross - salaryIncomeDeduction(gross));
}

/**
 * 社会保険料の概算（フリーランス: 国民年金 + 国民健康保険）
 * 国保は自治体差が大きいため、所得割約10% + 均等割の粗い近似。手動上書き前提。
 */
export function estimateSocialInsurance(businessIncome: number): number {
  const nationalPension = 210_120; // 2025: 17,510円/月 × 12
  const incomeBase = Math.max(0, businessIncome - BASIC_DEDUCTION_RESIDENT);
  const healthIncomePortion = incomeBase * 0.1; // 所得割の粗い近似
  const healthPerCapita = 50_000; // 均等割・平等割の概算
  const health = Math.min(round(healthIncomePortion + healthPerCapita), 900_000); // 上限概算
  return round(nationalPension + health);
}

// ---- フリーランス/個人事業主モード ----

export interface FreelanceInput {
  revenue: number; // 年間売上
  expenses: number; // 経費
  filing: FilingType;
  socialInsurance: number; // 社会保険料（実額 or 概算）
  otherDeductions: number; // その他所得控除（配偶者・扶養・iDeCo・生保等の合計）
  applyEnterpriseTax: boolean; // 個人事業税を含めるか
}

export interface TaxBreakdown {
  businessIncome: number; // 所得（売上−経費）
  taxableIncome: number; // 所得税の課税所得
  incomeTax: number;
  reconstructionTax: number;
  residentTax: number;
  enterpriseTax: number;
  socialInsurance: number;
  totalTax: number; // 税金合計（社保除く）
  totalDeduction: number; // 手元から出る合計（税金 + 社保）
  takeHome: number; // 手取り
  effectiveRate: number; // 実効負担率（対 所得）
  marginalRate: number;
}

export function calcFreelance(input: FreelanceInput): TaxBreakdown {
  const businessIncome = round(input.revenue - input.expenses);
  const afterBlue = Math.max(0, businessIncome - BLUE_DEDUCTION[input.filing]);

  const deductions = input.socialInsurance + input.otherDeductions;
  const taxableIncome = Math.max(0, afterBlue - deductions - BASIC_DEDUCTION_INCOME);
  const residentTaxable = Math.max(0, afterBlue - deductions - BASIC_DEDUCTION_RESIDENT);

  const incomeTax = calcIncomeTax(taxableIncome);
  const reconstructionTax = round(incomeTax * RECONSTRUCTION_RATE);
  const residentTax = calcResidentTax(residentTaxable);

  let enterpriseTax = 0;
  if (input.applyEnterpriseTax) {
    const base = Math.max(0, businessIncome - ENTERPRISE_TAX_DEDUCTION);
    enterpriseTax = round(base * ENTERPRISE_TAX_RATE);
  }

  const totalTax = incomeTax + reconstructionTax + residentTax + enterpriseTax;
  const totalDeduction = totalTax + input.socialInsurance;
  const takeHome = round(businessIncome - totalDeduction);
  const effectiveRate = businessIncome > 0 ? totalDeduction / businessIncome : 0;

  return {
    businessIncome,
    taxableIncome,
    incomeTax,
    reconstructionTax,
    residentTax,
    enterpriseTax,
    socialInsurance: input.socialInsurance,
    totalTax,
    totalDeduction,
    takeHome,
    effectiveRate,
    marginalRate: marginalRate(taxableIncome),
  };
}

// ---- 副業（会社員）モード ----

export interface SideInput {
  salaryGross: number; // 本業の額面年収
  sideRevenue: number; // 副業の売上
  sideExpenses: number; // 副業の経費
  filing: FilingType; // 副業の申告区分
}

export interface SideBreakdown {
  sideIncome: number; // 副業所得（売上−経費−青色控除）
  incomeTaxIncrease: number; // 副業で増える所得税
  reconstructionIncrease: number; // 復興特別所得税の増加
  residentIncrease: number; // 副業で増える住民税
  totalTaxIncrease: number; // 増える税金合計
  sideTakeHome: number; // 副業の手取り
  marginalRate: number; // 本業を含めた限界税率（所得税）
  needsFiling: boolean; // 確定申告が必要か（副業所得20万円超）
}

/**
 * 会社員の副業手取り。本業の課税所得の上に副業所得が乗る前提で、
 * 「副業がある場合」と「ない場合」の税額差＝副業で増える税金を出す。
 * 本業の所得控除は基礎控除+給与所得控除のみを簡易に考慮（社保等はスコープ外の簡易版）。
 */
export function calcSide(input: SideInput): SideBreakdown {
  const salaryTaxable = Math.max(
    0,
    salaryIncome(input.salaryGross) - BASIC_DEDUCTION_INCOME
  );
  const salaryResidentTaxable = Math.max(
    0,
    salaryIncome(input.salaryGross) - BASIC_DEDUCTION_RESIDENT
  );

  const sideRaw = Math.max(0, input.sideRevenue - input.sideExpenses);
  const sideIncome = Math.max(0, sideRaw - BLUE_DEDUCTION[input.filing]);

  // 所得税の増分
  const incomeTaxBase = calcIncomeTax(salaryTaxable);
  const incomeTaxWithSide = calcIncomeTax(salaryTaxable + sideIncome);
  const incomeTaxIncrease = Math.max(0, incomeTaxWithSide - incomeTaxBase);
  const reconstructionIncrease = round(incomeTaxIncrease * RECONSTRUCTION_RATE);

  // 住民税の増分（所得割10%、均等割は本業で発生済みのため増分に含めない）
  const residentBase = round(salaryResidentTaxable * RESIDENT_TAX_RATE);
  const residentWithSide = round(
    (salaryResidentTaxable + sideIncome) * RESIDENT_TAX_RATE
  );
  const residentIncrease = Math.max(0, residentWithSide - residentBase);

  const totalTaxIncrease =
    incomeTaxIncrease + reconstructionIncrease + residentIncrease;
  const sideTakeHome = round(sideRaw - totalTaxIncrease);

  return {
    sideIncome,
    incomeTaxIncrease,
    reconstructionIncrease,
    residentIncrease,
    totalTaxIncrease,
    sideTakeHome,
    marginalRate: marginalRate(salaryTaxable + sideIncome),
    needsFiling: sideIncome > 200_000,
  };
}

/** 売上を段階的に増やしたときの手取り増分 */
export interface RevenueStep {
  revenue: number;
  takeHome: number;
  increment: number; // 前ステップからの手取り増分
  marginalTakeHomeRate: number; // 増分売上に対する手取り率
}

export function freelanceRevenueSteps(
  base: FreelanceInput,
  steps = 5,
  stepAmount = 100_000
): RevenueStep[] {
  const start = Math.max(0, base.revenue);
  const rows: RevenueStep[] = [];
  let prevTakeHome = calcFreelance({ ...base, revenue: start }).takeHome;

  for (let i = 0; i <= steps; i++) {
    const revenue = start + stepAmount * i;
    const takeHome = calcFreelance({ ...base, revenue }).takeHome;
    const increment = i === 0 ? 0 : takeHome - prevTakeHome;
    rows.push({
      revenue,
      takeHome,
      increment,
      marginalTakeHomeRate:
        i === 0 || stepAmount === 0 ? 0 : increment / stepAmount,
    });
    prevTakeHome = takeHome;
  }
  return rows;
}

export function sideRevenueSteps(
  base: SideInput,
  steps = 5,
  stepAmount = 100_000
): RevenueStep[] {
  const start = Math.max(0, base.sideRevenue);
  const rows: RevenueStep[] = [];
  let prevTakeHome = calcSide({ ...base, sideRevenue: start }).sideTakeHome;

  for (let i = 0; i <= steps; i++) {
    const sideRevenue = start + stepAmount * i;
    const takeHome = calcSide({ ...base, sideRevenue }).sideTakeHome;
    const increment = i === 0 ? 0 : takeHome - prevTakeHome;
    rows.push({
      revenue: sideRevenue,
      takeHome,
      increment,
      marginalTakeHomeRate:
        i === 0 || stepAmount === 0 ? 0 : increment / stepAmount,
    });
    prevTakeHome = takeHome;
  }
  return rows;
}

/** 申告区分を変えた場合の比較用ラベル */
export function alternateFiling(current: FilingType): {
  filing: FilingType;
  label: string;
} {
  if (current === "white") {
    return { filing: "blue65", label: "青色65万円控除" };
  }
  return { filing: "white", label: "白色申告" };
}

export interface CompareResult {
  label: string;
  takeHome: number;
  diff: number;
}

export function compareFreelanceFiling(
  input: FreelanceInput
): CompareResult {
  const alt = alternateFiling(input.filing);
  const current = calcFreelance(input);
  const other = calcFreelance({ ...input, filing: alt.filing });
  return {
    label: alt.label,
    takeHome: other.takeHome,
    diff: current.takeHome - other.takeHome,
  };
}

export function compareSideFiling(input: SideInput): CompareResult {
  const alt = alternateFiling(input.filing);
  const current = calcSide(input);
  const other = calcSide({ ...input, filing: alt.filing });
  return {
    label: alt.label,
    takeHome: other.sideTakeHome,
    diff: current.sideTakeHome - other.sideTakeHome,
  };
}
