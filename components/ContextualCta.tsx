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
      className="wf-card block p-5 transition hover:border-brand/30 sm:p-6"
    >
      <p className="text-[11px] font-bold text-brand">{offer.category}</p>
      <p className="mt-1 text-[15px] font-bold text-ink">{headline}</p>
      <p className="mt-1 text-[13px] leading-relaxed text-ink-2">{body}</p>
      <span className="mt-3 inline-block text-[13px] font-semibold text-brand">{offer.cta} →</span>
    </a>
  );
}
