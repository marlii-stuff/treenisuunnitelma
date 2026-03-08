import test from "node:test";
import assert from "node:assert/strict";
import { formatDateRange, getWeekDays, getWeekStart, toIsoDate } from "../src/dateUtils.js";

test("toIsoDate returns YYYY-MM-DD", () => {
  const date = new Date("2026-03-08T12:00:00Z");
  assert.match(toIsoDate(date), /^\d{4}-\d{2}-\d{2}$/);
});

test("getWeekStart resolves Monday for Sunday input", () => {
  const sunday = new Date("2026-03-08T12:00:00Z");
  const start = getWeekStart(sunday);
  assert.equal(start.getDay(), 1);
});

test("getWeekDays returns seven consecutive days", () => {
  const monday = new Date("2026-03-09T00:00:00");
  const days = getWeekDays(monday);
  assert.equal(days.length, 7);
  assert.equal(days[0].label, "maanantai");
  assert.equal(days[6].label, "sunnuntai");
  assert.match(days[0].iso, /^\d{4}-\d{2}-\d{2}$/);
  assert.match(days[6].iso, /^\d{4}-\d{2}-\d{2}$/);
});

test("formatDateRange returns formatted range string", () => {
  const monday = new Date("2026-03-09T00:00:00");
  const range = formatDateRange(monday);
  assert.equal(typeof range, "string");
  assert.match(range, /\d{2}\.\d{2}\.\d{4} - \d{2}\.\d{2}\.\d{4}/);
});
