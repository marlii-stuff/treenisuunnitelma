import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import WeekGrid from "../src/components/WeekGrid";

describe("WeekGrid", () => {
  it("renders workouts including unicode text and dispatches add/edit/delete", () => {
    const days = [{ label: "maanantai", iso: "2026-03-09" }];
    const workoutsByDate = {
      "2026-03-09": [
        {
          id: 10,
          date: "2026-03-09",
          name: "è·‘æ­¥ ØªØ¯Ø±ÙŠØ¨",
          durationMinutes: 90,
          paceTarget: "5:10/km",
          notes: "x".repeat(500)
        }
      ]
    };

    const onAdd = vi.fn();
    const onEdit = vi.fn();
    const onDelete = vi.fn();

    render(
      <WeekGrid
        days={days}
        workoutsByDate={workoutsByDate}
        onAdd={onAdd}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    );

    expect(screen.getByText("è·‘æ­¥ ØªØ¯Ø±ÙŠØ¨")).toBeInTheDocument();
    expect(screen.getByText(/90 min/)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /\+ Lisaa treeni/i }));
    fireEvent.click(screen.getByRole("button", { name: "Muokkaa" }));
    fireEvent.click(screen.getByRole("button", { name: "Poista" }));

    expect(onAdd).toHaveBeenCalledWith("2026-03-09");
    expect(onEdit).toHaveBeenCalledWith(workoutsByDate["2026-03-09"][0]);
    expect(onDelete).toHaveBeenCalledWith(10);
  });
});
