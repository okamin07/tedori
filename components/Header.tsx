import Link from "next/link";

export function Header() {
  return (
    <header className="border-b border-line bg-surface">
      <div className="mx-auto flex h-14 max-w-lg items-center justify-between px-4 sm:max-w-2xl">
        <Link href="/" className="text-lg font-bold tracking-tight text-ink">
          TEDORI
        </Link>
        <nav className="flex gap-5 text-[13px] font-medium text-ink-2">
          <Link href="/#simulator" className="hover:text-brand">
            比較
          </Link>
          <Link href="/media" className="hover:text-brand">
            読みもの
          </Link>
        </nav>
      </div>
    </header>
  );
}
