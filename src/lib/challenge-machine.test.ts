import { describe, expect, it } from "vitest";
import {
  advanceChallenge,
  createChallengeState,
  createMemberId,
  normalizeRedeemCode,
  type ChallengeState,
} from "./challenge-machine";

describe("21-Day Challenge initiation machine", () => {
  it("moves from arrival through identity into access", () => {
    let state = createChallengeState();
    expect(state.phase).toBe("arrival");

    state = advanceChallenge(state, { type: "BEGIN" });
    expect(state.phase).toBe("sound");

    state = advanceChallenge(state, { type: "CHOOSE_SOUND", enabled: true });
    expect(state.phase).toBe("identity");
    expect(state.soundEnabled).toBe(true);

    state = advanceChallenge(state, {
      type: "SET_IDENTITY",
      firstName: "  Zeqir ",
      lastName: " Cara  ",
    });
    expect(state.phase).toBe("redeem");
    expect(state.member).toMatchObject({
      firstName: "Zeqir",
      lastName: "Cara",
      fullName: "Zeqir Cara",
    });
  });

  it("keeps an invalid redeem attempt recoverable", () => {
    const state: ChallengeState = {
      ...createChallengeState(),
      phase: "redeem",
    };

    const next = advanceChallenge(state, {
      type: "SUBMIT_CODE",
      code: "WRONG1",
    });

    expect(next.phase).toBe("redeem");
    expect(next.redeemAttempts).toBe(1);
    expect(next.feedback).toBe("The code did not unlock the chest.");
  });

  it("accepts the prototype code and advances through the unlock sequence", () => {
    let state: ChallengeState = {
      ...createChallengeState(),
      phase: "redeem",
    };

    state = advanceChallenge(state, {
      type: "SUBMIT_CODE",
      code: "ld-2026",
    });
    expect(state.phase).toBe("recognition");

    const expected = [
      "key-activation",
      "unlock",
      "chest-reaction",
      "opening",
      "light",
      "mentor",
    ];
    for (const phase of expected) {
      state = advanceChallenge(state, { type: "ADVANCE" });
      expect(state.phase).toBe(phase);
    }
    expect(state.redeemCodeValidated).toBe(true);
  });

  it("requires all readiness answers before commitment", () => {
    let state: ChallengeState = {
      ...createChallengeState(),
      phase: "readiness",
    };

    for (let index = 0; index < 4; index += 1) {
      state = advanceChallenge(state, { type: "CONFIRM_READINESS" });
    }
    expect(state.phase).toBe("final-readiness");
    expect(state.readinessStep).toBe(4);

    state = advanceChallenge(state, { type: "ACCEPT_FINAL_READINESS" });
    expect(state.phase).toBe("commitment");
    expect(state.readinessCompleted).toBe(true);
  });

  it("does not permit sealing before reading and signing", () => {
    const state: ChallengeState = {
      ...createChallengeState(),
      phase: "commitment",
    };

    expect(advanceChallenge(state, { type: "SEAL_COMMITMENT" })).toBe(state);

    const read = advanceChallenge(state, { type: "MARK_COMMITMENT_READ" });
    expect(read.phase).toBe("signature");

    expect(advanceChallenge(read, { type: "SEAL_COMMITMENT" })).toBe(read);

    const signed = advanceChallenge(read, { type: "CREATE_SIGNATURE" });
    const sealed = advanceChallenge(signed, { type: "SEAL_COMMITMENT" });
    expect(sealed.phase).toBe("seal");
    expect(sealed.commitmentSealed).toBe(true);
  });

  it("toggles sound without changing the active scene", () => {
    const state: ChallengeState = {
      ...createChallengeState(),
      phase: "redeem",
    };
    const next = advanceChallenge(state, { type: "TOGGLE_SOUND" });
    expect(next.phase).toBe("redeem");
    expect(next.soundEnabled).toBe(true);
  });

  it("restores persisted non-secret initiation progress", () => {
    const persisted: ChallengeState = {
      ...createChallengeState(),
      phase: "rule",
      member: {
        firstName: "Zeqir",
        lastName: "Cara",
        fullName: "Zeqir Cara",
        memberId: "",
      },
      redeemCodeValidated: true,
      mentorJourneyCompleted: true,
    };
    const restored = advanceChallenge(createChallengeState(), {
      type: "RESTORE",
      state: persisted,
    });
    expect(restored.phase).toBe("rule");
    expect(restored.member.fullName).toBe("Zeqir Cara");
  });

  it("finishes initiation with a member identity at Day 0 and then enters Day 1", () => {
    let state: ChallengeState = {
      ...createChallengeState(),
      phase: "seal",
      commitmentRead: true,
      signatureCreated: true,
      commitmentSealed: true,
    };

    state = advanceChallenge(state, {
      type: "ASSIGN_MEMBER_ID",
      memberId: "LD-2026-0042",
    });
    expect(state.member.memberId).toBe("LD-2026-0042");

    state = advanceChallenge(state, { type: "ADVANCE" });
    expect(state.phase).toBe("member");
    expect(state.initiationCompleted).toBe(true);
    expect(state.currentDay).toBe(0);

    state = advanceChallenge(state, { type: "ADVANCE" });
    expect(state.phase).toBe("day-zero");

    state = advanceChallenge(state, { type: "ENTER_DAY_ONE" });
    expect(state.phase).toBe("day-one");
    expect(state.currentDay).toBe(1);
  });
});

describe("challenge helpers", () => {
  it("normalizes prototype redeem codes", () => {
    expect(normalizeRedeemCode(" ld-20 26 ")).toBe("LD2026");
  });

  it("creates an LD member identifier with a padded sequence", () => {
    expect(createMemberId(2026, 42)).toBe("LD-2026-0042");
  });
});
