import { getRecommendedSectionOrder } from "./cv-profile";
import { createId } from "./default-data";
import { defaultCoverLetter } from "./cover-letter";
import { DEFAULT_TYPOGRAPHY } from "./typography";
import type { CvProfile, ModernTemplate, ResumeConfig, ResumeState } from "./types";

/** Best dummy profile per template layout */
export function getProfileForTemplate(template: ModernTemplate): CvProfile {
  if (template === "academic") return "student";
  if (template === "compact" || template === "creative") return "internship";
  return "professional";
}

function baseConfig(profile: CvProfile): ResumeState["config"] {
  return {
    language: "id",
    exportMode: "modern",
    cvProfile: profile,
    template: profile === "student" ? "academic" : "elegant",
    colorTheme: "slate",
    showPhoto: false,
    ...DEFAULT_TYPOGRAPHY,
    sectionOrder: getRecommendedSectionOrder(profile),
  };
}

/** Data fiktif — CV profesional / kerja */
export const sampleProfessionalState: ResumeState = {
  data: {
    personal: {
      fullName: "Alex Morgan",
      title: "Software Engineer",
      email: "alex.morgan@email.com",
      phone: "+62 812-0000-0000",
      location: "Jakarta, Indonesia",
      website: "alexmorgan.dev",
      linkedin: "linkedin.com/in/alex-morgan",
      github: "github.com/alexmorgan",
      summary:
        "Engineer dengan pengalaman membangun produk web. Fokus pada React, TypeScript, dan backend Node.js. Data ini cuma contoh — ganti semua dengan info kamu sendiri.",
      photo: "",
    },
    experiences: [
      {
        id: createId(),
        company: "Acme Digital",
        position: "Software Engineer",
        location: "Jakarta",
        startDate: "Jan 2022",
        endDate: "",
        current: true,
        description: "",
        highlights: [
          "Membangun fitur yang dipakai 50.000+ pengguna aktif",
          "Meningkatkan performa halaman utama 35%",
          "Kolaborasi dengan tim desain & produk",
        ],
      },
      {
        id: createId(),
        company: "Startup Labs",
        position: "Junior Developer",
        location: "Bandung",
        startDate: "Mar 2019",
        endDate: "Des 2021",
        current: false,
        description: "",
        highlights: [
          "Ikut membangun MVP dari nol",
          "Menulis unit test untuk modul pembayaran",
        ],
      },
    ],
    educations: [
      {
        id: createId(),
        institution: "Universitas Contoh",
        degree: "S1",
        field: "Teknik Informatika",
        location: "Bandung",
        startDate: "2015",
        endDate: "2019",
        gpa: "3.70",
        description: "",
      },
    ],
    organizations: [
      {
        id: createId(),
        name: "Himpunan Mahasiswa Informatika",
        role: "Ketua Divisi Acara",
        location: "Bandung",
        startDate: "2017",
        endDate: "2018",
        current: false,
        highlights: [
          "Mengkoordinasi 3 event kampus dengan 200+ peserta",
          "Mengelola tim 12 orang",
        ],
      },
    ],
    skillGroups: [
      {
        id: createId(),
        name: "Frameworks",
        skills: ["React", "Next.js", "Node.js", "TypeScript"],
      },
      {
        id: createId(),
        name: "Tools",
        skills: ["PostgreSQL", "Git"],
      },
      {
        id: createId(),
        name: "Soft Skills",
        skills: ["Komunikasi", "Problem solving", "Kerja tim"],
      },
    ],
    technicalSkills: [
      "React",
      "Next.js",
      "Node.js",
      "TypeScript",
      "PostgreSQL",
      "Git",
    ],
    softSkills: ["Komunikasi", "Problem solving", "Kerja tim"],
    projects: [
      {
        id: createId(),
        name: "Portfolio Website",
        url: "github.com/alexmorgan/portfolio",
        description: "Website portofolio pribadi dengan blog dan showcase proyek",
        technologies: ["Next.js", "Tailwind CSS"],
      },
    ],
    certifications: [
      {
        id: createId(),
        name: "Web Development Certificate",
        issuer: "Online Academy",
        date: "2023",
        url: "",
      },
    ],
    languages: [
      { id: createId(), name: "Indonesia", level: "native" },
      { id: createId(), name: "English", level: "professional" },
    ],
    customSections: [],
  },
  config: baseConfig("professional"),
  coverLetter: {
    ...defaultCoverLetter("id"),
    bodyCustom: false,
    company: "Acme Digital",
    position: "Software Engineer",
    body:
      "Saya tertarik melamar posisi Software Engineer di Acme Digital. Sebagai engineer berpengalaman, saya percaya keahlian teknis dan kolaborasi tim saya selaras dengan kebutuhan peran ini.\n\nSaya berharap dapat berdiskusi lebih lanjut mengenai kontribusi saya untuk tim Anda. Terima kasih atas waktu dan pertimbangannya.",
  },
};

