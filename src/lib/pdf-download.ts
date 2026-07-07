import { pdf, type DocumentProps } from "@react-pdf/renderer";
import type { ReactElement } from "react";
import { ensurePdfSetup } from "@/lib/pdf-setup";

export type PdfDownloadResult = {
  method: "share" | "download";
};

function safeFilename(name: string): string {
  const base = name.trim() || "cv";
  return base.toLowerCase().endsWith(".pdf") ? base : `${base}.pdf`;
}

export function isIosDevice(): boolean {
  if (typeof navigator === "undefined") return false;
  return (
    /iPad|iPhone|iPod/i.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
  );
}

async function sharePdfOnIos(file: File, title: string): Promise<boolean> {
  if (typeof navigator.share !== "function") return false;

  const payload = { files: [file], title };
  try {
    if (navigator.canShare && !navigator.canShare(payload)) {
      return false;
    }
    await navigator.share(payload);
    return true;
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") {
      return true;
    }
    throw err;
  }
}

export async function deliverPdfBlob(
  blob: Blob,
  filename: string,
): Promise<PdfDownloadResult> {
  const safeName = safeFilename(filename);
  const file = new File([blob], safeName, { type: "application/pdf" });

  if (isIosDevice()) {
    const shared = await sharePdfOnIos(file, safeName);
    if (shared) return { method: "share" };
    throw new Error("ios_share_unavailable");
  }

  const url = URL.createObjectURL(blob);
  const anchor = window.document.createElement("a");
  anchor.href = url;
  anchor.download = safeName;
  anchor.rel = "noopener";
  anchor.style.display = "none";
  window.document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 2000);

  return { method: "download" };
}

export async function downloadPdfBlob(
  document: ReactElement<DocumentProps>,
  filename: string,
): Promise<PdfDownloadResult> {
  ensurePdfSetup();
  const blob = await pdf(document).toBlob();
  return deliverPdfBlob(blob, filename);
}