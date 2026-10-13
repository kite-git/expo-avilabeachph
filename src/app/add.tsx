import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ActionCard } from '@/components/ui/action-card';
import { KindConfig } from '@/constants/ledger';
import { FontFamily, Spacing } from '@/constants/theme';

/** Sheet opened by the "+" button: pick what to add. */
export default function AddSheet() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom + Spacing.four }]}>
      <ThemedText style={styles.title} accessibilityRole="header">
        Add
      </ThemedText>
      <ThemedText type="small" themeColor="textSecondary" style={styles.subtitle}>
        What would you like to record?
      </ThemedText>

      <View style={styles.cards}>
        <ActionCard
          label={KindConfig.in.addTitle}
          caption={KindConfig.in.addCaption}
          icon={KindConfig.in.icon}
          onPress={() => router.replace(KindConfig.in.addRoute)}
        />
        <ActionCard
          label={KindConfig.out.addTitle}
          caption={KindConfig.out.addCaption}
          icon={KindConfig.out.icon}
          onPress={() => router.replace(KindConfig.out.addRoute)}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.five,
  },
  title: {
    fontSize: 22,
    lineHeight: 28,
    fontFamily: FontFamily.bold,
  },
  subtitle: {
    marginTop: Spacing.one,
  },
  cards: {
    flexDirection: 'row',
    gap: Spacing.three,
    marginTop: Spacing.four,
  },
});
