import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet } from 'react-native';

import { SymbolName } from '@/constants/ledger';
import { Shadow } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type IconButtonProps = {
  icon: SymbolName;
  accessibilityLabel: string;
  onPress?: () => void;
  disabled?: boolean;
  size?: number;
};

/** Round white button with a hairline border, as used in headers and the calendar. */
export function IconButton({
  icon,
  accessibilityLabel,
  onPress,
  disabled,
  size = 40,
}: IconButtonProps) {
  const theme = useTheme();

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled }}
      hitSlop={6}
      style={({ pressed }) => [
        styles.button,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: theme.backgroundElement,
          borderColor: theme.border,
        },
        disabled && styles.disabled,
        pressed && styles.pressed,
      ]}>
      <SymbolView name={icon} size={size * 0.45} tintColor={theme.text} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    boxShadow: Shadow.card,
  },
  disabled: {
    opacity: 0.35,
  },
  pressed: {
    opacity: 0.7,
  },
});
