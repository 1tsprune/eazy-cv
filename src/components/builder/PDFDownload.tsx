"use client";

import { useResume } from "@/context/ResumeContext";
import { useResumePdfOptional } from "@/context/ResumePdfContext";
import { useTheme } from "@/context/ThemeContext";
import { getUiDict } from "@/lib/ui-i18n";
import { PdfDownloadButton } from "./PdfDownloadButton";

export function PDFDownload() {
  const { data, config } = useResume();
  const resumePdf = useResumePdfOptional();
  const { uiLocale } = useTheme();
  const t = getUiDict(uiLocale);

  const base = data.personal.fullName?.trim() || "cv";
  const suffix = config.exportMode === "ats" ? "_ATS" : "_CV";
  const filename = `${base}${suffix}.pdf`;

  return (
    <PdfDownloadButton
      waitForBlob={resumePdf?.waitForBlob}
      filename={filename}
      label={t.download}
      fullName={data.personal.fullName}
    />
  );
}

export default PDFDownload;