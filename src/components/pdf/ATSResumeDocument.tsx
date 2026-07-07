import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import { t } from "@/lib/i18n";
import type { Language, ResumeData } from "@/lib/types";
import { PdfOrganizations } from "./pdf-blocks";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Helvetica",
    fontSize: 10,
    lineHeight: 1.4,
    color: "#111",
  },
  name: {
    fontSize: 20,
    fontFamily: "Helvetica-Bold",
    marginBottom: 2,
  },
  title: {
    fontSize: 11,
    color: "#444",
    marginBottom: 8,
  },
  contact: {
    fontSize: 9,
    color: "#555",
    marginBottom: 2,
  },
  sectionTitle: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    letterSpacing: 1,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingBottom: 3,
    marginTop: 12,
    marginBottom: 6,
  },
  itemTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 10,
  },
  itemSub: {
    fontSize: 9,
    color: "#555",
    marginBottom: 2,
  },
  bullet: {
    fontSize: 9,
    marginLeft: 8,
    marginBottom: 2,
  },
  skills: {
    fontSize: 9,
    lineHeight: 1.5,
  },
});

interface Props {
  data: ResumeData;
  language: Language;
}

export default function ATSResumeDocument({ data, language }: Props) {
  const { personal } = data;
  const contactLines = [
    personal.email,
    personal.phone,
    personal.location,
    personal.linkedin,
    personal.github,
    personal.website,
  ].filter(Boolean);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.name}>{personal.fullName || "Your Name"}</Text>
        {personal.title && <Text style={styles.title}>{personal.title}</Text>}
        {contactLines.map((line) => (
          <Text key={line} style={styles.contact}>
            {line}
          </Text>
        ))}

        {personal.summary && (
          <>
            <Text style={styles.sectionTitle}>{t(language, "summary")}</Text>
            <Text style={{ fontSize: 9, textAlign: "justify", lineHeight: 1.5 }}>
              {personal.summary}
            </Text>
          </>
        )}

        {data.experiences.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>{t(language, "experience")}</Text>
            {data.experiences.map((exp) => (
              <View key={exp.id} style={{ marginBottom: 8 }}>
                <Text style={styles.itemTitle}>
                  {exp.position}
                  {exp.company ? ` — ${exp.company}` : ""}
                </Text>
                <Text style={styles.itemSub}>
                  {[exp.location, exp.startDate, exp.endDate || (exp.current ? t(language, "present") : "")]
                    .filter(Boolean)
                    .join(" · ")}
                </Text>
                {exp.description && (
                  <Text
                    style={{
                      fontSize: 9,
                      marginBottom: 2,
                      textAlign: "justify",
                      lineHeight: 1.45,
                    }}
                  >
                    {exp.description}
                  </Text>
                )}
                {exp.highlights.map((h, i) => (
                  <Text key={i} style={styles.bullet}>
                    • {h}
                  </Text>
                ))}
              </View>
            ))}
          </>
        )}

        {data.educations.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>{t(language, "education")}</Text>
            {data.educations.map((edu) => (
              <View key={edu.id} style={{ marginBottom: 6 }}>
                <Text style={styles.itemTitle}>
                  {edu.degree}
                  {edu.field ? ` in ${edu.field}` : ""}
                </Text>
                <Text style={styles.itemSub}>
                  {[
                    edu.institution,
                    edu.location,
                    edu.startDate && edu.endDate
                      ? `${edu.startDate} – ${edu.endDate}`
                      : edu.startDate || edu.endDate,
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                  {edu.gpa ? ` · ${t(language, "gpa")}: ${edu.gpa}` : ""}
                </Text>
                {edu.description && (
                  <Text style={{ fontSize: 9 }}>{edu.description}</Text>
                )}
              </View>
            ))}
          </>
        )}

        <PdfOrganizations
          organizations={data.organizations}
          lang={language}
          styles={styles}
        />

        {data.technicalSkills.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>
              {t(language, "technicalSkills")}
            </Text>
            <Text style={styles.skills}>
              {data.technicalSkills.join(", ")}
            </Text>
          </>
        )}

        {data.softSkills.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>{t(language, "softSkills")}</Text>
            <Text style={styles.skills}>{data.softSkills.join(", ")}</Text>
          </>
        )}

        {data.certifications.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>
              {t(language, "certifications")}
            </Text>
            {data.certifications.map((cert) => (
              <Text key={cert.id} style={{ fontSize: 9, marginBottom: 3 }}>
                {cert.name}
                {cert.issuer ? ` — ${cert.issuer}` : ""}
                {cert.date ? ` (${cert.date})` : ""}
              </Text>
            ))}
          </>
        )}

        {data.customSections
          .filter((s) => s.showInAts && s.title)
          .map((section) => (
            <View key={section.id}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              {section.items.map((item, i) => (
                <Text key={i} style={styles.bullet}>
                  • {item}
                </Text>
              ))}
            </View>
          ))}
      </Page>
    </Document>
  );
}