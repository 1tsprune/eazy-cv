import type {
  CoverLetterData,
  CvProfile,
  Language,
  ResumeData,
} from "./types";

export function formatLetterDate(lang: Language, date = new Date()): string {
  return date.toLocaleDateString(lang === "id" ? "id-ID" : "en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function defaultCoverLetter(lang: Language): CoverLetterData {
  return {
    date: formatLetterDate(lang),
    recipient: "Hiring Manager",
    company: "",
    position: "",
    body: "",
  };
}

/** Opening line, tuned per CV profile (kerja / magang / pelajar). */
function openingLine(
  lang: Language,
  profile: CvProfile,
  position: string,
  company: string,
): string {
  if (lang === "id") {
    if (profile === "internship") {
      return `Saya tertarik untuk mengikuti program magang sebagai ${position} di ${company}.`;
    }
    if (profile === "student") {
      return `Sebagai mahasiswa/lulusan baru, saya tertarik untuk melamar posisi ${position} di ${company}.`;
    }
    return `Saya tertarik untuk melamar posisi ${position} di ${company}.`;
  }
  if (profile === "internship") {
    return `I am writing to apply for the ${position} internship at ${company}.`;
  }
  if (profile === "student") {
    return `As a recent graduate, I am writing to apply for the ${position} role at ${company}.`;
  }
  return `I am writing to express my interest in the ${position} role at ${company}.`;
}

export function buildCoverLetterDraft(
  data: ResumeData,
  cover: CoverLetterData,
  lang: Language,
  profile: CvProfile = "professional",
): string {
  const title = data.personal.title;
  const company =
    cover.company || (lang === "id" ? "[Nama Perusahaan]" : "[Company Name]");
  const position =
    cover.position || (lang === "id" ? "[Posisi]" : "[Position]");
  const skills = data.technicalSkills.slice(0, 5).join(", ");
  const summary = data.personal.summary.trim();
  const exp = data.experiences[0];
  const edu = data.educations[0];

  if (lang === "id") {
    const framing =
      profile === "internship" || profile === "student"
        ? title
          ? `Sebagai ${title}, saya ingin menerapkan ilmu dan antusiasme saya untuk mendukung kebutuhan tim Anda.`
          : edu
            ? `Sebagai mahasiswa ${edu.degree || edu.field || "aktif"}, saya ingin menerapkan ilmu dan antusiasme saya untuk mendukung kebutuhan tim Anda.`
            : `Saya ingin menerapkan ilmu dan antusiasme saya untuk mendukung kebutuhan tim Anda.`
        : title
          ? `Sebagai ${title}, saya percaya pengalaman dan keahlian saya selaras dengan kebutuhan peran ini.`
          : `Saya percaya latar belakang saya selaras dengan kebutuhan peran ini.`;

    const closing =
      profile === "internship" || profile === "student"
        ? `Saya sangat antusias untuk belajar dan berkontribusi, serta berharap dapat berdiskusi lebih lanjut mengenai kesempatan ini di ${company}.`
        : `Saya berharap dapat berdiskusi lebih lanjut mengenai bagaimana saya dapat memberikan kontribusi untuk ${company}.`;

    return [
      openingLine(lang, profile, position, company),
      framing,
      summary
        ? summary
        : exp
          ? `Di ${exp.company || "peran sebelumnya"}, saya berperan sebagai ${exp.position || "kontributor tim"} dan berkontribusi pada hasil kerja yang terukur.`
          : `Saya memiliki motivasi tinggi untuk berkontribusi dan terus berkembang.`,
      skills ? `Keahlian utama saya meliputi ${skills}.` : null,
      closing,
    ]
      .filter(Boolean)
      .join("\n\n");
  }

  const framing =
    profile === "internship" || profile === "student"
      ? title
        ? `As a ${title}, I am eager to apply my knowledge and enthusiasm to support your team.`
        : `I am eager to apply my knowledge and enthusiasm to support your team.`
      : title
        ? `As a ${title}, I believe my experience aligns well with the requirements of this position.`
        : `I believe my background aligns well with the requirements of this position.`;

  const closing =
    profile === "internship" || profile === "student"
      ? `I am excited to learn and contribute, and I would welcome the opportunity to discuss this role at ${company}.`
      : `I would welcome the opportunity to discuss how I can contribute to ${company}.`;

  return [
    openingLine(lang, profile, position, company),
    framing,
    summary
      ? summary
      : exp
        ? `At ${exp.company || "my previous role"}, I worked as ${exp.position || "a team contributor"} and delivered measurable results.`
        : `I am highly motivated to contribute and grow.`,
    skills ? `My core skills include ${skills}.` : null,
    closing,
  ]
    .filter(Boolean)
    .join("\n\n");
}

/**
 * The body actually rendered in the preview/PDF. Auto-drafts from the CV +
 * profile until the user manually edits it (bodyCustom). Legacy saved letters
 * with typed text but no flag are treated as custom so nothing is overwritten.
 */
export function resolveCoverLetterBody(
  data: ResumeData,
  cover: CoverLetterData,
  lang: Language,
  profile: CvProfile = "professional",
): string {
  const isCustom = cover.bodyCustom ?? cover.body.trim() !== "";
  return isCustom
    ? cover.body
    : buildCoverLetterDraft(data, cover, lang, profile);
}
