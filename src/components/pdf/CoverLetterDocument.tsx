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
import type { CoverLetterData, Language, PersonalInfo } from "@/lib/types";

interface Props {
  personal: PersonalInfo;
  coverLetter: CoverLetterData;
  language: Language;
}

const styles = StyleSheet.create({
  page: {
    padding: 48,
    fontFamily: "Helvetica",
    fontSize: 11,
    lineHeight: 1.6,
    color: "#111",
  },
  date: {
    marginBottom: 20,
    fontSize: 10,
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
    fontFamily: "Helvetica-Bold",
    fontSize: 12,
    marginBottom: 2,
  },
  senderTitle: { fontSize: 10, color: "#555", marginBottom: 6 },
  senderLine: { fontSize: 9, color: "#666", marginBottom: 2 },
  recipientLabel: {
    fontFamily: "Helvetica-Bold",
    fontSize: 10,
    marginBottom: 4,
  },
  recipient: { marginBottom: 16, fontSize: 10, lineHeight: 1.5 },
  recipientMuted: { fontSize: 9, color: "#777", marginTop: 4 },
  subject: {
    fontFamily: "Helvetica-Bold",
    marginBottom: 14,
    fontSize: 10,
  },
  opening: { marginBottom: 12, textAlign: "justify" },
  paragraph: {
    marginBottom: 10,
    textAlign: "justify",
    fontSize: 11,
    lineHeight: 1.65,
  },
  formalClosing: {
    marginTop: 8,
    marginBottom: 16,
    textAlign: "justify",
    fontSize: 11,
    lineHeight: 1.65,
  },
  closingBlock: { marginTop: 12 },
  closing: { marginBottom: 40, textAlign: "justify" },
  signatureName: {
    fontFamily: "Helvetica-Bold",
    fontSize: 12,
    marginBottom: 2,
  },
  signatureTitle: { fontSize: 9, color: "#666" },
});

export default function CoverLetterDocument({
  personal,
  coverLetter,
  language,
}: Props) {
  const labels = getCoverLetterLabels(language);
  const paragraphs = splitLetterParagraphs(coverLetter.body);
  const name = getSenderName(personal, language);
  const contact = getSenderContactLines(personal);
  const dateLine = labels.dateLine(personal.location, coverLetter.date);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.date}>{dateLine}</Text>

        <View style={styles.senderBlock}>
          <Text style={styles.senderName}>{name}</Text>
          {personal.title ? (
            <Text style={styles.senderTitle}>{personal.title}</Text>
          ) : null}
          {contact.map((line) => (
            <Text key={line} style={styles.senderLine}>
              {line}
            </Text>
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