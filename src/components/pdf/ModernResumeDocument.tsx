import type { FC } from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import { themeColors } from "@/lib/colors";
import { t } from "@/lib/i18n";
import { shouldShowPhoto } from "@/lib/photo-display";
import type { ModernTemplate, ResumeConfig, ResumeData } from "@/lib/types";
import {
  PdfCustomSections,
  PdfEducation,
  PdfOrganizations,
} from "./pdf-blocks";
import { PdfPhoto } from "./pdf-photo";

interface Props {
  data: ResumeData;
  config: ResumeConfig;
}

function ContactLine({ data }: { data: ResumeData }) {
  const items = [
    data.personal.email,
    data.personal.phone,
    data.personal.location,
    data.personal.linkedin,
    data.personal.github,
    data.personal.website,
  ].filter(Boolean);
  return <Text>{items.join("  ·  ")}</Text>;
}

function ProfessionalTemplate({ data, config }: Props) {
  const colors = themeColors[config.colorTheme];
  const lang = config.language;
  const { personal } = data;
  const showPhoto = shouldShowPhoto(config, data);

  const styles = StyleSheet.create({
    page: { flexDirection: "row", fontFamily: "Helvetica", fontSize: 9, lineHeight: 1.45 },
    sidebar: { width: "32%", backgroundColor: colors.primary, color: "#fff", padding: 24 },
    main: { width: "68%", padding: 28 },
    sidebarName: { fontSize: 16, fontFamily: "Helvetica-Bold", marginBottom: 4 },
    sidebarTitle: { fontSize: 9, marginBottom: 16 },
    sidebarLabel: { fontSize: 8, fontFamily: "Helvetica-Bold", textTransform: "uppercase", letterSpacing: 1, marginTop: 14, marginBottom: 6 },
    sidebarText: { fontSize: 8.5, marginBottom: 3 },
    sectionTitle: { fontSize: 10, fontFamily: "Helvetica-Bold", color: colors.primary, marginBottom: 6, textTransform: "uppercase", letterSpacing: 1.2, borderBottomWidth: 1, borderBottomColor: "#e5e5e5", paddingBottom: 4, marginTop: 10 },
    itemTitle: { fontFamily: "Helvetica-Bold", fontSize: 10 },
    itemSub: { fontSize: 8.5, color: "#666" },
    bullet: { fontSize: 8.5, marginLeft: 10, marginBottom: 2 },
    photo: { width: 72, height: 72, borderRadius: 36, marginBottom: 10, alignSelf: "center" },
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.sidebar}>
          {showPhoto && <PdfPhoto src={personal.photo} style={styles.photo} />}
          <Text style={styles.sidebarName}>{personal.fullName || "Your Name"}</Text>
          {personal.title && <Text style={styles.sidebarTitle}>{personal.title}</Text>}
          <Text style={styles.sidebarLabel}>Contact</Text>
          {personal.email && <Text style={styles.sidebarText}>{personal.email}</Text>}
          {personal.phone && <Text style={styles.sidebarText}>{personal.phone}</Text>}
          {personal.location && <Text style={styles.sidebarText}>{personal.location}</Text>}
          {data.technicalSkills.length > 0 && (
            <>
              <Text style={styles.sidebarLabel}>{t(lang, "technicalSkills")}</Text>
              {data.technicalSkills.map((s) => (
                <Text key={s} style={styles.sidebarText}>{s}</Text>
              ))}
            </>
          )}
        </View>
        <View style={styles.main}>
          {personal.summary && (
            <>
              <Text style={styles.sectionTitle}>{t(lang, "summary")}</Text>
              <Text style={{ fontSize: 9 }}>{personal.summary}</Text>
            </>
          )}
          {data.experiences.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>{t(lang, "experience")}</Text>
              {data.experiences.map((exp) => (
                <View key={exp.id} style={{ marginBottom: 8 }}>
                  <Text style={styles.itemTitle}>{exp.position}{exp.company ? ` @ ${exp.company}` : ""}</Text>
                  <Text style={styles.itemSub}>{[exp.startDate, exp.endDate || (exp.current ? t(lang, "present") : ""), exp.location].filter(Boolean).join(" — ")}</Text>
                  {exp.highlights.map((h, i) => <Text key={i} style={styles.bullet}>• {h}</Text>)}
                </View>
              ))}
            </>
          )}
          <PdfEducation educations={data.educations} lang={lang} styles={styles} />
          <PdfOrganizations
            organizations={data.organizations}
            lang={lang}
            styles={styles}
          />
          <PdfCustomSections
            sections={data.customSections}
            styles={{ sectionTitle: styles.sectionTitle, bullet: styles.bullet }}
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

  const styles = StyleSheet.create({
    page: { padding: 48, fontFamily: "Helvetica", fontSize: 9, lineHeight: 1.45, color: "#1a1a1a" },
    name: { fontSize: 28, fontFamily: "Helvetica-Bold", letterSpacing: -0.5, marginBottom: 4 },
    title: { fontSize: 11, color: "#888", marginBottom: 10 },
    contact: { fontSize: 8, color: "#999" },
    sectionTitle: { fontSize: 8, fontFamily: "Helvetica-Bold", color: "#999", letterSpacing: 2, marginTop: 20, marginBottom: 8 },
    itemTitle: { fontFamily: "Helvetica-Bold", fontSize: 10 },
    itemSub: { fontSize: 8.5, color: "#666" },
    bullet: { fontSize: 8.5, marginLeft: 10, marginBottom: 2 },
    headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 },
    photo: { width: 64, height: 64, borderRadius: 32 },
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.headerRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{personal.fullName || "Your Name"}</Text>
            {personal.title && <Text style={styles.title}>{personal.title}</Text>}
          </View>
          {showPhoto && <PdfPhoto src={personal.photo} style={styles.photo} />}
        </View>
        <View style={styles.contact}><ContactLine data={data} /></View>
        {personal.summary && (<><Text style={styles.sectionTitle}>{t(lang, "summary")}</Text><Text style={{ fontSize: 9 }}>{personal.summary}</Text></>)}
        {data.experiences.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>{t(lang, "experience")}</Text>
            {data.experiences.map((exp) => (
              <View key={exp.id} style={{ marginBottom: 8 }}>
                <Text style={styles.itemTitle}>{exp.position}{exp.company ? ` @ ${exp.company}` : ""}</Text>
                <Text style={styles.itemSub}>{[exp.startDate, exp.endDate || (exp.current ? t(lang, "present") : ""), exp.location].filter(Boolean).join(" — ")}</Text>
                {exp.highlights.map((h, i) => <Text key={i} style={styles.bullet}>• {h}</Text>)}
              </View>
            ))}
          </>
        )}
        <PdfEducation educations={data.educations} lang={lang} styles={styles} />
        <PdfOrganizations
          organizations={data.organizations}
          lang={lang}
          styles={styles}
        />
        <PdfCustomSections
          sections={data.customSections}
          styles={{ sectionTitle: styles.sectionTitle, bullet: styles.bullet }}
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

  const styles = StyleSheet.create({
    page: { padding: 36, fontFamily: "Helvetica", fontSize: 9, lineHeight: 1.45, color: "#1a1a1a" },
    header: { borderBottomWidth: 2, borderBottomColor: colors.primary, paddingBottom: 14, marginBottom: 16, flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
    name: { fontSize: 22, fontFamily: "Helvetica-Bold", color: colors.primary, marginBottom: 3 },
    title: { fontSize: 11, color: "#555", marginBottom: 8 },
    contact: { fontSize: 8.5, color: "#777" },
    sectionTitle: { fontSize: 10, fontFamily: "Helvetica-Bold", color: colors.primary, marginBottom: 6, textTransform: "uppercase", letterSpacing: 1.2, borderLeftWidth: 3, borderLeftColor: colors.primary, paddingLeft: 8, marginTop: 12 },
    itemTitle: { fontFamily: "Helvetica-Bold", fontSize: 10 },
    itemSub: { fontSize: 8.5, color: "#666" },
    bullet: { fontSize: 8.5, marginLeft: 10, marginBottom: 2 },
    tag: { backgroundColor: colors.light, color: colors.primary, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 3, fontSize: 7.5, marginRight: 4, marginBottom: 4 },
    photo: { width: 68, height: 68, borderRadius: 34 },
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{personal.fullName || "Your Name"}</Text>
            {personal.title && <Text style={styles.title}>{personal.title}</Text>}
            <View style={styles.contact}><ContactLine data={data} /></View>
          </View>
          {showPhoto && <PdfPhoto src={personal.photo} style={styles.photo} />}
        </View>
        {personal.summary && (<><Text style={styles.sectionTitle}>{t(lang, "summary")}</Text><Text style={{ fontSize: 9 }}>{personal.summary}</Text></>)}
        {data.experiences.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>{t(lang, "experience")}</Text>
            {data.experiences.map((exp) => (
              <View key={exp.id} style={{ marginBottom: 8 }}>
                <Text style={styles.itemTitle}>{exp.position}{exp.company ? ` @ ${exp.company}` : ""}</Text>
                <Text style={styles.itemSub}>{[exp.startDate, exp.endDate || (exp.current ? t(lang, "present") : ""), exp.location].filter(Boolean).join(" — ")}</Text>
                {exp.highlights.map((h, i) => <Text key={i} style={styles.bullet}>• {h}</Text>)}
              </View>
            ))}
          </>
        )}
        <PdfEducation educations={data.educations} lang={lang} styles={styles} />
        <PdfOrganizations
          organizations={data.organizations}
          lang={lang}
          styles={styles}
        />
        {data.technicalSkills.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>{t(lang, "technicalSkills")}</Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
              {data.technicalSkills.map((s) => <Text key={s} style={styles.tag}>{s}</Text>)}
            </View>
          </>
        )}
        {data.softSkills.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>{t(lang, "softSkills")}</Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
              {data.softSkills.map((s) => <Text key={s} style={styles.tag}>{s}</Text>)}
            </View>
          </>
        )}
        <PdfOrganizations
          organizations={data.organizations}
          lang={lang}
          styles={styles}
        />
        <PdfCustomSections
          sections={data.customSections}
          styles={{ sectionTitle: styles.sectionTitle, bullet: styles.bullet }}
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

  const styles = StyleSheet.create({
    page: { fontFamily: "Helvetica", fontSize: 9, lineHeight: 1.45, color: "#1a1a1a" },
    header: { backgroundColor: colors.primary, color: "#fff", padding: 28, marginBottom: 20, textAlign: "center", alignItems: "center" },
    name: { fontSize: 24, fontFamily: "Helvetica-Bold", marginBottom: 4 },
    title: { fontSize: 11, opacity: 0.9 },
    contact: { fontSize: 8, opacity: 0.75, marginTop: 8 },
    body: { paddingHorizontal: 32 },
    sectionTitle: { fontSize: 9, fontFamily: "Helvetica-Bold", color: colors.primary, textTransform: "uppercase", letterSpacing: 2, marginTop: 14, marginBottom: 6, borderBottomWidth: 1, borderBottomColor: "#e5e5e5", paddingBottom: 4 },
    itemTitle: { fontFamily: "Helvetica-Bold", fontSize: 10 },
    itemSub: { fontSize: 8.5, color: "#666" },
    bullet: { fontSize: 8.5, marginLeft: 10, marginBottom: 2 },
    photo: { width: 68, height: 68, borderRadius: 34, marginBottom: 10 },
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          {showPhoto && <PdfPhoto src={personal.photo} style={styles.photo} />}
          <Text style={styles.name}>{personal.fullName || "Your Name"}</Text>
          {personal.title && <Text style={styles.title}>{personal.title}</Text>}
          <View style={styles.contact}><ContactLine data={data} /></View>
        </View>
        <View style={styles.body}>
          {personal.summary && (<><Text style={styles.sectionTitle}>{t(lang, "summary")}</Text><Text style={{ fontSize: 9 }}>{personal.summary}</Text></>)}
          {data.experiences.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>{t(lang, "experience")}</Text>
              {data.experiences.map((exp) => (
                <View key={exp.id} style={{ marginBottom: 8 }}>
                  <Text style={styles.itemTitle}>{exp.position}{exp.company ? ` — ${exp.company}` : ""}</Text>
                  <Text style={styles.itemSub}>{[exp.startDate, exp.endDate || (exp.current ? t(lang, "present") : ""), exp.location].filter(Boolean).join(" · ")}</Text>
                  {exp.highlights.map((h, i) => <Text key={i} style={styles.bullet}>• {h}</Text>)}
                </View>
              ))}
            </>
          )}
          <PdfEducation educations={data.educations} lang={lang} styles={styles} />
          <PdfOrganizations
            organizations={data.organizations}
            lang={lang}
            styles={styles}
          />
          {data.technicalSkills.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>{t(lang, "technicalSkills")}</Text>
              <Text style={{ fontSize: 8.5 }}>{data.technicalSkills.join(" · ")}</Text>
            </>
          )}
          <PdfOrganizations
            organizations={data.organizations}
            lang={lang}
            styles={styles}
          />
          <PdfCustomSections
            sections={data.customSections}
            styles={{ sectionTitle: styles.sectionTitle, bullet: styles.bullet }}
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
  const styles = StyleSheet.create({
    page: { fontFamily: "Helvetica", fontSize: 9, lineHeight: 1.45 },
    topBar: { backgroundColor: colors.primary, padding: 32, color: "#fff", flexDirection: "row", alignItems: "center", gap: 16 },
    name: { fontSize: 26, fontFamily: "Helvetica-Bold" },
    title: { fontSize: 11, marginTop: 4, opacity: 0.9 },
    contact: { fontSize: 8, marginTop: 8, opacity: 0.8 },
    body: { padding: 28 },
    sectionTitle: { fontSize: 10, fontFamily: "Helvetica-Bold", color: colors.primary, marginTop: 12, marginBottom: 6, textTransform: "uppercase", letterSpacing: 1.5 },
    itemTitle: { fontFamily: "Helvetica-Bold", fontSize: 10 },
    itemSub: { fontSize: 8.5, color: "#666" },
    bullet: { fontSize: 8.5, marginLeft: 10, marginBottom: 2 },
    tag: { backgroundColor: colors.light, color: colors.primary, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10, fontSize: 7.5, marginRight: 4, marginBottom: 4 },
    photo: { width: 72, height: 72, borderRadius: 36 },
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.topBar}>
          {showPhoto && <PdfPhoto src={personal.photo} style={styles.photo} />}
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{personal.fullName || "Your Name"}</Text>
            {personal.title && <Text style={styles.title}>{personal.title}</Text>}
            <View style={styles.contact}><ContactLine data={data} /></View>
          </View>
        </View>
        <View style={styles.body}>
          {personal.summary && (<><Text style={styles.sectionTitle}>{t(lang, "summary")}</Text><Text style={{ fontSize: 9 }}>{personal.summary}</Text></>)}
          {data.experiences.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>{t(lang, "experience")}</Text>
              {data.experiences.map((exp) => (
                <View key={exp.id} style={{ marginBottom: 8 }}>
                  <Text style={styles.itemTitle}>{exp.position} @ {exp.company}</Text>
                  <Text style={styles.itemSub}>{[exp.startDate, exp.endDate || (exp.current ? t(lang, "present") : "")].filter(Boolean).join(" — ")}</Text>
                  {exp.highlights.map((h, i) => <Text key={i} style={styles.bullet}>• {h}</Text>)}
                </View>
              ))}
            </>
          )}
          <PdfOrganizations
            organizations={data.organizations}
            lang={lang}
            styles={styles}
          />
          {data.technicalSkills.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>{t(lang, "technicalSkills")}</Text>
              <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                {data.technicalSkills.map((s) => <Text key={s} style={styles.tag}>{s}</Text>)}
              </View>
            </>
          )}
          <PdfCustomSections sections={data.customSections} styles={{ sectionTitle: styles.sectionTitle, bullet: styles.bullet }} />
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
  const styles = StyleSheet.create({
    page: { padding: 24, fontFamily: "Helvetica", fontSize: 8, lineHeight: 1.35, color: "#1a1a1a" },
    name: { fontSize: 16, fontFamily: "Helvetica-Bold", color: colors.primary },
    title: { fontSize: 9, color: "#555", marginBottom: 4 },
    contact: { fontSize: 7.5, color: "#777", marginBottom: 10, borderBottomWidth: 1, borderBottomColor: "#ddd", paddingBottom: 6 },
    sectionTitle: { fontSize: 8, fontFamily: "Helvetica-Bold", color: colors.primary, marginTop: 8, marginBottom: 4, textTransform: "uppercase", letterSpacing: 1 },
    itemTitle: { fontFamily: "Helvetica-Bold", fontSize: 8.5 },
    itemSub: { fontSize: 7.5, color: "#666" },
    bullet: { fontSize: 7.5, marginLeft: 8, marginBottom: 1 },
    headerRow: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 2 },
    photo: { width: 44, height: 44, borderRadius: 6 },
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.headerRow}>
          {showPhoto && <PdfPhoto src={personal.photo} style={styles.photo} />}
          <View>
            <Text style={styles.name}>{personal.fullName || "Your Name"}</Text>
            {personal.title && <Text style={styles.title}>{personal.title}</Text>}
          </View>
        </View>
        <View style={styles.contact}><ContactLine data={data} /></View>
        {personal.summary && (<><Text style={styles.sectionTitle}>{t(lang, "summary")}</Text><Text>{personal.summary}</Text></>)}
        {data.experiences.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>{t(lang, "experience")}</Text>
            {data.experiences.map((exp) => (
              <View key={exp.id} style={{ marginBottom: 5 }}>
                <Text style={styles.itemTitle}>{exp.position} — {exp.company}</Text>
                <Text style={styles.itemSub}>{[exp.startDate, exp.endDate || (exp.current ? t(lang, "present") : "")].filter(Boolean).join(" · ")}</Text>
                {exp.highlights.map((h, i) => <Text key={i} style={styles.bullet}>• {h}</Text>)}
              </View>
            ))}
          </>
        )}
        <PdfEducation
          educations={data.educations}
          lang={lang}
          styles={styles}
          variant="compact"
        />
        <PdfOrganizations
          organizations={data.organizations}
          lang={lang}
          styles={styles}
        />
        {data.technicalSkills.length > 0 && (
          <><Text style={styles.sectionTitle}>{t(lang, "technicalSkills")}</Text><Text style={{ fontSize: 7.5 }}>{data.technicalSkills.join(", ")}</Text></>
        )}
        <PdfCustomSections sections={data.customSections} styles={{ sectionTitle: styles.sectionTitle, bullet: styles.bullet }} />
      </Page>
    </Document>
  );
}

