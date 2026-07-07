"use client";

import type { ReactNode } from "react";
import { DeleteButton } from "./DeleteButton";

interface SortableItemHeaderProps {
  index: number;
  onDelete: () => void;
  deleteLabel?: string;
  leading?: ReactNode;
}

export function SortableItemHeader({
  index,
  onDelete,
  deleteLabel,
  leading,
}: SortableItemHeaderProps) {
  return (
    <div className="mb-3 flex min-h-9 items-center justify-between gap-2">
      <div className="flex min-w-0 items-center gap-2">
        {leading ?? (
          <span className="text-xs font-medium text-zinc-400">#{index + 1}</span>
        )}
      </div>
      <DeleteButton onClick={onDelete} label={deleteLabel} />
    </div>
  );
}