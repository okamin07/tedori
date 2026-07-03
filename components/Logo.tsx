export function Logo({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 140 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="TEDORI"
    >
      <defs>
        <linearGradient id="tedori-grad" x1="0" y1="0" x2="28" y2="28">
          <stop stopColor="#6366F1" />
          <stop offset="1" stopColor="#2563EB" />
        </linearGradient>
      </defs>
      {/* Mark: 2本柱 + 差分矢印（比較） */}
      <rect x="2" y="6" width="9" height="20" rx="2.5" fill="url(#tedori-grad)" opacity="0.45" />
      <rect x="14" y="2" width="9" height="24" rx="2.5" fill="url(#tedori-grad)" />
      <path
        d="M26 16h6l-2.5-2.5M32 16l-2.5 2.5"
        stroke="#6366F1"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <text
        x="42"
        y="22"
        fill="currentColor"
        fontFamily="var(--font-sans), system-ui, sans-serif"
        fontSize="17"
        fontWeight="700"
        letterSpacing="-0.03em"
      >
        TEDORI
      </text>
    </svg>
  );
}
