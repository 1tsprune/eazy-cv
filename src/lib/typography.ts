import type { CvFontFamily, CvFontSize, ResumeConfig } from "./types";

export const CV_FONT_FAMILIES: {
  id: CvFontFamily;
  label: string;
}[] = [
  { id: "outfit", label: "Outfit" },
  { id: "inter", label: "Inter" },
  { id: "serif", label: "Serif" },
  { id: "mono", label: "Mono" },
];

export const CV_FONT_SIZES: { id: CvFontSize }[] = [
  { id: "sm" },
  { id: "md" },
  { id: "lg" },
];

const PREVIEW_FONTS: Record<CvFontFamily, string> = {
  outfit: "var(--font-outfit), system-ui, sans-serif",
  inter: "var(--font-inter), system-ui, sans-serif",
  serif: "Georgia, 'Times New Roman', Times, serif",
  mono: "'Courier New', Courier, monospace",
};

const SIZE_SCALE = {
  sm: { base: 10, xs: 9, sm: 10, md: 11, lg: 14, xl: 18, display: 22, lh: 1.45 },
  md: { base: 11, xs: 10, sm: 11, md: 12, lg: 16, xl: 20, display: 26, lh: 1.5 },
  lg: { base: 12, xs: 11, sm: 12, md: 13, lg: 18, xl: 22, display: 30, lh: 1.55 },
} as const;

const PDF_FONTS: Record<
  CvFontFamily,
  { regular: string; bold: string }
> = {
  outfit: { regular: "Helvetica", bold: "Helvetica-Bold" },
  inter: { regular: "Helvetica", bold: "Helvetica-Bold" },
  serif: { regular: "Times-Roman", bold: "Times-Bold" },
  mono: { regular: "Courier", bold: "Courier-Bold" },
};

const PDF_SIZE = {
  sm: { base: 9, xs: 8, sm: 9, md: 10, lg: 12, xl: 16, display: 20, lh: 1.45 },
  md: { base: 10, xs: 9, sm: 10, md: 11, lg: 14, xl: 18, display: 24, lh: 1.5 },
  lg: { base: 11, xs: 10, sm: 11, md: 12, lg: 15, xl: 20, display: 28, lh: 1.55 },
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

export function getPreviewTypography(config: ResumeConfig): PreviewTypography {
  const sizes = SIZE_SCALE[config.fontSize ?? "md"];
  const bold = config.fontBold ?? false;
  return {
    fontFamily: PREVIEW_FONTS[config.fontFamily ?? "outfit"],
    fontWeight: bold ? 500 : 400,
    headingWeight: bold ? 700 : 600,
    sizes,
    lineHeight: sizes.lh,
  };
}

export function getPdfTypography(config: ResumeConfig): PdfTypography {
  const fonts = PDF_FONTS[config.fontFamily ?? "outfit"];
  const sizes = PDF_SIZE[config.fontSize ?? "md"];
  const bold = config.fontBold ?? false;
  return {
    fontFamily: bold ? fonts.bold : fonts.regular,
    headingFamily: fonts.bold,
    sizes,
    lineHeight: sizes.lh,
    bodyWeight: bold ? "bold" : "normal",
  };
}

export const DEFAULT_TYPOGRAPHY = {
  fontFamily: "outfit" as CvFontFamily,
  fontSize: "md" as CvFontSize,
  fontBold: false,
};

export function getPdfSheetTokens(config: ResumeConfig) {
  const ty = getPdfTypography(config);
  return {
    fontFamily: ty.fontFamily,
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
      fontFamily: ty.fontFamily,
      fontSize: ty.sizes.base,
      lineHeight: ty.lineHeight,
    },
  };
}