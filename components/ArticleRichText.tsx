import Link from "next/link";
import { parseArticleMarkup } from "@/lib/article-markup";

export function ArticleRichText({ text }: { text: string }) {
  const segments = parseArticleMarkup(text);

  return (
    <>
      {segments.map((seg, i) => {
        if (seg.type === "bold") {
          return (
            <strong key={i} className="font-semibold text-ink">
              {seg.content}
            </strong>
          );
        }
        if (seg.type === "link") {
          const external = seg.href.startsWith("http");
          if (external) {
            return (
              <a
                key={i}
                href={seg.href}
                className="font-medium text-brand underline decoration-brand/30 underline-offset-2 hover:decoration-brand"
                target="_blank"
                rel="noopener noreferrer"
              >
                {seg.content}
              </a>
            );
          }
          return (
            <Link key={i} href={seg.href} className="font-medium text-brand hover:underline">
              {seg.content}
            </Link>
          );
        }
        return <span key={i}>{seg.content}</span>;
      })}
    </>
  );
}
