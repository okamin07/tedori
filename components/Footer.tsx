import Link from "next/link";
import { Logo } from "./Logo";
import { TAX_YEAR_LABEL } from "@/lib/tax";

export function Footer() {
  return (
    <footer className="border-t border-line bg-surface">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:flex-row sm:justify-between sm:px-6">
        <div>
          <Logo className="h-7 w-auto text-ink" />
          <p className="mt-3 max-w-xs text-[13px] text-ink-2">
            副業・独立の手取りを、2シナリオで並べて比較。
          </p>
        </div>
        <nav className="flex gap-6 text-[13px] font-semibold text-ink-2">
          <Link href="/#simulator" className="hover:text-brand">
            比較
          </Link>
          <Link href="/media" className="hover:text-brand">
            読みもの
          </Link>
        </nav>
      </div>
      <p className="border-t border-line px-4 py-4 text-center text-[11px] text-muted sm:px-6">
        {TAX_YEAR_LABEL}概算 · © {new Date().getFullYear()} TEDORI
      </p>
    </footer>
  );
}
