import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { SymbolName } from '@/constants/ledger';
import { FontFamily, Radius, Shadow, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type ActionCardProps = {
  label: string;
  caption: string;
  icon: SymbolName;
  onPress: () => void;
};

/** Big tappable card with an icon tile, as in the Add sheet and Dashboard quick actions. */
export function ActionCard({ label, caption, icon, onPress }: ActionCardProps) {
  const theme = useTheme();

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: theme.backgroundElement, borderColor: theme.border },
        pressed && styles.pressed,
      ]}>
      <View style={[styles.iconTile, { backgroundColor: theme.accentSoft }]}>
        <SymbolView name={icon} size={22} tintColor={theme.primary} />
      </View>
      <View>
        <ThemedText style={styles.cardLabel}>{label}</ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          {caption}
        </ThemedText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minHeight: 140,
    padding: Spacing.three + Spacing.one,
    borderRadius: Radius.card,
    borderWidth: 1,
    justifyContent: 'space-between',
    boxShadow: Shadow.card,
  },
  iconTile: {
    width: 44,
    height: 44,
    borderRadius: Radius.field,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardLabel: {
    fontSize: 16,
    lineHeight: 22,
    fontFamily: FontFamily.bold,
  },
  pressed: {
    opacity: 0.85,
  },
});
