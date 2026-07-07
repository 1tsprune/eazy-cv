import { Font } from "@react-pdf/renderer";

let ready = false;

/** Break very long tokens (URLs, email) so rows do not overflow the page. */
function hyphenateWord(word: string): string[] {
  if (word.length <= 18) return [word];
  const parts: string[] = [];
  let rest = word;
  while (rest.length > 18) {
    parts.push(rest.slice(0, 18));
    rest = rest.slice(18);
  }
  if (rest) parts.push(rest);
  return parts;
}

/** Run once before generating PDFs. */
export function ensurePdfSetup(): void {
  if (ready) return;
  Font.registerHyphenationCallback(hyphenateWord);
  ready = true;
}