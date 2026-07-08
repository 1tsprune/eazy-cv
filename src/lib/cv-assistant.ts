import type { CvProfile, Language, ResumeData } from "./types";

export type AssistantCheck = {
  id: string;
  group?: string;
  label: string;
  tip: string;
  passed: boolean;
  weight: number;
  scrollTarget: string;
  optional?: boolean;
};

export type AssistantCategory = {
  id: string;
  title: string;
  description: string;
  checks: AssistantCheck[];
  passedCount: number;
  totalCount: number;
  categoryScore: number;
};

export type CvAssistantResult = {
  score: number;
  categories: AssistantCategory[];
  totalPassed: number;
  totalChecks: number;
  displayName: string;
};

const ACTION_VERBS =
  /^(created|developed|organized|managed|led|built|designed|implemented|improved|increased|reduced|achieved|launched|coordinated|analyzed|optimized|delivered|established|spearheaded|streamlined|mentored|conducted|facilitated|supervised|automated|mengembangkan|membangun|mengelola|memimpin|meningkatkan|mengurangi|mencapai|meluncurkan|mengkoordinasikan|menganalisis|menyusun|merancang|mengimplementasikan|membuat|menyelesaikan|mengorganisir)/i;

const QUANT_PATTERN = /\d|%|\+|rp\.?|juta|ribu|million|billion|\bk\b|\bm\b/i;

/** Per-check weights — total = 100 */
const CHECK_WEIGHTS: Record<string, number> = {
  name: 5,
  description: 5,
  photo: 3,
  linkedin: 4,
  portfolio: 3,
  eduDates: 5,
  expQuant: 10,
  orgQuant: 8,
  minWords: 7,
  maxWords: 6,
  bulletLength: 8,
  actionVerb: 8,
  actionImpact: 7,
  expBullets: 12,
  orgBullets: 9,
};

type CheckDef = {
  id: string;
  groupKey?: string;
  weight: number;
  optional?: boolean;
  scrollTarget: string;
};

const CHECK_DEFS: CheckDef[] = [
  { id: "name", groupKey: "personal", weight: 5, scrollTarget: "cv-section-personal" },
  { id: "description", groupKey: "personal", weight: 5, scrollTarget: "cv-section-personal" },
  { id: "photo", groupKey: "personal", weight: 3, optional: true, scrollTarget: "cv-section-personal" },
  { id: "linkedin", groupKey: "personal", weight: 4, scrollTarget: "cv-section-personal" },
  { id: "portfolio", groupKey: "personal", weight: 3, scrollTarget: "cv-section-personal" },
  { id: "eduDates", groupKey: "education", weight: 5, scrollTarget: "cv-section-education" },
  { id: "expQuant", weight: 10, scrollTarget: "cv-section-experience" },
  { id: "orgQuant", weight: 8, scrollTarget: "cv-section-organizations" },
  { id: "minWords", weight: 7, scrollTarget: "cv-section-personal" },
  { id: "maxWords", weight: 6, scrollTarget: "cv-section-personal" },
  { id: "bulletLength", weight: 8, scrollTarget: "cv-section-experience" },
  { id: "actionVerb", weight: 8, scrollTarget: "cv-section-experience" },
  { id: "actionImpact", weight: 7, scrollTarget: "cv-section-experience" },
  { id: "expBullets", weight: 12, scrollTarget: "cv-section-experience" },
  { id: "orgBullets", weight: 9, scrollTarget: "cv-section-organizations" },
];

type CopyBundle = {
  assistantTitle: string;
  tipsLabel: string;
  goodJob: (name: string) => string;
  scoreLine: (score: number) => string;
  intro: string;
  tapToFix: string;
  optional: string;
  allDone: string;
  checklistFooter: (passed: number, total: number) => string;
  groups: Record<string, string>;
  categories: Record<
    string,
    {
      title: string;
      description: string;
      checks: Record<string, { label: string; tip: string }>;
    }
  >;
};

