import { describe, expect, it } from "vitest";
import {
  advanceEntry,
  createEntryState,
  normalizeAccessCode,
  type EntryState,
} from "./entry-machine";

describe("entry experience state machine", () => {
  it("normalizes access input to six uppercase alphanumeric characters", () => {
    expect(normalizeAccessCode("l d-20_26extra")).toBe("LD2026");
  });

  it("keeps the visitor in the challenge after a wrong code", () => {
    const state = { ...createEntryState(), phase: "challenge" as const };
    const next = advanceEntry(state, { type: "SUBMIT_CODE", code: "LD2025" });

    expect(next.phase).toBe("challenge");
    expect(next.attempt).toBe(1);
    expect(next.feedback).toBe("Kodi nuk e hapi thesarin.");
  });

  it("starts recognition when the correct code is submitted", () => {
    const state = { ...createEntryState(), phase: "challenge" as const };
    const next = advanceEntry(state, { type: "SUBMIT_CODE", code: "ld2026" });

    expect(next.phase).toBe("recognition");
    expect(next.feedback).toBeNull();
  });

  it("moves through the complete unlock sequence in order", () => {
    const phases = [
      "recognition",
      "key-activation",
      "unlock",
      "chest-reaction",
      "opening",
      "light",
      "welcome",
    ] as const;

    let state: EntryState = {
      ...createEntryState(),
      phase: "recognition",
    };

    for (const expected of phases.slice(1)) {
      state = advanceEntry(state, { type: "ADVANCE" });
      expect(state.phase).toBe(expected);
    }
  });
});
