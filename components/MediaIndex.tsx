"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ARTICLE_FILTERS,
  ARTICLES,
  formatArticleDate,
  type Article,
} from "@/lib/articles";

export function MediaIndex() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<string>("すべて");

  const filtered = useMemo(() => {
    return ARTICLES.filter((a) => {
      const matchFilter =
        filter === "すべて" ||
        a.filterTag === filter ||
        a.category === filter;
      const q = query.trim().toLowerCase();
      const matchQuery =
        !q ||
        a.title.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q);
      return matchFilter && matchQuery;
    });
  }, [query, filter]);

  return (
    <div className="page-pad mx-auto max-w-[960px]">
      <h1 className="page-title">読みもの</h1>
      <p className="mt-1 text-[14px] text-ink-2">
        税金・確定申告・フリーランスの基礎知識
      </p>

      <div className="mt-6">
        <input
          type="search"
          placeholder="記事を検索..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="search-input w-full"
        />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {ARTICLE_FILTERS.map((tag) => (
          <button
            key={tag}
            type="button"
            className="chip"
            data-active={filter === tag}
            onClick={() => setFilter(tag)}
          >
            {tag}
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((a) => (
          <ArticleCard key={a.slug} article={a} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="mt-12 text-center text-[14px] text-muted">該当する記事がありません</p>
      )}
    </div>
  );
}

function ArticleCard({ article }: { article: Article }) {
  return (
    <Link href={`/media/${article.slug}`} className="article-card group">
      <div
        className="article-card-cover"
        style={{
          background: `linear-gradient(135deg, ${article.coverFrom}, ${article.coverTo})`,
        }}
      />
      <div className="p-4">
        <span className="article-tag">{article.category}</span>
        <h2 className="mt-2 text-[15px] font-bold leading-snug text-ink group-hover:text-brand">
          {article.title}
        </h2>
        <p className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-ink-2">
          {article.description}
        </p>
        <p className="mt-3 text-[11px] text-muted">
          {formatArticleDate(article.updated)} · {article.readMin}分で読める
        </p>
      </div>
    </Link>
  );
}
