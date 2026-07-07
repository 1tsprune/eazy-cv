import type { ReactNode } from "react";
import { Text, View, type Styles } from "@react-pdf/renderer";
import { t } from "@/lib/i18n";
import { getLanguageLevelLabel } from "@/lib/language-levels";
import {
  formatAtsEducationMeta,
  formatAtsPeriodLine,
} from "@/lib/pdf-ats-layout";
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
import { PdfCustomSections } from "./pdf-blocks";
import {
  MODERN_ENTRY_ROW_STYLES,
  ModernPdfEntryHeader,
} from "./modern-pdf-blocks";

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
  /** cv.html-style row: role left, dates right */
  experienceLayout?: "row" | "stack";
};

function periodLine(
  start: string,
  end: string,
  current: boolean | undefined,
  location: string,
  lang: Language,
): string {
  return formatAtsPeriodLine(start, end, current, location, lang);
}

function formatEduPeriod(start: string, end: string): string {
  if (start && end) return `${start} – ${end}`;
  return start || end || "";
}

function entryRowStyles(styles: ModernPdfStyles) {
  return {
    expHeader: MODERN_ENTRY_ROW_STYLES.expHeader,
    expHeaderLeft: MODERN_ENTRY_ROW_STYLES.expHeaderLeft,
    itemTitle: styles.itemTitle,
    itemTitleSub: {
      ...MODERN_ENTRY_ROW_STYLES.itemTitleSub,
      fontSize: styles.itemSub?.fontSize ?? 10,
    },
    itemMetaRight: MODERN_ENTRY_ROW_STYLES.itemMetaRight,
  };
}

function PdfEducation({
  educations,
  lang,
  styles,
  variant = "default",
  layout = "row",
}: {
  educations: ResumeData["educations"];
  lang: Language;
  styles: ModernPdfStyles;
  variant?: "default" | "compact" | "academic";
  layout?: "row" | "stack";
}) {
  if (!educations.length) return null;

  if (variant === "compact") {
    return (
      <>
        <Text style={styles.sectionTitle}>{t(lang, "education")}</Text>
        {educations.map((edu) => (
          <View key={edu.id} style={{ marginBottom: 4 }}>
            <Text style={styles.itemTitle}>
              {edu.degree} — {edu.institution}
            </Text>
            {formatEduPeriod(edu.startDate, edu.endDate) ? (
              <Text style={styles.itemSub}>
                {formatEduPeriod(edu.startDate, edu.endDate)}
              </Text>
            ) : null}
          </View>
        ))}
      </>
    );
  }

  if (variant === "academic") {
    return (
      <>
        <Text style={styles.sectionTitle}>{t(lang, "education")}</Text>
        {educations.map((edu) => (
          <View key={edu.id} style={{ marginBottom: 6 }}>
            <Text style={styles.itemTitle}>{edu.institution}</Text>
            <Text style={styles.itemSub}>
              {[
                edu.degree,
                edu.field,
                formatEduPeriod(edu.startDate, edu.endDate),
                edu.gpa ? `${t(lang, "gpa")}: ${edu.gpa}` : "",
              ]
                .filter(Boolean)
                .join(" · ")}
            </Text>
          </View>
        ))}
      </>
    );
  }

  const rowStyles = entryRowStyles(styles);

  return (
    <>
      <Text style={styles.sectionTitle}>{t(lang, "education")}</Text>
      {educations.map((edu) => (
        <View key={edu.id} style={{ marginBottom: 6 }}>
          {layout === "row" ? (
            <ModernPdfEntryHeader
              primary={
                edu.field ? `${edu.degree} — ${edu.field}` : edu.degree
              }
              secondary={edu.institution}
              period={formatAtsEducationMeta(
                edu.startDate,
                edu.endDate,
                edu.gpa,
                lang,
              )}
              styles={rowStyles}
            />
          ) : (
            <>
              <Text style={styles.itemTitle}>
                {edu.degree}
                {edu.field ? ` — ${edu.field}` : ""}
              </Text>
              <Text style={styles.itemSub}>
                {[
                  edu.institution,
                  edu.location,
                  formatEduPeriod(edu.startDate, edu.endDate),
                ]
                  .filter(Boolean)
                  .join(" · ")}
                {edu.gpa ? ` · ${t(lang, "gpa")}: ${edu.gpa}` : ""}
              </Text>
            </>
          )}
        </View>
      ))}
    </>
  );
}

function PdfOrganizations({
  organizations,
  lang,
  styles,
  layout = "row",
}: {
  organizations: ResumeData["organizations"];
  lang: Language;
  styles: ModernPdfStyles;
  layout?: "row" | "stack";
}) {
  if (!organizations.length) return null;

  const rowStyles = entryRowStyles(styles);

  return (
    <>
      <Text style={styles.sectionTitle}>{t(lang, "organizations")}</Text>
      {organizations.map((org) => (
        <View key={org.id} style={{ marginBottom: 8 }}>
          {layout === "row" ? (
            <ModernPdfEntryHeader
              primary={org.role}
              secondary={org.name}
              period={formatAtsPeriodLine(
                org.startDate,
                org.endDate,
                org.current,
                org.location,
                lang,
              )}
              styles={rowStyles}
            />
          ) : (
            <>
              <Text style={styles.itemTitle}>
                {org.role}
                {org.name ? ` — ${org.name}` : ""}
              </Text>
              <Text style={styles.itemSub}>
                {[
                  org.startDate,
                  org.endDate || (org.current ? t(lang, "present") : ""),
                  org.location,
                ]
                  .filter(Boolean)
                  .join(" · ")}
              </Text>
            </>
          )}
          {org.highlights.map((h, i) => (
            <Text key={i} style={styles.bullet}>
              • {h}
            </Text>
          ))}
        </View>
      ))}
    </>
  );
}

