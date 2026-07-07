"use client";

import {
  Database,
  FileDown,
  FileUp,
  Globe,
  Menu,
  Moon,
  RotateCcw,
  Sun,
  X,
} from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { DevAvatar } from "@/components/DevAvatar";
import { Logo } from "@/components/Logo";
import { DONATION, SOCIAL } from "@/lib/config";
import { themeColors } from "@/lib/colors";
import { getUiDict } from "@/lib/ui-i18n";
import { useTheme } from "@/context/ThemeContext";
import { useResume } from "@/context/ResumeContext";
import {
  CV_FONT_FAMILIES,
  CV_FONT_SIZES,
} from "@/lib/typography";
import type { ColorTheme, CvFontFamily, CvFontSize } from "@/lib/types";

const FONT_SIZE_LABEL_KEYS = {
  sm: "fontSizeSmall",
  md: "fontSizeMedium",
  lg: "fontSizeLarge",
} as const satisfies Record<CvFontSize, keyof ReturnType<typeof getUiDict>>;
import dynamic from "next/dynamic";

const PDFDownload = dynamic(
  () => import("@/components/builder/PDFDownload").then((m) => m.PDFDownload),
  { ssr: false },
);

const themes: ColorTheme[] = [
  "indigo",
  "emerald",
  "rose",
  "slate",
  "amber",
  "violet",
];

