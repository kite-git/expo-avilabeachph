import { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { CategoryIcon } from '@/components/ledger/category-icon';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { KindConfig, LedgerEntry } from '@/constants/ledger';
import { FontFamily, Radius, Shadow, Spacing } from '@/constants/theme';
import { formatPeso } from '@/utils/currency';
import { formatEntryDate } from '@/utils/date';

/** Newest day first; entries on the same day newest-added first. */
function sortLatestFirst(entries: LedgerEntry[]) {
  return [...entries].sort(
    (a, b) =>
      b.date.getTime() - a.date.getTime() || b.createdAt.getTime() - a.createdAt.getTime(),
  );
}

type EntryListProps = {
  entries: LedgerEntry[];
  emptyMessage: string;
  title?: string;
  /** Show only the newest N entries. */
  limit?: number;
  /** Rendered under the rows, e.g. "See all" links. */
  footer?: ReactNode;
};

/** "Latest Entries" sheet; rows may mix Cash In and Expenses. */
export function EntryList({
  entries,
  emptyMessage,
  title = 'Latest Entries',
  limit,
  footer,
}: EntryListProps) {
  const sorted = sortLatestFirst(entries).slice(0, limit);

  return (
    <ThemedView type="backgroundElement" style={styles.sheet}>
      <View style={styles.header}>
        <ThemedText style={styles.title}>{title}</ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          {entries.length} {entries.length === 1 ? 'entry' : 'entries'}
        </ThemedText>
      </View>

      {sorted.length === 0 ? (
        <ThemedText type="small" themeColor="textSecondary" style={styles.empty}>
          {emptyMessage}
        </ThemedText>
      ) : (
        <View style={styles.rows}>
          {sorted.map((entry) => (
            <EntryRow key={entry.id} entry={entry} />
          ))}
        </View>
      )}
      {footer}
    </ThemedView>
  );
}

function EntryRow({ entry }: { entry: LedgerEntry }) {
  const title = entry.note || entry.category;
  const amount = `${KindConfig[entry.kind].sign}${formatPeso(entry.amount)}`;
  const subtitle = entry.note
    ? `${entry.category} · ${formatEntryDate(entry.date)}`
    : formatEntryDate(entry.date);

  return (
    <View style={styles.row} accessible accessibilityLabel={`${title}, ${amount}, ${entry.method}, ${subtitle}`}>
      <CategoryIcon kind={entry.kind} category={entry.category} />
      <View style={styles.main}>
        <ThemedText style={styles.rowTitle}>
          {title}
        </ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          {subtitle}
        </ThemedText>
      </View>
      <View style={styles.trailing}>
        <ThemedText style={styles.amount}>{amount}</ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          {entry.method}
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sheet: {
    padding: Spacing.four,
    borderRadius: Radius.sheet,
    gap: Spacing.four,
    boxShadow: Shadow.card,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 18,
    lineHeight: 24,
    fontFamily: FontFamily.bold,
  },
  rows: {
    gap: Spacing.four,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  main: {
    flex: 1,
  },
  rowTitle: {
    fontFamily: FontFamily.semibold,
  },
  trailing: {
    alignItems: 'flex-end',
  },
  amount: {
    fontFamily: FontFamily.bold,
  },
  empty: {
    textAlign: 'center',
    paddingVertical: Spacing.five,
  },
});
