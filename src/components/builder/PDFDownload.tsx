"use client";

import { useCallback } from "react";
import { useResume } from "@/context/ResumeContext";
import { useTheme } from "@/context/ThemeContext";
import { buildResumePdfDocument } from "@/lib/build-resume-pdf-document";
import { getUiDict } from "@/lib/ui-i18n";
import { PdfDownloadButton } from "./PdfDownloadButton";

export function PDFDownload() {
  const { data, config } = useResume();
  const { uiLocale } = useTheme();
  const t = getUiDict(uiLocale);

  const buildDocument = useCallback(
    () => buildResumePdfDocument(data, config),
    [data, config],
  );

  const filename = `${data.personal.fullName || "cv"}-${config.exportMode}.pdf`;

  return (
    <PdfDownloadButton
      buildDocument={buildDocument}
      filename={filename}
      label={t.download}
      fullName={data.personal.fullName}
    />
  );
}

export default PDFDownload;