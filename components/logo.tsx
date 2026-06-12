export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <svg
        viewBox="0 0 48 48"
        className="h-8 w-8 text-primary"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M24 4C24 14 14 18 14 26a10 10 0 0 0 20 0c0-8-10-12-10-22Z"
          fill="currentColor"
          opacity="0.9"
        />
        <path
          d="M24 44c-6-4-9-9-9-15"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          opacity="0.6"
        />
        <path
          d="M24 44c6-4 9-9 9-15"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          opacity="0.6"
        />
      </svg>
      <div className="leading-none">
        <span className="font-heading block text-xl font-600 tracking-wide-sm text-foreground">
          Zara
        </span>
        <span className="text-[10px] tracking-luxe text-primary uppercase">
          Therapy Clinic
        </span>
      </div>
    </div>
  )
}
