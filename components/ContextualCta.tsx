import type { AffiliateOffer } from "@/lib/affiliate";

export function ContextualCta({
  headline,
  body,
  offer,
}: {
  headline: string;
  body: string;
  offer: AffiliateOffer;
}) {
  return (
    <a
      href={offer.href}
      rel="sponsored nofollow"
      className="saas-card group block p-5 transition hover:border-brand/40 hover:shadow-lg sm:p-6"
    >
      <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand text-sm font-bold text-white">
          →
        </div>
        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-brand">
            {offer.category}
          </p>
          <p className="mt-1 text-[16px] font-bold text-ink group-hover:text-brand">{headline}</p>
          <p className="mt-1 text-[13px] leading-relaxed text-ink-2">{body}</p>
          <span className="mt-3 inline-block text-[13px] font-semibold text-brand">
            {offer.cta} →
          </span>
        </div>
      </div>
    </a>
  );
}
