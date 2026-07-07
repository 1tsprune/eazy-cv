"use client";

import { CONTACT_LINK_DECORATION, resolveContactHref } from "@/lib/pdf-links";

interface Props {
  items: string[];
  className?: string;
  style?: React.CSSProperties;
  separator?: string;
  /** Override link color; defaults to parent text color */
  linkColor?: string;
}

export function PreviewContactInline({
  items,
  className = "",
  style,
  separator = " · ",
  linkColor,
}: Props) {
  if (!items.length) return null;

  return (
    <p className={className} style={style}>
      {items.map((item, index) => {
        const href = resolveContactHref(item);
        return (
          <span key={`${item}-${index}`}>
            {index > 0 ? separator : ""}
            {href ? (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: linkColor ?? style?.color ?? "inherit",
                  ...CONTACT_LINK_DECORATION,
                }}
                className="text-inherit visited:text-inherit hover:underline"
              >
                {item}
              </a>
            ) : (
              item
            )}
          </span>
        );
      })}
    </p>
  );
}