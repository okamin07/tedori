import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AffiliateCard } from "@/components/AffiliateCard";
import {
  ArticleFaq,
  ArticleJsonLd,
  ArticleReferences,
  RelatedArticles,
} from "@/components/ArticleExtras";
import { ArticleRichText } from "@/components/ArticleRichText";
import { ARTICLES, formatArticleDate, getArticle } from "@/lib/articles";
import { getArticleCover } from "@/lib/articles/references";
import { offersByIds } from "@/lib/affiliate";
import { SITE_URL } from "@/lib/site";

export function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return {};
  const cover = getArticleCover(slug);
  return {
    title: article.title,
    description: article.description,
    keywords: [article.targetKeyword, article.category, "手取り", "副業", "フリーランス"],
    alternates: { canonical: `${SITE_URL}/media/${article.slug}` },
    openGraph: {
      type: "article",
      title: article.title,
      description: article.description,
      url: `${SITE_URL}/media/${article.slug}`,
      ...(cover ? { images: [{ url: `${SITE_URL}${cover.src}`, alt: cover.alt }] } : {}),
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const offers = offersByIds(article.affiliateIds);
  const cover = getArticleCover(slug);

  return (
    <>
      <ArticleJsonLd article={article} coverSrc={cover?.src} />
      <article className="page-pad mx-auto max-w-[720px]">
        <nav className="text-[12px] text-muted" aria-label="パンくず">
          <Link href="/media" className="hover:text-brand">
            読みもの
          </Link>
          <span className="mx-2">/</span>
          <span>{article.category}</span>
        </nav>

        {cover ? (
          <div className="mt-4 overflow-hidden rounded-xl border border-line bg-surface">
            <Image
              src={cover.src}
              alt={cover.alt}
              width={800}
              height={450}
              className="h-44 w-full object-cover sm:h-52"
              priority
            />
          </div>
        ) : (
          <div
            className="mt-4 h-44 rounded-xl sm:h-52"
            style={{
              background: `linear-gradient(135deg, ${article.coverFrom}, ${article.coverTo})`,
            }}
            role="img"
            aria-label={article.title}
          />
        )}

        <h1 className="mt-6 text-2xl font-bold leading-snug text-ink">{article.title}</h1>
        <p className="mt-3 text-[13px] text-muted">
          {formatArticleDate(article.updated)} · 読了目安 {article.readMin}分 · {article.category}
        </p>

        <p className="mt-6 rounded-lg border border-line bg-bg px-4 py-3 text-[15px] leading-relaxed text-ink-2">
          {article.description}
        </p>

        <div className="my-8 wf-card border-brand/25 bg-brand-soft/50 p-4 sm:p-5">
          <p className="text-[14px] font-bold text-ink">自分の数字で試算する</p>
          <p className="mt-1 text-[13px] text-ink-2">
            本業年収・売上・経費を入れると、手取りと申告区分の差がすぐわかります。
          </p>
          <Link href="/#inputs" className="btn-primary mt-3 inline-block">
            手取り比較ツール →
          </Link>
        </div>

        <div className="prose-tedori flex flex-col gap-10">
          {article.sections.map((sec) => (
            <section key={sec.heading}>
              <h2 className="text-lg font-bold text-ink">{sec.heading}</h2>
              <div className="mt-3 space-y-3">
                {sec.body.map((p, i) => (
                  <p key={i} className="text-[15px] leading-[1.85] text-ink-2">
                    <ArticleRichText text={p} />
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>

        <ArticleFaq article={article} />
        <ArticleReferences slug={slug} />

        {offers.length > 0 && (
          <section className="mt-12 border-t border-line pt-8">
            <h2 className="text-[15px] font-bold text-ink">関連サービス</h2>
            <p className="mt-1 text-[13px] text-muted">試算結果に基づく次の一手（アフィリエイト）</p>
            <div className="mt-4">
              {offers.map((o) => (
                <AffiliateCard key={o.id} offer={o} />
              ))}
            </div>
          </section>
        )}

        <RelatedArticles slug={slug} />

        <p className="mt-10 text-[11px] leading-relaxed text-muted">
          一般的な情報提供であり、税務上の助言ではありません。最新の法令・自治体ルールは必ず公式情報で確認してください。
        </p>
      </article>
    </>
  );
}
