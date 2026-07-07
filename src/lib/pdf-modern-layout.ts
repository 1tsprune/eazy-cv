/** A4 dimensions in pt (@react-pdf size="A4"). */
export const PDF_A4_WIDTH_PT = 595.28;
export const PDF_A4_HEIGHT_PT = 841.89;

/** Sidebar = 32% of page width (matches preview w-[32%]). */
export const PDF_SIDEBAR_WIDTH_PT = Math.round(PDF_A4_WIDTH_PT * 0.32);

/** Main column width beside fixed sidebar. */
export const PDF_MAIN_WIDTH_PT = PDF_A4_WIDTH_PT - PDF_SIDEBAR_WIDTH_PT;

/** Tailwind p-6 → 24px → 18pt */
export const MODERN_PAD_PT = 18;

/** Tailwind p-8 → 32px → 24pt (academic) */
export const MODERN_PAD_LG_PT = 24;

export const PDF_MAIN_BOTTOM_PAD = 28;

/** @deprecated use MODERN_PAD_PT */
export const PDF_PAGE_PAD_MD = MODERN_PAD_PT;
/** @deprecated use MODERN_PAD_LG_PT */
export const PDF_PAGE_PAD_LG = MODERN_PAD_LG_PT;
export const PDF_PAGE_PAD_SM = MODERN_PAD_PT;
export const PDF_PAGE_PAD_XS = MODERN_PAD_PT;