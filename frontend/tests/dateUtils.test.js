import { describe, expect, it } from "vitest";
import { formatDateRange, getWeekDays, getWeekStart, toIsoDate } from "../src/dateUtils";

describe("dateUtils", () => {
  it("toIsoDate returns YYYY-MM-DD", () => {
    const date = new Date("2026-03-08T12:00:00Z");
    expect(toIsoDate(date)).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it("getWeekStart resolves Monday for Sunday input", () => {
    const sunday = new Date("2026-03-08T12:00:00Z");
    const start = getWeekStart(sunday);
    expect(start.getDay()).toBe(1);
  });

  it("getWeekDays returns seven consecutive days", () => {
    const monday = new Date("2026-03-09T00:00:00");
    const days = getWeekDays(monday);
    expect(days).toHaveLength(7);
    expect(days[0].label).toBe("maanantai");
    expect(days[6].label).toBe("sunnuntai");
    expect(days[0].iso).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(days[6].iso).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it("formatDateRange returns formatted range string", () => {
    const monday = new Date("2026-03-09T00:00:00");
    const range = formatDateRange(monday);
    expect(typeof range).toBe("string");
    expect(range).toMatch(/\d{2}\.\d{2}\.\d{4} - \d{2}\.\d{2}\.\d{4}/);
  });
});
