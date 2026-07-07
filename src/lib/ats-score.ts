import type { CvProfile } from "./types";
import { countSoftSkills, countTechnicalSkills } from "./skill-groups";
import type { Language, ResumeData } from "./types";

export interface AtsCheck {
  id: string;
  label: string;
  passed: boolean;
  weight: number;
  tip: string;
}

const baseCopy = {
  id: {
    name: { label: "Nama lengkap", tip: "Isi nama lengkap di bagian Informasi Pribadi" },
    title: { label: "Jabatan / title", tip: "Tambahkan posisi yang dilamar, misalnya \"Software Engineer\"" },
    email: { label: "Email profesional", tip: "Gunakan email aktif & profesional (hindari nickname aneh)" },
    phone: { label: "Nomor telepon", tip: "Tambahkan nomor HP/WA yang bisa dihubungi HR" },
    location: { label: "Lokasi", tip: "Tulis kota domisili, misalnya \"Jakarta, Indonesia\"" },
    summary: {
      label: "Ringkasan profil",
      tip: "Tulis ringkasan minimal 50 karakter — keahlian utama & tujuan karir",
    },
    experience: {
      label: "Pengalaman kerja",
      tip: "Tambahkan minimal 1 pengalaman kerja, magang, atau freelance",
    },
    education: { label: "Pendidikan", tip: "Tambahkan riwayat pendidikan terakhir kamu" },
    techSkills: {
      label: "Technical skills (min. 3)",
      tip: "Tambahkan skill relevan: React, Excel, Figma, dll.",
    },
    softSkills: {
      label: "Soft skills (min. 2)",
      tip: "Contoh: komunikasi, leadership, problem solving",
    },
    keywords: {
      label: "Poin pencapaian di pengalaman",
      tip: "Tiap pengalaman isi 2+ bullet pencapaian pakai angka/hasil kerja",
    },
    linkedin: {
      label: "LinkedIn (disarankan)",
      tip: "Tambahkan link LinkedIn biar HR bisa cek profil kamu",
    },
    projects: {
      label: "Proyek (disarankan)",
      tip: "Tambahkan 1 proyek/portfolio untuk bukti skill kamu",
    },
  },
  en: {
    name: { label: "Full name", tip: "Fill in your full name under Personal Information" },
    title: { label: "Job title", tip: "Add the role you're targeting, e.g. \"Software Engineer\"" },
    email: { label: "Professional email", tip: "Use an active, professional email address" },
    phone: { label: "Phone number", tip: "Add a phone number HR can reach you on" },
    location: { label: "Location", tip: "Add your city, e.g. \"Jakarta, Indonesia\"" },
    summary: {
      label: "Professional summary",
      tip: "Write at least 50 characters — key skills & career goal",
    },
    experience: {
      label: "Work experience",
      tip: "Add at least 1 job, internship, or freelance experience",
    },
    education: { label: "Education", tip: "Add your latest education entry" },
    techSkills: {
      label: "Technical skills (min. 3)",
      tip: "Add relevant skills: React, Excel, Figma, etc.",
    },
    softSkills: {
      label: "Soft skills (min. 2)",
      tip: "e.g. communication, leadership, problem solving",
    },
    keywords: {
      label: "Achievement bullets in experience",
      tip: "Add 2+ achievement bullets per role with numbers/results",
    },
    linkedin: {
      label: "LinkedIn (recommended)",
      tip: "Add your LinkedIn URL so recruiters can verify your profile",
    },
    projects: {
      label: "Projects (recommended)",
      tip: "Add at least 1 project/portfolio to showcase your skills",
    },
  },
} as const;

type ScoreField = { label: string; tip: string };

const profileCopy: Record<
  CvProfile,
  Record<Language, Partial<Record<keyof (typeof baseCopy)["id"], ScoreField>>>