function AcademicTemplate({ data, config }: Props) {
  const colors = themeColors[config.colorTheme];
  const lang = config.language;
  const { personal } = data;
  const showPhoto = shouldShowPhoto(config, data);
  const styles = StyleSheet.create({
    page: { padding: 40, fontFamily: "Helvetica", fontSize: 9, lineHeight: 1.5 },
    header: { textAlign: "center", borderBottomWidth: 1, borderBottomColor: "#333", paddingBottom: 12, marginBottom: 16, alignItems: "center" },
    name: { fontSize: 18, fontFamily: "Helvetica-Bold" },
    title: { fontSize: 10, color: "#444", marginTop: 4 },
    contact: { fontSize: 8, color: "#666", marginTop: 6 },
    sectionTitle: { fontSize: 9, fontFamily: "Helvetica-Bold", textTransform: "uppercase", letterSpacing: 1.5, marginTop: 12, marginBottom: 6, borderBottomWidth: 0.5, borderBottomColor: "#999", paddingBottom: 3 },
    itemTitle: { fontFamily: "Helvetica-Bold", fontSize: 9.5 },
    itemSub: { fontSize: 8.5, color: "#555", fontStyle: "italic" },
    bullet: { fontSize: 8.5, marginLeft: 10, marginBottom: 2 },
    photo: { width: 64, height: 64, borderRadius: 8, marginBottom: 8 },
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          {showPhoto && <PdfPhoto src={personal.photo} style={styles.photo} />}
          <Text style={styles.name}>{personal.fullName || "Your Name"}</Text>
          {personal.title && <Text style={styles.title}>{personal.title}</Text>}
          <View style={styles.contact}><ContactLine data={data} /></View>
        </View>
        {personal.summary && (<><Text style={styles.sectionTitle}>{t(lang, "summary")}</Text><Text style={{ fontSize: 9 }}>{personal.summary}</Text></>)}
        <PdfEducation
          educations={data.educations}
          lang={lang}
          styles={styles}
          variant="academic"
        />
        <PdfOrganizations
          organizations={data.organizations}
          lang={lang}
          styles={styles}
        />
        {data.experiences.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>{t(lang, "experience")}</Text>
            {data.experiences.map((exp) => (
              <View key={exp.id} style={{ marginBottom: 8 }}>
                <Text style={styles.itemTitle}>{exp.position}, {exp.company}</Text>
                <Text style={styles.itemSub}>{[exp.startDate, exp.endDate || (exp.current ? t(lang, "present") : "")].filter(Boolean).join(" — ")}</Text>
                {exp.highlights.map((h, i) => <Text key={i} style={styles.bullet}>• {h}</Text>)}
              </View>
            ))}
          </>
        )}
        <PdfCustomSections sections={data.customSections} styles={{ sectionTitle: styles.sectionTitle, bullet: styles.bullet }} />
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