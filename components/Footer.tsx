import Link from "next/link";
import { TAX_YEAR_LABEL } from "@/lib/tax";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-line-strong bg-paper-2">
      <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:justify-between">
          <div>
            <p className="serif text-lg font-bold text-ink">手取り試算</p>
            <p className="mt-2 max-w-xs text-[13px] leading-relaxed text-muted">
              副業・個人事業の手取りを、数字で見える化する試算ツール。
            </p>
          </div>
          <nav className="flex gap-8 text-[13px] text-ink-2">
            <Link href="/#simulator" className="hover:text-ink">
              試算
            </Link>
            <Link href="/media" className="hover:text-ink">
              読みもの
            </Link>
          </nav>
        </div>
        <p className="mt-8 border-t border-line pt-6 text-[11px] leading-relaxed text-muted">
          {TAX_YEAR_LABEL}に基づく概算です。実際の税額・保険料は控除・自治体・業種等により異なります。税務相談ではありません。
        </p>
        <p className="mt-3 text-[11px] text-muted">© {new Date().getFullYear()} TEDORI</p>
      </div>
    </footer>
  );
}
