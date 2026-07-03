/* 簡易検証スクリプト: pnpm tsx lib/tax.test.ts */
import { calcFreelance, calcSide, calcIncomeTax, salaryIncomeDeduction } from "./tax";

let failed = 0;
function eq(name: string, actual: number, expected: number, tol = 1) {
  const ok = Math.abs(actual - expected) <= tol;
  if (!ok) {
    failed++;
    console.error(`✗ ${name}: got ${actual}, expected ${expected}`);
  } else {
    console.log(`✓ ${name}: ${actual}`);
  }
}

// 所得税速算表
eq("incomeTax 1,000,000", calcIncomeTax(1_000_000), 50_000);
eq("incomeTax 3,000,000", calcIncomeTax(3_000_000), 202_500);
eq("incomeTax 5,000,000", calcIncomeTax(5_000_000), 572_500);

// 給与所得控除
eq("salaryDeduction 3,000,000", salaryIncomeDeduction(3_000_000), 980_000);
eq("salaryDeduction 6,000,000", salaryIncomeDeduction(6_000_000), 1_640_000);

// フリーランス
const f = calcFreelance({
  revenue: 5_000_000,
  expenses: 1_000_000,
  filing: "blue65",
  socialInsurance: 600_000,
  otherDeductions: 0,
  applyEnterpriseTax: true,
});
eq("freelance businessIncome", f.businessIncome, 4_000_000);
eq("freelance taxableIncome", f.taxableIncome, 2_270_000);
eq("freelance incomeTax", f.incomeTax, 129_500);
eq("freelance residentTax", f.residentTax, 237_000);
eq("freelance enterpriseTax", f.enterpriseTax, 55_000);

// 副業
const s = calcSide({
  salaryGross: 5_000_000,
  sideRevenue: 500_000,
  sideExpenses: 100_000,
  filing: "white",
});
eq("side sideIncome", s.sideIncome, 400_000);
console.log("side incomeTaxIncrease:", s.incomeTaxIncrease);
console.log("side residentIncrease:", s.residentIncrease);
console.log("side sideTakeHome:", s.sideTakeHome);
console.log("side needsFiling:", s.needsFiling);

if (failed > 0) {
  console.error(`\n${failed} test(s) failed`);
  process.exit(1);
} else {
  console.log("\nAll assertions passed");
}
