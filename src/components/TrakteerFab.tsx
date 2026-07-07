"use client";

import { DONATION } from "@/lib/config";
import { Logo } from "@/components/Logo";
import { getUiDict } from "@/lib/ui-i18n";
import { useTheme } from "@/context/ThemeContext";

export function TrakteerFab() {
  const { uiLocale } = useTheme();
  const t = getUiDict(uiLocale);

  return (
    <a
      href={DONATION.url}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 hidden items-center gap-2.5 rounded-2xl border border-zinc-200 bg-white px-4 py-2.5 shadow-xl shadow-zinc-200/50 transition hover:border-slate-300 hover:shadow-2xl md:flex dark:border-zinc-700 dark:bg-zinc-900 dark:shadow-black/30"
    >
      <Logo variant="icon" size="sm" className="ring-4 ring-slate-100 dark:ring-slate-900" />
      <div className="mr-1 hidden flex-col items-start sm:flex">
        <span className="text-[10px] font-black uppercase leading-none tracking-tight text-zinc-900 dark:text-white">
          Eazy <span className="text-slate-700 dark:text-slate-300">CV</span>
        </span>
        <span className="mt-0.5 text-[8px] font-bold uppercase leading-none tracking-widest text-zinc-400">
          {t.trakteerLabel}
        </span>
      </div>
    </a>
  );
}