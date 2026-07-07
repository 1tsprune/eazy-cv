"use client";

import { ArrowLeft, ChevronDown, Mail, Wand2 } from "lucide-react";
import { useRef, useState } from "react";
import { useResume } from "@/context/ResumeContext";
import { useTheme } from "@/context/ThemeContext";
import { getProfileLabel } from "@/lib/cv-profile";
import { getUiDict } from "@/lib/ui-i18n";
import type { CvProfile } from "@/lib/types";

type Props = {
  showCover?: boolean;
  onToggleCover?: () => void;
};

const SAMPLE_PROFILES: CvProfile[] = [
  "professional",
  "internship",
  "student",
];

const actionBtnClass =
  "inline-flex shrink-0 items-center gap-1 rounded-full border px-2.5 py-1.5 text-[11px] font-bold shadow-sm transition sm:gap-1.5 sm:px-4 sm:py-2 sm:text-xs";

export function QuickActions({ showCover = false, onToggleCover }: Props) {
  const { loadSample } = useResume();
  const { uiLocale } = useTheme();
  const t = getUiDict(uiLocale);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  return (
    <div className="flex shrink-0 flex-nowrap items-center gap-1.5 sm:gap-2">
      {!showCover && (
        <div className="relative shrink-0" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            title={t.exampleCvHint}
            className={`${actionBtnClass} border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700`}
          >
            <Wand2 className="h-3.5 w-3.5 shrink-0 text-slate-600" />
            <span className="sm:hidden">{t.exampleCvShort}</span>
            <span className="hidden sm:inline">{t.exampleCv}</span>
            <ChevronDown
              className={`h-3.5 w-3.5 shrink-0 transition ${menuOpen ? "rotate-180" : ""}`}
            />
          </button>
          {menuOpen && (
            <div className="absolute left-0 top-full z-20 mt-1 min-w-[180px] overflow-hidden rounded-xl border border-zinc-200 bg-white py-1 shadow-lg dark:border-zinc-700 dark:bg-zinc-900">
              {SAMPLE_PROFILES.map((profile) => (
                <button
                  key={profile}
                  type="button"
                  onClick={() => {
                    loadSample(profile);
                    setMenuOpen(false);
                  }}
                  className="flex w-full items-center px-4 py-2.5 text-left text-xs font-semibold text-zinc-700 transition hover:bg-zinc-50 dark:text-zinc-200 dark:hover:bg-zinc-800"
                >
                  {t.exampleCv} {getProfileLabel(profile, uiLocale)}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
      {onToggleCover && (
        <button
          type="button"
          onClick={onToggleCover}
          className={`${actionBtnClass} ${
            showCover ? "hidden md:inline-flex" : "inline-flex"
          } ${
            showCover
              ? "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
              : "border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
          }`}
        >
          {showCover ? (
            <>
              <ArrowLeft className="h-3.5 w-3.5 shrink-0" />
              {t.backToCv}
            </>
          ) : (
            <>
              <Mail className="h-3.5 w-3.5 shrink-0" />
              <span className="sm:hidden">{t.openCoverLetterShort}</span>
              <span className="hidden sm:inline">{t.openCoverLetter}</span>
            </>
          )}
        </button>
      )}
    </div>
  );
}