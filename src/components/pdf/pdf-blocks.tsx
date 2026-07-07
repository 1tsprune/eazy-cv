import { Text, View, type Styles } from "@react-pdf/renderer";
import { t } from "@/lib/i18n";
import type {
  CustomSection,
  Education,
  Language,
  Organization,
} from "@/lib/types";

function formatEduPeriod(start: string, end: string): string {
  if (start && end) return `${start} – ${end}`;
  return start || end || "";
}

interface StyleSet {
  sectionTitle: Styles[keyof Styles];
  bullet: Styles[keyof Styles];
}

type OrgPdfStyles = {
  sectionTitle: Styles[keyof Styles];
  itemTitle: Styles[keyof Styles];
  itemSub: Styles[keyof Styles];
  bullet: Styles[keyof Styles];
};

export function PdfEducation({
  educations,
  lang,
  styles,
  variant = "default",
}: {
  educations: Education[];
  lang: Language;
  styles: OrgPdfStyles;
  variant?: "default" | "compact" | "academic";
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

  return (
    <>
      <Text style={styles.sectionTitle}>{t(lang, "education")}</Text>
      {educations.map((edu) => (
        <View key={edu.id} style={{ marginBottom: 6 }}>
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
        </View>
      ))}
    </>
  );
}

export function PdfOrganizations({
  organizations,
  lang,
  styles,
}: {
  organizations: Organization[];
  lang: Language;
  styles: OrgPdfStyles;
}) {
  if (!organizations.length) return null;

  return (
    <>
      <Text style={styles.sectionTitle}>{t(lang, "organizations")}</Text>
      {organizations.map((org) => (
        <View key={org.id} style={{ marginBottom: 8 }}>
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

export function PdfCustomSections({
  sections,
  styles,
  atsOnly = false,
}: {
  sections: CustomSection[];
  styles: StyleSet;
  atsOnly?: boolean;
}) {
  const filtered = sections.filter((s) =>
    atsOnly ? s.showInAts && s.title : s.title,
  );

  if (!filtered.length) return null;

  return (
    <>
      {filtered.map((section) => (
        <View key={section.id}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          {section.items.map((item, i) => (
            <Text key={i} style={styles.bullet}>
              • {item}
            </Text>
          ))}
        </View>
      ))}
    </>
  );
}