> = {
  professional: { id: {}, en: {} },
  internship: {
    id: {
      title: {
        label: "Jabatan / status",
        tip: "Contoh: Mahasiswa S1 Informatika / Intern IT",
      },
      experience: {
        label: "Pengalaman magang",
        tip: "Tambahkan magang, proyek kampus, atau freelance",
      },
      keywords: {
        label: "Poin kegiatan di magang",
        tip: "Isi 2+ poin hasil kegiatan — pakai angka kalau bisa",
      },
    },
    en: {
      title: {
        label: "Title / status",
        tip: "e.g. CS Undergraduate / IT Intern",
      },
      experience: {
        label: "Internship experience",
        tip: "Add internship, campus project, or freelance work",
      },
      keywords: {
        label: "Activity bullets",
        tip: "Add 2+ bullets per role with results or numbers",
      },
    },
  },
  student: {
    id: {
      title: {
        label: "Status pelajar",
        tip: "Contoh: Pelajar SMA Kelas 12 / Mahasiswa",
      },
      experience: {
        label: "Pengalaman & kegiatan",
        tip: "Magang singkat, part-time, volunteer, atau proyek sekolah",
      },
      keywords: {
        label: "Poin kegiatan",
        tip: "Tulis pencapaian lomba, organisasi, atau proyek tim",
      },
      projects: {
        label: "Proyek (disarankan)",
        tip: "Proyek sekolah/kampus membuktikan skill kamu",
      },
    },
    en: {
      title: {
        label: "Student status",
        tip: "e.g. Grade 12 Student / Undergraduate",
      },
      experience: {
        label: "Experience & activities",
        tip: "Short internship, part-time, volunteer, or school projects",
      },
      keywords: {
        label: "Activity bullets",
        tip: "List competition, club, or team project achievements",
      },
      projects: {
        label: "Projects (recommended)",
        tip: "School or campus projects show your skills",
      },
    },
  },
};

export function calculateAtsScore(
  data: ResumeData,
  locale: Language = "id",
  profile: CvProfile = "professional",
): { score: number; checks: AtsCheck[] } {
  const t = { ...baseCopy[locale], ...profileCopy[profile][locale] };

  const checks: AtsCheck[] = [
    {
      id: "name",
      ...t.name,
      passed: data.personal.fullName.trim().length >= 2,
      weight: 10,
    },
    {
      id: "title",
      ...t.title,
      passed: data.personal.title.trim().length >= 2,
      weight: 8,
    },
    {
      id: "email",
      ...t.email,
      passed: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.personal.email),
      weight: 10,
    },
    {
      id: "phone",
      ...t.phone,
      passed: data.personal.phone.trim().length >= 8,
      weight: 8,
    },
    {
      id: "location",
      ...t.location,
      passed: data.personal.location.trim().length >= 3,
      weight: 6,
    },
    {
      id: "summary",
      ...t.summary,
      passed: data.personal.summary.trim().length >= 50,
      weight: 12,
    },
    {
      id: "experience",
      ...t.experience,
      passed: data.experiences.length >= 1,
      weight: 18,
    },
    {
      id: "education",
      ...t.education,
      passed: data.educations.length >= 1,
      weight: 12,
    },
    {
      id: "tech-skills",
      ...t.techSkills,
      passed: countTechnicalSkills(data) >= 3,
      weight: 12,
    },
    {
      id: "soft-skills",
      ...t.softSkills,
      passed: countSoftSkills(data) >= 2,
      weight: 6,
    },
    {
      id: "keywords",
      ...t.keywords,
      passed: data.experiences.some((e) => e.highlights.length >= 2),
      weight: 10,
    },
    {
      id: "linkedin",
      ...t.linkedin,
      passed: /linkedin\.com/i.test(data.personal.linkedin),
      weight: 4,
    },
    {
      id: "projects",
      ...t.projects,
      passed: data.projects.length >= 1,
      weight: 4,
    },
  ];

  const totalWeight = checks.reduce((s, c) => s + c.weight, 0);
  const earned = checks
    .filter((c) => c.passed)
    .reduce((s, c) => s + c.weight, 0);

  return {
    score: Math.round((earned / totalWeight) * 100),
    checks,
  };
}