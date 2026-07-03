import { TAX_YEAR_LABEL } from "@/lib/tax";

export function Footer() {
  return (
    <footer className="border-t border-line bg-surface">
      <p className="py-4 text-center text-[11px] text-muted">
        {TAX_YEAR_LABEL}概算 · © {new Date().getFullYear()} TEDORI
      </p>
    </footer>
  );
}
