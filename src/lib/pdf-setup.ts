import { Font } from "@react-pdf/renderer";
import path from "path";

type FontApi = typeof Font;

function fontSrc(filename: string): string {
  if (typeof window !== "undefined") {
    return `/fonts/${filename}`;
  }
  return path.join(process.cwd(), "public", "fonts", filename);
}

function isInterRegistered(FontRef: FontApi): boolean {
  const families = FontRef.getRegisteredFontFamilies?.() ?? [];
  return families.includes("Inter") && families.includes("Inter-Bold");
}

/** Register Inter + hyphenation on the given @react-pdf Font store. */
export function registerPdfFonts(FontRef: FontApi = Font): void {
  if (isInterRegistered(FontRef)) return;

  FontRef.registerHyphenationCallback((word) => [word]);

  FontRef.register({
    family: "Inter",
    src: fontSrc("Inter-Regular.ttf"),
  });
  FontRef.register({
    family: "Inter-Bold",
    src: fontSrc("Inter-Bold.ttf"),
  });
}

/** Run once before generating PDFs — safe to call from preview & download. */
export function ensurePdfSetup(): void {
  registerPdfFonts(Font);
}