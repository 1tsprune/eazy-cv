import { Lock, Shield } from "lucide-react";

interface Props {
  variant?: "subtle" | "prominent" | "compact";
}

export function PrivacyBadge({ variant = "subtle" }: Props) {
  if (variant === "compact") {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
        <Lock className="h-3 w-3" />
        Data cuma di browser kamu — aman
      </span>
    );
  }

  if (variant === "prominent") {
    return (
      <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900 dark:bg-emerald-950/50">
        <Shield className="h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
        <div>
          <p className="text-sm font-bold text-emerald-800 dark:text-emerald-300">
            Data kamu aman 100%
          </p>
          <p className="text-xs text-emerald-700/80 dark:text-emerald-400/80">
            Gak masuk database, gak ke server. Cuma tersimpan di browser kamu.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-lg dark:bg-emerald-950">
        🔒
      </div>
      <div>
        <p className="text-sm font-bold text-zinc-900 dark:text-white">
          Zero server. Zero database.
        </p>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          CV kamu cuma ada di browser ini. Kita gak bisa lihat data kamu.
        </p>
      </div>
    </div>
  );
}