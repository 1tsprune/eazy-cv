"use client";

import {
  Award,
  Briefcase,
  Code,
  GraduationCap,
  Globe,
  Layers,
  Users,
  Plus,
  User,
} from "lucide-react";
import { useResume } from "@/context/ResumeContext";
import { useTheme } from "@/context/ThemeContext";
import { Input } from "@/components/ui/Input";
import { DateInput } from "@/components/ui/DateInput";
import { MonthYearInput } from "@/components/ui/MonthYearInput";
import { Select } from "@/components/ui/Select";
import { getLanguageLevelOptions } from "@/lib/language-levels";
import { Textarea } from "@/components/ui/Textarea";
import { SectionCard } from "@/components/ui/SectionCard";
import { TagInput } from "@/components/ui/TagInput";
import { DeleteButton } from "@/components/ui/DeleteButton";
import { SortableItemHeader } from "@/components/ui/SortableItemHeader";
import { SortableList } from "@/components/ui/SortableList";
import { PhotoUpload } from "@/components/ui/PhotoUpload";
import {
  CV_PROFILES,
  getExperienceLabel,
  getProfileLabel,
  getProfileUiStrings,
  getRecommendedSectionOrder,
} from "@/lib/cv-profile";
import { normalizeSkillGroups } from "@/lib/skill-groups";
import type { CvProfile } from "@/lib/types";
import { getUiDict } from "@/lib/ui-i18n";

const ITEM_CARD =
  "rounded-xl border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-700 dark:bg-zinc-800/50 sm:p-4";
const DATE_RANGE_ROW =
  "grid grid-cols-1 gap-2 sm:col-span-2 sm:grid-cols-2";
const ADD_BTN =
  "flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-zinc-300 py-3 text-sm font-bold text-zinc-500 transition hover:border-slate-400 hover:text-slate-700 dark:border-zinc-600 dark:text-zinc-400 dark:hover:border-slate-500 dark:hover:text-slate-500";

