"use client";

import { PreviewPhoto } from "@/components/builder/PreviewPhoto";
import { themeColors } from "@/lib/colors";
import { PROSE_JUSTIFY } from "@/lib/document-layout";
import { t, tAts } from "@/lib/i18n";
import { getLanguageLevelLabel } from "@/lib/language-levels";
import {
  ATS_BULLET_MARK,
  formatAtsEducationMeta,
  formatAtsPeriodLine,
  getAtsPreviewMetrics,
  splitAtsProseLines,
  type AtsPreviewMetrics,
} from "@/lib/pdf-ats-layout";
import {
  chunkSkillLines,
  hasSkillContent,
  normalizeSkillGroups,
} from "@/lib/skill-groups";
import { getPreviewTypography } from "@/lib/typography";
import { shouldShowPhoto } from "@/lib/photo-display";
import type { ResumeConfig, ResumeData, SectionKey } from "@/lib/types";
import { PreviewContactInline } from "./PreviewContactInline";
import { PreviewPaper } from "./PreviewPaper";

interface Props {
  data: ResumeData;
  config: ResumeConfig;
  wysiwygHint?: string;
}

function ContactRow({
  items,
  className = "",
  style,
  linkColor,
}: {
  items: string[];
  className?: string;
  style?: React.CSSProperties;
  linkColor?: string;
}) {
  if (!items.length) return null;
  return (
    <PreviewContactInline
      items={items}
      className={className}
      style={style}
      linkColor={linkColor}
    />
  );
}

export function ResumePreview({ data, config, wysiwygHint }: Props) {
  const colors = themeColors[config.colorTheme];
  const lang = config.language;
  const isAts = config.exportMode === "ats";
  const ats = isAts ? getAtsPreviewMetrics(config) : null;
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
    fontFamily: ats?.fontFamily ?? ty.fontFamily,
    fontSize: ats?.page.fontSize ?? ty.sizes.base,
    lineHeight: ats?.page.lineHeight ?? ty.lineHeight,
    fontWeight: ty.fontWeight,
    color: ats?.page.color,
  } as const;

  const pageBody = (
    <>
      {config.template === "executive" && !isAts ? (
        <div>
          <header
            className="p-6 text-center text-white"
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
          <div className="p-6">
            <PreviewSections data={data} config={config} colors={colors} ty={ty} ats={ats} />
          </div>
        </div>
      ) : config.template === "creative" && !isAts ? (
        <div>
          <header
            className="flex items-center gap-6 p-6 text-white"
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
          <div className="p-6">
            <PreviewSections data={data} config={config} colors={colors} ty={ty} ats={ats} />
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
          <PreviewSections data={data} config={config} colors={colors} ty={ty} ats={ats} />
        </div>
      ) : config.template === "academic" && !isAts ? (
        <div className="p-8">
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
          <PreviewSections data={data} config={config} colors={colors} ty={ty} ats={ats} />
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
          <main className="flex-1 p-6">
            <PreviewSections data={data} config={config} colors={colors} ty={ty} ats={ats} />
          </main>
        </div>
      ) : (
        <div
          className={isAts ? undefined : "p-6"}
          style={
            isAts && ats
              ? {
                  paddingTop: ats.page.paddingTop,
                  paddingBottom: ats.page.paddingBottom,
                  paddingLeft: ats.page.paddingHorizontal,
                  paddingRight: ats.page.paddingHorizontal,
                }
              : undefined
          }
        >
          <header
            className={isAts ? undefined : "mb-6 pb-4"}
            style={
              isAts && ats
                ? {
                    marginBottom: ats.header.marginBottom,
                    paddingBottom: ats.header.paddingBottom,
                    borderBottom: `${ats.header.borderBottomWidth}px solid ${ats.header.borderBottomColor}`,
                  }
                : { borderBottom: `2px solid ${colors.primary}` }
            }
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <h1
                  style={
                    isAts && ats
                      ? {
                          color: ats.name.color,
                          fontSize: ats.name.fontSize,
                          fontWeight: ats.headingWeight,
                          marginBottom: ats.name.marginBottom,
                        }
                      : {
                          color: colors.primary,
                          fontSize: ty.sizes.xl,
                          fontWeight: ty.headingWeight,
                        }
                  }
                >
                  {data.personal.fullName || "Nama Kamu"}
                </h1>
                {data.personal.title && (
                  <p
                    style={
                      isAts && ats
                        ? {
                            fontSize: ats.headline.fontSize,
                            color: ats.headline.color,
                            marginBottom: ats.headline.marginBottom,
                          }
                        : {
                            marginTop: 4,
                            fontSize: ty.sizes.sm,
                            color: "#71717a",
                          }
                    }
                  >
                    {data.personal.title}
                  </p>
                )}
                <ContactRow
                  items={contact}
                  className={isAts ? undefined : "mt-2 text-zinc-400"}
                  style={
                    isAts && ats
                      ? {
                          marginTop: 4,
                          fontSize: ats.contact.fontSize,
                          color: ats.contact.color,
                          lineHeight: ats.contact.lineHeight,
                        }
                      : { fontSize: ty.sizes.xs }
                  }
                  linkColor={isAts && ats ? ats.contact.linkColor : undefined}
                />
              </div>
              {showPhoto && !isAts && (
                <PreviewPhoto src={photo} size={76} className="shrink-0" />
              )}
            </div>
          </header>
          <PreviewSections
            data={data}
            config={config}
            colors={colors}
            ty={ty}
            ats={ats}
          />
        </div>
      )}
    </>
  );

  return (
    <PreviewPaper showBadge={isAts} wysiwygHint={isAts ? wysiwygHint : undefined}>
      <div style={docStyle}>{pageBody}</div>
    </PreviewPaper>
  );
}

