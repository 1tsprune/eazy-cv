const MAX_INPUT_BYTES = 5 * 1024 * 1024;
const OUTPUT_SIZE = 320;
const JPEG_QUALITY = 0.82;

export async function processPhotoFile(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new Error("invalid_type");
  }
  if (file.size > MAX_INPUT_BYTES) {
    throw new Error("too_large");
  }

  const bitmap = await createImageBitmap(file);
  const scale = Math.min(OUTPUT_SIZE / bitmap.width, OUTPUT_SIZE / bitmap.height, 1);
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("canvas_unavailable");

  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  return canvas.toDataURL("image/jpeg", JPEG_QUALITY);
}