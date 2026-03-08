import test from "node:test";
import assert from "node:assert/strict";
import { createDb } from "../src/db.js";
import {
  createWorkout,
  deleteWorkout,
  getWorkoutById,
  listHistory,
  listWorkoutsByDateRange,
  updateWorkout
} from "../src/workoutRepository.js";

function makeWorkout(overrides = {}) {
  return {
    date: "2026-03-10",
    name: "Tempo",
    durationMinutes: 50,
    paceTarget: "4:45/km",
    notes: "steady",
    ...overrides
  };
}

test("repository supports create/read/update/delete with history logging", () => {
  const db = createDb(":memory:");

  const created = createWorkout(db, makeWorkout({ name: "跑步 تدريب", notes: "x".repeat(2000) }));
  assert.equal(created.name, "跑步 تدريب");

  const byId = getWorkoutById(db, created.id);
  assert.equal(byId.id, created.id);

  const weekRows = listWorkoutsByDateRange(db, "2026-03-09", "2026-03-15");
  assert.equal(weekRows.length, 1);

  const updated = updateWorkout(db, created.id, makeWorkout({
    date: "2026-03-11",
    durationMinutes: 60,
    paceTarget: "4:30/km",
    notes: "updated"
  }));
  assert.equal(updated.durationMinutes, 60);
  assert.equal(updated.date, "2026-03-11");

  const deleted = deleteWorkout(db, created.id);
  assert.equal(deleted, true);
  assert.equal(getWorkoutById(db, created.id), undefined);

  const history = listHistory(db, 10);
  assert.equal(history.length, 3);
  assert.deepEqual(history.map((entry) => entry.action).sort(), ["create", "delete", "update"]);
});

test("repository handles missing rows safely for update/delete", () => {
  const db = createDb(":memory:");

  const updateResult = updateWorkout(db, 999999, makeWorkout());
  const deleteResult = deleteWorkout(db, 999999);

  assert.equal(updateResult, null);
  assert.equal(deleteResult, false);
});

test("listHistory obeys limit and preserves payload structure", () => {
  const db = createDb(":memory:");
  const workoutA = createWorkout(db, makeWorkout({ date: "2026-03-10", name: "A" }));
  createWorkout(db, makeWorkout({ date: "2026-03-11", name: "B" }));
  updateWorkout(db, workoutA.id, makeWorkout({ date: "2026-03-12", name: "A2" }));

  const history = listHistory(db, 2);
  assert.equal(history.length, 2);
  assert.equal(typeof history[0].payload, "object");
  assert.equal(typeof history[1].payload, "object");
});
