import Link from "next/link";

export function Header() {
  return (
    <header className="border-b border-line bg-paper">
      <div className="mx-auto flex h-14 max-w-5xl items-baseline justify-between px-5 sm:px-8">
        <Link href="/" className="group flex items-baseline gap-2">
          <span className="serif text-xl font-bold tracking-tight text-ink">
            手取り試算
          </span>
          <span className="hidden text-[10px] font-medium tracking-[0.2em] text-muted sm:inline">
            TEDORI
          </span>
        </Link>
        <nav className="flex gap-6 text-[13px] font-medium tracking-wide text-ink-2">
          <Link href="/#simulator" className="hover:text-ink">
            試算
          </Link>
          <Link href="/media" className="hover:text-ink">
            読みもの
          </Link>
        </nav>
      </div>
    </header>
  );
}
