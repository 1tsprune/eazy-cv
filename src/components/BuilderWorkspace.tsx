"use client";

import { useState } from "react";
import { ArrowLeft, Eye, FileText, Target } from "lucide-react";
import { ResumeForm } from "@/components/builder/ResumeForm";
import { ResumePreview } from "@/components/builder/ResumePreview";
import { AtsScorePanel } from "@/components/builder/AtsScorePanel";
import { CoverLetterForm } from "@/components/builder/CoverLetterForm";
import { CoverLetterPreview } from "@/components/builder/CoverLetterPreview";
import { QuickActions } from "@/components/builder/QuickActions";
import { PreviewControls } from "@/components/builder/PreviewControls";
import { PrivacyBadge } from "@/components/PrivacyBadge";
import { SectionOrderPanel } from "@/components/builder/SectionOrderPanel";
import { useResume } from "@/context/ResumeContext";
import { useTheme } from "@/context/ThemeContext";
import { getUiDict } from "@/lib/ui-i18n";

type Tab = "form" | "preview" | "score";

export function BuilderWorkspace() {
  const { data, config, coverLetter, isLoaded } = useResume();
  const { uiLocale } = useTheme();
  const t = getUiDict(uiLocale);
  const [tab, setTab] = useState<Tab>("form");
  const [showCover, setShowCover] = useState(false);
  const [zoom, setZoom] = useState(0.75);
  const [coverZoom, setCoverZoom] = useState(0.8);

  if (!isLoaded) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-sm text-zinc-400">
        Memuat...
      </div>
    );
  }

  const tabs = [
    { id: "form" as Tab, label: t.tabForm, icon: FileText },
    { id: "preview" as Tab, label: t.tabPreview, icon: Eye },
    { id: "score" as Tab, label: t.tabScore, icon: Target },
  ];

  const showMobileLeft = showCover || tab === "form";
  const showMobileCvPreview = !showCover && tab === "preview";
  const showMobileCoverPreview = showCover;
  const showMobileScore = !showCover && tab === "score";

  return (
    <div className="bg-zinc-50 dark:bg-zinc-950">
      {/* ── Mobile only ── */}
      <div className="border-b border-zinc-200 px-4 py-2 md:hidden dark:border-zinc-800">
        <PrivacyBadge variant="compact" />
      </div>

      {showCover ? (
        <div className="sticky top-14 z-20 flex items-center gap-3 border-b border-zinc-200 bg-white px-4 py-3 md:hidden dark:border-zinc-800 dark:bg-zinc-900">
          <button
            type="button"
            onClick={() => setShowCover(false)}
            className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 px-3 py-1.5 text-xs font-bold text-zinc-600 transition hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            {t.backToCv}
          </button>
          <span className="text-xs font-bold text-zinc-800 dark:text-white">
            {t.coverLetterTitle}
          </span>
        </div>
      ) : (
        <div className="sticky top-14 z-20 flex border-b border-zinc-200 bg-white md:hidden dark:border-zinc-800 dark:bg-zinc-900">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={`flex flex-1 items-center justify-center gap-1.5 py-3 text-xs font-bold ${
                tab === id
                  ? "border-b-2 border-indigo-600 text-indigo-600 dark:text-indigo-400"
                  : "text-zinc-400"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span>{label}</span>
            </button>
          ))}
        </div>
      )}

      {/* ── Desktop: 1 halaman, 2 kolom, tanpa tab ── */}
      <div className="mx-auto hidden max-w-screen-2xl gap-6 p-6 md:grid md:grid-cols-2">
        <div className="space-y-4">
          <PrivacyBadge variant="subtle" />
          <QuickActions
            showCover={showCover}
            onToggleCover={() => setShowCover((v) => !v)}
          />
          {showCover ? (
            <CoverLetterForm />
          ) : (
            <>
              <SectionOrderPanel />
              <ResumeForm />
            </>
          )}
        </div>

        <div className="space-y-4 md:sticky md:top-14 md:self-start">
          {showCover ? (
            <>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-bold text-zinc-800 dark:text-white">
                  {t.coverLetterTitle} 📄
                </h2>
                <PreviewControls
                  zoom={coverZoom}
                  onZoomChange={setCoverZoom}
                />
              </div>
              <div className="overflow-auto rounded-2xl border border-zinc-200 bg-zinc-100 p-3 dark:border-zinc-700">
                <div
                  className="origin-top transition-transform"
                  style={{ transform: `scale(${coverZoom})` }}
                >
                  <CoverLetterPreview
                    personal={data.personal}
                    coverLetter={coverLetter}
                    language={config.language}
                    config={config}
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-sm font-bold text-zinc-800 dark:text-white">
                    {t.previewTitle} 👀
                  </h2>
                  <div className="flex items-center gap-2">
                    <PreviewControls zoom={zoom} onZoomChange={setZoom} />
                    <span className="rounded-full bg-indigo-100 px-2.5 py-0.5 text-[10px] font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                      {config.exportMode === "ats" ? "ATS" : config.template}
                    </span>
                  </div>
                </div>
                <div className="overflow-auto rounded-2xl border border-zinc-200 bg-zinc-100 p-3 dark:border-zinc-700">
                  <div
                    className="origin-top transition-transform"
                    style={{ transform: `scale(${zoom})` }}
                  >
                    <ResumePreview data={data} config={config} />
                  </div>
                </div>
              </div>
              <AtsScorePanel />
            </>
          )}
        </div>
      </div>

      {/* ── Mobile: tab switching ── */}
      <div className="mx-auto max-w-screen-2xl space-y-4 p-4 md:hidden">
        {showMobileLeft && (
          <div className="space-y-4">
            <QuickActions
              showCover={showCover}
              onToggleCover={() => setShowCover((v) => !v)}
            />
            {showCover ? (
              <CoverLetterForm />
            ) : (
              <>
                <SectionOrderPanel />
                <ResumeForm />
              </>
            )}
          </div>
        )}

        {showMobileCvPreview && (
          <div>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-bold text-zinc-800 dark:text-white">
                {t.previewTitle} 👀
              </h2>
              <PreviewControls zoom={zoom} onZoomChange={setZoom} />
            </div>
            <div className="overflow-auto rounded-2xl border border-zinc-200 bg-zinc-100 p-3 dark:border-zinc-700">
              <div
                className="origin-top transition-transform"
                style={{ transform: `scale(${zoom})` }}
              >
                <ResumePreview data={data} config={config} />
              </div>
            </div>
          </div>
        )}

        {showMobileCoverPreview && (
          <div>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-bold text-zinc-800 dark:text-white">
                {t.coverLetterTitle} 📄
              </h2>
              <PreviewControls zoom={coverZoom} onZoomChange={setCoverZoom} />
            </div>
            <div className="overflow-auto rounded-2xl border border-zinc-200 bg-zinc-100 p-3 dark:border-zinc-700">
              <div
                className="origin-top transition-transform"
                style={{ transform: `scale(${coverZoom})` }}
              >
                <CoverLetterPreview
                  personal={data.personal}
                  coverLetter={coverLetter}
                  language={config.language}
                  config={config}
                />
              </div>
            </div>
          </div>
        )}

        {showMobileScore && !showCover && <AtsScorePanel />}
      </div>
    </div>
  );
}