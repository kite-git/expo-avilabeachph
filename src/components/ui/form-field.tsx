import { PropsWithChildren, ReactNode, useState } from 'react';
import { StyleSheet, TextInput, TextInputProps, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { FontFamily, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type FormFieldProps = PropsWithChildren<{
  label: string;
  /** Shown after the label in a lighter color, e.g. "Optional". */
  hint?: string;
}>;

/** Label above a form control. */
export function FormField({ label, hint, children }: FormFieldProps) {
  return (
    <View style={styles.field}>
      <ThemedText type="small" themeColor="textSecondary">
        {label}
        {hint ? <ThemedText type="small" themeColor="textMuted">{`  ${hint}`}</ThemedText> : null}
      </ThemedText>
      {children}
    </View>
  );
}

type FieldInputProps = TextInputProps & {
  /** Rendered at the right edge of the input, e.g. a currency sign. */
  trailing?: ReactNode;
  size?: 'default' | 'large';
};

/** White rounded text input whose border darkens while focused. */
export function FieldInput({
  trailing,
  size = 'default',
  style,
  onFocus,
  onBlur,
  ...props
}: FieldInputProps) {
  const theme = useTheme();
  const [focused, setFocused] = useState(false);

  return (
    <View
      style={[
        styles.inputRow,
        {
          backgroundColor: theme.backgroundElement,
          borderColor: focused ? theme.primary : theme.border,
        },
      ]}>
      <TextInput
        placeholderTextColor={theme.textMuted}
        cursorColor={theme.primary}
        selectionColor={theme.accent}
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
        style={[styles.input, size === 'large' && styles.inputLarge, { color: theme.text }, style]}
        {...props}
      />
      {trailing}
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    gap: Spacing.two,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 56,
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.field,
    borderWidth: 1.5,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: FontFamily.medium,
    paddingVertical: Spacing.three,
  },
  inputLarge: {
    fontSize: 22,
    fontFamily: FontFamily.semibold,
  },
});
