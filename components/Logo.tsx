export function Logo({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 148 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="TEDORI"
    >
      <defs>
        <linearGradient id="logo-grad-a" x1="0" y1="0" x2="20" y2="28">
          <stop stopColor="#5B6CFF" />
          <stop offset="1" stopColor="#3B4ED8" />
        </linearGradient>
        <linearGradient id="logo-grad-b" x1="8" y1="4" x2="24" y2="28">
          <stop stopColor="#8B5CF6" />
          <stop offset="1" stopColor="#6366F1" />
        </linearGradient>
      </defs>
      <path d="M4 24L14 4L24 24H19L17 19H11L9 24H4Z" fill="url(#logo-grad-a)" />
      <path d="M12 8L16 16H8L12 8Z" fill="#fff" fillOpacity="0.35" />
      <path
        d="M22 26L30 8L38 26H34.2L32.6 22H27.4L25.8 26H22Z"
        fill="url(#logo-grad-b)"
        opacity="0.92"
      />
      <text
        x="46"
        y="22"
        fill="currentColor"
        fontFamily="system-ui, sans-serif"
        fontSize="18"
        fontWeight="700"
        letterSpacing="-0.04em"
      >
        TEDORI
      </text>
    </svg>
  );
}
