"use client";

import { useCallback } from "react";
import { useResume } from "@/context/ResumeContext";
import { useTheme } from "@/context/ThemeContext";
import { getUiDict } from "@/lib/ui-i18n";
import CoverLetterDocument from "@/components/pdf/CoverLetterDocument";
import { PdfDownloadButton } from "./PdfDownloadButton";

export function CoverLetterPDFDownload() {
  const { data, coverLetter, config } = useResume();
  const { uiLocale } = useTheme();
  const t = getUiDict(uiLocale);

  const buildDocument = useCallback(
    () => (
      <CoverLetterDocument
        personal={data.personal}
        coverLetter={coverLetter}
        language={config.language}
        config={config}
      />
    ),
    [data.personal, coverLetter, config],
  );

  const filename = `${data.personal.fullName || "cover-letter"}-surat-lamaran.pdf`;

  return (
    <PdfDownloadButton
      buildDocument={buildDocument}
      filename={filename}
      label={t.downloadCoverLetter}
      fullName={data.personal.fullName}
    />
  );
}

export default CoverLetterPDFDownload;