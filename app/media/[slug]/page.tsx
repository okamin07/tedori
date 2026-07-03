import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AffiliateCard } from "@/components/AffiliateCard";
import { ARTICLES, getArticle } from "@/lib/articles";
import { offersByIds } from "@/lib/affiliate";

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
    alternates: { canonical: `https://tedori.app/media/${article.slug}` },
    openGraph: {
      type: "article",
      title: article.title,
      description: article.description,
      url: `https://tedori.app/media/${article.slug}`,
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
        <article className="mx-auto max-w-2xl px-5 py-12 sm:px-8 sm:py-16">
          <nav className="text-[11px] text-muted">
            <Link href="/media" className="hover:text-ink">
              読みもの
            </Link>
            <span className="mx-2">/</span>
            {article.category}
          </nav>

          <h1 className="serif mt-6 text-[1.75rem] font-bold leading-snug text-ink sm:text-[2rem]">
            {article.title}
          </h1>
          <p className="mt-4 text-[13px] text-muted">
            {article.updated} · 約{article.readMin}分
          </p>

          <p className="mt-8 border-l-2 border-ink pl-4 text-[15px] leading-relaxed text-ink-2">
            {article.description}
          </p>

          <div className="my-10 border border-line bg-sheet px-5 py-4">
            <p className="text-[13px] font-medium text-ink">自分の数字を試算する</p>
            <Link
              href="/#simulator"
              className="mt-2 inline-block text-[13px] text-ink-2 underline decoration-1 underline-offset-4 hover:text-ink"
            >
              手取り試算を開く →
            </Link>
          </div>

          <div className="flex flex-col gap-10">
            {article.sections.map((sec) => (
              <section key={sec.heading}>
                <h2 className="serif text-xl font-bold text-ink">{sec.heading}</h2>
                <div className="mt-4 flex flex-col gap-4">
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
            <section className="mt-14 border-t border-line-strong pt-8">
              <h2 className="text-[13px] font-medium tracking-[0.12em] text-muted">関連</h2>
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
