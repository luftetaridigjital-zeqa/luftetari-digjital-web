import { describe, expect, it } from "vitest";
import {
  advanceJourney,
  createJourneyState,
  JOURNEY_SCREEN_COUNT,
} from "./journey-machine";

describe("LD journey machine", () => {
  it("nis në skenën 1 dhe ecën në rend pa kapërcyer", () => {
    let state = createJourneyState();
    expect(JOURNEY_SCREEN_COUNT).toBe(53);
    expect(state.currentIndex).toBe(0);

    state = advanceJourney(state, { type: "NEXT" });
    expect(state.currentIndex).toBe(1);

    state = advanceJourney(state, { type: "NEXT" });
    expect(state.currentIndex).toBe(2);
  });

  it("ruan selektimet dhe respekton maksimumin e skenës", () => {
    let state = createJourneyState();
    state = advanceJourney(state, { type: "SELECT", option: "Disiplina", maxSelections: 3 });
    state = advanceJourney(state, { type: "SELECT", option: "Fokusi", maxSelections: 3 });
    state = advanceJourney(state, { type: "SELECT", option: "Energjia", maxSelections: 3 });
    state = advanceJourney(state, { type: "SELECT", option: "Ankthi", maxSelections: 3 });

    expect(state.selections[0]).toEqual(["Disiplina", "Fokusi", "Energjia"]);

    state = advanceJourney(state, { type: "SELECT", option: "Fokusi", maxSelections: 3 });
    expect(state.selections[0]).toEqual(["Disiplina", "Energjia"]);
  });

  it("përfundon vetëm pasi kalon skenën 53", () => {
    let state = createJourneyState();
    for (let index = 0; index < JOURNEY_SCREEN_COUNT; index += 1) {
      state = advanceJourney(state, { type: "NEXT" });
    }

    expect(state.currentIndex).toBe(52);
    expect(state.completed).toBe(true);
  });

  it("rikthen progresin e ruajtur pa ndryshuar rendin", () => {
    const restored = advanceJourney(createJourneyState(), {
      type: "RESTORE",
      state: {
        currentIndex: 17,
        completed: false,
        selections: { 8: ["Fokusi"] },
      },
    });

    expect(restored.currentIndex).toBe(17);
    expect(restored.selections[8]).toEqual(["Fokusi"]);
  });
});
