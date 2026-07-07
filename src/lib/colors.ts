import type { ColorTheme } from "./types";

export const themeColors: Record<
  ColorTheme,
  { primary: string; light: string; text: string }
> = {
  indigo: { primary: "#4F46E5", light: "#EEF2FF", text: "#312E81" },
  emerald: { primary: "#059669", light: "#ECFDF5", text: "#064E3B" },
  rose: { primary: "#E11D48", light: "#FFF1F2", text: "#881337" },
  slate: { primary: "#475569", light: "#F8FAFC", text: "#1E293B" },
  amber: { primary: "#D97706", light: "#FFFBEB", text: "#78350F" },
  violet: { primary: "#7C3AED", light: "#F5F3FF", text: "#4C1D95" },
};