"use client";

import { ArrowLeft, Mail, Wand2 } from "lucide-react";
import { useResume } from "@/context/ResumeContext";
import { useTheme } from "@/context/ThemeContext";
import { getUiDict } from "@/lib/ui-i18n";

type Props = {
  showCover?: boolean;
  onToggleCover?: () => void;
};

export function QuickActions({ showCover = false, onToggleCover }: Props) {
  const { loadSample } = useResume();
  const { uiLocale } = useTheme();
  const t = getUiDict(uiLocale);

  return (
    <div className="flex flex-wrap gap-2">
      {!showCover && (
        <button
          type="button"
          onClick={loadSample}
          title={t.exampleCvHint}
          className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-4 py-2 text-xs font-bold text-zinc-700 shadow-sm transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
        >
          <Wand2 className="h-3.5 w-3.5 text-indigo-500" />
          {t.exampleCv}
        </button>
      )}
      {onToggleCover && (
        <button
          type="button"
          onClick={onToggleCover}
          className={`items-center gap-1.5 rounded-full border px-4 py-2 text-xs font-bold shadow-sm transition ${
            showCover ? "hidden md:inline-flex" : "inline-flex"
          } ${
            showCover
              ? "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
              : "border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 dark:border-indigo-900 dark:bg-indigo-950 dark:text-indigo-300 dark:hover:bg-indigo-900"
          }`}
        >
          {showCover ? (
            <>
              <ArrowLeft className="h-3.5 w-3.5" />
              {t.backToCv}
            </>
          ) : (
            <>
              <Mail className="h-3.5 w-3.5" />
              {t.openCoverLetter}
            </>
          )}
        </button>
      )}
    </div>
  );
}