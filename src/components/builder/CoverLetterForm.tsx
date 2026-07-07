"use client";

import { Sparkles } from "lucide-react";
import dynamic from "next/dynamic";
import { useResume } from "@/context/ResumeContext";
import { useTheme } from "@/context/ThemeContext";
import {
  buildCoverLetterDraft,
  resolveCoverLetterBody,
} from "@/lib/cover-letter";
import { getUiDict } from "@/lib/ui-i18n";
import { DateInput } from "@/components/ui/DateInput";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { SectionCard } from "@/components/ui/SectionCard";

const CoverLetterPDFDownload = dynamic(
  () =>
    import("@/components/builder/CoverLetterPDFDownload").then(
      (m) => m.CoverLetterPDFDownload,
    ),
  { ssr: false },
);

export function CoverLetterForm() {
  const { data, coverLetter, config, updateCoverLetter } = useResume();
  const { uiLocale } = useTheme();
  const t = getUiDict(uiLocale);

  const effectiveBody = resolveCoverLetterBody(
    data,
    coverLetter,
    config.language,
    config.cvProfile,
  );
  const isAuto = !(coverLetter.bodyCustom ?? coverLetter.body.trim() !== "");

  const handleGenerate = () => {
    // Re-sync to the CV + profile and hand control back to auto mode.
    updateCoverLetter({
      body: buildCoverLetterDraft(
        data,
        coverLetter,
        config.language,
        config.cvProfile,
      ),
      bodyCustom: false,
    });
  };

  return (
    <div className="space-y-4">
      <p className="text-xs text-zinc-500 dark:text-zinc-400">
        {t.coverLetterHint}
      </p>

      <SectionCard title={t.coverLetterDetails} defaultOpen>
        <div className="grid gap-3 sm:grid-cols-2">
          <DateInput
            label={t.coverLetterDate}
            value={coverLetter.date}
            locale={config.language}
            onChange={(date) => updateCoverLetter({ date })}
          />
          <Input
            label={t.coverLetterRecipient}
            value={coverLetter.recipient}
            onChange={(e) => updateCoverLetter({ recipient: e.target.value })}
            placeholder="Hiring Manager"
          />
          <Input
            label={t.coverLetterCompany}
            value={coverLetter.company}
            onChange={(e) => updateCoverLetter({ company: e.target.value })}
            placeholder="PT Contoh Indonesia"
          />
          <Input
            label={t.coverLetterPosition}
            value={coverLetter.position}
            onChange={(e) => updateCoverLetter({ position: e.target.value })}
            placeholder="Software Engineer"
          />
        </div>
      </SectionCard>

      <SectionCard title={t.coverLetterBody} defaultOpen>
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleGenerate}
            className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-100 px-3 py-1.5 text-[10px] font-bold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
          >
            <Sparkles className="h-3.5 w-3.5" />
            {t.generateFromCv}
          </button>
          {isAuto ? (
            <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
              {t.coverLetterAutoBadge}
            </span>
          ) : null}
        </div>
        <Textarea
          rows={14}
          value={effectiveBody}
          onChange={(e) =>
            updateCoverLetter({ body: e.target.value, bodyCustom: true })
          }
          placeholder={t.coverLetterBodyPlaceholder}
        />
        <p className="mt-2 text-[10px] text-zinc-400">
          {t.coverLetterAutoInfo.replace(
            "{name}",
            data.personal.fullName || "—",
          )}
        </p>
      </SectionCard>

      <CoverLetterPDFDownload />
    </div>
  );
}