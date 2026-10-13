import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { IconButton } from '@/components/ui/icon-button';
import { FontFamily, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const BUTTON_SIZE = 40;

/** Back button + centered title, for screens pushed on top of the tabs. */
export function ScreenHeader({ title }: { title: string }) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top + Spacing.two,
          backgroundColor: theme.backgroundElement,
          borderBottomColor: theme.border,
        },
      ]}>
      <IconButton
        icon={{ ios: 'chevron.left', android: 'chevron_left', web: 'chevron_left' }}
        accessibilityLabel="Go back"
        onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}
        size={BUTTON_SIZE}
      />
      <ThemedText style={styles.title} accessibilityRole="header">
        {title}
      </ThemedText>
      <View style={styles.spacer} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.three,
    paddingBottom: Spacing.three,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    lineHeight: 24,
    fontFamily: FontFamily.bold,
  },
  spacer: {
    width: BUTTON_SIZE,
  },
});
