import type { FC } from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  type Styles,
} from "@react-pdf/renderer";
import { themeColors } from "@/lib/colors";
import { t } from "@/lib/i18n";
import {
  MODERN_PAD_LG_PT,
  MODERN_PAD_PT,
  PDF_MAIN_BOTTOM_PAD,
  PDF_MAIN_WIDTH_PT,
  PDF_SIDEBAR_WIDTH_PT,
} from "@/lib/pdf-modern-layout";
import { shouldShowPhoto } from "@/lib/photo-display";
import { getPdfSheetTokens } from "@/lib/typography";
import type { ModernTemplate, ResumeConfig, ResumeData } from "@/lib/types";
import {
  modernContactItems,
  PdfContactInline,
  PdfContactItem,
} from "./pdf-contact";
import { PdfPhoto } from "./pdf-photo";
import {
  PdfModernBody,
  PdfSidebarSkills,
  type ModernPdfStyles,
} from "./pdf-modern-sections";

interface Props {
  data: ResumeData;
  config: ResumeConfig;
}

function ContactLine({
  data,
  style,
  linkColor,
}: {
  data: ResumeData;
  style?: Styles[keyof Styles];
  linkColor?: string;
}) {
  return (
    <PdfContactInline
      items={modernContactItems(data.personal)}
      separator=" · "
      style={style}
      linkColor={linkColor}
    />
  );
}

function baseStyles(tk: ReturnType<typeof getPdfSheetTokens>, colors?: { primary: string; light: string }): ModernPdfStyles {
  return {
    sectionTitle: {
      fontSize: tk.md,
      fontFamily: tk.headingFamily,
      color: colors?.primary ?? "#334155",
      marginBottom: 6,
      marginTop: 12,
      textTransform: "uppercase",
      letterSpacing: 1,
      borderBottomWidth: 1,
      borderBottomColor: "#e5e5e5",
      paddingBottom: 4,
    },
    itemTitle: { fontFamily: tk.headingFamily, fontSize: tk.md },
    itemSub: { fontSize: tk.sm, color: "#666" },
    bullet: { fontSize: tk.sm, marginLeft: 10, marginBottom: 2 },
    tag: colors
      ? {
          backgroundColor: colors.light,
          color: colors.primary,
          paddingHorizontal: 6,
          paddingVertical: 2,
          borderRadius: 3,
          fontSize: tk.xs,
          marginRight: 4,
          marginBottom: 4,
        }
      : undefined,
  };
}

