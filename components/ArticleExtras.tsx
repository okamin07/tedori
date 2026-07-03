import Link from "next/link";
import { formatArticleDate, getRelatedArticles, type Article } from "@/lib/articles";
import { SITE_URL } from "@/lib/site";

export function ArticleJsonLd({ article }: { article: Article }) {
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: article.title,
        description: article.description,
        dateModified: article.updated,
        datePublished: article.updated,
        author: { "@type": "Organization", name: "TEDORI" },
        publisher: { "@type": "Organization", name: "TEDORI" },
        mainEntityOfPage: `${SITE_URL}/media/${article.slug}`,
        keywords: article.targetKeyword,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "読みもの", item: `${SITE_URL}/media` },
          { "@type": "ListItem", position: 2, name: article.title, item: `${SITE_URL}/media/${article.slug}` },
        ],
      },
      ...(article.faq
        ? [
            {
              "@type": "FAQPage",
              mainEntity: article.faq.map((f) => ({
                "@type": "Question",
                name: f.q,
                acceptedAnswer: { "@type": "Answer", text: f.a },
              })),
            },
          ]
        : []),
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function RelatedArticles({ slug }: { slug: string }) {
  const related = getRelatedArticles(slug);
  if (related.length === 0) return null;

  return (
    <section className="mt-12 border-t border-line pt-8">
      <h2 className="text-[15px] font-bold text-ink">関連記事</h2>
      <ul className="mt-4 space-y-3">
        {related.map((a) => (
          <li key={a.slug}>
            <Link href={`/media/${a.slug}`} className="group block rounded-lg border border-line p-4 hover:border-brand/30 hover:bg-brand-soft/30">
              <p className="text-[11px] font-medium text-muted">{a.category}</p>
              <p className="mt-1 font-semibold text-ink group-hover:text-brand">{a.title}</p>
              <p className="mt-1 text-[12px] text-muted">
                {formatArticleDate(a.updated)} · {a.readMin}分
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function ArticleFaq({ article }: { article: Article }) {
  if (!article.faq?.length) return null;
  return (
    <section className="mt-10">
      <h2 className="text-lg font-bold text-ink">よくある質問</h2>
      <dl className="mt-4 space-y-4">
        {article.faq.map((f) => (
          <div key={f.q} className="wf-card p-4">
            <dt className="font-semibold text-ink">{f.q}</dt>
            <dd className="mt-2 text-[14px] leading-relaxed text-ink-2">{f.a}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
