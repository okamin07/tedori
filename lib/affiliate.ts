/**
 * アフィリエイト枠の定義。
 * href は Vercel の環境変数で ASP 計測リンクに差し替える。
 * 未設定時は各サービスの公式LP（計測なし）にフォールバック。
 */
export interface AffiliateOffer {
  id: string;
  category: string;
  title: string;
  desc: string;
  cta: string;
  href: string;
  accent?: "brand" | "amber";
}

const DEFAULT_LINKS = {
  accounting:
    "https://www.freee.co.jp/?utm_source=tedori&utm_medium=affiliate&utm_campaign=accounting",
  kaigyo:
    "https://www.freee.co.jp/kaigyo/?utm_source=tedori&utm_medium=affiliate&utm_campaign=kaigyo",
  card:
    "https://biz.moneyforward.com/accounting/?utm_source=tedori&utm_medium=affiliate&utm_campaign=card",
  taxAdvisor:
    "https://www.freee.co.jp/tax-accountant/?utm_source=tedori&utm_medium=affiliate&utm_campaign=tax-advisor",
} as const;

function affiliateUrl(envKey: string, fallback: string): string {
  const fromEnv = process.env[envKey]?.trim();
  return fromEnv && fromEnv.startsWith("http") ? fromEnv : fallback;
}

export const AFFILIATE_OFFERS: AffiliateOffer[] = [
  {
    id: "accounting",
    category: "会計ソフト",
    title: "経費を漏れなく計上して、手取りを増やす",
    desc: "確定申告ソフトを使えば、青色申告65万円控除も自動で対応。経費の取りこぼしは手取りの取りこぼし。",
    cta: "会計ソフトを無料で試す",
    href: affiliateUrl("NEXT_PUBLIC_AFFILIATE_ACCOUNTING", DEFAULT_LINKS.accounting),
    accent: "brand",
  },
  {
    id: "kaigyo",
    category: "開業支援",
    title: "開業届・青色申告承認申請を無料で作成",
    desc: "青色申告の65万円控除には事前申請が必要。開業freeeなどのツールなら質問に答えるだけで書類が完成。",
    cta: "開業書類を無料で作る",
    href: affiliateUrl("NEXT_PUBLIC_AFFILIATE_KAIGYO", DEFAULT_LINKS.kaigyo),
    accent: "brand",
  },
  {
    id: "card",
    category: "事業用カード",
    title: "事業用クレジットカードで経費管理を自動化",
    desc: "プライベートと分ければ記帳がラクに。ポイント還元で実質コストも下がる。",
    cta: "事業用カードを比較する",
    href: affiliateUrl("NEXT_PUBLIC_AFFILIATE_CARD", DEFAULT_LINKS.card),
    accent: "amber",
  },
  {
    id: "tax-advisor",
    category: "税理士紹介",
    title: "所得が増えてきたら、税理士に相談",
    desc: "節税の打ち手は所得が上がるほど効く。無料の税理士紹介で自分に合う専門家を探せる。",
    cta: "税理士を無料で紹介してもらう",
    href: affiliateUrl("NEXT_PUBLIC_AFFILIATE_TAX_ADVISOR", DEFAULT_LINKS.taxAdvisor),
    accent: "amber",
  },
];

export function offersByIds(ids: string[]): AffiliateOffer[] {
  return ids
    .map((id) => AFFILIATE_OFFERS.find((o) => o.id === id))
    .filter((o): o is AffiliateOffer => Boolean(o));
}
