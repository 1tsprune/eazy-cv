import type { Language } from "./types";

export type LanguageProficiencyLevel =
  | "native"
  | "fluent"
  | "professional"
  | "intermediate"
  | "basic";

export const LANGUAGE_PROFICIENCY_LEVELS: LanguageProficiencyLevel[] = [
  "native",
  "fluent",
  "professional",
  "intermediate",
  "basic",
];

const LEVEL_LABELS: Record<
  LanguageProficiencyLevel,
  { id: string; en: string }
> = {
  native: { id: "Asli / Native", en: "Native" },
  fluent: { id: "Fasih", en: "Fluent" },
  professional: { id: "Profesional", en: "Professional" },
  intermediate: { id: "Menengah", en: "Intermediate" },
  basic: { id: "Dasar", en: "Basic" },
};

const LEGACY_LEVEL_MAP: Record<string, LanguageProficiencyLevel> = {
  native: "native",
  asli: "native",
  "mother tongue": "native",
  "bahasa ibu": "native",
  fluent: "fluent",
  fasih: "fluent",
  "full professional": "fluent",
  professional: "professional",
  profesional: "professional",
  "professional working": "professional",
  intermediate: "intermediate",
  menengah: "intermediate",
  conversational: "intermediate",
  basic: "basic",
  dasar: "basic",
  elementary: "basic",
  beginner: "basic",
};

export function isLanguageProficiencyLevel(
  value: string,
): value is LanguageProficiencyLevel {
  return (LANGUAGE_PROFICIENCY_LEVELS as string[]).includes(value);
}

export function normalizeLanguageLevel(level: string): string {
  const trimmed = level.trim();
  if (!trimmed) return "";
  if (isLanguageProficiencyLevel(trimmed)) return trimmed;
  const key = trimmed.toLowerCase();
  if (LEGACY_LEVEL_MAP[key]) return LEGACY_LEVEL_MAP[key];
  for (const [pattern, id] of Object.entries(LEGACY_LEVEL_MAP)) {
    if (key.includes(pattern)) return id;
  }
  return trimmed;
}

export function getLanguageLevelLabel(
  level: string,
  locale: Language,
): string {
  const normalized = normalizeLanguageLevel(level);
  if (isLanguageProficiencyLevel(normalized)) {
    return LEVEL_LABELS[normalized][locale];
  }
  return level;
}

export function getLanguageLevelOptions(locale: Language) {
  return LANGUAGE_PROFICIENCY_LEVELS.map((id) => ({
    value: id,
    label: LEVEL_LABELS[id][locale],
  }));
}