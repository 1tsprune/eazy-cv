import { ChevronDown } from "lucide-react";
import { useState, type ReactNode } from "react";

interface SectionCardProps {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
  badge?: string;
}

export function SectionCard({
  title,
  icon,
  children,
  defaultOpen = true,
  badge,
}: SectionCardProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <section className="overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left transition hover:bg-zinc-50 dark:hover:bg-zinc-800"
      >
        <div className="flex items-center gap-3">
          {icon && (
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              {icon}
            </span>
          )}
          <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
            {title}
          </h3>
          {badge && (
            <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
              {badge}
            </span>
          )}
        </div>
        <ChevronDown
          className={`h-4 w-4 text-zinc-400 transition dark:text-zinc-500 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="border-t border-zinc-100 px-5 py-4 dark:border-zinc-800">
          {children}
        </div>
      )}
    </section>
  );
}