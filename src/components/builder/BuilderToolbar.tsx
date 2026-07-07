"use client";

import {
  ChevronDown,
  FileDown,
  FileUp,
  Languages,
  Palette,
  RotateCcw,
} from "lucide-react";
import { useRef, useState } from "react";
import { useResume } from "@/context/ResumeContext";
import { themeColors } from "@/lib/colors";
import type { ColorTheme, ExportMode, ModernTemplate } from "@/lib/types";
import { ScoreRing } from "./ScoreRing";
import dynamic from "next/dynamic";

const PDFDownload = dynamic(
  () => import("./PDFDownload").then((m) => m.PDFDownload),
  {
    ssr: false,
    loading: () => (
      <span className="rounded-full bg-white/10 px-4 py-2 text-xs font-bold text-white/40">
        PDF...
      </span>
    ),
  },
);

const templates: { id: ModernTemplate; label: string }[] = [
  { id: "elegant", label: "Elegant" },
  { id: "minimal", label: "Minimal" },
  { id: "professional", label: "Professional" },
  { id: "executive", label: "Executive" },
  { id: "creative", label: "Creative" },
  { id: "compact", label: "Compact" },
  { id: "academic", label: "Academic" },
];

const themes: ColorTheme[] = [
  "indigo",
  "emerald",
  "rose",
  "slate",
  "amber",
  "violet",
];

export function BuilderToolbar() {
  const { config, updateConfig, reset, saveJson, loadJson } = useResume();
  const fileRef = useRef<HTMLInputElement>(null);
  const [showStyle, setShowStyle] = useState(false);
  const [showMore, setShowMore] = useState(false);

  const handleLoad = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        await loadJson(file);
      } catch {
        alert("File JSON ga valid");
      }
    }
    e.target.value = "";
  };

  return (
    <div className="sticky top-0 z-30 border-b border-white/10 bg-[#0f0a1a]/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-3 px-4 py-3">
        <a href="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-cyan-400 text-xs font-black">
            CV
          </span>
          <span className="text-sm font-black">Eazy CV</span>
        </a>

        <div className="hidden items-center gap-2 lg:flex">
          <div className="flex rounded-full border border-white/10 p-0.5">
            {(["modern", "ats"] as ExportMode[]).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => updateConfig({ exportMode: mode })}
                className={`rounded-full px-4 py-1.5 text-xs font-bold transition ${
                  config.exportMode === mode
                    ? "bg-purple-500 text-white"
                    : "text-white/50 hover:text-white"
                }`}
              >
                {mode === "modern" ? "✨ Modern" : "🎯 ATS"}
              </button>
            ))}
          </div>

          {config.exportMode === "modern" && (
            <button
              type="button"
              onClick={() => setShowStyle(!showStyle)}
              className="inline-flex items-center gap-1 rounded-full border border-white/10 px-3 py-1.5 text-xs font-bold text-white/70 hover:bg-white/5"
            >
              <Palette className="h-3.5 w-3.5" />
              Style
              <ChevronDown
                className={`h-3 w-3 transition ${showStyle ? "rotate-180" : ""}`}
              />
            </button>
          )}

          <button
            type="button"
            onClick={() =>
              updateConfig({
                language: config.language === "id" ? "en" : "id",
              })
            }
            className="rounded-full border border-white/10 px-3 py-1.5 text-xs font-bold text-white/70 hover:bg-white/5"
          >
            <Languages className="mr-1 inline h-3.5 w-3.5" />
            {config.language === "id" ? "ID" : "EN"}
          </button>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden lg:block">
            <ScoreRing />
          </div>
          <PDFDownload />
          <button
            type="button"
            onClick={() => setShowMore(!showMore)}
            className="rounded-full border border-white/10 p-2 text-white/50 hover:bg-white/5 lg:hidden"
          >
            <ChevronDown className="h-4 w-4" />
          </button>
        </div>
      </div>

      {showStyle && config.exportMode === "modern" && (
        <div className="border-t border-white/10 px-4 py-3">
          <div className="mx-auto flex max-w-[1600px] flex-wrap items-center gap-3">
            <select
              value={config.template}
              onChange={(e) =>
                updateConfig({
                  template: e.target.value as ModernTemplate,
                })
              }
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold text-white outline-none"
            >
              {templates.map((t) => (
                <option key={t.id} value={t.id} className="bg-[#1a1025]">
                  {t.label}
                </option>
              ))}
            </select>
            <div className="flex items-center gap-1.5">
              {themes.map((theme) => (
                <button
                  key={theme}
                  type="button"
                  onClick={() => updateConfig({ colorTheme: theme })}
                  className={`h-6 w-6 rounded-full border-2 transition ${
                    config.colorTheme === theme
                      ? "border-white scale-110"
                      : "border-transparent"
                  }`}
                  style={{ backgroundColor: themeColors[theme].primary }}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {showMore && (
        <div className="border-t border-white/10 px-4 py-3 lg:hidden">
          <div className="flex flex-wrap gap-2">
            <div className="flex rounded-full border border-white/10 p-0.5">
              {(["modern", "ats"] as ExportMode[]).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => updateConfig({ exportMode: mode })}
                  className={`rounded-full px-3 py-1 text-xs font-bold ${
                    config.exportMode === mode
                      ? "bg-purple-500 text-white"
                      : "text-white/50"
                  }`}
                >
                  {mode === "modern" ? "Modern" : "ATS"}
                </button>
              ))}
            </div>
            {config.exportMode === "modern" && (
              <select
                value={config.template}
                onChange={(e) =>
                  updateConfig({
                    template: e.target.value as ModernTemplate,
                  })
                }
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-bold text-white"
              >
                {templates.map((t) => (
                  <option key={t.id} value={t.id} className="bg-[#1a1025]">
                    {t.label}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>
      )}

      <div className="hidden border-t border-white/5 px-4 py-2 lg:block">
        <div className="mx-auto flex max-w-[1600px] items-center gap-3 text-[10px] text-white/30">
          <button
            type="button"
            onClick={saveJson}
            className="hover:text-white/60"
          >
            <FileDown className="mr-1 inline h-3 w-3" />
            Save
          </button>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="hover:text-white/60"
          >
            <FileUp className="mr-1 inline h-3 w-3" />
            Load
          </button>
          <input
            ref={fileRef}
            type="file"
            accept=".json"
            className="hidden"
            onChange={handleLoad}
          />
          <button
            type="button"
            onClick={() => {
              if (confirm("Reset semua?")) reset();
            }}
            className="hover:text-white/60"
          >
            <RotateCcw className="mr-1 inline h-3 w-3" />
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}