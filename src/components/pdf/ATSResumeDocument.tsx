import type { ReactElement, ReactNode } from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Link,
} from "@react-pdf/renderer";
import { t, tAts } from "@/lib/i18n";
import { getLanguageLevelLabel } from "@/lib/language-levels";
import { EZCV_ATS, ezcvBullets, ezcvPeriod } from "@/lib/ezcv-pdf-layout";
import {
  hasSkillContent,
  normalizeSkillGroups,
} from "@/lib/skill-groups";
import { getPdfSheetTokens } from "@/lib/typography";
import type { ResumeConfig, ResumeData, SectionKey } from "@/lib/types";
import { PdfCustomSections } from "./pdf-blocks";

interface Props {
  data: ResumeData;
  config: ResumeConfig;
}

function createStyles(config: ResumeConfig) {
  const s = EZCV_ATS;
  const tk = getPdfSheetTokens(config);
  return StyleSheet.create({
    page: {
      paddingTop: s.pageMargin,
      paddingBottom: s.pageMargin,
      paddingHorizontal: s.pageMargin,
      fontFamily: tk.fontFamily,
      fontSize: tk.base,
      color: "#000000",
      lineHeight: tk.lh,
    },
    header: {
      alignItems: "center",
      marginBottom: 4,
    },
    name: {
      fontSize: tk.xl,
      fontFamily: tk.headingFamily,
      color: "#000000",
      textAlign: "center",
      marginBottom: 14,
      textTransform: "uppercase",
    },
    position: {
      fontSize: tk.sm,
      color: "#333333",
      textAlign: "center",
    },
    contactSection: {
      alignItems: "center",
      marginBottom: s.sectionGap,
      marginTop: 4,
    },
    contactInline: {
      fontSize: tk.xs,
      color: "#000000",
      textAlign: "center",
      marginBottom: 1,
    },
    contactLink: {
      fontSize: tk.xs,
      color: "#000000",
      textDecoration: "none",
    },
    summary: {
      fontSize: tk.base,
      color: "#000000",
      lineHeight: tk.lh,
      textAlign: "justify",
      marginBottom: s.sectionGap,
    },
    section: {
      marginTop: s.sectionGap,
    },
    sectionHeading: {
      fontSize: tk.md,
      fontFamily: tk.headingFamily,
      color: "#000000",
      marginBottom: 4,
      paddingBottom: 2,
      borderBottomWidth: 0.75,
      borderBottomColor: "#000000",
    },
    body: {
      fontSize: tk.base,
      color: "#000000",
      lineHeight: tk.lh,
    },
    muted: {
      fontSize: tk.xs,
      color: "#333333",
    },
    entryWrap: {
      marginBottom: s.itemGap,
    },
    entryRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
    },
    entryTitle: {
      fontSize: tk.base,
      fontFamily: tk.headingFamily,
      color: "#000000",
      flex: 1,
      paddingRight: 8,
    },
    entrySubtitle: {
      fontSize: tk.base,
      color: "#000000",
    },
    entryDate: {
      fontSize: tk.xs,
      color: "#000000",
      textAlign: "right",
      flexShrink: 0,
    },
    entryDescription: {
      fontSize: tk.base,
      color: "#000000",
      lineHeight: tk.lh,
      marginTop: 2,
    },
    bulletList: {
      paddingLeft: s.bulletIndent,
      marginTop: 2,
    },
    bulletItem: {
      fontSize: tk.base,
      color: "#000000",
      lineHeight: tk.lh,
      marginBottom: 1,
    },
    skillList: {
      fontSize: tk.base,
      color: "#000000",
    },
  });
}

function AtsSection({
  title,
  children,
  styles,
}: {
  title: string;
  children: ReactNode;
  styles: ReturnType<typeof createStyles>;
}) {
  if (!children) return null;
  return (
    <View style={styles.section}>
      <Text style={styles.sectionHeading}>{title}</Text>
      {children}
    </View>
  );
}

