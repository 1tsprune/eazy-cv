import { createId } from "./default-data";
import { defaultCoverLetter } from "./cover-letter";
import { DEFAULT_TYPOGRAPHY } from "./typography";
import type { ResumeState } from "./types";

/** Data fiktif untuk demo — bukan orang nyata */
export const sampleResumeState: ResumeState = {
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
    softSkills: [
      "Komunikasi",
      "Problem solving",
      "Kerja tim",
    ],
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
  config: {
    language: "id",
    exportMode: "modern",
    template: "elegant",
    colorTheme: "indigo",
    showPhoto: false,
    ...DEFAULT_TYPOGRAPHY,
    sectionOrder: [
      "experience",
      "education",
      "skills",
      "projects",
      "certifications",
      "languages",
      "custom",
    ],
  },
  coverLetter: {
    ...defaultCoverLetter("id"),
    company: "Acme Digital",
    position: "Software Engineer",
    body:
      "Saya tertarik melamar posisi Software Engineer di Acme Digital. Sebagai engineer berpengalaman, saya percaya keahlian teknis dan kolaborasi tim saya selaras dengan kebutuhan peran ini.\n\nSaya berharap dapat berdiskusi lebih lanjut mengenai kontribusi saya untuk tim Anda. Terima kasih atas waktu dan pertimbangannya.",
  },
};