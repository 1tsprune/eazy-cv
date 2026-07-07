"use client";

import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  variant?: "cv" | "letter";
}

export function PreviewDesk({ children, variant = "cv" }: Props) {
  return (
    <div
      className={`overflow-y-auto rounded-xl border border-zinc-200 p-2 dark:border-zinc-700 ${
        variant === "cv"
          ? "bg-[#e8eaed] md:max-h-[calc(100vh-17rem)] dark:bg-zinc-800/80"
          : "bg-zinc-100 dark:bg-zinc-800/60"
      }`}
    >
      {children}
    </div>
  );
}