import type { Metadata } from "next";
import { ChallengeExperience } from "../../components/challenge-experience";

export const metadata: Metadata = {
  title: "Sfida 21-Ditore | Luftetari Digjital",
  description: "Inicimi zyrtar në Sfidën 21-Ditore të Luftetari Digjital.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ChallengePage() {
  return <ChallengeExperience />;
}
