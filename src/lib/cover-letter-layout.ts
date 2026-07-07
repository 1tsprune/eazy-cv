import { getCoverLetterSubjectPrefix } from "./cv-profile";
import { PROSE_JUSTIFY } from "./document-layout";
import type { CoverLetterData, CvProfile, Language, PersonalInfo } from "./types";

export const BODY_JUSTIFY_CLASS = `${PROSE_JUSTIFY} leading-[1.7]`;

export function getCoverLetterLabels(lang: Language, profile: CvProfile = "professional") {
  const prefix = getCoverLetterSubjectPrefix(profile, lang);
  if (lang === "id") {
    return {
      kepadaYth: "Kepada Yth.",
      diTempat: "di Tempat",
      denganHormat: "Dengan hormat,",
      formalClosing:
        "Demikian surat lamaran ini saya buat dengan sebenarnya. Atas perhatian dan kesempatan yang Bapak/Ibu berikan, saya ucapkan terima kasih.",
      closing: "Hormat saya,",
      subject: (position: string) =>
        `Hal: ${prefix} — ${position || "..."}`,
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
      `Re: ${prefix} — ${position || "..."}`,
    dateLine: (location: string, date: string) =>
      [location, date].filter(Boolean).join(", ") || date || "—",
    bodyPlaceholder: "Write your letter body in the form...",
    defaultName: "Your Name",
  };
}

export function getCoverLetterSubject(
  cover: CoverLetterData,
  lang: Language,
  profile: CvProfile = "professional",
): string {
  return getCoverLetterLabels(lang, profile).subject(cover.position);
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