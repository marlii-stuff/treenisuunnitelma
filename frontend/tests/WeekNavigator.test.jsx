import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import WeekNavigator from "../src/components/WeekNavigator";

describe("WeekNavigator", () => {
  it("renders range label and triggers callbacks", () => {
    const onPrevWeek = vi.fn();
    const onNextWeek = vi.fn();
    const onCurrentWeek = vi.fn();

    render(
      <WeekNavigator
        rangeLabel="03.03.2026 - 09.03.2026"
        onPrevWeek={onPrevWeek}
        onNextWeek={onNextWeek}
        onCurrentWeek={onCurrentWeek}
      />
    );

    expect(screen.getByText("03.03.2026 - 09.03.2026")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Edellinen" }));
    fireEvent.click(screen.getByRole("button", { name: "Tama viikko" }));
    fireEvent.click(screen.getByRole("button", { name: "Seuraava" }));

    expect(onPrevWeek).toHaveBeenCalledTimes(1);
    expect(onCurrentWeek).toHaveBeenCalledTimes(1);
    expect(onNextWeek).toHaveBeenCalledTimes(1);
  });
});
