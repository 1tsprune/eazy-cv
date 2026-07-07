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

function progressTone(passed: number, total: number) {
  if (passed === total) {
    return "bg-emerald-100 text-emerald-900 ring-emerald-200 dark:bg-emerald-950 dark:text-emerald-200 dark:ring-emerald-800";
  }
  if (passed === 0) {
    return "bg-rose-100 text-rose-900 ring-rose-200 dark:bg-rose-950 dark:text-rose-200 dark:ring-rose-800";
  }
  return "bg-amber-100 text-amber-900 ring-amber-200 dark:bg-amber-950 dark:text-amber-100 dark:ring-amber-800";
}

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
    <section className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-start justify-between gap-3 px-4 py-4 text-left transition hover:bg-zinc-50 dark:hover:bg-zinc-800/60"
      >
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-base font-bold leading-tight text-zinc-950 dark:text-white">
              {category.title}
            </span>
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-bold tabular-nums ring-1 ${progressTone(category.passedCount, category.totalCount)}`}
            >
              {category.passedCount}/{category.totalCount}
            </span>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
            {category.description}
          </p>
        </div>
        {expanded ? (
          <ChevronUp className="mt-1 h-5 w-5 shrink-0 text-zinc-500" />
        ) : (
          <ChevronDown className="mt-1 h-5 w-5 shrink-0 text-zinc-500" />
        )}
      </button>

      {expanded ? (
        <div className="border-t border-zinc-100 px-4 pb-4 pt-3 dark:border-zinc-800">
          {failed.length === 0 ? (
            <p className="flex items-center gap-2.5 rounded-lg bg-emerald-50 px-3.5 py-3 text-sm font-semibold text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-200">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              {allDoneLabel}
            </p>
          ) : (
            <ul className="space-y-3">
              {failed.map((check) => {
                const showGroupHeader = check.group && check.group !== lastGroup;
                if (showGroupHeader) lastGroup = check.group;

                return (
                  <li key={check.id}>
                    {showGroupHeader ? (
                      <p className="mb-2 mt-1 text-xs font-bold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                        {check.group}
                      </p>
                    ) : null}
                    <button
                      type="button"
                      onClick={() => onFix(check.id, check.scrollTarget)}
                      className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-3.5 text-left shadow-sm transition hover:border-blue-300 hover:bg-blue-50/40 dark:border-zinc-600 dark:bg-zinc-800 dark:hover:border-blue-600 dark:hover:bg-zinc-800/90"
                    >
                      <div className="flex items-start gap-3">
                        <Circle className="mt-0.5 h-4 w-4 shrink-0 stroke-[2.5] text-rose-500 dark:text-rose-400" />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-bold leading-snug text-zinc-950 dark:text-zinc-50">
                            {check.label}
                            {check.optional ? (
                              <span className="ml-1.5 text-xs font-medium text-zinc-500 dark:text-zinc-400">
                                ({optionalLabel})
                              </span>
                            ) : null}
                          </p>
                          <p className="mt-2 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
                            {check.tip}
                          </p>
                          <span className="mt-2.5 inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-bold text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                            {tapLabel} →
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
            <ul className="mt-4 space-y-2 rounded-lg border border-emerald-100 bg-emerald-50/80 px-3.5 py-3 dark:border-emerald-900/50 dark:bg-emerald-950/30">
              {category.checks
                .filter((c) => c.passed)
                .map((check) => (
                  <li
                    key={check.id}
                    className="flex items-start gap-2 text-sm font-medium text-emerald-900 dark:text-emerald-200"
                  >
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>{check.label}</span>
                  </li>
                ))}
            </ul>
          ) : null}
        </div>
      ) : null}
    </section>
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
      ? "#15803d"
      : result.score >= 50
        ? "#b45309"
        : "#be123c";

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
        className="fixed inset-0 z-[60] bg-zinc-900/30 backdrop-blur-[2px]"
        onClick={onClose}
      />

      <aside
        className="fixed inset-y-0 right-0 z-[70] flex w-full max-w-[min(100vw,420px)] flex-col border-l border-zinc-200 bg-zinc-100 shadow-2xl dark:border-zinc-700 dark:bg-zinc-950"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cv-tips-title"
      >
        <div className="flex items-center justify-between border-b border-zinc-200 bg-white px-5 py-4 dark:border-zinc-800 dark:bg-zinc-900">
          <h2
            id="cv-tips-title"
            className="text-lg font-black tracking-tight text-zinc-950 dark:text-white"
          >
            {t.assistantTitle}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-zinc-600 transition hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
            aria-label="Tutup"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4">
          <div className="mb-4 rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
            <div className="flex items-start gap-4">
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
                  className="absolute text-2xl font-black tabular-nums"
                  style={{ color: ringColor }}
                >
                  {result.score}%
                </span>
              </div>
              <div className="min-w-0 pt-1">
                <p className="text-base font-black leading-snug text-zinc-950 dark:text-white">
                  {t.goodJob(result.displayName)}
                </p>
                <p className="mt-1.5 text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                  {t.scoreLine(result.score)}
                </p>
                <p className="mt-2.5 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
                  {t.intro}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
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

        <div className="border-t border-zinc-200 bg-white px-5 py-4 text-center text-sm font-medium text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
          {t.checklistFooter(result.totalPassed, result.totalChecks)}
        </div>
      </aside>
    </>
  );
}