import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import { themeColors } from "@/lib/colors";
import { t } from "@/lib/i18n";
import { getLanguageLevelLabel } from "@/lib/language-levels";
import { PDF_A4_WIDTH_PT } from "@/lib/pdf-modern-layout";
import { shouldShowPhoto } from "@/lib/photo-display";
import { getPdfSheetTokens } from "@/lib/typography";
import type { ResumeConfig, ResumeData, SectionKey } from "@/lib/types";
import { modernContactItems, PdfContactInline } from "./pdf-contact";
import { PdfPhoto } from "./pdf-photo";
import {
  PdfModernBody,
  PdfSidebarSkills,
  type ModernPdfStyles,
} from "./pdf-modern-sections";

/** EZCV PDFResume — centered header, 33% / 67% two-column body. */
const PAGE_PAD = 30;
const CONTENT_W = PDF_A4_WIDTH_PT - PAGE_PAD * 2;
const LEFT_W = Math.round(CONTENT_W * 0.33);
const RIGHT_W = CONTENT_W - LEFT_W;

const LEFT_COLUMN_SECTIONS = new Set<SectionKey>([
  "skills",
  "languages",
  "certifications",
]);

interface Props {
  data: ResumeData;
  config: ResumeConfig;
}

export default function PDFResumeDocument({ data, config }: Props) {
  const colors = themeColors[config.colorTheme];
  const lang = config.language;
  const { personal } = data;
  const showPhoto = shouldShowPhoto(config, data);
  const tk = getPdfSheetTokens(config);

  const styles = StyleSheet.create({
    page: {
      padding: PAGE_PAD,
      fontFamily: tk.fontFamily,
      fontSize: tk.base,
      lineHeight: tk.lh,
      color: "#1a1a1a",
    },
    header: {
      alignItems: "center",
      marginBottom: 14,
      paddingBottom: 12,
      borderBottomWidth: 2,
      borderBottomColor: colors.primary,
    },
    photo: {
      width: 76,
      height: 76,
      borderRadius: 38,
      marginBottom: 8,
      alignSelf: "center",
    },
    name: {
      fontSize: tk.xl,
      fontFamily: tk.headingFamily,
      color: colors.primary,
      textAlign: "center",
      marginBottom: 3,
    },
    title: {
      fontSize: tk.md,
      color: "#555555",
      textAlign: "center",
      marginBottom: 6,
    },
    contact: {
      fontSize: tk.xs,
      color: "#666666",
      textAlign: "center",
      lineHeight: 1.45,
    },
    summary: {
      fontSize: tk.sm,
      lineHeight: 1.5,
      color: "#444444",
      textAlign: "justify",
      marginBottom: 12,
    },
    columns: {
      flexDirection: "row",
    },
    leftCol: {
      width: LEFT_W,
      paddingRight: 14,
    },
    rightCol: {
      width: RIGHT_W,
    },
    sectionTitle: {
      fontSize: tk.xs,
      fontFamily: tk.headingFamily,
      color: colors.primary,
      textTransform: "uppercase",
      letterSpacing: 1.2,
      marginTop: 8,
      marginBottom: 5,
      paddingBottom: 3,
      borderBottomWidth: 1,
      borderBottomColor: "#e8e8e8",
    },
    sidebarLabel: {
      fontSize: tk.xs,
      fontFamily: tk.headingFamily,
      color: colors.primary,
      textTransform: "uppercase",
      letterSpacing: 1.2,
      marginTop: 8,
      marginBottom: 4,
      paddingBottom: 3,
      borderBottomWidth: 1,
      borderBottomColor: "#e8e8e8",
    },
    sidebarText: {
      fontSize: tk.sm,
      color: "#444444",
      marginBottom: 2,
      lineHeight: 1.35,
    },
    certRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 3,
    },
    certName: {
      fontSize: tk.sm,
      color: "#444444",
      flex: 1,
      paddingRight: 6,
    },
    certDate: {
      fontSize: tk.xs,
      color: "#888888",
      flexShrink: 0,
    },
  });

  const bodyStyles: ModernPdfStyles = {
    sectionTitle: styles.sectionTitle,
    itemTitle: {
      fontFamily: tk.headingFamily,
      fontSize: tk.md,
      color: "#1a1a1a",
    },
    itemSub: { fontSize: tk.sm, color: "#666666" },
    bullet: { fontSize: tk.sm, marginLeft: 8, marginBottom: 2, color: "#444444" },
    tag: {
      backgroundColor: colors.light,
      color: colors.primary,
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 3,
      fontSize: tk.xs,
      marginRight: 4,
      marginBottom: 4,
    },
  };

  const mainOrder = config.sectionOrder.filter(
    (key) => !LEFT_COLUMN_SECTIONS.has(key),
  );

  return (
    <Document>
      <Page size="A4" style={styles.page} wrap>
        <View style={styles.header}>
          {showPhoto ? (
            <PdfPhoto src={personal.photo} style={styles.photo} />
          ) : null}
          <Text style={styles.name}>{personal.fullName || "Your Name"}</Text>
          {personal.title ? (
            <Text style={styles.title}>{personal.title}</Text>
          ) : null}
          <PdfContactInline
            items={modernContactItems(personal)}
            style={styles.contact}
            linkColor={colors.primary}
          />
        </View>

        {personal.summary ? (
          <Text style={styles.summary}>{personal.summary}</Text>
        ) : null}

        <View style={styles.columns}>
          <View style={styles.leftCol}>
            {config.sectionOrder.includes("skills") ? (
              <PdfSidebarSkills
                data={data}
                lang={lang}
                textStyle={styles.sidebarText}
                labelStyle={styles.sidebarLabel}
              />
            ) : null}

            {config.sectionOrder.includes("languages") &&
            data.languages.length > 0 ? (
              <>
                <Text style={styles.sidebarLabel}>{t(lang, "languages")}</Text>
                {data.languages.map((l) => (
                  <Text key={l.id} style={styles.sidebarText}>
                    {l.name}
                    {l.level
                      ? ` — ${getLanguageLevelLabel(l.level, lang)}`
                      : ""}
                  </Text>
                ))}
              </>
            ) : null}

            {config.sectionOrder.includes("certifications") &&
            data.certifications.length > 0 ? (
              <>
                <Text style={styles.sidebarLabel}>
                  {t(lang, "certifications")}
                </Text>
                {data.certifications.map((cert) => (
                  <View key={cert.id} style={styles.certRow}>
                    <Text style={styles.certName}>
                      {cert.name}
                      {cert.issuer ? ` — ${cert.issuer}` : ""}
                    </Text>
                    {cert.date ? (
                      <Text style={styles.certDate}>{cert.date}</Text>
                    ) : null}
                  </View>
                ))}
              </>
            ) : null}
          </View>

          <View style={styles.rightCol}>
            <PdfModernBody
              data={data}
              config={{ ...config, sectionOrder: mainOrder }}
              styles={bodyStyles}
              options={{
                skipSections: ["skills", "languages", "certifications"],
                skillDisplay: "tags",
                experienceLayout: "row",
              }}
            />
          </View>
        </View>
      </Page>
    </Document>
  );
}