import { router } from 'expo-router';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EntryForm } from '@/components/ledger/entry-form';
import { EntryList } from '@/components/ledger/entry-list';
import { EntrySummary } from '@/components/ledger/entry-summary';
import { ThemedText } from '@/components/themed-text';
import { IconButton } from '@/components/ui/icon-button';
import { PageHeader } from '@/components/ui/page-header';
import { EntryKind, KindConfig } from '@/constants/ledger';
import { FontFamily, MaxContentWidth, Spacing } from '@/constants/theme';
import { useIsTablet } from '@/hooks/use-is-tablet';
import { useTheme } from '@/hooks/use-theme';
import { useLedger } from '@/store/ledger-store';
import { formatLongDate } from '@/utils/date';

/** Tab screen shared by Cash In and Expenses. */
export function LedgerScreen({ kind }: { kind: EntryKind }) {
  const isTablet = useIsTablet();
  return isTablet ? <TabletLedger kind={kind} /> : <PhoneLedger kind={kind} />;
}

/** Summary and entries; adding happens on its own screen. */
function PhoneLedger({ kind }: { kind: EntryKind }) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const config = KindConfig[kind];
  const { entries } = useLedger(kind);

  return (
    <ScrollView
      style={{ backgroundColor: theme.background }}
      contentContainerStyle={[
        styles.phoneContent,
        { paddingTop: insets.top + Spacing.three, paddingBottom: Spacing.five },
      ]}>
      <PageHeader
        title={config.title}
        subtitle={formatLongDate(new Date())}
        accessory={
          <IconButton
            icon={{ ios: 'plus', android: 'add', web: 'add' }}
            accessibilityLabel={config.addTitle}
            onPress={() => router.push(config.addRoute)}
            size={44}
          />
        }
      />
      <EntrySummary kind={kind} entries={entries} />
      <EntryList entries={entries} emptyMessage={KindConfig[kind].emptyMessage} />
    </ScrollView>
  );
}

/** Form on the left, summary and entries on the right. */
function TabletLedger({ kind }: { kind: EntryKind }) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { entries } = useLedger(kind);

  return (
    <View
      style={[
        styles.tabletRoot,
        { backgroundColor: theme.background, paddingTop: insets.top + Spacing.four },
      ]}>
      <View style={styles.tabletInner}>
        <View style={styles.tabletHeader}>
          <PageHeader title={KindConfig[kind].title} subtitle={formatLongDate(new Date())} />
        </View>

        <View style={styles.columns}>
          <KeyboardAvoidingView
            style={styles.formColumn}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <ScrollView
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={[styles.columnContent, { paddingBottom: insets.bottom + Spacing.five }]}>
              <ThemedText style={styles.columnTitle}>New entry</ThemedText>
              <EntryForm kind={kind} />
            </ScrollView>
          </KeyboardAvoidingView>

          <ScrollView
            style={styles.listColumn}
            contentContainerStyle={[styles.columnContent, { paddingBottom: insets.bottom + Spacing.five }]}>
            <EntrySummary kind={kind} entries={entries} />
            <EntryList entries={entries} emptyMessage={KindConfig[kind].emptyMessage} />
          </ScrollView>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  phoneContent: {
    paddingHorizontal: Spacing.four,
    gap: Spacing.four,
  },
  tabletRoot: {
    flex: 1,
  },
  tabletInner: {
    flex: 1,
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
  },
  tabletHeader: {
    paddingHorizontal: Spacing.five,
    paddingBottom: Spacing.three,
  },
  columns: {
    flex: 1,
    flexDirection: 'row',
    gap: Spacing.four,
    paddingHorizontal: Spacing.five - Spacing.two,
  },
  formColumn: {
    flex: 1,
    maxWidth: 480,
  },
  listColumn: {
    flex: 1.2,
  },
  columnContent: {
    // Room for card shadows inside the scroll views.
    paddingHorizontal: Spacing.two,
    paddingTop: Spacing.two,
    gap: Spacing.four,
  },
  columnTitle: {
    fontSize: 18,
    lineHeight: 24,
    fontFamily: FontFamily.bold,
  },
});
