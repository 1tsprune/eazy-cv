"use client";

import { useCallback } from "react";
import { useResume } from "@/context/ResumeContext";
import { useTheme } from "@/context/ThemeContext";
import { getUiDict } from "@/lib/ui-i18n";
import { resolveCoverLetterBody } from "@/lib/cover-letter";
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
        coverLetter={{
          ...coverLetter,
          body: resolveCoverLetterBody(
            data,
            coverLetter,
            config.language,
            config.cvProfile,
          ),
        }}
        language={config.language}
        config={config}
      />
    ),
    [data, coverLetter, config],
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