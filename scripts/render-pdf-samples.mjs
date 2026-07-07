/**
 * Render Eazy CV PDFs for comparison with EZCV samples in /samples.
 * Usage: npm run pdf:samples
 */
import { mkdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { register } from "tsx/esm/api";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

register();

const outDir = join(root, "samples", "eazycv-output");
mkdirSync(outDir, { recursive: true });

const { renderToFile } = await import("@react-pdf/renderer");
const { buildResumePdfDocument } = await import(
  "../src/lib/build-resume-pdf-document.tsx"
);
const { sampleProfessionalState } = await import("../src/lib/sample-data.ts");

const { data } = sampleProfessionalState;

const atsConfig = {
  ...sampleProfessionalState.config,
  exportMode: "ats",
};
const modernConfig = {
  ...sampleProfessionalState.config,
  exportMode: "modern",
  template: "elegant",
};

await renderToFile(
  buildResumePdfDocument(data, atsConfig),
  join(outDir, "Alex Morgan_ATS.pdf"),
);
await renderToFile(
  buildResumePdfDocument(data, modernConfig),
  join(outDir, "Alex Morgan_CV.pdf"),
);

console.log("Wrote samples/eazycv-output/Alex Morgan_ATS.pdf");
console.log("Wrote samples/eazycv-output/Alex Morgan_CV.pdf");
console.log("Compare with samples/Your Full Name_ATS.pdf & Your Full Name_CV.pdf");