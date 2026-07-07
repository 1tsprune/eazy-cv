"use client";

import { themeColors } from "@/lib/colors";

export function CVMockup() {
  const c = themeColors.slate;

  return (
    <div className="relative mx-auto w-full max-w-md">
      <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-slate-200/40 to-zinc-200/40 blur-2xl" />
      <div className="relative rotate-1 rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl shadow-zinc-200/60 transition hover:rotate-0">
        <div
          className="mb-4 border-b-2 pb-4"
          style={{ borderColor: c.primary }}
        >
          <div
            className="text-xl font-bold"
            style={{ color: c.primary }}
          >
            Ahmad Rizki Pratama
          </div>
          <div className="text-xs text-zinc-500">Senior Software Engineer</div>
          <div className="mt-2 text-[10px] text-zinc-400">
            Jakarta · ahmad.rizki@email.com · +62 812-xxx
          </div>
        </div>
        {["RINGKASAN", "PENGALAMAN", "PENDIDIKAN", "SKILLS"].map((section) => (
          <div key={section} className="mb-3">
            <div
              className="mb-1.5 border-l-[3px] pl-2 text-[9px] font-bold tracking-widest"
              style={{ borderColor: c.primary, color: c.primary }}
            >
              {section}
            </div>
            <div className="space-y-1">
              <div className="h-2 w-full rounded bg-zinc-100" />
              <div className="h-2 w-4/5 rounded bg-zinc-100" />
              {section === "SKILLS" && (
                <div className="flex flex-wrap gap-1 pt-1">
                  {["React", "TypeScript", "Node.js", "AWS"].map((s) => (
                    <span
                      key={s}
                      className="rounded px-1.5 py-0.5 text-[8px] font-medium"
                      style={{ backgroundColor: c.light, color: c.primary }}
                    >
                      {s}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        <div className="absolute -right-3 -top-3 rounded-full bg-emerald-500 px-3 py-1 text-[10px] font-bold text-white shadow-lg">
          ATS 92
        </div>
      </div>
    </div>
  );
}