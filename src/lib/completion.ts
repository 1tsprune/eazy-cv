import type { ResumeData } from "./types";

export function calculateCompletion(data: ResumeData): number {
  const checks = [
    data.personal.fullName.trim().length >= 2,
    data.personal.title.trim().length >= 2,
    data.personal.email.includes("@"),
    data.personal.phone.trim().length >= 8,
    data.personal.summary.trim().length >= 30,
    data.experiences.length >= 1,
    data.educations.length >= 1,
    data.technicalSkills.length >= 2,
  ];
  const done = checks.filter(Boolean).length;
  return Math.round((done / checks.length) * 100);
}