"use client";

import { FileArchive, Linkedin, X } from "lucide-react";
import { useRef, useState } from "react";
import { useResume } from "@/context/ResumeContext";
import { useTheme } from "@/context/ThemeContext";
import { getUiDict } from "@/lib/ui-i18n";
import {
  mergeLinkedInData,
  parseLinkedInPaste,
  parseLinkedInZip,
} from "@/lib/linkedin-import";

export function LinkedInImport() {
  const { data, importLinkedIn } = useResume();
  const { uiLocale } = useTheme();
  const t = getUiDict(uiLocale);
  const [open, setOpen] = useState(true);
  const [paste, setPaste] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const zipRef = useRef<HTMLInputElement>(null);

  const handlePasteImport = () => {
    setError("");
    if (!paste.trim()) {
      setError(
        uiLocale === "id"
          ? "Paste dulu teks profil LinkedIn kamu"
          : "Paste your LinkedIn profile text first",
      );
      return;
    }
    const imported = parseLinkedInPaste(paste);
    if (!imported.personal?.fullName && !imported.experiences?.length) {
      setError(
        uiLocale === "id"
          ? "Gagal parse. Copy seluruh profil LinkedIn kamu ya."
          : "Parse failed. Copy your full LinkedIn profile.",
      );
      return;
    }
    importLinkedIn(mergeLinkedInData(data, imported));
    setPaste("");
  };

  const handleZipImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    setError("");
    try {
      const imported = await parseLinkedInZip(file);
      importLinkedIn(mergeLinkedInData(data, imported));
    } catch {
      setError(
        uiLocale === "id"
          ? "ZIP gagal dibaca. Pastikan ini export data LinkedIn."
          : "Could not read ZIP. Make sure it's a LinkedIn data export.",
      );
    } finally {
      setLoading(false);
      e.target.value = "";
    }
  };

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex w-full items-center justify-center gap-2 rounded-2xl border border-[#0A66C2]/30 bg-[#0A66C2]/10 py-3 text-xs font-bold text-[#0A66C2] dark:text-[#70B5F9]"
      >
        <Linkedin className="h-4 w-4" />
        {t.importLinkedIn}
      </button>
    );
  }

  return (
    <div className="rounded-2xl border border-[#0A66C2]/20 bg-[#0A66C2]/5 p-4 dark:bg-[#0A66C2]/10">
      <p className="text-[10px] leading-relaxed text-zinc-500 dark:text-zinc-400">
        {t.importLinkedInHint}
      </p>
      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Linkedin className="h-4 w-4 text-[#0A66C2] dark:text-[#70B5F9]" />
          <h3 className="text-xs font-black text-zinc-900 dark:text-white">
            {t.importLinkedIn}
          </h3>
        </div>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <textarea
        value={paste}
        onChange={(e) => setPaste(e.target.value)}
        rows={4}
        placeholder={
          uiLocale === "id"
            ? "Paste profil LinkedIn kamu di sini..."
            : "Paste your LinkedIn profile here..."
        }
        className="mt-3 w-full resize-y rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-[#0A66C2] dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:placeholder:text-zinc-500"
      />
      <div className="mt-2 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={handlePasteImport}
          className="rounded-full bg-[#0A66C2] px-4 py-2 text-xs font-bold text-white hover:bg-[#004182]"
        >
          {uiLocale === "id" ? "Import paste" : "Import paste"}
        </button>
        <button
          type="button"
          onClick={() => zipRef.current?.click()}
          disabled={loading}
          className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 px-4 py-2 text-xs font-bold text-zinc-600 hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800"
        >
          <FileArchive className="h-3.5 w-3.5" />
          {loading ? "..." : "Upload ZIP"}
        </button>
        <input
          ref={zipRef}
          type="file"
          accept=".zip"
          className="hidden"
          onChange={handleZipImport}
        />
      </div>
      {error && <p className="mt-2 text-xs text-rose-500">{error}</p>}
    </div>
  );
}