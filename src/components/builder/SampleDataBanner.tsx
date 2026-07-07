"use client";

import { Info } from "lucide-react";
import { useResume } from "@/context/ResumeContext";
import { useTheme } from "@/context/ThemeContext";
import { isSampleResumeData } from "@/lib/resume-empty";
import { getUiDict } from "@/lib/ui-i18n";

export function SampleDataBanner() {
  const { data } = useResume();
  const { uiLocale } = useTheme();
  const t = getUiDict(uiLocale);

  if (!isSampleResumeData(data)) return null;

  return (
    <div className="flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-2.5 dark:border-amber-900/50 dark:bg-amber-950/30">
      <Info className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
      <p className="text-xs leading-relaxed text-amber-900 dark:text-amber-200">
        {t.sampleDataBanner}
      </p>
    </div>
  );
}