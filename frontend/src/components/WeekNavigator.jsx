import React from "react";
export default function WeekNavigator({ rangeLabel, onPrevWeek, onNextWeek, onCurrentWeek }) {
  return (
    <div className="week-nav">
      <button type="button" onClick={onPrevWeek}>Edellinen</button>
      <p>{rangeLabel}</p>
      <div className="week-nav-right">
        <button type="button" onClick={onCurrentWeek}>Tama viikko</button>
        <button type="button" onClick={onNextWeek}>Seuraava</button>
      </div>
    </div>
  );
}