function PreviewSections({
  data,
  config,
  colors,
  ty,
  ats,
}: {
  data: ResumeData;
  config: ResumeConfig;
  colors: { primary: string; light: string };
  ty: ReturnType<typeof getPreviewTypography>;
  ats: AtsPreviewMetrics | null;
}) {
  const lang = config.language;
  const isAts = config.exportMode === "ats";
  const order = config.sectionOrder;
  const sep = isAts ? " · " : " — ";
  const sectionLabel = (key: Parameters<typeof t>[1]) =>
    isAts
      ? tAts(lang, key, config.cvProfile)
      : t(lang, key, config.cvProfile);

  const SectionTitle = ({ children }: { children: React.ReactNode }) => (
    <h2
      className={
        isAts
          ? "uppercase"
          : "mb-2 mt-4 uppercase tracking-widest"
      }
      style={
        isAts && ats
          ? {
              fontSize: ats.sectionTitle.fontSize,
              fontWeight: ats.headingWeight,
              color: ats.sectionTitle.color,
              letterSpacing: ats.sectionTitle.letterSpacing,
              marginTop: ats.sectionTitle.marginTop,
              marginBottom: ats.sectionTitle.marginBottom,
              paddingBottom: ats.sectionTitle.paddingBottom,
              borderBottom: `1px solid ${ats.sectionTitle.borderBottomColor}`,
            }
          : {
              fontSize: ty.sizes.sm,
              fontWeight: ty.headingWeight,
              color: colors.primary,
            }
      }
    >
      {children}
    </h2>
  );

  const bodyText = (extra?: React.CSSProperties) =>
    isAts && ats
      ? {
          fontSize: ats.paragraph.fontSize,
          lineHeight: ats.paragraph.lineHeight,
          color: ats.paragraph.color,
          marginBottom: ats.paragraph.marginBottom,
          ...extra,
        }
      : { fontSize: ty.sizes.sm, ...extra };

  const titleText = () =>
    isAts && ats
      ? {
          fontSize: ats.itemTitle.fontSize,
          fontWeight: ats.headingWeight,
          lineHeight: ats.itemTitle.lineHeight,
          color: ats.itemTitle.color,
          marginBottom: ats.itemTitle.marginBottom,
        }
      : { fontSize: ty.sizes.md, fontWeight: ty.headingWeight };

  const metaText = () => ({ fontSize: ty.sizes.xs, color: "#a1a1aa" });

  const entryGap = () =>
    isAts && ats ? { marginBottom: ats.entry.marginBottom } : { marginBottom: 12 };

  const AtsEntryHeader = ({
    primary,
    secondary,
    period,
  }: {
    primary: string;
    secondary?: string;
    period: string;
  }) => {
    if (!ats) return null;
    return (
      <div
        className="flex items-baseline justify-between gap-2"
        style={{ marginBottom: ats.expHeader.marginBottom }}
      >
        <p className="min-w-0 flex-1" style={{ marginBottom: 0 }}>
          <span style={{ ...titleText(), fontWeight: ats.headingWeight }}>
            {primary}
          </span>
          {secondary ? (
            <span style={ats.itemTitleSub}> · {secondary}</span>
          ) : null}
        </p>
        {period ? (
          <span
            className="shrink-0 text-right"
            style={{
              fontSize: ats.itemMetaRight.fontSize,
              color: ats.itemMetaRight.color,
              lineHeight: ats.itemMetaRight.lineHeight,
              maxWidth: "42%",
            }}
          >
            {period}
          </span>
        ) : null}
      </div>
    );
  };

  const AtsBullet = ({ text }: { text: string }) => {
    if (!ats) return <p style={bodyText()}>{text}</p>;
    return (
      <p
        className={PROSE_JUSTIFY}
        style={{
          ...bodyText(),
          paddingLeft: ats.bullet.paddingLeft,
          marginBottom: ats.bullet.marginBottom,
        }}
      >
        <span style={{ color: ats.bullet.markColor, fontSize: "0.65em" }}>
          {ATS_BULLET_MARK}{" "}
        </span>
        {text}
      </p>
    );
  };

  const sectionBlocks: Record<SectionKey, React.ReactNode> = {
    experience:
      data.experiences.length > 0 ? (
        <>
          <SectionTitle>{sectionLabel("experience")}</SectionTitle>
          {data.experiences.map((exp) => (
            <div key={exp.id} style={entryGap()}>
              {isAts ? (
                <AtsEntryHeader
                  primary={exp.position}
                  secondary={exp.company}
                  period={formatAtsPeriodLine(
                    exp.startDate,
                    exp.endDate,
                    exp.current,
                    exp.location,
                    lang,
                  )}
                />
              ) : (
                <>
                  <p className="font-semibold" style={titleText()}>
                    {exp.position}
                    {exp.company && `${sep}${exp.company}`}
                  </p>
                  <p style={metaText()}>
                    {[
                      exp.startDate,
                      exp.endDate || (exp.current ? t(lang, "present") : ""),
                      exp.location,
                    ]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                </>
              )}
              {exp.description && (
                <p
                  className={isAts ? PROSE_JUSTIFY : `mt-1 text-zinc-600 ${PROSE_JUSTIFY}`}
                  style={bodyText()}
                >
                  {exp.description}
                </p>
              )}
              {exp.highlights.map((h, i) =>
                isAts ? (
                  <AtsBullet key={i} text={h} />
                ) : (
                  <p
                    key={i}
                    className={`text-zinc-600 ml-3 ${PROSE_JUSTIFY}`}
                    style={bodyText()}
                  >
                    {`• ${h}`}
                  </p>
                ),
              )}
            </div>
          ))}
        </>
      ) : null,

    education:
      data.educations.length > 0 ? (
        <>
          <SectionTitle>{sectionLabel("education")}</SectionTitle>
          {data.educations.map((edu) => (
            <div key={edu.id} style={entryGap()}>
              {isAts ? (
                <AtsEntryHeader
                  primary={edu.degree}
                  secondary={edu.institution}
                  period={formatAtsEducationMeta(
                    edu.startDate,
                    edu.endDate,
                    edu.gpa,
                    lang,
                  )}
                />
              ) : (
                <>
                  <p style={titleText()}>
                    {`${edu.degree}${edu.field ? ` — ${edu.field}` : ""}`}
                  </p>
                  <p style={metaText()}>
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
                </>
              )}
              {isAts && edu.description
                ? splitAtsProseLines(edu.description).map((line, i) => (
                    <p key={i} className={PROSE_JUSTIFY} style={bodyText()}>
                      {line}
                    </p>
                  ))
                : null}
            </div>
          ))}
        </>
      ) : null,

    organizations:
      data.organizations.length > 0 ? (
        <>
          <SectionTitle>{sectionLabel("organizations")}</SectionTitle>
          {data.organizations.map((org) => (
            <div key={org.id} style={entryGap()}>
              {isAts ? (
                <AtsEntryHeader
                  primary={org.role}
                  secondary={org.name}
                  period={formatAtsPeriodLine(
                    org.startDate,
                    org.endDate,
                    org.current,
                    org.location,
                    lang,
                  )}
                />
              ) : (
                <>
                  <p style={titleText()}>
                    {org.role}
                    {org.name && `${sep}${org.name}`}
                  </p>
                  <p style={metaText()}>
                    {[
                      org.startDate,
                      org.endDate || (org.current ? t(lang, "present") : ""),
                      org.location,
                    ]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                </>
              )}
              {org.highlights.map((h, i) =>
                isAts ? (
                  <AtsBullet key={i} text={h} />
                ) : (
                  <p key={i} className="text-zinc-600 ml-3" style={bodyText()}>
                    {`• ${h}`}
                  </p>
                ),
              )}
            </div>
          ))}
        </>
      ) : null,

    skills:
      hasSkillContent(data) && config.template !== "professional" ? (
        isAts ? (
          <>
            <SectionTitle>{sectionLabel("technicalSkills")}</SectionTitle>
            {(() => {
              const groups = normalizeSkillGroups(data).filter(
                (g) => g.skills.length > 0,
              );
              const mid = Math.ceil(groups.length / 2);
              return (
                <div
                  className="grid grid-cols-1 sm:grid-cols-2"
                  style={{ gap: ats?.skillsGrid.gap ?? 14 }}
                >
                  {[0, 1].map((col) => (
                    <div key={col}>
                      {groups
                        .slice(
                          col === 0 ? 0 : mid,
                          col === 0 ? mid : undefined,
                        )
                        .map((group) => (
                          <div key={group.id} className="mb-2">
                            {group.name ? (
                              <p
                                style={{
                                  fontSize: ats?.skillGroup.fontSize,
                                  fontWeight: ats?.headingWeight,
                                  marginBottom: ats?.skillGroup.marginBottom,
                                  color: "#1a1a1a",
                                }}
                              >
                                {group.name}
                              </p>
                            ) : null}
                            {chunkSkillLines(group.skills).map((line, i) => (
                              <p
                                key={i}
                                style={{
                                  fontSize: ats?.skillsLine.fontSize,
                                  lineHeight: ats?.skillsLine.lineHeight,
                                  color: "#444444",
                                }}
                              >
                                {line}
                              </p>
                            ))}
                          </div>
                        ))}
                    </div>
                  ))}
                </div>
              );
            })()}
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
          {data.certifications.map((cert) =>
            isAts ? (
              <div
                key={cert.id}
                className="flex items-baseline justify-between gap-3"
                style={{ marginBottom: ats?.certItem.marginBottom }}
              >
                <span style={bodyText({ marginBottom: 0 })}>
                  {cert.name}
                  {cert.issuer ? ` — ${cert.issuer}` : ""}
                </span>
                {cert.date ? (
                  <span
                    className="shrink-0"
                    style={{
                      fontSize: ats?.certDate.fontSize,
                      color: ats?.certDate.color,
                    }}
                  >
                    {cert.date}
                  </span>
                ) : null}
              </div>
            ) : (
              <div key={cert.id} style={entryGap()}>
                <p style={titleText()}>{cert.name}</p>
                <p style={metaText()}>
                  {[cert.issuer, cert.date].filter(Boolean).join(" · ")}
                </p>
              </div>
            ),
          )}
        </>
      ) : null,

    languages:
      data.languages.length > 0 ? (
        <>
          <SectionTitle>{t(lang, "languages")}</SectionTitle>
          {isAts ? (
            <p
              style={{
                fontSize: ats?.skillsLine.fontSize ?? ty.sizes.sm,
                lineHeight: ats?.skillsLine.lineHeight,
                color: "#222222",
              }}
            >
              {data.languages
                .map(
                  (l) =>
                    `${l.name}${l.level ? ` (${getLanguageLevelLabel(l.level, lang)})` : ""}`,
                )
                .join(" · ")}
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {data.languages.map((l) => (
                <span
                  key={l.id}
                  className="text-zinc-600"
                  style={{ fontSize: ty.sizes.sm }}
                >
                  {l.name}
                  {l.level && ` (${getLanguageLevelLabel(l.level, lang)})`}
                </span>
              ))}
            </div>
          )}
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
              {section.items.map((item, i) =>
                isAts ? (
                  <AtsBullet key={i} text={item} />
                ) : (
                  <p
                    key={i}
                    style={{
                      fontSize: ty.sizes.sm,
                      marginLeft: 12,
                      color: "#52525b",
                    }}
                  >
                    • {item}
                  </p>
                ),
              )}
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
            className={PROSE_JUSTIFY}
            style={
              isAts && ats
                ? {
                    fontSize: ats.summary.fontSize,
                    lineHeight: ats.summary.lineHeight,
                    color: ats.summary.color,
                    marginBottom: ats.summary.marginBottom,
                  }
                : { fontSize: ty.sizes.sm, color: "#52525b" }
            }
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