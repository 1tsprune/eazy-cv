import {
  formatIsoToLetterDate,
  parseLetterDateToIso,
} from "@/lib/cv-dates";
import type { Language } from "@/lib/types";

const FIELD_CLASS =
  "w-full min-w-0 max-w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-base text-zinc-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100 sm:text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:focus:border-slate-500 dark:focus:ring-slate-800";

interface Props {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  locale: Language;
}

export function DateInput({ label, value, onChange, locale }: Props) {
  const iso = parseLetterDateToIso(value);

  return (
    <label className="block min-w-0">
      {label && (
        <span className="mb-1.5 block text-xs font-medium text-zinc-500 dark:text-zinc-400">
          {label}
        </span>
      )}
      <input
        type="date"
        value={iso}
        onChange={(e) =>
          onChange(formatIsoToLetterDate(e.target.value, locale))
        }
        className={FIELD_CLASS}
      />
    </label>
  );
}