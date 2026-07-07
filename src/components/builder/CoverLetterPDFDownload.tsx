"use client";

import { useDeferredValue, useMemo } from "react";
import { useResume } from "@/context/ResumeContext";
import { useTheme } from "@/context/ThemeContext";
import { getUiDict } from "@/lib/ui-i18n";
import CoverLetterDocument from "@/components/pdf/CoverLetterDocument";
import { PdfDownloadButton } from "./PdfDownloadButton";

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
    <PdfDownloadButton
      document={pdfDocument}
      filename={filename}
      label={t.downloadCoverLetter}
    />
  );
}

export default CoverLetterPDFDownload;