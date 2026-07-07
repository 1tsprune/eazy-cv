"use client";

import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export function PreviewPaper({ children }: Props) {
  return (
    <div className="relative w-full">
      <div
        className="relative w-full overflow-hidden bg-white text-zinc-900"
        style={{
          minHeight: "297mm",
          boxShadow:
            "0 0 0 1px rgba(0,0,0,0.04), 0 2px 4px rgba(0,0,0,0.04), 0 12px 32px rgba(0,0,0,0.10), 0 32px 64px rgba(0,0,0,0.06)",
        }}
      >
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent"
          aria-hidden
        />
        {children}
      </div>
    </div>
  );
}