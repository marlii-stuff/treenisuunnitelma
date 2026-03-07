function nowIso() {
  return new Date().toISOString();
}

function writeHistory(db, workoutId, action, payload) {
  db.prepare(
    `INSERT INTO workout_history (workout_id, action, payload, changed_at)
     VALUES (?, ?, ?, ?)`
  ).run(workoutId ?? null, action, JSON.stringify(payload), nowIso());
}

export function listWorkoutsByDateRange(db, startDate, endDate) {
  return db
    .prepare(
      `SELECT id, date, name, duration_minutes AS durationMinutes,
              pace_target AS paceTarget, notes, created_at AS createdAt,
              updated_at AS updatedAt
       FROM workouts
       WHERE date BETWEEN ? AND ?
       ORDER BY date ASC, updated_at DESC`
    )
    .all(startDate, endDate);
}

export function createWorkout(db, input) {
  const timestamp = nowIso();
  const result = db
    .prepare(
      `INSERT INTO workouts (date, name, duration_minutes, pace_target, notes, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
      input.date,
      input.name,
      input.durationMinutes,
      input.paceTarget,
      input.notes,
      timestamp,
      timestamp
    );

  const created = getWorkoutById(db, Number(result.lastInsertRowid));
  writeHistory(db, created.id, "create", created);
  return created;
}

export function getWorkoutById(db, id) {
  return db
    .prepare(
      `SELECT id, date, name, duration_minutes AS durationMinutes,
              pace_target AS paceTarget, notes, created_at AS createdAt,
              updated_at AS updatedAt
       FROM workouts
       WHERE id = ?`
    )
    .get(id);
}

export function updateWorkout(db, id, input) {
  const existing = getWorkoutById(db, id);
  if (!existing) {
    return null;
  }

  db.prepare(
    `UPDATE workouts
     SET date = ?, name = ?, duration_minutes = ?, pace_target = ?, notes = ?, updated_at = ?
     WHERE id = ?`
  ).run(
    input.date,
    input.name,
    input.durationMinutes,
    input.paceTarget,
    input.notes,
    nowIso(),
    id
  );

  const updated = getWorkoutById(db, id);
  writeHistory(db, id, "update", { before: existing, after: updated });
  return updated;
}

export function deleteWorkout(db, id) {
  const existing = getWorkoutById(db, id);
  if (!existing) {
    return false;
  }

  db.prepare("DELETE FROM workouts WHERE id = ?").run(id);
  writeHistory(db, id, "delete", existing);
  return true;
}

export function listHistory(db, limit = 100) {
  const rows = db
    .prepare(
      `SELECT id, workout_id AS workoutId, action, payload, changed_at AS changedAt
       FROM workout_history
       ORDER BY changed_at DESC
       LIMIT ?`
    )
    .all(limit);

  return rows.map((row) => ({
    ...row,
    payload: JSON.parse(row.payload)
  }));
}
