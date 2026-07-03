import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AffiliateCard } from "@/components/AffiliateCard";
import { ARTICLES, formatArticleDate, getArticle } from "@/lib/articles";
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
  return {
    title: article.title,
    description: article.description,
    alternates: { canonical: `${SITE_URL}/media/${article.slug}` },
    openGraph: {
      type: "article",
      title: article.title,
      description: article.description,
      url: `${SITE_URL}/media/${article.slug}`,
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

  return (
    <article className="page-pad mx-auto max-w-[720px]">
      <nav className="text-[12px] text-muted">
        <Link href="/media" className="hover:text-brand">
          読みもの
        </Link>
        <span className="mx-2">/</span>
        {article.category}
      </nav>

      <div
        className="mt-4 h-40 rounded-xl sm:h-48"
        style={{
          background: `linear-gradient(135deg, ${article.coverFrom}, ${article.coverTo})`,
        }}
      />

      <h1 className="mt-6 text-2xl font-bold leading-snug text-ink sm:text-[1.75rem]">
        {article.title}
      </h1>
      <p className="mt-3 text-[13px] text-muted">
        {formatArticleDate(article.updated)} · {article.readMin}分で読める
      </p>

      <p className="mt-6 text-[16px] leading-relaxed text-ink-2">{article.description}</p>

      <div className="my-8 wf-card border-brand/20 bg-brand-soft/40 p-4">
        <p className="text-[13px] font-semibold text-ink">自分の数字を比較する</p>
        <Link href="/" className="mt-1 inline-block text-[13px] font-semibold text-brand">
          比較ダッシュボードを開く →
        </Link>
      </div>

      <div className="flex flex-col gap-8">
        {article.sections.map((sec) => (
          <section key={sec.heading}>
            <h2 className="text-lg font-bold text-ink">{sec.heading}</h2>
            <div className="mt-3 space-y-3">
              {sec.body.map((p, i) => (
                <p key={i} className="text-[15px] leading-[1.85] text-ink-2">
                  {p}
                </p>
              ))}
            </div>
          </section>
        ))}
      </div>

      {offers.length > 0 && (
        <section className="mt-12 border-t border-line pt-8">
          <h2 className="text-[13px] font-semibold text-muted">関連</h2>
          <div className="mt-2">
            {offers.map((o) => (
              <AffiliateCard key={o.id} offer={o} />
            ))}
          </div>
        </section>
      )}

      <p className="mt-10 text-[11px] text-muted">
        一般的な情報提供であり、税務上の助言ではありません。
      </p>
    </article>
  );
}
