import { createId } from "./default-data";
import type { ResumeData } from "./types";

function parseCsv(text: string): Record<string, string>[] {
  const lines = text.split(/\r?\n/).filter((l) => l.trim());
  if (lines.length < 2) return [];

  const headers = parseCsvLine(lines[0]);
  return lines.slice(1).map((line) => {
    const values = parseCsvLine(line);
    const row: Record<string, string> = {};
    headers.forEach((h, i) => {
      row[h.trim()] = (values[i] ?? "").trim();
    });
    return row;
  });
}

function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      inQuotes = !inQuotes;
    } else if (ch === "," && !inQuotes) {
      result.push(current);
      current = "";
    } else {
      current += ch;
    }
  }
  result.push(current);
  return result.map((s) => s.replace(/^"|"$/g, "").trim());
}

function pick(row: Record<string, string>, ...keys: string[]): string {
  for (const key of keys) {
    if (row[key]) return row[key];
  }
  return "";
}

function parseDateRange(raw: string): {
  startDate: string;
  endDate: string;
  current: boolean;
} {
  if (!raw) return { startDate: "", endDate: "", current: false };
  const isCurrent = /present|sekarang|current/i.test(raw);
  const parts = raw.split(/[-–—]/).map((p) => p.trim());
  return {
    startDate: parts[0] ?? "",
    endDate: isCurrent ? "" : (parts[1] ?? ""),
    current: isCurrent,
  };
}

export function parseLinkedInPaste(text: string): Partial<ResumeData> {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  const data: Partial<ResumeData> = {
    personal: {
      fullName: "",
      title: "",
      email: "",
      phone: "",
      location: "",
      website: "",
      linkedin: "",
      github: "",
      summary: "",
      photo: "",
    },
    experiences: [],
    educations: [],
    organizations: [],
    technicalSkills: [],
  };

  if (!lines.length) return data;

  const personal = data.personal!;
  personal.fullName = lines[0] ?? "";

  const headlineIdx = lines.findIndex((l) =>
    /^(about|tentang|summary|ringkasan|experience|pengalaman|education|pendidikan|skills|keahlian)$/i.test(
      l,
    ),
  );

  if (headlineIdx > 0) {
    personal.title = lines[1] ?? "";
    if (lines[2] && !lines[2].includes("@")) personal.location = lines[2];
  } else if (lines.length > 1) {
    personal.title = lines[1] ?? "";
  }

  const emailMatch = text.match(/[\w.+-]+@[\w-]+\.[\w.]+/);
  if (emailMatch) personal.email = emailMatch[0];

  const phoneMatch = text.match(/(\+?\d[\d\s\-()]{8,}\d)/);
  if (phoneMatch) personal.phone = phoneMatch[0].trim();

  const linkedinMatch = text.match(/linkedin\.com\/in\/[\w-]+/i);
  if (linkedinMatch) personal.linkedin = linkedinMatch[0];

  const sections = splitSections(text);
  if (sections.about) personal.summary = sections.about;

  data.experiences = sections.experiences.map((block) => {
    const blockLines = block.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
    const dates = blockLines.find((l) =>
      /\d{4}|present|sekarang|yr|bulan|month/i.test(l),
    );
    const { startDate, endDate, current } = parseDateRange(dates ?? "");

    return {
      id: createId(),
      company: blockLines[0] ?? "",
      position: blockLines[1] ?? "",
      location: blockLines.find((l) => l.includes(",")) ?? "",
      startDate,
      endDate,
      current,
      description: "",
      highlights: blockLines
        .filter((l) => l.startsWith("•") || l.startsWith("-") || l.startsWith("*"))
        .map((l) => l.replace(/^[•\-*]\s*/, "")),
    };
  });

  data.educations = sections.education.map((block) => {
    const blockLines = block.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
    return {
      id: createId(),
      institution: blockLines[0] ?? "",
      degree: blockLines[1]?.split(",")[0]?.trim() ?? "",
      field: blockLines[1]?.split(",")[1]?.trim() ?? "",
      location: "",
      startDate: "",
      endDate: blockLines.find((l) => /\d{4}/.test(l)) ?? "",
      gpa: "",
      description: "",
    };
  });

  if (sections.skills.length) {
    data.technicalSkills = sections.skills
      .flatMap((s) => s.split(/[,·|]/))
      .map((s) => s.trim())
      .filter(Boolean);
  }

  return data;
}

function splitSections(text: string): {
  about: string;
  experiences: string[];
  education: string[];
  skills: string[];
} {
  const markers =
    /^(about|tentang|summary|ringkasan|experience|pengalaman kerja|pengalaman|education|pendidikan|skills|keahlian|certifications|sertifikasi|languages|bahasa)$/im;

  const parts = text.split(markers);
  const headers = [...text.matchAll(markers)].map((m) => m[1].toLowerCase());

  let about = "";
  const experiences: string[] = [];
  const education: string[] = [];
  const skills: string[] = [];

  headers.forEach((header, i) => {
    const content = (parts[i + 1] ?? "").trim();
    if (!content) return;

    if (/about|tentang|summary|ringkasan/.test(header)) {
      about = content.split(/\n\n/)[0]?.trim() ?? content;
    } else if (/experience|pengalaman/.test(header)) {
      experiences.push(
        ...content.split(/\n{2,}/).filter((b) => b.trim().length > 3),
      );
    } else if (/education|pendidikan/.test(header)) {
      education.push(
        ...content.split(/\n{2,}/).filter((b) => b.trim().length > 3),
      );
    } else if (/skills|keahlian/.test(header)) {
      skills.push(...content.split(/\n/).filter(Boolean));
    }
  });

  return { about, experiences, education, skills };
}

