import { defaultCoverLetter } from "./cover-letter";
import { DEFAULT_TYPOGRAPHY } from "./typography";
import type { ResumeData, ResumeState } from "./types";
import { DEFAULT_SECTION_ORDER } from "./types";

export const defaultResumeData: ResumeData = {
  personal: {
    fullName: "",
    title: "",
    email: "",
    phone: "",
    location: "",
    website: "",
    linkedin: "",
    github: "",
    summary: "",
    photo: "",
  },
  experiences: [],
  educations: [],
  organizations: [],
  technicalSkills: [],
  softSkills: [],
  projects: [],
  certifications: [],
  languages: [],
  customSections: [],
};

export const defaultResumeState: ResumeState = {
  data: defaultResumeData,
  config: {
    language: "id",
    exportMode: "modern",
    template: "elegant",
    colorTheme: "indigo",
    showPhoto: false,
    sectionOrder: [...DEFAULT_SECTION_ORDER],
    ...DEFAULT_TYPOGRAPHY,
  },
  coverLetter: defaultCoverLetter("id"),
};

export function createId(): string {
  return crypto.randomUUID();
}