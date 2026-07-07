import type { ReactNode } from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import { getLanguageLevelLabel } from "@/lib/language-levels";
import {
  formatAtsEducationMeta,
  formatAtsPeriodLine,
  getAtsPdfLayout,
  splitAtsProseLines,
} from "@/lib/pdf-ats-layout";
import {
  chunkSkillLines,
  hasSkillContent,
  normalizeSkillGroups,
} from "@/lib/skill-groups";
import { t, tAts } from "@/lib/i18n";
import type { ResumeConfig, ResumeData, SectionKey } from "@/lib/types";
import { cvContactItems, PdfContactInline } from "./pdf-contact";
import { PdfCustomSections } from "./pdf-blocks";
import { AtsPdfBullet, AtsPdfEntryHeader } from "./ats-pdf-blocks";

interface Props {
  data: ResumeData;
  config: ResumeConfig;
}

function SectionHeading({
  title,
  style,
}: {
  title: string;
  style: ReturnType<typeof getAtsPdfLayout>["sheet"];
}) {
  return (
    <Text style={style.sectionTitle} minPresenceAhead={24}>
      {title}
    </Text>
  );
}

export default function ATSResumeDocument({ data, config }: Props) {
  const { sheet: layout } = getAtsPdfLayout(config);
  const styles = StyleSheet.create(layout);
  const language = config.language;
  const { personal } = data;

  const contact = cvContactItems(personal);
  const skillGroups = normalizeSkillGroups(data).filter(
    (g) => g.skills.length > 0,
  );
  const skillsMid = Math.ceil(skillGroups.length / 2);

  const sectionBlocks: Record<SectionKey, ReactNode> = {
    experience:
      data.experiences.length > 0 ? (
        <>
          <SectionHeading
            title={tAts(language, "experience", config.cvProfile)}
            style={layout}
          />
          {data.experiences.map((exp) => (
            <View key={exp.id} style={styles.entry} wrap={false}>
              <AtsPdfEntryHeader
                primary={exp.position}
                secondary={exp.company}
                period={formatAtsPeriodLine(
                  exp.startDate,
                  exp.endDate,
                  exp.current,
                  exp.location,
                  language,
                )}
                styles={styles}
              />
              {exp.description ? (
                <Text style={styles.paragraph}>{exp.description}</Text>
              ) : null}
              {exp.highlights.map((h, i) => (
                <AtsPdfBullet key={i} text={h} bulletStyle={styles.bullet} />
              ))}
            </View>
          ))}
        </>
      ) : null,

    education:
      data.educations.length > 0 ? (
        <>
          <SectionHeading
            title={t(language, "education")}
            style={layout}
          />
          {data.educations.map((edu) => (
            <View key={edu.id} style={styles.entry}>
              <AtsPdfEntryHeader
                primary={edu.degree}
                secondary={edu.institution}
                period={formatAtsEducationMeta(
                  edu.startDate,
                  edu.endDate,
                  edu.gpa,
                  language,
                )}
                styles={styles}
              />
              {splitAtsProseLines(edu.description).map((line, i) => (
                <Text key={i} style={styles.paragraph}>
                  {line}
                </Text>
              ))}
            </View>
          ))}
        </>
      ) : null,

    organizations:
      data.organizations.length > 0 ? (
        <>
          <SectionHeading
            title={tAts(language, "organizations")}
            style={layout}
          />
          {data.organizations.map((org) => (
            <View key={org.id} style={styles.entry}>
              <AtsPdfEntryHeader
                primary={org.role}
                secondary={org.name}
                period={formatAtsPeriodLine(
                  org.startDate,
                  org.endDate,
                  org.current,
                  org.location,
                  language,
                )}
                styles={styles}
              />
              {org.highlights.map((h, i) => (
                <AtsPdfBullet key={i} text={h} bulletStyle={styles.bullet} />
              ))}
            </View>
          ))}
        </>
      ) : null,

    skills: hasSkillContent(data) ? (
        <>
          <SectionHeading
            title={tAts(language, "technicalSkills")}
            style={layout}
          />
          <View style={styles.skillsGrid}>
            {[0, 1].map((col) => (
              <View key={col} style={styles.skillsCol}>
                {skillGroups
                  .slice(
                    col === 0 ? 0 : skillsMid,
                    col === 0 ? skillsMid : undefined,
                  )
                  .map((group) => (
                    <View key={group.id} style={{ marginBottom: 8 }}>
                      {group.name ? (
                        <Text style={styles.skillGroup}>{group.name}</Text>
                      ) : null}
                      {chunkSkillLines(group.skills).map((line, i) => (
                        <Text key={i} style={styles.skillsLine}>
                          {line}
                        </Text>
                      ))}
                    </View>
                  ))}
              </View>
            ))}
          </View>
        </>
      ) : null,

    projects: null,

    certifications:
      data.certifications.length > 0 ? (
        <>
          <SectionHeading
            title={t(language, "certifications")}
            style={layout}
          />
          {data.certifications.map((cert) => (
            <View key={cert.id} style={styles.certRow}>
              <Text style={styles.certItem}>
                {cert.name}
                {cert.issuer ? ` — ${cert.issuer}` : ""}
              </Text>
              {cert.date ? (
                <Text style={styles.certDate}>{cert.date}</Text>
              ) : null}
            </View>
          ))}
        </>
      ) : null,

    languages:
      data.languages.length > 0 ? (
        <>
          <SectionHeading
            title={t(language, "languages")}
            style={layout}
          />
          <Text style={styles.skillsLine}>
            {data.languages
              .map(
                (l) =>
                  `${l.name}${l.level ? ` (${getLanguageLevelLabel(l.level, language)})` : ""}`,
              )
              .join(" · ")}
          </Text>
        </>
      ) : null,

    custom: data.customSections.some((s) => s.showInAts && s.title) ? (
      <PdfCustomSections
        sections={data.customSections}
        styles={{
          sectionTitle: styles.sectionTitle,
          bullet: styles.bullet,
        }}
        atsOnly
      />
    ) : null,
  };

  return (
    <Document>
      <Page size="A4" style={styles.page} wrap>
        <View style={styles.header}>
          <Text style={styles.name}>
            {personal.fullName || "Your Name"}
          </Text>
          {personal.title ? (
            <Text style={styles.headline}>{personal.title}</Text>
          ) : null}
          <PdfContactInline
            items={contact}
            style={styles.contact}
            linkColor={layout.contact.linkColor as string}
          />
        </View>

        {personal.summary ? (
          <Text style={styles.summary}>{personal.summary}</Text>
        ) : null}

        {(() => {
          let visible = 0;
          return config.sectionOrder.map((key) => {
            const block = sectionBlocks[key];
            if (!block) return null;
            const gap = visible++ > 0 ? { marginTop: 18 } : undefined;
            return (
              <View key={key} style={gap}>
                {block}
              </View>
            );
          });
        })()}
      </Page>
    </Document>
  );
}