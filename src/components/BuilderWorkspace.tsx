"use client";

import { useCallback, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { scrollToCvSection } from "@/lib/ats-scroll-targets";
import {
  BuilderBottomNav,
  type BuilderTab,
} from "@/components/builder/BuilderBottomNav";
import { CvTipsDrawer } from "@/components/builder/CvTipsDrawer";
import { CvTipsFab } from "@/components/builder/CvTipsFab";
import { ResumeForm } from "@/components/builder/ResumeForm";
import { ResumePdfPreview } from "@/components/builder/ResumePdfPreview";
import { CoverLetterForm } from "@/components/builder/CoverLetterForm";
import { CoverLetterPreview } from "@/components/builder/CoverLetterPreview";
import { QuickActions } from "@/components/builder/QuickActions";
import { PreviewDesk } from "@/components/builder/PreviewDesk";
import { SampleDataBanner } from "@/components/builder/SampleDataBanner";
import { TemplatePicker } from "@/components/builder/TemplatePicker";
import { WelcomePanel } from "@/components/builder/WelcomePanel";
import { PrivacyBadge } from "@/components/PrivacyBadge";
import { SectionOrderPanel } from "@/components/builder/SectionOrderPanel";
import { useResume } from "@/context/ResumeContext";
import { useTheme } from "@/context/ThemeContext";
import { resolveCoverLetterBody } from "@/lib/cover-letter";
import { getUiDict } from "@/lib/ui-i18n";

export function BuilderWorkspace() {
  const { data, config, coverLetter, isLoaded } = useResume();
  const { uiLocale } = useTheme();
  const t = getUiDict(uiLocale);
  const [tab, setTab] = useState<BuilderTab>("form");
  const [showCover, setShowCover] = useState(false);
  const [tipsOpen, setTipsOpen] = useState(false);

  const coverLetterResolved = {
    ...coverLetter,
    body: resolveCoverLetterBody(
      data,
      coverLetter,
      config.language,
      config.cvProfile,
    ),
  };

  const handleFixCheck = useCallback(
    (_checkId: string, scrollTarget: string) => {
      setTab("form");
      window.setTimeout(() => scrollToCvSection(scrollTarget), 120);
    },
    [],
  );

  if (!isLoaded) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-sm text-zinc-400">
        Memuat...
      </div>
    );
  }

  const bottomNavLabels: Record<BuilderTab, string> = {
    form: t.tabForm,
    preview: t.tabPreview,
  };

  const showMobileLeft = showCover || tab === "form";
  const showMobileCvPreview = !showCover && tab === "preview";
  const showMobileCoverPreview = showCover;

  return (
    <div className="bg-zinc-50 dark:bg-zinc-950">
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
      ) : null}

      <div className="mx-auto hidden max-w-screen-2xl items-start gap-4 p-4 md:grid md:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
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
              <SampleDataBanner />
              <WelcomePanel />
              <TemplatePicker />
              <SectionOrderPanel />
              <ResumeForm />
            </>
          )}
        </div>

        <div className="md:sticky md:top-14 md:self-start">
          {showCover ? (
            <>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-bold text-zinc-800 dark:text-white">
                  {t.coverLetterTitle} 📄
                </h2>
              </div>
              <PreviewDesk variant="letter">
                <CoverLetterPreview
                  personal={data.personal}
                  coverLetter={coverLetter}
                  language={config.language}
                  config={config}
                />
              </PreviewDesk>
            </>
          ) : (
            <div>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-bold text-zinc-800 dark:text-white">
                  {t.previewTitle} 👀
                </h2>
                <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold capitalize text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                  {config.exportMode === "ats" ? "ATS" : config.template}
                </span>
              </div>
              <PreviewDesk>
                <ResumePdfPreview />
              </PreviewDesk>
            </div>
          )}
        </div>
      </div>

      <div className="mx-auto min-w-0 max-w-full space-y-4 overflow-x-hidden p-3 pb-20 md:hidden sm:p-4 sm:pb-20">
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
                <SampleDataBanner />
                <WelcomePanel />
                <TemplatePicker />
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
              <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold capitalize text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                {config.exportMode === "ats" ? "ATS" : config.template}
              </span>
            </div>
            <PreviewDesk>
              <ResumePdfPreview />
            </PreviewDesk>
          </div>
        )}

        {showMobileCoverPreview && (
          <div>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-bold text-zinc-800 dark:text-white">
                {t.coverLetterTitle} 📄
              </h2>
            </div>
            <PreviewDesk variant="letter">
              <CoverLetterPreview
                personal={data.personal}
                coverLetter={coverLetterResolved}
                language={config.language}
                config={config}
              />
            </PreviewDesk>
          </div>
        )}
      </div>

      {!showCover ? (
        <>
          <BuilderBottomNav
            tab={tab}
            onTabChange={setTab}
            labels={bottomNavLabels}
          />
          <CvTipsFab onClick={() => setTipsOpen(true)} />
          <CvTipsDrawer
            open={tipsOpen}
            onClose={() => setTipsOpen(false)}
            onFixCheck={handleFixCheck}
          />
        </>
      ) : null}
    </div>
  );
}