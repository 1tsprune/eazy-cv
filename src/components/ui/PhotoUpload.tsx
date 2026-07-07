"use client";

import { Camera, Trash2, User } from "lucide-react";
import { useRef, useState } from "react";
import { processPhotoFile } from "@/lib/photo";
import { getUiDict } from "@/lib/ui-i18n";
import { useTheme } from "@/context/ThemeContext";

interface Props {
  photo: string;
  showPhoto: boolean;
  onChange: (photo: string) => void;
  onRemove: () => void;
  onToggleShow: (show: boolean) => void;
}

export function PhotoUpload({
  photo,
  showPhoto,
  onChange,
  onRemove,
  onToggleShow,
}: Props) {
  const { uiLocale } = useTheme();
  const t = getUiDict(uiLocale);
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setError("");
    setLoading(true);
    try {
      const dataUrl = await processPhotoFile(file);
      onChange(dataUrl);
    } catch (err) {
      const code = err instanceof Error ? err.message : "";
      if (code === "too_large") setError(t.photoTooLarge);
      else if (code === "invalid_type") setError(t.photoInvalidType);
      else setError(t.photoUploadError);
    } finally {
      setLoading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className="mb-4 rounded-xl border border-dashed border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-800/40">
      <div className="flex items-start gap-4">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={loading}
          className="group relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-zinc-200 bg-white transition hover:border-slate-400 dark:border-zinc-600 dark:bg-zinc-800"
        >
          {photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={photo}
              alt=""
              className="h-full w-full object-cover"
            />
          ) : (
            <User className="h-8 w-8 text-zinc-300 dark:text-zinc-600" />
          )}
          <span className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition group-hover:opacity-100">
            <Camera className="h-5 w-5 text-white" />
          </span>
        </button>

        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold text-zinc-800 dark:text-white">
            {t.photoLabel}
          </p>
          <p className="mt-0.5 text-[10px] text-zinc-500 dark:text-zinc-400">
            {t.photoHint}
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={loading}
              className="rounded-lg bg-slate-700 px-3 py-1.5 text-[10px] font-bold text-white hover:bg-slate-800 disabled:opacity-50"
            >
              {loading ? "..." : photo ? t.photoChange : t.photoUpload}
            </button>
            {photo && (
              <button
                type="button"
                onClick={onRemove}
                className="inline-flex items-center gap-1 rounded-lg border border-zinc-200 px-3 py-1.5 text-[10px] font-bold text-zinc-600 hover:bg-zinc-100 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-700"
              >
                <Trash2 className="h-4 w-4" />
                {t.photoRemove}
              </button>
            )}
          </div>
          {photo && (
            <label className="mt-2 flex items-center gap-2 text-[10px] text-zinc-600 dark:text-zinc-400">
              <input
                type="checkbox"
                checked={showPhoto}
                onChange={(e) => onToggleShow(e.target.checked)}
                className="rounded"
              />
              {t.showPhotoInCv}
            </label>
          )}
          {error && (
            <p className="mt-2 text-[10px] text-rose-500">{error}</p>
          )}
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
    </div>
  );
}