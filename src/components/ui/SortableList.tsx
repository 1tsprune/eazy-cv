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
          className={`relative transition ${
            dragIndex === index ? "opacity-50" : ""
          }`}
        >
          <div className="absolute left-1 top-3 z-10 cursor-grab active:cursor-grabbing">
            <GripVertical className="h-4 w-4 text-zinc-300 dark:text-zinc-600" />
          </div>
          <div className="pl-6">{renderItem(item, index)}</div>
        </div>
      ))}
    </div>
  );
}