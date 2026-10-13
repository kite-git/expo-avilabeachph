import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconButton } from '@/components/ui/icon-button';
import { FontFamily, Radius, Shadow, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { addDays, formatMonth, isSameDay, startOfDay, startOfWeek } from '@/utils/date';

const WEEKDAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

type WeekCalendarProps = {
  value: Date;
  onChange: (date: Date) => void;
};

/** One week at a time with prev/next arrows. Future days are disabled. */
export function WeekCalendar({ value, onChange }: WeekCalendarProps) {
  const theme = useTheme();
  const today = startOfDay(new Date());
  const [weekStart, setWeekStart] = useState(() => startOfWeek(value));

  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  // Label the week by its Thursday so a week spanning two months reads naturally.
  const labelDay = days[3];
  const canGoNext = addDays(weekStart, 7) <= today;

  return (
    <ThemedView type="backgroundElement" style={styles.card}>
      <View style={styles.header}>
        <IconButton
          icon={{ ios: 'chevron.left', android: 'chevron_left', web: 'chevron_left' }}
          accessibilityLabel="Previous week"
          onPress={() => setWeekStart(addDays(weekStart, -7))}
          size={36}
        />
        <ThemedText style={styles.month}>{formatMonth(labelDay)}</ThemedText>
        <IconButton
          icon={{ ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' }}
          accessibilityLabel="Next week"
          onPress={() => setWeekStart(addDays(weekStart, 7))}
          disabled={!canGoNext}
          size={36}
        />
      </View>

      <View style={styles.row}>
        {WEEKDAYS.map((label) => (
          <ThemedText key={label} type="smallBold" style={styles.cell}>
            {label}
          </ThemedText>
        ))}
      </View>

      <View style={styles.row}>
        {days.map((day) => {
          const selected = isSameDay(day, value);
          const isFuture = day > today;
          const otherMonth = day.getMonth() !== labelDay.getMonth();
          const color = selected
            ? theme.onPrimary
            : isFuture || otherMonth
              ? theme.textMuted
              : theme.text;

          return (
            <Pressable
              key={day.toISOString()}
              onPress={() => onChange(day)}
              disabled={isFuture}
              accessibilityRole="button"
              accessibilityLabel={day.toDateString()}
              accessibilityState={{ selected, disabled: isFuture }}
              style={[
                styles.cell,
                styles.day,
                selected && [styles.daySelected, { backgroundColor: theme.primary }],
              ]}>
              <ThemedText style={[styles.dayLabel, { color }]}>{day.getDate()}</ThemedText>
              {isSameDay(day, today) ? (
                <View style={[styles.todayDot, { backgroundColor: theme.accent }]} />
              ) : null}
            </Pressable>
          );
        })}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: Spacing.three,
    borderRadius: Radius.card,
    gap: Spacing.two,
    boxShadow: Shadow.card,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.one,
  },
  month: {
    fontFamily: FontFamily.bold,
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    flex: 1,
    textAlign: 'center',
  },
  day: {
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.field,
  },
  daySelected: {
    boxShadow: Shadow.raised,
  },
  dayLabel: {
    fontFamily: FontFamily.semibold,
  },
  todayDot: {
    position: 'absolute',
    bottom: 6,
    width: 5,
    height: 5,
    borderRadius: 3,
  },
});
