import { Link, Text, type Styles } from "@react-pdf/renderer";
import { PDF_LINK_STYLE, resolveContactHref } from "@/lib/pdf-links";
import type { PersonalInfo } from "@/lib/types";

type StyleProp = Styles[keyof Styles];

export function PdfContactInline({
  items,
  style,
  separator = " · ",
}: {
  items: string[];
  style?: StyleProp;
  separator?: string;
}) {
  if (!items.length) return null;

  return (
    <Text style={style}>
      {items.map((item, index) => {
        const href = resolveContactHref(item);
        return (
          <Text key={`${item}-${index}`}>
            {index > 0 ? separator : ""}
            {href ? (
              <Link src={href} style={PDF_LINK_STYLE}>
                {item}
              </Link>
            ) : (
              item
            )}
          </Text>
        );
      })}
    </Text>
  );
}

export function PdfContactItem({
  value,
  style,
}: {
  value: string;
  style?: StyleProp;
}) {
  const href = resolveContactHref(value);
  if (href) {
    return (
      <Link
        src={href}
        style={style ? [style, PDF_LINK_STYLE] : PDF_LINK_STYLE}
      >
        {value}
      </Link>
    );
  }
  return <Text style={style}>{value}</Text>;
}

export function cvContactItems(personal: PersonalInfo): string[] {
  return [
    personal.phone,
    personal.email,
    personal.website,
    personal.linkedin,
    personal.github,
    personal.location,
  ].filter(Boolean);
}

export function modernContactItems(personal: PersonalInfo): string[] {
  return [
    personal.email,
    personal.phone,
    personal.location,
    personal.linkedin,
    personal.github,
    personal.website,
  ].filter(Boolean);
}