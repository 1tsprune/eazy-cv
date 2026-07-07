"use client";

import { usePDF } from "@react-pdf/renderer";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  type ReactElement,
  type ReactNode,
} from "react";
import type { DocumentProps } from "@react-pdf/renderer";
import { buildResumePdfDocument } from "@/lib/build-resume-pdf-document";
import { useResume } from "@/context/ResumeContext";
import { ensurePdfSetup } from "@/lib/pdf-setup";

type ResumePdfContextValue = {
  document: ReactElement<DocumentProps>;
  url: string | null;
  blob: Blob | null;
  loading: boolean;
  error: string | null;
  waitForBlob: () => Promise<Blob>;
};

const ResumePdfContext = createContext<ResumePdfContextValue | null>(null);

function waitMs(ms: number): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

export function ResumePdfProvider({ children }: { children: ReactNode }) {
  const { data, config } = useResume();

  useEffect(() => {
    ensurePdfSetup();
  }, []);

  const document = useMemo(
    () => buildResumePdfDocument(data, config),
    [
      data,
      config,
      config.exportMode,
      config.template,
      config.colorTheme,
      config.fontFamily,
      config.fontSize,
      config.fontBold,
      config.language,
      config.showPhoto,
      config.cvProfile,
      config.sectionOrder,
    ],
  );

  const [pdfState, updatePdf] = usePDF({ document });
  const stateRef = useRef(pdfState);
  stateRef.current = pdfState;

  // usePDF only renders the initial document; regenerate the blob whenever the
  // document changes (template/data edit) so the download matches the preview.
  useEffect(() => {
    updatePdf(document);
  }, [document, updatePdf]);

  const waitForBlob = useCallback(async (): Promise<Blob> => {
    for (let i = 0; i < 400; i++) {
      const state = stateRef.current;
      if (state.blob && !state.loading) return state.blob;
      if (state.error) throw new Error(state.error);
      await waitMs(50);
    }
    throw new Error("pdf_timeout");
  }, []);

  const value = useMemo(
    (): ResumePdfContextValue => ({
      document,
      url: pdfState.url,
      blob: pdfState.blob,
      loading: pdfState.loading,
      error: pdfState.error,
      waitForBlob,
    }),
    [
      document,
      pdfState.url,
      pdfState.blob,
      pdfState.loading,
      pdfState.error,
      waitForBlob,
    ],
  );

  return (
    <ResumePdfContext.Provider value={value}>
      {children}
    </ResumePdfContext.Provider>
  );
}

export function useResumePdf(): ResumePdfContextValue {
  const ctx = useContext(ResumePdfContext);
  if (!ctx) {
    throw new Error("useResumePdf must be used within ResumePdfProvider");
  }
  return ctx;
}

export function useResumePdfOptional(): ResumePdfContextValue | null {
  return useContext(ResumePdfContext);
}