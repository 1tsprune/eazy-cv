import { Font } from "@react-pdf/renderer";

let ready = false;

/** Run once before generating PDFs — keep words intact (no ugly mid-word breaks). */
export function ensurePdfSetup(): void {
  if (ready) return;
  Font.registerHyphenationCallback((word) => [word]);
  ready = true;
}