const copy: Record<Language, CopyBundle> = {
  id: {
    assistantTitle: "Asisten CV",
    tipsLabel: "TIPS",
    goodJob: (name) => `Kerja Bagus ${name}!`,
    scoreLine: (score) => `Skor CV Kamu ${score}%.`,
    intro:
      "Ayo lihat bagaimana kamu bisa meningkatkan skor dengan menyelesaikan checklist panduan ini!",
    tapToFix: "Ketuk untuk perbaiki",
    optional: "Opsional",
    allDone: "Semua checklist selesai",
    checklistFooter: (passed, total) => `${passed}/${total} checklist selesai`,
    groups: {
      personal: "Informasi Pribadi",
      education: "Pendidikan",
    },
    categories: {
      cvInfo: {
        title: "Informasi CV",
        description:
          "CV yang lengkap memberi HR informasi yang perlu mereka ketahui tentang Kamu",
        checks: {
          name: {
            label: "Nama",
            tip: "Sertakan nama yang biasa kamu gunakan (misalnya nama di LinkedIn)",
          },
          description: {
            label: "Deskripsi",
            tip: "Berikan deskripsi singkat tentang diri kamu (maksimal 3 baris)",
          },
          photo: {
            label: "Foto Profil",
            tip: "Opsional, tetapi direkomendasikan untuk membangun kepercayaan",
          },
          linkedin: {
            label: "LinkedIn",
            tip: "Bagikan profil LinkedIn kamu untuk menunjukkan jaringan profesional kamu",
          },
          portfolio: {
            label: "Portfolio/Website",
            tip: "Sertakan jika relevan dengan lamaran pekerjaan",
          },
          eduDates: {
            label: "Tanggal kelulusan",
            tip: "Cantumkan tanggal kelulusan Kamu dengan benar sehingga HR mudah merekrut Kamu sesuai posisi yang cocok",
          },
        },
      },
      quantitative: {
        title: "Dampak Kuantitatif",
        description:
          "Dukung pengalaman kamu dengan bukti dampak menggunakan angka",
        checks: {
          expQuant: {
            label: "Pengalaman Profesional",
            tip: "Kuantifikasikan dampak dari pencapaian kamu",
          },
          orgQuant: {
            label: "Pengalaman Organisasi",
            tip: "Gunakan angka untuk menunjukkan dampak dari kontribusi kamu",
          },
        },
      },
      length: {
        title: "Panjang CV",
        description:
          "Satu halaman adalah panjang yang ideal untuk magang dan pekerjaan penuh waktu (200–500 kata)",
        checks: {
          minWords: {
            label: "Tetap ringkas",
            tip: "Tetap ringkas—pastikan minimal 200 kata",
          },
          maxWords: {
            label: "Mudah dibaca",
            tip: "Buat resume kamu mudah dibaca—jaga agar tetap dalam batas 500 kata",
          },
        },
      },
      bullets: {
        title: "Keringkasan Bullet Point",
        description:
          "Pastikan setiap poin memberikan informasi yang kuat dan detail tentang pengalaman kamu",
        checks: {
          bulletLength: {
            label: "Panjang bullet",
            tip: "Ringkas setiap bullet point dalam 10–20 kata untuk menonjolkan pencapaian dan kontribusi kamu",
          },
          actionVerb: {
            label: "Kata kerja aksi",
            tip: "Mulai setiap poin dengan kata kerja aksi yang kuat (misalnya: Created, Developed, Organized)",
          },
          actionImpact: {
            label: "Action + impact",
            tip: "Gunakan kerangka action + impact untuk memberikan deskripsi detail tentang pencapaian kamu di setiap poin",
          },
        },
      },
      completeness: {
        title: "Kelengkapan Bagian",
        description:
          "Jelaskan tugas yang telah kamu selesaikan dan dampaknya",
        checks: {
          expBullets: {
            label: "Pengalaman Profesional",
            tip: "Sertakan minimal 3 poin untuk memberikan konten yang cukup dalam resume kamu",
          },
          orgBullets: {
            label: "Pengalaman Organisasi",
            tip: "Sertakan minimal 3 poin untuk memberikan konten yang cukup dalam resume kamu",
          },
        },
      },
    },
  },
  en: {
    assistantTitle: "CV Assistant",
    tipsLabel: "TIPS",
    goodJob: (name) => `Great job, ${name}!`,
    scoreLine: (score) => `Your CV score is ${score}%.`,
    intro:
      "See how you can improve your score by completing this guided checklist!",
    tapToFix: "Tap to fix",
    optional: "Optional",
    allDone: "All checklist items done",
    checklistFooter: (passed, total) => `${passed}/${total} checklist items done`,
    groups: {
      personal: "Personal Information",
      education: "Education",
    },
    categories: {
      cvInfo: {
        title: "CV Information",
        description:
          "A complete CV gives recruiters the information they need about you",
        checks: {
          name: {
            label: "Name",
            tip: "Use the name you go by professionally (e.g. your LinkedIn name)",
          },
          description: {
            label: "Summary",
            tip: "Write a short summary about yourself (max 3 lines)",
          },
          photo: {
            label: "Profile photo",
            tip: "Optional but recommended to build trust",
          },
          linkedin: {
            label: "LinkedIn",
            tip: "Share your LinkedIn profile to show your professional network",
          },
          portfolio: {
            label: "Portfolio/Website",
            tip: "Include if relevant to the job you're applying for",
          },
          eduDates: {
            label: "Graduation dates",
            tip: "List graduation dates correctly so recruiters can match you to the right role",
          },
        },
      },
      quantitative: {
        title: "Quantitative Impact",
        description: "Support your experience with numbers that show impact",
        checks: {
          expQuant: {
            label: "Professional Experience",
            tip: "Quantify the impact of your achievements",
          },
          orgQuant: {
            label: "Organization Experience",
            tip: "Use numbers to show the impact of your contributions",
          },
        },
      },
      length: {
        title: "CV Length",
        description:
          "One page is ideal for internships and full-time roles (200–500 words)",
        checks: {
          minWords: {
            label: "Stay substantial",
            tip: "Aim for at least 200 words",
          },
          maxWords: {
            label: "Stay readable",
            tip: "Keep it within 500 words",
          },
        },
      },
      bullets: {
        title: "Bullet Point Quality",
        description:
          "Make each bullet strong and detailed about your experience",
        checks: {
          bulletLength: {
            label: "Ideal bullet length",
            tip: "Keep each bullet to 10–20 words highlighting achievements",
          },
          actionVerb: {
            label: "Action verbs",
            tip: "Start bullets with strong action verbs (Created, Developed, Organized)",
          },
          actionImpact: {
            label: "Action + impact",
            tip: "Use action + impact framing to describe each achievement",
          },
        },
      },
      completeness: {
        title: "Section Completeness",
        description: "Explain tasks completed and their impact",
        checks: {
          expBullets: {
            label: "Professional Experience",
            tip: "Include at least 3 bullets for enough resume content",
          },
          orgBullets: {
            label: "Organization Experience",
            tip: "Include at least 3 bullets for enough resume content",
          },
        },
      },
    },
  },
};

