"use client";

import {
  BODY_JUSTIFY_CLASS,
  getCoverLetterLabels,
  getSenderContactLines,
  getSenderName,
  splitLetterParagraphs,
} from "@/lib/cover-letter-layout";
import type { CoverLetterData, Language, PersonalInfo } from "@/lib/types";

interface Props {
  personal: PersonalInfo;
  coverLetter: CoverLetterData;
  language: Language;
}

function SenderBlock({
  personal,
  language,
}: {
  personal: PersonalInfo;
  language: Language;
}) {
  const name = getSenderName(personal, language);
  const contact = getSenderContactLines(personal);

  return (
    <div className="mb-6 border-b border-zinc-100 pb-4">
      <p className="text-[12px] font-bold text-zinc-900">{name}</p>
      {personal.title && (
        <p className="mt-0.5 text-[10px] text-zinc-600">{personal.title}</p>
      )}
      {contact.length > 0 && (
        <div className="mt-2 space-y-0.5 text-[10px] leading-relaxed text-zinc-500">
          {contact.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
      )}
    </div>
  );
}

export function CoverLetterPreview({
  personal,
  coverLetter,
  language,
}: Props) {
  const labels = getCoverLetterLabels(language);
  const name = getSenderName(personal, language);
  const paragraphs = splitLetterParagraphs(coverLetter.body);
  const dateLine = labels.dateLine(personal.location, coverLetter.date);

  return (
    <div
      className="mx-auto w-full max-w-[210mm] bg-white p-10 text-zinc-900 shadow-2xl"
      style={{ minHeight: "297mm", fontSize: "11px", lineHeight: 1.55 }}
    >
      <p className="mb-6 text-right text-[10px] text-zinc-500">{dateLine}</p>

      <SenderBlock personal={personal} language={language} />

      <div className="mb-5 text-[10px] leading-relaxed text-zinc-700">
        <p className="font-semibold text-zinc-800">{labels.kepadaYth}</p>
        {coverLetter.recipient && (
          <p className="mt-1">{coverLetter.recipient}</p>
        )}
        {coverLetter.company && <p>{coverLetter.company}</p>}
        {labels.diTempat && (
          <p className="mt-1 text-zinc-500">{labels.diTempat}</p>
        )}
      </div>

      <p className="mb-5 text-[10px] font-bold tracking-wide">
        {labels.subject(coverLetter.position)}
      </p>

      <p className={`mb-4 ${BODY_JUSTIFY_CLASS}`}>{labels.denganHormat}</p>

      {paragraphs.length > 0 ? (
        paragraphs.map((p, i) => (
          <p
            key={i}
            className={`mb-3 text-[11px] text-zinc-700 ${BODY_JUSTIFY_CLASS}`}
          >
            {p}
          </p>
        ))
      ) : (
        <p className={`mb-3 text-zinc-400 italic ${BODY_JUSTIFY_CLASS}`}>
          {labels.bodyPlaceholder}
        </p>
      )}

      <p className={`mt-4 text-[11px] text-zinc-700 ${BODY_JUSTIFY_CLASS}`}>
        {labels.formalClosing}
      </p>

      <div className="mt-8">
        <p className={BODY_JUSTIFY_CLASS}>{labels.closing}</p>
        <div className="mt-12">
          <p className="text-[12px] font-bold text-zinc-900">{name}</p>
          {personal.title && (
            <p className="mt-0.5 text-[10px] text-zinc-500">{personal.title}</p>
          )}
        </div>
      </div>
    </div>
  );
}