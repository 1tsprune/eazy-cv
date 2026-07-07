import type { Language } from "./types";
import { t } from "./i18n";

/** EZCV modern CV tokens (from PDFResume / component Y). */
export const EZCV_MODERN = {
  primary: "#1a1a2e",
  text: "#333333",
  muted: "#555555",
  border: "#cccccc",
  pagePad: 30,
  columnGap: 16,
  sectionGap: 10,
} as const;

/** EZCV ATS tokens (from component J). */
export const EZCV_ATS = {
  pageMargin: 36,
  sectionGap: 8,
  itemGap: 5,
  bulletIndent: 10,
} as const;

export function ezcvPeriod(
  start: string,
  end: string,
  current: boolean | undefined,
  lang: Language,
): string {
  const endLabel = end || (current ? t(lang, "present") : "");
  if (start && endLabel) return `${start} - ${endLabel}`;
  return start || endLabel || "";
}

export function ezcvBullets(lines: string[]): string[] {
  return lines.map((line) => line.trim()).filter(Boolean);
}