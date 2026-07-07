import { Instagram } from "lucide-react";

type Props = {
  className?: string;
  variant?: "header" | "footer";
  label?: string;
  shortLabel?: string;
};

const DEFAULT_LABEL = "Template IG Story";
const DEFAULT_SHORT = "IG Story";

export function IgStoryLink({
  className = "",
  variant = "header",
  label = DEFAULT_LABEL,
  shortLabel = DEFAULT_SHORT,
}: Props) {
  if (variant === "footer") {
    return (
      <li>
        <a
          href="/ig-story-preview.html"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-white"
        >
          {label}
        </a>
      </li>
    );
  }

  return (
    <a
      href="/ig-story-preview.html"
      target="_blank"
      rel="noopener noreferrer"
      title={label}
      className={`inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 px-2.5 py-1.5 text-[10px] font-bold text-zinc-600 transition hover:border-pink-300 hover:bg-pink-50 hover:text-pink-700 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-pink-800 dark:hover:bg-pink-950/40 dark:hover:text-pink-300 ${className}`}
    >
      <Instagram className="h-3.5 w-3.5" />
      <span className="hidden sm:inline">{shortLabel}</span>
    </a>
  );
}