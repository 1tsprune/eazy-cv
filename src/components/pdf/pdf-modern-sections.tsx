import type { ReactNode } from "react";
import { Text, View, type Styles } from "@react-pdf/renderer";
import { t } from "@/lib/i18n";
import { getLanguageLevelLabel } from "@/lib/language-levels";
import {
  hasSkillContent,
  normalizeSkillGroups,
} from "@/lib/skill-groups";
import type {
  CvProfile,
  Language,
  ResumeConfig,
  ResumeData,
  SectionKey,
} from "@/lib/types";
import {
  PdfCustomSections,
  PdfEducation,
  PdfOrganizations,
} from "./pdf-blocks";

export type ModernPdfStyles = {
  sectionTitle: Styles[keyof Styles];
  itemTitle: Styles[keyof Styles];
  itemSub: Styles[keyof Styles];
  bullet: Styles[keyof Styles];
  tag?: Styles[keyof Styles];
};

type BodyOptions = {
  skipSections?: SectionKey[];
  educationVariant?: "default" | "compact" | "academic";
  skillDisplay?: "tags" | "inline";
  experienceSep?: string;
};

function PdfExperience({
  data,
  lang,
  profile,
  styles,
  sep = " @ ",
}: {
  data: ResumeData;
  lang: Language;
  profile: CvProfile;
  styles: ModernPdfStyles;
  sep?: string;
}) {
  if (!data.experiences.length) return null;
  return (
    <>
      <Text style={styles.sectionTitle}>
        {t(lang, "experience", profile)}
      </Text>
      {data.experiences.map((exp) => (
        <View key={exp.id} style={{ marginBottom: 8 }} wrap={false}>
          <Text style={styles.itemTitle}>
            {exp.position}
            {exp.company ? `${sep}${exp.company}` : ""}
          </Text>
          <Text style={styles.itemSub}>
            {[
              exp.startDate,
              exp.endDate || (exp.current ? t(lang, "present") : ""),
              exp.location,
            ]
              .filter(Boolean)
              .join(" — ")}
          </Text>
          {exp.highlights.map((h, i) => (
            <Text key={i} style={styles.bullet}>
              • {h}
            </Text>
          ))}
        </View>
      ))}
    </>
  );
}

function PdfSkills({
  data,
  lang,
  styles,
  display,
}: {
  data: ResumeData;
  lang: Language;
  styles: ModernPdfStyles;
  display: "tags" | "inline";
}) {
  if (!hasSkillContent(data)) return null;

  const groups = normalizeSkillGroups(data).filter((g) => g.skills.length > 0);
  const tech = data.technicalSkills;
  const soft = data.softSkills;

  if (display === "inline") {
    const parts: string[] = [];
    if (tech.length) parts.push(tech.join(" · "));
    if (soft.length) parts.push(soft.join(" · "));
    if (!parts.length) return null;
    return (
      <>
        <Text style={styles.sectionTitle}>{t(lang, "technicalSkills")}</Text>
        <Text style={{ fontSize: styles.itemSub?.fontSize ?? 10 }}>
          {parts.join(" · ")}
        </Text>
      </>
    );
  }

  return (
    <>
      {tech.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>{t(lang, "technicalSkills")}</Text>
          {styles.tag ? (
            <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
              {tech.map((s) => (
                <Text key={s} style={styles.tag}>
                  {s}
                </Text>
              ))}
            </View>
          ) : (
            <Text style={styles.itemSub}>{tech.join(", ")}</Text>
          )}
        </>
      )}
      {soft.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>{t(lang, "softSkills")}</Text>
          {styles.tag ? (
            <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
              {soft.map((s) => (
                <Text key={s} style={styles.tag}>
                  {s}
                </Text>
              ))}
            </View>
          ) : (
            <Text style={styles.itemSub}>{soft.join(", ")}</Text>
          )}
        </>
      )}
      {groups.length > 0 && tech.length === 0 && soft.length === 0
        ? groups.map((group) => (
            <View key={group.id}>
              {group.name ? (
                <Text style={styles.sectionTitle}>{group.name}</Text>
              ) : null}
              {styles.tag ? (
                <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                  {group.skills.map((s) => (
                    <Text key={s} style={styles.tag}>
                      {s}
                    </Text>
                  ))}
                </View>
              ) : (
                <Text style={styles.itemSub}>{group.skills.join(", ")}</Text>
              )}
            </View>
          ))
        : null}
    </>
  );
}

