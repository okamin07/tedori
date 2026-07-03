import Link from "next/link";
import { TAX_YEAR_LABEL } from "@/lib/tax";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-line bg-surface">
      <div className="mx-auto max-w-lg px-4 py-8 sm:max-w-2xl">
        <div className="flex justify-between gap-4 text-[13px] text-ink-2">
          <p className="font-semibold text-ink">TEDORI</p>
          <nav className="flex gap-4">
            <Link href="/#simulator" className="hover:text-brand">
              比較
            </Link>
            <Link href="/media" className="hover:text-brand">
              読みもの
            </Link>
          </nav>
        </div>
        <p className="mt-6 text-[11px] leading-relaxed text-muted">
          {TAX_YEAR_LABEL}に基づく概算。実際の税額・保険料は個別事情により異なります。
        </p>
        <p className="mt-2 text-[11px] text-muted">© {new Date().getFullYear()} TEDORI</p>
      </div>
    </footer>
  );
}
