import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Simulator } from "@/components/Simulator";
import { ARTICLES } from "@/lib/articles";
import { SITE_URL } from "@/lib/site";

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "TEDORI",
      applicationCategory: "FinanceApplication",
      operatingSystem: "Web",
      description:
        "副業・フリーランスの手取りをシナリオ比較。申告区分や売上の変化による差分を並べて試算。",
      offers: { "@type": "Offer", price: "0", priceCurrency: "JPY" },
      inLanguage: "ja",
      url: SITE_URL,
    },
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-lg px-4 py-6 sm:max-w-2xl sm:py-8">
          <Simulator />
        </div>

        <section className="border-t border-line bg-surface">
          <div className="mx-auto max-w-lg px-4 py-8 sm:max-w-2xl">
            <div className="flex items-baseline justify-between">
              <h2 className="text-[13px] font-semibold text-ink">読みもの</h2>
              <Link href="/media" className="text-[12px] text-brand hover:underline">
                すべて
              </Link>
            </div>
            <div className="mt-2">
              {ARTICLES.slice(0, 2).map((a) => (
                <Link key={a.slug} href={`/media/${a.slug}`} className="article-row group block">
                  <p className="text-[15px] font-medium text-ink group-hover:text-brand">
                    {a.title}
                  </p>
                  <p className="mt-0.5 text-[12px] text-muted">{a.readMin}分 · {a.category}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