function PdfExperience({
  data,
  lang,
  profile,
  styles,
  sep = " — ",
  layout = "row",
}: {
  data: ResumeData;
  lang: Language;
  profile: CvProfile;
  styles: ModernPdfStyles;
  sep?: string;
  layout?: "row" | "stack";
}) {
  if (!data.experiences.length) return null;

  const rowStyles = entryRowStyles(styles);

  return (
    <>
      <Text style={styles.sectionTitle}>
        {t(lang, "experience", profile)}
      </Text>
      {data.experiences.map((exp) => (
        <View key={exp.id} style={{ marginBottom: 10 }}>
          {layout === "row" ? (
            <ModernPdfEntryHeader
              primary={exp.position}
              secondary={exp.company}
              period={periodLine(
                exp.startDate,
                exp.endDate,
                exp.current,
                exp.location,
                lang,
              )}
              styles={rowStyles}
            />
          ) : (
            <>
              <Text style={styles.itemTitle}>
                {exp.position}
                {exp.company ? `${sep}${exp.company}` : ""}
              </Text>
              <Text style={styles.itemSub}>
                {periodLine(
                  exp.startDate,
                  exp.endDate,
                  exp.current,
                  exp.location,
                  lang,
                )}
              </Text>
            </>
          )}
          {exp.description ? (
            <Text style={[styles.itemSub, { marginTop: 2 }]}>
              {exp.description}
            </Text>
          ) : null}
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
    const blocks: { title: string; text: string }[] = [];
    if (tech.length) {
      blocks.push({
        title: t(lang, "technicalSkills"),
        text: tech.join(" · "),
      });
    }
    if (soft.length) {
      blocks.push({
        title: t(lang, "softSkills"),
        text: soft.join(" · "),
      });
    }
    if (!blocks.length) {
      for (const group of groups) {
        blocks.push({
          title: group.name || t(lang, "technicalSkills"),
          text: group.skills.join(" · "),
        });
      }
    }
    if (!blocks.length) return null;
    return (
      <>
        {blocks.map((block) => (
          <View key={block.title}>
            <Text style={styles.sectionTitle}>{block.title}</Text>
            <Text style={{ fontSize: styles.itemSub?.fontSize ?? 10 }}>
              {block.text}
            </Text>
          </View>
        ))}
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
  layout = "row",
}: {
  data: ResumeData;
  lang: Language;
  styles: ModernPdfStyles;
  layout?: "row" | "stack";
}) {
  if (!data.certifications.length) return null;
  return (
    <>
      <Text style={styles.sectionTitle}>{t(lang, "certifications")}</Text>
      {data.certifications.map((cert) =>
        layout === "row" ? (
          <View
            key={cert.id}
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "baseline",
              marginBottom: 3,
            }}
          >
            <Text style={[styles.itemSub, { flex: 1, paddingRight: 8 }]}>
              {cert.name}
              {cert.issuer ? ` — ${cert.issuer}` : ""}
            </Text>
            {cert.date ? (
              <Text
                style={{
                  fontSize: 9,
                  color: "#888888",
                  flexShrink: 0,
                }}
              >
                {cert.date}
              </Text>
            ) : null}
          </View>
        ) : (
          <View key={cert.id} style={{ marginBottom: 4 }}>
            <Text style={styles.itemTitle}>{cert.name}</Text>
            <Text style={styles.itemSub}>
              {[cert.issuer, cert.date].filter(Boolean).join(" · ")}
            </Text>
          </View>
        ),
      )}
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
  const experienceSep = options.experienceSep ?? " — ";
  const experienceLayout = options.experienceLayout ?? "row";
  const certLayout = experienceLayout;

  const blocks: Record<SectionKey, ReactNode> = {
    experience: skip.has("experience") ? null : (
      <PdfExperience
        data={data}
        lang={lang}
        profile={config.cvProfile}
        styles={styles}
        sep={experienceSep}
        layout={experienceLayout}
      />
    ),
    education: skip.has("education") ? null : (
      <PdfEducation
        educations={data.educations}
        lang={lang}
        styles={styles}
        variant={educationVariant}
        layout={experienceLayout}
      />
    ),
    organizations: skip.has("organizations") ? null : (
      <PdfOrganizations
        organizations={data.organizations}
        lang={lang}
        styles={styles}
        layout={experienceLayout}
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
      <PdfCertifications
        data={data}
        lang={lang}
        styles={styles}
        layout={certLayout}
      />
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
  const groups = normalizeSkillGroups(data).filter((g) => g.skills.length > 0);
  const tech = data.technicalSkills;

  if (tech.length > 0) {
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

  if (!groups.length) return null;

  return (
    <>
      {groups.map((group) => (
        <View key={group.id}>
          {group.name ? (
            <Text style={labelStyle}>{group.name}</Text>
          ) : null}
          {group.skills.map((s) => (
            <Text key={s} style={textStyle}>
              {s}
            </Text>
          ))}
        </View>
      ))}
    </>
  );
}