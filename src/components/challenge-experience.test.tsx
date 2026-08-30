// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ChallengeExperience } from "./challenge-experience";

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

function reachRedeem() {
  fireEvent.click(screen.getByRole("button", { name: /nis inicimin/i }));
  fireEvent.change(screen.getByLabelText(/^emri$/i), {
    target: { value: "Zeqir" },
  });
  fireEvent.change(screen.getByLabelText(/mbiemri/i), {
    target: { value: "Cara" },
  });
  fireEvent.click(screen.getByRole("button", { name: /vazhdo/i }));
}

describe("ChallengeExperience", () => {
  it("mbledh identitetin dhe personalizon portën e aksesit", () => {
    render(<ChallengeExperience />);
    reachRedeem();

    expect(screen.getByText(/Zeqir, inicimi yt fillon tani/i)).toBeInTheDocument();
    expect(screen.getByText(/aksesi yt është i kufizuar/i)).toBeInTheDocument();
  });

  it("e mban kodin e gabuar të rikuperueshëm dhe nis muzikën pas LD2026", () => {
    vi.useFakeTimers();
    render(<ChallengeExperience />);
    reachRedeem();

    const code = screen.getByLabelText(/kodi i aksesit/i);
    fireEvent.change(code, { target: { value: "BAD001" } });
    fireEvent.click(screen.getByRole("button", { name: /hap portën/i }));
    expect(screen.getByText(/kodi nuk e hapi portën/i)).toBeInTheDocument();
    expect(screen.queryByTitle(/muzika e inicimit/i)).not.toBeInTheDocument();

    fireEvent.change(code, { target: { value: "LD2026" } });
    fireEvent.click(screen.getByRole("button", { name: /hap portën/i }));
    expect(screen.getByTestId("challenge-experience")).toHaveAttribute(
      "data-phase",
      "recognition",
    );
    expect(screen.getByTitle(/muzika e inicimit/i)).toHaveAttribute(
      "src",
      expect.stringContaining("kjlu9RRHcbE"),
    );

    for (let index = 0; index < 6; index += 1) {
      act(() => vi.advanceTimersByTime(1800));
    }

    expect(screen.getByText(/çdo luftetar nis diku/i)).toBeInTheDocument();
  });
});
