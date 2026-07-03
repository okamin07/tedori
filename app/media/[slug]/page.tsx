import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AffiliateCard } from "@/components/AffiliateCard";
import { ARTICLES, getArticle } from "@/lib/articles";
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
    <>
      <Header />
      <main className="flex-1">
        <article className="mx-auto max-w-lg px-4 py-8 sm:max-w-2xl">
          <nav className="text-[11px] text-muted">
            <Link href="/media" className="hover:text-brand">
              読みもの
            </Link>
            <span className="mx-2">/</span>
            {article.category}
          </nav>

          <h1 className="mt-4 text-xl font-bold leading-snug text-ink sm:text-2xl">
            {article.title}
          </h1>
          <p className="mt-3 text-[13px] text-muted">
            {article.updated} · 約{article.readMin}分
          </p>

          <p className="mt-6 text-[15px] leading-relaxed text-ink-2">
            {article.description}
          </p>

          <div className="my-8 rounded-xl border border-brand/30 bg-brand-soft px-4 py-3">
            <p className="text-[13px] font-medium text-ink">自分の数字を比較する</p>
            <Link href="/#simulator" className="mt-1 inline-block text-[13px] font-medium text-brand">
              TEDORIで試算 →
            </Link>
          </div>

          <div className="flex flex-col gap-8">
            {article.sections.map((sec) => (
              <section key={sec.heading}>
                <h2 className="text-lg font-bold text-ink">{sec.heading}</h2>
                <div className="mt-3 flex flex-col gap-3">
                  {sec.body.map((p, i) => (
                    <p key={i} className="text-[15px] leading-[1.8] text-ink-2">
                      {p}
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </div>

          {offers.length > 0 && (
            <section className="mt-10 border-t border-line pt-6">
              <h2 className="text-[13px] font-semibold text-muted">関連</h2>
              <div className="mt-2 divide-y divide-line">
                {offers.map((o) => (
                  <AffiliateCard key={o.id} offer={o} />
                ))}
              </div>
            </section>
          )}

          <p className="mt-12 text-[11px] leading-relaxed text-muted">
            一般的な情報提供であり、税務上の助言ではありません。
          </p>
        </article>
      </main>
      <Footer />
    </>
  );
}