/** Data fiktif — CV magang / internship */
export const sampleInternshipState: ResumeState = {
  data: {
    personal: {
      fullName: "Sari Putri",
      title: "Mahasiswa S1 Teknik Informatika",
      email: "sari.putri@email.com",
      phone: "+62 813-0000-0000",
      location: "Bandung, Indonesia",
      website: "",
      linkedin: "linkedin.com/in/sari-putri",
      github: "github.com/sariputri",
      summary:
        "Mahasiswa semester 6 yang mencari magang di bidang pengembangan web. Berpengalaman magang 3 bulan dan aktif di organisasi kampus. Contoh data — ganti dengan info kamu.",
      photo: "",
    },
    experiences: [
      {
        id: createId(),
        company: "Tech Startup Nusantara",
        position: "Intern Frontend Developer",
        location: "Bandung",
        startDate: "Jun 2025",
        endDate: "Agu 2025",
        current: false,
        description: "",
        highlights: [
          "Membantu tim membangun 2 fitur dashboard admin",
          "Melakukan code review dan perbaikan bug UI",
          "Belajar workflow Git & agile scrum",
        ],
      },
    ],
    educations: [
      {
        id: createId(),
        institution: "Universitas Contoh",
        degree: "S1 Teknik Informatika",
        field: "Teknik Informatika",
        location: "Bandung",
        startDate: "2022",
        endDate: "2026 (perkiraan)",
        gpa: "3.65",
        description: "",
      },
    ],
    organizations: [
      {
        id: createId(),
        name: "UKM Programming",
        role: "Anggota Divisi Web",
        location: "Bandung",
        startDate: "2023",
        endDate: "",
        current: true,
        highlights: [
          "Mengadakan workshop HTML/CSS untuk 40 peserta",
          "Membangun website profil UKM",
        ],
      },
    ],
    skillGroups: [
      {
        id: createId(),
        name: "Web Development",
        skills: ["HTML", "CSS", "JavaScript", "React"],
      },
      {
        id: createId(),
        name: "Tools",
        skills: ["Git", "Figma", "VS Code"],
      },
      {
        id: createId(),
        name: "Soft Skills",
        skills: ["Kerja tim", "Komunikasi", "Belajar cepat"],
      },
    ],
    technicalSkills: ["HTML", "CSS", "JavaScript", "React", "Git", "Figma", "VS Code"],
    softSkills: ["Kerja tim", "Komunikasi", "Belajar cepat"],
    projects: [
      {
        id: createId(),
        name: "Aplikasi Manajemen Tugas Kampus",
        url: "github.com/sariputri/task-app",
        description: "Proyek akhir mata kuliah Pemrograman Web",
        technologies: ["React", "Firebase"],
      },
    ],
    certifications: [],
    languages: [
      { id: createId(), name: "Indonesia", level: "native" },
      { id: createId(), name: "English", level: "intermediate" },
    ],
    customSections: [],
  },
  config: baseConfig("internship"),
  coverLetter: {
    ...defaultCoverLetter("id"),
    bodyCustom: false,
    company: "Tech Startup Nusantara",
    position: "Magang Frontend Developer",
    body:
      "Saya tertarik melamar program magang Frontend Developer di Tech Startup Nusantara. Sebagai mahasiswa Teknik Informatika yang sudah memiliki pengalaman magang singkat, saya ingin mengembangkan skill teknis sambil berkontribusi pada tim.\n\nSaya berharap dapat bergabung dan belajar langsung di lingkungan kerja profesional. Terima kasih atas kesempatannya.",
  },
};

