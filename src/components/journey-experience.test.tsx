// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { JourneyExperience } from "./journey-experience";

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe("JourneyExperience", () => {
  it("renderon skenën e kërkuar me indeks të saktë", () => {
    render(<JourneyExperience initialIndex={47} />);
    expect(screen.getByTestId("journey-experience")).toHaveAttribute("data-screen-index", "48");
    expect(screen.getByText(/cilat janë betejat e tua të brendshme/i)).toBeInTheDocument();
  });

  it("lejon maksimumi tri beteja të brendshme", () => {
    render(<JourneyExperience initialIndex={47} />);

    fireEvent.click(screen.getByRole("button", { name: /disiplina/i }));
    fireEvent.click(screen.getByRole("button", { name: /mendimet negative/i }));
    fireEvent.click(screen.getByRole("button", { name: /ankthi/i }));
    fireEvent.click(screen.getByRole("button", { name: /energjia/i }));

    expect(screen.getByRole("button", { name: /disiplina/i })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: /mendimet negative/i })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: /ankthi/i })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: /energjia/i })).toHaveAttribute("aria-pressed", "false");
  });

  it("nuk shton navigim ose screen-counter që mungojnë në referencë", () => {
    render(<JourneyExperience initialIndex={52} />);
    expect(screen.queryByRole("navigation", { name: /navigimi i rrugëtimit/i })).not.toBeInTheDocument();
    expect(screen.queryByText(/53\s*\/\s*53/)).not.toBeInTheDocument();
  });

  it("nuk duplikon options e form-it, pillar-it ose feeling cards", () => {
    const form = render(<JourneyExperience initialIndex={5} />);
    expect(screen.getAllByText(/Gjumë deri vonë/i)).toHaveLength(1);
    form.unmount();

    const pillar = render(<JourneyExperience initialIndex={41} />);
    expect(screen.getAllByText(/Aftësi profesionale të kërkuara në treg/i)).toHaveLength(1);
    pillar.unmount();

    render(<JourneyExperience initialIndex={48} />);
    expect(screen.getAllByText(/I humbur/i)).toHaveLength(1);
  });

  it("shfaq kontrollin e audios dhe fazën e frymëmarrjes", () => {
    render(<JourneyExperience initialIndex={49} />);
    expect(screen.getByRole("button", { name: /audio/i })).toBeInTheDocument();
    expect(screen.getByText(/cikli 2 nga 3/i)).toBeInTheDocument();
    expect(screen.getByText("4")).toBeInTheDocument();
  });
});
