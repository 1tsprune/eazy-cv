const CHECK_TO_SECTION: Record<string, string> = {
  name: "cv-section-personal",
  title: "cv-section-personal",
  email: "cv-section-personal",
  phone: "cv-section-personal",
  location: "cv-section-personal",
  summary: "cv-section-personal",
  linkedin: "cv-section-personal",
  experience: "cv-section-experience",
  keywords: "cv-section-experience",
  education: "cv-section-education",
  "tech-skills": "cv-section-skills",
  "soft-skills": "cv-section-skills",
  projects: "cv-section-projects",
};

export function getAtsScrollTarget(checkId: string): string {
  return CHECK_TO_SECTION[checkId] ?? "cv-section-personal";
}

export function scrollToCvSection(sectionId: string) {
  const el = document.getElementById(sectionId);
  if (!el) return;

  const isClosed = !el.querySelector("[data-section-body]");
  if (isClosed) {
    el.querySelector<HTMLButtonElement>('button[type="button"]')?.click();
  }

  window.setTimeout(() => {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, isClosed ? 80 : 0);
}