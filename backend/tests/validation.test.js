import test from "node:test";
import assert from "node:assert/strict";
import { normalizeWorkoutInput, validateWorkoutInput } from "../src/validation.js";

function validBase(overrides = {}) {
  return normalizeWorkoutInput({
    date: "2026-03-09",
    name: "Easy Run",
    durationMinutes: 45,
    paceTarget: "5:30/km",
    notes: "Base notes",
    ...overrides
  });
}

test("accepts multilingual names and notes (Chinese + Arabic)", () => {
  const input = validBase({
    name: "跑步 تدريب",
    notes: "今天状态不错 | اليوم كان جيداً"
  });

  const result = validateWorkoutInput(input);
  assert.equal(result.isValid, true);
  assert.deepEqual(result.errors, []);
});

test("accepts boundary lengths and rejects too long name/pace/notes", () => {
  const maxName = "N".repeat(120);
  const tooLongName = "N".repeat(121);
  const maxPace = "P".repeat(60);
  const tooLongPace = "P".repeat(61);
  const maxNotes = "x".repeat(3000);
  const tooLongNotes = "x".repeat(3001);

  assert.equal(validateWorkoutInput(validBase({ name: maxName })).isValid, true);
  assert.equal(validateWorkoutInput(validBase({ paceTarget: maxPace })).isValid, true);
  assert.equal(validateWorkoutInput(validBase({ notes: maxNotes })).isValid, true);

  assert.equal(validateWorkoutInput(validBase({ name: tooLongName })).isValid, false);
  assert.equal(validateWorkoutInput(validBase({ paceTarget: tooLongPace })).isValid, false);
  assert.equal(validateWorkoutInput(validBase({ notes: tooLongNotes })).isValid, false);
});

test("rejects decimal, NaN, Infinity and negative infinity durations", () => {
  const decimal = validateWorkoutInput(validBase({ durationMinutes: 12.5 }));
  const nanValue = validateWorkoutInput(validBase({ durationMinutes: Number.NaN }));
  const inf = validateWorkoutInput(validBase({ durationMinutes: Number.POSITIVE_INFINITY }));
  const negInf = validateWorkoutInput(validBase({ durationMinutes: Number.NEGATIVE_INFINITY }));

  assert.equal(decimal.isValid, false);
  assert.equal(nanValue.isValid, false);
  assert.equal(inf.isValid, false);
  assert.equal(negInf.isValid, false);
});

test("rejects invalid date formats and accepts ISO date", () => {
  assert.equal(validateWorkoutInput(validBase({ date: "2026-12-31" })).isValid, true);
  assert.equal(validateWorkoutInput(validBase({ date: "31-12-2026" })).isValid, false);
  assert.equal(validateWorkoutInput(validBase({ date: "2026/12/31" })).isValid, false);
  assert.equal(validateWorkoutInput(validBase({ date: "" })).isValid, false);
});

test("rejects zero and negative duration and accepts min/max valid integer durations", () => {
  assert.equal(validateWorkoutInput(validBase({ durationMinutes: 1 })).isValid, true);
  assert.equal(validateWorkoutInput(validBase({ durationMinutes: 1440 })).isValid, true);
  assert.equal(validateWorkoutInput(validBase({ durationMinutes: 0 })).isValid, false);
  assert.equal(validateWorkoutInput(validBase({ durationMinutes: -10 })).isValid, false);
  assert.equal(validateWorkoutInput(validBase({ durationMinutes: 1441 })).isValid, false);
});

test("normalization trims strings and coerces numeric input", () => {
  const normalized = normalizeWorkoutInput({
    date: "2026-03-10",
    name: "  Interval  ",
    durationMinutes: "60",
    paceTarget: " 4:30/km ",
    notes: "  strong session  "
  });

  assert.deepEqual(normalized, {
    date: "2026-03-10",
    name: "Interval",
    durationMinutes: 60,
    paceTarget: "4:30/km",
    notes: "strong session"
  });
});
