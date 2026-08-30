import type { Metadata } from "next";
import { ChallengeExperience } from "../../components/challenge-experience";

export const metadata: Metadata = {
  title: "21-Day Challenge | Luftetari Digjital",
  description: "Hyrja zyrtare në Luftetari Digjital 21-Day Challenge.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ChallengePage() {
  return <ChallengeExperience />;
}