export function AppHeader() {
  const { theme, toggleTheme, uiLocale, setUiLocale } = useTheme();
  const { data, config, updateConfig, saveJson, loadJson, reset } = useResume();
  const t = getUiDict(uiLocale);
  const [styleMenuOpen, setStyleMenuOpen] = useState(false);
  const [dataMenuOpen, setDataMenuOpen] = useState(false);
  const styleMenuRef = useRef<HTMLDivElement>(null);
  const dataMenuRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        styleMenuRef.current &&
        !styleMenuRef.current.contains(e.target as Node)
      ) {
        setStyleMenuOpen(false);
      }
      if (
        dataMenuRef.current &&
        !dataMenuRef.current.contains(e.target as Node)
      ) {
        setDataMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const toggleCvLanguage = () => {
    const next = config.language === "id" ? "en" : "id";
    updateConfig({ language: next });
    setUiLocale(next);
  };

  const handleLoad = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        await loadJson(file);
        setDataMenuOpen(false);
      } catch {
        alert(t.jsonInvalid);
      }
    }
    e.target.value = "";
  };

  const handleReset = () => {
    if (window.confirm(t.resetConfirm)) {
      reset();
      setDataMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 shrink-0 border-b border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mx-auto flex h-14 max-w-screen-2xl items-center justify-between gap-3 px-4 sm:px-5">
        <Logo size="sm" showTagline />

        <div className="flex items-center gap-2">
          <a
            href={SOCIAL.twitter.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group hidden items-center gap-2 rounded-full border border-zinc-200 py-1 pl-1 pr-2.5 text-[10px] font-medium text-zinc-500 transition hover:border-zinc-300 hover:text-zinc-800 dark:border-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 sm:flex"
          >
            <DevAvatar size="sm" rounded="full" />
            <span>{SOCIAL.twitter.handle}</span>
          </a>

          <button
            type="button"
            onClick={toggleCvLanguage}
            className="flex items-center gap-1 rounded-lg border border-zinc-200 px-2.5 py-1.5 text-[10px] font-bold text-zinc-600 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
            title={t.cvLanguage}
          >
            <Globe className="h-3.5 w-3.5" />
            CV {config.language.toUpperCase()}
          </button>

          <button
            type="button"
            onClick={toggleTheme}
            className="rounded-lg border border-zinc-200 p-2 text-zinc-600 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
            title={theme === "light" ? t.darkMode : t.lightMode}
          >
            {theme === "light" ? (
              <Moon className="h-4 w-4" />
            ) : (
              <Sun className="h-4 w-4" />
            )}
          </button>

          <div className="relative" ref={dataMenuRef}>
            <button
              type="button"
              onClick={() => {
                setDataMenuOpen(!dataMenuOpen);
                setStyleMenuOpen(false);
              }}
              className={`flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-bold transition ${
                dataMenuOpen
                  ? "border-slate-400 bg-slate-100 text-slate-700 dark:border-slate-500 dark:bg-slate-800 dark:text-slate-300"
                  : "border-zinc-200 text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
              }`}
            >
              <Database className="h-4 w-4" />
              <span className="hidden sm:inline">{t.menuData}</span>
            </button>

            {dataMenuOpen && (
              <div className="absolute right-0 top-full z-50 mt-2 w-[min(100vw-2rem,280px)] rounded-2xl border border-zinc-200 bg-white p-4 shadow-xl dark:border-zinc-700 dark:bg-zinc-900">
                <p className="text-[10px] leading-relaxed text-zinc-500 dark:text-zinc-400">
                  {t.dataBackupHint}
                </p>
                <div className="mt-3 space-y-2">
                  <button
                    type="button"
                    onClick={() => {
                      saveJson();
                      setDataMenuOpen(false);
                    }}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-700 px-4 py-2.5 text-xs font-bold text-white hover:bg-slate-800"
                  >
                    <FileDown className="h-4 w-4" />
                    {t.save} JSON
                  </button>
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-200 px-4 py-2.5 text-xs font-bold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-200 dark:hover:bg-zinc-800"
                  >
                    <FileUp className="h-4 w-4" />
                    {t.load} JSON
                  </button>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-rose-200 px-4 py-2.5 text-xs font-bold text-rose-600 hover:bg-rose-50 dark:border-rose-900 dark:text-rose-400 dark:hover:bg-rose-950"
                  >
                    <RotateCcw className="h-4 w-4" />
                    {t.reset}
                  </button>
                  <a
                    href={DONATION.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-200 px-4 py-2.5 text-xs font-bold text-zinc-600 hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800"
                  >
                    ☕ {t.supportTrakteer}
                  </a>
                </div>
                <input
                  ref={fileRef}
                  type="file"
                  accept=".json,application/json"
                  className="hidden"
                  onChange={handleLoad}
                />
              </div>
            )}
          </div>

          <div className="relative" ref={styleMenuRef}>
            <button
              type="button"
              onClick={() => {
                setStyleMenuOpen(!styleMenuOpen);
                setDataMenuOpen(false);
              }}
              className={`flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-bold transition ${
                styleMenuOpen
                  ? "border-slate-400 bg-slate-100 text-slate-700 dark:border-slate-500 dark:bg-slate-800 dark:text-slate-300"
                  : "border-zinc-200 text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
              }`}
            >
              {styleMenuOpen ? (
                <X className="h-4 w-4" />
              ) : (
                <Menu className="h-4 w-4" />
              )}
              {t.menuStyle}
            </button>

            {styleMenuOpen && (
              <div className="absolute right-0 top-full z-50 mt-2 w-[min(100vw-2rem,320px)] rounded-2xl border border-zinc-200 bg-white p-4 shadow-xl dark:border-zinc-700 dark:bg-zinc-900">
                {config.exportMode === "ats" ? (
                  <p className="mb-3 rounded-xl bg-zinc-100 px-3 py-2.5 text-[11px] leading-relaxed text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                    {t.atsStyleMenuHint}
                  </p>
                ) : (
                  <>
                    <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                      {t.color}
                    </p>
                    <div className="mb-1 flex flex-wrap gap-2">
                      {themes.map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => updateConfig({ colorTheme: c })}
                          className={`h-8 w-8 rounded-full border-2 ${
                            config.colorTheme === c
                              ? "border-zinc-900 dark:border-white"
                              : "border-transparent"
                          }`}
                          style={{ backgroundColor: themeColors[c].primary }}
                          title={c}
                        />
                      ))}
                    </div>

                    {data.personal.photo ? (
                      <label className="mb-3 flex cursor-pointer items-center gap-2 rounded-xl border border-zinc-200 px-3 py-2.5 text-[11px] font-semibold text-zinc-700 dark:border-zinc-700 dark:text-zinc-300">
                        <input
                          type="checkbox"
                          checked={config.showPhoto}
                          onChange={(e) =>
                            updateConfig({ showPhoto: e.target.checked })
                          }
                          className="rounded"
                        />
                        {t.showPhotoInCv}
                      </label>
                    ) : null}
                  </>
                )}

                <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                  {t.fontFamily}
                </p>
                <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
                  {CV_FONT_FAMILIES.map((font) => (
                    <button
                      key={font.id}
                      type="button"
                      onClick={() =>
                        updateConfig({ fontFamily: font.id as CvFontFamily })
                      }
                      className={`rounded-lg px-2 py-2 text-left text-[11px] font-semibold ${
                        config.fontFamily === font.id
                          ? "bg-slate-700 text-white"
                          : "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                      }`}
                    >
                      {font.label}
                    </button>
                  ))}
                </div>

                <p className="mb-2 mt-4 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                  {t.fontSize}
                </p>
                <div className="flex gap-2">
                  {CV_FONT_SIZES.map((size) => (
                    <button
                      key={size.id}
                      type="button"
                      onClick={() =>
                        updateConfig({ fontSize: size.id as CvFontSize })
                      }
                      className={`flex-1 rounded-xl py-2 text-xs font-bold ${
                        config.fontSize === size.id
                          ? "bg-slate-700 text-white"
                          : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
                      }`}
                    >
                      {t[FONT_SIZE_LABEL_KEYS[size.id]]}
                    </button>
                  ))}
                </div>

                <p className="mb-2 mt-4 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                  {t.fontBold}
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => updateConfig({ fontBold: false })}
                    className={`flex-1 rounded-xl py-2 text-xs font-bold ${
                      !config.fontBold
                        ? "bg-slate-700 text-white"
                        : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
                    }`}
                  >
                    {t.fontBoldOff}
                  </button>
                  <button
                    type="button"
                    onClick={() => updateConfig({ fontBold: true })}
                    className={`flex-1 rounded-xl py-2 text-xs font-bold ${
                      config.fontBold
                        ? "bg-slate-700 text-white"
                        : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
                    }`}
                  >
                    {t.fontBoldOn}
                  </button>
                </div>

                <div className="mt-4 border-t border-zinc-100 pt-4 dark:border-zinc-800">
                  <PDFDownload />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}