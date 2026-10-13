import { router } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet, View } from 'react-native';

import { CategoryIcon } from '@/components/ledger/category-icon';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { EntryKind, KindConfig, LedgerEntry } from '@/constants/ledger';
import { ChartColors, FontFamily, Radius, Shadow, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { formatPeso } from '@/utils/currency';
import { CategoryShare, getCategoryShares, getTotals } from '@/utils/ledger-stats';

/** One card per category with activity: Cash In categories first, then Expenses, largest first. */
export function CategoryCards({ entries }: { entries: LedgerEntry[] }) {
  const totals = getTotals(entries);
  const rows = [
    ...getCategoryShares(entries, 'in').map((share) => ({ kind: 'in' as const, share, total: totals.income })),
    ...getCategoryShares(entries, 'out').map((share) => ({ kind: 'out' as const, share, total: totals.expenses })),
  ];

  if (rows.length === 0) {
    return (
      <ThemedView type="backgroundElement" style={styles.empty}>
        <ThemedText type="small" themeColor="textSecondary" style={styles.emptyText}>
          Nothing recorded today. Tap + to add cash in or an expense.
        </ThemedText>
      </ThemedView>
    );
  }

  return (
    <View style={styles.list}>
      {rows.map((row) => (
        <CategoryCard key={`${row.kind}-${row.share.name}`} {...row} />
      ))}
    </View>
  );
}

type CategoryCardProps = {
  kind: EntryKind;
  share: CategoryShare;
  /** Total of the kind for the period, e.g. all cash in today. */
  total: number;
};

function CategoryCard({ kind, share, total }: CategoryCardProps) {
  const theme = useTheme();
  const config = KindConfig[kind];
  const percent = Math.round(share.share * 100);
  const color = kind === 'in' ? ChartColors.income : ChartColors.expenses;

  return (
    <Pressable
      onPress={() => router.navigate(config.listRoute)}
      accessibilityRole="button"
      accessibilityLabel={`${share.name}, ${config.title}, ${formatPeso(share.amount)} of ${formatPeso(total)}, ${percent} percent`}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: theme.backgroundElement },
        pressed && styles.pressed,
      ]}>
      <View style={styles.header}>
        <CategoryIcon kind={kind} category={share.name} />
        <ThemedText style={styles.name}>{share.name}</ThemedText>
        <View style={[styles.chevron, { borderColor: theme.border }]}>
          <SymbolView
            name={{ ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' }}
            size={14}
            tintColor={theme.text}
          />
        </View>
      </View>

      <View style={[styles.inner, { backgroundColor: theme.background, borderColor: theme.border }]}>
        <View style={styles.row}>
          <ThemedText
            style={styles.amount}
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.6}>
            {formatPeso(share.amount)}
          </ThemedText>
          <ThemedText
            type="small"
            themeColor="textSecondary"
            style={styles.total}
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.6}>
            of {formatPeso(total)}
          </ThemedText>
        </View>
        <View style={[styles.track, { backgroundColor: theme.border }]}>
          <View
            style={[styles.fill, { width: `${Math.max(percent, 2)}%`, backgroundColor: color }]}
          />
        </View>
        <View style={styles.row}>
          <ThemedText type="small" themeColor="textSecondary">
            {config.title}
          </ThemedText>
          <ThemedText type="smallBold">{percent}%</ThemedText>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: Spacing.three,
  },
  empty: {
    padding: Spacing.four,
    borderRadius: Radius.card,
    boxShadow: Shadow.card,
  },
  emptyText: {
    textAlign: 'center',
  },
  card: {
    padding: Spacing.two + Spacing.one,
    paddingTop: Spacing.three,
    borderRadius: Radius.card,
    gap: Spacing.three,
    boxShadow: Shadow.card,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    paddingHorizontal: Spacing.one,
  },
  name: {
    flex: 1,
    fontSize: 18,
    lineHeight: 24,
    fontFamily: FontFamily.semibold,
  },
  chevron: {
    width: 40,
    height: 40,
    borderRadius: Radius.field,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inner: {
    padding: Spacing.three,
    borderRadius: Radius.tile + 2,
    borderWidth: 1,
    gap: Spacing.two + Spacing.half,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: Spacing.two,
  },
  amount: {
    flexShrink: 1,
    fontFamily: FontFamily.bold,
  },
  total: {
    flexShrink: 1,
  },
  track: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 3,
  },
  pressed: {
    opacity: 0.85,
  },
});
