import { StyleSheet, View } from 'react-native';

import { CategoryIcon } from '@/components/ledger/category-icon';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { EntryKind, LedgerEntry } from '@/constants/ledger';
import { ChartColors, FontFamily, Radius, Shadow, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { formatPeso } from '@/utils/currency';
import { getCategoryShares } from '@/utils/ledger-stats';

/** Income and expense categories for the period, largest first, with share bars. */
export function CategoryBreakdown({
  entries,
  title = 'By category',
}: {
  entries: LedgerEntry[];
  title?: string;
}) {
  return (
    <ThemedView type="backgroundElement" style={styles.card}>
      <ThemedText style={styles.title}>{title}</ThemedText>
      <Section kind="in" label="Income" entries={entries} />
      <Section kind="out" label="Expenses" entries={entries} />
    </ThemedView>
  );
}

type SectionProps = {
  kind: EntryKind;
  label: string;
  entries: LedgerEntry[];
};

function Section({ kind, label, entries }: SectionProps) {
  const theme = useTheme();
  const shares = getCategoryShares(entries, kind);
  const color = kind === 'in' ? ChartColors.income : ChartColors.expenses;

  return (
    <View style={styles.section}>
      <ThemedText type="smallBold" themeColor="textSecondary" style={styles.sectionLabel}>
        {label}
      </ThemedText>

      {shares.length === 0 ? (
        <ThemedText type="small" themeColor="textMuted">
          No {label.toLowerCase()} in this period.
        </ThemedText>
      ) : (
        shares.map((row) => (
          <View
            key={row.name}
            style={styles.row}
            accessible
            accessibilityLabel={`${row.name}, ${formatPeso(row.amount)}, ${Math.round(row.share * 100)} percent of ${label.toLowerCase()}`}>
            <CategoryIcon kind={kind} category={row.name} />
            <View style={styles.main}>
              <View style={styles.rowTop}>
                <ThemedText style={styles.name}>
                  {row.name}
                </ThemedText>
                <ThemedText style={styles.amount}>{formatPeso(row.amount)}</ThemedText>
              </View>
              <View style={styles.rowBottom}>
                <View style={[styles.track, { backgroundColor: theme.backgroundSelected }]}>
                  <View
                    style={[
                      styles.fill,
                      { width: `${Math.max(row.share * 100, 2)}%`, backgroundColor: color },
                    ]}
                  />
                </View>
                <ThemedText type="small" themeColor="textSecondary" style={styles.percent}>
                  {Math.round(row.share * 100)}%
                </ThemedText>
              </View>
            </View>
          </View>
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: Spacing.four,
    borderRadius: Radius.card,
    gap: Spacing.four,
    boxShadow: Shadow.card,
  },
  title: {
    fontSize: 18,
    lineHeight: 24,
    fontFamily: FontFamily.bold,
  },
  section: {
    gap: Spacing.three,
  },
  sectionLabel: {
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    fontSize: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  main: {
    flex: 1,
    gap: Spacing.one + Spacing.half,
  },
  rowTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  name: {
    flex: 1,
    fontFamily: FontFamily.semibold,
  },
  amount: {
    fontFamily: FontFamily.bold,
  },
  rowBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  track: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 3,
  },
  percent: {
    width: 40,
    textAlign: 'right',
  },
});
