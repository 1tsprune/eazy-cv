"use client";

import { Lightbulb } from "lucide-react";
import { useMemo } from "react";
import { useResume } from "@/context/ResumeContext";
import { useTheme } from "@/context/ThemeContext";
import { calculateCvAssistant, getAssistantCopy } from "@/lib/cv-assistant";

type Props = {
  onClick: () => void;
};

export function CvTipsFab({ onClick }: Props) {
  const { data, config } = useResume();
  const { uiLocale } = useTheme();
  const t = getAssistantCopy(uiLocale);
  const { score } = useMemo(
    () =>
      calculateCvAssistant(data, uiLocale, config.cvProfile, {
        showPhoto: config.showPhoto,
      }),
    [data, uiLocale, config.cvProfile, config.showPhoto],
  );

  const badgeColor =
    score >= 80
      ? "bg-emerald-500"
      : score >= 50
        ? "bg-amber-500"
        : "bg-rose-500";

  return (
    <button
      type="button"
      onClick={onClick}
      className="fixed right-0 top-1/2 z-40 flex -translate-y-1/2 flex-col items-center gap-1 rounded-l-2xl border border-r-0 border-amber-200/80 bg-gradient-to-b from-amber-50 to-white px-2 py-3 shadow-lg shadow-amber-100/50 transition hover:from-amber-100 hover:shadow-xl dark:border-amber-900/50 dark:from-amber-950/80 dark:to-zinc-900 dark:shadow-black/30"
      aria-label={t.assistantTitle}
    >
      <span className="relative">
        <Lightbulb className="h-5 w-5 text-amber-500 dark:text-amber-400" />
        <span
          className={`absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full px-0.5 text-[8px] font-black text-white ${badgeColor}`}
        >
          {score}
        </span>
      </span>
      <span className="text-[9px] font-black uppercase tracking-wider text-amber-700 dark:text-amber-300">
        {t.tipsLabel}
      </span>
    </button>
  );
}