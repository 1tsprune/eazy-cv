import { normalizeSkillGroups, syncLegacySkills } from "@/lib/skill-groups";
import type { ResumeData } from "@/lib/types";

/** Sync skill groups → flat arrays so modern PDF matches preview. */
export function prepareModernPdfData(data: ResumeData): ResumeData {
  const groups = normalizeSkillGroups(data);
  const legacy = syncLegacySkills(groups);
  return {
    ...data,
    skillGroups: groups,
    technicalSkills:
      legacy.technicalSkills.length > 0
        ? legacy.technicalSkills
        : [...data.technicalSkills],
    softSkills:
      legacy.softSkills.length > 0 ? legacy.softSkills : [...data.softSkills],
  };
}