import type { ArticleReference } from "./types";

/** 記事ごとの公式・一次情報リンク（E-E-A-T / YMYL向け） */
export const ARTICLE_REFERENCES: Record<string, ArticleReference[]> = {
  "fukugyo-tedori-simulator": [
    { label: "国税庁 確定申告書等の作成コーナー", url: "https://www.keisan.nta.go.jp/", publisher: "国税庁" },
    { label: "Tax Answer No.2020 確定申告", url: "https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/2020.htm", publisher: "国税庁" },
  ],
  "freelance-tedori-simulator": [
    { label: "国税庁 青色申告", url: "https://www.nta.go.jp/taxes/shiraberu/shinkoku/aoiro/index.htm", publisher: "国税庁" },
    { label: "日本年金機構 国民年金", url: "https://www.nenkin.go.jp/service/kokunen/kokunen/index.html", publisher: "日本年金機構" },
  ],
  "fukugyo-tax-basics": [
    { label: "Tax Answer No.1190 副業の収入", url: "https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1190.htm", publisher: "国税庁" },
    { label: "Tax Answer No.2020 確定申告", url: "https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/2020.htm", publisher: "国税庁" },
  ],
  "fukugyo-20man-rule": [
    { label: "Tax Answer No.1900 給与所得者の確定申告", url: "https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1900.htm", publisher: "国税庁" },
    { label: "Tax Answer No.1190 副業の収入", url: "https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1190.htm", publisher: "国税庁" },
  ],
  "fukugyo-kakutei-shinkoku": [
    { label: "e-Tax（国税電子申告・納税システム）", url: "https://www.e-tax.nta.go.jp/", publisher: "国税庁" },
    { label: "確定申告書等の作成コーナー", url: "https://www.keisan.nta.go.jp/", publisher: "国税庁" },
    { label: "Tax Answer No.2020 確定申告", url: "https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/2020.htm", publisher: "国税庁" },
  ],
  "fukugyo-bare-tax": [
    { label: "総務省 住民税（特別徴収）", url: "https://www.soumu.go.jp/main_sosiki/jichi_zeisei/czaisei/czaisei_seido/juminzei/01-01.html", publisher: "総務省" },
    { label: "Tax Answer No.1900 給与所得者の確定申告", url: "https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1900.htm", publisher: "国税庁" },
  ],
  "juminzei-fukugyo": [
    { label: "総務省 住民税の仕組み", url: "https://www.soumu.go.jp/main_sosiki/jichi_zeisei/czaisei/czaisei_seido/juminzei/01-01.html", publisher: "総務省" },
    { label: "Tax Answer No.1900 給与所得者の確定申告", url: "https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1900.htm", publisher: "国税庁" },
  ],
  "keihi-fukugyo-list": [
    { label: "Tax Answer No.1370 必要経費", url: "https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1370.htm", publisher: "国税庁" },
    { label: "Tax Answer No.1190 副業の収入", url: "https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1190.htm", publisher: "国税庁" },
  ],
  "invoice-menzei-tedori": [
    { label: "インボイス制度 適格請求書等保存方式", url: "https://www.invoice-kohyo.nta.go.jp/", publisher: "国税庁" },
    { label: "Tax Answer No.6100 インボイス制度", url: "https://www.nta.go.jp/taxes/shiraberu/taxanswer/zeimokubetsu/shotoku/6100.htm", publisher: "国税庁" },
  ],
  "aoiro-65-benefit": [
    { label: "国税庁 青色申告", url: "https://www.nta.go.jp/taxes/shiraberu/shinkoku/aoiro/index.htm", publisher: "国税庁" },
    { label: "Tax Answer No.2070 青色申告特別控除", url: "https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/2070.htm", publisher: "国税庁" },
  ],
  "aoiro-vs-shiro-tedori": [
    { label: "国税庁 青色申告", url: "https://www.nta.go.jp/taxes/shiraberu/shinkoku/aoiro/index.htm", publisher: "国税庁" },
    { label: "Tax Answer No.2070 青色申告特別控除", url: "https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/2070.htm", publisher: "国税庁" },
  ],
  "freelance-insurance-basics": [
    { label: "日本年金機構 国民年金保険料", url: "https://www.nenkin.go.jp/service/kokunen/kokunen/hokenryo/index.html", publisher: "日本年金機構" },
    { label: "全国国民健康保険協会", url: "https://www.kokuho-nenpo.or.jp/", publisher: "全国国民健康保険協会" },
  ],
  "freelance-500man-tedori": [
    { label: "国税庁 青色申告", url: "https://www.nta.go.jp/taxes/shiraberu/shinkoku/aoiro/index.htm", publisher: "国税庁" },
    { label: "日本年金機構 国民年金", url: "https://www.nenkin.go.jp/service/kokunen/kokunen/index.html", publisher: "日本年金機構" },
  ],
  "freelance-1000man-tedori": [
    { label: "国税庁 青色申告", url: "https://www.nta.go.jp/taxes/shiraberu/shinkoku/aoiro/index.htm", publisher: "国税庁" },
    { label: "Tax Answer No.2070 青色申告特別控除", url: "https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/2070.htm", publisher: "国税庁" },
  ],
  "accounting-soft-fukugyo": [
    { label: "e-Tax（国税電子申告・納税システム）", url: "https://www.e-tax.nta.go.jp/", publisher: "国税庁" },
    { label: "国税庁 青色申告", url: "https://www.nta.go.jp/taxes/shiraberu/shinkoku/aoiro/index.htm", publisher: "国税庁" },
  ],
};

