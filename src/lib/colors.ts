import type { ColorTheme } from "./types";

/** Flat palette — recognizable hues, softer than neon (print-friendly) */
export const themeColors: Record<
  ColorTheme,
  { primary: string; light: string; text: string; border: string }
> = {
  indigo: {
    primary: "#5B61D6",
    light: "#EEF0FF",
    text: "#3D4499",
    border: "#B8BCE8",
  },
  emerald: {
    primary: "#2F9B6A",
    light: "#E8F7F0",
    text: "#1F6B4A",
    border: "#A8D9C0",
  },
  rose: {
    primary: "#D4566A",
    light: "#FCEEF1",
    text: "#9A3D4E",
    border: "#E8B8C2",
  },
  slate: {
    primary: "#5A6B7D",
    light: "#F0F3F6",
    text: "#3D4A58",
    border: "#B8C4D0",
  },
  amber: {
    primary: "#C48B2E",
    light: "#FBF4E8",
    text: "#7A5A1A",
    border: "#E0C99A",
  },
  violet: {
    primary: "#7B5FCF",
    light: "#F2EDFC",
    text: "#5240A0",
    border: "#C8B8E8",
  },
};