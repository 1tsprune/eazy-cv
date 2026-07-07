import { createId } from "./default-data";
import type { ResumeData, SkillGroup } from "./types";

const TECH_GROUP_NAMES = ["technical skills", "keahlian teknis"];
const SOFT_GROUP_NAMES = ["soft skills"];

export function isSoftSkillGroup(name: string): boolean {
  const lower = name.trim().toLowerCase();
  return SOFT_GROUP_NAMES.some((n) => lower.includes(n));
}

export function isTechnicalSkillGroup(name: string): boolean {
  const lower = name.trim().toLowerCase();
  if (isSoftSkillGroup(name)) return false;
  return (
    TECH_GROUP_NAMES.some((n) => lower.includes(n)) ||
    !SOFT_GROUP_NAMES.some((n) => lower.includes(n))
  );
}

/** Migrate legacy flat skills into categorized groups */
export function normalizeSkillGroups(data: ResumeData): SkillGroup[] {
  if (data.skillGroups?.length) {
    return data.skillGroups.map((g) => ({
      ...g,
      skills: [...g.skills],
    }));
  }

  const groups: SkillGroup[] = [];
  if (data.technicalSkills.length > 0) {
    groups.push({
      id: createId(),
      name: "Technical Skills",
      skills: [...data.technicalSkills],
    });
  }
  if (data.softSkills.length > 0) {
    groups.push({
      id: createId(),
      name: "Soft Skills",
      skills: [...data.softSkills],
    });
  }
  return groups;
}

/** Keep legacy flat arrays in sync for modern templates & imports */
export function syncLegacySkills(groups: SkillGroup[]): {
  technicalSkills: string[];
  softSkills: string[];
} {
  const technicalSkills: string[] = [];
  const softSkills: string[] = [];

  for (const group of groups) {
    if (isSoftSkillGroup(group.name)) {
      softSkills.push(...group.skills);
    } else {
      technicalSkills.push(...group.skills);
    }
  }

  return { technicalSkills, softSkills };
}

export function hasSkillContent(data: ResumeData): boolean {
  const groups = normalizeSkillGroups(data);
  if (groups.some((g) => g.skills.length > 0)) return true;
  return data.technicalSkills.length > 0 || data.softSkills.length > 0;
}

export function countTechnicalSkills(data: ResumeData): number {
  const groups = normalizeSkillGroups(data);
  if (groups.length > 0) {
    return groups
      .filter((g) => !isSoftSkillGroup(g.name))
      .reduce((n, g) => n + g.skills.length, 0);
  }
  return data.technicalSkills.length;
}

export function countSoftSkills(data: ResumeData): number {
  const groups = normalizeSkillGroups(data);
  if (groups.length > 0) {
    return groups
      .filter((g) => isSoftSkillGroup(g.name))
      .reduce((n, g) => n + g.skills.length, 0);
  }
  return data.softSkills.length;
}

export function chunkSkillLines(skills: string[], perLine = 7): string[] {
  if (skills.length === 0) return [];
  if (skills.length <= perLine) return [skills.join(" · ")];
  const lines: string[] = [];
  for (let i = 0; i < skills.length; i += perLine) {
    lines.push(skills.slice(i, i + perLine).join(" · "));
  }
  return lines;
}