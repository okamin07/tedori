export interface ArticleSection {
  heading: string;
  body: string[];
}

export interface ArticleFaq {
  q: string;
  a: string;
}

export interface ArticleReference {
  label: string;
  url: string;
  publisher?: string;
}

export interface Article {
  slug: string;
  title: string;
  description: string;
  category: string;
  /** SEO主キーワード */
  targetKeyword: string;
  /** Know / Do / Compare / Commercial */
  searchIntent: string;
  readMin: number;
  updated: string;
  affiliateIds: string[];
  sections: ArticleSection[];
  coverFrom: string;
  coverTo: string;
  filterTag: string;
  relatedSlugs: string[];
  faq?: ArticleFaq[];
}

export const ARTICLE_FILTERS = [
  "すべて",
  "副業",
  "フリーランス",
  "確定申告",
  "青色申告",
  "社会保険",
  "節税",
] as const;

export function formatArticleDate(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}
