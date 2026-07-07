import type { ColorTheme } from "./types";

/** Muted, flat palette — low saturation for print-friendly CVs */
export const themeColors: Record<
  ColorTheme,
  { primary: string; light: string; text: string; border: string }
> = {
  indigo: {
    primary: "#6B7C8F",
    light: "#EEF1F4",
    text: "#4A5568",
    border: "#C5CED8",
  },
  emerald: {
    primary: "#6E8B7E",
    light: "#EDF2EF",
    text: "#4A5E54",
    border: "#B8C9C0",
  },
  rose: {
    primary: "#927A7C",
    light: "#F4F0F0",
    text: "#5E4E50",
    border: "#D4C4C5",
  },
  slate: {
    primary: "#5E6A74",
    light: "#F0F2F4",
    text: "#3F4A54",
    border: "#B8BFC6",
  },
  amber: {
    primary: "#8A8172",
    light: "#F3F1ED",
    text: "#5A544A",
    border: "#C9C2B6",
  },
  violet: {
    primary: "#7D7A8F",
    light: "#F0EFF3",
    text: "#524F60",
    border: "#C5C3D0",
  },
};