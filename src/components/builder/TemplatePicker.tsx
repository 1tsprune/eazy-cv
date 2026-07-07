"use client";

import { LayoutTemplate } from "lucide-react";
import { useResume } from "@/context/ResumeContext";
import { useTheme } from "@/context/ThemeContext";
import { themeColors } from "@/lib/colors";
import { isResumeDataEmpty, isSampleResumeData } from "@/lib/resume-empty";
import { getUiDict } from "@/lib/ui-i18n";
import type { ModernTemplate } from "@/lib/types";

const TEMPLATES: {
  id: ModernTemplate;
  label: string;
  color: keyof typeof themeColors;
}[] = [
  { id: "elegant", label: "Elegant", color: "indigo" },
  { id: "minimal", label: "Minimal", color: "slate" },
  { id: "professional", label: "Professional", color: "emerald" },
  { id: "executive", label: "Executive", color: "violet" },
  { id: "creative", label: "Creative", color: "rose" },
  { id: "compact", label: "Compact", color: "slate" },
  { id: "academic", label: "Academic", color: "amber" },
];

function TemplateThumb({
  id,
  color,
}: {
  id: ModernTemplate;
  color: string;
}) {
  if (id === "professional") {
    return (
      <div className="flex h-full">
        <div className="w-[32%] shrink-0" style={{ backgroundColor: color }} />
        <div className="flex flex-1 flex-col gap-1 p-1.5">
          <div className="h-1 w-full rounded bg-zinc-200" />
          <div className="h-1 w-4/5 rounded bg-zinc-200" />
          <div className="h-1 w-full rounded bg-zinc-200" />
        </div>
      </div>
    );
  }
  if (id === "executive" || id === "creative") {
    return (
      <div className="flex h-full flex-col">
        <div className="h-[28%] shrink-0" style={{ backgroundColor: color }} />
        <div className="flex flex-1 flex-col gap-1 p-1.5">
          <div className="h-1 w-full rounded bg-zinc-200" />
          <div className="h-1 w-3/4 rounded bg-zinc-200" />
        </div>
      </div>
    );
  }
  return (
    <div className="flex h-full flex-col p-1.5">
      <div className="mb-1 text-[7px] font-bold" style={{ color }}>
        Aa
      </div>
      <div className="mb-1 border-b-2" style={{ borderColor: color }} />
      <div className="flex flex-1 flex-col gap-1">
        <div className="h-1 w-full rounded bg-zinc-200" />
        <div className="h-1 w-4/5 rounded bg-zinc-200" />
        <div className="h-1 w-full rounded bg-zinc-200" />
      </div>
    </div>
  );
}

export function TemplatePicker() {
  const { data, config, updateConfig, loadSampleWithTemplate } = useResume();
  const { uiLocale } = useTheme();
  const t = getUiDict(uiLocale);
  const isAts = config.exportMode === "ats";
  const empty = isResumeDataEmpty(data);

  const pick = (id: ModernTemplate) => {
    if (empty || isSampleResumeData(data)) {
      loadSampleWithTemplate(id);
    } else {
      updateConfig({ exportMode: "modern", template: id });
    }
  };

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-3 shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
      <div className="mb-2.5 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <LayoutTemplate className="h-3.5 w-3.5 text-slate-600" />
          <span className="text-xs font-bold text-zinc-800 dark:text-white">
            {t.template}
          </span>
        </div>
        {isAts ? (
          <button
            type="button"
            onClick={() => {
              if (empty) loadSampleWithTemplate("elegant");
              else updateConfig({ exportMode: "modern" });
            }}
            className="rounded-lg bg-slate-700 px-2.5 py-1 text-[10px] font-bold text-white transition hover:bg-slate-800"
          >
            {t.exportModern}
          </button>
        ) : (
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold capitalize text-slate-700 dark:bg-slate-800 dark:text-slate-300">
            {config.template}
          </span>
        )}
      </div>

      {isAts ? (
        <p className="mb-2 text-[11px] text-zinc-500 dark:text-zinc-400">
          {t.templateAtsHint}
        </p>
      ) : null}

      <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
        {TEMPLATES.map((tpl) => {
          const active = !isAts && config.template === tpl.id;
          const c = themeColors[tpl.color].primary;
          return (
            <button
              key={tpl.id}
              type="button"
              onClick={() => pick(tpl.id)}
              className={`flex w-[72px] shrink-0 flex-col overflow-hidden rounded-xl border-2 transition ${
                active
                  ? "border-slate-700 shadow-md dark:border-slate-400"
                  : "border-zinc-200 hover:border-zinc-300 dark:border-zinc-600 dark:hover:border-zinc-500"
              }`}
              title={tpl.label}
            >
              <div className="aspect-[3/4] overflow-hidden bg-white">
                <TemplateThumb id={tpl.id} color={c} />
              </div>
              <span
                className={`truncate px-1 py-1 text-center text-[9px] font-bold ${
                  active
                    ? "bg-slate-700 text-white"
                    : "bg-zinc-50 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
                }`}
              >
                {tpl.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}