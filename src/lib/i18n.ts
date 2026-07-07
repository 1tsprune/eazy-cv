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

export function t(lang: Language, key: keyof (typeof labels)["id"]): string {
  return labels[lang][key];
}