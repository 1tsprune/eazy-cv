"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { Loader2, Minus, Plus } from "lucide-react";
import { useResume } from "@/context/ResumeContext";
import { useResumePdf } from "@/context/ResumePdfContext";
import { useTheme } from "@/context/ThemeContext";
import { getUiDict } from "@/lib/ui-i18n";
import { ensurePdfJsWorker } from "@/lib/pdfjs-setup";
import { PreviewPaper } from "./PreviewPaper";
import { PdfDownloadOverlay } from "./PdfDownloadOverlay";
import { deliverPdfBlob } from "@/lib/pdf-download";

const PdfDocument = dynamic(
  () => import("react-pdf").then((m) => m.Document),
  { ssr: false },
);

const PdfPage = dynamic(
  () => import("react-pdf").then((m) => m.Page),
  { ssr: false },
);

const ZOOM_MIN = 0.5;
const ZOOM_MAX = 2.5;
const ZOOM_STEP = 0.25;
const DOWNLOAD_SECONDS = 10;

interface Props {
  wysiwygHint?: string;
  /** Show download + zoom toolbar (EZCV-style panel). */
  showToolbar?: boolean;
}

export function ResumePdfPreview({
  wysiwygHint,
  showToolbar = true,
}: Props) {
  const { data, config } = useResume();
  const { url, blob, loading, error, isStale, waitForBlob } = useResumePdf();
  const { uiLocale } = useTheme();
  const t = getUiDict(uiLocale);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(360);
  const [zoom, setZoom] = useState(1);
  const [numPages, setNumPages] = useState(0);
  const [downloading, setDownloading] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(DOWNLOAD_SECONDS);
  const [progress, setProgress] = useState(0);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const hint = wysiwygHint ?? t.previewWysiwyg;
  const file = blob ?? url ?? null;
  const pageWidth = Math.round(containerWidth * zoom);

  useEffect(() => {
    ensurePdfJsWorker();
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setContainerWidth(el.clientWidth || 360));
    ro.observe(el);
    setContainerWidth(el.clientWidth || 360);
    return () => ro.disconnect();
  }, []);

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
      const filename = `${base}${suffix}.pdf`;
      await deliverPdfBlob(pdfBlob, filename);
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

  return (
    <PreviewPaper showBadge wysiwygHint={hint}>
      <div className="overflow-hidden rounded-lg bg-white text-zinc-900">
        {showToolbar ? (
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-200 px-3 py-2">
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() =>
                  setZoom((z) => Math.max(ZOOM_MIN, z - ZOOM_STEP))
                }
                className="flex h-8 w-8 items-center justify-center rounded-md border border-zinc-200 text-sm font-bold hover:bg-zinc-50"
                aria-label="Zoom out"
              >
                <Minus className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setZoom(1)}
                className="min-w-[3rem] rounded-md border border-zinc-200 px-2 py-1 text-[11px] font-semibold hover:bg-zinc-50"
              >
                {Math.round(zoom * 100)}%
              </button>
              <button
                type="button"
                onClick={() =>
                  setZoom((z) => Math.min(ZOOM_MAX, z + ZOOM_STEP))
                }
                className="flex h-8 w-8 items-center justify-center rounded-md border border-zinc-200 text-sm font-bold hover:bg-zinc-50"
                aria-label="Zoom in"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
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
          className="relative min-h-[420px] overflow-auto bg-[#e8eaed]"
        >
          {downloading ? (
            <PdfDownloadOverlay
              fullName={data.personal.fullName}
              secondsLeft={secondsLeft}
              progress={progress}
              placement="absolute"
            />
          ) : null}

          {(isStale || loading) && !error ? (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-white/85">
              <Loader2 className="h-7 w-7 animate-spin text-slate-600" />
              <span className="text-xs text-zinc-500">{t.previewPdfLoading}</span>
            </div>
          ) : null}

          {error ? (
            <div className="flex min-h-[320px] flex-col items-center justify-center gap-2 p-6 text-center text-sm text-red-600">
              <p>{t.previewPdfError}</p>
              <p className="text-xs text-zinc-500">{error}</p>
            </div>
          ) : null}

          {file && !error ? (
            <div className="flex justify-center p-3">
              <PdfDocument
                file={file}
                onLoadSuccess={({ numPages: n }) => setNumPages(n)}
                loading={
                  <div className="flex items-center gap-2 py-12 text-xs text-zinc-500">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {t.previewPdfPagesLoading}
                  </div>
                }
                error={
                  <p className="py-12 text-center text-sm text-red-600">
                    {t.previewPdfPagesError}
                  </p>
                }
              >
                {Array.from({ length: numPages }, (_, i) => (
                  <div key={i} className="mb-3 shadow-md">
                    <PdfPage
                      pageNumber={i + 1}
                      width={pageWidth}
                      renderTextLayer={false}
                      renderAnnotationLayer={false}
                    />
                  </div>
                ))}
              </PdfDocument>
            </div>
          ) : null}
        </div>
      </div>
    </PreviewPaper>
  );
}