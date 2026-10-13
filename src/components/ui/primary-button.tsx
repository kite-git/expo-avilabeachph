import { Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { FontFamily, Radius, Shadow } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type PrimaryButtonProps = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
};

export function PrimaryButton({ label, onPress, disabled }: PrimaryButtonProps) {
  const theme = useTheme();

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: theme.primary },
        disabled ? styles.disabled : styles.raised,
        pressed && styles.pressed,
      ]}>
      <ThemedText style={[styles.label, { color: theme.onPrimary }]}>{label}</ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.tile,
  },
  raised: {
    boxShadow: Shadow.raised,
  },
  label: {
    fontSize: 16,
    fontFamily: FontFamily.bold,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  disabled: {
    opacity: 0.35,
  },
  pressed: {
    opacity: 0.8,
  },
});
