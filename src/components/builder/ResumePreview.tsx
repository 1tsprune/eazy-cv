"use client";

import { PreviewPhoto } from "@/components/builder/PreviewPhoto";
import { themeColors } from "@/lib/colors";
import { PROSE_JUSTIFY } from "@/lib/document-layout";
import { t, tAts } from "@/lib/i18n";
import { formatAtsPeriodLine } from "@/lib/pdf-ats-layout";
import { getPreviewTypography } from "@/lib/typography";
import { shouldShowPhoto } from "@/lib/photo-display";
import type { ResumeConfig, ResumeData, SectionKey } from "@/lib/types";

interface Props {
  data: ResumeData;
  config: ResumeConfig;
}

function ContactRow({
  items,
  className = "",
  style,
}: {
  items: string[];
  className?: string;
  style?: React.CSSProperties;
}) {
  if (!items.length) return null;
  return (
    <p className={className} style={style}>
      {items.join(" · ")}
    </p>
  );
}

export function ResumePreview({ data, config }: Props) {
  const colors = themeColors[config.colorTheme];
  const lang = config.language;
  const isAts = config.exportMode === "ats";
  const showPhoto = shouldShowPhoto(config, data);
  const photo = data.personal.photo;

  const contact = isAts
    ? [
        data.personal.phone,
        data.personal.email,
        data.personal.website,
        data.personal.linkedin,
        data.personal.github,
        data.personal.location,
      ].filter(Boolean)
    : [
        data.personal.email,
        data.personal.phone,
        data.personal.location,
        data.personal.linkedin,
      ].filter(Boolean);

  const ty = getPreviewTypography(config);
  const docStyle = {
    minHeight: "297mm",
    fontFamily: ty.fontFamily,
    fontSize: ty.sizes.base,
    lineHeight: ty.lineHeight,
    fontWeight: ty.fontWeight,
  } as const;

  return (
    <div
      className="mx-auto w-full max-w-[210mm] origin-top bg-white text-zinc-900 shadow-2xl"
      style={docStyle}
    >
      {config.template === "executive" && !isAts ? (
        <div>
          <header
            className="p-8 text-center text-white"
            style={{ backgroundColor: colors.primary }}
          >
            {showPhoto && (
              <div className="mb-4 flex justify-center">
                <PreviewPhoto
                  src={photo}
                  size={80}
                  className="border-2 border-white/30"
                />
              </div>
            )}
            <h1 style={{ fontSize: ty.sizes.xl, fontWeight: ty.headingWeight }}>
              {data.personal.fullName || "Nama Kamu"}
            </h1>
            {data.personal.title && (
              <p className="mt-1 opacity-90" style={{ fontSize: ty.sizes.sm }}>
                {data.personal.title}
              </p>
            )}
            <ContactRow
              items={contact}
              className="mt-3 opacity-75"
              style={{ fontSize: ty.sizes.xs }}
            />
          </header>
          <div className="p-8">
            <PreviewSections data={data} config={config} colors={colors} ty={ty} />
          </div>
        </div>
      ) : config.template === "creative" && !isAts ? (
        <div>
          <header
            className="flex items-center gap-6 p-8 text-white"
            style={{ backgroundColor: colors.primary }}
          >
            {showPhoto && (
              <PreviewPhoto
                src={photo}
                size={88}
                className="shrink-0 border-2 border-white/30"
              />
            )}
            <div>
            <h1 style={{ fontSize: ty.sizes.display, fontWeight: ty.headingWeight }}>
              {data.personal.fullName || "Nama Kamu"}
            </h1>
            {data.personal.title && (
              <p className="mt-1 opacity-90" style={{ fontSize: ty.sizes.sm }}>
                {data.personal.title}
              </p>
            )}
            <ContactRow
              items={contact}
              className="mt-3 opacity-75"
              style={{ fontSize: ty.sizes.xs }}
            />
            </div>
          </header>
          <div className="p-8">
            <PreviewSections data={data} config={config} colors={colors} ty={ty} />
          </div>
        </div>
      ) : config.template === "compact" && !isAts ? (
        <div className="p-6" style={{ fontSize: ty.sizes.sm, lineHeight: ty.lineHeight }}>
          <div className="flex items-center gap-3">
            {showPhoto && (
              <PreviewPhoto src={photo} size={48} rounded="lg" className="shrink-0" />
            )}
            <div>
          <h1
            style={{
              color: colors.primary,
              fontSize: ty.sizes.lg,
              fontWeight: ty.headingWeight,
            }}
          >
            {data.personal.fullName || "Nama Kamu"}
          </h1>
          {data.personal.title && (
            <p className="text-zinc-500" style={{ fontSize: ty.sizes.xs }}>
              {data.personal.title}
            </p>
          )}
            </div>
          </div>
          <ContactRow
            items={contact}
            className="mt-1 border-b border-zinc-200 pb-2 text-zinc-400"
            style={{ fontSize: ty.sizes.xs }}
          />
          <PreviewSections data={data} config={config} colors={colors} ty={ty} />
        </div>
      ) : config.template === "academic" && !isAts ? (
        <div className="p-10">
          <header className="border-b border-zinc-800 pb-4 text-center">
            {showPhoto && (
              <div className="mb-3 flex justify-center">
                <PreviewPhoto src={photo} size={72} rounded="lg" />
              </div>
            )}
            <h1 style={{ fontSize: ty.sizes.xl, fontWeight: ty.headingWeight }}>
              {data.personal.fullName || "Nama Kamu"}
            </h1>
            {data.personal.title && (
              <p className="mt-1 text-zinc-600" style={{ fontSize: ty.sizes.sm }}>
                {data.personal.title}
              </p>
            )}
            <ContactRow
              items={contact}
              className="mt-2 text-zinc-400"
              style={{ fontSize: ty.sizes.xs }}
            />
          </header>
          <PreviewSections data={data} config={config} colors={colors} ty={ty} />
        </div>
      ) : config.template === "professional" && !isAts ? (
        <div className="flex min-h-[297mm]">
          <aside
            className="w-[32%] p-6 text-white"
            style={{ backgroundColor: colors.primary }}
          >
            {showPhoto && (
              <div className="mb-4 flex justify-center">
                <PreviewPhoto
                  src={photo}
                  size={88}
                  className="border-2 border-white/25"
                />
              </div>
            )}
            <h1
              className="leading-tight"
              style={{ fontSize: ty.sizes.lg, fontWeight: ty.headingWeight }}
            >
              {data.personal.fullName || "Nama Kamu"}
            </h1>
            {data.personal.title && (
              <p className="mt-1 opacity-90" style={{ fontSize: ty.sizes.sm }}>
                {data.personal.title}
              </p>
            )}
            <ContactRow
              items={contact}
              className="mt-6 opacity-90"
              style={{ fontSize: ty.sizes.xs }}
            />
            {data.technicalSkills.length > 0 && (
              <div className="mt-6">
                <p
                  className="uppercase tracking-wider opacity-70"
                  style={{ fontSize: ty.sizes.xs, fontWeight: ty.headingWeight }}
                >
                  {t(lang, "technicalSkills")}
                </p>
                <ul className="mt-2 space-y-1" style={{ fontSize: ty.sizes.sm }}>
                  {data.technicalSkills.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
          <main className="flex-1 p-7">
            <PreviewSections data={data} config={config} colors={colors} ty={ty} />
          </main>
        </div>
      ) : (
        <div className={isAts ? "px-14 py-10" : "p-8"}>
          <header
            className={isAts ? "mb-2" : "mb-6 pb-4"}
            style={
              isAts
                ? undefined
                : { borderBottom: `2px solid ${colors.primary}` }
            }
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <h1
                  style={{
                    color: isAts ? "#111" : colors.primary,
                    fontSize: isAts ? ty.sizes.xl : ty.sizes.xl,
                    fontWeight: ty.headingWeight,
                    letterSpacing: isAts ? "-0.02em" : undefined,
                  }}
                >
                  {data.personal.fullName || "Nama Kamu"}
                </h1>
                {data.personal.title && (
                  <p
                    className={isAts ? "mt-0.5 text-zinc-600" : "mt-1 text-zinc-500"}
                    style={{ fontSize: isAts ? ty.sizes.md : ty.sizes.sm }}
                  >
                    {data.personal.title}
                  </p>
                )}
                <ContactRow
                  items={contact}
                  className={isAts ? "mt-1.5 text-zinc-500" : "mt-2 text-zinc-400"}
                  style={{ fontSize: ty.sizes.xs }}
                />
              </div>
              {showPhoto && (
                <PreviewPhoto src={photo} size={76} className="shrink-0" />
              )}
            </div>
          </header>
          <PreviewSections data={data} config={config} colors={colors} ty={ty} />
        </div>
      )}
    </div>
  );
}

function PreviewSections({
  data,
  config,
  colors,
  ty,
}: {
  data: ResumeData;
  config: ResumeConfig;
  colors: { primary: string; light: string };
  ty: ReturnType<typeof getPreviewTypography>;
}) {
  const lang = config.language;
  const isAts = config.exportMode === "ats";
  const order = config.sectionOrder;
  const sep = isAts ? " · " : " — ";
  const sectionLabel = (key: Parameters<typeof t>[1]) =>
    isAts ? tAts(lang, key) : t(lang, key);

  const SectionTitle = ({ children }: { children: React.ReactNode }) => (
    <h2
      className={
        isAts
          ? "mb-1.5 mt-3 uppercase tracking-[0.14em]"
          : "mb-2 mt-4 uppercase tracking-widest"
      }
      style={{
        fontSize: ty.sizes.sm,
        fontWeight: ty.headingWeight,
        color: isAts ? "#111" : colors.primary,
        borderBottom: isAts ? "1px solid #ccc" : undefined,
        paddingBottom: isAts ? 2 : undefined,
      }}
    >
      {children}
    </h2>
  );

  const sectionBlocks: Record<SectionKey, React.ReactNode> = {
    experience:
      data.experiences.length > 0 ? (
        <>
          <SectionTitle>{sectionLabel("experience")}</SectionTitle>
          {data.experiences.map((exp) => (
            <div key={exp.id} className="mb-3">
              <p
                className="font-semibold"
                style={{ fontSize: ty.sizes.md, fontWeight: ty.headingWeight }}
              >
                {exp.position}
                {exp.company && `${sep}${exp.company}`}
              </p>
              <p className="text-zinc-400" style={{ fontSize: ty.sizes.xs }}>
                {isAts
                  ? formatAtsPeriodLine(
                      exp.startDate,
                      exp.endDate,
                      exp.current,
                      exp.location,
                      lang,
                    )
                  : [
                      exp.startDate,
                      exp.endDate || (exp.current ? t(lang, "present") : ""),
                      exp.location,
                    ]
                      .filter(Boolean)
                      .join(" · ")}
              </p>
              {exp.description && (
                <p
                  className={`mt-1 text-zinc-600 ${PROSE_JUSTIFY}`}
                  style={{ fontSize: ty.sizes.sm }}
                >
                  {exp.description}
                </p>
              )}
              {exp.highlights.map((h, i) => (
                <p
                  key={i}
                  className="ml-3 text-zinc-600"
                  style={{ fontSize: ty.sizes.sm }}
                >
                  • {h}
                </p>
              ))}
            </div>
          ))}
        </>
      ) : null,

    education:
      data.educations.length > 0 ? (
        <>
          <SectionTitle>{sectionLabel("education")}</SectionTitle>
          {data.educations.map((edu) => (
            <div key={edu.id} className="mb-2">
              <p style={{ fontSize: ty.sizes.md, fontWeight: ty.headingWeight }}>
                {isAts
                  ? [edu.degree, edu.institution].filter(Boolean).join(" · ")
                  : `${edu.degree}${edu.field ? ` — ${edu.field}` : ""}`}
              </p>
              <p className="text-zinc-400" style={{ fontSize: ty.sizes.xs }}>
                {isAts
                  ? [
                      edu.startDate && edu.endDate
                        ? `${edu.startDate} — ${edu.endDate}`
                        : edu.startDate || edu.endDate,
                      edu.gpa ? `${t(lang, "gpa")}: ${edu.gpa}` : "",
                    ]
                      .filter(Boolean)
                      .join(" · ")
                  : [
                      edu.institution,
                      edu.location,
                      edu.startDate && edu.endDate
                        ? `${edu.startDate} – ${edu.endDate}`
                        : edu.startDate || edu.endDate,
                      edu.gpa ? `${t(lang, "gpa")}: ${edu.gpa}` : "",
                    ]
                      .filter(Boolean)
                      .join(" · ")}
              </p>
            </div>
          ))}
        </>
      ) : null,

    organizations:
      data.organizations.length > 0 ? (
        <>
          <SectionTitle>{sectionLabel("organizations")}</SectionTitle>
          {data.organizations.map((org) => (
            <div key={org.id} className="mb-3">
              <p style={{ fontSize: ty.sizes.md, fontWeight: ty.headingWeight }}>
                {org.role}
                {org.name && `${sep}${org.name}`}
              </p>
              <p className="text-zinc-400" style={{ fontSize: ty.sizes.xs }}>
                {isAts
                  ? formatAtsPeriodLine(
                      org.startDate,
                      org.endDate,
                      org.current,
                      org.location,
                      lang,
                    )
                  : [
                      org.startDate,
                      org.endDate || (org.current ? t(lang, "present") : ""),
                      org.location,
                    ]
                      .filter(Boolean)
                      .join(" · ")}
              </p>
              {org.highlights.map((h, i) => (
                <p
                  key={i}
                  className="ml-3 text-zinc-600"
                  style={{ fontSize: ty.sizes.sm }}
                >
                  • {h}
                </p>
              ))}
            </div>
          ))}
        </>
      ) : null,

    skills:
      (data.technicalSkills.length > 0 || data.softSkills.length > 0) &&
      config.template !== "professional" ? (
        isAts ? (
          <>
            <SectionTitle>{sectionLabel("technicalSkills")}</SectionTitle>
            {data.technicalSkills.length > 0 && (
              <p className="mb-2 text-zinc-600" style={{ fontSize: ty.sizes.sm }}>
                {data.technicalSkills.join(" · ")}
              </p>
            )}
            {data.softSkills.length > 0 && (
              <>
                <p
                  className="font-semibold text-zinc-700"
                  style={{ fontSize: ty.sizes.sm, fontWeight: ty.headingWeight }}
                >
                  {t(lang, "softSkills")}
                </p>
                <p className="text-zinc-600" style={{ fontSize: ty.sizes.sm }}>
                  {data.softSkills.join(" · ")}
                </p>
              </>
            )}
          </>
        ) : (
          <>
            {data.technicalSkills.length > 0 && (
              <>
                <SectionTitle>{t(lang, "technicalSkills")}</SectionTitle>
                <div className="mb-2 flex flex-wrap gap-1.5">
                  {data.technicalSkills.map((s) => (
                    <span
                      key={s}
                      className="rounded px-2 py-0.5 font-medium"
                      style={{
                        fontSize: ty.sizes.xs,
                        backgroundColor: colors.light,
                        color: colors.primary,
                      }}
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </>
            )}
            {data.softSkills.length > 0 && (
              <>
                <SectionTitle>{t(lang, "softSkills")}</SectionTitle>
                <div className="flex flex-wrap gap-1.5">
                  {data.softSkills.map((s) => (
                    <span
                      key={s}
                      className="rounded px-2 py-0.5 font-medium"
                      style={{
                        fontSize: ty.sizes.xs,
                        backgroundColor: colors.light,
                        color: colors.primary,
                      }}
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </>
            )}
          </>
        )
      ) : null,

    projects:
      !isAts && data.projects.length > 0 ? (
        <>
          <SectionTitle>{t(lang, "projects")}</SectionTitle>
          {data.projects.map((p) => (
            <div key={p.id} className="mb-2">
              <p style={{ fontSize: ty.sizes.md, fontWeight: ty.headingWeight }}>
                {p.name}
              </p>
              <p
                className={`text-zinc-500 ${PROSE_JUSTIFY}`}
                style={{ fontSize: ty.sizes.sm }}
              >
                {p.description}
              </p>
            </div>
          ))}
        </>
      ) : null,

    certifications:
      data.certifications.length > 0 ? (
        <>
          <SectionTitle>{t(lang, "certifications")}</SectionTitle>
          {data.certifications.map((cert) => (
            <div key={cert.id} className="mb-2">
              <p style={{ fontSize: ty.sizes.md, fontWeight: ty.headingWeight }}>
                {cert.name}
              </p>
              <p className="text-zinc-400" style={{ fontSize: ty.sizes.xs }}>
                {[cert.issuer, cert.date].filter(Boolean).join(" · ")}
              </p>
            </div>
          ))}
        </>
      ) : null,

    languages:
      data.languages.length > 0 ? (
        <>
          <SectionTitle>{t(lang, "languages")}</SectionTitle>
          <div className="flex flex-wrap gap-2">
            {data.languages.map((l) => (
              <span
                key={l.id}
                className="text-zinc-600"
                style={{ fontSize: ty.sizes.sm }}
              >
                {l.name}
                {l.level && ` (${l.level})`}
              </span>
            ))}
          </div>
        </>
      ) : null,

    custom: data.customSections.some((s) =>
      s.title && (isAts ? s.showInAts : true),
    ) ? (
      <>
        {data.customSections
          .filter((s) => s.title && (isAts ? s.showInAts : true))
          .map((section) => (
            <div key={section.id}>
              <SectionTitle>{section.title}</SectionTitle>
              {section.items.map((item, i) => (
                <p
                  key={i}
                  className="ml-3 text-zinc-600"
                  style={{ fontSize: ty.sizes.sm }}
                >
                  • {item}
                </p>
              ))}
            </div>
          ))}
      </>
    ) : null,
  };

  return (
    <>
      {data.personal.summary && (
        <>
          {!isAts && <SectionTitle>{t(lang, "summary")}</SectionTitle>}
          <p
            className={`text-zinc-600 ${PROSE_JUSTIFY}`}
            style={{ fontSize: ty.sizes.sm, marginBottom: isAts ? 10 : undefined }}
          >
            {data.personal.summary}
          </p>
        </>
      )}

      {order.map((key) => (
        <div key={key}>{sectionBlocks[key]}</div>
      ))}
    </>
  );
}