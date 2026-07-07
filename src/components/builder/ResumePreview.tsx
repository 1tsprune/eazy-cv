"use client";

import { PreviewPhoto } from "@/components/builder/PreviewPhoto";
import { themeColors } from "@/lib/colors";
import { PROSE_JUSTIFY } from "@/lib/document-layout";
import { t } from "@/lib/i18n";
import { shouldShowPhoto } from "@/lib/photo-display";
import type { ResumeConfig, ResumeData, SectionKey } from "@/lib/types";

interface Props {
  data: ResumeData;
  config: ResumeConfig;
}

function ContactLines({
  items,
  className = "",
}: {
  items: string[];
  className?: string;
}) {
  if (!items.length) return null;
  return (
    <div className={`space-y-0.5 ${className}`}>
      {items.map((item) => (
        <p key={item}>{item}</p>
      ))}
    </div>
  );
}

export function ResumePreview({ data, config }: Props) {
  const colors = themeColors[config.colorTheme];
  const lang = config.language;
  const isAts = config.exportMode === "ats";
  const showPhoto = shouldShowPhoto(config, data);
  const photo = data.personal.photo;

  const contact = [
    data.personal.email,
    data.personal.phone,
    data.personal.location,
    data.personal.linkedin,
  ].filter(Boolean);

  return (
    <div
      className={`mx-auto w-full max-w-[210mm] origin-top bg-white text-zinc-900 shadow-2xl ${
        isAts ? "font-sans" : ""
      }`}
      style={{ minHeight: "297mm", fontSize: "11px", lineHeight: 1.5 }}
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
            <h1 className="text-2xl font-bold">
              {data.personal.fullName || "Nama Kamu"}
            </h1>
            {data.personal.title && (
              <p className="mt-1 text-sm opacity-90">{data.personal.title}</p>
            )}
            <ContactLines
              items={contact}
              className="mt-3 text-[10px] opacity-75"
            />
          </header>
          <div className="p-8">
            <PreviewSections data={data} config={config} colors={colors} />
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
            <h1 className="text-3xl font-bold">
              {data.personal.fullName || "Nama Kamu"}
            </h1>
            {data.personal.title && (
              <p className="mt-1 text-sm opacity-90">{data.personal.title}</p>
            )}
            <ContactLines
              items={contact}
              className="mt-3 text-[10px] opacity-75"
            />
            </div>
          </header>
          <div className="p-8">
            <PreviewSections data={data} config={config} colors={colors} />
          </div>
        </div>
      ) : config.template === "compact" && !isAts ? (
        <div className="p-6" style={{ fontSize: "10px", lineHeight: 1.35 }}>
          <div className="flex items-center gap-3">
            {showPhoto && (
              <PreviewPhoto src={photo} size={48} rounded="lg" className="shrink-0" />
            )}
            <div>
          <h1
            className="text-lg font-bold"
            style={{ color: colors.primary }}
          >
            {data.personal.fullName || "Nama Kamu"}
          </h1>
          {data.personal.title && (
            <p className="text-[10px] text-zinc-500">{data.personal.title}</p>
          )}
            </div>
          </div>
          <ContactLines
            items={contact}
            className="mt-1 border-b border-zinc-200 pb-2 text-[9px] text-zinc-400"
          />
          <PreviewSections data={data} config={config} colors={colors} />
        </div>
      ) : config.template === "academic" && !isAts ? (
        <div className="p-10">
          <header className="border-b border-zinc-800 pb-4 text-center">
            {showPhoto && (
              <div className="mb-3 flex justify-center">
                <PreviewPhoto src={photo} size={72} rounded="lg" />
              </div>
            )}
            <h1 className="text-xl font-bold">
              {data.personal.fullName || "Nama Kamu"}
            </h1>
            {data.personal.title && (
              <p className="mt-1 text-xs text-zinc-600">
                {data.personal.title}
              </p>
            )}
            <ContactLines
              items={contact}
              className="mt-2 text-[10px] text-zinc-400"
            />
          </header>
          <PreviewSections data={data} config={config} colors={colors} />
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
            <h1 className="text-xl font-bold leading-tight">
              {data.personal.fullName || "Nama Kamu"}
            </h1>
            {data.personal.title && (
              <p className="mt-1 text-xs opacity-90">{data.personal.title}</p>
            )}
            <div className="mt-6 space-y-1 text-[10px] opacity-90">
              {contact.map((c) => (
                <p key={c}>{c}</p>
              ))}
            </div>
            {data.technicalSkills.length > 0 && (
              <div className="mt-6">
                <p className="text-[9px] font-bold uppercase tracking-wider opacity-70">
                  {t(lang, "technicalSkills")}
                </p>
                <ul className="mt-2 space-y-1 text-[10px]">
                  {data.technicalSkills.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
          <main className="flex-1 p-7">
            <PreviewSections data={data} config={config} colors={colors} />
          </main>
        </div>
      ) : (
        <div className="p-8">
          <header
            className="mb-6 pb-4"
            style={{
              borderBottom: isAts
                ? "1px solid #ccc"
                : `2px solid ${colors.primary}`,
            }}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <h1
                  className="text-2xl font-bold"
                  style={{ color: isAts ? "#111" : colors.primary }}
                >
                  {data.personal.fullName || "Nama Kamu"}
                </h1>
                {data.personal.title && (
                  <p className="mt-1 text-sm text-zinc-500">
                    {data.personal.title}
                  </p>
                )}
                <ContactLines
                  items={contact}
                  className="mt-2 text-[10px] text-zinc-400"
                />
              </div>
              {showPhoto && (
                <PreviewPhoto src={photo} size={76} className="shrink-0" />
              )}
            </div>
          </header>
          <PreviewSections data={data} config={config} colors={colors} />
        </div>
      )}
    </div>
  );
}

function PreviewSections({
  data,
  config,
  colors,
}: {
  data: ResumeData;
  config: ResumeConfig;
  colors: { primary: string; light: string };
}) {
  const lang = config.language;
  const isAts = config.exportMode === "ats";
  const order = config.sectionOrder;

  const SectionTitle = ({ children }: { children: React.ReactNode }) => (
    <h2
      className="mb-2 mt-4 text-[10px] font-bold uppercase tracking-widest"
      style={{
        color: isAts ? "#333" : colors.primary,
        borderBottom: isAts ? "1px solid #ddd" : undefined,
        paddingBottom: isAts ? 4 : undefined,
      }}
    >
      {children}
    </h2>
  );

  const sectionBlocks: Record<SectionKey, React.ReactNode> = {
    experience:
      data.experiences.length > 0 ? (
        <>
          <SectionTitle>{t(lang, "experience")}</SectionTitle>
          {data.experiences.map((exp) => (
            <div key={exp.id} className="mb-3">
              <p className="text-[11px] font-semibold">
                {exp.position}
                {exp.company && ` — ${exp.company}`}
              </p>
              <p className="text-[9px] text-zinc-400">
                {[
                  exp.startDate,
                  exp.endDate || (exp.current ? t(lang, "present") : ""),
                  exp.location,
                ]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
              {exp.description && (
                <p className={`mt-1 text-[10px] text-zinc-600 ${PROSE_JUSTIFY}`}>
                  {exp.description}
                </p>
              )}
              {exp.highlights.map((h, i) => (
                <p key={i} className="ml-3 text-[10px] text-zinc-600">
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
          <SectionTitle>{t(lang, "education")}</SectionTitle>
          {data.educations.map((edu) => (
            <div key={edu.id} className="mb-2">
              <p className="text-[11px] font-semibold">
                {edu.degree}
                {edu.field && ` — ${edu.field}`}
              </p>
              <p className="text-[9px] text-zinc-400">
                {[
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
          <SectionTitle>{t(lang, "organizations")}</SectionTitle>
          {data.organizations.map((org) => (
            <div key={org.id} className="mb-3">
              <p className="text-[11px] font-semibold">
                {org.role}
                {org.name && ` — ${org.name}`}
              </p>
              <p className="text-[9px] text-zinc-400">
                {[
                  org.startDate,
                  org.endDate || (org.current ? t(lang, "present") : ""),
                  org.location,
                ]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
              {org.highlights.map((h, i) => (
                <p key={i} className="ml-3 text-[10px] text-zinc-600">
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
        <>
          {data.technicalSkills.length > 0 && (
            <>
              <SectionTitle>{t(lang, "technicalSkills")}</SectionTitle>
              <div className="mb-2 flex flex-wrap gap-1.5">
                {data.technicalSkills.map((s) => (
                  <span
                    key={s}
                    className="rounded px-2 py-0.5 text-[9px] font-medium"
                    style={{
                      backgroundColor: isAts ? "#f4f4f5" : colors.light,
                      color: isAts ? "#333" : colors.primary,
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
                    className="rounded px-2 py-0.5 text-[9px] font-medium"
                    style={{
                      backgroundColor: isAts ? "#f4f4f5" : colors.light,
                      color: isAts ? "#333" : colors.primary,
                    }}
                  >
                    {s}
                  </span>
                ))}
              </div>
            </>
          )}
        </>
      ) : null,

    projects:
      !isAts && data.projects.length > 0 ? (
        <>
          <SectionTitle>{t(lang, "projects")}</SectionTitle>
          {data.projects.map((p) => (
            <div key={p.id} className="mb-2">
              <p className="text-[11px] font-semibold">{p.name}</p>
              <p className={`text-[10px] text-zinc-500 ${PROSE_JUSTIFY}`}>
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
              <p className="text-[11px] font-semibold">{cert.name}</p>
              <p className="text-[9px] text-zinc-400">
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
              <span key={l.id} className="text-[10px] text-zinc-600">
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
                <p key={i} className="ml-3 text-[10px] text-zinc-600">
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
          <SectionTitle>{t(lang, "summary")}</SectionTitle>
          <p className={`text-[10px] text-zinc-600 ${PROSE_JUSTIFY}`}>
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