export function getArticleReferences(slug: string): ArticleReference[] {
  return ARTICLE_REFERENCES[slug] ?? [];
}

/** カテゴリ別アイキャッチ（SVG） */
export const ARTICLE_COVER_IMAGES: Record<string, { src: string; alt: string }> = {
  "fukugyo-tedori-simulator": { src: "/articles/cover-side-income.svg", alt: "副業の手取り計算のイメージ図" },
  "freelance-tedori-simulator": { src: "/articles/cover-freelance.svg", alt: "フリーランスの手取り計算のイメージ図" },
  "fukugyo-tax-basics": { src: "/articles/cover-side-income.svg", alt: "副業の税金と手取りの関係図" },
  "fukugyo-20man-rule": { src: "/articles/cover-filing.svg", alt: "20万ルールと確定申告の関係図" },
  "fukugyo-kakutei-shinkoku": { src: "/articles/cover-filing.svg", alt: "副業の確定申告手順のイメージ" },
  "fukugyo-bare-tax": { src: "/articles/cover-side-income.svg", alt: "副業と住民税・会社への影響のイメージ" },
  "juminzei-fukugyo": { src: "/articles/cover-filing.svg", alt: "副業の住民税申告のイメージ" },
  "keihi-fukugyo-list": { src: "/articles/cover-expense.svg", alt: "副業の経費のイメージ図" },
  "invoice-menzei-tedori": { src: "/articles/cover-invoice.svg", alt: "インボイス制度と免税事業者のイメージ" },
  "aoiro-65-benefit": { src: "/articles/cover-aoiro.svg", alt: "青色申告65万控除のイメージ図" },
  "aoiro-vs-shiro-tedori": { src: "/articles/cover-aoiro.svg", alt: "青色申告と白色申告の比較イメージ" },
  "freelance-insurance-basics": { src: "/articles/cover-freelance.svg", alt: "フリーランスの社会保険のイメージ" },
  "freelance-500man-tedori": { src: "/articles/cover-freelance.svg", alt: "フリーランス500万売上の手取りイメージ" },
  "freelance-1000man-tedori": { src: "/articles/cover-freelance.svg", alt: "フリーランス1000万売上の手取りイメージ" },
  "accounting-soft-fukugyo": { src: "/articles/cover-filing.svg", alt: "副業向け会計ソフト選びのイメージ" },
};

export function getArticleCover(slug: string) {
  return ARTICLE_COVER_IMAGES[slug];
}
