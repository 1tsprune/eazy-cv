export const APP = {
  name: "Eazy CV",
  slug: "eazycv",
  tagline: "Bikin CV gratis, no ribet",
  initials: "CV",
} as const;

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://cv.1tsprune.com";

export const THEME_KEY = "eazycv:theme";
export const LEGACY_THEME_KEYS = [
  "cvcepat:theme",
  "cvforge:theme",
] as const;

export const DONATION = {
  url: "https://trakteer.id/prunepruneprune/gift",
} as const;

/** Coinfest promo overlay — aktif sampai event selesai (22 Agt 2026 WITA). */
export const COINFEST_PROMO = {
  ticketUrl: "https://coinfest.asia/with/EkyJanuarta",
  endsAt: "2026-08-22T00:00:00+08:00",
} as const;

export function isCoinfestPromoActive(now = new Date()): boolean {
  return now < new Date(COINFEST_PROMO.endsAt);
}

export const SOCIAL = {
  twitter: {
    url: "https://x.com/itsprune",
    handle: "@itsprune",
    name: "Prune",
    avatarUrl: "/dev-prune.jpg",
  },
} as const;