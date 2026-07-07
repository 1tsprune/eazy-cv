"use client";

import { BlobProvider } from "@react-pdf/renderer";
import { Download, Loader2 } from "lucide-react";
import { useDeferredValue, useMemo } from "react";
import { useResume } from "@/context/ResumeContext";
import { useTheme } from "@/context/ThemeContext";
import { getUiDict } from "@/lib/ui-i18n";
import CoverLetterDocument from "@/components/pdf/CoverLetterDocument";

export function CoverLetterPDFDownload() {
  const { data, coverLetter, config } = useResume();
  const { uiLocale } = useTheme();
  const t = getUiDict(uiLocale);
  const deferredPersonal = useDeferredValue(data.personal);
  const deferredCover = useDeferredValue(coverLetter);
  const deferredConfig = useDeferredValue(config);

  const pdfDocument = useMemo(
    () => (
      <CoverLetterDocument
        personal={deferredPersonal}
        coverLetter={deferredCover}
        language={deferredConfig.language}
        config={deferredConfig}
      />
    ),
    [deferredPersonal, deferredCover, deferredConfig],
  );

  const filename = `${deferredPersonal.fullName || "cover-letter"}-surat-lamaran.pdf`;

  return (
    <BlobProvider document={pdfDocument}>
      {({ url, loading }) => (
        <a
          href={url ?? "#"}
          download={filename}
          className={`inline-flex w-full items-center justify-center gap-1.5 rounded-xl px-5 py-2.5 text-xs font-bold transition ${
            loading || !url
              ? "pointer-events-none bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500"
              : "bg-slate-700 text-white hover:bg-slate-800"
          }`}
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Download className="h-4 w-4" />
          )}
          {t.downloadCoverLetter}
        </a>
      )}
    </BlobProvider>
  );
}

export default CoverLetterPDFDownload;