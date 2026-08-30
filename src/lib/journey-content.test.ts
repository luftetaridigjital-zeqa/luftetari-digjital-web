import { describe, expect, it } from "vitest";
import { journeyScreens } from "./journey-content";

describe("LD journey content", () => {
  it("përmban saktësisht 53 skena në rend unik", () => {
    expect(journeyScreens).toHaveLength(53);
    expect(journeyScreens.map((screen) => screen.id)).toEqual(
      Array.from({ length: 53 }, (_, index) => index + 1),
    );
  });

  it("nuk lë skena pa përmbajtje ose pa interaction type", () => {
    for (const screen of journeyScreens) {
      expect(screen.kind).toBeTruthy();
      expect(Number(Boolean(screen.title)) + screen.copy.length + screen.options.length).toBeGreaterThan(0);
    }
  });
});
