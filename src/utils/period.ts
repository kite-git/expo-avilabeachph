import { addDays, startOfDay, startOfWeek } from '@/utils/date';

export type Period = 'day' | 'week' | 'month' | 'year';

export const Periods: { value: Period; label: string }[] = [
  { value: 'day', label: 'Day' },
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
  { value: 'year', label: 'Year' },
];

/** Half-open date range: `start` inclusive, `end` exclusive. */
export type DateRange = { start: Date; end: Date };

export type Bucket = DateRange & { label: string; longLabel: string };

const PREVIOUS_LABEL: Record<Period, string> = {
  day: 'yesterday',
  week: 'last week',
  month: 'last month',
  year: 'last year',
};

/** Wording for comparisons, relative to the period being viewed: "vs last week". */
export function previousLabel(period: Period) {
  return PREVIOUS_LABEL[period];
}

export function getRange(period: Period, anchor: Date): DateRange {
  const y = anchor.getFullYear();
  const m = anchor.getMonth();
  switch (period) {
    case 'day': {
      const start = startOfDay(anchor);
      return { start, end: addDays(start, 1) };
    }
    case 'week': {
      const start = startOfWeek(anchor);
      return { start, end: addDays(start, 7) };
    }
    case 'month':
      return { start: new Date(y, m, 1), end: new Date(y, m + 1, 1) };
    case 'year':
      return { start: new Date(y, 0, 1), end: new Date(y + 1, 0, 1) };
  }
}

/** Moves the anchor `steps` periods forward (or back when negative). */
export function shiftAnchor(period: Period, anchor: Date, steps: number) {
  switch (period) {
    case 'day':
      return addDays(anchor, steps);
    case 'week':
      return addDays(anchor, steps * 7);
    case 'month':
      return new Date(anchor.getFullYear(), anchor.getMonth() + steps, 1);
    case 'year':
      return new Date(anchor.getFullYear() + steps, 0, 1);
  }
}

const dayLabel = new Intl.DateTimeFormat('en-PH', {
  weekday: 'short',
  month: 'short',
  day: 'numeric',
  year: 'numeric',
});
const shortDay = new Intl.DateTimeFormat('en-PH', { month: 'short', day: 'numeric' });
const monthLabel = new Intl.DateTimeFormat('en-PH', { month: 'long', year: 'numeric' });
const shortMonth = new Intl.DateTimeFormat('en-PH', { month: 'short' });
const weekdayLetter = new Intl.DateTimeFormat('en-PH', { weekday: 'short' });

/** e.g. "Sat, Oct 10, 2026", "Oct 5 – Oct 11, 2026", "October 2026", "2026" */
export function formatRange(period: Period, anchor: Date) {
  const { start, end } = getRange(period, anchor);
  switch (period) {
    case 'day':
      return dayLabel.format(start);
    case 'week':
      return `${shortDay.format(start)} – ${shortDay.format(addDays(end, -1))}, ${addDays(end, -1).getFullYear()}`;
    case 'month':
      return monthLabel.format(start);
    case 'year':
      return String(start.getFullYear());
  }
}

/**
 * Chart columns for a period:
 * day → the 7 days ending on that day, week → its 7 days,
 * month → its calendar weeks, year → its 12 months.
 */
export function getBuckets(period: Period, anchor: Date): Bucket[] {
  const { start, end } = getRange(period, anchor);

  if (period === 'day' || period === 'week') {
    const first = period === 'day' ? addDays(start, -6) : start;
    return Array.from({ length: 7 }, (_, i) => {
      const day = addDays(first, i);
      return {
        start: day,
        end: addDays(day, 1),
        label: weekdayLetter.format(day).slice(0, 2),
        longLabel: dayLabel.format(day),
      };
    });
  }

  if (period === 'month') {
    const buckets: Bucket[] = [];
    let cursor = start;
    while (cursor < end) {
      const weekEnd = addDays(startOfWeek(cursor), 7);
      const bucketEnd = weekEnd < end ? weekEnd : end;
      const lastDay = addDays(bucketEnd, -1);
      buckets.push({
        start: cursor,
        end: bucketEnd,
        label:
          cursor.getDate() === lastDay.getDate()
            ? String(cursor.getDate())
            : `${cursor.getDate()}–${lastDay.getDate()}`,
        longLabel: `${shortDay.format(cursor)} – ${shortDay.format(lastDay)}`,
      });
      cursor = bucketEnd;
    }
    return buckets;
  }

  return Array.from({ length: 12 }, (_, month) => {
    const monthStart = new Date(start.getFullYear(), month, 1);
    return {
      start: monthStart,
      end: new Date(start.getFullYear(), month + 1, 1),
      label: shortMonth.format(monthStart).slice(0, 3),
      longLabel: monthLabel.format(monthStart),
    };
  });
}

export function isInRange(date: Date, range: DateRange) {
  return date >= range.start && date < range.end;
}
