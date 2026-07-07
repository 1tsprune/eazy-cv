import { pdfjs } from "react-pdf";

let ready = false;

/** Local worker — same blob preview as download, no CDN dependency. */
export function ensurePdfJsWorker(): void {
  if (ready || typeof window === "undefined") return;
  pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
  ready = true;
}