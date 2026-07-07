import { APP } from "@/lib/config";

type LogoProps = {
  variant?: "full" | "icon";
  size?: "sm" | "md" | "lg";
  showTagline?: boolean;
  className?: string;
};

const sizes = {
  sm: { icon: 32, name: "text-sm", tagline: "text-[9px]" },
  md: { icon: 40, name: "text-base", tagline: "text-[10px]" },
  lg: { icon: 56, name: "text-xl", tagline: "text-xs" },
} as const;

function LogoIcon({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden
      className="shrink-0"
    >
      <defs>
        <linearGradient
          id="eazycv-logo-bg"
          x1="4"
          y1="2"
          x2="28"
          y2="30"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#4F46E5" />
          <stop offset="1" stopColor="#7C3AED" />
        </linearGradient>
        <linearGradient
          id="eazycv-logo-doc"
          x1="9"
          y1="6"
          x2="21"
          y2="24"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#EEF2FF" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="8" fill="url(#eazycv-logo-bg)" />
      <rect
        x="8.5"
        y="6"
        width="13"
        height="17.5"
        rx="2"
        fill="url(#eazycv-logo-doc)"
      />
      <rect x="10.5" y="9.5" width="7" height="1.4" rx="0.7" fill="#C7D2FE" />
      <rect x="10.5" y="12.5" width="9" height="1.4" rx="0.7" fill="#A5B4FC" />
      <rect x="10.5" y="15.5" width="5.5" height="1.4" rx="0.7" fill="#C7D2FE" />
      <path
        d="M21.2 17.8 18.4 22.2h2.1l-1.3 4.2 4.8-6.4h-2.3l-.5-2.2Z"
        fill="#FBBF24"
      />
    </svg>
  );
}

export function Logo({
  variant = "full",
  size = "sm",
  showTagline = false,
  className = "",
}: LogoProps) {
  const s = sizes[size];

  if (variant === "icon") {
    return (
      <span className={`inline-flex ${className}`}>
        <LogoIcon size={s.icon} />
      </span>
    );
  }

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <LogoIcon size={s.icon} />
      <div className="leading-none">
        <p
          className={`${s.name} font-extrabold tracking-tight text-zinc-900 dark:text-white`}
        >
          <span>Eazy</span>{" "}
          <span className="text-indigo-600 dark:text-indigo-400">CV</span>
        </p>
        {showTagline && (
          <p className={`${s.tagline} mt-0.5 text-zinc-400`}>{APP.tagline}</p>
        )}
      </div>
    </div>
  );
}