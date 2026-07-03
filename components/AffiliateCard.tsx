import type { AffiliateOffer } from "@/lib/affiliate";

export function AffiliateCard({ offer }: { offer: AffiliateOffer }) {
  return (
    <a
      href={offer.href}
      rel="sponsored nofollow"
      className="group block border-t border-line py-4 first:border-t-0 sm:first:border-t"
    >
      <span className="text-[11px] font-medium tracking-wider text-muted">
        {offer.category}
      </span>
      <p className="mt-1 font-medium text-ink group-hover:underline group-hover:decoration-1 group-hover:underline-offset-4">
        {offer.title}
      </p>
      <p className="mt-1 text-[13px] leading-relaxed text-muted">{offer.desc}</p>
      <span className="mt-2 inline-block text-[13px] text-ink-2 group-hover:text-ink">
        {offer.cta} →
      </span>
    </a>
  );
}
