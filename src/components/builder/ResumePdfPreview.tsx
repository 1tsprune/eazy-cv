"use client";

import dynamic from "next/dynamic";
import { useDeferredValue, useMemo } from "react";
import { Loader2 } from "lucide-react";
import { buildResumePdfDocument } from "@/lib/build-resume-pdf-document";
import { useTheme } from "@/context/ThemeContext";
import { getUiDict } from "@/lib/ui-i18n";
import type { ResumeConfig, ResumeData } from "@/lib/types";
import { PreviewPaper } from "./PreviewPaper";

const PDFViewer = dynamic(
  () => import("@react-pdf/renderer").then((m) => m.PDFViewer),
  {
    ssr: false,
    loading: () => <PreviewPdfSkeleton />,
  },
);

function PreviewPdfSkeleton() {
  return (
    <div className="flex min-h-[420px] items-center justify-center bg-white text-zinc-400">
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>
  );
}

interface Props {
  data: ResumeData;
  config: ResumeConfig;
  wysiwygHint?: string;
}

export function ResumePdfPreview({ data, config, wysiwygHint }: Props) {
  const { uiLocale } = useTheme();
  const t = getUiDict(uiLocale);
  const deferredData = useDeferredValue(data);
  const deferredConfig = useDeferredValue(config);
  const isStale =
    deferredData !== data ||
    deferredConfig !== config;

  const document = useMemo(
    () => buildResumePdfDocument(deferredData, deferredConfig),
    [deferredData, deferredConfig],
  );

  const hint = wysiwygHint ?? t.previewWysiwyg;

  return (
    <PreviewPaper showBadge wysiwygHint={hint}>
      <div className="relative w-full overflow-hidden bg-white">
        {isStale && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/80">
            <Loader2 className="h-7 w-7 animate-spin text-slate-600" />
          </div>
        )}
        <PDFViewer
          width="100%"
          height={720}
          showToolbar={false}
          className="min-h-[320px] w-full border-0"
        >
          {document}
        </PDFViewer>
      </div>
    </PreviewPaper>
  );
}