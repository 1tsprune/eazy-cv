"use client";

import { CheckCircle2, ChevronDown, ChevronUp, Circle, X } from "lucide-react";
import { useMemo, useState } from "react";
import { useResume } from "@/context/ResumeContext";
import { useTheme } from "@/context/ThemeContext";
import {
  calculateCvAssistant,
  getAssistantCopy,
  type AssistantCategory,
} from "@/lib/cv-assistant";
import { scrollToCvSection } from "@/lib/ats-scroll-targets";

type Props = {
  open: boolean;
  onClose: () => void;
  onFixCheck?: (checkId: string, scrollTarget: string) => void;
};

function CategoryBlock({
  category,
  expanded,
  onToggle,
  onFix,
  tapLabel,
  optionalLabel,
  allDoneLabel,
}: {
  category: AssistantCategory;
  expanded: boolean;
  onToggle: () => void;
  onFix: (checkId: string, target: string) => void;
  tapLabel: string;
  optionalLabel: string;
  allDoneLabel: string;
}) {
  const failed = category.checks.filter((c) => !c.passed);
  let lastGroup: string | undefined;

  return (
    <div className="border-b border-zinc-100 last:border-0 dark:border-zinc-800">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-3 py-4 text-left"
      >
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-zinc-900 dark:text-white">
              {category.title}
            </span>
            <span className="shrink-0 rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-bold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
              {category.passedCount} / {category.totalCount}
            </span>
          </div>
          <p className="mt-1 text-[11px] leading-snug text-zinc-500 dark:text-zinc-400">
            {category.description}
          </p>
        </div>
        {expanded ? (
          <ChevronUp className="h-4 w-4 shrink-0 text-zinc-400" />
        ) : (
          <ChevronDown className="h-4 w-4 shrink-0 text-zinc-400" />
        )}
      </button>

      {expanded ? (
        <div className="pb-4">
          {failed.length === 0 ? (
            <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              ✓ {allDoneLabel}
            </p>
          ) : (
            <ul className="space-y-3">
              {failed.map((check) => {
                const showGroupHeader = check.group && check.group !== lastGroup;
                if (showGroupHeader) lastGroup = check.group;

                return (
                  <li key={check.id}>
                    {showGroupHeader ? (
                      <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wide text-zinc-400">
                        {check.group}
                      </p>
                    ) : null}
                    <button
                      type="button"
                      onClick={() => onFix(check.id, check.scrollTarget)}
                      className="w-full rounded-xl border border-amber-100 bg-amber-50/80 px-3 py-2.5 text-left transition hover:bg-amber-100 dark:border-amber-900/40 dark:bg-amber-950/30 dark:hover:bg-amber-950/50"
                    >
                      <div className="flex items-start gap-2">
                        <Circle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-500" />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                            {check.label}
                            {check.optional ? (
                              <span className="ml-1.5 text-[10px] font-medium text-zinc-400">
                                ({optionalLabel})
                              </span>
                            ) : null}
                          </p>
                          <p className="mt-0.5 text-[11px] leading-snug text-zinc-600 dark:text-zinc-400">
                            {check.tip}
                          </p>
                          <span className="mt-1 inline-block text-[10px] font-bold text-amber-700 dark:text-amber-400">
                            → {tapLabel}
                          </span>
                        </div>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}

          {category.checks.some((c) => c.passed) ? (
            <ul className="mt-3 space-y-1 border-t border-zinc-100 pt-3 dark:border-zinc-800">
              {category.checks
                .filter((c) => c.passed)
                .map((check) => (
                  <li
                    key={check.id}
                    className="flex items-center gap-2 text-[11px] text-zinc-500 dark:text-zinc-400"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
                    {check.label}
                  </li>
                ))}
            </ul>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

export function CvTipsDrawer({ open, onClose, onFixCheck }: Props) {
  const { data, config } = useResume();
  const { uiLocale } = useTheme();
  const t = getAssistantCopy(uiLocale);
  const result = useMemo(
    () =>
      calculateCvAssistant(data, uiLocale, config.cvProfile, {
        showPhoto: config.showPhoto,
      }),
    [data, uiLocale, config.cvProfile, config.showPhoto],
  );

  const [expanded, setExpanded] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(
      result.categories.map((c) => [c.id, c.passedCount < c.totalCount]),
    ),
  );

  const ringColor =
    result.score >= 80
      ? "#65a30d"
      : result.score >= 50
        ? "#d97706"
        : "#e11d48";

  const handleFix = (checkId: string, scrollTarget: string) => {
    onClose();
    if (onFixCheck) {
      onFixCheck(checkId, scrollTarget);
    } else {
      scrollToCvSection(scrollTarget);
    }
  };

  if (!open) return null;

  return (
    <>
      <button
        type="button"
        aria-label="Tutup"
        className="fixed inset-0 z-[60] bg-black/30 backdrop-blur-[2px]"
        onClick={onClose}
      />

      <aside
        className="fixed inset-y-0 right-0 z-[70] flex w-full max-w-[min(100vw,400px)] flex-col bg-white shadow-2xl dark:bg-zinc-900"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cv-tips-title"
      >
        <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-4 dark:border-zinc-800">
          <h2
            id="cv-tips-title"
            className="text-base font-black text-zinc-900 dark:text-white"
          >
            {t.assistantTitle}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            aria-label="Tutup"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5">
          <div className="flex items-center gap-4 border-b border-zinc-100 py-5 dark:border-zinc-800">
            <div className="relative flex h-20 w-20 shrink-0 items-center justify-center">
              <svg className="h-20 w-20 -rotate-90" viewBox="0 0 36 36">
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
                  strokeDasharray={`${result.score} 100`}
                  strokeLinecap="round"
                />
              </svg>
              <span
                className="absolute text-xl font-black"
                style={{ color: ringColor }}
              >
                {result.score}%
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-black text-zinc-900 dark:text-white">
                {t.goodJob(result.displayName)}
              </p>
              <p className="mt-0.5 text-xs font-semibold text-zinc-600 dark:text-zinc-300">
                {t.scoreLine(result.score)}
              </p>
              <p className="mt-2 text-[11px] leading-relaxed text-zinc-500 dark:text-zinc-400">
                {t.intro}
              </p>
            </div>
          </div>

          <div>
            {result.categories.map((category) => (
              <CategoryBlock
                key={category.id}
                category={category}
                expanded={expanded[category.id] ?? true}
                onToggle={() =>
                  setExpanded((prev) => ({
                    ...prev,
                    [category.id]: !prev[category.id],
                  }))
                }
                onFix={handleFix}
                tapLabel={t.tapToFix}
                optionalLabel={t.optional}
                allDoneLabel={t.allDone}
              />
            ))}
          </div>
        </div>

        <div className="border-t border-zinc-200 px-5 py-3 text-center text-[10px] text-zinc-400 dark:border-zinc-800">
          {t.checklistFooter(result.totalPassed, result.totalChecks)}
        </div>
      </aside>
    </>
  );
}