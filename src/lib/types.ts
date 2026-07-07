export type Language = "id" | "en";

export type ExportMode = "modern" | "ats";

/** Tujuan CV — mengubah label section & contoh data */
export type CvProfile = "professional" | "internship" | "student";

export type ModernTemplate =
  | "elegant"
  | "minimal"
  | "professional"
  | "executive"
  | "creative"
  | "compact"
  | "academic";

export type ColorTheme =
  | "indigo"
  | "emerald"
  | "rose"
  | "slate"
  | "amber"
  | "violet";

export type CvFontFamily =
  | "arial"
  | "helvetica"
  | "times"
  | "calibri";
export type CvFontSize = "sm" | "md" | "lg";

export interface PersonalInfo {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  linkedin: string;
  github: string;
  summary: string;
  /** Base64 data URL — opsional, hanya template modern */
  photo: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  highlights: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  location: string;
  startDate: string;
  endDate: string;
  gpa: string;
  description: string;
}

export interface Organization {
  id: string;
  name: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  highlights: string[];
}

export interface Project {
  id: string;
  name: string;
  url: string;
  description: string;
  technologies: string[];
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  url: string;
}

export interface LanguageSkill {
  id: string;
  name: string;
  level: string;
}

export interface CustomSection {
  id: string;
  title: string;
  items: string[];
  showInAts: boolean;
}

export interface SkillGroup {
  id: string;
  name: string;
  skills: string[];
}

export interface ResumeData {
  personal: PersonalInfo;
  experiences: Experience[];
  educations: Education[];
  organizations: Organization[];
  skillGroups: SkillGroup[];
  /** @deprecated synced from skillGroups — kept for import/export compat */
  technicalSkills: string[];
  /** @deprecated synced from skillGroups — kept for import/export compat */
  softSkills: string[];
  projects: Project[];
  certifications: Certification[];
  languages: LanguageSkill[];
  customSections: CustomSection[];
}

export type SectionKey =
  | "experience"
  | "education"
  | "organizations"
  | "skills"
  | "projects"
  | "certifications"
  | "languages"
  | "custom";

export const DEFAULT_SECTION_ORDER: SectionKey[] = [
  "experience",
  "education",
  "organizations",
  "skills",
  "projects",
  "certifications",
  "languages",
  "custom",
];

export interface ResumeConfig {
  language: Language;
  exportMode: ExportMode;
  cvProfile: CvProfile;
  template: ModernTemplate;
  colorTheme: ColorTheme;
  showPhoto: boolean;
  sectionOrder: SectionKey[];
  fontFamily: CvFontFamily;
  fontSize: CvFontSize;
  fontBold: boolean;
}

export interface CoverLetterData {
  date: string;
  recipient: string;
  company: string;
  position: string;
  body: string;
}

export interface ResumeState {
  data: ResumeData;
  config: ResumeConfig;
  coverLetter: CoverLetterData;
}