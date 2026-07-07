import type { CvProfile, Language, SectionKey } from "./types";

export const DEFAULT_CV_PROFILE: CvProfile = "professional";

export const CV_PROFILES: CvProfile[] = [
  "professional",
  "internship",
  "student",
];

const experienceLabels: Record<CvProfile, { id: string; en: string }> = {
  professional: { id: "Pengalaman Kerja", en: "Work Experience" },
  internship: { id: "Pengalaman Magang", en: "Internship Experience" },
  student: { id: "Pengalaman & Kegiatan", en: "Experience & Activities" },
};

const atsExperienceLabels: Record<CvProfile, { id: string; en: string }> = {
  professional: {
    id: "Pengalaman Profesional",
    en: "Professional Experience",
  },
  internship: { id: "Pengalaman Magang", en: "Internship Experience" },
  student: {
    id: "Pengalaman Terkait",
    en: "Relevant Experience",
  },
};

export function getExperienceLabel(
  lang: Language,
  profile: CvProfile,
  ats = false,
): string {
  const map = ats ? atsExperienceLabels : experienceLabels;
  return map[profile][lang];
}

export function getRecommendedSectionOrder(profile: CvProfile): SectionKey[] {
  switch (profile) {
    case "student":
      return [
        "education",
        "organizations",
        "projects",
        "experience",
        "skills",
        "certifications",
        "languages",
        "custom",
      ];
    case "internship":
      return [
        "education",
        "experience",
        "projects",
        "organizations",
        "skills",
        "certifications",
        "languages",
        "custom",
      ];
    default:
      return [
        "experience",
        "education",
        "organizations",
        "skills",
        "projects",
        "certifications",
        "languages",
        "custom",
      ];
  }
}

type ProfileUiStrings = {
  profileProfessional: string;
  profileInternship: string;
  profileStudent: string;
  cvProfile: string;
  cvProfileHint: string;
  jobTitlePlaceholder: string;
  experiencePositionPlaceholder: string;
  experienceCompanyPlaceholder: string;
  highlightsPlaceholder: string;
  summaryPlaceholder: string;
  currentlyWorking: string;
};

const profileUi: Record<Language, Record<CvProfile, ProfileUiStrings>> = {
  id: {
    professional: {
      profileProfessional: "Kerja",
      profileInternship: "Magang",
      profileStudent: "Pelajar",
      cvProfile: "Jenis CV",
      cvProfileHint:
        "Pilih sesuai tujuan: kerja full-time, magang/internship, atau masih sekolah/kuliah.",
      jobTitlePlaceholder: "Software Engineer",
      experiencePositionPlaceholder: "Software Engineer",
      experienceCompanyPlaceholder: "Nama perusahaan",
      highlightsPlaceholder:
        "Meningkatkan performa 35%, memimpin tim 5 orang...",
      summaryPlaceholder:
        "Profesional dengan pengalaman di bidang X. Fokus pada...",
      currentlyWorking: "Masih bekerja di sini",
    },
    internship: {
      profileProfessional: "Kerja",
      profileInternship: "Magang",
      profileStudent: "Pelajar",
      cvProfile: "Jenis CV",
      cvProfileHint:
        "CV magang menonjolkan pendidikan, proyek kampus, dan pengalaman internship.",
      jobTitlePlaceholder: "Mahasiswa S1 / Intern IT",
      experiencePositionPlaceholder: "Intern / Magang",
      experienceCompanyPlaceholder: "Perusahaan / Startup",
      highlightsPlaceholder:
        "Membantu tim dev 3 fitur, riset user untuk proyek akhir...",
      summaryPlaceholder:
        "Mahasiswa semester 6 yang mencari magang di bidang...",
      currentlyWorking: "Masih magang di sini",
    },
    student: {
      profileProfessional: "Kerja",
      profileInternship: "Magang",
      profileStudent: "Pelajar",
      cvProfile: "Jenis CV",
      cvProfileHint:
        "Untuk pelajar: fokus pendidikan, organisasi sekolah/kampus, lomba, dan proyek.",
      jobTitlePlaceholder: "Pelajar SMA / Mahasiswa",
      experiencePositionPlaceholder: "Volunteer / Part-time / Magang",
      experienceCompanyPlaceholder: "Sekolah / Komunitas / Perusahaan",
      highlightsPlaceholder:
        "Juara lomba coding, ketua divisi acara, tutor mata pelajaran...",
      summaryPlaceholder:
        "Pelajar aktif dengan minat di bidang X. Berpengalaman di organisasi...",
      currentlyWorking: "Masih aktif di sini",
    },
  },
  en: {
    professional: {
      profileProfessional: "Job",
      profileInternship: "Internship",
      profileStudent: "Student",
      cvProfile: "CV Type",
      cvProfileHint:
        "Choose based on your goal: full-time job, internship, or still in school.",
      jobTitlePlaceholder: "Software Engineer",
      experiencePositionPlaceholder: "Software Engineer",
      experienceCompanyPlaceholder: "Company name",
      highlightsPlaceholder:
        "Improved performance 35%, led a team of 5...",
      summaryPlaceholder:
        "Professional with experience in X. Focused on...",
      currentlyWorking: "Currently working here",
    },
    internship: {
      profileProfessional: "Job",
      profileInternship: "Internship",
      profileStudent: "Student",
      cvProfile: "CV Type",
      cvProfileHint:
        "Internship CVs highlight education, campus projects, and internship roles.",
      jobTitlePlaceholder: "Undergraduate / IT Intern",
      experiencePositionPlaceholder: "Intern",
      experienceCompanyPlaceholder: "Company / Startup",
      highlightsPlaceholder:
        "Supported dev team on 3 features, user research for final project...",
      summaryPlaceholder:
        "Undergraduate seeking an internship in...",
      currentlyWorking: "Currently interning here",
    },
    student: {
      profileProfessional: "Job",
      profileInternship: "Internship",
      profileStudent: "Student",
      cvProfile: "CV Type",
      cvProfileHint:
        "For students: focus on education, school clubs, competitions, and projects.",
      jobTitlePlaceholder: "High School / University Student",
      experiencePositionPlaceholder: "Volunteer / Part-time / Intern",
      experienceCompanyPlaceholder: "School / Community / Company",
      highlightsPlaceholder:
        "Coding competition winner, event lead, peer tutor...",
      summaryPlaceholder:
        "Active student interested in X with organization experience...",
      currentlyWorking: "Currently active here",
    },
  },
};

export function getProfileUiStrings(
  profile: CvProfile,
  locale: Language,
): ProfileUiStrings {
  return profileUi[locale][profile];
}

export function getProfileLabel(profile: CvProfile, locale: Language): string {
  const s = profileUi[locale][profile];
  switch (profile) {
    case "internship":
      return s.profileInternship;
    case "student":
      return s.profileStudent;
    default:
      return s.profileProfessional;
  }
}

export function getCoverLetterSubjectPrefix(
  profile: CvProfile,
  lang: Language,
): string {
  if (lang === "id") {
    if (profile === "internship") return "Lamaran Magang";
    if (profile === "student") return "Lamaran Program / Magang";
    return "Lamaran Pekerjaan";
  }
  if (profile === "internship") return "Internship Application";
  if (profile === "student") return "Program / Internship Application";
  return "Job Application";
}