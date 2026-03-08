import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import WorkoutModal from "../src/components/WorkoutModal";

describe("WorkoutModal", () => {
  it("does not render when closed", () => {
    render(<WorkoutModal isOpen={false} initialValue={null} onClose={vi.fn()} onSubmit={vi.fn()} />);
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("submits edited values with numeric duration and unicode text", () => {
    const onSubmit = vi.fn();
    const initialValue = {
      id: 1,
      date: "2026-03-09",
      name: "è·‘æ­¥",
      durationMinutes: 45,
      paceTarget: "5:30/km",
      notes: "åˆå§‹"
    };

    render(<WorkoutModal isOpen initialValue={initialValue} onClose={vi.fn()} onSubmit={onSubmit} />);

    fireEvent.change(screen.getByLabelText("Treenin nimi"), { target: { value: "è·‘æ­¥ ØªØ¯Ø±ÙŠØ¨" } });
    fireEvent.change(screen.getByLabelText("Kesto (min)"), { target: { value: "120" } });
    fireEvent.change(screen.getByLabelText("Vauhtitavoite"), { target: { value: "4:55/km" } });
    fireEvent.change(screen.getByLabelText("Muistiinpanot"), { target: { value: "Ø¬Ù„Ø³Ø© Ù‚ÙˆÙŠØ©" } });
    fireEvent.click(screen.getByRole("button", { name: "Tallenna" }));

    expect(onSubmit).toHaveBeenCalledWith({
      date: "2026-03-09",
      name: "è·‘æ­¥ ØªØ¯Ø±ÙŠØ¨",
      durationMinutes: 120,
      paceTarget: "4:55/km",
      notes: "Ø¬Ù„Ø³Ø© Ù‚ÙˆÙŠØ©"
    });
  });
});
