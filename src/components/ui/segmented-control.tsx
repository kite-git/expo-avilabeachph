import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { FontFamily, Radius, Shadow, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type SegmentedControlProps<T extends string> = {
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
};

/** Row of pills inside a white track; the selected pill is filled brown. */
export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
}: SegmentedControlProps<T>) {
  const theme = useTheme();

  return (
    <View
      accessibilityRole="tablist"
      style={[styles.track, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <Pressable
            key={option.value}
            onPress={() => onChange(option.value)}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            style={({ pressed }) => [
              styles.segment,
              selected && { backgroundColor: theme.primary, boxShadow: Shadow.raised },
              pressed && !selected && styles.pressed,
            ]}>
            <ThemedText
              style={[styles.label, { color: selected ? theme.onPrimary : theme.textSecondary }]}>
              {option.label}
            </ThemedText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: 'row',
    padding: Spacing.one,
    borderRadius: Radius.pill,
    borderWidth: 1,
    boxShadow: Shadow.card,
  },
  segment: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.two + Spacing.half,
    borderRadius: Radius.pill,
  },
  label: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: FontFamily.semibold,
  },
  pressed: {
    opacity: 0.6,
  },
});
