import { hasSkillContent } from "./skill-groups";
import type { ResumeData } from "./types";

export function isResumeDataEmpty(data: ResumeData): boolean {
  const p = data.personal;
  return (
    !p.fullName?.trim() &&
    !p.title?.trim() &&
    !p.summary?.trim() &&
    !p.email?.trim() &&
    data.experiences.length === 0 &&
    data.educations.length === 0 &&
    data.organizations.length === 0 &&
    data.projects.length === 0 &&
    data.certifications.length === 0 &&
    data.languages.length === 0 &&
    !hasSkillContent(data)
  );
}

/** Sample summaries always mention this is example data */
export function isSampleResumeData(data: ResumeData): boolean {
  const s = data.personal.summary.toLowerCase();
  return s.includes("contoh") || s.includes("example");
}