import type { Metadata } from "next";
import { IgStoryDeck } from "./IgStoryDeck";

export const metadata: Metadata = {
  title: "Eazy CV Story — Screenshot di HP",
  robots: { index: false, follow: false },
};

export default function IgStoryPreviewPage() {
  return <IgStoryDeck />;
}