function ProfessionalTemplate({ data, config }: Props) {
  const colors = themeColors[config.colorTheme];
  const lang = config.language;
  const { personal } = data;
  const showPhoto = shouldShowPhoto(config, data);
  const tk = getPdfSheetTokens(config);
  const body = baseStyles(tk, colors);

  const styles = StyleSheet.create({
    page: {
      fontFamily: tk.fontFamily,
      fontSize: tk.base,
      lineHeight: tk.lh,
      position: "relative",
    },
    sidebar: {
      position: "absolute",
      top: 0,
      left: 0,
      bottom: 0,
      width: PDF_SIDEBAR_WIDTH_PT,
      backgroundColor: colors.primary,
      color: "#ffffff",
      padding: MODERN_PAD_PT,
    },
    sidebarName: {
      fontSize: tk.lg,
      fontFamily: tk.headingFamily,
      marginBottom: 4,
    },
    sidebarTitle: { fontSize: tk.sm, marginBottom: 14 },
    sidebarLabel: {
      fontSize: tk.xs,
      fontFamily: tk.headingFamily,
      textTransform: "uppercase",
      letterSpacing: 1,
      marginTop: 12,
      marginBottom: 6,
    },
    sidebarText: { fontSize: tk.sm, marginBottom: 3, color: "#ffffff" },
    main: {
      marginLeft: PDF_SIDEBAR_WIDTH_PT,
      width: PDF_MAIN_WIDTH_PT,
      paddingTop: MODERN_PAD_PT,
      paddingHorizontal: MODERN_PAD_PT,
      paddingBottom: PDF_MAIN_BOTTOM_PAD,
    },
    photo: {
      width: 72,
      height: 72,
      borderRadius: 36,
      marginBottom: 10,
      alignSelf: "center",
    },
    summaryTitle: {
      ...body.sectionTitle,
      marginTop: 0,
    },
  });

  return (
    <Document>
      <Page size="A4" style={styles.page} wrap>
        <View fixed style={styles.sidebar}>
          {showPhoto && <PdfPhoto src={personal.photo} style={styles.photo} />}
          <Text style={styles.sidebarName}>
            {personal.fullName || "Your Name"}
          </Text>
          {personal.title ? (
            <Text style={styles.sidebarTitle}>{personal.title}</Text>
          ) : null}
          <Text style={styles.sidebarLabel}>Contact</Text>
          {personal.email ? (
            <PdfContactItem
              value={personal.email}
              style={styles.sidebarText}
              linkColor="#ffffff"
            />
          ) : null}
          {personal.phone ? (
            <PdfContactItem
              value={personal.phone}
              style={styles.sidebarText}
              linkColor="#ffffff"
            />
          ) : null}
          {personal.linkedin ? (
            <PdfContactItem
              value={personal.linkedin}
              style={styles.sidebarText}
              linkColor="#ffffff"
            />
          ) : null}
          {personal.github ? (
            <PdfContactItem
              value={personal.github}
              style={styles.sidebarText}
              linkColor="#ffffff"
            />
          ) : null}
          {personal.website ? (
            <PdfContactItem
              value={personal.website}
              style={styles.sidebarText}
              linkColor="#ffffff"
            />
          ) : null}
          {personal.location ? (
            <PdfContactItem
              value={personal.location}
              style={styles.sidebarText}
              linkColor="#ffffff"
            />
          ) : null}
          <PdfSidebarSkills
            data={data}
            lang={lang}
            textStyle={styles.sidebarText}
            labelStyle={styles.sidebarLabel}
          />
        </View>
        <View style={styles.main}>
          {personal.summary ? (
            <>
              <Text style={styles.summaryTitle}>{t(lang, "summary")}</Text>
              <Text style={{ fontSize: tk.sm }}>{personal.summary}</Text>
            </>
          ) : null}
          <PdfModernBody
            data={data}
            config={config}
            styles={body}
            options={{
              skipSections: ["skills"],
              experienceLayout: "row",
            }}
          />
        </View>
      </Page>
    </Document>
  );
}

function MinimalTemplate({ data, config }: Props) {
  const lang = config.language;
  const { personal } = data;
  const showPhoto = shouldShowPhoto(config, data);
  const tk = getPdfSheetTokens(config);
  const body = baseStyles(tk);

  const styles = StyleSheet.create({
    page: {
      padding: MODERN_PAD_PT,
      paddingBottom: PDF_MAIN_BOTTOM_PAD,
      fontFamily: tk.fontFamily,
      fontSize: tk.base,
      lineHeight: tk.lh,
      color: "#1a1a1a",
    },
    name: {
      fontSize: tk.display,
      fontFamily: tk.headingFamily,
      letterSpacing: -0.5,
      marginBottom: 4,
    },
    title: { fontSize: tk.md, color: "#888888", marginBottom: 8 },
    contact: { fontSize: tk.xs, color: "#666666", marginBottom: 6 },
    headerRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: 8,
    },
    photo: { width: 64, height: 64, borderRadius: 32, marginLeft: 12 },
    sectionTitle: {
      fontSize: tk.xs,
      fontFamily: tk.headingFamily,
      color: "#999",
      letterSpacing: 2,
      marginTop: 16,
      marginBottom: 8,
      textTransform: "uppercase",
    },
  });

  const minimalBody: ModernPdfStyles = {
    ...body,
    sectionTitle: styles.sectionTitle,
  };

  return (
    <Document>
      <Page size="A4" style={styles.page} wrap>
        <View style={styles.headerRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{personal.fullName || "Your Name"}</Text>
            {personal.title ? (
              <Text style={styles.title}>{personal.title}</Text>
            ) : null}
          </View>
          {showPhoto ? (
            <PdfPhoto src={personal.photo} style={styles.photo} />
          ) : null}
        </View>
        <ContactLine data={data} style={styles.contact} />
        {personal.summary ? (
          <>
            <Text style={styles.sectionTitle}>{t(lang, "summary")}</Text>
            <Text style={{ fontSize: tk.sm, lineHeight: 1.5 }}>
              {personal.summary}
            </Text>
          </>
        ) : null}
        <PdfModernBody
          data={data}
          config={config}
          styles={minimalBody}
          options={{ experienceLayout: "row" }}
        />
      </Page>
    </Document>
  );
}