export function parseLinkedInCsvFiles(
  files: Record<string, string>,
): Partial<ResumeData> {
  const data: Partial<ResumeData> = {
    personal: {
      fullName: "",
      title: "",
      email: "",
      phone: "",
      location: "",
      website: "",
      linkedin: "",
      github: "",
      summary: "",
      photo: "",
    },
    experiences: [],
    educations: [],
    organizations: [],
    technicalSkills: [],
    certifications: [],
    languages: [],
  };

  const profileKey = Object.keys(files).find((k) =>
    /profile/i.test(k),
  );
  if (profileKey) {
    const rows = parseCsv(files[profileKey]);
    const row = rows[0] ?? {};
    const p = data.personal!;
    p.fullName =
      pick(row, "First Name", "Nama Depan") +
      " " +
      pick(row, "Last Name", "Nama Belakang");
    p.fullName = p.fullName.trim() || pick(row, "Full Name", "Nama Lengkap");
    p.title = pick(row, "Headline", "Judul");
    p.summary = pick(row, "Summary", "Ringkasan");
    p.location = pick(row, "Geo Location", "Lokasi Geo", "Location");
    p.email = pick(row, "Email Address", "Alamat Email", "Email");
  }

  const positionsKey = Object.keys(files).find((k) =>
    /positions?/i.test(k),
  );
  if (positionsKey) {
    data.experiences = parseCsv(files[positionsKey]).map((row) => {
      const started = pick(row, "Started On", "Dimulai Pada");
      const finished = pick(row, "Finished On", "Selesai Pada");
      return {
        id: createId(),
        company: pick(row, "Company Name", "Nama Perusahaan"),
        position: pick(row, "Title", "Judul", "Position"),
        location: pick(row, "Location", "Lokasi"),
        startDate: started,
        endDate: finished,
        current: !finished,
        description: pick(row, "Description", "Deskripsi"),
        highlights: pick(row, "Description", "Deskripsi")
          .split(/\n/)
          .filter((l) => l.trim())
          .map((l) => l.replace(/^[•\-*]\s*/, "")),
      };
    });
  }

  const eduKey = Object.keys(files).find((k) => /education/i.test(k));
  if (eduKey) {
    data.educations = parseCsv(files[eduKey]).map((row) => ({
      id: createId(),
      institution: pick(row, "School Name", "Nama Sekolah"),
      degree: pick(row, "Degree Name", "Nama Gelar"),
      field: pick(row, "Notes", "Catatan", "Field Of Study"),
      location: "",
      startDate: pick(row, "Start Date", "Tanggal Mulai"),
      endDate: pick(row, "End Date", "Tanggal Selesai"),
      gpa: "",
      description: "",
    }));
  }

  const skillsKey = Object.keys(files).find((k) => /skills/i.test(k));
  if (skillsKey) {
    data.technicalSkills = parseCsv(files[skillsKey])
      .map((row) => pick(row, "Name", "Nama", "Skill"))
      .filter(Boolean);
  }

  const certKey = Object.keys(files).find((k) =>
    /certifications?/i.test(k),
  );
  if (certKey) {
    data.certifications = parseCsv(files[certKey]).map((row) => ({
      id: createId(),
      name: pick(row, "Name", "Nama"),
      issuer: pick(row, "Authority", "Otoritas", "Issuing Organization"),
      date: pick(row, "Started On", "Dimulai Pada", "Issue Date"),
      url: pick(row, "Url", "URL"),
    }));
  }

  const langKey = Object.keys(files).find((k) => /languages/i.test(k));
  if (langKey) {
    data.languages = parseCsv(files[langKey]).map((row) => ({
      id: createId(),
      name: pick(row, "Name", "Nama"),
      level: pick(row, "Proficiency", "Kemahiran"),
    }));
  }

  return data;
}

export async function parseLinkedInZip(file: File): Promise<Partial<ResumeData>> {
  const JSZip = (await import("jszip")).default;
  const zip = await JSZip.loadAsync(file);
  const csvFiles: Record<string, string> = {};

  const entries = Object.keys(zip.files);
  for (const path of entries) {
    const entry = zip.files[path];
    if (!entry.dir && /\.csv$/i.test(path)) {
      csvFiles[path] = await entry.async("string");
    }
  }

  if (!Object.keys(csvFiles).length) {
    throw new Error("ZIP tidak berisi file CSV LinkedIn");
  }

  return parseLinkedInCsvFiles(csvFiles);
}

export function mergeLinkedInData(
  current: ResumeData,
  imported: Partial<ResumeData>,
): ResumeData {
  return {
    ...current,
    personal: { ...current.personal, ...imported.personal },
    experiences: imported.experiences?.length
      ? imported.experiences
      : current.experiences,
    educations: imported.educations?.length
      ? imported.educations
      : current.educations,
    technicalSkills: imported.technicalSkills?.length
      ? imported.technicalSkills
      : current.technicalSkills,
    softSkills: current.softSkills,
    projects: current.projects,
    certifications: imported.certifications?.length
      ? imported.certifications
      : current.certifications,
    languages: imported.languages?.length
      ? imported.languages
      : current.languages,
    customSections: current.customSections,
  };
}