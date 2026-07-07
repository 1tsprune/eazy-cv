import { APP } from "./config";

export const SITE = {
  name: APP.name,
  tagline: "Bikin CV gratis — tanpa login, data di browser",
  whatsapp: "6287863520135",
  whatsappDisplay: "+62 878-6352-0135",
} as const;

export function whatsappUrl(message?: string): string {
  const text = encodeURIComponent(
    message ??
      "Halo, saya mau konsultasi soal CV. Bisa bantu review / kasih saran?",
  );
  return `https://wa.me/${SITE.whatsapp}?text=${text}`;
}