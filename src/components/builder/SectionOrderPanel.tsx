"use client";

import { GripVertical } from "lucide-react";
import { useCallback, useState } from "react";
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
  const [activeKey, setActiveKey] = useState<SectionKey | null>(null);
  const [overKey, setOverKey] = useState<SectionKey | null>(null);

  const order = config.sectionOrder ?? [];

  const reorder = useCallback(
    (fromKey: SectionKey, toKey: SectionKey) => {
      if (fromKey === toKey) return;
      const from = order.indexOf(fromKey);
      const to = order.indexOf(toKey);
      if (from < 0 || to < 0) return;
      const next = [...order];
      next.splice(from, 1);
      next.splice(to, 0, fromKey);
      updateConfig({ sectionOrder: next });
    },
    [order, updateConfig],
  );

  const finishDrag = useCallback(() => {
    if (activeKey && overKey) reorder(activeKey, overKey);
    setActiveKey(null);
    setOverKey(null);
  }, [activeKey, overKey, reorder]);

  const handlePointerDown = (
    key: SectionKey,
    e: React.PointerEvent<HTMLButtonElement>,
  ) => {
    if (e.button !== 0) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    setActiveKey(key);
    setOverKey(key);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!activeKey) return;
    const el = document.elementFromPoint(e.clientX, e.clientY);
    const chip = el?.closest<HTMLElement>("[data-section-key]");
    const target = chip?.dataset.sectionKey as SectionKey | undefined;
    if (target) setOverKey(target);
  };

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <p className="text-xs font-bold text-zinc-800 dark:text-white">
        {t.sectionOrder}
      </p>
      <p className="mt-0.5 text-[10px] text-zinc-400">{t.dragHint}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {order.map((key) => (
          <div
            key={key}
            data-section-key={key}
            className={`inline-flex max-w-full items-center gap-0.5 rounded-full border border-zinc-200 bg-zinc-50 py-1.5 pl-1.5 pr-3 text-[11px] font-semibold text-zinc-700 transition dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 ${
              activeKey === key ? "opacity-50" : ""
            } ${
              overKey === key && activeKey && activeKey !== key
                ? "ring-2 ring-slate-400 dark:ring-slate-500"
                : ""
            }`}
          >
            <button
              type="button"
              aria-label={
                uiLocale === "id"
                  ? `Geser ${sectionLabel(key, config.language, uiLocale, config.cvProfile)}`
                  : `Drag ${sectionLabel(key, config.language, uiLocale, config.cvProfile)}`
              }
              className="flex h-6 w-6 shrink-0 cursor-grab touch-none items-center justify-center rounded-full text-zinc-400 active:cursor-grabbing"
              onPointerDown={(e) => handlePointerDown(key, e)}
              onPointerMove={handlePointerMove}
              onPointerUp={finishDrag}
              onPointerCancel={finishDrag}
            >
              <GripVertical className="h-3 w-3" />
            </button>
            <span className="truncate">
              {sectionLabel(key, config.language, uiLocale, config.cvProfile)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}