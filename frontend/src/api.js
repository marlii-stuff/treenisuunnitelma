const API_BASE = "http://localhost:4000/api";

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error || "API request failed");
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export function getWorkouts(weekStart, weekEnd) {
  return request(`/workouts?weekStart=${weekStart}&weekEnd=${weekEnd}`);
}

export function createWorkout(payload) {
  return request("/workouts", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function updateWorkout(id, payload) {
  return request(`/workouts/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload)
  });
}

export function removeWorkout(id) {
  return request(`/workouts/${id}`, {
    method: "DELETE"
  });
}

export function getHistory(limit = 30) {
  return request(`/history?limit=${limit}`);
}
