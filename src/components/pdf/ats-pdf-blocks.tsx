import { Text, View, type Styles } from "@react-pdf/renderer";
import { ATS_BULLET_MARK } from "@/lib/pdf-ats-layout";

type SheetStyles = {
  expHeader: Styles[keyof Styles];
  expHeaderLeft: Styles[keyof Styles];
  itemTitle: Styles[keyof Styles];
  itemTitleSub: Styles[keyof Styles];
  itemMetaRight: Styles[keyof Styles];
};

export function AtsPdfEntryHeader({
  primary,
  secondary,
  period,
  styles,
}: {
  primary: string;
  secondary?: string;
  period: string;
  styles: SheetStyles;
}) {
  return (
    <View style={styles.expHeader}>
      <View style={styles.expHeaderLeft}>
        <Text>
          <Text style={styles.itemTitle}>{primary}</Text>
          {secondary ? (
            <Text style={styles.itemTitleSub}> · {secondary}</Text>
          ) : null}
        </Text>
      </View>
      {period ? (
        <Text style={styles.itemMetaRight}>{period}</Text>
      ) : null}
    </View>
  );
}

export function AtsPdfBullet({
  text,
  bulletStyle,
}: {
  text: string;
  bulletStyle: Styles[keyof Styles];
  markStyle?: Styles[keyof Styles];
}) {
  const markColor =
    typeof bulletStyle === "object" &&
    bulletStyle !== null &&
    "markColor" in bulletStyle
      ? (bulletStyle as { markColor?: string }).markColor
      : "#aaaaaa";

  return (
    <Text style={bulletStyle}>
      <Text style={{ color: markColor, fontSize: 7 }}>{ATS_BULLET_MARK} </Text>
      {text}
    </Text>
  );
}