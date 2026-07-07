import { Link, Text, type Styles } from "@react-pdf/renderer";
import { CONTACT_LINK_DECORATION, resolveContactHref } from "@/lib/pdf-links";
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
              <Link src={href} style={CONTACT_LINK_DECORATION}>
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
        style={
          style ? [style, CONTACT_LINK_DECORATION] : CONTACT_LINK_DECORATION
        }
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