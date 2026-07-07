"use client";

import { useDeferredValue, useMemo } from "react";
import { useResume } from "@/context/ResumeContext";
import { useTheme } from "@/context/ThemeContext";
import { getUiDict } from "@/lib/ui-i18n";
import { prepareModernPdfData } from "@/lib/pdf-modern-data";
import { sanitizeResumeData } from "@/lib/sanitize";
import ATSResumeDocument from "@/components/pdf/ATSResumeDocument";
import ModernResumeDocument from "@/components/pdf/ModernResumeDocument";
import { PdfDownloadButton } from "./PdfDownloadButton";

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
        <ATSResumeDocument data={clean} config={deferredConfig} />
      );
    }
    return (
      <ModernResumeDocument
        data={prepareModernPdfData(deferredData)}
        config={deferredConfig}
      />
    );
  }, [deferredData, deferredConfig]);

  const filename = `${deferredData.personal.fullName || "cv"}-${deferredConfig.exportMode}.pdf`;

  return (
    <PdfDownloadButton
      document={pdfDocument}
      filename={filename}
      label={t.download}
    />
  );
}

export default PDFDownload;