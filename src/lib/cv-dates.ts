import { formatLetterDate } from "./cover-letter";
import type { Language } from "./types";

const MONTHS_EN = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

const MONTHS_ID = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "Mei",
  "Jun",
  "Jul",
  "Agu",
  "Sep",
  "Okt",
  "Nov",
  "Des",
] as const;

const MONTH_ALIASES: Record<string, number> = {
  jan: 1,
  january: 1,
  feb: 2,
  february: 2,
  mar: 3,
  march: 3,
  apr: 4,
  april: 4,
  may: 5,
  mei: 5,
  jun: 6,
  june: 6,
  jul: 7,
  july: 7,
  aug: 8,
  august: 8,
  agu: 8,
  sep: 9,
  sept: 9,
  september: 9,
  oct: 10,
  october: 10,
  okt: 10,
  nov: 11,
  november: 11,
  dec: 12,
  december: 12,
  des: 12,
  desember: 12,
};

function monthLabels(locale: Language) {
  return locale === "id" ? MONTHS_ID : MONTHS_EN;
}

function padMonth(month: number): string {
  return String(month).padStart(2, "0");
}

export function parseMonthYearToIso(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "";

  const isoMatch = trimmed.match(/^(\d{4})-(\d{2})$/);
  if (isoMatch) return trimmed;

  const yearOnly = trimmed.match(/^(\d{4})$/);
  if (yearOnly) return `${yearOnly[1]}-01`;

  const named = trimmed.match(/^([A-Za-z]+)\s+(\d{4})$/);
  if (named) {
    const month = MONTH_ALIASES[named[1].toLowerCase()];
    if (month) return `${named[2]}-${padMonth(month)}`;
  }

  const parsed = Date.parse(`${trimmed} 1`);
  if (!Number.isNaN(parsed)) {
    const d = new Date(parsed);
    return `${d.getFullYear()}-${padMonth(d.getMonth() + 1)}`;
  }

  return "";
}

export function formatIsoToMonthYear(
  iso: string,
  locale: Language,
): string {
  if (!iso) return "";
  const match = iso.match(/^(\d{4})-(\d{2})$/);
  if (!match) return iso;
  const month = Number(match[2]);
  if (month < 1 || month > 12) return iso;
  const labels = monthLabels(locale);
  return `${labels[month - 1]} ${match[1]}`;
}

export function parseLetterDateToIso(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed;

  const parsed = Date.parse(trimmed);
  if (!Number.isNaN(parsed)) {
    const d = new Date(parsed);
    return `${d.getFullYear()}-${padMonth(d.getMonth() + 1)}-${padMonth(d.getDate())}`;
  }

  return "";
}

export function formatIsoToLetterDate(
  iso: string,
  locale: Language,
): string {
  if (!iso) return "";
  const match = iso.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return iso;
  const d = new Date(
    Number(match[1]),
    Number(match[2]) - 1,
    Number(match[3]),
    12,
    0,
    0,
  );
  return formatLetterDate(locale, d);
}