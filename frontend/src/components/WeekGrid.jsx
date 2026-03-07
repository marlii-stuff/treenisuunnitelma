import React from "react";
function WorkoutItem({ workout, onEdit, onDelete }) {
  return (
    <li className="workout-item">
      <div>
        <strong>{workout.name}</strong>
        <p>{workout.durationMinutes} min | tavoite: {workout.paceTarget}</p>
        {workout.notes ? <small>{workout.notes}</small> : null}
      </div>
      <div className="actions">
        <button type="button" onClick={() => onEdit(workout)}>Muokkaa</button>
        <button type="button" className="danger" onClick={() => onDelete(workout.id)}>Poista</button>
      </div>
    </li>
  );
}

export default function WeekGrid({ days, workoutsByDate, onAdd, onEdit, onDelete }) {
  return (
    <div className="week-grid">
      {days.map((day) => (
        <section key={day.iso} className="day-card">
          <header>
            <h3>{day.label}</h3>
            <span>{day.iso}</span>
          </header>

          <button type="button" className="add-button" onClick={() => onAdd(day.iso)}>
            + Lisaa treeni
          </button>

          <ul>
            {(workoutsByDate[day.iso] || []).map((workout) => (
              <WorkoutItem
                key={workout.id}
                workout={workout}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
