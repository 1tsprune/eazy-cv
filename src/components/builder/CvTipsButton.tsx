"use client";

import { Lightbulb } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { getAssistantCopy } from "@/lib/cv-assistant";

type Props = {
  onClick: () => void;
  className?: string;
};

export function CvTipsButton({ onClick, className = "" }: Props) {
  const { uiLocale } = useTheme();
  const t = getAssistantCopy(uiLocale);

  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex shrink-0 items-center gap-2 rounded-full border border-amber-300 bg-amber-100 px-4 py-2 text-xs font-bold text-amber-950 shadow-sm transition hover:bg-amber-200 dark:border-amber-700 dark:bg-amber-950/50 dark:text-amber-100 dark:hover:bg-amber-900/60 ${className}`}
      aria-label={t.assistantTitle}
    >
      <Lightbulb className="h-4 w-4 text-amber-600 dark:text-amber-400" />
      <span className="uppercase tracking-wide">{t.tipsLabel}</span>
    </button>
  );
}