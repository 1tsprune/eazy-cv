"use client";

import { Calendar, MapPin, X } from "lucide-react";

const TICKET_URL = "https://coinfest.asia/with/EkyJanuarta";
const MAPS_URL =
  "https://www.google.com/maps/place/Coinfest+Asia/@-8.8481907,115.1570723,20.72z/data=!4m6!3m5!1s0x2dd245a7179276d1:0x7d89a71f7eb052ca!8m2!3d-8.8480625!4d115.1570625!16s%2Fg%2F11stxm5__m?entry=tts";
const LOGO_URL = "https://coinfest.asia/logo%20navbar/logo%20navbar.png";

type Props = {
  onClose: () => void;
};

export function CoinfestPopup({ onClose }: Props) {
  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
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
        className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-zinc-200/80 dark:bg-zinc-900 dark:ring-zinc-700"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup"
          className="absolute right-3 top-3 rounded-lg p-1.5 text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="px-6 pb-6 pt-8 text-center">
          <div className="mb-5 flex justify-center">
            <img
              src={LOGO_URL}
              alt="Coinfest Asia"
              width={200}
              height={48}
              className="h-10 w-auto max-w-[200px] object-contain"
            />
          </div>

          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Prune akan hadir di
          </p>
          <h2
            id="coinfest-popup-title"
            className="mt-1 text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50"
          >
            Coinfest Asia 2026
          </h2>

          <div className="mx-auto mt-5 inline-flex items-center gap-2.5 rounded-xl bg-amber-50 px-4 py-2.5 ring-1 ring-amber-200/80 dark:bg-amber-950/40 dark:ring-amber-900/50">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-500 text-white shadow-sm">
              <Calendar className="h-4 w-4" aria-hidden />
            </span>
            <span className="text-left text-sm font-semibold text-amber-950 dark:text-amber-100">
              20–21 Agustus 2026
            </span>
          </div>

          <p className="mt-4 flex flex-wrap items-center justify-center gap-1 text-sm text-zinc-600 dark:text-zinc-300">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-zinc-400" aria-hidden />
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
            className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-zinc-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-zinc-800 dark:bg-amber-500 dark:text-zinc-950 dark:hover:bg-amber-400"
          >
            Beli Tiket Diskon — Klik disini
          </a>

          <button
            type="button"
            onClick={onClose}
            className="mt-3 w-full rounded-xl px-4 py-2 text-sm font-medium text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}