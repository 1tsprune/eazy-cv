"use client";

import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  /** Show A4 badge + WYSIWYG hint */
  showBadge?: boolean;
  wysiwygHint?: string;
}

export function PreviewPaper({ children, showBadge = false, wysiwygHint }: Props) {
  return (
    <div className="relative w-full">
      {showBadge && (
        <div className="mb-1 flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-md bg-white/90 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-500 shadow-sm ring-1 ring-zinc-200/60 dark:bg-zinc-800/90 dark:text-zinc-400 dark:ring-zinc-700">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden />
            A4
          </span>
          {wysiwygHint ? (
            <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 ring-1 ring-emerald-200/80 dark:bg-emerald-950/40 dark:text-emerald-400 dark:ring-emerald-900/60">
              {wysiwygHint}
            </span>
          ) : null}
        </div>
      )}
      <div
        className="relative w-full overflow-hidden bg-white text-zinc-900"
        style={{
          minHeight: "297mm",
          boxShadow:
            "0 0 0 1px rgba(0,0,0,0.04), 0 2px 4px rgba(0,0,0,0.04), 0 12px 32px rgba(0,0,0,0.10), 0 32px 64px rgba(0,0,0,0.06)",
        }}
      >
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent"
          aria-hidden
        />
        {children}
      </div>
    </div>
  );
}