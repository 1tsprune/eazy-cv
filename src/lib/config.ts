export const APP = {
  name: "Eazy CV",
  slug: "eazycv",
  tagline: "Bikin CV gratis, no ribet",
} as const;

export const THEME_KEY = "eazycv:theme";
export const LEGACY_THEME_KEYS = [
  "cvcepat:theme",
  "cvforge:theme",
] as const;

export const DONATION = {
  url: "https://trakteer.id/prunepruneprune/gift",
} as const;

export const SOCIAL = {
  twitter: {
    url: "https://x.com/itsprune",
    handle: "@itsprune",
    name: "Prune",
    avatarUrl: "/dev-prune.jpg",
  },
} as const;