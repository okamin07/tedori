"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "./Logo";

const NAV = [
  { href: "/", label: "手取り比較", key: "tool" },
  { href: "/media", label: "読みもの", key: "media" },
] as const;

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="border-b border-line bg-surface">
      <div className="mx-auto flex h-14 max-w-[960px] items-center justify-between px-4 sm:px-6">
        <Link href="/">
          <Logo className="h-8 w-auto text-ink" />
        </Link>
        <nav className="flex gap-6">
          {NAV.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-[13px] font-semibold ${
                  active ? "text-brand" : "text-ink-2 hover:text-brand"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-line bg-surface">
      <div className="mx-auto max-w-[960px] px-4 py-8 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
          <div>
            <Logo className="h-7 w-auto text-ink" />
            <p className="mt-2 max-w-md text-[13px] leading-relaxed text-ink-2">
              副業・フリーランスの手取りを2シナリオで比較。2025年分（令和7年）概算。
            </p>
          </div>
          <nav className="flex flex-col gap-2 text-[13px] font-medium text-ink-2 sm:items-end">
            <Link href="/" className="hover:text-brand">
              手取り比較ツール
            </Link>
            <Link href="/media" className="hover:text-brand">
              税金・確定申告の読みもの
            </Link>
          </nav>
        </div>
        <p className="mt-6 text-[11px] leading-relaxed text-muted">
          税務相談ではありません。試算は目安であり、自治体・個別事情により異なります。
        </p>
      </div>
    </footer>
  );
}
