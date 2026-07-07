"use client";

import { BlobProvider } from "@react-pdf/renderer";
import { Download, Loader2 } from "lucide-react";
import { useDeferredValue, useMemo } from "react";
import { useResume } from "@/context/ResumeContext";
import { useTheme } from "@/context/ThemeContext";
import { getUiDict } from "@/lib/ui-i18n";
import { sanitizeResumeData } from "@/lib/sanitize";
import ATSResumeDocument from "@/components/pdf/ATSResumeDocument";
import ModernResumeDocument from "@/components/pdf/ModernResumeDocument";

export function PDFDownload() {
  const { data, config } = useResume();
  const { uiLocale } = useTheme();
  const t = getUiDict(uiLocale);
  const deferredData = useDeferredValue(data);
  const deferredConfig = useDeferredValue(config);

  const pdfDocument = useMemo(() => {
    if (deferredConfig.exportMode === "ats") {
      const clean = sanitizeResumeData(deferredData);
      return (
        <ATSResumeDocument data={clean} language={deferredConfig.language} />
      );
    }
    return (
      <ModernResumeDocument data={deferredData} config={deferredConfig} />
    );
  }, [deferredData, deferredConfig]);

  const filename = `${deferredData.personal.fullName || "cv"}-${deferredConfig.exportMode}.pdf`;

  return (
    <BlobProvider document={pdfDocument}>
      {({ url, loading }) => (
        <a
          href={url ?? "#"}
          download={filename}
          className={`inline-flex w-full items-center justify-center gap-1.5 rounded-xl px-5 py-2.5 text-xs font-bold transition ${
            loading || !url
              ? "pointer-events-none bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500"
              : "bg-indigo-600 text-white hover:bg-indigo-700"
          }`}
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Download className="h-4 w-4" />
          )}
          {t.download}
        </a>
      )}
    </BlobProvider>
  );
}

export default PDFDownload;