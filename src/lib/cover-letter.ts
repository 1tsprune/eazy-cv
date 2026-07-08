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
    recipient: lang === "id" ? "Hiring Manager" : "Hiring Manager",
    company: "",
    position: "",
    body: "",
  };
}

function eduStatusLine(
  data: ResumeData,
  lang: Language,
): string | null {
  const edu = data.educations[0];
  if (!edu) return null;
  const field = edu.field ? ` ${edu.field}` : "";
  if (lang === "id") {
    const inst = edu.institution ? ` di ${edu.institution}` : "";
    return `Saat ini saya menempuh ${edu.degree || "pendidikan"}${field}${inst}.`;
  }
  const inst = edu.institution ? ` at ${edu.institution}` : "";
  return `I am currently pursuing ${edu.degree || "my studies"}${field}${inst}.`;
}

function experienceEvidence(
  data: ResumeData,
  lang: Language,
): string | null {
  const exp = data.experiences[0];
  if (!exp) return null;
  const highlight = exp.highlights.find((h) => h.trim());
  if (lang === "id") {
    if (highlight) {
      return `Di ${exp.company || "pengalaman terakhir saya"} sebagai ${exp.position || "kontributor tim"}, salah satu kontribusi saya adalah ${highlight.charAt(0).toLowerCase()}${highlight.slice(1)}.`;
    }
    return `Di ${exp.company || "peran sebelumnya"}, saya berperan sebagai ${exp.position || "kontributor tim"} dan terbiasa bekerja dengan target yang terukur.`;
  }
  if (highlight) {
    return `In my recent role at ${exp.company || "my previous organization"} as ${exp.position || "a team contributor"}, one result I delivered was ${highlight.charAt(0).toLowerCase()}${highlight.slice(1)}.`;
  }
  return `In my previous role at ${exp.company || "my last organization"}, I worked as ${exp.position || "a team contributor"} with a focus on measurable outcomes.`;
}

function skillsLine(skills: string, lang: Language): string | null {
  if (!skills) return null;
  return lang === "id"
    ? `Keahlian utama saya meliputi ${skills}.`
    : `My core skills include ${skills}.`;
}

function buildProfessionalDraft(
  data: ResumeData,
  cover: CoverLetterData,
  lang: Language,
): string {
  const company =
    cover.company || (lang === "id" ? "[Nama Perusahaan]" : "[Company Name]");
  const position =
    cover.position || (lang === "id" ? "[Posisi]" : "[Position]");
  const title = data.personal.title.trim();
  const summary = data.personal.summary.trim();
  const skills = data.technicalSkills.slice(0, 5).join(", ");

  if (lang === "id") {
    const intro = title
      ? `Saya menulis untuk melamar posisi ${position} di ${company}. Sebagai ${title}, saya percaya pengalaman dan keahlian saya selaras dengan kebutuhan peran ini.`
      : `Saya menulis untuk melamar posisi ${position} di ${company}. Saya percaya latar belakang profesional saya selaras dengan kebutuhan peran ini.`;

    return [
      intro,
      summary || experienceEvidence(data, lang),
      skillsLine(skills, lang),
      `Saya berharap dapat berdiskusi lebih lanjut mengenai bagaimana saya dapat memberikan kontribusi untuk ${company}. Terima kasih atas waktu dan pertimbangan Bapak/Ibu.`,
    ]
      .filter(Boolean)
      .join("\n\n");
  }

  const intro = title
    ? `I am writing to apply for the ${position} role at ${company}. As a ${title}, I believe my experience and skills align well with what this role requires.`
    : `I am writing to apply for the ${position} role at ${company}. I believe my professional background aligns well with what this role requires.`;

  return [
    intro,
    summary || experienceEvidence(data, lang),
    skillsLine(skills, lang),
    `I would welcome the opportunity to discuss how I can contribute to ${company}. Thank you for your time and consideration.`,
  ]
    .filter(Boolean)
    .join("\n\n");
}

