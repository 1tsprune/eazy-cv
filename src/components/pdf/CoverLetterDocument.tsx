import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import {
  getCoverLetterLabels,
  getSenderContactLines,
  getSenderName,
  splitLetterParagraphs,
} from "@/lib/cover-letter-layout";
import { getPdfSheetTokens } from "@/lib/typography";
import { PdfContactItem } from "./pdf-contact";
import type { CoverLetterData, Language, PersonalInfo, ResumeConfig } from "@/lib/types";

interface Props {
  personal: PersonalInfo;
  coverLetter: CoverLetterData;
  language: Language;
  config: ResumeConfig;
}

export default function CoverLetterDocument({
  personal,
  coverLetter,
  language,
  config,
}: Props) {
  const tk = getPdfSheetTokens(config);

  const styles = StyleSheet.create({
    page: {
      padding: 48,
      fontFamily: tk.fontFamily,
      fontSize: tk.base,
      lineHeight: tk.lh,
      color: "#111",
    },
    date: {
      marginBottom: 20,
      fontSize: tk.sm,
      color: "#666",
      textAlign: "right",
    },
    senderBlock: {
      marginBottom: 20,
      paddingBottom: 10,
      borderBottomWidth: 1,
      borderBottomColor: "#f0f0f0",
    },
    senderName: {
      fontFamily: tk.headingFamily,
      fontSize: tk.md,
      marginBottom: 2,
    },
    senderTitle: { fontSize: tk.sm, color: "#555", marginBottom: 6 },
    senderLine: { fontSize: tk.xs, color: "#666", marginBottom: 2 },
    recipientLabel: {
      fontFamily: tk.headingFamily,
      fontSize: tk.sm,
      marginBottom: 4,
    },
    recipient: { marginBottom: 16, fontSize: tk.sm, lineHeight: tk.lh },
    recipientMuted: { fontSize: tk.xs, color: "#777", marginTop: 4 },
    subject: {
      fontFamily: tk.headingFamily,
      marginBottom: 14,
      fontSize: tk.sm,
    },
    opening: { marginBottom: 12, textAlign: "justify" },
    paragraph: {
      marginBottom: 10,
      textAlign: "justify",
      fontSize: tk.base,
      lineHeight: tk.lh + 0.1,
    },
    formalClosing: {
      marginTop: 8,
      marginBottom: 16,
      textAlign: "justify",
      fontSize: tk.base,
      lineHeight: tk.lh + 0.1,
    },
    closingBlock: { marginTop: 12 },
    closing: { marginBottom: 40, textAlign: "justify" },
    signatureName: {
      fontFamily: tk.headingFamily,
      fontSize: tk.md,
      marginBottom: 2,
    },
    signatureTitle: { fontSize: tk.xs, color: "#666" },
  });

  const labels = getCoverLetterLabels(language, config.cvProfile);
  const paragraphs = splitLetterParagraphs(coverLetter.body);
  const name = getSenderName(personal, language);
  const contact = getSenderContactLines(personal);
  const dateLine = labels.dateLine(personal.location, coverLetter.date);

  return (
    <Document>
      <Page size="A4" style={styles.page} wrap>
        <Text style={styles.date}>{dateLine}</Text>

        <View style={styles.senderBlock}>
          <Text style={styles.senderName}>{name}</Text>
          {personal.title ? (
            <Text style={styles.senderTitle}>{personal.title}</Text>
          ) : null}
          {contact.map((line) => (
            <PdfContactItem key={line} value={line} style={styles.senderLine} />
          ))}
        </View>

        <View style={styles.recipient}>
          <Text style={styles.recipientLabel}>{labels.kepadaYth}</Text>
          {coverLetter.recipient ? <Text>{coverLetter.recipient}</Text> : null}
          {coverLetter.company ? <Text>{coverLetter.company}</Text> : null}
          {labels.diTempat ? (
            <Text style={styles.recipientMuted}>{labels.diTempat}</Text>
          ) : null}
        </View>

        <Text style={styles.subject}>
          {labels.subject(coverLetter.position)}
        </Text>
        <Text style={styles.opening}>{labels.denganHormat}</Text>

        {paragraphs.map((p, i) => (
          <Text key={i} style={styles.paragraph}>
            {p}
          </Text>
        ))}

        <Text style={styles.formalClosing}>{labels.formalClosing}</Text>

        <View style={styles.closingBlock}>
          <Text style={styles.closing}>{labels.closing}</Text>
          <Text style={styles.signatureName}>{name}</Text>
          {personal.title ? (
            <Text style={styles.signatureTitle}>{personal.title}</Text>
          ) : null}
        </View>
      </Page>
    </Document>
  );
}