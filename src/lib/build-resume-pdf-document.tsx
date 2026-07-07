import type { ReactElement } from "react";
import type { DocumentProps } from "@react-pdf/renderer";
import ATSResumeDocument from "@/components/pdf/ATSResumeDocument";
import PDFResumeDocument from "@/components/pdf/PDFResumeDocument";
import { prepareModernPdfData } from "@/lib/pdf-modern-data";
import { sanitizeResumeData } from "@/lib/sanitize";
import type { ResumeConfig, ResumeData } from "@/lib/types";

/** Single source of truth — preview & download use the same React-PDF tree. */
export function buildResumePdfDocument(
  data: ResumeData,
  config: ResumeConfig,
): ReactElement<DocumentProps> {
  const clean = sanitizeResumeData(data);

  if (config.exportMode === "ats") {
    return <ATSResumeDocument data={clean} config={config} />;
  }

  return (
    <PDFResumeDocument
      data={prepareModernPdfData(clean)}
      config={config}
    />
  );
}