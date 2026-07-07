"use client";

import { Sparkles } from "lucide-react";
import dynamic from "next/dynamic";
import { useResume } from "@/context/ResumeContext";
import { useTheme } from "@/context/ThemeContext";
import { buildCoverLetterDraft } from "@/lib/cover-letter";
import { getUiDict } from "@/lib/ui-i18n";
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

  const handleGenerate = () => {
    updateCoverLetter({
      body: buildCoverLetterDraft(data, coverLetter, config.language),
    });
  };

  return (
    <div className="space-y-4">
      <p className="text-xs text-zinc-500 dark:text-zinc-400">
        {t.coverLetterHint}
      </p>

      <SectionCard title={t.coverLetterDetails} defaultOpen>
        <div className="grid gap-3 sm:grid-cols-2">
          <Input
            label={t.coverLetterDate}
            value={coverLetter.date}
            onChange={(e) => updateCoverLetter({ date: e.target.value })}
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
        <button
          type="button"
          onClick={handleGenerate}
          className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-[10px] font-bold text-indigo-700 transition hover:bg-indigo-100 dark:border-indigo-900 dark:bg-indigo-950 dark:text-indigo-300"
        >
          <Sparkles className="h-3.5 w-3.5" />
          {t.generateFromCv}
        </button>
        <Textarea
          rows={14}
          value={coverLetter.body}
          onChange={(e) => updateCoverLetter({ body: e.target.value })}
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