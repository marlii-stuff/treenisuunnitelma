import test from "node:test";
import assert from "node:assert/strict";
import { normalizeWorkoutInput, validateWorkoutInput } from "../src/validation.js";

test("valid workout supports Chinese and Arabic text", () => {
  const input = normalizeWorkoutInput({
    date: "2026-03-09",
    name: "跑步 تدريب",
    durationMinutes: 45,
    paceTarget: "5:30/km",
    notes: "今天状态不错 | اليوم كان جيداً"
  });

  const result = validateWorkoutInput(input);
  assert.equal(result.isValid, true);
  assert.deepEqual(result.errors, []);
});

test("rejects decimal duration", () => {
  const input = normalizeWorkoutInput({
    date: "2026-03-09",
    name: "Tempo",
    durationMinutes: 12.5,
    paceTarget: "4:50/km",
    notes: "decimal should fail"
  });

  const result = validateWorkoutInput(input);
  assert.equal(result.isValid, false);
  assert.match(result.errors.join(" "), /durationMinutes/);
});

test("rejects negative and zero durations", () => {
  const negative = validateWorkoutInput(
    normalizeWorkoutInput({
      date: "2026-03-10",
      name: "Negative",
      durationMinutes: -10,
      paceTarget: "easy",
      notes: ""
    })
  );
  const zero = validateWorkoutInput(
    normalizeWorkoutInput({
      date: "2026-03-10",
      name: "Zero",
      durationMinutes: 0,
      paceTarget: "easy",
      notes: ""
    })
  );

  assert.equal(negative.isValid, false);
  assert.equal(zero.isValid, false);
});

test("accepts very small and very large valid integer durations", () => {
  const small = validateWorkoutInput(
    normalizeWorkoutInput({
      date: "2026-03-11",
      name: "Small",
      durationMinutes: 1,
      paceTarget: "walk",
      notes: ""
    })
  );

  const large = validateWorkoutInput(
    normalizeWorkoutInput({
      date: "2026-03-11",
      name: "Large",
      durationMinutes: 1440,
      paceTarget: "ultra",
      notes: ""
    })
  );

  assert.equal(small.isValid, true);
  assert.equal(large.isValid, true);
});

test("rejects too large duration", () => {
  const result = validateWorkoutInput(
    normalizeWorkoutInput({
      date: "2026-03-12",
      name: "Too long",
      durationMinutes: 1441,
      paceTarget: "slow",
      notes: ""
    })
  );

  assert.equal(result.isValid, false);
});
