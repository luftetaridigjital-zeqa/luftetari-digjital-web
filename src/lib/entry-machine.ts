export const ACCESS_CODE = "LD2026";

export type EntryPhase =
  | "threshold"
  | "artifact"
  | "challenge"
  | "recognition"
  | "key-activation"
  | "unlock"
  | "chest-reaction"
  | "opening"
  | "light"
  | "welcome";

export type EntryState = {
  phase: EntryPhase;
  soundEnabled: boolean;
  attempt: number;
  feedback: string | null;
};

export type EntryAction =
  | { type: "ENTER"; soundEnabled: boolean }
  | { type: "KEY_SETTLED" }
  | { type: "SUBMIT_CODE"; code: string }
  | { type: "ADVANCE" }
  | { type: "RESET" };

const unlockSequence: EntryPhase[] = [
  "recognition",
  "key-activation",
  "unlock",
  "chest-reaction",
  "opening",
  "light",
  "welcome",
];

export function normalizeAccessCode(value: string): string {
  return value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6);
}

export function createEntryState(): EntryState {
  return {
    phase: "threshold",
    soundEnabled: false,
    attempt: 0,
    feedback: null,
  };
}

export function advanceEntry(
  state: EntryState,
  action: EntryAction,
): EntryState {
  switch (action.type) {
    case "ENTER":
      return {
        ...state,
        phase: "artifact",
        soundEnabled: action.soundEnabled,
        feedback: null,
      };
    case "KEY_SETTLED":
      return state.phase === "artifact"
        ? { ...state, phase: "challenge" }
        : state;
    case "SUBMIT_CODE": {
      if (state.phase !== "challenge") return state;
      const accepted = normalizeAccessCode(action.code) === ACCESS_CODE;
      return accepted
        ? { ...state, phase: "recognition", feedback: null }
        : {
            ...state,
            attempt: state.attempt + 1,
            feedback: "Kodi nuk e hapi thesarin.",
          };
    }
    case "ADVANCE": {
      const index = unlockSequence.indexOf(state.phase);
      if (index < 0 || index === unlockSequence.length - 1) return state;
      return { ...state, phase: unlockSequence[index + 1] };
    }
    case "RESET":
      return createEntryState();
  }
}
