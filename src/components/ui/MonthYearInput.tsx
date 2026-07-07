import {
  formatIsoToMonthYear,
  parseMonthYearToIso,
} from "@/lib/cv-dates";
import type { Language } from "@/lib/types";

const FIELD_CLASS =
  "w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-900 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:bg-zinc-50 disabled:text-zinc-400 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:focus:border-indigo-500 dark:focus:ring-indigo-900 dark:disabled:bg-zinc-900 dark:disabled:text-zinc-500";

interface Props {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  locale: Language;
  disabled?: boolean;
}

export function MonthYearInput({
  label,
  value,
  onChange,
  locale,
  disabled,
}: Props) {
  const iso = parseMonthYearToIso(value);

  return (
    <label className="block">
      {label && (
        <span className="mb-1.5 block text-xs font-medium text-zinc-500 dark:text-zinc-400">
          {label}
        </span>
      )}
      <input
        type="month"
        value={iso}
        disabled={disabled}
        onChange={(e) =>
          onChange(formatIsoToMonthYear(e.target.value, locale))
        }
        className={FIELD_CLASS}
      />
    </label>
  );
}