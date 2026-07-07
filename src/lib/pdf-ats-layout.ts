import { getPdfSheetTokens } from "./typography";
import type { Language, ResumeConfig } from "./types";
import { t } from "./i18n";

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
      paddingTop: 38,
      paddingBottom: 38,
      paddingHorizontal: 54,
      fontFamily: tk.fontFamily,
      fontSize: tk.sm,
      lineHeight: 1.45,
      color: "#111111",
    },
    name: {
      fontSize: tk.lg,
      fontFamily: tk.headingFamily,
      marginBottom: 3,
      letterSpacing: -0.2,
    },
    headline: {
      fontSize: tk.md,
      fontFamily: tk.bodyFamily,
      color: "#3d3d3d",
      marginBottom: 7,
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