import type { ColorTheme, ModernTemplate } from "./types";

export const COLOR_THEMES: ColorTheme[] = [
  "indigo",
  "emerald",
  "rose",
  "slate",
  "amber",
  "violet",
];

export const TEMPLATE_DEFAULT_COLOR: Record<ModernTemplate, ColorTheme> = {
  elegant: "indigo",
  professional: "emerald",
  executive: "violet",
  creative: "rose",
  compact: "slate",
  academic: "amber",
};

export function normalizeColorTheme(value: unknown): ColorTheme {
  if (
    typeof value === "string" &&
    (COLOR_THEMES as string[]).includes(value)
  ) {
    return value as ColorTheme;
  }
  return "slate";
}