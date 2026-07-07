"use client";

import { LayoutTemplate } from "lucide-react";
import type { ReactNode } from "react";
import { useResume } from "@/context/ResumeContext";
import { useTheme } from "@/context/ThemeContext";
import { themeColors } from "@/lib/colors";
import {
  COLOR_THEMES,
  TEMPLATE_DEFAULT_COLOR,
} from "@/lib/template-theme";
import { CV_FONT_FAMILIES, CV_FONT_SIZES } from "@/lib/typography";
import { getUiDict } from "@/lib/ui-i18n";
import type { ColorTheme, CvFontFamily, CvFontSize, ModernTemplate } from "@/lib/types";

const MODERN_TEMPLATES: {
  id: ModernTemplate;
  label: string;
  color: ColorTheme;
}[] = [
  { id: "elegant", label: "Elegant", color: "indigo" },
  { id: "professional", label: "Professional", color: "emerald" },
  { id: "executive", label: "Executive", color: "violet" },
  { id: "creative", label: "Creative", color: "rose" },
  { id: "compact", label: "Compact", color: "slate" },
  { id: "academic", label: "Academic", color: "amber" },
];

const FONT_SIZE_LABEL_KEYS = {
  sm: "fontSizeSmall",
  md: "fontSizeMedium",
  lg: "fontSizeLarge",
} as const satisfies Record<CvFontSize, keyof ReturnType<typeof getUiDict>>;

function AtsThumb() {
  return (
    <div className="flex h-full flex-col p-2">
      <div className="mb-1.5 text-[8px] font-bold uppercase tracking-wider text-zinc-800">
        Nama
      </div>
      <div className="mb-2 border-b border-zinc-300" />
      <div className="mb-1 text-[6px] font-bold uppercase tracking-wide text-zinc-500">
        Pengalaman
      </div>
      <div className="space-y-1">
        <div className="h-1 w-full rounded bg-zinc-200" />
        <div className="h-1 w-4/5 rounded bg-zinc-200" />
      </div>
      <div className="mt-2 text-[6px] font-bold uppercase tracking-wide text-zinc-500">
        Skills
      </div>
      <div className="mt-1 h-1 w-3/4 rounded bg-zinc-200" />
    </div>
  );
}

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

function StyleCard({
  active,
  label,
  onClick,
  children,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-[72px] shrink-0 flex-col overflow-hidden rounded-xl border-2 transition ${
        active
          ? "border-slate-700 shadow-md dark:border-slate-400"
          : "border-zinc-200 hover:border-zinc-300 dark:border-zinc-600 dark:hover:border-zinc-500"
      }`}
      title={label}
    >
      <div className="aspect-[3/4] overflow-hidden bg-white">{children}</div>
      <span
        className={`truncate px-1 py-1 text-center text-[9px] font-bold ${
          active
            ? "bg-slate-700 text-white"
            : "bg-zinc-50 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
        }`}
      >
        {label}
      </span>
    </button>
  );
}

export function TemplatePicker() {
  const { config, updateConfig } = useResume();
  const { uiLocale } = useTheme();
  const t = getUiDict(uiLocale);
  const isAts = config.exportMode === "ats";

  const pickAts = () => {
    updateConfig({ exportMode: "ats" });
  };

  const pickModern = (id: ModernTemplate) => {
    updateConfig({
      exportMode: "modern",
      template: id,
      colorTheme: TEMPLATE_DEFAULT_COLOR[id],
    });
  };

  const activeLabel = isAts ? t.exportAts : config.template;

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-2.5 shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
      <div className="mb-2.5 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <LayoutTemplate className="h-3.5 w-3.5 text-slate-600" />
          <span className="text-xs font-bold text-zinc-800 dark:text-white">
            {t.cvStyle}
          </span>
        </div>
        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold capitalize text-slate-700 dark:bg-slate-800 dark:text-slate-300">
          {activeLabel}
        </span>
      </div>

      <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
        <StyleCard active={isAts} label={t.exportAts} onClick={pickAts}>
          <AtsThumb />
        </StyleCard>

        {MODERN_TEMPLATES.map((tpl) => {
          const c = themeColors[tpl.color].primary;
          return (
            <StyleCard
              key={tpl.id}
              active={!isAts && config.template === tpl.id}
              label={tpl.label}
              onClick={() => pickModern(tpl.id)}
            >
              <TemplateThumb id={tpl.id} color={c} />
            </StyleCard>
          );
        })}
      </div>

      {!isAts ? (
        <div className="mt-3 space-y-3 border-t border-zinc-100 pt-3 dark:border-zinc-800">
          <div>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
              {t.color}
            </p>
            <div className="flex flex-wrap gap-2">
              {COLOR_THEMES.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => updateConfig({ colorTheme: c })}
                  className={`h-8 w-8 rounded-full border-2 transition ${
                    config.colorTheme === c
                      ? "border-zinc-900 scale-110 dark:border-white"
                      : "border-transparent hover:scale-105"
                  }`}
                  style={{ backgroundColor: themeColors[c].primary }}
                  title={c}
                />
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
              {t.fontFamily}
            </p>
            <div className="grid grid-cols-2 gap-1.5">
              {CV_FONT_FAMILIES.map((font) => (
                <button
                  key={font.id}
                  type="button"
                  onClick={() =>
                    updateConfig({ fontFamily: font.id as CvFontFamily })
                  }
                  className={`rounded-lg px-2 py-2 text-left text-[11px] font-semibold ${
                    config.fontFamily === font.id
                      ? "bg-slate-700 text-white"
                      : "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                  }`}
                >
                  {font.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
              {t.fontSize}
            </p>
            <div className="flex gap-2">
              {CV_FONT_SIZES.map((size) => (
                <button
                  key={size.id}
                  type="button"
                  onClick={() =>
                    updateConfig({ fontSize: size.id as CvFontSize })
                  }
                  className={`flex-1 rounded-xl py-2 text-xs font-bold ${
                    config.fontSize === size.id
                      ? "bg-slate-700 text-white"
                      : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
                  }`}
                >
                  {t[FONT_SIZE_LABEL_KEYS[size.id]]}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-3 space-y-3 border-t border-zinc-100 pt-3 dark:border-zinc-800">
          <p className="text-[11px] leading-relaxed text-zinc-500 dark:text-zinc-400">
            {t.atsStyleMenuHint}
          </p>
          <div>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
              {t.fontFamily}
            </p>
            <div className="grid grid-cols-2 gap-1.5">
              {CV_FONT_FAMILIES.map((font) => (
                <button
                  key={font.id}
                  type="button"
                  onClick={() =>
                    updateConfig({ fontFamily: font.id as CvFontFamily })
                  }
                  className={`rounded-lg px-2 py-2 text-left text-[11px] font-semibold ${
                    config.fontFamily === font.id
                      ? "bg-slate-700 text-white"
                      : "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                  }`}
                >
                  {font.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
              {t.fontSize}
            </p>
            <div className="flex gap-2">
              {CV_FONT_SIZES.map((size) => (
                <button
                  key={size.id}
                  type="button"
                  onClick={() =>
                    updateConfig({ fontSize: size.id as CvFontSize })
                  }
                  className={`flex-1 rounded-xl py-2 text-xs font-bold ${
                    config.fontSize === size.id
                      ? "bg-slate-700 text-white"
                      : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
                  }`}
                >
                  {t[FONT_SIZE_LABEL_KEYS[size.id]]}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}