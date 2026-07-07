import { PROSE_JUSTIFY } from "./document-layout";
import type { CoverLetterData, Language, PersonalInfo } from "./types";

export const BODY_JUSTIFY_CLASS = `${PROSE_JUSTIFY} leading-[1.7]`;

export function getCoverLetterLabels(lang: Language) {
  if (lang === "id") {
    return {
      kepadaYth: "Kepada Yth.",
      diTempat: "di Tempat",
      denganHormat: "Dengan hormat,",
      formalClosing:
        "Demikian surat lamaran ini saya buat dengan sebenarnya. Atas perhatian dan kesempatan yang Bapak/Ibu berikan, saya ucapkan terima kasih.",
      closing: "Hormat saya,",
      subject: (position: string) =>
        `Hal: Lamaran Pekerjaan — ${position || "..."}`,
      dateLine: (location: string, date: string) =>
        [location, date].filter(Boolean).join(", ") || date || "—",
      bodyPlaceholder: "Isi surat di form sebelah kiri...",
      defaultName: "Nama Kamu",
    };
  }

  return {
    kepadaYth: "To:",
    diTempat: "",
    denganHormat: "Dear Hiring Manager,",
    formalClosing:
      "Thank you for your time and consideration. I look forward to hearing from you.",
    closing: "Sincerely,",
    subject: (position: string) =>
      `Re: Application for ${position || "..."}`,
    dateLine: (location: string, date: string) =>
      [location, date].filter(Boolean).join(", ") || date || "—",
    bodyPlaceholder: "Write your letter body in the form...",
    defaultName: "Your Name",
  };
}

export function getCoverLetterSubject(
  cover: CoverLetterData,
  lang: Language,
): string {
  return getCoverLetterLabels(lang).subject(cover.position);
}

export function splitLetterParagraphs(body: string): string[] {
  return body
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}

export function getSenderName(personal: PersonalInfo, lang: Language): string {
  const labels = getCoverLetterLabels(lang);
  return personal.fullName || labels.defaultName;
}

export function getSenderContactLines(personal: PersonalInfo): string[] {
  return [personal.email, personal.phone, personal.location].filter(Boolean);
}