const CATEGORY_CHECKS: Record<string, string[]> = {
  cvInfo: ["name", "description", "photo", "linkedin", "portfolio", "eduDates"],
  quantitative: ["expQuant", "orgQuant"],
  length: ["minWords", "maxWords"],
  bullets: ["bulletLength", "actionVerb", "actionImpact"],
  completeness: ["expBullets", "orgBullets"],
};

function countWords(data: ResumeData): number {
  const parts: string[] = [
    data.personal.summary,
    ...data.experiences.flatMap((e) => [
      e.position,
      e.company,
      e.description,
      ...e.highlights,
    ]),
    ...data.educations.flatMap((e) => [
      e.degree,
      e.institution,
      e.field,
      ...e.highlights,
    ]),
    ...data.organizations.flatMap((o) => [o.role, o.name, ...o.highlights]),
    ...data.projects.flatMap((p) => [p.name, p.description]),
    ...data.technicalSkills,
    ...data.softSkills,
  ];
  const text = parts.join(" ").trim();
  if (!text) return 0;
  return text.split(/\s+/).filter(Boolean).length;
}

function bulletWordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function hasQuantifiedText(text: string): boolean {
  return QUANT_PATTERN.test(text);
}

function startsWithActionVerb(text: string): boolean {
  const first = text.trim().split(/\s+/)[0] ?? "";
  return ACTION_VERBS.test(first);
}

function hasActionImpactPattern(text: string): boolean {
  const t = text.trim();
  if (t.length < 12) return false;
  return startsWithActionVerb(t) && (hasQuantifiedText(t) || t.length >= 18);
}

function allBullets(data: ResumeData): string[] {
  return [
    ...data.experiences.flatMap((e) => e.highlights),
    ...data.organizations.flatMap((o) => o.highlights),
  ].filter((b) => b.trim().length > 0);
}

function summaryLineCount(summary: string): number {
  return summary.split(/\r?\n/).filter((l) => l.trim().length > 0).length;
}

