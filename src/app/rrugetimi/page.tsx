import type { Metadata } from "next";
import { JourneyExperience } from "../../components/journey-experience";

export const metadata: Metadata = {
  title: "Rrugëtimi | Luftetari Digjital",
  description: "Rrugëtimi hyrës i Luftetari Digjital.",
  robots: { index: false, follow: false },
};

export default function JourneyPage() {
  return <JourneyExperience />;
}
