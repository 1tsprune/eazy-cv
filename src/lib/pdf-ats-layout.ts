import { getPreviewTypography, getPdfSheetTokens } from "./typography";
import type { Language, ResumeConfig } from "./types";
import { t } from "./i18n";

/** PDF points → CSS px at 210mm A4 width (96dpi) */
const PT_TO_PX = 96 / 72;

function ptPx(value: number): number {
  return Math.round(value * PT_TO_PX * 10) / 10;
}

/** EZCV ATS pageMargin = 36pt */
export const ATS_PAGE_MARGIN_PT = 36;

export const ATS_BULLET_MARK = "▸";

export type AtsPreviewMetrics = {
  fontFamily: string;
  headingWeight: number;
  page: {
    paddingTop: number;
    paddingBottom: number;
    paddingHorizontal: number;
    fontSize: number;
    lineHeight: number;
    color: string;
  };
  header: {
    marginBottom: number;
    paddingBottom: number;
    borderBottomWidth: number;
    borderBottomColor: string;
  };
  name: { fontSize: number; marginBottom: number; color: string };
  headline: { fontSize: number; color: string; marginBottom: number };
  contact: {
    fontSize: number;
    color: string;
    lineHeight: number;
    linkColor: string;
  };
  summary: {
    fontSize: number;
    lineHeight: number;
    color: string;
    marginBottom: number;
  };
  sectionTitle: {
    fontSize: number;
    letterSpacing: number;
    marginTop: number;
    marginBottom: number;
    paddingBottom: number;
    color: string;
    borderBottomColor: string;
  };
  expHeader: { marginBottom: number };
  itemTitle: {
    fontSize: number;
    marginBottom: number;
    lineHeight: number;
    color: string;
  };
  itemTitleSub: { fontSize: number; color: string };
  itemMetaRight: {
    fontSize: number;
    color: string;
    lineHeight: number;
  };
  paragraph: {
    fontSize: number;
    lineHeight: number;
    color: string;
    marginBottom: number;
  };
  skillsLine: { fontSize: number; lineHeight: number; marginBottom: number };
  skillGroup: { fontSize: number; marginTop: number; marginBottom: number };
  skillsGrid: { gap: number };
  bullet: {
    fontSize: number;
    paddingLeft: number;
    marginBottom: number;
    lineHeight: number;
    color: string;
    markColor: string;
  };
  certItem: { marginBottom: number };
  certDate: { fontSize: number; color: string };
  entry: { marginBottom: number };
};

