"use client";

import { CheckCircle2, ChevronDown, ChevronUp, Circle, X } from "lucide-react";
import { useMemo, useState } from "react";
import { useResume } from "@/context/ResumeContext";
import { useTheme } from "@/context/ThemeContext";
import {
  calculateCvAssistant,
  getAssistantCopy,
  type AssistantCategory,
  type AssistantCheck,
} from "@/lib/cv-assistant";
import { scrollToCvSection } from "@/lib/ats-scroll-targets";

type Props = {
  open: boolean;
  onClose: () => void;
  onFixCheck?: (checkId: string, scrollTarget: string) => void;
};

function progressTone(passed: number, total: number) {
  if (passed === total) {
    return "bg-emerald-50 text-emerald-800 ring-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-200 dark:ring-emerald-800";
  }
  if (passed === 0) {
    return "bg-zinc-100 text-zinc-700 ring-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:ring-zinc-700";
  }
  return "bg-amber-50 text-amber-900 ring-amber-200 dark:bg-amber-950/40 dark:text-amber-100 dark:ring-amber-800";
}

function CheckLine({
  check,
  categoryId,
  optionalLabel,
  onFix,
}: {
  check: AssistantCheck;
  categoryId: string;
  optionalLabel: string;
  onFix: (checkId: string, target: string) => void;
}) {
  const tipOnly = categoryId === "length" || categoryId === "bullets";

  return (
    <button
      type="button"
      onClick={() => onFix(check.id, check.scrollTarget)}
      className="flex w-full items-start gap-2.5 rounded-lg px-1 py-2.5 text-left transition hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
    >
      {check.passed ? (
        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
      ) : (
        <Circle className="mt-0.5 h-4 w-4 shrink-0 stroke-[2] text-zinc-300 dark:text-zinc-600" />
      )}
      <span className="min-w-0 flex-1 text-[13px] leading-relaxed text-zinc-700 dark:text-zinc-300">
        {tipOnly ? (
          check.tip
        ) : (
          <>
            <span className="font-semibold text-zinc-900 dark:text-zinc-100">
              {check.label}:
            </span>{" "}
            {check.tip}
          </>
        )}
        {check.optional ? (
          <span className="text-zinc-500 dark:text-zinc-400">
            {" "}
            ({optionalLabel})
          </span>
        ) : null}
      </span>
    </button>
  );
}

function CategoryBlock({
  category,
  expanded,
  onToggle,
  onFix,
  optionalLabel,
}: {
  category: AssistantCategory;
  expanded: boolean;
  onToggle: () => void;
  onFix: (checkId: string, target: string) => void;
  optionalLabel: string;
}) {
  let lastGroup: string | undefined;

  return (
    <section className="overflow-hidden rounded-xl border border-zinc-200/90 bg-white dark:border-zinc-700 dark:bg-zinc-900">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-start justify-between gap-3 px-4 py-3.5 text-left transition hover:bg-zinc-50/80 dark:hover:bg-zinc-800/40"
      >
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[15px] font-bold text-zinc-950 dark:text-white">
              {category.title}
            </span>
            <span
              className={`rounded-md px-2 py-0.5 text-xs font-bold tabular-nums ring-1 ${progressTone(category.passedCount, category.totalCount)}`}
            >
              {category.passedCount} / {category.totalCount}
            </span>
          </div>
          {!expanded ? (
            <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
              {category.description}
            </p>
          ) : null}
        </div>
        {expanded ? (
          <ChevronUp className="mt-0.5 h-4 w-4 shrink-0 text-zinc-400" />
        ) : (
          <ChevronDown className="mt-0.5 h-4 w-4 shrink-0 text-zinc-400" />
        )}
      </button>

      {expanded ? (
        <div className="border-t border-zinc-100 px-4 pb-3 pt-1 dark:border-zinc-800">
          <p className="mb-2 px-1 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
            {category.description}
          </p>
          <ul className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {category.checks.map((check) => {
              const showGroupHeader = check.group && check.group !== lastGroup;
              if (showGroupHeader) lastGroup = check.group;

              return (
                <li key={check.id}>
                  {showGroupHeader ? (
                    <p className="px-1 pb-1 pt-3 text-xs font-bold text-zinc-800 dark:text-zinc-200">
                      {check.group}
                    </p>
                  ) : null}
                  <CheckLine
                    check={check}
                    categoryId={category.id}
                    optionalLabel={optionalLabel}
                    onFix={onFix}
                  />
                </li>
              );
            })}
          </ul>
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
        className="fixed inset-y-0 right-0 z-[70] flex w-full max-w-[min(100vw,420px)] flex-col border-l border-zinc-200 bg-[#f4f5f7] shadow-2xl dark:border-zinc-700 dark:bg-zinc-950"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cv-tips-title"
      >
        <div className="flex items-center justify-between border-b border-zinc-200 bg-white px-5 py-4 dark:border-zinc-800 dark:bg-zinc-900">
          <h2
            id="cv-tips-title"
            className="text-base font-black text-zinc-950 dark:text-white"
          >
            {t.assistantTitle}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-zinc-500 transition hover:bg-zinc-100 dark:hover:bg-zinc-800"
            aria-label="Tutup"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4">
          <div className="mb-4 rounded-xl border border-zinc-200/90 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900">
            <div className="flex items-start gap-4">
              <div className="relative flex h-[4.5rem] w-[4.5rem] shrink-0 items-center justify-center">
                <svg
                  className="h-[4.5rem] w-[4.5rem] -rotate-90"
                  viewBox="0 0 36 36"
                >
                  <circle
                    cx="18"
                    cy="18"
                    r="15.5"
                    fill="none"
                    className="stroke-zinc-200 dark:stroke-zinc-700"
                    strokeWidth="2.5"
                  />
                  <circle
                    cx="18"
                    cy="18"
                    r="15.5"
                    fill="none"
                    stroke={ringColor}
                    strokeWidth="2.5"
                    strokeDasharray={`${result.score} 100`}
                    strokeLinecap="round"
                  />
                </svg>
                <span
                  className="absolute text-xl font-black tabular-nums"
                  style={{ color: ringColor }}
                >
                  {result.score}%
                </span>
              </div>
              <div className="min-w-0 pt-0.5">
                <p className="text-[15px] font-bold leading-snug text-zinc-950 dark:text-white">
                  {t.goodJob(result.displayName)}
                </p>
                <p className="mt-1 text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                  {t.scoreLine(result.score)}
                </p>
                <p className="mt-2 text-[13px] leading-relaxed text-zinc-600 dark:text-zinc-400">
                  {t.intro}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2.5">
            {result.categories.map((category) => (
              <CategoryBlock
                key={category.id}
                category={category}
                expanded={expanded[category.id] ?? false}
                onToggle={() =>
                  setExpanded((prev) => ({
                    ...prev,
                    [category.id]: !prev[category.id],
                  }))
                }
                onFix={handleFix}
                optionalLabel={t.optional}
              />
            ))}
          </div>
        </div>

        <div className="border-t border-zinc-200 bg-white px-5 py-3 text-center text-xs font-medium text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
          {t.checklistFooter(result.totalPassed, result.totalChecks)}
        </div>
      </aside>
    </>
  );
}