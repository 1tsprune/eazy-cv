"use client";

import { X } from "lucide-react";
import { useState, type KeyboardEvent } from "react";

interface TagInputProps {
  label?: string;
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
}

export function TagInput({
  label,
  tags,
  onChange,
  placeholder = "Ketik lalu Enter...",
}: TagInputProps) {
  const [input, setInput] = useState("");
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  const addTag = (value: string) => {
    const trimmed = value.trim();
    if (trimmed && !tags.includes(trimmed)) {
      onChange([...tags, trimmed]);
    }
    setInput("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(input);
    }
    if (e.key === "Backspace" && !input && tags.length) {
      onChange(tags.slice(0, -1));
    }
  };

  const handleTagDrop = (toIndex: number) => {
    if (dragIndex === null || dragIndex === toIndex) return;
    const next = [...tags];
    const [moved] = next.splice(dragIndex, 1);
    next.splice(toIndex, 0, moved);
    onChange(next);
    setDragIndex(null);
  };

  return (
    <label className="block">
      {label && (
        <span className="mb-1.5 block text-xs font-medium text-zinc-500 dark:text-zinc-400">
          {label}
        </span>
      )}
      <div className="flex min-h-[42px] flex-wrap gap-1.5 rounded-xl border border-zinc-200 bg-white px-2 py-2 focus-within:border-slate-400 focus-within:ring-2 focus-within:ring-slate-100 dark:border-zinc-700 dark:bg-zinc-800 dark:focus-within:border-slate-500 dark:focus-within:ring-slate-800">
        {tags.map((tag, index) => (
          <span
            key={`${tag}-${index}`}
            draggable
            onDragStart={() => setDragIndex(index)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleTagDrop(index)}
            onDragEnd={() => setDragIndex(null)}
            className={`inline-flex cursor-grab items-center gap-1 rounded-lg bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700 active:cursor-grabbing dark:bg-slate-800 dark:text-slate-300 ${
              dragIndex === index ? "opacity-50" : ""
            }`}
          >
            {tag}
            <button
              type="button"
              onClick={() => onChange(tags.filter((_, i) => i !== index))}
              aria-label={`Hapus ${tag}`}
              className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 active:scale-95 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100"
            >
              <X className="h-3.5 w-3.5" strokeWidth={2.5} />
            </button>
          </span>
        ))}
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => input && addTag(input)}
          placeholder={tags.length ? "" : placeholder}
          className="min-w-[120px] flex-1 bg-transparent px-1 py-0.5 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 dark:text-white dark:placeholder:text-zinc-500"
        />
      </div>
    </label>
  );
}