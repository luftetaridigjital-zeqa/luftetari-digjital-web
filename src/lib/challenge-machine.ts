export const PROTOTYPE_REDEEM_CODE = "LD2026";

export type ChallengePhase =
  | "arrival"
  | "identity"
  | "redeem"
  | "recognition"
  | "key-activation"
  | "unlock"
  | "chest-reaction"
  | "opening"
  | "light"
  | "mentor"
  | "rule"
  | "readiness"
  | "final-readiness"
  | "commitment"
  | "signature"
  | "seal"
  | "member"
  | "day-zero"
  | "day-one";

export type ChallengeMember = {
  firstName: string;
  lastName: string;
  fullName: string;
  memberId: string;
};

export type ChallengeState = {
  phase: ChallengePhase;
  soundEnabled: boolean;
  member: ChallengeMember;
  redeemCodeValidated: boolean;
  redeemAttempts: number;
  feedback: string | null;
  mentorJourneyCompleted: boolean;
  ruleAccepted: boolean;
  readinessStep: number;
  readinessCompleted: boolean;
  commitmentRead: boolean;
  signatureCreated: boolean;
  commitmentSealed: boolean;
  initiationCompleted: boolean;
  currentDay: number;
};

export type ChallengeAction =
  | { type: "RESTORE"; state: ChallengeState }
  | { type: "BEGIN" }
  | { type: "SET_IDENTITY"; firstName: string; lastName: string }
  | { type: "SUBMIT_CODE"; code: string }
  | { type: "ADVANCE" }
  | { type: "COMPLETE_MENTOR" }
  | { type: "ACCEPT_RULE" }
  | { type: "CONFIRM_READINESS" }
  | { type: "ACCEPT_FINAL_READINESS" }
  | { type: "MARK_COMMITMENT_READ" }
  | { type: "CREATE_SIGNATURE" }
  | { type: "SEAL_COMMITMENT" }
  | { type: "ASSIGN_MEMBER_ID"; memberId: string }
  | { type: "ENTER_DAY_ONE" }
  | { type: "RESET" };

const unlockSequence: ChallengePhase[] = [
  "recognition",
  "key-activation",
  "unlock",
  "chest-reaction",
  "opening",
  "light",
  "mentor",
];

export function normalizeRedeemCode(value: string): string {
  return value.toUpperCase().replace(/[^A-Z0-9]/g, "");
}

export function createMemberId(year: number, sequence: number): string {
  return `LD-${year}-${String(sequence).padStart(4, "0")}`;
}

export function createChallengeState(): ChallengeState {
  return {
    phase: "arrival",
    soundEnabled: false,
    member: {
      firstName: "",
      lastName: "",
      fullName: "",
      memberId: "",
    },
    redeemCodeValidated: false,
    redeemAttempts: 0,
    feedback: null,
    mentorJourneyCompleted: false,
    ruleAccepted: false,
    readinessStep: 0,
    readinessCompleted: false,
    commitmentRead: false,
    signatureCreated: false,
    commitmentSealed: false,
    initiationCompleted: false,
    currentDay: 0,
  };
}

export function advanceChallenge(
  state: ChallengeState,
  action: ChallengeAction,
): ChallengeState {
  switch (action.type) {
    case "RESTORE":
      return action.state;
    case "BEGIN":
      return state.phase === "arrival" ? { ...state, phase: "identity" } : state;
    case "SET_IDENTITY": {
      if (state.phase !== "identity") return state;
      const firstName = action.firstName.trim();
      const lastName = action.lastName.trim();
      if (!firstName || !lastName) return state;
      return {
        ...state,
        phase: "redeem",
        member: {
          ...state.member,
          firstName,
          lastName,
          fullName: `${firstName} ${lastName}`,
        },
      };
    }
    case "SUBMIT_CODE": {
      if (state.phase !== "redeem") return state;
      if (normalizeRedeemCode(action.code) !== PROTOTYPE_REDEEM_CODE) {
        return {
          ...state,
          redeemAttempts: state.redeemAttempts + 1,
          feedback: "Kodi nuk e hapi portën.",
        };
      }
      return {
        ...state,
        phase: "recognition",
        redeemCodeValidated: true,
        soundEnabled: true,
        feedback: null,
      };
    }
    case "ADVANCE": {
      const unlockIndex = unlockSequence.indexOf(state.phase);
      if (unlockIndex >= 0 && unlockIndex < unlockSequence.length - 1) {
        return { ...state, phase: unlockSequence[unlockIndex + 1] };
      }
      if (state.phase === "seal" && state.commitmentSealed) {
        return {
          ...state,
          phase: "member",
          initiationCompleted: true,
          currentDay: 0,
        };
      }
      if (state.phase === "member") return { ...state, phase: "day-zero" };
      return state;
    }
    case "COMPLETE_MENTOR":
      return state.phase === "mentor"
        ? { ...state, phase: "rule", mentorJourneyCompleted: true }
        : state;
    case "ACCEPT_RULE":
      return state.phase === "rule"
        ? { ...state, phase: "readiness", ruleAccepted: true }
        : state;
    case "CONFIRM_READINESS": {
      if (state.phase !== "readiness") return state;
      const readinessStep = Math.min(state.readinessStep + 1, 4);
      return {
        ...state,
        readinessStep,
        phase: readinessStep === 4 ? "final-readiness" : "readiness",
      };
    }
    case "ACCEPT_FINAL_READINESS":
      return state.phase === "final-readiness"
        ? { ...state, phase: "commitment", readinessCompleted: true }
        : state;
    case "MARK_COMMITMENT_READ":
      return state.phase === "commitment"
        ? { ...state, phase: "signature", commitmentRead: true }
        : state;
    case "CREATE_SIGNATURE":
      return state.phase === "signature" && state.commitmentRead
        ? { ...state, signatureCreated: true }
        : state;
    case "SEAL_COMMITMENT":
      return state.phase === "signature" && state.commitmentRead && state.signatureCreated
        ? { ...state, phase: "seal", commitmentSealed: true }
        : state;
    case "ASSIGN_MEMBER_ID":
      return state.phase === "seal" && action.memberId
        ? { ...state, member: { ...state.member, memberId: action.memberId } }
        : state;
    case "ENTER_DAY_ONE":
      return state.phase === "day-zero" && state.initiationCompleted
        ? { ...state, phase: "day-one", currentDay: 1 }
        : state;
    case "RESET":
      return createChallengeState();
  }
}
