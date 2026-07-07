/** Normalize contact text into a clickable href for PDF export. */
export function resolveContactHref(value: string): string | null {
  const raw = value.trim();
  if (!raw) return null;

  if (/^(https?:\/\/|mailto:|tel:)/i.test(raw)) return raw;

  if (raw.includes("@") && !raw.includes(" ")) {
    return `mailto:${raw}`;
  }

  const digits = raw.replace(/\D/g, "");
  if (
    digits.length >= 8 &&
    /^[\d\s+().-]+$/.test(raw) &&
    !raw.includes("@")
  ) {
    return `tel:${raw.replace(/\s/g, "")}`;
  }

  const lower = raw.toLowerCase();

  if (lower.includes("linkedin.com")) {
    return toHttps(raw);
  }

  if (lower.includes("github.com")) {
    return toHttps(raw);
  }

  if (/^[\w-]+(\.[\w-]+)+(\/\S*)?$/i.test(raw) && !raw.includes(" ")) {
    return toHttps(raw);
  }

  return null;
}

function toHttps(value: string): string {
  if (/^https?:\/\//i.test(value)) return value;
  return `https://${value.replace(/^\/\//, "")}`;
}

export const PDF_LINK_STYLE = {
  color: "#1155cc",
  textDecoration: "none",
} as const;