/** Data fiktif — CV pelajar / fresh graduate */
export const sampleStudentState: ResumeState = {
  data: {
    personal: {
      fullName: "Budi Santoso",
      title: "Pelajar SMA Kelas 12",
      email: "budi.santoso@email.com",
      phone: "+62 857-0000-0000",
      location: "Surabaya, Indonesia",
      website: "",
      linkedin: "",
      github: "github.com/budisantoso",
      summary:
        "Pelajar aktif dengan minat di teknologi dan desain. Pengalaman organisasi sekolah, lomba, dan proyek tim. Contoh data — ganti dengan info kamu.",
      photo: "",
    },
    experiences: [
      {
        id: createId(),
        company: "Bengkel Komputer Lokal",
        position: "Helper Part-time",
        location: "Surabaya",
        startDate: "Jul 2024",
        endDate: "Des 2024",
        current: false,
        description: "",
        highlights: [
          "Membantu instalasi OS dan troubleshooting ringan",
          "Melayani 10+ pelanggan per hari",
        ],
      },
    ],
    educations: [
      {
        id: createId(),
        institution: "SMA Contoh Negeri 1",
        degree: "SMA",
        field: "IPA",
        location: "Surabaya",
        startDate: "2022",
        endDate: "2026 (perkiraan)",
        gpa: "88/100",
        description: "",
      },
    ],
    organizations: [
      {
        id: createId(),
        name: "OSIS SMA Contoh",
        role: "Anggota Divisi IT",
        location: "Surabaya",
        startDate: "2024",
        endDate: "",
        current: true,
        highlights: [
          "Mengelola media sosial sekolah",
          "Membuat poster digital untuk 5 event sekolah",
        ],
      },
      {
        id: createId(),
        name: "Ekstrakurikuler Robotik",
        role: "Anggota Tim",
        location: "Surabaya",
        startDate: "2023",
        endDate: "2025",
        current: false,
        highlights: [
          "Juara 2 lomba robotik tingkat kota",
          "Merancang prototipe line follower",
        ],
      },
    ],
    skillGroups: [
      {
        id: createId(),
        name: "Digital",
        skills: ["Canva", "Microsoft Office", "HTML dasar"],
      },
      {
        id: createId(),
        name: "Soft Skills",
        skills: ["Kerja tim", "Disiplin", "Presentasi"],
      },
    ],
    technicalSkills: ["Canva", "Microsoft Office", "HTML dasar"],
    softSkills: ["Kerja tim", "Disiplin", "Presentasi"],
    projects: [
      {
        id: createId(),
        name: "Website Profil Sekolah (projek tim)",
        url: "",
        description: "Website sederhana untuk pameran karya siswa",
        technologies: ["HTML", "CSS"],
      },
    ],
    certifications: [
      {
        id: createId(),
        name: "TOEFL ITP",
        issuer: "ETS",
        date: "2025",
        url: "",
      },
    ],
    languages: [
      { id: createId(), name: "Indonesia", level: "native" },
      { id: createId(), name: "English", level: "intermediate" },
    ],
    customSections: [],
  },
  config: baseConfig("student"),
  coverLetter: {
    ...defaultCoverLetter("id"),
    bodyCustom: false,
    company: "Perusahaan Contoh",
    position: "Program Magang SMA",
    body:
      "Saya tertarik mengikuti program magang yang Bapak/Ibu tawarkan. Sebagai pelajar SMA kelas 12, saya memiliki pengalaman organisasi dan minat kuat di bidang teknologi.\n\nSaya berharap dapat belajar dan berkontribusi. Terima kasih atas perhatiannya.",
  },
};

const samples: Record<CvProfile, ResumeState> = {
  professional: sampleProfessionalState,
  internship: sampleInternshipState,
  student: sampleStudentState,
};

export function getSampleResumeState(
  profile: CvProfile = "professional",
  configOverrides?: Partial<ResumeConfig>,
): ResumeState {
  const base = structuredClone(samples[profile]);
  if (!configOverrides) return base;
  return {
    ...base,
    config: { ...base.config, ...configOverrides },
  };
}

export function getSampleForTemplate(
  template: ModernTemplate,
  overrides?: Partial<ResumeConfig>,
): ResumeState {
  const profile = getProfileForTemplate(template);
  return getSampleResumeState(profile, {
    exportMode: "modern",
    template,
    ...overrides,
  });
}

/** @deprecated use getSampleResumeState */
export const sampleResumeState = sampleProfessionalState;