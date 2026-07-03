export type { Article, ArticleSection, ArticleFaq } from "./types";
export { ARTICLE_FILTERS, formatArticleDate } from "./types";

import type { Article } from "./types";
import { fukugyoTaxBasics } from "./posts/fukugyo-tax-basics";
import { fukugyo20manRule } from "./posts/fukugyo-20man-rule";
import { fukugyoTedoriSimulator } from "./posts/fukugyo-tedori-simulator";
import { aoiro65Benefit } from "./posts/aoiro-65-benefit";
import { aoiroVsShiroTedori } from "./posts/aoiro-vs-shiro-tedori";
import { freelanceTedoriSimulator } from "./posts/freelance-tedori-simulator";
import { freelanceInsuranceBasics } from "./posts/freelance-insurance-basics";
import { freelance500manTedori } from "./posts/freelance-500man-tedori";
import { accountingSoftFukugyo } from "./posts/accounting-soft-fukugyo";
import { juminzeiFukugyo } from "./posts/juminzei-fukugyo";
import { keihiFukugyoList } from "./posts/keihi-fukugyo-list";
import { fukugyoKakuteiShinkoku } from "./posts/fukugyo-kakutei-shinkoku";
import { fukugyoBareTax } from "./posts/fukugyo-bare-tax";
import { freelance1000manTedori } from "./posts/freelance-1000man-tedori";
import { invoiceMenzeiTedori } from "./posts/invoice-menzei-tedori";

/** tool-intent → informational → commercial */
export const ARTICLES: Article[] = [
  fukugyoTedoriSimulator,
  freelanceTedoriSimulator,
  fukugyoTaxBasics,
  fukugyo20manRule,
  fukugyoKakuteiShinkoku,
  fukugyoBareTax,
  juminzeiFukugyo,
  keihiFukugyoList,
  invoiceMenzeiTedori,
  aoiro65Benefit,
  aoiroVsShiroTedori,
  freelanceInsuranceBasics,
  freelance500manTedori,
  freelance1000manTedori,
  accountingSoftFukugyo,
];

export function getArticle(slug: string): Article | undefined {
  return ARTICLES.find((a) => a.slug === slug);
}

export function getRelatedArticles(slug: string): Article[] {
  const article = getArticle(slug);
  if (!article) return [];
  return article.relatedSlugs
    .map((s) => getArticle(s))
    .filter((a): a is Article => a !== undefined);
}