export function ResumeForm() {
  const {
    data,
    config,
    updatePersonal,
    updateConfig,
    addExperience,
    updateExperience,
    removeExperience,
    reorderExperiences,
    addEducation,
    updateEducation,
    removeEducation,
    reorderEducations,
    addOrganization,
    updateOrganization,
    removeOrganization,
    reorderOrganizations,
    addProject,
    updateProject,
    removeProject,
    reorderProjects,
    addCertification,
    updateCertification,
    removeCertification,
    reorderCertifications,
    addLanguage,
    updateLanguage,
    removeLanguage,
    reorderLanguages,
    addSkillGroup,
    updateSkillGroup,
    removeSkillGroup,
    reorderSkillGroups,
    addCustomSection,
    updateCustomSection,
    removeCustomSection,
    reorderCustomSections,
  } = useResume();
  const { uiLocale } = useTheme();
  const t = getUiDict(uiLocale);
  const profileStrings = getProfileUiStrings(config.cvProfile, uiLocale);
  const experienceTitle = getExperienceLabel(
    config.language,
    config.cvProfile,
  );

  const handleProfileChange = (profile: CvProfile) => {
    updateConfig({
      cvProfile: profile,
      sectionOrder: getRecommendedSectionOrder(profile),
    });
  };

  return (
    <div className="space-y-4">
      <SectionCard
        title={t.personalInfo}
        icon={<User className="h-4 w-4" />}
      >
        {config.exportMode === "modern" ? (
          <PhotoUpload
            photo={data.personal.photo}
            showPhoto={config.showPhoto}
            onChange={(photo) => {
              updatePersonal({ photo });
              updateConfig({ showPhoto: true });
            }}
            onRemove={() => {
              updatePersonal({ photo: "" });
              updateConfig({ showPhoto: false });
            }}
            onToggleShow={(show) => updateConfig({ showPhoto: show })}
          />
        ) : (
          <p className="mb-4 text-[10px] text-zinc-400">{t.photoModernOnly}</p>
        )}
        <div className="mb-4">
          <span className="mb-1.5 block text-xs font-medium text-zinc-500 dark:text-zinc-400">
            {profileStrings.cvProfile}
          </span>
          <div className="flex flex-wrap gap-2">
            {CV_PROFILES.map((profile) => (
              <button
                key={profile}
                type="button"
                onClick={() => handleProfileChange(profile)}
                className={`rounded-full px-4 py-2 text-xs font-bold transition ${
                  config.cvProfile === profile
                    ? "bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-900"
                    : "border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                }`}
              >
                {getProfileLabel(profile, uiLocale)}
              </button>
            ))}
          </div>
          <p className="mt-2 text-[10px] text-zinc-400">
            {profileStrings.cvProfileHint}
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <Input
            label={t.fullName}
            value={data.personal.fullName}
            onChange={(e) => updatePersonal({ fullName: e.target.value })}
            placeholder="John Doe"
          />
          <Input
            label={t.jobTitle}
            value={data.personal.title}
            onChange={(e) => updatePersonal({ title: e.target.value })}
            placeholder={profileStrings.jobTitlePlaceholder}
          />
          <Input
            label={t.email}
            type="email"
            value={data.personal.email}
            onChange={(e) => updatePersonal({ email: e.target.value })}
            placeholder="john@email.com"
          />
          <Input
            label={t.phone}
            value={data.personal.phone}
            onChange={(e) => updatePersonal({ phone: e.target.value })}
            placeholder="+62 812 xxx"
          />
          <Input
            label={t.location}
            value={data.personal.location}
            onChange={(e) => updatePersonal({ location: e.target.value })}
            placeholder="Jakarta, Indonesia"
          />
          <Input
            label={t.website}
            value={data.personal.website}
            onChange={(e) => updatePersonal({ website: e.target.value })}
            placeholder="https://..."
          />
          <Input
            label={t.linkedin}
            value={data.personal.linkedin}
            onChange={(e) => updatePersonal({ linkedin: e.target.value })}
            placeholder="linkedin.com/in/..."
          />
          <Input
            label={t.github}
            value={data.personal.github}
            onChange={(e) => updatePersonal({ github: e.target.value })}
            placeholder="github.com/..."
          />
        </div>
        <div className="mt-3">
          <Textarea
            label={t.summary}
            rows={4}
            value={data.personal.summary}
            onChange={(e) => updatePersonal({ summary: e.target.value })}
            placeholder={profileStrings.summaryPlaceholder}
          />
        </div>
      </SectionCard>

      <SectionCard
        title={experienceTitle}
        icon={<Briefcase className="h-4 w-4" />}
        badge={`${data.experiences.length}`}
      >
        <SortableList
          items={data.experiences}
          keyExtractor={(exp) => exp.id}
          onReorder={reorderExperiences}
          hint={t.dragItemsHint}
          renderItem={(exp, idx) => (
            <div className={ITEM_CARD}>
              <SortableItemHeader
                index={idx}
                onDelete={() => removeExperience(exp.id)}
                deleteLabel={t.deleteItem}
              />
              <div className="grid gap-3 sm:grid-cols-2">
                <Input
                  label={t.position}
                  value={exp.position}
                  onChange={(e) =>
                    updateExperience(exp.id, { position: e.target.value })
                  }
                  placeholder={profileStrings.experiencePositionPlaceholder}
                />
                <Input
                  label={t.company}
                  value={exp.company}
                  onChange={(e) =>
                    updateExperience(exp.id, { company: e.target.value })
                  }
                  placeholder={profileStrings.experienceCompanyPlaceholder}
                />
                <Input
                  label={t.location}
                  value={exp.location}
                  onChange={(e) =>
                    updateExperience(exp.id, { location: e.target.value })
                  }
                />
                <div className={DATE_RANGE_ROW}>
                  <MonthYearInput
                    label={t.startDate}
                    value={exp.startDate}
                    locale={config.language}
                    onChange={(startDate) =>
                      updateExperience(exp.id, { startDate })
                    }
                  />
                  <MonthYearInput
                    label={t.endDate}
                    value={exp.endDate}
                    locale={config.language}
                    onChange={(endDate) =>
                      updateExperience(exp.id, { endDate })
                    }
                    disabled={exp.current}
                  />
                </div>
              </div>
              <label className="mt-2 flex items-center gap-2 text-xs text-zinc-500">
                <input
                  type="checkbox"
                  checked={exp.current}
                  onChange={(e) =>
                    updateExperience(exp.id, {
                      current: e.target.checked,
                      endDate: e.target.checked ? "" : exp.endDate,
                    })
                  }
                  className="rounded"
                />
                {profileStrings.currentlyWorking}
              </label>
              <div className="mt-3">
                <TagInput
                  label={t.highlights}
                  tags={exp.highlights}
                  onChange={(highlights) =>
                    updateExperience(exp.id, { highlights })
                  }
                  placeholder={profileStrings.highlightsPlaceholder}
                />
              </div>
            </div>
          )}
        />
        <button type="button" onClick={addExperience} className={`mt-3 ${ADD_BTN}`}>
          <Plus className="h-4 w-4" />
          {t.addExperience}
        </button>
      </SectionCard>

      <SectionCard
        title={t.education}
        icon={<GraduationCap className="h-4 w-4" />}
        badge={`${data.educations.length}`}
      >
        <SortableList
          items={data.educations}
          keyExtractor={(edu) => edu.id}
          onReorder={reorderEducations}
          hint={t.dragItemsHint}
          renderItem={(edu, idx) => (
            <div className={ITEM_CARD}>
              <SortableItemHeader
                index={idx}
                onDelete={() => removeEducation(edu.id)}
                deleteLabel={t.deleteItem}
              />
              <div className="grid gap-3 sm:grid-cols-2">
                <Input
                  label={t.institution}
                  value={edu.institution}
                  onChange={(e) =>
                    updateEducation(edu.id, { institution: e.target.value })
                  }
                />
                <Input
                  label={t.degree}
                  value={edu.degree}
                  onChange={(e) =>
                    updateEducation(edu.id, { degree: e.target.value })
                  }
                />
                <Input
                  label={t.field}
                  value={edu.field}
                  onChange={(e) =>
                    updateEducation(edu.id, { field: e.target.value })
                  }
                />
                <Input
                  label={t.location}
                  value={edu.location}
                  onChange={(e) =>
                    updateEducation(edu.id, { location: e.target.value })
                  }
                  placeholder="Bandung"
                />
                <div className={DATE_RANGE_ROW}>
                  <MonthYearInput
                    label={t.eduStartDate}
                    value={edu.startDate}
                    locale={config.language}
                    onChange={(startDate) =>
                      updateEducation(edu.id, { startDate })
                    }
                  />
                  <MonthYearInput
                    label={t.eduEndDate}
                    value={edu.endDate}
                    locale={config.language}
                    onChange={(endDate) =>
                      updateEducation(edu.id, { endDate })
                    }
                  />
                </div>
                <Input
                  label={t.gpa}
                  value={edu.gpa}
                  onChange={(e) =>
                    updateEducation(edu.id, { gpa: e.target.value })
                  }
                />
              </div>
            </div>
          )}
        />
        <button type="button" onClick={addEducation} className={`mt-3 ${ADD_BTN}`}>
          <Plus className="h-4 w-4" />
          {t.addEducation}
        </button>
      </SectionCard>

      <SectionCard
        title={t.organizations}
        icon={<Users className="h-4 w-4" />}
        badge={`${data.organizations.length}`}
        defaultOpen={false}
      >
        <SortableList
          items={data.organizations}
          keyExtractor={(org) => org.id}
          onReorder={reorderOrganizations}
          hint={t.dragItemsHint}
          renderItem={(org, idx) => (
            <div className={ITEM_CARD}>
              <SortableItemHeader
                index={idx}
                onDelete={() => removeOrganization(org.id)}
                deleteLabel={t.deleteItem}
              />
              <div className="grid gap-3 sm:grid-cols-2">
                <Input
                  label={t.orgName}
                  value={org.name}
                  onChange={(e) =>
                    updateOrganization(org.id, { name: e.target.value })
                  }
                  placeholder="BEM, UKM, Komunitas..."
                />
                <Input
                  label={t.orgRole}
                  value={org.role}
                  onChange={(e) =>
                    updateOrganization(org.id, { role: e.target.value })
                  }
                  placeholder="Ketua, Anggota, Volunteer..."
                />
                <Input
                  label={t.location}
                  value={org.location}
                  onChange={(e) =>
                    updateOrganization(org.id, { location: e.target.value })
                  }
                />
                <div className={DATE_RANGE_ROW}>
                  <MonthYearInput
                    label={t.startDate}
                    value={org.startDate}
                    locale={config.language}
                    onChange={(startDate) =>
                      updateOrganization(org.id, { startDate })
                    }
                  />
                  <MonthYearInput
                    label={t.endDate}
                    value={org.endDate}
                    locale={config.language}
                    onChange={(endDate) =>
                      updateOrganization(org.id, { endDate })
                    }
                    disabled={org.current}
                  />
                </div>
              </div>
              <label className="mt-2 flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-300">
                <input
                  type="checkbox"
                  checked={org.current}
                  onChange={(e) =>
                    updateOrganization(org.id, {
                      current: e.target.checked,
                      endDate: e.target.checked ? "" : org.endDate,
                    })
                  }
                  className="rounded border-zinc-300"
                />
                {t.currentlyActive}
              </label>
              <div className="mt-3">
                <TagInput
                  label={t.highlights}
                  tags={org.highlights}
                  onChange={(highlights) =>
                    updateOrganization(org.id, { highlights })
                  }
                  placeholder="Mengelola event, koordinasi tim..."
                />
              </div>
            </div>
          )}
        />
        <button
          type="button"
          onClick={addOrganization}
          className={`mt-3 ${ADD_BTN}`}
        >
          <Plus className="h-4 w-4" />
          {t.addOrganization}
        </button>
      </SectionCard>

      <SectionCard
        title={t.skills}
        icon={<Code className="h-4 w-4" />}
        badge={`${normalizeSkillGroups(data).length}`}
      >
        <SortableList
          items={normalizeSkillGroups(data)}
          keyExtractor={(group) => group.id}
          onReorder={reorderSkillGroups}
          hint={t.dragItemsHint}
          renderItem={(group, idx) => (
            <div className={ITEM_CARD}>
              <SortableItemHeader
                index={idx}
                onDelete={() => removeSkillGroup(group.id)}
                deleteLabel={t.deleteItem}
              />
              <div className="space-y-3">
                <Input
                  label={t.skillGroupName}
                  value={group.name}
                  onChange={(e) =>
                    updateSkillGroup(group.id, { name: e.target.value })
                  }
                  placeholder={t.skillGroupNamePlaceholder}
                />
                <TagInput
                  label={t.skillsInGroup}
                  tags={group.skills}
                  onChange={(skills) =>
                    updateSkillGroup(group.id, { skills })
                  }
                  placeholder={t.skillGroupSkillsPlaceholder}
                />
              </div>
            </div>
          )}
        />
        <button
          type="button"
          onClick={addSkillGroup}
          className={`mt-3 ${ADD_BTN}`}
        >
          <Plus className="h-4 w-4" />
          {t.addSkillGroup}
        </button>
      </SectionCard>

      <SectionCard
        title={t.projects}
        icon={<Code className="h-4 w-4" />}
        badge={`${data.projects.length}`}
        defaultOpen={false}
      >
        <SortableList
          items={data.projects}
          keyExtractor={(proj) => proj.id}
          onReorder={reorderProjects}
          hint={t.dragItemsHint}
          renderItem={(proj, idx) => (
            <div className={ITEM_CARD}>
              <SortableItemHeader
                index={idx}
                onDelete={() => removeProject(proj.id)}
                deleteLabel={t.deleteItem}
              />
              <div className="grid gap-3">
                <Input
                  label={t.projectName}
                  value={proj.name}
                  onChange={(e) =>
                    updateProject(proj.id, { name: e.target.value })
                  }
                />
                <Input
                  label={t.url}
                  value={proj.url}
                  onChange={(e) =>
                    updateProject(proj.id, { url: e.target.value })
                  }
                />
                <Textarea
                  label={t.description}
                  rows={2}
                  value={proj.description}
                  onChange={(e) =>
                    updateProject(proj.id, { description: e.target.value })
                  }
                />
                <TagInput
                  label={t.technologies}
                  tags={proj.technologies}
                  onChange={(technologies) =>
                    updateProject(proj.id, { technologies })
                  }
                />
              </div>
            </div>
          )}
        />
        <button type="button" onClick={addProject} className={`mt-3 ${ADD_BTN}`}>
          <Plus className="h-4 w-4" />
          {t.addProject}
        </button>
      </SectionCard>

      <SectionCard
        title={t.certifications}
        icon={<Award className="h-4 w-4" />}
        badge={`${data.certifications.length}`}
        defaultOpen={false}
      >
        <SortableList
          items={data.certifications}
          keyExtractor={(cert) => cert.id}
          onReorder={reorderCertifications}
          hint={t.dragItemsHint}
          renderItem={(cert, idx) => (
            <div className={ITEM_CARD}>
              <SortableItemHeader
                index={idx}
                onDelete={() => removeCertification(cert.id)}
                deleteLabel={t.deleteItem}
              />
              <div className="grid gap-3 sm:grid-cols-2">
                <Input
                  label={t.certName}
                  value={cert.name}
                  onChange={(e) =>
                    updateCertification(cert.id, { name: e.target.value })
                  }
                />
                <Input
                  label={t.issuer}
                  value={cert.issuer}
                  onChange={(e) =>
                    updateCertification(cert.id, { issuer: e.target.value })
                  }
                />
                <MonthYearInput
                  label={t.date}
                  value={cert.date}
                  locale={config.language}
                  onChange={(date) =>
                    updateCertification(cert.id, { date })
                  }
                />
              </div>
            </div>
          )}
        />
        <button
          type="button"
          onClick={addCertification}
          className={`mt-3 ${ADD_BTN}`}
        >
          <Plus className="h-4 w-4" />
          {t.addCertification}
        </button>
      </SectionCard>

      <SectionCard
        title={t.languages}
        icon={<Globe className="h-4 w-4" />}
        badge={`${data.languages.length}`}
        defaultOpen={false}
      >
        <SortableList
          items={data.languages}
          keyExtractor={(lang) => lang.id}
          onReorder={reorderLanguages}
          hint={t.dragItemsHint}
          renderItem={(lang) => (
            <div className={ITEM_CARD}>
              <div className="flex items-start gap-2">
                <div className="grid min-w-0 flex-1 grid-cols-1 gap-2 sm:grid-cols-2">
                  <Input
                    label={t.languageName}
                    value={lang.name}
                    onChange={(e) =>
                      updateLanguage(lang.id, { name: e.target.value })
                    }
                  />
                  <Select
                    label={t.languageLevel}
                    value={lang.level}
                    onChange={(e) =>
                      updateLanguage(lang.id, { level: e.target.value })
                    }
                    placeholder={t.selectLanguageLevel}
                    options={getLanguageLevelOptions(uiLocale)}
                  />
                </div>
                <DeleteButton
                  onClick={() => removeLanguage(lang.id)}
                  label={t.deleteItem}
                  className="mt-6"
                />
              </div>
            </div>
          )}
        />
        <button type="button" onClick={addLanguage} className={`mt-3 ${ADD_BTN}`}>
          <Plus className="h-4 w-4" />
          {t.addLanguage}
        </button>
      </SectionCard>

      <SectionCard
        title={t.customSections}
        icon={<Layers className="h-4 w-4" />}
        badge={`${data.customSections.length}`}
        defaultOpen={false}
      >
        <p className="mb-4 text-xs text-zinc-500 dark:text-zinc-400">
          {t.customSectionsHint}
        </p>
        <SortableList
          items={data.customSections}
          keyExtractor={(section) => section.id}
          onReorder={reorderCustomSections}
          hint={t.dragItemsHint}
          renderItem={(section, idx) => (
            <div className={ITEM_CARD}>
              <SortableItemHeader
                index={idx}
                onDelete={() => removeCustomSection(section.id)}
                deleteLabel={t.deleteItem}
                leading={
                  <label className="flex items-center gap-2 text-xs text-zinc-500">
                    <input
                      type="checkbox"
                      checked={section.showInAts}
                      onChange={(e) =>
                        updateCustomSection(section.id, {
                          showInAts: e.target.checked,
                        })
                      }
                      className="rounded"
                    />
                    {t.showInAts}
                  </label>
                }
              />
              <Input
                label={t.sectionTitle}
                value={section.title}
                onChange={(e) =>
                  updateCustomSection(section.id, { title: e.target.value })
                }
                placeholder="Volunteer Experience / Publications / Awards"
              />
              <div className="mt-3">
                <TagInput
                  label={t.customItems}
                  tags={section.items}
                  onChange={(items) =>
                    updateCustomSection(section.id, { items })
                  }
                  placeholder={
                    uiLocale === "id"
                      ? "Tulis poin-poin section ini..."
                      : "Write bullet points for this section..."
                  }
                />
              </div>
            </div>
          )}
        />
        <button
          type="button"
          onClick={addCustomSection}
          className={`mt-3 ${ADD_BTN}`}
        >
          <Plus className="h-4 w-4" />
          {t.addCustomSection}
        </button>
      </SectionCard>
    </div>
  );
}