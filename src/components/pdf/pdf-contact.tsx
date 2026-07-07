import { Link, Text, type Styles } from "@react-pdf/renderer";
import { CONTACT_LINK_DECORATION, resolveContactHref } from "@/lib/pdf-links";
import type { PersonalInfo } from "@/lib/types";

type StyleProp = Styles[keyof Styles];

function contactLinkPdfStyle(
  parent?: StyleProp,
  linkColor?: string,
): StyleProp {
  const color =
    linkColor ??
    (parent &&
    typeof parent === "object" &&
    !Array.isArray(parent) &&
    "color" in parent &&
    parent.color
      ? (parent.color as string)
      : undefined);
  return color
    ? { ...CONTACT_LINK_DECORATION, color }
    : CONTACT_LINK_DECORATION;
}

export function PdfContactInline({
  items,
  style,
  separator = " · ",
  linkColor,
}: {
  items: string[];
  style?: StyleProp;
  separator?: string;
  linkColor?: string;
}) {
  if (!items.length) return null;

  const linkStyle = contactLinkPdfStyle(style, linkColor);

  return (
    <Text style={style} wrap>
      {items.map((item, index) => {
        const href = resolveContactHref(item);
        return (
          <Text key={`${item}-${index}`}>
            {index > 0 ? separator : ""}
            {href ? (
              <Link src={href} style={linkStyle}>
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
  linkColor,
}: {
  value: string;
  style?: StyleProp;
  linkColor?: string;
}) {
  const href = resolveContactHref(value);
  if (href) {
    const linkStyle = contactLinkPdfStyle(style, linkColor);
    return (
      <Link src={href} style={style ? [style, linkStyle] : linkStyle}>
        {value}
      </Link>
    );
  }
  return (
    <Text style={style} wrap>
      {value}
    </Text>
  );
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