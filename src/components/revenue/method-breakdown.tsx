import { SymbolView } from 'expo-symbols';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { LedgerEntry, PaymentMethod, SymbolName } from '@/constants/ledger';
import { FontFamily, Radius, Shadow, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { formatPeso, formatSignedPeso } from '@/utils/currency';
import { getMethodTotals } from '@/utils/ledger-stats';

const METHOD_ICONS: Record<PaymentMethod, SymbolName> = {
  Cash: { ios: 'banknote', android: 'payments', web: 'payments' },
  GCash: { ios: 'iphone', android: 'smartphone', web: 'smartphone' },
  'Bank Transfer': { ios: 'building.columns', android: 'account_balance', web: 'account_balance' },
  Card: { ios: 'creditcard', android: 'credit_card', web: 'credit_card' },
};

/** Net per payment method, so staff can check the cash drawer and accounts. */
export function MethodBreakdown({
  entries,
  subtitle = 'Money in minus expenses, per method',
}: {
  entries: LedgerEntry[];
  subtitle?: string;
}) {
  const theme = useTheme();
  const rows = getMethodTotals(entries);

  return (
    <ThemedView type="backgroundElement" style={styles.card}>
      <View>
        <ThemedText style={styles.title}>By payment method</ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          {subtitle}
        </ThemedText>
      </View>

      {rows.length === 0 ? (
        <ThemedText type="small" themeColor="textMuted">
          No payments in this period.
        </ThemedText>
      ) : (
        rows.map((row) => (
          <View
            key={row.method}
            style={styles.row}
            accessible
            accessibilityLabel={`${row.method}: net ${formatSignedPeso(row.net)}, in ${formatPeso(row.income)}, out ${formatPeso(row.expenses)}`}>
            <View style={[styles.iconTile, { backgroundColor: theme.backgroundSelected }]}>
              <SymbolView name={METHOD_ICONS[row.method]} size={22} tintColor={theme.primary} />
            </View>
            <View style={styles.main}>
              <ThemedText style={styles.name}>{row.method}</ThemedText>
              <ThemedText type="small" themeColor="textSecondary">
                In {formatPeso(row.income)} · Out {formatPeso(row.expenses)}
              </ThemedText>
            </View>
            <ThemedText style={styles.net}>{formatSignedPeso(row.net)}</ThemedText>
          </View>
        ))
      )}
    </ThemedView>
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  iconTile: {
    width: 48,
    height: 48,
    borderRadius: Radius.field,
    alignItems: 'center',
    justifyContent: 'center',
  },
  main: {
    flex: 1,
  },
  name: {
    fontFamily: FontFamily.semibold,
  },
  net: {
    fontFamily: FontFamily.bold,
  },
});