function ElegantTemplate({ data, config }: Props) {
  const colors = themeColors[config.colorTheme];
  const lang = config.language;
  const { personal } = data;
  const showPhoto = shouldShowPhoto(config, data);
  const tk = getPdfSheetTokens(config);
  const body = baseStyles(tk, colors);

  const styles = StyleSheet.create({
    page: {
      padding: MODERN_PAD_PT,
      paddingBottom: PDF_MAIN_BOTTOM_PAD,
      fontFamily: tk.fontFamily,
      fontSize: tk.base,
      lineHeight: tk.lh,
      color: "#1a1a1a",
    },
    header: {
      borderBottomWidth: 2,
      borderBottomColor: colors.primary,
      paddingBottom: 14,
      marginBottom: 14,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
    },
    name: {
      fontSize: tk.xl,
      fontFamily: tk.headingFamily,
      color: colors.primary,
      marginBottom: 3,
    },
    title: { fontSize: tk.md, color: "#555", marginBottom: 8 },
    contact: { fontSize: tk.sm, color: "#666666", marginTop: 4 },
    photo: { width: 68, height: 68, borderRadius: 34, marginLeft: 12 },
    sectionTitle: {
      fontSize: tk.md,
      fontFamily: tk.headingFamily,
      color: colors.primary,
      marginBottom: 6,
      marginTop: 10,
      textTransform: "uppercase",
      letterSpacing: 1.2,
      borderLeftWidth: 3,
      borderLeftColor: colors.primary,
      paddingLeft: 8,
    },
  });

  const elegantBody: ModernPdfStyles = {
    ...body,
    sectionTitle: styles.sectionTitle,
  };

  return (
    <Document>
      <Page size="A4" style={styles.page} wrap>
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{personal.fullName || "Your Name"}</Text>
            {personal.title ? (
              <Text style={styles.title}>{personal.title}</Text>
            ) : null}
            <ContactLine data={data} style={styles.contact} />
          </View>
          {showPhoto ? (
            <PdfPhoto src={personal.photo} style={styles.photo} />
          ) : null}
        </View>
        {personal.summary ? (
          <>
            <Text style={styles.sectionTitle}>{t(lang, "summary")}</Text>
            <Text style={{ fontSize: tk.sm, lineHeight: 1.5 }}>
              {personal.summary}
            </Text>
          </>
        ) : null}
        <PdfModernBody
          data={data}
          config={config}
          styles={elegantBody}
          options={{ skillDisplay: "tags", experienceLayout: "row" }}
        />
      </Page>
    </Document>
  );
}

function ExecutiveTemplate({ data, config }: Props) {
  const colors = themeColors[config.colorTheme];
  const lang = config.language;
  const { personal } = data;
  const showPhoto = shouldShowPhoto(config, data);
  const tk = getPdfSheetTokens(config);
  const body = baseStyles(tk, colors);

  const styles = StyleSheet.create({
    page: {
      fontFamily: tk.fontFamily,
      fontSize: tk.base,
      lineHeight: tk.lh,
      color: "#1a1a1a",
    },
    header: {
      backgroundColor: colors.primary,
      color: "#ffffff",
      padding: MODERN_PAD_PT,
      marginBottom: 10,
      textAlign: "center",
      alignItems: "center",
    },
    name: { fontSize: tk.xl, fontFamily: tk.headingFamily, marginBottom: 4 },
    title: { fontSize: tk.md, color: "#ffffff", opacity: 0.9 },
    contact: {
      fontSize: tk.xs,
      color: "#ffffff",
      opacity: 0.8,
      marginTop: 8,
    },
    body: {
      paddingTop: MODERN_PAD_PT,
      paddingHorizontal: MODERN_PAD_PT,
      paddingBottom: PDF_MAIN_BOTTOM_PAD,
    },
    photo: {
      width: 68,
      height: 68,
      borderRadius: 34,
      marginBottom: 10,
    },
    sectionTitle: {
      fontSize: tk.sm,
      fontFamily: tk.headingFamily,
      color: colors.primary,
      textTransform: "uppercase",
      letterSpacing: 2,
      marginTop: 9,
      marginBottom: 6,
      borderBottomWidth: 1,
      borderBottomColor: "#e5e5e5",
      paddingBottom: 4,
    },
  });

  const execBody: ModernPdfStyles = {
    ...body,
    sectionTitle: styles.sectionTitle,
  };

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
          <ContactLine
            data={data}
            style={styles.contact}
            linkColor="#ffffff"
          />
        </View>
        <View style={styles.body}>
          {personal.summary ? (
            <>
              <Text style={styles.sectionTitle}>{t(lang, "summary")}</Text>
              <Text style={{ fontSize: tk.sm, lineHeight: 1.5 }}>
                {personal.summary}
              </Text>
            </>
          ) : null}
          <PdfModernBody
            data={data}
            config={config}
            styles={execBody}
            options={{
              skillDisplay: "inline",
              experienceSep: " — ",
              experienceLayout: "row",
            }}
          />
        </View>
      </Page>
    </Document>
  );
}

