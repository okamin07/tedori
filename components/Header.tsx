import Link from "next/link";
import { Logo } from "./Logo";

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-line/80 bg-surface/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="text-ink transition opacity-90 hover:opacity-100">
          <Logo className="h-8 w-auto" />
        </Link>
        <nav className="flex items-center gap-1">
          <Link
            href="/#simulator"
            className="rounded-lg px-3 py-2 text-[13px] font-semibold text-ink-2 transition hover:bg-brand-soft hover:text-brand"
          >
            比較
          </Link>
          <Link
            href="/media"
            className="rounded-lg px-3 py-2 text-[13px] font-semibold text-ink-2 transition hover:bg-brand-soft hover:text-brand"
          >
            読みもの
          </Link>
        </nav>
      </div>
    </header>
  );
}
