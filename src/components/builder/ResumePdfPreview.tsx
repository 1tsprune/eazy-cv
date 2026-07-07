"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { useResume } from "@/context/ResumeContext";
import { useResumePdf } from "@/context/ResumePdfContext";
import { useTheme } from "@/context/ThemeContext";
import { getUiDict } from "@/lib/ui-i18n";
import { PdfDownloadOverlay } from "./PdfDownloadOverlay";
import { deliverPdfBlob } from "@/lib/pdf-download";

const PdfCanvasView = dynamic(() => import("./PdfCanvasView"), { ssr: false });

const DOWNLOAD_SECONDS = 10;
const PREVIEW_DEBOUNCE_MS = 300;

interface Props {
  wysiwygHint?: string;
  showToolbar?: boolean;
}

export function ResumePdfPreview({
  wysiwygHint,
  showToolbar = true,
}: Props) {
  const { data, config } = useResume();
  const { blob, loading, error, waitForBlob } = useResumePdf();
  const { uiLocale } = useTheme();
  const t = getUiDict(uiLocale);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(360);
  const [previewBlob, setPreviewBlob] = useState<Blob | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(DOWNLOAD_SECONDS);
  const [progress, setProgress] = useState(0);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const hint = wysiwygHint ?? t.previewWysiwyg;
  // display width = container minus the p-3 padding (12px each side)
  const displayWidth = Math.max(0, Math.round(containerWidth) - 24);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() =>
      setContainerWidth(el.clientWidth || 360),
    );
    ro.observe(el);
    setContainerWidth(el.clientWidth || 360);
    return () => ro.disconnect();
  }, []);

  // Debounce the blob feeding the preview so rapid edits don't thrash pdf.js.
  useEffect(() => {
    if (!blob) return;
    const id = window.setTimeout(
      () => setPreviewBlob(blob),
      previewBlob ? PREVIEW_DEBOUNCE_MS : 0,
    );
    return () => window.clearTimeout(id);
  }, [blob, previewBlob]);

  const stopTicks = useCallback(() => {
    if (tickRef.current) {
      clearInterval(tickRef.current);
      tickRef.current = null;
    }
  }, []);

  const startDownloadOverlay = useCallback(() => {
    const started = Date.now();
    const totalMs = DOWNLOAD_SECONDS * 1000;
    setDownloading(true);
    setSecondsLeft(DOWNLOAD_SECONDS);
    setProgress(0);
    stopTicks();
    tickRef.current = setInterval(() => {
      const elapsed = Date.now() - started;
      const ratio = Math.min(1, elapsed / totalMs);
      setProgress(ratio * 100);
      setSecondsLeft(Math.max(0, Math.ceil((totalMs - elapsed) / 1000)));
    }, 50);
  }, [stopTicks]);

  const handleDownload = useCallback(async () => {
    if (downloading || loading) return;
    startDownloadOverlay();
    try {
      const [pdfBlob] = await Promise.all([
        waitForBlob(),
        new Promise<void>((resolve) =>
          window.setTimeout(resolve, DOWNLOAD_SECONDS * 1000),
        ),
      ]);
      const base = data.personal.fullName?.trim() || "cv";
      const suffix = config.exportMode === "ats" ? "_ATS" : "_CV";
      await deliverPdfBlob(pdfBlob, `${base}${suffix}.pdf`);
    } finally {
      stopTicks();
      setProgress(100);
      setSecondsLeft(0);
      window.setTimeout(() => setDownloading(false), 280);
    }
  }, [
    config.exportMode,
    data.personal.fullName,
    downloading,
    loading,
    startDownloadOverlay,
    stopTicks,
    waitForBlob,
  ]);

  const showSpinner = !previewBlob && !error;

  return (
    <div className="relative w-full">
      <div className="mb-1 flex items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-md bg-white/90 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-500 shadow-sm ring-1 ring-zinc-200/60 dark:bg-zinc-800/90 dark:text-zinc-400 dark:ring-zinc-700">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden />
          A4
        </span>
        {hint ? (
          <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 ring-1 ring-emerald-200/80 dark:bg-emerald-950/40 dark:text-emerald-400 dark:ring-emerald-900/60">
            {hint}
          </span>
        ) : null}
      </div>

      <div className="overflow-hidden rounded-lg bg-white text-zinc-900 shadow-lg ring-1 ring-black/5">
        {showToolbar ? (
          <div className="flex items-center justify-end gap-2 border-b border-zinc-200 px-3 py-2">
            <button
              type="button"
              onClick={handleDownload}
              disabled={downloading || loading || !!error}
              className="rounded-lg bg-zinc-800 px-4 py-2 text-xs font-bold text-white transition hover:bg-zinc-900 disabled:cursor-wait disabled:opacity-50"
            >
              {downloading
                ? t.downloadProcessing(secondsLeft)
                : loading
                  ? t.downloadGenerating
                  : t.download}
            </button>
          </div>
        ) : null}

        <div
          ref={containerRef}
          className="relative overflow-hidden bg-[#e8eaed] p-3"
        >
          {downloading ? (
            <PdfDownloadOverlay
              fullName={data.personal.fullName}
              secondsLeft={secondsLeft}
              progress={progress}
              placement="absolute"
            />
          ) : null}

          {showSpinner ? (
            <div className="flex min-h-[420px] flex-col items-center justify-center gap-2">
              <Loader2 className="h-7 w-7 animate-spin text-slate-600" />
              <span className="text-xs text-zinc-500">
                {t.previewPdfLoading}
              </span>
            </div>
          ) : null}

          {error ? (
            <div className="flex min-h-[320px] flex-col items-center justify-center gap-2 p-6 text-center text-sm text-red-600">
              <p>{t.previewPdfError}</p>
              <p className="text-xs text-zinc-500">{error}</p>
            </div>
          ) : null}

          {previewBlob && !error ? (
            <PdfCanvasView blob={previewBlob} width={displayWidth} />
          ) : null}
        </div>
      </div>
    </div>
  );
}
