"use client";

import { useMemo } from "react";
import { useResume } from "@/context/ResumeContext";
import { calculateCompletion } from "@/lib/completion";

export function CompletionBar() {
  const { data } = useResume();
  const percent = useMemo(() => calculateCompletion(data), [data]);

  const color =
    percent >= 80
      ? "bg-emerald-500"
      : percent >= 50
        ? "bg-amber-500"
        : "bg-slate-600";

  return (
    <div className="rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-zinc-600">Kelengkapan CV</span>
        <span className="font-bold text-zinc-900">{percent}%</span>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-zinc-100">
        <div
          className={`h-full rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${percent}%` }}
        />
      </div>
      <p className="mt-2 text-[10px] text-zinc-400">
        {percent >= 80
          ? "CV kamu hampir siap! Download PDF dan mulai melamar."
          : percent >= 50
            ? "Bagus! Lengkapi pengalaman & skills untuk hasil maksimal."
            : "Mulai isi data pribadi dan pengalaman kerja kamu."}
      </p>
    </div>
  );
}