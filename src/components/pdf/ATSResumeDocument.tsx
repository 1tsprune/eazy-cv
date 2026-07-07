import type { ReactNode } from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import { getLanguageLevelLabel } from "@/lib/language-levels";
import { formatAtsPeriodLine, getAtsPdfLayout } from "@/lib/pdf-ats-layout";
import { t, tAts } from "@/lib/i18n";
import type { ResumeConfig, ResumeData, SectionKey } from "@/lib/types";
import { PdfCustomSections } from "./pdf-blocks";

interface Props {
  data: ResumeData;
  config: ResumeConfig;
}

function splitLines(text: string): string[] {
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function chunkSkillLines(skills: string[], perLine = 7): string[] {
  if (skills.length <= perLine) return [skills.join(" · ")];
  const lines: string[] = [];
  for (let i = 0; i < skills.length; i += perLine) {
    lines.push(skills.slice(i, i + perLine).join(" · "));
  }
  return lines;
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

  const contact = [
    personal.phone,
    personal.email,
    personal.website,
    personal.linkedin,
    personal.github,
    personal.location,
  ].filter(Boolean);

  const sectionBlocks: Record<SectionKey, ReactNode> = {
    experience:
      data.experiences.length > 0 ? (
        <>
          <SectionHeading
            title={tAts(language, "experience")}
            style={layout}
          />
          {data.experiences.map((exp) => (
            <View key={exp.id} style={styles.entry}>
              <Text style={styles.itemTitle}>
                {exp.position}
                {exp.company ? ` · ${exp.company}` : ""}
              </Text>
              <Text style={styles.itemMeta}>
                {formatAtsPeriodLine(
                  exp.startDate,
                  exp.endDate,
                  exp.current,
                  exp.location,
                  language,
                )}
              </Text>
              {exp.description ? (
                <Text style={[styles.paragraph, { textAlign: "justify" }]}>
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
              <Text style={styles.itemTitle}>
                {edu.degree}
                {edu.institution ? ` · ${edu.institution}` : ""}
              </Text>
              <Text style={styles.itemMeta}>
                {[
                  edu.startDate && edu.endDate
                    ? `${edu.startDate} — ${edu.endDate}`
                    : edu.startDate || edu.endDate,
                  edu.gpa ? `${t(language, "gpa")}: ${edu.gpa}` : "",
                ]
                  .filter(Boolean)
                  .join(" · ")}
              </Text>
              {splitLines(edu.description).map((line, i) => (
                <Text key={i} style={styles.bullet}>
                  • {line}
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
              <Text style={styles.itemTitle}>
                {org.role}
                {org.name ? ` · ${org.name}` : ""}
              </Text>
              <Text style={styles.itemMeta}>
                {formatAtsPeriodLine(
                  org.startDate,
                  org.endDate,
                  org.current,
                  org.location,
                  language,
                )}
              </Text>
              {org.highlights.map((h, i) => (
                <Text key={i} style={styles.bullet}>
                  • {h}
                </Text>
              ))}
            </View>
          ))}
        </>
      ) : null,

    skills:
      data.technicalSkills.length > 0 || data.softSkills.length > 0 ? (
        <>
          <SectionHeading
            title={tAts(language, "technicalSkills")}
            style={layout}
          />
          {data.technicalSkills.length > 0
            ? chunkSkillLines(data.technicalSkills).map((line, i) => (
                <Text key={i} style={styles.skillsLine}>
                  {line}
                </Text>
              ))
            : null}
          {data.softSkills.length > 0 ? (
            <>
              <Text style={styles.skillGroup}>{t(language, "softSkills")}</Text>
              <Text style={styles.skillsLine}>
                {data.softSkills.join(" · ")}
              </Text>
            </>
          ) : null}
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
          {data.certifications.length >= 4 ? (
            <View style={styles.certRow}>
              <View style={styles.certCol}>
                {data.certifications
                  .slice(0, Math.ceil(data.certifications.length / 2))
                  .map((cert) => (
                    <Text
                      key={cert.id}
                      style={[styles.paragraph, { marginBottom: 4 }]}
                    >
                      {cert.name}
                      {cert.issuer ? ` — ${cert.issuer}` : ""}
                      {cert.date ? ` · ${cert.date}` : ""}
                    </Text>
                  ))}
              </View>
              <View style={styles.certCol}>
                {data.certifications
                  .slice(Math.ceil(data.certifications.length / 2))
                  .map((cert) => (
                    <Text
                      key={cert.id}
                      style={[styles.paragraph, { marginBottom: 4 }]}
                    >
                      {cert.name}
                      {cert.issuer ? ` — ${cert.issuer}` : ""}
                      {cert.date ? ` · ${cert.date}` : ""}
                    </Text>
                  ))}
              </View>
            </View>
          ) : (
            data.certifications.map((cert) => (
              <Text
                key={cert.id}
                style={[styles.paragraph, { marginBottom: 4 }]}
              >
                {cert.name}
                {cert.issuer ? ` — ${cert.issuer}` : ""}
                {cert.date ? ` · ${cert.date}` : ""}
              </Text>
            ))
          )}
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
        <View style={{ marginBottom: 2 }}>
          <Text style={styles.name}>
            {personal.fullName || "Your Name"}
          </Text>
          {personal.title ? (
            <Text style={styles.headline}>{personal.title}</Text>
          ) : null}
          {contact.length > 0 ? (
            <Text style={styles.contact}>{contact.join(" · ")}</Text>
          ) : null}
        </View>

        {personal.summary ? (
          <Text style={styles.summary}>{personal.summary}</Text>
        ) : null}

        {config.sectionOrder.map((key) => {
          const block = sectionBlocks[key];
          if (!block) return null;
          return <View key={key}>{block}</View>;
        })}
      </Page>
    </Document>
  );
}