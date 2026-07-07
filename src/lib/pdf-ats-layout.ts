import { getPreviewTypography, getPdfSheetTokens } from "./typography";
import type { Language, ResumeConfig } from "./types";
import { t } from "./i18n";

/** PDF points → CSS px at 210mm A4 width (96dpi) */
const PT_TO_PX = 96 / 72;

function ptPx(value: number): number {
  return Math.round(value * PT_TO_PX * 10) / 10;
}

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
  name: { fontSize: number; marginBottom: number; color: string };
  headline: { fontSize: number; color: string; marginBottom: number };
  contact: { fontSize: number; color: string; lineHeight: number };
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
  };
  itemTitle: {
    fontSize: number;
    marginBottom: number;
    lineHeight: number;
    color: string;
  };
  itemMeta: {
    fontSize: number;
    color: string;
    marginBottom: number;
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
  bullet: {
    fontSize: number;
    marginLeft: number;
    marginBottom: number;
    lineHeight: number;
    color: string;
  };
  certCol: { width: string };
  certRow: { display: string; justifyContent: string };
  certItem: { marginBottom: number };
  entry: { marginBottom: number };
};

/** Pixel metrics aligned with @react-pdf ATS output (WYSIWYG preview) */
export function getAtsPreviewMetrics(config: ResumeConfig): AtsPreviewMetrics {
  const { tk, sheet } = getAtsPdfLayout(config);
  const previewFont = getPreviewTypography(config);

  return {
    fontFamily: previewFont.fontFamily,
    headingWeight: previewFont.headingWeight,
    page: {
      paddingTop: ptPx(sheet.page.paddingTop as number),
      paddingBottom: ptPx(sheet.page.paddingBottom as number),
      paddingHorizontal: ptPx(sheet.page.paddingHorizontal as number),
      fontSize: ptPx(tk.sm),
      lineHeight: sheet.page.lineHeight as number,
      color: sheet.page.color as string,
    },
    name: {
      fontSize: ptPx(tk.xl),
      marginBottom: ptPx(2),
      color: "#111111",
    },
    headline: {
      fontSize: ptPx(tk.sm),
      color: "#333333",
      marginBottom: ptPx(6),
    },
    contact: {
      fontSize: ptPx(tk.xs),
      color: "#555555",
      lineHeight: 1.5,
    },
    summary: {
      fontSize: ptPx(tk.sm),
      lineHeight: 1.48,
      color: "#222222",
      marginBottom: ptPx(10),
    },
    sectionTitle: {
      fontSize: ptPx(tk.sm),
      letterSpacing: ptPx(1.4),
      marginTop: ptPx(11),
      marginBottom: ptPx(5),
      paddingBottom: ptPx(2),
      color: "#111111",
    },
    itemTitle: {
      fontSize: ptPx(tk.md),
      marginBottom: ptPx(1),
      lineHeight: 1.35,
      color: "#111111",
    },
    itemMeta: {
      fontSize: ptPx(tk.xs),
      color: "#555555",
      marginBottom: ptPx(3),
      lineHeight: 1.4,
    },
    paragraph: {
      fontSize: ptPx(tk.sm),
      lineHeight: 1.45,
      color: "#222222",
      marginBottom: ptPx(2),
    },
    skillsLine: {
      fontSize: ptPx(tk.sm),
      lineHeight: 1.45,
      marginBottom: ptPx(3),
    },
    skillGroup: {
      fontSize: ptPx(tk.sm),
      marginTop: ptPx(3),
      marginBottom: ptPx(2),
    },
    bullet: {
      fontSize: ptPx(tk.sm),
      marginLeft: ptPx(11),
      marginBottom: ptPx(2),
      lineHeight: 1.42,
      color: "#222222",
    },
    certCol: { width: "47%" },
    certRow: { display: "flex", justifyContent: "space-between" },
    certItem: { marginBottom: ptPx(4) },
    entry: { marginBottom: ptPx(7) },
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

export function getAtsPdfLayout(config: ResumeConfig) {
  const tk = getPdfSheetTokens(config);

  const sheet = {
    page: {
      paddingTop: 40,
      paddingBottom: 40,
      paddingHorizontal: 52,
      fontFamily: tk.fontFamily,
      fontSize: tk.sm,
      lineHeight: 1.42,
      color: "#111111",
    },
    name: {
      fontSize: tk.xl,
      fontFamily: tk.headingFamily,
      marginBottom: 2,
    },
    headline: {
      fontSize: tk.sm,
      fontFamily: tk.bodyFamily,
      color: "#333333",
      marginBottom: 6,
    },
    contact: {
      fontSize: tk.xs,
      fontFamily: tk.bodyFamily,
      color: "#555555",
      lineHeight: 1.5,
    },
    summary: {
      fontFamily: tk.bodyFamily,
      fontSize: tk.sm,
      lineHeight: 1.48,
      color: "#222222",
      textAlign: "justify" as const,
      marginBottom: 10,
    },
    sectionTitle: {
      fontSize: tk.sm,
      fontFamily: tk.headingFamily,
      textTransform: "uppercase" as const,
      letterSpacing: 1.4,
      borderBottomWidth: 1,
      borderBottomColor: "#cccccc",
      paddingBottom: 2,
      marginTop: 11,
      marginBottom: 5,
      color: "#111111",
    },
    itemTitle: {
      fontFamily: tk.headingFamily,
      fontSize: tk.md,
      marginBottom: 1,
      lineHeight: 1.35,
    },
    itemMeta: {
      fontFamily: tk.bodyFamily,
      fontSize: tk.xs,
      color: "#555555",
      marginBottom: 3,
      lineHeight: 1.4,
    },
    paragraph: {
      fontFamily: tk.bodyFamily,
      fontSize: tk.sm,
      lineHeight: 1.45,
      color: "#222222",
      marginBottom: 2,
    },
    bullet: {
      fontFamily: tk.bodyFamily,
      fontSize: tk.sm,
      marginLeft: 11,
      marginBottom: 2,
      lineHeight: 1.42,
      color: "#222222",
    },
    skillsLine: {
      fontFamily: tk.bodyFamily,
      fontSize: tk.sm,
      lineHeight: 1.45,
      color: "#222222",
      marginBottom: 3,
    },
    skillGroup: {
      fontFamily: tk.headingFamily,
      fontSize: tk.sm,
      marginTop: 3,
      marginBottom: 2,
      color: "#222222",
    },
    entry: {
      marginBottom: 7,
    },
    certCol: {
      width: "47%",
    },
    certRow: {
      flexDirection: "row" as const,
      justifyContent: "space-between" as const,
    },
  };

  return { tk, sheet };
}