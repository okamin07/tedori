import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ARTICLES } from "@/lib/articles";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "読みもの",
  description: "副業・フリーランスの税金、確定申告、節税、社会保険の解説。",
  alternates: { canonical: `${SITE_URL}/media` },
};

export default function MediaIndex() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-5xl px-5 py-12 sm:px-8 sm:py-16">
          <p className="text-[13px] tracking-wide text-muted">読みもの</p>
          <h1 className="serif mt-2 text-3xl font-bold text-ink">税金と手取り</h1>
          <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-ink-2">
            試算の前提を理解するための短い解説です。
          </p>

          <div className="mt-10">
            {ARTICLES.map((a) => (
              <Link key={a.slug} href={`/media/${a.slug}`} className="article-row group">
                <span className="text-[11px] text-muted">{a.updated.slice(5)}</span>
                <div>
                  <span className="text-[11px] text-muted">{a.category}</span>
                  <h2 className="mt-1 text-lg font-medium leading-snug text-ink group-hover:underline group-hover:decoration-1 group-hover:underline-offset-4">
                    {a.title}
                  </h2>
                  <p className="mt-2 text-[14px] leading-relaxed text-muted">{a.description}</p>
                </div>
                <span className="hidden self-start text-[11px] text-muted sm:block">
                  {a.readMin}分
                </span>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
