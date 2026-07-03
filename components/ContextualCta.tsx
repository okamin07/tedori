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
      className="block rounded-xl border border-brand/30 bg-brand-soft p-4 transition hover:border-brand"
    >
      <p className="text-[11px] font-semibold uppercase tracking-wide text-brand">
        {offer.category}
      </p>
      <p className="mt-1 text-[15px] font-semibold text-ink">{headline}</p>
      <p className="mt-1 text-[13px] leading-relaxed text-ink-2">{body}</p>
      <span className="mt-3 inline-block text-[13px] font-medium text-brand">
        {offer.cta} →
      </span>
    </a>
  );
}
