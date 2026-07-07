import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import pngToIco from "png-to-ico";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const svg = readFileSync(join(root, "public/brand/logo-icon.svg"));

const sizes = [
  { file: "src/app/apple-icon.png", size: 180 },
  { file: "public/brand/og-icon.png", size: 512 },
];

for (const { file, size } of sizes) {
  await sharp(svg).resize(size, size).png().toFile(join(root, file));
}

const favicon16 = await sharp(svg).resize(16, 16).png().toBuffer();
const favicon32 = await sharp(svg).resize(32, 32).png().toBuffer();
const favicon48 = await sharp(svg).resize(48, 48).png().toBuffer();
const ico = await pngToIco([favicon16, favicon32, favicon48]);
writeFileSync(join(root, "src/app/favicon.ico"), ico);

console.log("Generated apple-icon.png, og-icon.png, favicon.ico");