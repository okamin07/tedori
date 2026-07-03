"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "./Logo";

const NAV = [
  { href: "/", label: "ダッシュボード", icon: GridIcon },
  { href: "/simulate", label: "シミュレーション", icon: SlidersIcon },
  { href: "/media", label: "読みもの", icon: BookIcon },
  { href: "/settings", label: "設定", icon: GearIcon },
] as const;

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="app-sidebar hidden w-[220px] shrink-0 flex-col border-r border-line bg-surface lg:flex">
      <div className="px-5 py-5">
        <Link href="/">
          <Logo className="h-8 w-auto text-ink" />
        </Link>
      </div>

      <nav className="flex-1 space-y-0.5 px-3">
        {NAV.map((item) => {
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`sidebar-link ${active ? "sidebar-link--active" : ""}`}
            >
              <Icon />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-line p-4">
        <div className="rounded-lg bg-bg px-3 py-2.5">
          <p className="text-[11px] font-semibold text-ink">無料プラン</p>
          <Link href="/settings#plan" className="mt-0.5 text-[11px] font-medium text-brand hover:underline">
            アップグレード →
          </Link>
        </div>
        <div className="mt-3 flex items-center gap-2.5 px-1">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand text-[11px] font-bold text-white">
            U
          </div>
          <div className="min-w-0">
            <p className="truncate text-[12px] font-semibold text-ink">ゲスト</p>
            <p className="truncate text-[10px] text-muted">demo@tedori.app</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

function GridIcon() {
  return (
    <svg viewBox="0 0 20 20" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.75">
      <rect x="2" y="2" width="6" height="6" rx="1.5" />
      <rect x="12" y="2" width="6" height="6" rx="1.5" />
      <rect x="2" y="12" width="6" height="6" rx="1.5" />
      <rect x="12" y="12" width="6" height="6" rx="1.5" />
    </svg>
  );
}

function SlidersIcon() {
  return (
    <svg viewBox="0 0 20 20" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.75">
      <path d="M3 6h14M3 14h14M7 6v0a2 2 0 104 0M9 14v0a2 2 0 104 0" strokeLinecap="round" />
    </svg>
  );
}

function BookIcon() {
  return (
    <svg viewBox="0 0 20 20" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.75">
      <path d="M4 4h5a2 2 0 012 2v10H6a2 2 0 01-2-2V4zM11 6h5v10h-5a2 2 0 01-2-2V6a2 2 0 012-2z" />
    </svg>
  );
}

function GearIcon() {
  return (
    <svg viewBox="0 0 20 20" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.75">
      <circle cx="10" cy="10" r="2.5" />
      <path d="M10 2.5v2M10 15.5v2M17.5 10h-2M4.5 10h-2M15.2 4.8l-1.4 1.4M6.2 13.8l-1.4 1.4M15.2 15.2l-1.4-1.4M6.2 6.2L4.8 4.8" strokeLinecap="round" />
    </svg>
  );
}

export function MobileTopBar() {
  const pathname = usePathname();
  const title =
    pathname === "/simulate"
      ? "シミュレーション"
      : pathname.startsWith("/media")
        ? "読みもの"
        : pathname === "/settings"
          ? "設定"
          : "ダッシュボード";

  return (
    <header className="flex h-14 items-center justify-between border-b border-line bg-surface px-4 lg:hidden">
      <Logo className="h-7 w-auto text-ink" />
      <span className="text-[13px] font-semibold text-ink">{title}</span>
      <nav className="flex gap-3 text-[11px] font-semibold text-brand">
        <Link href="/simulate">入力</Link>
        <Link href="/media">記事</Link>
      </nav>
    </header>
  );
}
