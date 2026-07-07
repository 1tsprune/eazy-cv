import type { ResumeConfig, ResumeData } from "./types";

export function shouldShowPhoto(
  config: ResumeConfig,
  data: ResumeData,
): boolean {
  return (
    config.exportMode === "modern" &&
    config.showPhoto &&
    !!data.personal.photo
  );
}