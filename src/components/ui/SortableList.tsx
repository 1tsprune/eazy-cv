"use client";

import { GripVertical } from "lucide-react";
import { useState, type ReactNode } from "react";

interface SortableListProps<T> {
  items: T[];
  keyExtractor: (item: T) => string;
  onReorder: (items: T[]) => void;
  renderItem: (item: T, index: number) => ReactNode;
  hint?: string;
}

export function SortableList<T>({
  items,
  keyExtractor,
  onReorder,
  renderItem,
  hint,
}: SortableListProps<T>) {
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  const handleDrop = (toIndex: number) => {
    if (dragIndex === null || dragIndex === toIndex) return;
    const next = [...items];
    const [moved] = next.splice(dragIndex, 1);
    next.splice(toIndex, 0, moved);
    onReorder(next);
    setDragIndex(null);
  };

  return (
    <div className="space-y-3">
      {hint && (
        <p className="text-[10px] font-medium text-zinc-400 dark:text-zinc-500">
          {hint}
        </p>
      )}
      {items.map((item, index) => (
        <div
          key={keyExtractor(item)}
          draggable
          onDragStart={() => setDragIndex(index)}
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => handleDrop(index)}
          onDragEnd={() => setDragIndex(null)}
          className={`flex items-start gap-1.5 transition ${
            dragIndex === index ? "opacity-50" : ""
          }`}
        >
          <div
            className="mt-3 flex h-9 w-7 shrink-0 cursor-grab items-center justify-center active:cursor-grabbing"
            aria-hidden
          >
            <GripVertical className="h-[18px] w-[18px] text-zinc-300 dark:text-zinc-600" />
          </div>
          <div className="min-w-0 flex-1">{renderItem(item, index)}</div>
        </div>
      ))}
    </div>
  );
}