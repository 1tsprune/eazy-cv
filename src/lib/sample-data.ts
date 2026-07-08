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
        "Software Engineer dengan 5+ tahun pengalaman membangun aplikasi web skala produksi untuk 50.000+ pengguna aktif. Terampil React, TypeScript, Node.js, PostgreSQL, dan arsitektur REST API. Berpengalaman memimpin squad 5 engineer, berkolaborasi dengan tim produk & desain, serta mengoptimalkan performa sistem hingga 35%. Mencari peran full-time di perusahaan yang mengutamakan produk berkualitas dan dampak nyata bagi pengguna.",
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
          "Merancang modul checkout yang menangani 12.000+ transaksi/bulan dengan error rate di bawah 0,1%",
          "Meningkatkan waktu muat halaman utama 35% (dari 2,8 detik menjadi 1,8 detik) lewat code splitting dan optimasi query database",
          "Memimpin squad 5 engineer dalam delivery 4 fitur utama per kuartal sesuai roadmap produk",
          "Menaikkan test coverage modul pembayaran dari 45% menjadi 82% dengan unit test dan dokumentasi API",
          "Berkoordinasi dengan tim UX menjalankan A/B test 3 varian onboarding yang menaikkan konversi registrasi 18%",
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
          "Ikut membangun MVP dari nol hingga diluncurkan ke 2.000 pengguna beta dalam 6 bulan",
          "Mengembangkan 8 endpoint REST API dan integrasi payment gateway untuk transaksi harian",
          "Menulis 40+ unit test untuk modul pembayaran yang mengurangi bug produksi 30%",
          "Membantu setup CI/CD sederhana sehingga waktu deploy turun dari 2 jam menjadi 20 menit",
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
        highlights: [],
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
        "Mahasiswa S1 Teknik Informatika semester 6 dengan IPK 3,65 dan pengalaman magang frontend 3 bulan di startup teknologi. Terbiasa React, JavaScript, HTML/CSS, Git, Figma, dan workflow agile (daily stand-up, code review, sprint). Aktif di UKM Programming dan pernah mengadakan workshop web dasar untuk 40 peserta kampus. Mencari magang pengembangan web untuk memperdalam skill membangun produk nyata dan belajar langsung dari tim profesional.",
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
          "Membantu tim membangun 2 fitur dashboard admin yang dipakai 40+ staf operasional setiap hari",
          "Memperbaiki 18 bug UI pada komponen React dan meningkatkan konsistensi desain dengan design system internal",
          "Menulis 25+ unit test untuk komponen form dan tabel data, mengurangi regresi saat rilis",
          "Ikut daily stand-up, sprint planning, dan code review selama 3 bulan magang",
          "Melakukan riset singkat ke 8 pengguna internal; hasilnya dipakai untuk perbaikan alur laporan bulanan",
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
        highlights: [],
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
        "Pelajar SMA kelas 12 IPA dengan minat teknologi, desain digital, dan robotika. Aktif di OSIS divisi IT dan ekstrakurikuler robotik; berpengalaman mengelola media sosial sekolah, membuat konten visual, dan membangun website sederhana untuk acara sekolah. Terbiasa kerja tim, presentasi di depan kelas, dan belajar tools baru dengan cepat. Mencari program magang atau kesempatan part-time di bidang IT untuk mengembangkan skill praktis sebelum melanjutkan ke perguruan tinggi.",
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
          "Membantu instalasi OS, backup data, dan troubleshooting ringan untuk 10+ pelanggan per hari",
          "Menyusun checklist perbaatan komputer yang mempercepat proses diagnosa kerusakan 20%",
          "Belajar komunikasi layanan pelanggan dan penanganan keluhan secara profesional",
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
        highlights: [],
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
          "Mengelola media sosial OSIS (Instagram & TikTok) dengan 8 posting/minggu, engagement naik 60% dalam 6 bulan",
          "Membuat 8 poster digital dan 3 video promosi singkat untuk 5 event sekolah (300+ peserta total)",
          "Mengkoordinasi tim 4 orang untuk dokumentasi dan publikasi acara peringatan hari besar sekolah",
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
          "Juara 2 lomba robotik tingkat kota bersama tim 4 orang dari 15 tim peserta",
          "Merancang prototipe line follower dan melakukan 20+ iterasi tuning sensor sebelum kompetisi",
          "Mempresentasikan desain robot dan strategi lintasan di depan juri dan 80+ peserta lomba",
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