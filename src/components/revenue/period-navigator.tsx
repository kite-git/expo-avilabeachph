import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { IconButton } from '@/components/ui/icon-button';
import { FontFamily, Spacing } from '@/constants/theme';
import { formatRange, getRange, Period, shiftAnchor } from '@/utils/period';

type PeriodNavigatorProps = {
  period: Period;
  anchor: Date;
  onChange: (anchor: Date) => void;
};

/** "‹ October 2026 ›" — steps one period back or forward, never past today. */
export function PeriodNavigator({ period, anchor, onChange }: PeriodNavigatorProps) {
  const canGoNext = getRange(period, anchor).end <= new Date();

  return (
    <View style={styles.row}>
      <IconButton
        icon={{ ios: 'chevron.left', android: 'chevron_left', web: 'chevron_left' }}
        accessibilityLabel={`Previous ${period}`}
        onPress={() => onChange(shiftAnchor(period, anchor, -1))}
        size={40}
      />
      <ThemedText style={styles.label} accessibilityLiveRegion="polite">
        {formatRange(period, anchor)}
      </ThemedText>
      <IconButton
        icon={{ ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' }}
        accessibilityLabel={`Next ${period}`}
        onPress={() => onChange(shiftAnchor(period, anchor, 1))}
        disabled={!canGoNext}
        size={40}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  label: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
    fontFamily: FontFamily.bold,
  },
});
