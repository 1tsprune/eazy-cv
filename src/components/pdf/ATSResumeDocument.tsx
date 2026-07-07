import type { ReactNode } from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import { t } from "@/lib/i18n";
import { getPdfSheetTokens } from "@/lib/typography";
import type { ResumeConfig, ResumeData, SectionKey } from "@/lib/types";
import { PdfCustomSections } from "./pdf-blocks";

interface Props {
  data: ResumeData;
  config: ResumeConfig;
}

export default function ATSResumeDocument({ data, config }: Props) {
  const tk = getPdfSheetTokens(config);
  const language = config.language;

  const styles = StyleSheet.create({
    page: {
      padding: 40,
      fontFamily: tk.fontFamily,
      fontSize: tk.base,
      lineHeight: tk.lh,
      color: "#111",
    },
    header: {
      marginBottom: 14,
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
      lineHeight: tk.lh,
    },
    sectionTitle: {
      fontSize: tk.sm,
      fontFamily: tk.headingFamily,
      textTransform: "uppercase",
      letterSpacing: 1,
      borderBottomWidth: 1,
      borderBottomColor: "#ddd",
      paddingBottom: 3,
      marginTop: 10,
      marginBottom: 6,
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
      lineHeight: tk.lh,
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
    skills: {
      fontFamily: tk.bodyFamily,
      fontSize: tk.sm,
      lineHeight: tk.lh,
      color: "#333",
    },
    block: {
      marginBottom: 8,
    },
  });

  const { personal } = data;
  const contactPrimary = [
    personal.email,
    personal.phone,
    personal.location,
  ].filter(Boolean);
  const contactLinks = [
    personal.linkedin,
    personal.github,
    personal.website,
  ].filter(Boolean);

  const sectionBlocks: Record<SectionKey, ReactNode> = {
    experience:
      data.experiences.length > 0 ? (
        <View>
          <Text style={styles.sectionTitle}>{t(language, "experience")}</Text>
          {data.experiences.map((exp) => (
            <View key={exp.id} style={styles.block} wrap={false}>
              <Text style={styles.itemTitle}>
                {exp.position}
                {exp.company ? ` — ${exp.company}` : ""}
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
            <View key={edu.id} style={{ marginBottom: 6 }} wrap={false}>
              <Text style={styles.itemTitle}>
                {edu.degree}
                {edu.field ? ` — ${edu.field}` : ""}
              </Text>
              <Text style={styles.itemSub}>
                {[
                  edu.institution,
                  edu.location,
                  edu.startDate && edu.endDate
                    ? `${edu.startDate} – ${edu.endDate}`
                    : edu.startDate || edu.endDate,
                  edu.gpa ? `${t(language, "gpa")}: ${edu.gpa}` : "",
                ]
                  .filter(Boolean)
                  .join(" · ")}
              </Text>
              {edu.description ? (
                <Text style={styles.body}>{edu.description}</Text>
              ) : null}
            </View>
          ))}
        </View>
      ) : null,

    organizations:
      data.organizations.length > 0 ? (
        <View>
          <Text style={styles.sectionTitle}>
            {t(language, "organizations")}
          </Text>
          {data.organizations.map((org) => (
            <View key={org.id} style={styles.block} wrap={false}>
              <Text style={styles.itemTitle}>
                {org.role}
                {org.name ? ` — ${org.name}` : ""}
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
          {data.technicalSkills.length > 0 ? (
            <>
              <Text style={styles.sectionTitle}>
                {t(language, "technicalSkills")}
              </Text>
              <Text style={[styles.skills, { marginBottom: 6 }]}>
                {data.technicalSkills.join(", ")}
              </Text>
            </>
          ) : null}
          {data.softSkills.length > 0 ? (
            <>
              <Text style={styles.sectionTitle}>
                {t(language, "softSkills")}
              </Text>
              <Text style={styles.skills}>{data.softSkills.join(", ")}</Text>
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
          {data.certifications.map((cert) => (
            <Text
              key={cert.id}
              style={[styles.body, { marginBottom: 3 }]}
            >
              {cert.name}
              {cert.issuer ? ` — ${cert.issuer}` : ""}
              {cert.date ? ` (${cert.date})` : ""}
            </Text>
          ))}
        </View>
      ) : null,

    languages:
      data.languages.length > 0 ? (
        <View>
          <Text style={styles.sectionTitle}>{t(language, "languages")}</Text>
          <Text style={styles.skills}>
            {data.languages
              .map((l) => `${l.name}${l.level ? ` (${l.level})` : ""}`)
              .join(", ")}
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
          {contactPrimary.length > 0 ? (
            <Text style={styles.contact}>{contactPrimary.join(" · ")}</Text>
          ) : null}
          {contactLinks.length > 0 ? (
            <Text style={[styles.contact, { marginTop: 2 }]}>
              {contactLinks.join(" · ")}
            </Text>
          ) : null}
        </View>

        {personal.summary ? (
          <View>
            <Text style={styles.sectionTitle}>{t(language, "summary")}</Text>
            <Text style={styles.bodyJustify}>{personal.summary}</Text>
          </View>
        ) : null}

        {config.sectionOrder.map((key) => {
          const block = sectionBlocks[key];
          return block ? <View key={key}>{block}</View> : null;
        })}
      </Page>
    </Document>
  );
}