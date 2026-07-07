import { Text, View, type Styles } from "@react-pdf/renderer";

type EntryStyles = {
  expHeader: Styles[keyof Styles];
  expHeaderLeft: Styles[keyof Styles];
  itemTitle: Styles[keyof Styles];
  itemTitleSub: Styles[keyof Styles];
  itemMetaRight: Styles[keyof Styles];
};

/** Role · company left, dates right — matches cv.html row layout. */
export function ModernPdfEntryHeader({
  primary,
  secondary,
  period,
  styles,
}: {
  primary: string;
  secondary?: string;
  period: string;
  styles: EntryStyles;
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

export const MODERN_ENTRY_ROW_STYLES = {
  expHeader: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    alignItems: "flex-start" as const,
    marginBottom: 3,
  },
  expHeaderLeft: {
    flex: 1,
    paddingRight: 8,
    minWidth: 0,
  },
  itemMetaRight: {
    fontSize: 9,
    color: "#888888",
    lineHeight: 1.4,
    flexShrink: 0,
    textAlign: "right" as const,
    maxWidth: "42%",
  },
  itemTitleSub: {
    fontSize: 10,
    color: "#555555",
  },
};