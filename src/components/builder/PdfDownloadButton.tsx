"use client";

import { Download, Loader2 } from "lucide-react";
import { useCallback, useRef, useState, type ReactElement } from "react";
import type { DocumentProps } from "@react-pdf/renderer";
import {
  deliverPdfBlob,
  downloadPdfBlob,
  isIosDevice,
  renderPdfBlob,
  type PdfDownloadResult,
} from "@/lib/pdf-download";
import { useResumePdfOptional } from "@/context/ResumePdfContext";
import { useTheme } from "@/context/ThemeContext";
import { getUiDict } from "@/lib/ui-i18n";
import {
  PdfDownloadOverlay,
  type PdfDownloadPhase,
} from "./PdfDownloadOverlay";

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
  disabled?: boolean;
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
  disabled = false,
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
  const [phase, setPhase] = useState<PdfDownloadPhase>("preparing");
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
    setPhase("preparing");
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

  const applyResultHint = useCallback(
    (result: PdfDownloadResult) => {
      if (result.method === "share") {
        setPhase("share");
        setHint(t.downloadIosOverlayShare);
      } else if (result.method === "tab") {
        setPhase("tab");
        setHint(t.downloadIosOverlayTab);
      }
    },
    [t],
  );

  async function resolveBlob(): Promise<Blob> {
    if (waitForBlob) return waitForBlob();
    if (buildDocument) return renderPdfBlob(buildDocument());
    throw new Error("no_pdf_source");
  }

  async function handleClick() {
    if (loading || disabled) return;
    if (!waitForBlob && !buildDocument) return;

    setLoading(true);
    setHint(null);
    if (showDonationOverlay) startOverlay();

    const started = Date.now();

    try {
      if (ios) {
        // Deliver as soon as the blob is ready — waiting 10s first breaks
        // navigator.share() on iOS (user-gesture window expires).
        const blob = await resolveBlob();
        const result = await deliverPdfBlob(blob, filename);
        applyResultHint(result);

        const remaining = Math.max(0, DOWNLOAD_MIN_MS - (Date.now() - started));
        if (remaining > 0) await wait(remaining);
      } else if (waitForBlob) {
        const [blob] = await Promise.all([waitForBlob(), wait(DOWNLOAD_MIN_MS)]);
        await deliverPdfBlob(blob, filename);
      } else if (buildDocument) {
        await Promise.all([
          wait(DOWNLOAD_MIN_MS),
          downloadPdfBlob(buildDocument(), filename),
        ]);
      }
    } catch {
      setHint(t.downloadFailed);
    } finally {
      stopTicks();
      setPhase("done");
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
          phase={phase}
          ios={ios}
        />
      ) : null}
      <div className={`w-full ${className}`}>
        <button
          type="button"
          onClick={handleClick}
          disabled={loading || disabled}
          className={`inline-flex w-full items-center justify-center gap-1.5 rounded-xl px-5 py-2.5 text-xs font-bold transition ${
            loading || disabled
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