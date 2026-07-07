/** Neutral app chrome — easy on the eyes, separate from CV color themes */
export const accent = {
  inputFocus:
    "focus:border-slate-400 focus:ring-slate-100 dark:focus:border-slate-500 dark:focus:ring-slate-800",
  inputFocusWithin:
    "focus-within:border-slate-400 focus-within:ring-slate-100 dark:focus-within:border-slate-500 dark:focus-within:ring-slate-800",
  btnPrimary:
    "bg-slate-800 text-white hover:bg-slate-900 dark:bg-slate-200 dark:text-slate-900 dark:hover:bg-white",
  btnGhost:
    "border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800",
  iconBadge:
    "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  tag: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200",
  tagRemove:
    "text-slate-500 hover:bg-slate-200 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-100",
  link: "text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white",
  gradientText:
    "bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent dark:from-slate-200 dark:to-slate-400",
  panel:
    "border-slate-200 bg-gradient-to-br from-slate-50 to-zinc-50 dark:border-slate-700 dark:from-slate-900 dark:to-zinc-900",
} as const;