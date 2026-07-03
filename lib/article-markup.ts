export type ArticleSegment =
  | { type: "text"; content: string }
  | { type: "bold"; content: string }
  | { type: "link"; content: string; href: string };

const TOKEN_RE = /(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g;
const LINK_RE = /^\[([^\]]+)\]\(([^)]+)\)$/;

function isSafeHref(href: string): boolean {
  if (href.startsWith("/")) return true;
  if (href.startsWith("https://") || href.startsWith("http://")) return true;
  return false;
}

/** 記事本文用の最小マークアップ（太字・リンク）をパース */
export function parseArticleMarkup(text: string): ArticleSegment[] {
  const segments: ArticleSegment[] = [];
  let lastIndex = 0;

  for (const match of text.matchAll(TOKEN_RE)) {
    const index = match.index ?? 0;
    if (index > lastIndex) {
      segments.push({ type: "text", content: text.slice(lastIndex, index) });
    }

    const token = match[0];
    if (token.startsWith("**") && token.endsWith("**")) {
      segments.push({ type: "bold", content: token.slice(2, -2) });
    } else {
      const link = LINK_RE.exec(token);
      if (link && isSafeHref(link[2])) {
        segments.push({ type: "link", content: link[1], href: link[2] });
      } else {
        segments.push({ type: "text", content: token });
      }
    }

    lastIndex = index + token.length;
  }

  if (lastIndex < text.length) {
    segments.push({ type: "text", content: text.slice(lastIndex) });
  }

  return segments.length > 0 ? segments : [{ type: "text", content: text }];
}
