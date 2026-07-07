"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { DONATION, SOCIAL } from "@/lib/config";
import { getUiDict } from "@/lib/ui-i18n";
import { useTheme } from "@/context/ThemeContext";

export type PdfDownloadPhase = "preparing" | "share" | "tab" | "done";

type Props = {
  fullName: string;
  secondsLeft: number;
  progress: number;
  phase?: PdfDownloadPhase;
  ios?: boolean;
};

/** Fullscreen modal: greeting, thanks, trakteer, 10s progress. Cannot dismiss until done. */
export function PdfDownloadOverlay({
  fullName,
  secondsLeft,
  progress,
  phase = "preparing",
  ios = false,
}: Props) {
  const { uiLocale } = useTheme();
  const t = getUiDict(uiLocale);
  const displayName = fullName.trim() || t.downloadOverlayDefaultName;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const iosHint =
    phase === "share"
      ? t.downloadIosOverlayShare
      : phase === "tab"
        ? t.downloadIosOverlayTab
        : ios
          ? t.downloadIosOverlayPreparing
          : null;

  const content = (
    <div
      className="fixed inset-0 z-[200] flex flex-col items-center justify-start overflow-auto bg-[#faf8f6]/97 px-6 py-12 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pdf-download-overlay-title"
    >
      <div className="flex w-full max-w-[280px] flex-col items-center gap-4 text-center">
        <img
          src={SOCIAL.twitter.avatarUrl}
          alt={SOCIAL.twitter.name}
          className="h-12 w-12 rounded-full object-cover ring-2 ring-zinc-200"
        />
        <h2
          id="pdf-download-overlay-title"
          className="text-[0.9rem] font-semibold text-[#2c2824]"
        >
          {t.downloadOverlayGreeting(displayName)}
        </h2>
        <p className="text-[0.78rem] font-normal leading-relaxed text-[#6b635a]">
          {t.downloadOverlayThanks}
        </p>
        <a
          href={DONATION.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1 inline-flex items-center gap-1.5 rounded-lg bg-[#cb3527] px-4 py-2 text-[0.72rem] font-semibold text-white no-underline"
        >
          🍧 {t.downloadOverlayDonate}
        </a>
        {iosHint ? (
          <p className="rounded-lg bg-white/80 px-3 py-2 text-[0.72rem] font-medium leading-snug text-[#3a3530] ring-1 ring-[#e8e4df]">
            {iosHint}
          </p>
        ) : null}
      </div>
      <div className="mt-8 flex w-full max-w-[200px] flex-col items-center gap-2">
        <div className="h-[3px] w-full overflow-hidden rounded-sm bg-[#e8e4df]">
          <div
            className="h-full rounded-sm bg-[#3a3530] transition-[width] duration-1000 ease-linear"
            style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
          />
        </div>
        <span className="text-[0.68rem] font-medium text-[#a9a29a]">
          {phase === "preparing" && secondsLeft > 0
            ? t.downloadOverlayProcessing
            : null}
          {t.downloadOverlayCountdown(secondsLeft)}
        </span>
      </div>
    </div>
  );

  if (!mounted) return null;
  return createPortal(content, document.body);
}