function AtsContact({ data, styles }: { data: ResumeData; styles: ReturnType<typeof createStyles> }) {
  const { personal } = data;
  const line1 = [personal.location, personal.email, personal.phone].filter(Boolean);
  const line2 = [personal.linkedin, personal.github, personal.website].filter(Boolean);

  if (!line1.length && !line2.length) return null;

  return (
    <View style={styles.contactSection}>
      {line1.length > 0 ? (
        <Text style={styles.contactInline}>{line1.join(" · ")}</Text>
      ) : null}
      {line2.length > 0 ? (
        <Text style={styles.contactInline}>
          {line2.map((item, i) => (
            <Text key={item}>
              {i > 0 ? " · " : ""}
              <Link
                src={item.includes("://") ? item : `https://${item}`}
                style={styles.contactLink}
              >
                {item}
              </Link>
            </Text>
          ))}
        </Text>
      ) : null}
    </View>
  );
}

function buildAtsSectionBlocks(
  data: ResumeData,
  config: ResumeConfig,
  styles: ReturnType<typeof createStyles>,
): Record<SectionKey, ReactElement | null> {
  const lang = config.language;
  const skillGroups = normalizeSkillGroups(data).filter((g) => g.skills.length > 0);

  const skillsBlocks: ReactElement[] = [];
  if (data.technicalSkills.length > 0) {
    skillsBlocks.push(
      <AtsSection
        key="technical"
        title={tAts(lang, "technicalSkills")}
        styles={styles}
      >
        <Text style={styles.skillList}>{data.technicalSkills.join(", ")}</Text>
      </AtsSection>,
    );
  }
  if (data.softSkills.length > 0) {
    skillsBlocks.push(
      <AtsSection key="soft" title={t(lang, "softSkills")} styles={styles}>
        <Text style={styles.skillList}>{data.softSkills.join(", ")}</Text>
      </AtsSection>,
    );
  }
  if (
    hasSkillContent(data) &&
    data.technicalSkills.length === 0 &&
    data.softSkills.length === 0
  ) {
    for (const group of skillGroups) {
      skillsBlocks.push(
        <AtsSection
          key={group.id}
          title={group.name || tAts(lang, "technicalSkills")}
          styles={styles}
        >
          <Text style={styles.skillList}>{group.skills.join(", ")}</Text>
        </AtsSection>,
      );
    }
  }

  return {
    experience:
      data.experiences.length > 0 ? (
        <AtsSection
          title={tAts(lang, "experience", config.cvProfile)}
          styles={styles}
        >
          {data.experiences.map((exp) => (
            <View key={exp.id} style={styles.entryWrap}>
              <View style={styles.entryRow}>
                <Text style={styles.entryTitle}>{exp.company}</Text>
                <Text style={styles.entryDate}>
                  {ezcvPeriod(exp.startDate, exp.endDate, exp.current, lang)}
                </Text>
              </View>
              {exp.position ? (
                <Text style={styles.entrySubtitle}>{exp.position}</Text>
              ) : null}
              {exp.description ? (
                <Text style={styles.entryDescription}>{exp.description}</Text>
              ) : null}
              {ezcvBullets(exp.highlights).length > 0 ? (
                <View style={styles.bulletList}>
                  {ezcvBullets(exp.highlights).map((h, i) => (
                    <Text key={i} style={styles.bulletItem}>
                      • {h}
                    </Text>
                  ))}
                </View>
              ) : null}
            </View>
          ))}
        </AtsSection>
      ) : null,
    education:
      data.educations.length > 0 ? (
        <AtsSection title={t(lang, "education")} styles={styles}>
          {data.educations.map((edu) => {
            const degreeLine = [edu.degree, edu.field]
              .filter(Boolean)
              .join(" — ");
            const dateMeta = [
              ezcvPeriod(edu.startDate, edu.endDate, false, lang),
              edu.gpa ? `${t(lang, "gpa")}: ${edu.gpa}` : "",
            ]
              .filter(Boolean)
              .join(" · ");
            const bullets = ezcvBullets(edu.highlights);

            return (
              <View key={edu.id} style={styles.entryWrap}>
                <View style={styles.entryRow}>
                  <Text style={styles.entryTitle}>{degreeLine}</Text>
                  <Text style={styles.entryDate}>{dateMeta}</Text>
                </View>
                <Text style={styles.entrySubtitle}>
                  {[edu.institution, edu.location].filter(Boolean).join(" · ")}
                </Text>
                {bullets.length > 0 ? (
                  <View style={styles.bulletList}>
                    {bullets.map((h, i) => (
                      <Text key={i} style={styles.bulletItem}>
                        • {h}
                      </Text>
                    ))}
                  </View>
                ) : null}
              </View>
            );
          })}
        </AtsSection>
      ) : null,
    organizations:
      data.organizations.length > 0 ? (
        <AtsSection title={tAts(lang, "organizations")} styles={styles}>
          {data.organizations.map((org) => (
            <View key={org.id} style={styles.entryWrap}>
              <View style={styles.entryRow}>
                <Text style={styles.entryTitle}>{org.name}</Text>
                <Text style={styles.entryDate}>
                  {ezcvPeriod(org.startDate, org.endDate, org.current, lang)}
                </Text>
              </View>
              {org.role ? (
                <Text style={styles.entrySubtitle}>{org.role}</Text>
              ) : null}
              {ezcvBullets(org.highlights).length > 0 ? (
                <View style={styles.bulletList}>
                  {ezcvBullets(org.highlights).map((h, i) => (
                    <Text key={i} style={styles.bulletItem}>
                      • {h}
                    </Text>
                  ))}
                </View>
              ) : null}
            </View>
          ))}
        </AtsSection>
      ) : null,
    skills:
      skillsBlocks.length > 0 ? (
        <View>{skillsBlocks}</View>
      ) : null,
    projects: null,
    certifications:
      data.certifications.length > 0 ? (
        <AtsSection title={t(lang, "certifications")} styles={styles}>
          {data.certifications.map((cert) => (
            <Text key={cert.id} style={styles.body}>
              • {[cert.name, cert.issuer, cert.date].filter(Boolean).join(" — ")}
            </Text>
          ))}
        </AtsSection>
      ) : null,
    languages:
      data.languages.length > 0 ? (
        <AtsSection title={t(lang, "languages")} styles={styles}>
          <Text style={styles.skillList}>
            {data.languages
              .map(
                (l) =>
                  `${l.name}${l.level ? ` (${getLanguageLevelLabel(l.level, lang)})` : ""}`,
              )
              .join(", ")}
          </Text>
        </AtsSection>
      ) : null,
    custom: data.customSections.some((s) => s.showInAts && s.title) ? (
      <PdfCustomSections
        sections={data.customSections}
        styles={{
          sectionTitle: styles.sectionHeading,
          bullet: styles.bulletItem,
        }}
        atsOnly
      />
    ) : null,
  };
}

export default function ATSResumeDocument({ data, config }: Props) {
  const { personal } = data;
  const styles = createStyles(config);
  const blocks = buildAtsSectionBlocks(data, config, styles);
  const order = config.sectionOrder ?? [];

  return (
    <Document title={`${personal.fullName || "Resume"} - ATS`}>
      <Page size="A4" style={styles.page} wrap>
        {personal.fullName ? (
          <View style={styles.header}>
            <Text style={styles.name}>{personal.fullName}</Text>
            {personal.title ? (
              <Text style={styles.position}>{personal.title}</Text>
            ) : null}
          </View>
        ) : null}

        <AtsContact data={data} styles={styles} />

        {personal.summary ? (
          <Text style={styles.summary}>{personal.summary}</Text>
        ) : null}

        {order.map((key) => {
          const block = blocks[key];
          if (!block) return null;
          return <View key={key}>{block}</View>;
        })}
      </Page>
    </Document>
  );
}