import { APP } from "./config";
import { DEFAULT_CV_PROFILE } from "./cv-profile";
import { defaultResumeState } from "./default-data";
import { normalizeLanguageLevel } from "./language-levels";
import {
  normalizeSkillGroups,
  syncLegacySkills,
} from "./skill-groups";
import { DEFAULT_TYPOGRAPHY, normalizeFontFamily } from "./typography";
import {
  DEFAULT_SECTION_ORDER,
  normalizeModernTemplate,
  type ResumeState,
  type SectionKey,
} from "./types";

const STORAGE_KEY = `${APP.slug}-resume-v1`;
const LEGACY_STORAGE_KEYS = ["cvcepat-resume-v1", "cvforge-resume-v1"];

function normalizeSectionOrder(order: SectionKey[] | undefined): SectionKey[] {
  const base = order ? [...order] : [...DEFAULT_SECTION_ORDER];
  if (!base.includes("organizations")) {
    const eduIdx = base.indexOf("education");
    const at = eduIdx >= 0 ? eduIdx + 1 : base.length;
    base.splice(at, 0, "organizations");
  }
  return base;
}

function normalizeState(parsed: ResumeState): ResumeState {
  const mergedData = {
    ...defaultResumeState.data,
    ...parsed.data,
    organizations: parsed.data?.organizations ?? [],
    languages: (parsed.data?.languages ?? []).map((lang) => ({
      ...lang,
      level: normalizeLanguageLevel(lang.level ?? ""),
    })),
  };
  const skillGroups = normalizeSkillGroups(mergedData);
  const legacySkills = syncLegacySkills(skillGroups);

  return {
    data: {
      ...mergedData,
      skillGroups,
      technicalSkills: legacySkills.technicalSkills,
      softSkills: legacySkills.softSkills,
    },
    config: {
      ...defaultResumeState.config,
      ...parsed.config,
      sectionOrder: normalizeSectionOrder(parsed.config?.sectionOrder),
      cvProfile: parsed.config?.cvProfile ?? DEFAULT_CV_PROFILE,
      fontFamily: normalizeFontFamily(parsed.config?.fontFamily),
      fontSize: parsed.config?.fontSize ?? DEFAULT_TYPOGRAPHY.fontSize,
      fontBold: parsed.config?.fontBold ?? DEFAULT_TYPOGRAPHY.fontBold,
      template: normalizeModernTemplate(parsed.config?.template),
    },
    coverLetter: {
      ...defaultResumeState.coverLetter,
      ...parsed.coverLetter,
    },
  };
}

function loadLegacyRaw(): string | null {
  for (const key of LEGACY_STORAGE_KEYS) {
    const raw = localStorage.getItem(key);
    if (raw) return raw;
  }
  return null;
}

function clearLegacyStorage(): void {
  for (const key of LEGACY_STORAGE_KEYS) {
    localStorage.removeItem(key);
  }
}

export function loadFromStorage(): ResumeState | null {
  if (typeof window === "undefined") return null;
  try {
    let raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      raw = loadLegacyRaw();
      if (!raw) return null;
      const migrated = normalizeState(JSON.parse(raw) as ResumeState);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
      clearLegacyStorage();
      return migrated;
    }
    return normalizeState(JSON.parse(raw) as ResumeState);
  } catch {
    return null;
  }
}

export function saveToStorage(state: ResumeState): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage full or unavailable
  }
}

export function clearStorage(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
  clearLegacyStorage();
}

export function exportToJson(state: ResumeState): void {
  const blob = new Blob([JSON.stringify(state, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${APP.slug}-${state.data.personal.fullName || "resume"}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function importFromJson(file: File): Promise<ResumeState> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result as string) as ResumeState;
        resolve(normalizeState(parsed));
      } catch {
        reject(new Error("Invalid JSON file"));
      }
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsText(file);
  });
}