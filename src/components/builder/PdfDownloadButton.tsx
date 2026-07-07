"use client";

import { Download, Loader2 } from "lucide-react";
import { useState, type ReactElement } from "react";
import type { DocumentProps } from "@react-pdf/renderer";
import { downloadPdfBlob, isIosDevice } from "@/lib/pdf-download";
import { useTheme } from "@/context/ThemeContext";
import { getUiDict } from "@/lib/ui-i18n";

type Props = {
  document: ReactElement<DocumentProps>;
  filename: string;
  label: string;
  className?: string;
};

export function PdfDownloadButton({
  document,
  filename,
  label,
  className = "",
}: Props) {
  const { uiLocale } = useTheme();
  const t = getUiDict(uiLocale);
  const [loading, setLoading] = useState(false);
  const [hint, setHint] = useState<string | null>(null);
  const ios = isIosDevice();

  async function handleClick() {
    if (loading) return;
    setLoading(true);
    setHint(null);
    try {
      const result = await downloadPdfBlob(document, filename);
      if (result.method === "share") {
        setHint(t.downloadIosHint);
        window.setTimeout(() => setHint(null), 6000);
      }
    } catch (err) {
      setHint(
        err instanceof Error && err.message === "ios_share_unavailable"
          ? t.downloadIosUnsupported
          : t.downloadFailed,
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={`w-full ${className}`}>
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className={`inline-flex w-full items-center justify-center gap-1.5 rounded-xl px-5 py-2.5 text-xs font-bold transition ${
          loading
            ? "cursor-wait bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500"
            : "bg-slate-700 text-white hover:bg-slate-800"
        }`}
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Download className="h-4 w-4" />
        )}
        {label}
      </button>
      {ios || hint ? (
        <p className="mt-1.5 text-center text-[10px] leading-snug text-zinc-500 dark:text-zinc-400">
          {hint ?? (ios ? t.downloadIosHint : null)}
        </p>
      ) : null}
    </div>
  );
}