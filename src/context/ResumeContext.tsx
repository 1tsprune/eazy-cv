"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { createId, defaultResumeState } from "@/lib/default-data";
import { sampleResumeState } from "@/lib/sample-data";
import {
  clearStorage,
  exportToJson,
  importFromJson,
  loadFromStorage,
  saveToStorage,
} from "@/lib/storage";
import {
  normalizeSkillGroups,
  syncLegacySkills,
} from "@/lib/skill-groups";
import type {
  Certification,
  CoverLetterData,
  CustomSection,
  Education,
  Experience,
  LanguageSkill,
  Organization,
  PersonalInfo,
  Project,
  ResumeConfig,
  ResumeData,
  ResumeState,
  SkillGroup,
} from "@/lib/types";

interface ResumeContextValue {
  data: ResumeData;
  config: ResumeConfig;
  coverLetter: CoverLetterData;
  isLoaded: boolean;
  updateCoverLetter: (coverLetter: Partial<CoverLetterData>) => void;
  updatePersonal: (personal: Partial<PersonalInfo>) => void;
  updateConfig: (config: Partial<ResumeConfig>) => void;
  addExperience: () => void;
  updateExperience: (id: string, exp: Partial<Experience>) => void;
  removeExperience: (id: string) => void;
  addEducation: () => void;
  updateEducation: (id: string, edu: Partial<Education>) => void;
  removeEducation: (id: string) => void;
  addOrganization: () => void;
  updateOrganization: (id: string, org: Partial<Organization>) => void;
  removeOrganization: (id: string) => void;
  reorderOrganizations: (organizations: Organization[]) => void;
  addProject: () => void;
  updateProject: (id: string, proj: Partial<Project>) => void;
  removeProject: (id: string) => void;
  addCertification: () => void;
  updateCertification: (id: string, cert: Partial<Certification>) => void;
  removeCertification: (id: string) => void;
  addLanguage: () => void;
  updateLanguage: (id: string, lang: Partial<LanguageSkill>) => void;
  removeLanguage: (id: string) => void;
  setTechnicalSkills: (skills: string[]) => void;
  setSoftSkills: (skills: string[]) => void;
  addSkillGroup: () => void;
  updateSkillGroup: (id: string, group: Partial<SkillGroup>) => void;
  removeSkillGroup: (id: string) => void;
  reorderSkillGroups: (groups: SkillGroup[]) => void;
  reset: () => void;
  saveJson: () => void;
  loadJson: (file: File) => Promise<void>;
  loadSample: () => void;
  importLinkedIn: (data: ResumeData) => void;
  addCustomSection: () => void;
  updateCustomSection: (id: string, section: Partial<CustomSection>) => void;
  removeCustomSection: (id: string) => void;
  reorderExperiences: (experiences: Experience[]) => void;
  reorderEducations: (educations: Education[]) => void;
  reorderProjects: (projects: Project[]) => void;
  reorderCertifications: (certifications: Certification[]) => void;
  reorderLanguages: (languages: LanguageSkill[]) => void;
  reorderCustomSections: (sections: CustomSection[]) => void;
}

const ResumeContext = createContext<ResumeContextValue | null>(null);

