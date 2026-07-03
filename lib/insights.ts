import type { AffiliateOffer } from "./affiliate";
import { AFFILIATE_OFFERS } from "./affiliate";
import type { SideBreakdown, TaxBreakdown } from "./tax";
import { yen } from "./format";

export interface ContextualInsight {
  headline: string;
  body: string;
  offer: AffiliateOffer;
}

function offer(id: string): AffiliateOffer {
  return AFFILIATE_OFFERS.find((o) => o.id === id)!;
}

/** 試算結果から1本だけ、数字入りのCTAを選ぶ */
export function insightForFreelance(
  data: TaxBreakdown,
  compareTakeHome: number,
  compareLabel: string
): ContextualInsight {
  const diff = data.takeHome - compareTakeHome;

  if (diff >= 50_000) {
    return {
      headline: `${compareLabel}より手取り ${yen(diff)} 多い`,
      body: "青色申告の手続きがまだなら、65万円控除の申請を先に済ませる価値があります。",
      offer: offer("kaigyo"),
    };
  }

  if (data.effectiveRate >= 0.25) {
    return {
      headline: `実効負担 ${(data.effectiveRate * 100).toFixed(0)}% — 経費の取りこぼしに注意`,
      body: `経費10万円を計上できれば、概算で手取り ${yen(Math.round(10_000 * data.marginalRate))} 程度の改善余地があります。`,
      offer: offer("accounting"),
    };
  }

  if (data.businessIncome >= 5_000_000) {
    return {
      headline: "所得が上がってきたタイミング",
      body: "節税の打ち手は所得が上がるほど効きます。無料相談で自分に合う専門家を探せます。",
      offer: offer("tax-advisor"),
    };
  }

  return {
    headline: "経費を分けて記録する習慣から",
    body: "プライベートと事業用を分けると、確定申告時の漏れが減ります。",
    offer: offer("card"),
  };
}

export function insightForSide(
  data: SideBreakdown,
  compareTakeHome: number,
  compareLabel: string
): ContextualInsight {
  const diff = data.sideTakeHome - compareTakeHome;

  if (data.needsFiling) {
    return {
      headline: "確定申告が必要なライン",
      body: `副業所得20万円超。会計ソフトなら経費入力から申告書まで一気通貫で進められます。`,
      offer: offer("accounting"),
    };
  }

  if (diff >= 30_000) {
    return {
      headline: `${compareLabel}より手取り ${yen(diff)} 多い`,
      body: "申告区分を変えるだけで税金が変わります。手続きの準備から始めましょう。",
      offer: offer("kaigyo"),
    };
  }

  if (data.marginalRate >= 0.2) {
    return {
      headline: `限界税率 ${(data.marginalRate * 100).toFixed(0)}%`,
      body: `副業であと10万円稼ぐと、手取りは概算 ${yen(Math.round(100_000 * (1 - data.marginalRate - 0.1)))} 程度の増え方になります。`,
      offer: offer("accounting"),
    };
  }

  return {
    headline: "副業の記帳は早めに",
    body: "売上が伸びる前に経費の記録を始めると、申告区分の選択肢が広がります。",
    offer: offer("accounting"),
  };
}
