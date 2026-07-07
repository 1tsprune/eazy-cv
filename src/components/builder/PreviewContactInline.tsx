"use client";

import { PDF_LINK_STYLE, resolveContactHref } from "@/lib/pdf-links";

interface Props {
  items: string[];
  className?: string;
  style?: React.CSSProperties;
  separator?: string;
}

export function PreviewContactInline({
  items,
  className = "",
  style,
  separator = " · ",
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
                style={{ color: PDF_LINK_STYLE.color, textDecoration: "none" }}
                className="hover:underline"
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