function PdfProjects({
  data,
  lang,
  styles,
}: {
  data: ResumeData;
  lang: Language;
  styles: ModernPdfStyles;
}) {
  if (!data.projects.length) return null;
  return (
    <>
      <Text style={styles.sectionTitle}>{t(lang, "projects")}</Text>
      {data.projects.map((p) => (
        <View key={p.id} style={{ marginBottom: 6 }}>
          <Text style={styles.itemTitle}>{p.name}</Text>
          {p.description ? (
            <Text style={styles.itemSub}>{p.description}</Text>
          ) : null}
          {p.technologies.length > 0 ? (
            <Text style={styles.itemSub}>{p.technologies.join(", ")}</Text>
          ) : null}
        </View>
      ))}
    </>
  );
}

function PdfCertifications({
  data,
  lang,
  styles,
}: {
  data: ResumeData;
  lang: Language;
  styles: ModernPdfStyles;
}) {
  if (!data.certifications.length) return null;
  return (
    <>
      <Text style={styles.sectionTitle}>{t(lang, "certifications")}</Text>
      {data.certifications.map((cert) => (
        <View key={cert.id} style={{ marginBottom: 4 }}>
          <Text style={styles.itemTitle}>{cert.name}</Text>
          <Text style={styles.itemSub}>
            {[cert.issuer, cert.date].filter(Boolean).join(" · ")}
          </Text>
        </View>
      ))}
    </>
  );
}

function PdfLanguages({
  data,
  lang,
  styles,
}: {
  data: ResumeData;
  lang: Language;
  styles: ModernPdfStyles;
}) {
  if (!data.languages.length) return null;
  return (
    <>
      <Text style={styles.sectionTitle}>{t(lang, "languages")}</Text>
      <Text style={styles.itemSub}>
        {data.languages
          .map(
            (l) =>
              `${l.name}${l.level ? ` (${getLanguageLevelLabel(l.level, lang)})` : ""}`,
          )
          .join(" · ")}
      </Text>
    </>
  );
}

export function PdfModernBody({
  data,
  config,
  styles,
  options = {},
}: {
  data: ResumeData;
  config: ResumeConfig;
  styles: ModernPdfStyles;
  options?: BodyOptions;
}) {
  const lang = config.language;
  const skip = new Set(options.skipSections ?? []);
  const educationVariant = options.educationVariant ?? "default";
  const skillDisplay = options.skillDisplay ?? "tags";
  const experienceSep = options.experienceSep ?? " @ ";

  const blocks: Record<SectionKey, ReactNode> = {
    experience: skip.has("experience") ? null : (
      <PdfExperience
        data={data}
        lang={lang}
        profile={config.cvProfile}
        styles={styles}
        sep={experienceSep}
      />
    ),
    education: skip.has("education") ? null : (
      <PdfEducation
        educations={data.educations}
        lang={lang}
        styles={styles}
        variant={educationVariant}
      />
    ),
    organizations: skip.has("organizations") ? null : (
      <PdfOrganizations
        organizations={data.organizations}
        lang={lang}
        styles={styles}
      />
    ),
    skills: skip.has("skills") ? null : (
      <PdfSkills
        data={data}
        lang={lang}
        styles={styles}
        display={skillDisplay}
      />
    ),
    projects: skip.has("projects") ? null : (
      <PdfProjects data={data} lang={lang} styles={styles} />
    ),
    certifications: skip.has("certifications") ? null : (
      <PdfCertifications data={data} lang={lang} styles={styles} />
    ),
    languages: skip.has("languages") ? null : (
      <PdfLanguages data={data} lang={lang} styles={styles} />
    ),
    custom: skip.has("custom") ? null : (
      <PdfCustomSections
        sections={data.customSections}
        styles={{
          sectionTitle: styles.sectionTitle,
          bullet: styles.bullet,
        }}
      />
    ),
  };

  return (
    <>
      {config.sectionOrder.map((key) => {
        const block = blocks[key];
        if (!block) return null;
        return <View key={key}>{block}</View>;
      })}
    </>
  );
}

export function PdfSidebarSkills({
  data,
  lang,
  textStyle,
  labelStyle,
}: {
  data: ResumeData;
  lang: Language;
  textStyle: Styles[keyof Styles];
  labelStyle: Styles[keyof Styles];
}) {
  const tech = data.technicalSkills;
  if (!tech.length) return null;
  return (
    <>
      <Text style={labelStyle}>{t(lang, "technicalSkills")}</Text>
      {tech.map((s) => (
        <Text key={s} style={textStyle}>
          {s}
        </Text>
      ))}
    </>
  );
}