function buildInternshipDraft(
  data: ResumeData,
  cover: CoverLetterData,
  lang: Language,
): string {
  const company =
    cover.company || (lang === "id" ? "[Nama Perusahaan]" : "[Company Name]");
  const position =
    cover.position || (lang === "id" ? "[Posisi Magang]" : "[Internship Role]");
  const title = data.personal.title.trim();
  const summary = data.personal.summary.trim();
  const skills = data.technicalSkills.slice(0, 5).join(", ");
  const status = title
    ? lang === "id"
      ? `Saat ini saya ${title}.`
      : `I am currently a ${title}.`
    : eduStatusLine(data, lang);

  if (lang === "id") {
    const intro = `Saya mengajukan lamaran magang untuk posisi ${position} di ${company}.${status ? ` ${status}` : ""} Saya ingin memperdalam pengalaman praktis sambil memberikan kontribusi nyata bagi tim.`;

    return [
      intro,
      summary || experienceEvidence(data, lang),
      skillsLine(skills, lang),
      `Saya antusias untuk belajar dan berkontribusi di ${company}, dan berharap dapat berdiskusi lebih lanjut mengenai kesempatan ini. Terima kasih atas waktu Bapak/Ibu.`,
    ]
      .filter(Boolean)
      .join("\n\n");
  }

  const intro = `I am applying for the ${position} internship at ${company}.${status ? ` ${status}` : ""} I am eager to gain hands-on experience while contributing meaningfully to your team.`;

  return [
    intro,
    summary || experienceEvidence(data, lang),
    skillsLine(skills, lang),
    `I am excited to learn and contribute at ${company}, and I would welcome the chance to discuss this opportunity further. Thank you for your time.`,
  ]
    .filter(Boolean)
    .join("\n\n");
}

function buildStudentDraft(
  data: ResumeData,
  cover: CoverLetterData,
  lang: Language,
): string {
  const company =
    cover.company || (lang === "id" ? "[Nama Perusahaan]" : "[Organization]");
  const position =
    cover.position || (lang === "id" ? "[Posisi/Program]" : "[Role/Program]");
  const title = data.personal.title.trim();
  const summary = data.personal.summary.trim();
  const skills = data.technicalSkills.slice(0, 5).join(", ");
  const org = data.organizations[0];
  const orgLine =
    org && lang === "id"
      ? `Saya aktif di ${org.name}${org.role ? ` sebagai ${org.role}` : ""} dan terbiasa bekerja dalam tim.`
      : org
        ? `I am active in ${org.name}${org.role ? ` as ${org.role}` : ""} and comfortable collaborating in a team setting.`
        : null;

  if (lang === "id") {
    const intro = title
      ? `Saya tertarik pada kesempatan ${position} di ${company}. Sebagai ${title}, saya ingin mengembangkan kemampuan praktis sambil memberikan kontribusi.`
      : `Saya tertarik pada kesempatan ${position} di ${company}, dan ingin mengembangkan kemampuan praktis sambil memberikan kontribusi.`;

    return [
      intro,
      summary || orgLine || experienceEvidence(data, lang),
      skillsLine(skills, lang),
      `Saya berharap dapat belajar dan berkontribusi di ${company}. Terima kasih atas perhatian dan kesempatannya.`,
    ]
      .filter(Boolean)
      .join("\n\n");
  }

  const intro = title
    ? `I am interested in the ${position} opportunity at ${company}. As a ${title}, I hope to grow practical skills while contributing to your team.`
    : `I am interested in the ${position} opportunity at ${company}, and I hope to grow practical skills while contributing to your team.`;

  return [
    intro,
    summary || orgLine || experienceEvidence(data, lang),
    skillsLine(skills, lang),
    `I would appreciate the chance to learn and contribute at ${company}. Thank you for your consideration.`,
  ]
    .filter(Boolean)
    .join("\n\n");
}

export function buildCoverLetterDraft(
  data: ResumeData,
  cover: CoverLetterData,
  lang: Language,
  profile: CvProfile = "professional",
): string {
  if (profile === "internship") {
    return buildInternshipDraft(data, cover, lang);
  }
  if (profile === "student") {
    return buildStudentDraft(data, cover, lang);
  }
  return buildProfessionalDraft(data, cover, lang);
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