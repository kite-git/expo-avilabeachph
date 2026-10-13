import { SymbolView } from 'expo-symbols';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { EntryKind, KindConfig, LedgerEntry } from '@/constants/ledger';
import { FontFamily, Radius, Shadow, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { formatPeso } from '@/utils/currency';
import { isSameDay } from '@/utils/date';

type EntrySummaryProps = {
  kind: EntryKind;
  entries: LedgerEntry[];
};

/** Big total card: yellow for Cash In, brown for Expenses. */
export function EntrySummary({ kind, entries }: EntrySummaryProps) {
  const theme = useTheme();
  const isIncome = kind === 'in';
  const background = isIncome ? theme.accent : theme.primary;
  const foreground = isIncome ? theme.onAccent : theme.onPrimary;
  const overlay = isIncome ? 'rgba(255, 255, 255, 0.4)' : 'rgba(255, 255, 255, 0.12)';

  const today = new Date();
  const total = entries.reduce((sum, entry) => sum + entry.amount, 0);
  const todayTotal = entries
    .filter((entry) => isSameDay(entry.date, today))
    .reduce((sum, entry) => sum + entry.amount, 0);

  return (
    <View style={[styles.card, { backgroundColor: background }]}>
      <View style={styles.top}>
        <ThemedText type="small" style={{ color: foreground }}>
          {KindConfig[kind].totalLabel}
        </ThemedText>
        <View style={[styles.iconBadge, { backgroundColor: overlay }]}>
          <SymbolView
            name={{
              ios: 'wallet.pass',
              android: 'account_balance_wallet',
              web: 'account_balance_wallet',
            }}
            size={20}
            tintColor={isIncome ? theme.onAccent : theme.accent}
          />
        </View>
      </View>

      <ThemedText
        style={[styles.total, { color: foreground }]}
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.6}>
        {formatPeso(total)}
      </ThemedText>

      <View style={styles.stats}>
        <Stat label="Today" value={formatPeso(todayTotal)} color={foreground} overlay={overlay} />
        <Stat
          label="Entries"
          value={String(entries.length)}
          color={foreground}
          overlay={overlay}
        />
      </View>
    </View>
  );
}

type StatProps = {
  label: string;
  value: string;
  color: string;
  overlay: string;
};

function Stat({ label, value, color, overlay }: StatProps) {
  return (
    <View style={[styles.stat, { backgroundColor: overlay }]}>
      <ThemedText type="small" style={[styles.statLabel, { color }]}>
        {label}
      </ThemedText>
      <ThemedText style={[styles.statValue, { color }]} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.6}>
        {value}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: Spacing.four,
    borderRadius: Radius.card,
    gap: Spacing.one,
    boxShadow: Shadow.card,
  },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  total: {
    fontSize: 34,
    lineHeight: 42,
    fontFamily: FontFamily.bold,
    letterSpacing: -0.5,
  },
  stats: {
    flexDirection: 'row',
    gap: Spacing.three,
    marginTop: Spacing.three,
  },
  stat: {
    flex: 1,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.field,
  },
  statLabel: {
    opacity: 0.75,
  },
  statValue: {
    fontFamily: FontFamily.bold,
  },
});
