"use client";

import { FileText, Sparkles, Wand2 } from "lucide-react";
import { useResume } from "@/context/ResumeContext";

export function WelcomePanel() {
  const { data, loadSample } = useResume();
  const isEmpty =
    !data.personal.fullName &&
    data.experiences.length === 0 &&
    data.educations.length === 0;

  if (!isEmpty) return null;

  return (
    <div className="rounded-2xl border-2 border-dashed border-indigo-200 bg-gradient-to-br from-indigo-50 to-violet-50 p-6">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white">
          <Sparkles className="h-6 w-6" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-zinc-900">
            Selamat datang di Eazy CV!
          </h3>
          <p className="mt-1 text-sm text-zinc-600">
            Mulai dari nol atau muat contoh CV profesional untuk melihat
            bagaimana hasil akhirnya. Semua data tersimpan otomatis di browser
            kamu.
          </p>
          <button
            type="button"
            onClick={loadSample}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700"
          >
            <Wand2 className="h-4 w-4" />
            Muat Contoh CV
          </button>
        </div>
      </div>
      <div className="mt-4 grid gap-2 sm:grid-cols-3">
        {[
          { icon: FileText, text: "Isi form di kiri" },
          { icon: Sparkles, text: "Lihat preview real-time" },
          { icon: Wand2, text: "Download PDF instan" },
        ].map((step, i) => (
          <div
            key={step.text}
            className="flex items-center gap-2 rounded-lg bg-white/70 px-3 py-2 text-xs text-zinc-600"
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-100 text-[10px] font-bold text-indigo-600">
              {i + 1}
            </span>
            {step.text}
          </div>
        ))}
      </div>
    </div>
  );
}