import type { CvFontFamily, CvFontSize, ResumeConfig } from "./types";

export const CV_FONT_FAMILIES: {
  id: CvFontFamily;
  label: string;
}[] = [
  { id: "arial", label: "Arial" },
  { id: "helvetica", label: "Helvetica" },
  { id: "times", label: "Times New Roman" },
  { id: "calibri", label: "Calibri" },
];

export const CV_FONT_SIZES: { id: CvFontSize }[] = [
  { id: "sm" },
  { id: "md" },
  { id: "lg" },
];

const LEGACY_FONT_MAP: Record<string, CvFontFamily> = {
  outfit: "arial",
  inter: "arial",
  serif: "times",
  mono: "helvetica",
  georgia: "times",
};

export function normalizeFontFamily(value?: string): CvFontFamily {
  if (
    value === "arial" ||
    value === "helvetica" ||
    value === "times" ||
    value === "calibri"
  ) {
    return value;
  }
  if (value && LEGACY_FONT_MAP[value]) return LEGACY_FONT_MAP[value];
  return "arial";
}

const PREVIEW_FONTS: Record<CvFontFamily, string> = {
  arial: "Arial, Helvetica, sans-serif",
  helvetica: "Helvetica, Arial, sans-serif",
  times: "'Times New Roman', Times, serif",
  calibri: "Calibri, 'Segoe UI', Arial, sans-serif",
};

const SIZE_SCALE = {
  sm: { base: 10, xs: 9, sm: 10, md: 11, lg: 13, xl: 16, display: 20, lh: 1.4 },
  md: { base: 11, xs: 10, sm: 11, md: 12, lg: 16, xl: 20, display: 26, lh: 1.5 },
  lg: { base: 13, xs: 11, sm: 13, md: 14, lg: 18, xl: 24, display: 30, lh: 1.55 },
} as const;

/** @react-pdf/renderer built-in fonts (Calibri → Helvetica fallback in PDF) */
const PDF_FONTS: Record<
  CvFontFamily,
  { regular: string; bold: string }
> = {
  arial: { regular: "Helvetica", bold: "Helvetica-Bold" },
  helvetica: { regular: "Helvetica", bold: "Helvetica-Bold" },
  times: { regular: "Times-Roman", bold: "Times-Bold" },
  calibri: { regular: "Helvetica", bold: "Helvetica-Bold" },
};

const PDF_SIZE = {
  sm: { base: 9, xs: 8, sm: 9, md: 10, lg: 11, xl: 14, display: 18, lh: 1.4 },
  md: { base: 10, xs: 9, sm: 10, md: 11, lg: 14, xl: 18, display: 24, lh: 1.5 },
  lg: { base: 12, xs: 10, sm: 12, md: 13, lg: 16, xl: 22, display: 28, lh: 1.55 },
} as const;

type PreviewSizeScale = (typeof SIZE_SCALE)[CvFontSize];
type PdfSizeScale = (typeof PDF_SIZE)[CvFontSize];

export type PreviewTypography = {
  fontFamily: string;
  fontWeight: number;
  headingWeight: number;
  sizes: PreviewSizeScale;
  lineHeight: number;
};

export type PdfTypography = {
  fontFamily: string;
  headingFamily: string;
  sizes: PdfSizeScale;
  lineHeight: number;
  bodyWeight: "normal" | "bold";
};

function resolveFont(config: ResumeConfig): CvFontFamily {
  return normalizeFontFamily(config.fontFamily);
}

export function getPreviewTypography(config: ResumeConfig): PreviewTypography {
  const font = resolveFont(config);
  const sizes = SIZE_SCALE[config.fontSize ?? "md"];
  const bold = config.fontBold ?? false;
  return {
    fontFamily: PREVIEW_FONTS[font],
    fontWeight: bold ? 500 : 400,
    headingWeight: bold ? 700 : 600,
    sizes,
    lineHeight: sizes.lh,
  };
}

export function getPdfTypography(config: ResumeConfig): PdfTypography {
  const font = resolveFont(config);
  const fonts = PDF_FONTS[font];
  const sizes = PDF_SIZE[config.fontSize ?? "md"];
  const bold = config.fontBold ?? false;
  return {
    fontFamily: fonts.regular,
    headingFamily: fonts.bold,
    sizes,
    lineHeight: sizes.lh,
    bodyWeight: bold ? "bold" : "normal",
  };
}

export const DEFAULT_TYPOGRAPHY = {
  fontFamily: "arial" as CvFontFamily,
  fontSize: "md" as CvFontSize,
  fontBold: false,
};

/** Bullet / highlight lines — same scale as body text (not xs/sm). */
export function getPdfBulletStyle(
  tk: ReturnType<typeof getPdfSheetTokens>,
): {
  fontFamily: string;
  fontSize: number;
  lineHeight: number;
  marginLeft: number;
  marginBottom: number;
} {
  return {
    fontFamily: tk.bodyFamily,
    fontSize: tk.base,
    lineHeight: tk.lh,
    marginLeft: 10,
    marginBottom: 4,
  };
}

export function getPdfSheetTokens(config: ResumeConfig) {
  const ty = getPdfTypography(config);
  const font = resolveFont(config);
  const fonts = PDF_FONTS[font];
  const bold = config.fontBold ?? false;
  return {
    fontFamily: fonts.regular,
    bodyFamily: bold ? fonts.bold : fonts.regular,
    headingFamily: ty.headingFamily,
    bodyWeight: ty.bodyWeight,
    base: ty.sizes.base,
    xs: ty.sizes.xs,
    sm: ty.sizes.sm,
    md: ty.sizes.md,
    lg: ty.sizes.lg,
    xl: ty.sizes.xl,
    display: ty.sizes.display,
    lh: ty.lineHeight,
    page: {
      fontFamily: fonts.regular,
      fontSize: ty.sizes.base,
      lineHeight: ty.lineHeight,
    },
  };
}