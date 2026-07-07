"use client";

import { usePDF } from "@react-pdf/renderer";
import {
  createContext,
  useCallback,
  useContext,
  useDeferredValue,
  useMemo,
  useRef,
  type ReactNode,
} from "react";
import { buildResumePdfDocument } from "@/lib/build-resume-pdf-document";
import { useResume } from "@/context/ResumeContext";
import type { ResumeConfig, ResumeData } from "@/lib/types";

type ResumePdfContextValue = {
  url: string | null;
  blob: Blob | null;
  loading: boolean;
  error: string | null;
  isStale: boolean;
  waitForBlob: () => Promise<Blob>;
};

const ResumePdfContext = createContext<ResumePdfContextValue | null>(null);

function waitMs(ms: number): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

export function ResumePdfProvider({ children }: { children: ReactNode }) {
  const { data, config } = useResume();
  const deferredData = useDeferredValue(data);
  const deferredConfig = useDeferredValue(config);
  const isStale =
    deferredData !== data || deferredConfig !== config;

  const document = useMemo(
    () => buildResumePdfDocument(deferredData, deferredConfig),
    [deferredData, deferredConfig],
  );

  const [pdfState] = usePDF({ document });
  const stateRef = useRef(pdfState);
  stateRef.current = pdfState;

  const waitForBlob = useCallback(async (): Promise<Blob> => {
    for (let i = 0; i < 400; i++) {
      const state = stateRef.current;
      if (state.blob) return state.blob;
      if (state.error) throw new Error(state.error);
      await waitMs(50);
    }
    throw new Error("pdf_timeout");
  }, []);

  const value = useMemo(
    (): ResumePdfContextValue => ({
      url: pdfState.url,
      blob: pdfState.blob,
      loading: pdfState.loading,
      error: pdfState.error,
      isStale,
      waitForBlob,
    }),
    [
      pdfState.url,
      pdfState.blob,
      pdfState.loading,
      pdfState.error,
      isStale,
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

/** Optional hook for components that may render outside the provider. */
export function useResumePdfOptional(): ResumePdfContextValue | null {
  return useContext(ResumePdfContext);
}