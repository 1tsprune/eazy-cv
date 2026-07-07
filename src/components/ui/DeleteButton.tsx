"use client";

import { Trash2 } from "lucide-react";

interface DeleteButtonProps {
  onClick: () => void;
  label?: string;
  className?: string;
}

export function DeleteButton({
  onClick,
  label = "Hapus",
  className = "",
}: DeleteButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-transparent text-zinc-400 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 active:scale-95 dark:hover:border-rose-900 dark:hover:bg-rose-950/50 dark:hover:text-rose-400 ${className}`}
    >
      <Trash2 className="h-[18px] w-[18px]" strokeWidth={2} />
    </button>
  );
}