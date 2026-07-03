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
      description: "副業・独立の手取りを2シナリオで比較。レーダーチャートと差分表で申告区分の違いを可視化。",
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
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
          <Simulator />
        </div>

        <section className="border-t border-line bg-surface/60">
          <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
            <div className="flex items-baseline justify-between">
              <h2 className="text-sm font-bold text-ink">読みもの</h2>
              <Link href="/media" className="text-[13px] font-semibold text-brand hover:underline">
                すべて →
              </Link>
            </div>
            <div className="mt-4 grid gap-0 sm:grid-cols-2 sm:gap-6">
              {ARTICLES.slice(0, 2).map((a) => (
                <Link
                  key={a.slug}
                  href={`/media/${a.slug}`}
                  className="article-row group rounded-xl px-2 transition hover:bg-brand-soft/50"
                >
                  <p className="font-semibold text-ink group-hover:text-brand">{a.title}</p>
                  <p className="mt-1 text-[12px] text-muted">
                    {a.readMin}分 · {a.category}
                  </p>
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
