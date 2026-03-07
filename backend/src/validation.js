function isIsoDate(value) {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function isValidDuration(value) {
  return Number.isInteger(value) && value >= 1 && value <= 1440;
}

export function validateWorkoutInput(input) {
  const errors = [];

  if (!isIsoDate(input.date)) {
    errors.push("date must be in YYYY-MM-DD format");
  }

  if (typeof input.name !== "string" || input.name.trim().length < 2 || input.name.trim().length > 120) {
    errors.push("name must be 2-120 characters");
  }

  if (!isValidDuration(input.durationMinutes)) {
    errors.push("durationMinutes must be an integer between 1 and 1440");
  }

  if (typeof input.paceTarget !== "string" || input.paceTarget.trim().length < 1 || input.paceTarget.trim().length > 60) {
    errors.push("paceTarget must be 1-60 characters");
  }

  if (typeof input.notes !== "string" || input.notes.length > 3000) {
    errors.push("notes must be a string with max 3000 characters");
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

export function normalizeWorkoutInput(input) {
  return {
    date: String(input.date),
    name: String(input.name).trim(),
    durationMinutes: Number(input.durationMinutes),
    paceTarget: String(input.paceTarget).trim(),
    notes: typeof input.notes === "string" ? input.notes.trim() : ""
  };
}