function evaluateChecks(
  data: ResumeData,
  config: { showPhoto: boolean },
): Record<string, boolean> {
  const words = countWords(data);
  const bullets = allBullets(data);
  const summary = data.personal.summary.trim();

  const expHasQuant =
    data.experiences.length > 0 &&
    data.experiences.some(
      (e) =>
        hasQuantifiedText(e.description) ||
        e.highlights.some(hasQuantifiedText),
    );

  const orgHasQuant =
    data.organizations.length > 0 &&
    data.organizations.some((o) => o.highlights.some(hasQuantifiedText));

  const bulletLengthOk =
    bullets.length > 0 &&
    bullets.every((b) => {
      const n = bulletWordCount(b);
      return n >= 10 && n <= 20;
    });

  const actionVerbOk =
    bullets.length > 0 && bullets.every(startsWithActionVerb);

  const actionImpactOk =
    bullets.length > 0 && bullets.every(hasActionImpactPattern);

  const maxExpBullets = data.experiences.reduce(
    (m, e) => Math.max(m, e.highlights.filter((h) => h.trim()).length),
    0,
  );
  const maxOrgBullets = data.organizations.reduce(
    (m, o) => Math.max(m, o.highlights.filter((h) => h.trim()).length),
    0,
  );

  const hasPortfolio = Boolean(
    data.personal.website.trim() ||
      data.personal.github.trim() ||
      /portfolio|\.dev|\.me/i.test(data.personal.website),
  );

  return {
    name: data.personal.fullName.trim().length >= 2,
    description:
      summary.length >= 40 &&
      summaryLineCount(summary) <= 3 &&
      summary.length <= 400,
    photo: Boolean(data.personal.photo) && config.showPhoto,
    linkedin: /linkedin\.com/i.test(data.personal.linkedin),
    portfolio: hasPortfolio,
    eduDates:
      data.educations.length > 0 &&
      data.educations.every((e) => e.endDate.trim().length >= 4),
    expQuant: expHasQuant,
    orgQuant: orgHasQuant,
    minWords: words >= 200,
    maxWords: words > 0 && words <= 500,
    bulletLength: bulletLengthOk,
    actionVerb: actionVerbOk,
    actionImpact: actionImpactOk,
    expBullets: data.experiences.length > 0 && maxExpBullets >= 3,
    orgBullets: data.organizations.length > 0 && maxOrgBullets >= 3,
  };
}

export function getAssistantCopy(lang: Language) {
  return copy[lang];
}

export function calculateCvAssistant(
  data: ResumeData,
  lang: Language,
  profile: CvProfile = "professional",
  config?: { showPhoto: boolean },
): CvAssistantResult {
  const t = copy[lang];
  const showPhoto = config?.showPhoto ?? true;
  const passedMap = evaluateChecks(data, { showPhoto });

  let earnedWeight = 0;
  let totalWeight = 0;

  const categories: AssistantCategory[] = Object.entries(CATEGORY_CHECKS).map(
    ([catId, checkIds]) => {
      const catCopy = t.categories[catId];
      const checks: AssistantCheck[] = checkIds.map((checkId) => {
        const def = CHECK_DEFS.find((d) => d.id === checkId)!;
        const checkCopy = catCopy.checks[checkId];
        const weight = CHECK_WEIGHTS[checkId] ?? def.weight;
        const passed = passedMap[checkId] ?? false;

        totalWeight += weight;
        if (passed) {
          earnedWeight += weight;
        } else if (def.optional) {
          earnedWeight += weight * 0.5;
        }

        return {
          id: checkId,
          group: def.groupKey ? t.groups[def.groupKey] : undefined,
          label: checkCopy.label,
          tip: checkCopy.tip,
          passed,
          weight,
          scrollTarget: def.scrollTarget,
          optional: def.optional,
        };
      });

      const passedCount = checks.filter((c) => c.passed).length;
      const totalCount = checks.length;
      const catWeight = checks.reduce((s, c) => s + c.weight, 0);
      const catEarned = checks
        .filter((c) => c.passed)
        .reduce((s, c) => s + c.weight, 0);

      return {
        id: catId,
        title: catCopy.title,
        description: catCopy.description,
        checks,
        passedCount,
        totalCount,
        categoryScore:
          catWeight > 0 ? Math.round((catEarned / catWeight) * 100) : 0,
      };
    },
  );

  const score =
    totalWeight > 0 ? Math.round((earnedWeight / totalWeight) * 100) : 0;

  const totalChecks = categories.reduce((s, c) => s + c.totalCount, 0);
  const totalPassed = categories.reduce((s, c) => s + c.passedCount, 0);

  const rawName = data.personal.fullName.trim();
  const displayName =
    rawName.split(/\s+/)[0] || (lang === "id" ? "kamu" : "there");

  return {
    score: Math.min(100, Math.max(0, score)),
    categories,
    totalPassed,
    totalChecks,
    displayName,
  };
}

export function getAssistantScrollTarget(checkId: string): string {
  return (
    CHECK_DEFS.find((d) => d.id === checkId)?.scrollTarget ??
    "cv-section-personal"
  );
}