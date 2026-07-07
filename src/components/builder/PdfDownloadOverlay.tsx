"use client";

import { DONATION } from "@/lib/config";
import { getUiDict } from "@/lib/ui-i18n";
import { useTheme } from "@/context/ThemeContext";

type Props = {
  fullName: string;
  secondsLeft: number;
  progress: number;
};

export function PdfDownloadOverlay({
  fullName,
  secondsLeft,
  progress,
}: Props) {
  const { uiLocale } = useTheme();
  const t = getUiDict(uiLocale);
  const displayName = fullName.trim() || t.downloadOverlayDefaultName;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/55 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pdf-download-overlay-title"
    >
      <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl dark:border-zinc-700 dark:bg-zinc-900">
        <h2
          id="pdf-download-overlay-title"
          className="text-lg font-bold text-zinc-900 dark:text-white"
        >
          {t.downloadOverlayGreeting(displayName)}
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          {t.downloadOverlayThanks}
        </p>
        <a
          href={DONATION.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 py-3 text-sm font-bold text-white transition hover:bg-amber-600"
        >
          ☕ {t.downloadOverlayDonate}
        </a>
        <div className="mt-5">
          <div className="mb-2 flex items-center justify-between text-xs font-semibold text-zinc-500 dark:text-zinc-400">
            <span>{t.downloadOverlayProcessing}</span>
            <span>{t.downloadOverlayCountdown(secondsLeft)}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
            <div
              className="h-full rounded-full bg-slate-700 transition-[width] duration-100 ease-linear dark:bg-slate-400"
              style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}