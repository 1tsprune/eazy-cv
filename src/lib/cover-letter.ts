import type { CoverLetterData, Language, ResumeData } from "./types";

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

export function buildCoverLetterDraft(
  data: ResumeData,
  cover: CoverLetterData,
  lang: Language,
): string {
  const name = data.personal.fullName || (lang === "id" ? "Saya" : "I");
  const title = data.personal.title;
  const company = cover.company || (lang === "id" ? "[Nama Perusahaan]" : "[Company Name]");
  const position =
    cover.position || (lang === "id" ? "[Posisi]" : "[Position]");
  const skills = data.technicalSkills.slice(0, 5).join(", ");
  const summary = data.personal.summary.trim();
  const exp = data.experiences[0];

  if (lang === "id") {
    return [
      `Saya tertarik melamar posisi ${position} di ${company}.`,
      title
        ? `Sebagai ${title}, saya percaya pengalaman dan keahlian saya selaras dengan kebutuhan peran ini.`
        : `Saya percaya latar belakang saya selaras dengan kebutuhan peran ini.`,
      summary
        ? summary
        : exp
          ? `Di ${exp.company || "peran sebelumnya"}, saya bertanggung jawab sebagai ${exp.position || "kontributor tim"} dan berkontribusi pada hasil kerja yang terukur.`
          : `Saya memiliki motivasi tinggi untuk berkontribusi dan terus berkembang di lingkungan kerja yang dinamis.`,
      skills
        ? `Keahlian utama saya meliputi ${skills}.`
        : null,
      `Saya berharap dapat berdiskusi lebih lanjut mengenai bagaimana saya dapat memberikan kontribusi untuk ${company}.`,
    ]
      .filter(Boolean)
      .join("\n\n");
  }

  return [
    `I am writing to express my interest in the ${position} role at ${company}.`,
    title
      ? `As a ${title}, I believe my experience aligns well with the requirements of this position.`
      : `I believe my background aligns well with the requirements of this position.`,
    summary
      ? summary
      : exp
        ? `At ${exp.company || "my previous role"}, I worked as ${exp.position || "a team contributor"} and delivered measurable results.`
        : `I am highly motivated to contribute and grow in a dynamic work environment.`,
    skills ? `My core skills include ${skills}.` : null,
    `I would welcome the opportunity to discuss how I can contribute to ${company}.`,
  ]
    .filter(Boolean)
    .join("\n\n");
}