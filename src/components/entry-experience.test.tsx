// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import EntryExperience from "./entry-experience";

describe("EntryExperience", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("guides a visitor from silent entry through code challenge to welcome", () => {
    vi.useFakeTimers();
    render(<EntryExperience />);

    fireEvent.click(screen.getByRole("button", { name: /enter silently/i }));
    act(() => vi.advanceTimersByTime(6000));

    const codeInput = screen.getByLabelText("Kodi i hyrjes");
    fireEvent.change(codeInput, { target: { value: "LD2025" } });
    fireEvent.click(screen.getByRole("button", { name: /provo kodin/i }));
    expect(screen.getByText("Kodi nuk e hapi thesarin.")).toBeInTheDocument();

    fireEvent.change(codeInput, { target: { value: "LD2026" } });
    fireEvent.click(screen.getByRole("button", { name: /provo kodin/i }));
    for (let step = 0; step < 7; step += 1) {
      act(() => vi.advanceTimersByTime(2200));
    }

    expect(
      screen.getByRole("heading", { name: /mirë se erdhe.*luftetar/i }),
    ).toBeInTheDocument();
  });
});
