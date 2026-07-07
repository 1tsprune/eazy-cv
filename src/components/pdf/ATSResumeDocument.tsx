import type { ReactNode } from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import { t, tAts } from "@/lib/i18n";
import { getPdfSheetTokens } from "@/lib/typography";
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

export default function ATSResumeDocument({ data, config }: Props) {
  const tk = getPdfSheetTokens(config);
  const language = config.language;

  const styles = StyleSheet.create({
    page: {
      padding: 44,
      fontFamily: tk.fontFamily,
      fontSize: tk.base,
      lineHeight: tk.lh,
      color: "#111",
    },
    header: {
      marginBottom: 12,
      paddingBottom: 10,
      borderBottomWidth: 1,
      borderBottomColor: "#ccc",
    },
    name: {
      fontSize: tk.xl,
      fontFamily: tk.headingFamily,
      marginBottom: 2,
    },
    title: {
      fontSize: tk.md,
      fontFamily: tk.bodyFamily,
      color: "#444",
      marginBottom: 6,
    },
    contact: {
      fontSize: tk.xs,
      fontFamily: tk.bodyFamily,
      color: "#555",
      lineHeight: tk.lh + 0.15,
    },
    summary: {
      fontFamily: tk.bodyFamily,
      fontSize: tk.sm,
      lineHeight: tk.lh + 0.1,
      color: "#333",
      textAlign: "justify",
      marginBottom: 4,
    },
    sectionTitle: {
      fontSize: tk.sm,
      fontFamily: tk.headingFamily,
      textTransform: "uppercase",
      letterSpacing: 1.2,
      borderBottomWidth: 1,
      borderBottomColor: "#ddd",
      paddingBottom: 3,
      marginTop: 12,
      marginBottom: 6,
      color: "#222",
    },
    skillGroupTitle: {
      fontFamily: tk.headingFamily,
      fontSize: tk.sm,
      marginTop: 4,
      marginBottom: 2,
      color: "#333",
    },
    itemTitle: {
      fontFamily: tk.headingFamily,
      fontSize: tk.md,
      marginBottom: 1,
    },
    itemSub: {
      fontFamily: tk.bodyFamily,
      fontSize: tk.xs,
      color: "#555",
      marginBottom: 3,
    },
    body: {
      fontFamily: tk.bodyFamily,
      fontSize: tk.sm,
      lineHeight: tk.lh,
      color: "#333",
    },
    bodyJustify: {
      fontFamily: tk.bodyFamily,
      fontSize: tk.sm,
      lineHeight: tk.lh + 0.05,
      color: "#333",
      textAlign: "justify",
    },
    bullet: {
      fontFamily: tk.bodyFamily,
      fontSize: tk.sm,
      marginLeft: 10,
      marginBottom: 2,
      lineHeight: tk.lh,
      color: "#333",
    },
    skillsLine: {
      fontFamily: tk.bodyFamily,
      fontSize: tk.sm,
      lineHeight: tk.lh + 0.1,
      color: "#333",
      marginBottom: 4,
    },
    certCol: {
      width: "48%",
    },
    certRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      gap: 12,
    },
    block: {
      marginBottom: 8,
    },
  });

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
        <View>
          <Text style={styles.sectionTitle}>{tAts(language, "experience")}</Text>
          {data.experiences.map((exp) => (
            <View key={exp.id} style={styles.block}>
              <Text style={styles.itemTitle}>
                {exp.position}
                {exp.company ? ` · ${exp.company}` : ""}
              </Text>
              <Text style={styles.itemSub}>
                {[
                  exp.startDate,
                  exp.endDate || (exp.current ? t(language, "present") : ""),
                  exp.location,
                ]
                  .filter(Boolean)
                  .join(" · ")}
              </Text>
              {exp.description ? (
                <Text style={[styles.bodyJustify, { marginBottom: 2 }]}>
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
        </View>
      ) : null,

    education:
      data.educations.length > 0 ? (
        <View>
          <Text style={styles.sectionTitle}>{t(language, "education")}</Text>
          {data.educations.map((edu) => (
            <View key={edu.id} style={{ marginBottom: 6 }}>
              <Text style={styles.itemTitle}>
                {edu.degree}
                {edu.institution ? ` · ${edu.institution}` : ""}
              </Text>
              <Text style={styles.itemSub}>
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
        </View>
      ) : null,

    organizations:
      data.organizations.length > 0 ? (
        <View>
          <Text style={styles.sectionTitle}>
            {tAts(language, "organizations")}
          </Text>
          {data.organizations.map((org) => (
            <View key={org.id} style={styles.block}>
              <Text style={styles.itemTitle}>
                {org.role}
                {org.name ? ` · ${org.name}` : ""}
              </Text>
              <Text style={styles.itemSub}>
                {[
                  org.startDate,
                  org.endDate || (org.current ? t(language, "present") : ""),
                  org.location,
                ]
                  .filter(Boolean)
                  .join(" · ")}
              </Text>
              {org.highlights.map((h, i) => (
                <Text key={i} style={styles.bullet}>
                  • {h}
                </Text>
              ))}
            </View>
          ))}
        </View>
      ) : null,

    skills:
      data.technicalSkills.length > 0 || data.softSkills.length > 0 ? (
        <View>
          <Text style={styles.sectionTitle}>
            {tAts(language, "technicalSkills")}
          </Text>
          {data.technicalSkills.length > 0 ? (
            <Text style={styles.skillsLine}>
              {data.technicalSkills.join(" · ")}
            </Text>
          ) : null}
          {data.softSkills.length > 0 ? (
            <>
              <Text style={styles.skillGroupTitle}>
                {t(language, "softSkills")}
              </Text>
              <Text style={styles.skillsLine}>
                {data.softSkills.join(" · ")}
              </Text>
            </>
          ) : null}
        </View>
      ) : null,

    projects: null,

    certifications:
      data.certifications.length > 0 ? (
        <View>
          <Text style={styles.sectionTitle}>
            {t(language, "certifications")}
          </Text>
          {data.certifications.length >= 4 ? (
            <View style={styles.certRow}>
              <View style={styles.certCol}>
                {data.certifications
                  .filter((_, i) => i % 2 === 0)
                  .map((cert) => (
                    <Text
                      key={cert.id}
                      style={[styles.body, { marginBottom: 4 }]}
                    >
                      {cert.name}
                      {cert.issuer ? ` — ${cert.issuer}` : ""}
                      {cert.date ? ` · ${cert.date}` : ""}
                    </Text>
                  ))}
              </View>
              <View style={styles.certCol}>
                {data.certifications
                  .filter((_, i) => i % 2 === 1)
                  .map((cert) => (
                    <Text
                      key={cert.id}
                      style={[styles.body, { marginBottom: 4 }]}
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
              <Text key={cert.id} style={[styles.body, { marginBottom: 4 }]}>
                {cert.name}
                {cert.issuer ? ` — ${cert.issuer}` : ""}
                {cert.date ? ` · ${cert.date}` : ""}
              </Text>
            ))
          )}
        </View>
      ) : null,

    languages:
      data.languages.length > 0 ? (
        <View>
          <Text style={styles.sectionTitle}>{t(language, "languages")}</Text>
          <Text style={styles.skillsLine}>
            {data.languages
              .map((l) => `${l.name}${l.level ? ` (${l.level})` : ""}`)
              .join(" · ")}
          </Text>
        </View>
      ) : null,

    custom: data.customSections.some((s) => s.showInAts && s.title) ? (
      <PdfCustomSections
        sections={data.customSections}
        styles={{ sectionTitle: styles.sectionTitle, bullet: styles.bullet }}
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
            <Text style={styles.title}>{personal.title}</Text>
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
          return block ? <View key={key}>{block}</View> : null;
        })}
      </Page>
    </Document>
  );
}