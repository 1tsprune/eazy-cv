import type { ReactNode } from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Link,
} from "@react-pdf/renderer";
import { t } from "@/lib/i18n";
import { getLanguageLevelLabel } from "@/lib/language-levels";
import { EZCV_MODERN, ezcvBullets, ezcvPeriod } from "@/lib/ezcv-pdf-layout";
import {
  hasSkillContent,
  normalizeSkillGroups,
} from "@/lib/skill-groups";
import { shouldShowPhoto } from "@/lib/photo-display";
import type { ResumeConfig, ResumeData } from "@/lib/types";
import { PdfPhoto } from "./pdf-photo";

interface Props {
  data: ResumeData;
  config: ResumeConfig;
}

function Section({
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
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function createStyles() {
  const c = EZCV_MODERN;
  return StyleSheet.create({
    page: {
      paddingTop: c.pagePad,
      paddingBottom: c.pagePad,
      paddingHorizontal: c.pagePad,
      fontFamily: "Helvetica",
      fontSize: 10,
      color: c.text,
      lineHeight: 1.5,
    },
    header: {
      alignItems: "center",
      marginBottom: c.sectionGap,
    },
    photo: {
      width: 64,
      height: 64,
      borderRadius: 32,
      marginBottom: 6,
      objectFit: "cover",
    },
    name: {
      fontSize: 18,
      fontFamily: "Helvetica-Bold",
      color: c.primary,
      marginBottom: 2,
      textAlign: "center",
    },
    title: {
      fontSize: 13,
      fontFamily: "Helvetica",
      color: c.muted,
      marginBottom: 6,
      textAlign: "center",
    },
    contactLine: {
      fontSize: 9,
      color: c.text,
      textAlign: "center",
      marginBottom: 2,
      lineHeight: 1.4,
    },
    contactLink: {
      fontSize: 9,
      color: c.text,
      textDecoration: "none",
    },
    divider: {
      borderBottomWidth: 1,
      borderBottomColor: "#e0dcd7",
      borderBottomStyle: "dashed",
      marginVertical: 6,
      opacity: 0.5,
    },
    twoColumn: {
      flexDirection: "row",
    },
    leftColumn: {
      width: "33%",
      paddingRight: c.columnGap / 2,
    },
    rightColumn: {
      width: "67%",
      paddingLeft: c.columnGap / 2,
    },
    section: {
      marginBottom: c.sectionGap,
    },
    sectionTitle: {
      fontSize: 12,
      fontFamily: "Helvetica-Bold",
      color: c.primary,
      borderBottomWidth: 1.5,
      borderBottomColor: c.border,
      paddingBottom: 3,
      marginBottom: 6,
    },
    content: {
      fontSize: 10,
      color: c.text,
      lineHeight: 1.5,
    },
    contentBold: {
      fontSize: 10,
      fontFamily: "Helvetica-Bold",
      color: c.text,
    },
    subContent: {
      fontSize: 9,
      color: c.text,
      lineHeight: 1.4,
    },
    entryWrap: {
      marginBottom: 6,
    },
    entryHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 2,
    },
    entryTitle: {
      fontSize: 10,
      fontFamily: "Helvetica-Bold",
      color: c.text,
      flex: 1,
      paddingRight: 8,
    },
    entryDate: {
      fontSize: 9,
      color: c.muted,
      textAlign: "right",
      flexShrink: 0,
    },
    entrySubtitle: {
      fontSize: 10,
      color: c.muted,
      marginBottom: 2,
    },
    entryDescription: {
      fontSize: 10,
      color: c.text,
      lineHeight: 1.5,
      marginBottom: 3,
    },
    bulletList: {
      paddingLeft: 12,
    },
    bulletItem: {
      flexDirection: "row",
      marginBottom: 2,
    },
    bullet: {
      width: 10,
      fontSize: 10,
      color: c.text,
    },
    bulletText: {
      flex: 1,
      fontSize: 10,
      color: c.text,
      lineHeight: 1.5,
    },
  });
}

function ContactLines({
  data,
  styles,
}: {
  data: ResumeData;
  styles: ReturnType<typeof createStyles>;
}) {
  const { personal } = data;
  const line1 = [personal.phone, personal.email, personal.location].filter(
    Boolean,
  );
  const line2 = [personal.linkedin, personal.github, personal.website].filter(
    Boolean,
  );

  if (!line1.length && !line2.length) return null;

  return (
    <>
      {line1.length > 0 ? (
        <Text style={styles.contactLine}>{line1.join(" · ")}</Text>
      ) : null}
      {line2.length > 0 ? (
        <Text style={styles.contactLine}>
          {line2.map((item, i) => {
            const href = item.includes("://")
              ? item
              : `https://${item.replace(/^\/+/, "")}`;
            return (
              <Text key={item}>
                {i > 0 ? " · " : ""}
                <Link src={href} style={styles.contactLink}>
                  {item}
                </Link>
              </Text>
            );
          })}
        </Text>
      ) : null}
    </>
  );
}

function BulletList({
  items,
  styles,
}: {
  items: string[];
  styles: ReturnType<typeof createStyles>;
}) {
  const bullets = ezcvBullets(items);
  if (!bullets.length) return null;
  return (
    <View style={styles.bulletList}>
      {bullets.map((item, i) => (
        <View key={i} style={styles.bulletItem}>
          <Text style={styles.bullet}>•</Text>
          <Text style={styles.bulletText}>{item}</Text>
        </View>
      ))}
    </View>
  );
}

export default function PDFResumeDocument({ data, config }: Props) {
  const lang = config.language;
  const { personal } = data;
  const showPhoto = shouldShowPhoto(config, data);
  const styles = createStyles();
  const skillGroups = normalizeSkillGroups(data).filter(
    (g) => g.skills.length > 0,
  );

  return (
    <Document
      title={`${personal.fullName || "Resume"} - CV`}
      author={personal.fullName || ""}
    >
      <Page size="A4" style={styles.page} wrap>
        <View style={styles.header}>
          {showPhoto ? (
            <PdfPhoto src={personal.photo} style={styles.photo} />
          ) : null}
          <Text style={styles.name}>{personal.fullName || "Your Name"}</Text>
          {personal.title ? (
            <Text style={styles.title}>{personal.title}</Text>
          ) : null}
          <ContactLines data={data} styles={styles} />
        </View>

        <View style={styles.divider} />

        <View style={styles.twoColumn}>
          <View style={styles.leftColumn}>
            {personal.summary ? (
              <Section title={t(lang, "summary")} styles={styles}>
                <Text style={styles.content}>{personal.summary}</Text>
              </Section>
            ) : null}

            {data.educations.length > 0 ? (
              <Section title={t(lang, "education")} styles={styles}>
                {data.educations.map((edu) => (
                  <View key={edu.id} style={styles.entryWrap}>
                    <Text style={styles.contentBold}>{edu.degree}</Text>
                    <Text style={styles.content}>{edu.institution}</Text>
                    {(edu.startDate || edu.endDate) && (
                      <Text style={styles.subContent}>
                        {ezcvPeriod(
                          edu.startDate,
                          edu.endDate,
                          false,
                          lang,
                        )}
                      </Text>
                    )}
                  </View>
                ))}
              </Section>
            ) : null}

            {hasSkillContent(data) ? (
              <>
                {data.technicalSkills.length > 0 ? (
                  <Section
                    title={t(lang, "technicalSkills")}
                    styles={styles}
                  >
                    <Text style={styles.subContent}>
                      {data.technicalSkills.join(", ")}
                    </Text>
                  </Section>
                ) : null}
                {data.softSkills.length > 0 ? (
                  <Section title={t(lang, "softSkills")} styles={styles}>
                    <Text style={styles.subContent}>
                      {data.softSkills.join(", ")}
                    </Text>
                  </Section>
                ) : null}
                {data.technicalSkills.length === 0 &&
                data.softSkills.length === 0
                  ? skillGroups.map((group) => (
                      <Section
                        key={group.id}
                        title={group.name || t(lang, "technicalSkills")}
                        styles={styles}
                      >
                        <Text style={styles.subContent}>
                          {group.skills.join(", ")}
                        </Text>
                      </Section>
                    ))
                  : null}
              </>
            ) : null}

            {data.languages.length > 0 ? (
              <Section title={t(lang, "languages")} styles={styles}>
                <Text style={styles.subContent}>
                  {data.languages
                    .map(
                      (l) =>
                        `${l.name}${l.level ? ` (${getLanguageLevelLabel(l.level, lang)})` : ""}`,
                    )
                    .join(", ")}
                </Text>
              </Section>
            ) : null}

            {data.certifications.length > 0 ? (
              <Section title={t(lang, "certifications")} styles={styles}>
                <BulletList
                  items={data.certifications.map((c) =>
                    [c.name, c.issuer].filter(Boolean).join(" — "),
                  )}
                  styles={styles}
                />
              </Section>
            ) : null}
          </View>

          <View style={styles.rightColumn}>
            {data.experiences.length > 0 ? (
              <Section title={t(lang, "experience", config.cvProfile)} styles={styles}>
                {data.experiences.map((exp) => (
                  <View key={exp.id} style={styles.entryWrap} wrap={false}>
                    <View style={styles.entryHeader}>
                      <Text style={styles.entryTitle}>{exp.company}</Text>
                      <Text style={styles.entryDate}>
                        {ezcvPeriod(
                          exp.startDate,
                          exp.endDate,
                          exp.current,
                          lang,
                        )}
                      </Text>
                    </View>
                    {exp.position ? (
                      <Text style={styles.entrySubtitle}>{exp.position}</Text>
                    ) : null}
                    {exp.description ? (
                      <Text style={styles.entryDescription}>
                        {exp.description}
                      </Text>
                    ) : null}
                    <BulletList items={exp.highlights} styles={styles} />
                  </View>
                ))}
              </Section>
            ) : null}

            {data.projects.length > 0 ? (
              <Section title={t(lang, "projects")} styles={styles}>
                {data.projects.map((proj) => (
                  <View key={proj.id} style={styles.entryWrap} wrap={false}>
                    <View style={styles.entryHeader}>
                      <Text style={styles.entryTitle}>{proj.name}</Text>
                    </View>
                    {proj.description ? (
                      <Text style={styles.entryDescription}>
                        {proj.description}
                      </Text>
                    ) : null}
                    {proj.technologies.length > 0 ? (
                      <Text style={styles.subContent}>
                        {proj.technologies.join(", ")}
                      </Text>
                    ) : null}
                  </View>
                ))}
              </Section>
            ) : null}

            {data.organizations.length > 0 ? (
              <Section title={t(lang, "organizations")} styles={styles}>
                {data.organizations.map((org) => (
                  <View key={org.id} style={styles.entryWrap} wrap={false}>
                    <View style={styles.entryHeader}>
                      <Text style={styles.entryTitle}>{org.name}</Text>
                      <Text style={styles.entryDate}>
                        {ezcvPeriod(
                          org.startDate,
                          org.endDate,
                          org.current,
                          lang,
                        )}
                      </Text>
                    </View>
                    {org.role ? (
                      <Text style={styles.entrySubtitle}>{org.role}</Text>
                    ) : null}
                    <BulletList items={org.highlights} styles={styles} />
                  </View>
                ))}
              </Section>
            ) : null}
          </View>
        </View>
      </Page>
    </Document>
  );
}