"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { useResume } from "@/context/ResumeContext";
import { useResumePdf } from "@/context/ResumePdfContext";
import { useTheme } from "@/context/ThemeContext";
import { getUiDict } from "@/lib/ui-i18n";
import { PdfDownloadButton } from "./PdfDownloadButton";

const PdfCanvasView = dynamic(() => import("./PdfCanvasView"), { ssr: false });

const PREVIEW_DEBOUNCE_MS = 300;

interface Props {
  showToolbar?: boolean;
}

export function ResumePdfPreview({ showToolbar = true }: Props) {
  const { data, config } = useResume();
  const { blob, loading, error } = useResumePdf();
  const { uiLocale } = useTheme();
  const t = getUiDict(uiLocale);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(360);
  const [previewBlob, setPreviewBlob] = useState<Blob | null>(null);

  const displayWidth = Math.max(0, Math.round(containerWidth) - 24);

  const base = data.personal.fullName?.trim() || "cv";
  const suffix = config.exportMode === "ats" ? "_ATS" : "_CV";
  const filename = `${base}${suffix}.pdf`;

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

  useEffect(() => {
    if (!blob) return;
    const id = window.setTimeout(
      () => setPreviewBlob(blob),
      previewBlob ? PREVIEW_DEBOUNCE_MS : 0,
    );
    return () => window.clearTimeout(id);
  }, [blob, previewBlob]);

  const showSpinner = !previewBlob && !error;

  return (
    <div className="relative w-full">
      <div className="overflow-hidden rounded-lg bg-white text-zinc-900 shadow-lg ring-1 ring-black/5">
        {showToolbar ? (
          <div className="flex items-center justify-end gap-2 border-b border-zinc-200 px-3 py-2">
            <PdfDownloadButton
              filename={filename}
              label={t.download}
              fullName={data.personal.fullName}
              className="w-auto"
              disabled={loading || !!error}
            />
          </div>
        ) : null}

        <div
          ref={containerRef}
          className="relative overflow-hidden bg-[#e8eaed] p-3"
        >
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