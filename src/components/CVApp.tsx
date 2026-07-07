"use client";

import { useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { BuilderWorkspace } from "@/components/BuilderWorkspace";
import { WelcomeScreen } from "@/components/WelcomeScreen";
import { TrakteerFab } from "@/components/TrakteerFab";
import { ResumeProvider } from "@/context/ResumeContext";
import { ThemeProvider } from "@/context/ThemeContext";

function CVAppInner() {
  const [showWelcome, setShowWelcome] = useState(true);

  if (showWelcome) {
    return <WelcomeScreen onStart={() => setShowWelcome(false)} />;
  }

  return (
    <div className="min-h-dvh bg-zinc-50 dark:bg-zinc-950">
      <AppHeader />
      <BuilderWorkspace />
      <TrakteerFab />
    </div>
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