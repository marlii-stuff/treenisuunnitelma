const WEEKDAY_FI = ["maanantai", "tiistai", "keskiviikko", "torstai", "perjantai", "lauantai", "sunnuntai"];

export function toIsoDate(date) {
  return date.toISOString().slice(0, 10);
}

export function getWeekStart(date = new Date()) {
  const copy = new Date(date);
  const day = copy.getDay();
  const delta = day === 0 ? -6 : 1 - day;
  copy.setDate(copy.getDate() + delta);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

export function getWeekDays(weekStart) {
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + index);
    return {
      label: WEEKDAY_FI[index],
      iso: toIsoDate(date)
    };
  });
}

export function formatDateRange(weekStart) {
  const end = new Date(weekStart);
  end.setDate(weekStart.getDate() + 6);

  const fmt = new Intl.DateTimeFormat("fi-FI", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });

  return `${fmt.format(weekStart)} - ${fmt.format(end)}`;
}
