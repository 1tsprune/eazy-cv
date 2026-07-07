"use client";

import { AlertCircle, CheckCircle2, Circle, MessageCircle } from "lucide-react";
import { useMemo } from "react";
import { useResume } from "@/context/ResumeContext";
import { useTheme } from "@/context/ThemeContext";
import { calculateAtsScore } from "@/lib/ats-score";
import { getUiDict } from "@/lib/ui-i18n";
import { SITE, whatsappUrl } from "@/lib/site";
import { ScoreRing } from "./ScoreRing";

export function AtsScorePanel() {
  const { data, config } = useResume();
  const { uiLocale } = useTheme();
  const t = getUiDict(uiLocale);
  const { score, checks } = useMemo(
    () => calculateAtsScore(data, config.language),
    [data, config.language],
  );
  const passed = checks.filter((c) => c.passed).length;
  const failed = checks.filter((c) => !c.passed);

  const vibe =
    score >= 80
      ? {
          emoji: "🔥",
          msg:
            uiLocale === "id"
              ? "Mantap! CV kamu siap dilamar"
              : "Great! Your CV is ready to apply",
          color: "text-lime-600 dark:text-lime-400",
        }
      : score >= 50
        ? {
            emoji: "💪",
            msg:
              uiLocale === "id"
                ? "Udah oke, tinggal sedikit lagi"
                : "Almost there, just a bit more",
            color: "text-amber-600 dark:text-amber-400",
          }
        : {
            emoji: "✍️",
            msg:
              uiLocale === "id"
                ? "Yuk lengkapin dulu ya"
                : "Let's fill it in first",
            color: "text-pink-600 dark:text-pink-400",
          };

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="hidden lg:flex lg:justify-center lg:pb-4">
        <ScoreRing size="lg" />
      </div>

      <div className="lg:hidden">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black text-zinc-900 dark:text-white">
            {t.scoreTitle} {vibe.emoji}
          </h3>
          <span className={`text-2xl font-black ${vibe.color}`}>{score}</span>
        </div>
        <p className={`mt-1 text-xs font-semibold ${vibe.color}`}>{vibe.msg}</p>
      </div>

      {failed.length > 0 && (
        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 dark:border-amber-900/50 dark:bg-amber-950/30">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
            <p className="text-xs font-bold text-amber-800 dark:text-amber-300">
              {t.atsTipsTitle}
            </p>
          </div>
          <ul className="mt-2 space-y-1.5">
            {failed.map((check) => (
              <li
                key={check.id}
                className="text-[11px] leading-snug text-amber-900/90 dark:text-amber-200/90"
              >
                • {check.tip}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-4 flex items-center gap-2 text-xs text-zinc-400">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
          <div
            className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-lime-400 transition-all duration-500"
            style={{ width: `${(passed / checks.length) * 100}%` }}
          />
        </div>
        <span className="font-bold text-zinc-600 dark:text-zinc-300">
          {passed}/{checks.length}
        </span>
      </div>

      <ul className="mt-4 space-y-2">
        {checks.map((check) => (
          <li key={check.id} className="flex items-start gap-2 text-xs">
            {check.passed ? (
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-lime-500 dark:text-lime-400" />
            ) : (
              <Circle className="mt-0.5 h-4 w-4 shrink-0 text-zinc-300 dark:text-zinc-600" />
            )}
            <span
              className={
                check.passed
                  ? "text-zinc-700 dark:text-zinc-300"
                  : "text-zinc-500 dark:text-zinc-400"
              }
            >
              {check.label}
              {!check.passed && (
                <span className="block text-[10px] text-zinc-400 dark:text-zinc-500">
                  → {check.tip}
                </span>
              )}
            </span>
          </li>
        ))}
      </ul>

      {score < 80 && (
        <a
          href={whatsappUrl(
            uiLocale === "id"
              ? "Halo, bantu review CV dong!"
              : "Hi, can you help review my CV?",
          )}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 flex items-center justify-center gap-2 rounded-full border border-lime-300 bg-lime-50 px-4 py-2.5 text-xs font-bold text-lime-700 transition hover:bg-lime-100 dark:border-lime-800 dark:bg-lime-950 dark:text-lime-300 dark:hover:bg-lime-900"
        >
          <MessageCircle className="h-3.5 w-3.5" />
          {uiLocale === "id" ? "Butuh bantuan?" : "Need help?"}{" "}
          {SITE.whatsappDisplay}
        </a>
      )}
    </div>
  );
}