function CreativeTemplate({ data, config }: Props) {
  const colors = themeColors[config.colorTheme];
  const lang = config.language;
  const { personal } = data;
  const showPhoto = shouldShowPhoto(config, data);
  const tk = getPdfSheetTokens(config);
  const body = baseStyles(tk, colors);

  const styles = StyleSheet.create({
    page: {
      fontFamily: tk.fontFamily,
      fontSize: tk.base,
      lineHeight: tk.lh,
    },
    topBar: {
      backgroundColor: colors.primary,
      padding: MODERN_PAD_PT,
      color: "#ffffff",
      flexDirection: "row",
      alignItems: "center",
    },
    name: { fontSize: tk.display, fontFamily: tk.headingFamily, lineHeight: 1.1 },
    title: { fontSize: tk.md, marginTop: 4, color: "#ffffff", opacity: 0.9 },
    contact: {
      fontSize: tk.xs,
      marginTop: 8,
      color: "#ffffff",
      opacity: 0.85,
    },
    body: {
      padding: MODERN_PAD_PT,
      paddingBottom: PDF_MAIN_BOTTOM_PAD,
    },
    photo: {
      width: 72,
      height: 72,
      borderRadius: 36,
      marginRight: 16,
    },
    sectionTitle: {
      fontSize: tk.md,
      fontFamily: tk.headingFamily,
      color: colors.primary,
      marginTop: 10,
      marginBottom: 6,
      textTransform: "uppercase",
      letterSpacing: 1.5,
    },
  });

  const creativeBody: ModernPdfStyles = {
    ...body,
    sectionTitle: styles.sectionTitle,
    tag: {
      backgroundColor: colors.light,
      color: colors.primary,
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 10,
      fontSize: tk.xs,
      marginRight: 4,
      marginBottom: 4,
    },
  };

  return (
    <Document>
      <Page size="A4" style={styles.page} wrap>
        <View style={styles.topBar}>
          {showPhoto ? (
            <PdfPhoto src={personal.photo} style={styles.photo} />
          ) : null}
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{personal.fullName || "Your Name"}</Text>
            {personal.title ? (
              <Text style={styles.title}>{personal.title}</Text>
            ) : null}
            <ContactLine
              data={data}
              style={styles.contact}
              linkColor="#ffffff"
            />
          </View>
        </View>
        <View style={styles.body}>
          {personal.summary ? (
            <>
              <Text style={styles.sectionTitle}>{t(lang, "summary")}</Text>
              <Text style={{ fontSize: tk.sm, lineHeight: 1.5 }}>
                {personal.summary}
              </Text>
            </>
          ) : null}
          <PdfModernBody
            data={data}
            config={config}
            styles={creativeBody}
            options={{ skillDisplay: "tags", experienceLayout: "row" }}
          />
        </View>
      </Page>
    </Document>
  );
}

