// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ChallengeExperience } from "./challenge-experience";

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe("ChallengeExperience", () => {
  it("collects identity and personalizes the redeem scene", () => {
    render(<ChallengeExperience />);

    fireEvent.click(screen.getByRole("button", { name: /begin initiation/i }));
    fireEvent.click(screen.getByRole("button", { name: /enter silently/i }));

    fireEvent.change(screen.getByLabelText(/first name/i), {
      target: { value: "Zeqir" },
    });
    fireEvent.change(screen.getByLabelText(/last name/i), {
      target: { value: "Cara" },
    });
    fireEvent.click(screen.getByRole("button", { name: /continue/i }));

    expect(screen.getByText(/Zeqir, your initiation begins now/i)).toBeInTheDocument();
    expect(screen.getByText(/the gate is locked/i)).toBeInTheDocument();
  });

  it("keeps a wrong code recoverable and accepts LD2026", () => {
    vi.useFakeTimers();
    render(<ChallengeExperience />);

    fireEvent.click(screen.getByRole("button", { name: /begin initiation/i }));
    fireEvent.click(screen.getByRole("button", { name: /enter silently/i }));
    fireEvent.change(screen.getByLabelText(/first name/i), {
      target: { value: "Zeqir" },
    });
    fireEvent.change(screen.getByLabelText(/last name/i), {
      target: { value: "Cara" },
    });
    fireEvent.click(screen.getByRole("button", { name: /continue/i }));

    const code = screen.getByLabelText(/redeem code/i);
    fireEvent.change(code, { target: { value: "BAD001" } });
    fireEvent.click(screen.getByRole("button", { name: /unlock/i }));
    expect(screen.getByText(/code did not unlock the chest/i)).toBeInTheDocument();

    fireEvent.change(code, { target: { value: "LD2026" } });
    fireEvent.click(screen.getByRole("button", { name: /unlock/i }));
    expect(screen.getByTestId("challenge-experience")).toHaveAttribute(
      "data-phase",
      "recognition",
    );

    for (let index = 0; index < 6; index += 1) {
      act(() => vi.advanceTimersByTime(1800));
    }

    expect(screen.getByText(/every warrior starts somewhere/i)).toBeInTheDocument();
  });
});