export function ResumeProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ResumeState>(defaultResumeState);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = loadFromStorage();
    if (saved) setState(saved);
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    saveToStorage(state);
  }, [state, isLoaded]);

  const updatePersonal = useCallback((personal: Partial<PersonalInfo>) => {
    setState((s) => ({
      ...s,
      data: { ...s.data, personal: { ...s.data.personal, ...personal } },
    }));
  }, []);

  const updateConfig = useCallback((config: Partial<ResumeConfig>) => {
    setState((s) => ({ ...s, config: { ...s.config, ...config } }));
  }, []);

  const updateCoverLetter = useCallback((coverLetter: Partial<CoverLetterData>) => {
    setState((s) => ({
      ...s,
      coverLetter: { ...s.coverLetter, ...coverLetter },
    }));
  }, []);

  const addExperience = useCallback(() => {
    setState((s) => ({
      ...s,
      data: {
        ...s.data,
        experiences: [
          ...s.data.experiences,
          {
            id: createId(),
            company: "",
            position: "",
            location: "",
            startDate: "",
            endDate: "",
            current: false,
            description: "",
            highlights: [],
          },
        ],
      },
    }));
  }, []);

  const updateExperience = useCallback(
    (id: string, exp: Partial<Experience>) => {
      setState((s) => ({
        ...s,
        data: {
          ...s.data,
          experiences: s.data.experiences.map((e) =>
            e.id === id ? { ...e, ...exp } : e,
          ),
        },
      }));
    },
    [],
  );

  const removeExperience = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      data: {
        ...s.data,
        experiences: s.data.experiences.filter((e) => e.id !== id),
      },
    }));
  }, []);

  const addEducation = useCallback(() => {
    setState((s) => ({
      ...s,
      data: {
        ...s.data,
        educations: [
          ...s.data.educations,
          {
            id: createId(),
            institution: "",
            degree: "",
            field: "",
            location: "",
            startDate: "",
            endDate: "",
            gpa: "",
            description: "",
          },
        ],
      },
    }));
  }, []);

  const updateEducation = useCallback(
    (id: string, edu: Partial<Education>) => {
      setState((s) => ({
        ...s,
        data: {
          ...s.data,
          educations: s.data.educations.map((e) =>
            e.id === id ? { ...e, ...edu } : e,
          ),
        },
      }));
    },
    [],
  );

  const removeEducation = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      data: {
        ...s.data,
        educations: s.data.educations.filter((e) => e.id !== id),
      },
    }));
  }, []);

  const addOrganization = useCallback(() => {
    setState((s) => ({
      ...s,
      data: {
        ...s.data,
        organizations: [
          ...s.data.organizations,
          {
            id: createId(),
            name: "",
            role: "",
            location: "",
            startDate: "",
            endDate: "",
            current: false,
            highlights: [],
          },
        ],
      },
    }));
  }, []);

  const updateOrganization = useCallback(
    (id: string, org: Partial<Organization>) => {
      setState((s) => ({
        ...s,
        data: {
          ...s.data,
          organizations: s.data.organizations.map((o) =>
            o.id === id ? { ...o, ...org } : o,
          ),
        },
      }));
    },
    [],
  );

  const removeOrganization = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      data: {
        ...s.data,
        organizations: s.data.organizations.filter((o) => o.id !== id),
      },
    }));
  }, []);

  const reorderOrganizations = useCallback((organizations: Organization[]) => {
    setState((s) => ({ ...s, data: { ...s.data, organizations } }));
  }, []);

  const addProject = useCallback(() => {
    setState((s) => ({
      ...s,
      data: {
        ...s.data,
        projects: [
          ...s.data.projects,
          {
            id: createId(),
            name: "",
            url: "",
            description: "",
            technologies: [],
          },
        ],
      },
    }));
  }, []);

  const updateProject = useCallback((id: string, proj: Partial<Project>) => {
    setState((s) => ({
      ...s,
      data: {
        ...s.data,
        projects: s.data.projects.map((p) =>
          p.id === id ? { ...p, ...proj } : p,
        ),
      },
    }));
  }, []);

  const removeProject = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      data: {
        ...s.data,
        projects: s.data.projects.filter((p) => p.id !== id),
      },
    }));
  }, []);

  const addCertification = useCallback(() => {
    setState((s) => ({
      ...s,
      data: {
        ...s.data,
        certifications: [
          ...s.data.certifications,
          { id: createId(), name: "", issuer: "", date: "", url: "" },
        ],
      },
    }));
  }, []);

  const updateCertification = useCallback(
    (id: string, cert: Partial<Certification>) => {
      setState((s) => ({
        ...s,
        data: {
          ...s.data,
          certifications: s.data.certifications.map((c) =>
            c.id === id ? { ...c, ...cert } : c,
          ),
        },
      }));
    },
    [],
  );

  const removeCertification = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      data: {
        ...s.data,
        certifications: s.data.certifications.filter((c) => c.id !== id),
      },
    }));
  }, []);

  const addLanguage = useCallback(() => {
    setState((s) => ({
      ...s,
      data: {
        ...s.data,
        languages: [
          ...s.data.languages,
          { id: createId(), name: "", level: "professional" },
        ],
      },
    }));
  }, []);

  const updateLanguage = useCallback(
    (id: string, lang: Partial<LanguageSkill>) => {
      setState((s) => ({
        ...s,
        data: {
          ...s.data,
          languages: s.data.languages.map((l) =>
            l.id === id ? { ...l, ...lang } : l,
          ),
        },
      }));
    },
    [],
  );

  const removeLanguage = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      data: {
        ...s.data,
        languages: s.data.languages.filter((l) => l.id !== id),
      },
    }));
  }, []);

  const applySkillGroups = useCallback((groups: SkillGroup[]) => {
    const legacy = syncLegacySkills(groups);
    setState((s) => ({
      ...s,
      data: {
        ...s.data,
        skillGroups: groups,
        technicalSkills: legacy.technicalSkills,
        softSkills: legacy.softSkills,
      },
    }));
  }, []);

  const setTechnicalSkills = useCallback((skills: string[]) => {
    setState((s) => {
      const groups = normalizeSkillGroups(s.data);
      const techIdx = groups.findIndex(
        (g) => g.name.toLowerCase().includes("technical"),
      );
      if (techIdx >= 0) {
        groups[techIdx] = { ...groups[techIdx], skills };
      } else {
        groups.unshift({
          id: createId(),
          name: "Technical Skills",
          skills,
        });
      }
      const legacy = syncLegacySkills(groups);
      return {
        ...s,
        data: {
          ...s.data,
          skillGroups: groups,
          technicalSkills: legacy.technicalSkills,
          softSkills: legacy.softSkills,
        },
      };
    });
  }, []);

  const setSoftSkills = useCallback((skills: string[]) => {
    setState((s) => {
      const groups = normalizeSkillGroups(s.data);
      const softIdx = groups.findIndex((g) =>
        g.name.toLowerCase().includes("soft"),
      );
      if (softIdx >= 0) {
        groups[softIdx] = { ...groups[softIdx], skills };
      } else {
        groups.push({
          id: createId(),
          name: "Soft Skills",
          skills,
        });
      }
      const legacy = syncLegacySkills(groups);
      return {
        ...s,
        data: {
          ...s.data,
          skillGroups: groups,
          technicalSkills: legacy.technicalSkills,
          softSkills: legacy.softSkills,
        },
      };
    });
  }, []);

  const addSkillGroup = useCallback(() => {
    setState((s) => {
      const groups = [
        ...normalizeSkillGroups(s.data),
        { id: createId(), name: "", skills: [] },
      ];
      return { ...s, data: { ...s.data, skillGroups: groups } };
    });
  }, []);

  const updateSkillGroup = useCallback(
    (id: string, group: Partial<SkillGroup>) => {
      setState((s) => {
        const groups = normalizeSkillGroups(s.data).map((g) =>
          g.id === id ? { ...g, ...group } : g,
        );
        const legacy = syncLegacySkills(groups);
        return {
          ...s,
          data: {
            ...s.data,
            skillGroups: groups,
            technicalSkills: legacy.technicalSkills,
            softSkills: legacy.softSkills,
          },
        };
      });
    },
    [],
  );

  const removeSkillGroup = useCallback((id: string) => {
    setState((s) => {
      const groups = normalizeSkillGroups(s.data).filter((g) => g.id !== id);
      const legacy = syncLegacySkills(groups);
      return {
        ...s,
        data: {
          ...s.data,
          skillGroups: groups,
          technicalSkills: legacy.technicalSkills,
          softSkills: legacy.softSkills,
        },
      };
    });
  }, []);

  const reorderSkillGroups = useCallback((skillGroups: SkillGroup[]) => {
    applySkillGroups(skillGroups);
  }, [applySkillGroups]);

  const reset = useCallback(() => {
    setState(defaultResumeState);
    clearStorage();
  }, []);

  const saveJson = useCallback(() => {
    exportToJson(state);
  }, [state]);

  const loadJson = useCallback(async (file: File) => {
    const imported = await importFromJson(file);
    setState(imported);
  }, []);

  const loadSample = useCallback(() => {
    setState(structuredClone(sampleResumeState));
  }, []);

  const importLinkedIn = useCallback((data: ResumeData) => {
    setState((s) => ({ ...s, data }));
  }, []);

  const addCustomSection = useCallback(() => {
    setState((s) => ({
      ...s,
      data: {
        ...s.data,
        customSections: [
          ...s.data.customSections,
          {
            id: createId(),
            title: "",
            items: [],
            showInAts: false,
          },
        ],
      },
    }));
  }, []);

  const updateCustomSection = useCallback(
    (id: string, section: Partial<CustomSection>) => {
      setState((s) => ({
        ...s,
        data: {
          ...s.data,
          customSections: s.data.customSections.map((c) =>
            c.id === id ? { ...c, ...section } : c,
          ),
        },
      }));
    },
    [],
  );

  const removeCustomSection = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      data: {
        ...s.data,
        customSections: s.data.customSections.filter((c) => c.id !== id),
      },
    }));
  }, []);

  const reorderExperiences = useCallback((experiences: Experience[]) => {
    setState((s) => ({ ...s, data: { ...s.data, experiences } }));
  }, []);

  const reorderEducations = useCallback((educations: Education[]) => {
    setState((s) => ({ ...s, data: { ...s.data, educations } }));
  }, []);

  const reorderProjects = useCallback((projects: Project[]) => {
    setState((s) => ({ ...s, data: { ...s.data, projects } }));
  }, []);

  const reorderCertifications = useCallback((certifications: Certification[]) => {
    setState((s) => ({ ...s, data: { ...s.data, certifications } }));
  }, []);

  const reorderLanguages = useCallback((languages: LanguageSkill[]) => {
    setState((s) => ({ ...s, data: { ...s.data, languages } }));
  }, []);

  const reorderCustomSections = useCallback((customSections: CustomSection[]) => {
    setState((s) => ({ ...s, data: { ...s.data, customSections } }));
  }, []);

  const value = useMemo(
    () => ({
      data: state.data,
      config: state.config,
      coverLetter: state.coverLetter,
      isLoaded,
      updatePersonal,
      updateConfig,
      updateCoverLetter,
      addExperience,
      updateExperience,
      removeExperience,
      addEducation,
      updateEducation,
      removeEducation,
      addOrganization,
      updateOrganization,
      removeOrganization,
      reorderOrganizations,
      addProject,
      updateProject,
      removeProject,
      addCertification,
      updateCertification,
      removeCertification,
      addLanguage,
      updateLanguage,
      removeLanguage,
      setTechnicalSkills,
      setSoftSkills,
      addSkillGroup,
      updateSkillGroup,
      removeSkillGroup,
      reorderSkillGroups,
      reset,
      saveJson,
      loadJson,
      loadSample,
      importLinkedIn,
      addCustomSection,
      updateCustomSection,
      removeCustomSection,
      reorderExperiences,
      reorderEducations,
      reorderProjects,
      reorderCertifications,
      reorderLanguages,
      reorderCustomSections,
    }),
    [
      state,
      isLoaded,
      updatePersonal,
      updateConfig,
      updateCoverLetter,
      addExperience,
      updateExperience,
      removeExperience,
      addEducation,
      updateEducation,
      removeEducation,
      addOrganization,
      updateOrganization,
      removeOrganization,
      reorderOrganizations,
      addProject,
      updateProject,
      removeProject,
      addCertification,
      updateCertification,
      removeCertification,
      addLanguage,
      updateLanguage,
      removeLanguage,
      setTechnicalSkills,
      setSoftSkills,
      addSkillGroup,
      updateSkillGroup,
      removeSkillGroup,
      reorderSkillGroups,
      reset,
      saveJson,
      loadJson,
      loadSample,
      importLinkedIn,
      addCustomSection,
      updateCustomSection,
      removeCustomSection,
      reorderExperiences,
      reorderEducations,
      reorderProjects,
      reorderCertifications,
      reorderLanguages,
      reorderCustomSections,
    ],
  );

  return (
    <ResumeContext.Provider value={value}>{children}</ResumeContext.Provider>
  );
}

export function useResume() {
  const ctx = useContext(ResumeContext);
  if (!ctx) throw new Error("useResume must be used within ResumeProvider");
  return ctx;
}