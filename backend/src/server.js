import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import cors from "cors";
import { createDb } from "./db.js";
import {
  createWorkout,
  deleteWorkout,
  listHistory,
  listWorkoutsByDateRange,
  updateWorkout
} from "./workoutRepository.js";
import { normalizeWorkoutInput, validateWorkoutInput } from "./validation.js";

const app = express();
const PORT = process.env.PORT || 4000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.resolve(__dirname, "..", "data");
fs.mkdirSync(dataDir, { recursive: true });

const db = createDb();

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.get("/api/workouts", (req, res) => {
  const { weekStart, weekEnd } = req.query;

  if (!weekStart || !weekEnd) {
    return res.status(400).json({ error: "weekStart and weekEnd are required query parameters" });
  }

  const workouts = listWorkoutsByDateRange(db, String(weekStart), String(weekEnd));
  return res.json({ workouts });
});

app.post("/api/workouts", (req, res) => {
  const normalized = normalizeWorkoutInput(req.body);
  const validation = validateWorkoutInput(normalized);

  if (!validation.isValid) {
    return res.status(400).json({ error: "Validation failed", details: validation.errors });
  }

  const created = createWorkout(db, normalized);
  return res.status(201).json({ workout: created });
});

app.put("/api/workouts/:id", (req, res) => {
  const normalized = normalizeWorkoutInput(req.body);
  const validation = validateWorkoutInput(normalized);

  if (!validation.isValid) {
    return res.status(400).json({ error: "Validation failed", details: validation.errors });
  }

  const updated = updateWorkout(db, Number(req.params.id), normalized);
  if (!updated) {
    return res.status(404).json({ error: "Workout not found" });
  }

  return res.json({ workout: updated });
});

app.delete("/api/workouts/:id", (req, res) => {
  const wasDeleted = deleteWorkout(db, Number(req.params.id));
  if (!wasDeleted) {
    return res.status(404).json({ error: "Workout not found" });
  }

  return res.status(204).send();
});

app.get("/api/history", (req, res) => {
  const limit = Number(req.query.limit || 100);
  const history = listHistory(db, Number.isNaN(limit) ? 100 : limit);
  return res.json({ history });
});

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`);
});
