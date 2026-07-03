export const yen = (n: number): string =>
  "¥" + Math.round(n).toLocaleString("ja-JP");

export const man = (n: number): string => {
  const v = n / 10000;
  return (Number.isInteger(v) ? v.toString() : v.toFixed(1)) + "万円";
};

export const pct = (rate: number, digits = 1): string =>
  (rate * 100).toFixed(digits) + "%";