/** Pixel metrics aligned with @react-pdf ATS output (WYSIWYG preview) */
export function getAtsPreviewMetrics(config: ResumeConfig): AtsPreviewMetrics {
  const { sheet } = getAtsPdfLayout(config);
  const previewFont = getPreviewTypography(config);
  const m = ATS_PAGE_MARGIN_PT;

  return {
    fontFamily: previewFont.fontFamily,
    headingWeight: previewFont.headingWeight,
    page: {
      paddingTop: ptPx(m),
      paddingBottom: ptPx(m),
      paddingHorizontal: ptPx(m),
      fontSize: ptPx(sheet.page.fontSize as number),
      lineHeight: sheet.page.lineHeight as number,
      color: sheet.page.color as string,
    },
    header: {
      marginBottom: ptPx(sheet.header.marginBottom as number),
      paddingBottom: ptPx(sheet.header.paddingBottom as number),
      borderBottomWidth: ptPx(sheet.header.borderBottomWidth as number),
      borderBottomColor: sheet.header.borderBottomColor as string,
    },
    name: {
      fontSize: ptPx(sheet.name.fontSize as number),
      marginBottom: ptPx(sheet.name.marginBottom as number),
      color: "#1a1a1a",
    },
    headline: {
      fontSize: ptPx(sheet.headline.fontSize as number),
      color: sheet.headline.color as string,
      marginBottom: ptPx(sheet.headline.marginBottom as number),
    },
    contact: {
      fontSize: ptPx(sheet.contact.fontSize as number),
      color: sheet.contact.color as string,
      lineHeight: sheet.contact.lineHeight as number,
      linkColor: sheet.contact.linkColor as string,
    },
    summary: {
      fontSize: ptPx(sheet.summary.fontSize as number),
      lineHeight: sheet.summary.lineHeight as number,
      color: sheet.summary.color as string,
      marginBottom: ptPx(sheet.summary.marginBottom as number),
    },
    sectionTitle: {
      fontSize: ptPx(sheet.sectionTitle.fontSize as number),
      letterSpacing: ptPx(sheet.sectionTitle.letterSpacing as number),
      marginTop: ptPx(sheet.sectionTitle.marginTop as number),
      marginBottom: ptPx(sheet.sectionTitle.marginBottom as number),
      paddingBottom: ptPx(sheet.sectionTitle.paddingBottom as number),
      color: sheet.sectionTitle.color as string,
      borderBottomColor: sheet.sectionTitle.borderBottomColor as string,
    },
    expHeader: {
      marginBottom: ptPx(sheet.expHeader.marginBottom as number),
    },
    itemTitle: {
      fontSize: ptPx(sheet.itemTitle.fontSize as number),
      marginBottom: 0,
      lineHeight: sheet.itemTitle.lineHeight as number,
      color: sheet.itemTitle.color as string,
    },
    itemTitleSub: {
      fontSize: ptPx(sheet.itemTitleSub.fontSize as number),
      color: sheet.itemTitleSub.color as string,
    },
    itemMetaRight: {
      fontSize: ptPx(sheet.itemMetaRight.fontSize as number),
      color: sheet.itemMetaRight.color as string,
      lineHeight: sheet.itemMetaRight.lineHeight as number,
    },
    paragraph: {
      fontSize: ptPx(sheet.paragraph.fontSize as number),
      lineHeight: sheet.paragraph.lineHeight as number,
      color: sheet.paragraph.color as string,
      marginBottom: ptPx(sheet.paragraph.marginBottom as number),
    },
    skillsLine: {
      fontSize: ptPx(sheet.skillsLine.fontSize as number),
      lineHeight: sheet.skillsLine.lineHeight as number,
      marginBottom: ptPx(sheet.skillsLine.marginBottom as number),
    },
    skillGroup: {
      fontSize: ptPx(sheet.skillGroup.fontSize as number),
      marginTop: ptPx(sheet.skillGroup.marginTop as number),
      marginBottom: ptPx(sheet.skillGroup.marginBottom as number),
    },
    skillsGrid: {
      gap: ptPx(sheet.skillsGrid.gap as number),
    },
    bullet: {
      fontSize: ptPx(sheet.bullet.fontSize as number),
      paddingLeft: ptPx(sheet.bullet.paddingLeft as number),
      marginBottom: ptPx(sheet.bullet.marginBottom as number),
      lineHeight: sheet.bullet.lineHeight as number,
      color: sheet.bullet.color as string,
      markColor: sheet.bullet.markColor as string,
    },
    certItem: { marginBottom: ptPx(sheet.certRow.marginBottom as number) },
    certDate: {
      fontSize: ptPx(sheet.certDate.fontSize as number),
      color: sheet.certDate.color as string,
    },
    entry: { marginBottom: ptPx(sheet.entry.marginBottom as number) },
  };
}

