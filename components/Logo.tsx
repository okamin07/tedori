export function Logo({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 148 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="TEDORI"
    >
      <rect x="2" y="18" width="5" height="10" rx="1" fill="#6366F1" opacity="0.45" />
      <rect x="9" y="12" width="5" height="16" rx="1" fill="#6366F1" opacity="0.7" />
      <rect x="16" y="6" width="5" height="22" rx="1" fill="#4F46E5" />
      <text
        x="28"
        y="22"
        fill="currentColor"
        fontFamily="system-ui, sans-serif"
        fontSize="17"
        fontWeight="700"
        letterSpacing="-0.04em"
      >
        TEDORI
      </text>
    </svg>
  );
}
