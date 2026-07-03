import type { AffiliateOffer } from "@/lib/affiliate";

export function AffiliateCard({ offer }: { offer: AffiliateOffer }) {
  return (
    <a
      href={offer.href}
      rel="sponsored nofollow"
      className="group block border-t border-line py-4 first:border-t-0"
    >
      <span className="text-[11px] font-medium text-muted">{offer.category}</span>
      <p className="mt-1 font-medium text-ink group-hover:text-brand">{offer.title}</p>
      <p className="mt-1 text-[13px] text-muted">{offer.desc}</p>
      <span className="mt-2 inline-block text-[13px] text-brand">{offer.cta} →</span>
    </a>
  );
}
