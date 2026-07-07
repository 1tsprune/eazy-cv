import { Text, View, type Styles } from "@react-pdf/renderer";
import { ATS_BULLET_MARK } from "@/lib/pdf-ats-layout";

const BULLET_MARK_COLOR = "#aaaaaa";

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
        <Text style={styles.itemTitle} wrap>
          {primary}
          {secondary ? (
            <Text style={styles.itemTitleSub}>{` · ${secondary}`}</Text>
          ) : null}
        </Text>
      </View>
      {period ? (
        <Text style={styles.itemMetaRight} wrap>
          {period}
        </Text>
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
}) {
  const markSize =
    typeof bulletStyle.fontSize === "number" ? bulletStyle.fontSize : 10;

  return (
    <Text style={bulletStyle} wrap>
      <Text style={{ color: BULLET_MARK_COLOR, fontSize: markSize }}>
        {ATS_BULLET_MARK}{" "}
      </Text>
      {text}
    </Text>
  );
}