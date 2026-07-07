"use client";

import { Shield, Sparkles, Zap } from "lucide-react";
import { DevAvatar } from "@/components/DevAvatar";
import { Logo } from "@/components/Logo";
import { TrakteerFab } from "@/components/TrakteerFab";
import { APP, SOCIAL } from "@/lib/config";
import { getUiDict } from "@/lib/ui-i18n";
import { useTheme } from "@/context/ThemeContext";

type Props = { onStart: () => void };

export function WelcomeScreen({ onStart }: Props) {
  const { uiLocale } = useTheme();
  const t = getUiDict(uiLocale);

  const features = [
    { icon: Zap, title: t.feature1, sub: t.feature1Sub },
    { icon: Sparkles, title: t.feature2, sub: t.feature2Sub },
    { icon: Shield, title: t.feature3, sub: t.feature3Sub },
  ];

  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-zinc-50 px-4 py-16 dark:bg-zinc-950">
      <div
        className="pointer-events-none absolute inset-0 opacity-60 dark:opacity-30"
        style={{
          backgroundSize: "40px 40px",
          backgroundImage: `
            linear-gradient(to right, rgba(0,0,0,0.04) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0,0,0,0.04) 1px, transparent 1px)
          `,
        }}
      />

      <div className="relative z-10 flex w-full max-w-3xl flex-col items-center text-center">
        <Logo variant="icon" size="lg" className="mb-5" />
        <h1 className="text-4xl font-extrabold tracking-tighter text-zinc-900 dark:text-white md:text-6xl">
          {t.welcomePrefix}{" "}
          <span className="bg-gradient-to-br from-slate-800 to-slate-600 bg-clip-text text-transparent dark:from-slate-300 dark:to-slate-400">
            {APP.name}
          </span>
        </h1>

        <div className="mx-auto mt-6 max-w-lg space-y-3">
          <p className="text-sm font-medium leading-relaxed text-zinc-500 dark:text-zinc-400 md:text-base">
            {t.welcomeLead}{" "}
            <strong className="font-bold text-emerald-600">{t.welcomeFree}</strong>{" "}
            {t.welcomeMid}
            <br />
            <strong className="font-bold text-rose-500">{t.welcomeForbidden}</strong>{" "}
            {t.welcomeEnd}
            <br />
            <br />
            {t.welcomeSupport}{" "}
            <a
              href={SOCIAL.twitter.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-slate-700 hover:underline dark:text-slate-300"
            >
              {SOCIAL.twitter.handle}
            </a>{" "}
            {t.welcomeSupportSuffix}
          </p>

          <a
            href={SOCIAL.twitter.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group mx-auto mt-6 inline-flex max-w-[280px] items-center rounded-2xl border border-zinc-200 bg-white p-1.5 pr-4 text-left shadow-sm transition hover:shadow-md dark:border-zinc-700 dark:bg-zinc-900 sm:max-w-max"
          >
            <DevAvatar size="md" />
            <div className="ml-3 mr-4 flex flex-col">
              <span className="flex items-center gap-1.5 text-xs font-bold leading-tight text-zinc-900 dark:text-white">
                {SOCIAL.twitter.name}
                <svg width="12" height="12" viewBox="0 0 24 24" fill="#3b82f6" aria-hidden>
                  <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-1.9 14.7L6 12.6l1.5-1.5 2.6 2.6 6.4-6.4 1.5 1.5-7.9 7.9z" />
                </svg>
              </span>
              <span className="mt-0.5 line-clamp-1 text-[10px] font-medium leading-tight text-zinc-500">
                {SOCIAL.twitter.handle} · {t.developer}
              </span>
            </div>
            <span className="ml-auto rounded-lg border border-zinc-200 bg-zinc-100 px-3 py-1.5 text-[10px] font-bold text-zinc-900 transition group-hover:bg-zinc-900 group-hover:text-white dark:border-zinc-600 dark:bg-zinc-800 dark:text-white">
              {t.follow}
            </span>
          </a>
        </div>

        <div className="mt-8 grid w-full max-w-2xl grid-cols-1 gap-3 sm:grid-cols-3">
          {features.map(({ icon: Icon, title, sub }) => (
            <div
              key={title}
              className="rounded-xl border border-zinc-100 bg-white p-3 text-left shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
            >
              <Icon className="mb-2 h-4 w-4 text-slate-700 dark:text-slate-300" />
              <p className="text-[11px] font-bold text-zinc-900 dark:text-white">
                {title}
              </p>
              <p className="mt-0.5 text-[10px] text-zinc-500">{sub}</p>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={onStart}
          className="mt-10 inline-flex items-center gap-2 rounded-full bg-slate-700 px-8 py-3 text-sm font-bold text-white shadow-lg shadow-slate-200 transition hover:bg-slate-800 dark:shadow-slate-900/30"
        >
          {t.startNow} →
        </button>
      </div>

      <TrakteerFab />
    </div>
  );
}