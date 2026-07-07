"use client";

import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  /** Gray desk background (CV preview) vs light (cover letter) */
  variant?: "cv" | "letter";
}

export function PreviewDesk({ children, variant = "cv" }: Props) {
  return (
    <div
      className={`flex min-h-[min(80vh,720px)] justify-center overflow-y-auto rounded-2xl border border-zinc-200 p-4 sm:p-5 dark:border-zinc-700 ${
        variant === "cv" ? "bg-[#e8eaed] dark:bg-zinc-800/80" : "bg-zinc-100 dark:bg-zinc-800/60"
      }`}
    >
      <div className="w-full max-w-[210mm]">{children}</div>
    </div>
  );
}