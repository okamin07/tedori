import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Simulator } from "@/components/Simulator";
import { ARTICLES } from "@/lib/articles";

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "TEDORI",
      applicationCategory: "FinanceApplication",
      operatingSystem: "Web",
      description:
        "副業・フリーランスの手取りを試算する無料ツール。所得税・住民税・社会保険料を概算。",
      offers: { "@type": "Offer", price: "0", priceCurrency: "JPY" },
      inLanguage: "ja",
      url: "https://tedori.app",
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
        <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8 sm:py-14">
          <Simulator />
        </div>

        <section className="border-t border-line-strong bg-paper-2">
          <div className="mx-auto max-w-5xl px-5 py-12 sm:px-8">
            <div className="flex items-baseline justify-between">
              <h2 className="serif text-xl font-bold text-ink">読みもの</h2>
              <Link href="/media" className="text-[13px] text-ink-2 hover:text-ink">
                一覧 →
              </Link>
            </div>
            <div className="mt-4">
              {ARTICLES.map((a) => (
                <Link key={a.slug} href={`/media/${a.slug}`} className="article-row group">
                  <span className="text-[11px] leading-snug text-muted">{a.category}</span>
                  <div>
                    <h3 className="font-medium leading-snug text-ink group-hover:underline group-hover:decoration-1 group-hover:underline-offset-4">
                      {a.title}
                    </h3>
                    <p className="mt-1 hidden text-[13px] text-muted sm:block line-clamp-1">
                      {a.description}
                    </p>
                  </div>
                  <span className="hidden self-center text-[11px] text-muted sm:block">
                    {a.readMin}分
                  </span>
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
