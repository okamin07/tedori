"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ARTICLE_FILTERS,
  ARTICLES,
  formatArticleDate,
  type Article,
} from "@/lib/articles";
import { getArticleCover } from "@/lib/articles/references";

export function MediaIndex() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<string>("すべて");

  const filtered = useMemo(() => {
    return ARTICLES.filter((a) => {
      const matchFilter =
        filter === "すべて" ||
        a.filterTag === filter ||
        a.category.includes(filter);
      const q = query.trim().toLowerCase();
      const matchQuery =
        !q ||
        a.title.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q) ||
        a.targetKeyword.toLowerCase().includes(q);
      return matchFilter && matchQuery;
    });
  }, [query, filter]);

  return (
    <div className="page-pad mx-auto max-w-[960px]">
      <h1 className="page-title">読みもの</h1>
      <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-ink-2">
        副業の税金・手取り計算、青色申告65万控除、住民税、確定申告ソフト選びまで。
        検索意図別に整理した解説記事です。数字は
          <Link href="/#inputs" className="font-semibold text-brand hover:underline">
          手取り比較ツール
        </Link>
        で試算できます。
      </p>

      <div className="mt-6">
        <input
          type="search"
          placeholder="例：副業 20万 住民税 青色申告"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="search-input w-full"
          aria-label="記事を検索"
        />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {ARTICLE_FILTERS.map((tag) => (
          <button key={tag} type="button" className="chip" data-active={filter === tag} onClick={() => setFilter(tag)}>
            {tag}
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((a) => (
          <ArticleCard key={a.slug} article={a} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="mt-12 text-center text-[14px] text-muted">該当する記事がありません</p>
      )}

      <section className="wf-card mt-12 p-5 sm:p-6">
        <h2 className="text-[15px] font-bold text-ink">まず数字を知りたい方へ</h2>
        <p className="mt-2 text-[13px] text-ink-2">
          記事を読む前に、自分の本業年収・副業売上・経費を入れて手取りの差を確認するのが早いです。
        </p>
        <Link href="/#inputs" className="btn-primary mt-4 inline-block">
          手取り比較ツールを開く
        </Link>
      </section>
    </div>
  );
}

function ArticleCard({ article }: { article: Article }) {
  const cover = getArticleCover(article.slug);

  return (
    <Link href={`/media/${article.slug}`} className="article-card group flex h-full flex-col">
      {cover ? (
        <div className="article-card-cover shrink-0 overflow-hidden bg-surface">
          <Image
            src={cover.src}
            alt={cover.alt}
            width={400}
            height={225}
            className="h-full w-full object-cover transition group-hover:scale-[1.02]"
          />
        </div>
      ) : (
        <div
          className="article-card-cover shrink-0"
          style={{ background: `linear-gradient(135deg, ${article.coverFrom}, ${article.coverTo})` }}
        />
      )}
      <div className="flex flex-1 flex-col p-4">
        <span className="article-tag">{article.category}</span>
        <h2 className="mt-2 text-[15px] font-bold leading-snug text-ink group-hover:text-brand">
          {article.title}
        </h2>
        <p className="mt-2 line-clamp-3 flex-1 text-[13px] leading-relaxed text-ink-2">
          {article.description}
        </p>
        <p className="mt-3 text-[11px] text-muted">
          {formatArticleDate(article.updated)} · {article.readMin}分
        </p>
      </div>
    </Link>
  );
}
