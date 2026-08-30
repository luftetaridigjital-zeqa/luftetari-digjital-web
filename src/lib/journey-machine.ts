export const JOURNEY_SCREEN_COUNT = 53;

export type JourneyState = {
  currentIndex: number;
  completed: boolean;
  selections: Record<number, string[]>;
};

export type JourneyAction =
  | { type: "NEXT" }
  | { type: "PREVIOUS" }
  | { type: "SELECT"; option: string; maxSelections: number }
  | { type: "RESTORE"; state: JourneyState }
  | { type: "RESET" };

export function createJourneyState(): JourneyState {
  return {
    currentIndex: 0,
    completed: false,
    selections: {},
  };
}

export function advanceJourney(state: JourneyState, action: JourneyAction): JourneyState {
  switch (action.type) {
    case "NEXT":
      if (state.currentIndex >= JOURNEY_SCREEN_COUNT - 1) {
        return { ...state, completed: true };
      }
      return { ...state, currentIndex: state.currentIndex + 1 };
    case "PREVIOUS":
      return {
        ...state,
        currentIndex: Math.max(0, state.currentIndex - 1),
        completed: false,
      };
    case "SELECT": {
      const current = state.selections[state.currentIndex] ?? [];
      const exists = current.includes(action.option);
      const next = exists
        ? current.filter((option) => option !== action.option)
        : current.length < action.maxSelections
          ? [...current, action.option]
          : current;
      return {
        ...state,
        selections: {
          ...state.selections,
          [state.currentIndex]: next,
        },
      };
    }
    case "RESTORE":
      return {
        ...action.state,
        currentIndex: Math.min(
          JOURNEY_SCREEN_COUNT - 1,
          Math.max(0, action.state.currentIndex),
        ),
      };
    case "RESET":
      return createJourneyState();
  }
}
