"use client";

import { ZoomIn, ZoomOut } from "lucide-react";

interface Props {
  zoom: number;
  onZoomChange: (zoom: number) => void;
}

export function PreviewControls({ zoom, onZoomChange }: Props) {
  return (
    <div className="flex items-center gap-1 rounded-full border border-zinc-200 bg-white p-0.5 shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
      <button
        type="button"
        onClick={() => onZoomChange(Math.max(0.4, zoom - 0.1))}
        className="rounded-full p-1.5 text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-700"
        aria-label="Zoom out"
      >
        <ZoomOut className="h-3.5 w-3.5" />
      </button>
      <span className="min-w-[2.5rem] text-center text-[10px] font-bold text-zinc-500 dark:text-zinc-400">
        {Math.round(zoom * 100)}%
      </span>
      <button
        type="button"
        onClick={() => onZoomChange(Math.min(1.2, zoom + 0.1))}
        className="rounded-full p-1.5 text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-700"
        aria-label="Zoom in"
      >
        <ZoomIn className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}