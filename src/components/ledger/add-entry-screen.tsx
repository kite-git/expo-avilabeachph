import { router } from 'expo-router';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EntryForm } from '@/components/ledger/entry-form';
import { ScreenHeader } from '@/components/ui/screen-header';
import { EntryKind, KindConfig } from '@/constants/ledger';
import { MaxFormWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

/** Full-screen add form shared by Add Cash In and Add Expense. */
export function AddEntryScreen({ kind }: { kind: EntryKind }) {
  const theme = useTheme();
  const config = KindConfig[kind];
  const insets = useSafeAreaInsets();

  return (
    <KeyboardAvoidingView
      style={[styles.flex, { backgroundColor: theme.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScreenHeader title={config.addTitle} />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + Spacing.four }]}>
        <EntryForm kind={kind} onSaved={() => router.dismissTo(config.listRoute)} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  content: {
    width: '100%',
    maxWidth: MaxFormWidth,
    alignSelf: 'center',
    padding: Spacing.four,
  },
});
