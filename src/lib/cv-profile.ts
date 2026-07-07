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
  highlightsHint: string;
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
        "Contoh: Meningkatkan performa halaman utama 35% lewat optimasi query — tekan Enter",
      highlightsHint:
        "Isi 3–5 poin pencapaian kerja: apa yang kamu lakukan, hasilnya (angka/%), teknologi atau tim. Hindari kalimat kosong tanpa bukti.\n\nContoh poin:\n• Merancang modul checkout untuk 12.000+ transaksi/bulan, error rate < 0,1%\n• Memimpin squad 5 engineer, deliver 4 fitur utama per kuartal\n• Menurunkan waktu muat halaman 35% (2,8s → 1,8s) dengan code splitting\n• Menaikkan test coverage modul pembayaran dari 45% menjadi 82%",
      summaryPlaceholder:
        "Tulis 2–4 kalimat: siapa kamu, keahlian utama, pengalaman singkat (pakai angka), dan tujuan karir.\n\nContoh:\nSoftware Engineer dengan 5+ tahun membangun aplikasi web untuk 50.000+ pengguna aktif. Terampil React, TypeScript, Node.js, dan arsitektur REST API. Pernah memimpin tim kecil dan mengoptimalkan performa sistem hingga 35%. Mencari peran full-time di tim produk yang berdampak bagi pengguna.",
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
        "Contoh: Membantu tim rilis 2 fitur dashboard dipakai 500+ user internal — tekan Enter",
      highlightsHint:
        "Tulis 3–5 poin kegiatan magang: tugas konkret, hasil yang bisa diukur, skill yang dipelajari. Boleh dari magang, proyek kampus, atau freelance.\n\nContoh poin:\n• Membangun 2 fitur admin dashboard yang dipakai 40+ staf operasional setiap hari\n• Memperbaiki 18 bug UI dan menulis 25+ unit test untuk komponen React\n• Ikut daily stand-up, code review, dan sprint planning selama 3 bulan\n• Melakukan riset 12 user untuk proyek akhir, insight dipakai tim produk",
      summaryPlaceholder:
        "Tulis 2–4 kalimat: status kuliah, minat bidang, pengalaman magang/proyek, dan posisi magang yang dicari.\n\nContoh:\nMahasiswa S1 Teknik Informatika semester 6 dengan IPK 3,65 dan pengalaman magang frontend 3 bulan di startup teknologi. Terbiasa React, JavaScript, Git, dan kolaborasi agile. Aktif di UKM programming dan pernah memimpin workshop untuk 40 peserta. Mencari magang pengembangan web untuk memperdalam skill produk nyata.",
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
        "Contoh: Juara 2 lomba robotik kota, koordinasi 5 event sekolah 300+ peserta — tekan Enter",
      highlightsHint:
        "Isi 3–5 poin kegiatan: organisasi sekolah/kampus, lomba, part-time, proyek tim. Pakai angka supaya lebih meyakinkan.\n\nContoh poin:\n• Juara 2 lomba robotik tingkat kota dengan tim 4 orang\n• Mengelola media sosial OSIS, engagement posting naik 60% dalam 6 bulan\n• Membuat 8 poster digital dan 3 video promosi untuk acara sekolah\n• Part-time di bengkel komputer, melayani 10+ pelanggan per hari",
      summaryPlaceholder:
        "Tulis 2–4 kalimat: jenjang pendidikan, minat/jurusan, kegiatan extracurricular, dan tujuan (magang/kuliah/kerja part-time).\n\nContoh:\nPelajar SMA kelas 12 IPA dengan minat teknologi dan desain digital. Aktif di OSIS divisi IT dan ekstrakurikuler robotik, berpengalaman membuat konten visual dan website sederhana untuk acara sekolah. Terbiasa kerja tim, presentasi, dan belajar tools baru dengan cepat. Mencari program magang atau kesempatan part-time di bidang IT.",
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
        "e.g. Improved homepage load time 35% via query optimization — press Enter",
      highlightsHint:
        "Add 3–5 concrete bullets: what you did, measurable outcome (numbers/%), tech or team involved.\n\nExamples:\n• Built checkout module handling 12,000+ monthly transactions, <0.1% error rate\n• Led a squad of 5 engineers, shipped 4 major features per quarter\n• Cut page load time 35% (2.8s → 1.8s) with code splitting\n• Raised payment module test coverage from 45% to 82%",
      summaryPlaceholder:
        "Write 2–4 sentences: who you are, core skills, brief experience (use numbers), career goal.\n\nExample:\nSoftware Engineer with 5+ years building web apps for 50,000+ active users. Skilled in React, TypeScript, Node.js, and REST APIs. Led small teams and improved system performance by 35%. Seeking a full-time product role with real user impact.",
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
        "e.g. Shipped 2 admin dashboard features used by 500+ internal users — press Enter",
      highlightsHint:
        "List 3–5 internship bullets: concrete tasks, measurable results, skills learned.\n\nExamples:\n• Built 2 admin dashboard features used daily by 40+ operations staff\n• Fixed 18 UI bugs and wrote 25+ unit tests for React components\n• Joined daily stand-ups, code reviews, and sprint planning for 3 months\n• Interviewed 12 users for capstone project; insights adopted by product team",
      summaryPlaceholder:
        "Write 2–4 sentences: study status, field of interest, internship/project experience, target role.\n\nExample:\n6th-semester CS undergraduate (GPA 3.65) with a 3-month frontend internship at a tech startup. Comfortable with React, JavaScript, Git, and agile teamwork. Active in programming club and led a workshop for 40 participants. Seeking a web development internship to grow on real products.",
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
        "e.g. 2nd place city robotics contest, coordinated 5 school events (300+ attendees) — press Enter",
      highlightsHint:
        "Add 3–5 bullets: clubs, competitions, part-time work, team projects. Use numbers when possible.\n\nExamples:\n• 2nd place in city-level robotics competition with a team of 4\n• Managed school council social media; post engagement up 60% in 6 months\n• Designed 8 digital posters and 3 promo videos for school events\n• Part-time computer shop helper, served 10+ customers per day",
      summaryPlaceholder:
        "Write 2–4 sentences: education level, interests, extracurriculars, goal (internship/part-time/college).\n\nExample:\nGrade 12 STEM student interested in technology and digital design. Active in student council IT division and robotics club; experienced with visual content and simple event websites. Strong teamwork and presentation skills. Looking for an IT internship or part-time opportunity.",
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