function CompactTemplate({ data, config }: Props) {
  const colors = themeColors[config.colorTheme];
  const lang = config.language;
  const { personal } = data;
  const showPhoto = shouldShowPhoto(config, data);
  const tk = getPdfSheetTokens(config);
  const body = baseStyles(tk, colors);

  const styles = StyleSheet.create({
    page: {
      padding: MODERN_PAD_PT,
      paddingBottom: PDF_MAIN_BOTTOM_PAD,
      fontFamily: tk.fontFamily,
      fontSize: tk.base,
      lineHeight: tk.lh,
      color: "#1a1a1a",
    },
    name: {
      fontSize: tk.lg,
      fontFamily: tk.headingFamily,
      color: colors.primary,
    },
    title: { fontSize: tk.sm, color: "#555", marginBottom: 4 },
    contact: {
      fontSize: tk.xs,
      color: "#777",
      marginBottom: 10,
      borderBottomWidth: 1,
      borderBottomColor: "#ddd",
      paddingBottom: 6,
    },
    headerRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 4,
    },
    photo: { width: 44, height: 44, borderRadius: 6, marginRight: 10 },
    sectionTitle: {
      fontSize: tk.xs,
      fontFamily: tk.headingFamily,
      color: colors.primary,
      marginTop: 8,
      marginBottom: 4,
      textTransform: "uppercase",
      letterSpacing: 1,
    },
    itemTitle: { fontFamily: tk.headingFamily, fontSize: tk.sm },
    itemSub: { fontSize: tk.xs, color: "#666" },
    bullet: { fontSize: tk.xs, marginLeft: 8, marginBottom: 1 },
  });

  const compactBody: ModernPdfStyles = {
    sectionTitle: styles.sectionTitle,
    itemTitle: styles.itemTitle,
    itemSub: styles.itemSub,
    bullet: styles.bullet,
  };

  return (
    <Document>
      <Page size="A4" style={styles.page} wrap>
        <View style={styles.headerRow}>
          {showPhoto ? (
            <PdfPhoto src={personal.photo} style={styles.photo} />
          ) : null}
          <View>
            <Text style={styles.name}>{personal.fullName || "Your Name"}</Text>
            {personal.title ? (
              <Text style={styles.title}>{personal.title}</Text>
            ) : null}
          </View>
        </View>
        <ContactLine data={data} style={styles.contact} />
        {personal.summary ? (
          <>
            <Text style={styles.sectionTitle}>{t(lang, "summary")}</Text>
            <Text style={{ lineHeight: 1.45 }}>{personal.summary}</Text>
          </>
        ) : null}
        <PdfModernBody
          data={data}
          config={config}
          styles={compactBody}
          options={{
            educationVariant: "compact",
            skillDisplay: "inline",
            experienceSep: " — ",
            experienceLayout: "row",
          }}
        />
      </Page>
    </Document>
  );
}

function AcademicTemplate({ data, config }: Props) {
  const colors = themeColors[config.colorTheme];
  const lang = config.language;
  const { personal } = data;
  const showPhoto = shouldShowPhoto(config, data);
  const tk = getPdfSheetTokens(config);
  const body = baseStyles(tk, colors);

  const styles = StyleSheet.create({
    page: {
      paddingHorizontal: MODERN_PAD_LG_PT,
      paddingTop: MODERN_PAD_PT,
      paddingBottom: PDF_MAIN_BOTTOM_PAD,
      fontFamily: tk.fontFamily,
      fontSize: tk.base,
      lineHeight: tk.lh,
    },
    header: {
      textAlign: "center",
      borderBottomWidth: 1,
      borderBottomColor: "#333",
      paddingBottom: 10,
      marginBottom: 10,
      alignItems: "center",
    },
    name: { fontSize: tk.xl, fontFamily: tk.headingFamily },
    title: { fontSize: tk.sm, color: "#444", marginTop: 4 },
    contact: { fontSize: tk.xs, color: "#666", marginTop: 6 },
    photo: { width: 64, height: 64, borderRadius: 8, marginBottom: 8 },
    sectionTitle: {
      fontSize: tk.sm,
      fontFamily: tk.headingFamily,
      textTransform: "uppercase",
      letterSpacing: 1.5,
      marginTop: 10,
      marginBottom: 6,
      borderBottomWidth: 0.5,
      borderBottomColor: "#999",
      paddingBottom: 3,
      color: colors.primary,
    },
    itemSub: { fontSize: tk.sm, color: "#555", fontStyle: "italic" },
  });

  const academicBody: ModernPdfStyles = {
    ...body,
    sectionTitle: styles.sectionTitle,
    itemSub: styles.itemSub,
  };

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
          <ContactLine data={data} style={styles.contact} />
        </View>
        {personal.summary ? (
          <>
            <Text style={styles.sectionTitle}>{t(lang, "summary")}</Text>
            <Text style={{ fontSize: tk.sm, lineHeight: 1.5 }}>
              {personal.summary}
            </Text>
          </>
        ) : null}
        <PdfModernBody
          data={data}
          config={config}
          styles={academicBody}
          options={{
            educationVariant: "academic",
            experienceLayout: "row",
          }}
        />
      </Page>
    </Document>
  );
}

export default function ModernResumeDocument({ data, config }: Props) {
  const templates: Record<ModernTemplate, FC<Props>> = {
    elegant: ElegantTemplate,
    minimal: MinimalTemplate,
    professional: ProfessionalTemplate,
    executive: ExecutiveTemplate,
    creative: CreativeTemplate,
    compact: CompactTemplate,
    academic: AcademicTemplate,
  };
  const Template = templates[config.template];
  return <Template data={data} config={config} />;
}