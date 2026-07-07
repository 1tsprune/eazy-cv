"use client";

import { Download, Loader2 } from "lucide-react";
import { useCallback, useRef, useState, type ReactElement } from "react";
import type { DocumentProps } from "@react-pdf/renderer";
import {
  deliverPdfBlob,
  downloadPdfBlob,
  isIosDevice,
} from "@/lib/pdf-download";
import { useResumePdfOptional } from "@/context/ResumePdfContext";
import { useTheme } from "@/context/ThemeContext";
import { getUiDict } from "@/lib/ui-i18n";
import { PdfDownloadOverlay } from "./PdfDownloadOverlay";

export const DOWNLOAD_MIN_SECONDS = 10;
const DOWNLOAD_MIN_MS = DOWNLOAD_MIN_SECONDS * 1000;
const TICK_MS = 50;

type Props = {
  buildDocument?: () => ReactElement<DocumentProps>;
  waitForBlob?: () => Promise<Blob>;
  filename: string;
  label: string;
  fullName?: string;
  className?: string;
  showDonationOverlay?: boolean;
};

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

export function PdfDownloadButton({
  buildDocument,
  waitForBlob: waitForBlobProp,
  filename,
  label,
  fullName = "",
  className = "",
  showDonationOverlay = true,
}: Props) {
  const resumePdf = useResumePdfOptional();
  const waitForBlob = waitForBlobProp ?? resumePdf?.waitForBlob;
  const { uiLocale } = useTheme();
  const t = getUiDict(uiLocale);
  const [loading, setLoading] = useState(false);
  const [hint, setHint] = useState<string | null>(null);
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(DOWNLOAD_MIN_SECONDS);
  const [progress, setProgress] = useState(0);
  const ios = isIosDevice();
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopTicks = useCallback(() => {
    if (tickRef.current) {
      clearInterval(tickRef.current);
      tickRef.current = null;
    }
  }, []);

  const startOverlay = useCallback(() => {
    const started = Date.now();
    setOverlayOpen(true);
    setSecondsLeft(DOWNLOAD_MIN_SECONDS);
    setProgress(0);
    stopTicks();
    tickRef.current = setInterval(() => {
      const elapsed = Date.now() - started;
      const ratio = Math.min(1, elapsed / DOWNLOAD_MIN_MS);
      setProgress(ratio * 100);
      setSecondsLeft(Math.max(0, Math.ceil((DOWNLOAD_MIN_MS - elapsed) / 1000)));
    }, TICK_MS);
  }, [stopTicks]);

  async function handleClick() {
    if (loading) return;
    if (!waitForBlob && !buildDocument) return;

    setLoading(true);
    setHint(null);
    if (showDonationOverlay) startOverlay();

    try {
      let result;
      if (waitForBlob) {
        const [blob] = await Promise.all([waitForBlob(), wait(DOWNLOAD_MIN_MS)]);
        result = await deliverPdfBlob(blob, filename);
      } else if (buildDocument) {
        const [, r] = await Promise.all([
          wait(DOWNLOAD_MIN_MS),
          downloadPdfBlob(buildDocument(), filename),
        ]);
        result = r;
      }

      if (result?.method === "share") {
        setHint(t.downloadIosHint);
        window.setTimeout(() => setHint(null), 6000);
      }
    } catch (err) {
      setHint(
        err instanceof Error && err.message === "ios_share_unavailable"
          ? t.downloadIosUnsupported
          : t.downloadFailed,
      );
    } finally {
      stopTicks();
      setProgress(100);
      setSecondsLeft(0);
      window.setTimeout(() => setOverlayOpen(false), 280);
      setLoading(false);
    }
  }

  return (
    <>
      {overlayOpen && showDonationOverlay ? (
        <PdfDownloadOverlay
          fullName={fullName}
          secondsLeft={secondsLeft}
          progress={progress}
        />
      ) : null}
      <div className={`w-full ${className}`}>
        <button
          type="button"
          onClick={handleClick}
          disabled={loading}
          className={`inline-flex w-full items-center justify-center gap-1.5 rounded-xl px-5 py-2.5 text-xs font-bold transition ${
            loading
              ? "cursor-wait bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500"
              : "bg-slate-700 text-white hover:bg-slate-800"
          }`}
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Download className="h-4 w-4" />
          )}
          {loading ? t.downloadProcessing(secondsLeft) : label}
        </button>
        {ios || hint ? (
          <p className="mt-1.5 text-center text-[10px] leading-snug text-zinc-500 dark:text-zinc-400">
            {hint ?? (ios ? t.downloadIosHint : null)}
          </p>
        ) : null}
      </div>
    </>
  );
}