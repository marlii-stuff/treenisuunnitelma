import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import HistoryPanel from "../src/components/HistoryPanel";

describe("HistoryPanel", () => {
  it("renders actions and payload names with deleted fallback", () => {
    const items = [
      {
        id: 1,
        action: "create",
        changedAt: "2026-03-09T10:00:00.000Z",
        payload: { name: "è·‘æ­¥ ØªØ¯Ø±ÙŠØ¨" }
      },
      {
        id: 2,
        action: "delete",
        changedAt: "2026-03-10T10:00:00.000Z",
        payload: {}
      }
    ];

    render(<HistoryPanel items={items} />);

    expect(screen.getByText("Treenihistoria")).toBeInTheDocument();
    expect(screen.getByText("è·‘æ­¥ ØªØ¯Ø±ÙŠØ¨")).toBeInTheDocument();
    expect(screen.getByText("(poistettu treeni)")).toBeInTheDocument();
    expect(screen.getByText("create")).toBeInTheDocument();
    expect(screen.getByText("delete")).toBeInTheDocument();
  });
});
