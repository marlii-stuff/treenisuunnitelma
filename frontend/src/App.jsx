import React, { useEffect, useMemo, useState } from "react";
import { createWorkout, getHistory, getWorkouts, removeWorkout, updateWorkout } from "./api";
import { formatDateRange, getWeekDays, getWeekStart } from "./dateUtils";
import WeekNavigator from "./components/WeekNavigator";
import WeekGrid from "./components/WeekGrid";
import WorkoutModal from "./components/WorkoutModal";
import HistoryPanel from "./components/HistoryPanel";

function groupByDate(workouts) {
  return workouts.reduce((acc, workout) => {
    acc[workout.date] ??= [];
    acc[workout.date].push(workout);
    return acc;
  }, {});
}

export default function App() {
  const [weekStart, setWeekStart] = useState(getWeekStart(new Date()));
  const [workouts, setWorkouts] = useState([]);
  const [history, setHistory] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState(null);
  const [error, setError] = useState("");

  const days = useMemo(() => getWeekDays(weekStart), [weekStart]);
  const rangeLabel = useMemo(() => formatDateRange(weekStart), [weekStart]);
  const workoutsByDate = useMemo(() => groupByDate(workouts), [workouts]);

  async function loadWeek() {
    setError("");
    try {
      const weekEnd = days[days.length - 1].iso;
      const result = await getWorkouts(days[0].iso, weekEnd);
      setWorkouts(result.workouts);
    } catch (loadError) {
      setError(loadError.message);
    }
  }

  async function loadHistory() {
    try {
      const result = await getHistory(40);
      setHistory(result.history);
    } catch (historyError) {
      setError(historyError.message);
    }
  }

  useEffect(() => {
    loadWeek();
    loadHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weekStart]);

  const openCreateModal = (date) => {
    setEditingWorkout({ date, name: "", durationMinutes: 45, paceTarget: "", notes: "" });
    setIsModalOpen(true);
  };

  const openEditModal = (workout) => {
    setEditingWorkout(workout);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setEditingWorkout(null);
    setIsModalOpen(false);
  };

  const saveWorkout = async (form) => {
    try {
      if (editingWorkout?.id) {
        await updateWorkout(editingWorkout.id, form);
      } else {
        await createWorkout(form);
      }
      closeModal();
      await Promise.all([loadWeek(), loadHistory()]);
    } catch (saveError) {
      setError(saveError.message);
    }
  };

  const deleteWorkout = async (id) => {
    try {
      await removeWorkout(id);
      await Promise.all([loadWeek(), loadHistory()]);
    } catch (deleteError) {
      setError(deleteError.message);
    }
  };

  return (
    <main className="app-shell">
      <header className="hero">
        <h1>Treenisuunnitelma</h1>
        <p>Suunnittele viikkosi harjoitukset ja seuraa historiaa.</p>
      </header>

      <WeekNavigator
        rangeLabel={rangeLabel}
        onPrevWeek={() => setWeekStart((d) => new Date(d.getFullYear(), d.getMonth(), d.getDate() - 7))}
        onNextWeek={() => setWeekStart((d) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + 7))}
        onCurrentWeek={() => setWeekStart(getWeekStart(new Date()))}
      />

      {error ? <p className="error">Virhe: {error}</p> : null}

      <section className="content">
        <WeekGrid days={days} workoutsByDate={workoutsByDate} onAdd={openCreateModal} onEdit={openEditModal} onDelete={deleteWorkout} />
        <HistoryPanel items={history} />
      </section>

      <WorkoutModal
        isOpen={isModalOpen}
        initialValue={editingWorkout}
        onClose={closeModal}
        onSubmit={saveWorkout}
      />
    </main>
  );
}
