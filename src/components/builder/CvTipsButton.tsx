"use client";

import { Lightbulb } from "lucide-react";
import { useMemo } from "react";
import { useResume } from "@/context/ResumeContext";
import { useTheme } from "@/context/ThemeContext";
import { calculateCvAssistant, getAssistantCopy } from "@/lib/cv-assistant";

type Props = {
  onClick: () => void;
  className?: string;
};

export function CvTipsButton({ onClick, className = "" }: Props) {
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

  const tone =
    "border-zinc-200 bg-white text-zinc-800 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700";

  const badgeTone =
    score >= 80
      ? "bg-emerald-600"
      : score >= 50
        ? "bg-amber-500"
        : "bg-rose-500";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-xs font-bold shadow-sm transition ${tone} ${className}`}
      aria-label={t.assistantTitle}
    >
      <span className="relative flex items-center">
        <Lightbulb className="h-4 w-4" />
        <span
          className={`ml-1.5 flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] font-black text-white ${badgeTone}`}
        >
          {score}
        </span>
      </span>
      <span className="uppercase tracking-wide">{t.tipsLabel}</span>
    </button>
  );
}