/** Split multiline prose into trimmed non-empty lines (matches PDF ATS) */
export function splitAtsProseLines(text: string): string[] {
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

/** Format `Jan 2020 — Aug 2025 · Location` */
export function formatAtsPeriodLine(
  start: string,
  end: string,
  current: boolean | undefined,
  location: string,
  lang: Language,
): string {
  const endLabel = end || (current ? t(lang, "present") : "");
  const period =
    start && endLabel
      ? `${start} — ${endLabel}`
      : start || endLabel || "";
  return [period, location].filter(Boolean).join(" · ");
}

/** Education / org meta on the right column */
export function formatAtsEducationMeta(
  start: string,
  end: string,
  gpa: string,
  lang: Language,
): string {
  const period =
    start && end ? `${start} — ${end}` : start || end || "";
  const gpaLabel = gpa ? `${t(lang, "gpa")}: ${gpa}` : "";
  return [period, gpaLabel].filter(Boolean).join(" · ");
}

/**
 * Layout tuned to 1tsprune cv.html — 12mm margins, exp header row,
 * ▸ bullets, 2-col skills, cert date right.
 */
export function getAtsPdfLayout(config: ResumeConfig) {
  const tk = getPdfSheetTokens(config);
  const margin = ATS_PAGE_MARGIN_PT;

  const sheet = {
    page: {
      paddingTop: margin,
      paddingBottom: margin,
      paddingHorizontal: margin,
      fontFamily: tk.fontFamily,
      fontSize: 10,
      lineHeight: 1.5,
      color: "#1a1a1a",
    },
    header: {
      alignItems: "center" as const,
      marginBottom: 18,
      paddingBottom: 12,
      borderBottomWidth: 2,
      borderBottomColor: "#1a1a1a",
    },
    name: {
      fontSize: 22,
      fontFamily: tk.headingFamily,
      marginBottom: 2,
      color: "#1a1a1a",
      textTransform: "uppercase" as const,
      textAlign: "center" as const,
    },
    headline: {
      fontSize: 11,
      fontFamily: tk.bodyFamily,
      color: "#555555",
      marginBottom: 8,
      textAlign: "center" as const,
    },
    contact: {
      fontSize: 10,
      fontFamily: tk.bodyFamily,
      color: "#666666",
      linkColor: "#1a1a1a",
      lineHeight: 1.5,
      textAlign: "center" as const,
    },
    summary: {
      fontFamily: tk.bodyFamily,
      fontSize: 10.5,
      lineHeight: 1.55,
      color: "#444444",
      textAlign: "justify" as const,
      marginBottom: 21,
    },
    sectionTitle: {
      fontSize: 10,
      fontFamily: tk.headingFamily,
      textTransform: "uppercase" as const,
      letterSpacing: 1.5,
      borderBottomWidth: 1,
      borderBottomColor: "#e0e0e0",
      paddingBottom: 4,
      marginTop: 0,
      marginBottom: 9,
      color: "#555555",
    },
    expHeader: {
      flexDirection: "row" as const,
      justifyContent: "space-between" as const,
      alignItems: "flex-start" as const,
      marginBottom: 3,
    },
    expHeaderLeft: {
      flex: 1,
      paddingRight: 10,
    },
    itemTitle: {
      fontFamily: tk.headingFamily,
      fontSize: 10,
      lineHeight: 1.4,
      color: "#1a1a1a",
    },
    itemTitleSub: {
      fontFamily: tk.bodyFamily,
      fontSize: 10,
      color: "#555555",
    },
    itemMetaRight: {
      fontFamily: tk.bodyFamily,
      fontSize: 9,
      color: "#888888",
      lineHeight: 1.4,
      flexShrink: 0,
      textAlign: "right" as const,
      maxWidth: "42%",
    },
    paragraph: {
      fontFamily: tk.bodyFamily,
      fontSize: 10,
      lineHeight: 1.4,
      color: "#444444",
      marginBottom: 1,
      textAlign: "justify" as const,
    },
    bullet: {
      fontFamily: tk.bodyFamily,
      fontSize: 10,
      paddingLeft: 11,
      marginBottom: 1,
      lineHeight: 1.4,
      color: "#444444",
      markColor: "#aaaaaa",
    },
    skillsGrid: {
      flexDirection: "row" as const,
      gap: 15,
    },
    skillsCol: {
      flex: 1,
    },
    skillsLine: {
      fontFamily: tk.bodyFamily,
      fontSize: 9.5,
      lineHeight: 1.45,
      color: "#444444",
      marginBottom: 0,
    },
    skillGroup: {
      fontFamily: tk.headingFamily,
      fontSize: 9.5,
      marginTop: 0,
      marginBottom: 2,
      color: "#1a1a1a",
    },
    entry: {
      marginBottom: 10,
    },
    certRow: {
      flexDirection: "row" as const,
      justifyContent: "space-between" as const,
      alignItems: "baseline" as const,
      marginBottom: 2,
    },
    certItem: {
      flex: 1,
      fontFamily: tk.bodyFamily,
      fontSize: 9.5,
      color: "#444444",
      paddingRight: 10,
    },
    certDate: {
      fontFamily: tk.bodyFamily,
      fontSize: 9,
      color: "#888888",
      flexShrink: 0,
    },
  };

  return { tk, sheet };
}