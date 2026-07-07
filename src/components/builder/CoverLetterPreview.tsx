"use client";

import {
  BODY_JUSTIFY_CLASS,
  getCoverLetterLabels,
  getSenderContactLines,
  getSenderName,
  splitLetterParagraphs,
} from "@/lib/cover-letter-layout";
import { getPreviewTypography } from "@/lib/typography";
import type { CoverLetterData, Language, PersonalInfo, ResumeConfig } from "@/lib/types";

interface Props {
  personal: PersonalInfo;
  coverLetter: CoverLetterData;
  language: Language;
  config: ResumeConfig;
}

function SenderBlock({
  personal,
  language,
  ty,
}: {
  personal: PersonalInfo;
  language: Language;
  ty: ReturnType<typeof getPreviewTypography>;
}) {
  const name = getSenderName(personal, language);
  const contact = getSenderContactLines(personal);

  return (
    <div className="mb-6 border-b border-zinc-100 pb-4">
      <p
        className="text-zinc-900"
        style={{ fontSize: ty.sizes.md, fontWeight: ty.headingWeight }}
      >
        {name}
      </p>
      {personal.title && (
        <p className="mt-0.5 text-zinc-600" style={{ fontSize: ty.sizes.sm }}>
          {personal.title}
        </p>
      )}
      {contact.length > 0 && (
        <div
          className="mt-2 space-y-0.5 leading-relaxed text-zinc-500"
          style={{ fontSize: ty.sizes.sm }}
        >
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
  config,
}: Props) {
  const labels = getCoverLetterLabels(language, config.cvProfile);
  const name = getSenderName(personal, language);
  const paragraphs = splitLetterParagraphs(coverLetter.body);
  const dateLine = labels.dateLine(personal.location, coverLetter.date);
  const ty = getPreviewTypography(config);

  return (
    <div
      className="mx-auto w-full max-w-[210mm] bg-white p-10 text-zinc-900 shadow-2xl"
      style={{
        minHeight: "297mm",
        fontFamily: ty.fontFamily,
        fontSize: ty.sizes.base,
        lineHeight: ty.lineHeight,
        fontWeight: ty.fontWeight,
      }}
    >
      <p
        className="mb-6 text-right text-zinc-500"
        style={{ fontSize: ty.sizes.sm }}
      >
        {dateLine}
      </p>

      <SenderBlock personal={personal} language={language} ty={ty} />

      <div
        className="mb-5 leading-relaxed text-zinc-700"
        style={{ fontSize: ty.sizes.sm }}
      >
        <p
          className="text-zinc-800"
          style={{ fontWeight: ty.headingWeight }}
        >
          {labels.kepadaYth}
        </p>
        {coverLetter.recipient && (
          <p className="mt-1">{coverLetter.recipient}</p>
        )}
        {coverLetter.company && <p>{coverLetter.company}</p>}
        {labels.diTempat && (
          <p className="mt-1 text-zinc-500">{labels.diTempat}</p>
        )}
      </div>

      <p
        className="mb-5 tracking-wide"
        style={{ fontSize: ty.sizes.sm, fontWeight: ty.headingWeight }}
      >
        {labels.subject(coverLetter.position)}
      </p>

      <p className={`mb-4 ${BODY_JUSTIFY_CLASS}`}>{labels.denganHormat}</p>

      {paragraphs.length > 0 ? (
        paragraphs.map((p, i) => (
          <p
            key={i}
            className={`mb-3 text-zinc-700 ${BODY_JUSTIFY_CLASS}`}
            style={{ fontSize: ty.sizes.base }}
          >
            {p}
          </p>
        ))
      ) : (
        <p className={`mb-3 text-zinc-400 italic ${BODY_JUSTIFY_CLASS}`}>
          {labels.bodyPlaceholder}
        </p>
      )}

      <p
        className={`mt-4 text-zinc-700 ${BODY_JUSTIFY_CLASS}`}
        style={{ fontSize: ty.sizes.base }}
      >
        {labels.formalClosing}
      </p>

      <div className="mt-8">
        <p className={BODY_JUSTIFY_CLASS}>{labels.closing}</p>
        <div className="mt-12">
          <p
            className="text-zinc-900"
            style={{ fontSize: ty.sizes.md, fontWeight: ty.headingWeight }}
          >
            {name}
          </p>
          {personal.title && (
            <p className="mt-0.5 text-zinc-500" style={{ fontSize: ty.sizes.sm }}>
              {personal.title}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}