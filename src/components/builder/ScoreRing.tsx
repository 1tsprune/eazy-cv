"use client";

import { useMemo } from "react";
import { useResume } from "@/context/ResumeContext";
import { useTheme } from "@/context/ThemeContext";
import { getUiDict } from "@/lib/ui-i18n";
import { calculateCvAssistant } from "@/lib/cv-assistant";

interface Props {
  size?: "sm" | "lg";
}

export function ScoreRing({ size = "sm" }: Props) {
  const { data, config } = useResume();
  const { uiLocale } = useTheme();
  const t = getUiDict(uiLocale);
  const { score } = useMemo(
    () =>
      calculateCvAssistant(data, uiLocale, config.cvProfile, {
        showPhoto: config.showPhoto,
      }),
    [data, uiLocale, config.cvProfile, config.showPhoto],
  );

  const ringColor =
    score >= 80 ? "#65a30d" : score >= 50 ? "#d97706" : "#ec4899";

  const label =
    score >= 80
      ? uiLocale === "id"
        ? "Siap lamar! 🔥"
        : "Ready to apply! 🔥"
      : score >= 50
        ? uiLocale === "id"
          ? "Lumayan, tingkatin lagi"
          : "Good, keep improving"
        : uiLocale === "id"
          ? "Yuk diisi dulu"
          : "Fill it in first";

  const dim = size === "lg" ? "h-28 w-28" : "h-12 w-12";
  const textSize = size === "lg" ? "text-3xl" : "text-sm";

  return (
    <div
      className={`flex items-center gap-3 ${size === "lg" ? "flex-col text-center" : ""}`}
    >
      <div className={`relative flex ${dim} items-center justify-center`}>
        <svg className={`${dim} -rotate-90`} viewBox="0 0 36 36">
          <circle
            cx="18"
            cy="18"
            r="15.5"
            fill="none"
            className="stroke-zinc-200 dark:stroke-zinc-700"
            strokeWidth="3"
          />
          <circle
            cx="18"
            cy="18"
            r="15.5"
            fill="none"
            stroke={ringColor}
            strokeWidth="3"
            strokeDasharray={`${score} 100`}
            strokeLinecap="round"
          />
        </svg>
        <span
          className={`absolute font-black ${textSize}`}
          style={{ color: ringColor }}
        >
          {score}
        </span>
      </div>
      {size === "lg" && (
        <div>
          <p className="text-lg font-black text-zinc-900 dark:text-white">
            {t.scoreTitle}
          </p>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">{label}</p>
          <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-500">
            {uiLocale === "id"
              ? "Target 80+ biar lolos screening"
              : "Aim for 80+ to pass screening"}
          </p>
        </div>
      )}
    </div>
  );
}