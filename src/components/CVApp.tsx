"use client";

import { useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { BuilderWorkspace } from "@/components/BuilderWorkspace";
import { CoinfestPopup } from "@/components/CoinfestPopup";
import { WelcomeScreen } from "@/components/WelcomeScreen";
import { TrakteerFab } from "@/components/TrakteerFab";
import { ResumeProvider } from "@/context/ResumeContext";
import { ResumePdfProvider } from "@/context/ResumePdfContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { isCoinfestPromoActive } from "@/lib/config";

function CVAppInner() {
  const [showPromo, setShowPromo] = useState(isCoinfestPromoActive);
  const [showWelcome, setShowWelcome] = useState(true);

  return (
    <>
      {showPromo ? (
        <CoinfestPopup onClose={() => setShowPromo(false)} />
      ) : null}

      {showWelcome ? (
        <WelcomeScreen onStart={() => setShowWelcome(false)} />
      ) : (
        <div className="min-h-dvh bg-zinc-50 dark:bg-zinc-950">
          <ResumePdfProvider>
            <AppHeader />
            <BuilderWorkspace />
            <TrakteerFab />
          </ResumePdfProvider>
        </div>
      )}
    </>
  );
}

export function CVApp() {
  return (
    <ThemeProvider>
      <ResumeProvider>
        <CVAppInner />
      </ResumeProvider>
    </ThemeProvider>
  );
}