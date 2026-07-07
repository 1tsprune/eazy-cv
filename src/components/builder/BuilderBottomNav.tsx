"use client";

import { Eye, FileText, Target } from "lucide-react";

export type BuilderTab = "form" | "preview" | "score";

const TABS: { id: BuilderTab; icon: typeof FileText }[] = [
  { id: "form", icon: FileText },
  { id: "preview", icon: Eye },
  { id: "score", icon: Target },
];

type Props = {
  tab: BuilderTab;
  onTabChange: (tab: BuilderTab) => void;
  labels: Record<BuilderTab, string>;
};

export function BuilderBottomNav({ tab, onTabChange, labels }: Props) {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 border-t border-zinc-200 bg-white/95 backdrop-blur-md md:hidden dark:border-zinc-800 dark:bg-zinc-900/95"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div className="grid h-16 grid-cols-3">
        {TABS.map(({ id, icon: Icon }) => {
          const active = tab === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onTabChange(id)}
              className={`relative flex flex-col items-center justify-center gap-1 transition-colors active:scale-95 ${
                active
                  ? "text-slate-700 dark:text-slate-200"
                  : "text-zinc-400 dark:text-zinc-500"
              }`}
            >
              {active ? (
                <span className="absolute top-0 left-1/2 h-0.5 w-8 -translate-x-1/2 rounded-b-full bg-slate-700 dark:bg-slate-300" />
              ) : null}
              <Icon className="h-4 w-4" />
              <span className="text-[10px] font-bold">{labels[id]}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}