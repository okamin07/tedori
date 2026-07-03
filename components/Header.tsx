import Link from "next/link";
import { Logo } from "./Logo";

export function Header() {
  return (
    <header className="border-b border-line bg-surface">
      <div className="mx-auto flex h-16 max-w-[920px] items-center justify-between px-4 sm:px-6">
        <Link href="/" className="text-ink">
          <Logo className="h-8 w-auto" />
        </Link>
        <nav className="flex gap-6">
          <Link href="/#simulator" className="nav-link" data-active="true">
            比較
          </Link>
          <Link href="/media" className="nav-link">
            読みもの
          </Link>
        </nav>
      </div>
    </header>
  );
}
