"use client";

import { ChevronDown, ChevronUp, GripVertical } from "lucide-react";
import { useState } from "react";
import { useResume } from "@/context/ResumeContext";
import { useTheme } from "@/context/ThemeContext";
import { getUiDict } from "@/lib/ui-i18n";
import { t as cvT } from "@/lib/i18n";
import type { SectionKey } from "@/lib/types";

function sectionLabel(
  key: SectionKey,
  cvLang: "id" | "en",
  uiLocale: "id" | "en",
  cvProfile: import("@/lib/types").CvProfile,
) {
  if (key === "custom")
    return uiLocale === "id" ? "Section Custom" : "Custom Sections";
  if (key === "skills")
    return cvLang === "id" ? "Keahlian" : "Skills";
  const map: Partial<Record<SectionKey, Parameters<typeof cvT>[1]>> = {
    experience: "experience",
    education: "education",
    organizations: "organizations",
    projects: "projects",
    certifications: "certifications",
    languages: "languages",
  };
  const k = map[key];
  return k ? cvT(cvLang, k, cvProfile) : key;
}

export function SectionOrderPanel() {
  const { config, updateConfig } = useResume();
  const { uiLocale } = useTheme();
  const t = getUiDict(uiLocale);
  const [dragKey, setDragKey] = useState<SectionKey | null>(null);

  const order = config.sectionOrder ?? [];

  const applyOrder = (next: SectionKey[]) => {
    updateConfig({ sectionOrder: next });
    setDragKey(null);
  };

  const handleDrop = (toKey: SectionKey) => {
    if (!dragKey || dragKey === toKey) return;
    const from = order.indexOf(dragKey);
    const to = order.indexOf(toKey);
    const next = [...order];
    next.splice(from, 1);
    next.splice(to, 0, dragKey);
    applyOrder(next);
  };

  const moveSection = (key: SectionKey, direction: -1 | 1) => {
    const index = order.indexOf(key);
    const target = index + direction;
    if (index < 0 || target < 0 || target >= order.length) return;
    const next = [...order];
    [next[index], next[target]] = [next[target], next[index]];
    applyOrder(next);
  };

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <p className="text-xs font-bold text-zinc-800 dark:text-white">
        {t.sectionOrder}
      </p>
      <p className="mt-0.5 text-[10px] text-zinc-400">{t.dragHint}</p>

      {/* Mobile: vertical list + up/down (HTML5 drag tidak andal di touch) */}
      <div className="mt-3 space-y-2 md:hidden">
        {order.map((key, index) => (
          <div
            key={key}
            className="flex items-center gap-1 rounded-xl border border-zinc-200 bg-zinc-50 px-2 py-1.5 dark:border-zinc-700 dark:bg-zinc-800"
          >
            <span className="min-w-0 flex-1 truncate px-1 text-[11px] font-semibold text-zinc-700 dark:text-zinc-200">
              {sectionLabel(key, config.language, uiLocale, config.cvProfile)}
            </span>
            <div className="flex shrink-0 items-center">
              <button
                type="button"
                aria-label={
                  uiLocale === "id" ? "Pindah ke atas" : "Move up"
                }
                disabled={index === 0}
                onClick={() => moveSection(key, -1)}
                className="rounded-lg p-1.5 text-zinc-500 transition hover:bg-zinc-200 disabled:opacity-30 dark:text-zinc-400 dark:hover:bg-zinc-700"
              >
                <ChevronUp className="h-4 w-4" />
              </button>
              <button
                type="button"
                aria-label={
                  uiLocale === "id" ? "Pindah ke bawah" : "Move down"
                }
                disabled={index === order.length - 1}
                onClick={() => moveSection(key, 1)}
                className="rounded-lg p-1.5 text-zinc-500 transition hover:bg-zinc-200 disabled:opacity-30 dark:text-zinc-400 dark:hover:bg-zinc-700"
              >
                <ChevronDown className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop: draggable chips */}
      <div className="mt-3 hidden flex-wrap gap-2 md:flex">
        {order.map((key) => (
          <div
            key={key}
            draggable
            onDragStart={() => setDragKey(key)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDrop(key)}
            onDragEnd={() => setDragKey(null)}
            className={`inline-flex cursor-grab items-center gap-1 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-[11px] font-semibold text-zinc-700 active:cursor-grabbing dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 ${
              dragKey === key ? "opacity-50" : ""
            }`}
          >
            <GripVertical className="h-3 w-3 text-zinc-400" />
            {sectionLabel(key, config.language, uiLocale, config.cvProfile)}
          </div>
        ))}
      </div>
    </div>
  );
}