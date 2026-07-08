import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const svg = readFileSync(join(root, "public/brand/og-template.svg"));

await sharp(svg)
  .resize(1200, 630)
  .png({ compressionLevel: 9, quality: 95 })
  .toFile(join(root, "public/brand/og.png"));

console.log("Generated public/brand/og.png (1200×630)");