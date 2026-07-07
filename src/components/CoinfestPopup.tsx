"use client";

import { Calendar, MapPin, X } from "lucide-react";
import { COINFEST_PROMO } from "@/lib/config";

const TICKET_URL = COINFEST_PROMO.ticketUrl;
const MAPS_URL =
  "https://www.google.com/maps/place/Coinfest+Asia/@-8.8481907,115.1570723,20.72z/data=!4m6!3m5!1s0x2dd245a7179276d1:0x7d89a71f7eb052ca!8m2!3d-8.8480625!4d115.1570625!16s%2Fg%2F11stxm5__m?entry=tts";
const LOGO_URL = "https://coinfest.asia/logo%20navbar/logo%20navbar.png";

type Props = {
  onClose: () => void;
};

export function CoinfestPopup({ onClose }: Props) {
  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-3 md:p-4"
      role="presentation"
    >
      <button
        type="button"
        aria-label="Tutup popup"
        className="absolute inset-0 bg-zinc-950/55 backdrop-blur-[2px]"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="coinfest-popup-title"
        className="relative w-full max-w-[288px] overflow-hidden rounded-xl bg-white shadow-xl ring-1 ring-zinc-200/80 dark:bg-zinc-900 dark:ring-zinc-700 md:max-w-md md:rounded-2xl md:shadow-2xl"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup"
          className="absolute right-2 top-2 rounded-md p-1 text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-600 md:right-3 md:top-3 md:rounded-lg md:p-1.5 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
        >
          <X className="h-3.5 w-3.5 md:h-4 md:w-4" />
        </button>

        <div className="px-4 pb-4 pt-5 text-center md:px-6 md:pb-6 md:pt-7">
          <div className="mb-3 flex justify-center md:mb-4">
            <img
              src={LOGO_URL}
              alt="Coinfest Asia"
              width={200}
              height={48}
              className="h-7 w-auto max-w-[140px] object-contain md:h-9 md:max-w-[180px]"
            />
          </div>

          <p className="text-xs text-zinc-500 md:text-sm dark:text-zinc-400">
            Prune akan hadir di
          </p>
          <h2
            id="coinfest-popup-title"
            className="mt-0.5 text-base font-bold tracking-tight text-zinc-900 md:mt-1 md:text-xl dark:text-zinc-50"
          >
            Coinfest Asia 2026
          </h2>

          <div className="mx-auto mt-3 inline-flex items-center gap-2 rounded-lg bg-amber-50 px-3 py-1.5 ring-1 ring-amber-200/80 md:mt-4 md:gap-2.5 md:rounded-xl md:px-4 md:py-2.5 dark:bg-amber-950/40 dark:ring-amber-900/50">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-amber-500 text-white md:h-9 md:w-9 md:rounded-lg">
              <Calendar className="h-3.5 w-3.5 md:h-4 md:w-4" aria-hidden />
            </span>
            <span className="text-left text-xs font-semibold text-amber-950 md:text-sm dark:text-amber-100">
              20–21 Agustus 2026
            </span>
          </div>

          <p className="mt-2.5 flex flex-wrap items-center justify-center gap-1 text-[11px] leading-snug text-zinc-600 md:mt-3.5 md:text-sm dark:text-zinc-300">
            <MapPin
              className="h-3 w-3 shrink-0 text-zinc-400 md:h-3.5 md:w-3.5"
              aria-hidden
            />
            <span>Pantai Melasti, Bali</span>
            <span className="text-zinc-300 dark:text-zinc-600">·</span>
            <a
              href={MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-amber-700 underline-offset-2 hover:underline dark:text-amber-400"
            >
              lihat peta →
            </a>
          </p>

          <a
            href={TICKET_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3.5 inline-flex w-full items-center justify-center rounded-lg bg-zinc-900 px-3 py-2 text-xs font-bold text-white transition hover:bg-zinc-800 md:mt-5 md:rounded-xl md:px-5 md:py-2.5 md:text-sm dark:bg-amber-500 dark:text-zinc-950 dark:hover:bg-amber-400"
          >
            Beli Tiket Diskon — Klik disini
          </a>

          <button
            type="button"
            onClick={onClose}
            className="mt-2 w-full rounded-lg px-3 py-1.5 text-xs font-medium text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-700 md:mt-3 md:rounded-xl md:px-4 md:py-2 md:text-sm dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}