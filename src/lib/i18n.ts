import type { Language } from "./types";

const labels = {
  id: {
    summary: "Ringkasan Profil",
    experience: "Pengalaman Kerja",
    education: "Pendidikan",
    organizations: "Organisasi",
    technicalSkills: "Keahlian Teknis",
    softSkills: "Soft Skills",
    projects: "Proyek",
    certifications: "Sertifikasi",
    languages: "Bahasa",
    present: "Sekarang",
    gpa: "IPK",
  },
  en: {
    summary: "Professional Summary",
    experience: "Work Experience",
    education: "Education",
    organizations: "Organizations",
    technicalSkills: "Technical Skills",
    softSkills: "Soft Skills",
    projects: "Projects",
    certifications: "Certifications",
    languages: "Languages",
    present: "Present",
    gpa: "GPA",
  },
} as const;

export type I18nKey = keyof (typeof labels)["id"];

export function t(lang: Language, key: I18nKey): string {
  return labels[lang][key];
}

const atsLabels: Partial<Record<I18nKey, { id: string; en: string }>> = {
  experience: {
    id: "Pengalaman Profesional",
    en: "Professional Experience",
  },
  organizations: {
    id: "Pengalaman Komunitas",
    en: "Community Experience",
  },
  technicalSkills: {
    id: "Keahlian & Alat",
    en: "Skills & Tools",
  },
};

/** ATS export / preview — section titles that match common one-page CVs */
export function tAts(lang: Language, key: I18nKey): string {
  const override = atsLabels[key];
  if (override) return override[lang];
  return t(lang, key);
}