const entryDateFormatter = new Intl.DateTimeFormat('en-PH', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
});

const longDateFormatter = new Intl.DateTimeFormat('en-PH', {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
});

const monthFormatter = new Intl.DateTimeFormat('en-PH', { month: 'long', year: 'numeric' });

/** e.g. "Oct 10, 2026" */
export function formatEntryDate(date: Date) {
  return entryDateFormatter.format(date);
}

/** e.g. "Saturday, October 10" */
export function formatLongDate(date: Date) {
  return longDateFormatter.format(date);
}

/** e.g. "October 2026" */
export function formatMonth(date: Date) {
  return monthFormatter.format(date);
}

export function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function addDays(date: Date, days: number) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
}

/** Monday of the week containing `date`. */
export function startOfWeek(date: Date) {
  const day = startOfDay(date);
  const offsetFromMonday = (day.getDay() + 6) % 7;
  return addDays(day, -offsetFromMonday);
}

export function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}
