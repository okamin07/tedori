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
        <div className="mx-auto max-w-lg px-4 py-8 sm:max-w-2xl">
          <h1 className="text-xl font-bold text-ink">読みもの</h1>
          <p className="mt-2 text-[14px] text-ink-2">
            試算の前提を理解するための短い解説です。
          </p>

          <div className="mt-6">
            {ARTICLES.map((a) => (
              <Link key={a.slug} href={`/media/${a.slug}`} className="article-row group block">
                <p className="text-[11px] text-muted">{a.category} · {a.readMin}分</p>
                <h2 className="mt-1 text-[15px] font-semibold text-ink group-hover:text-brand">
                  {a.title}
                </h2>
                <p className="mt-1 text-[13px] text-muted">{a.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
