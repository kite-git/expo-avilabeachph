import { SymbolView } from 'expo-symbols';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { FontFamily, Radius, Shadow, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { formatPeso, formatSignedPeso } from '@/utils/currency';
import { percentChange, Totals } from '@/utils/ledger-stats';

type NetSummaryProps = {
  current: Totals;
  previous: Totals;
  /** e.g. "last week" */
  previousLabel: string;
  /** Replaces "Net revenue" / "Net loss", e.g. "Today's net". */
  title?: string;
};

/** Brown hero card: net for the period, with income and expenses tiles below. */
export function NetSummary({ current, previous, previousLabel, title }: NetSummaryProps) {
  const theme = useTheme();
  const isLoss = current.net < 0;
  const label = title ?? (isLoss ? 'Net loss' : 'Net revenue');

  return (
    <View style={[styles.card, { backgroundColor: theme.primary }]}>
      <View style={styles.top}>
        <ThemedText type="small" style={{ color: theme.onPrimary }}>
          {label}
        </ThemedText>
        <Change
          value={percentChange(current.net, previous.net)}
          previousLabel={previousLabel}
          tone="accent"
        />
      </View>

      <ThemedText
        style={[styles.net, { color: theme.onPrimary }]}
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.6}
        accessibilityLabel={`${label} ${formatSignedPeso(current.net)}`}>
        {formatSignedPeso(current.net)}
      </ThemedText>

      <View style={styles.tiles}>
        <Tile
          label="Income"
          value={current.income}
          change={percentChange(current.income, previous.income)}
          previousLabel={previousLabel}
          highlighted
        />
        <Tile
          label="Expenses"
          value={current.expenses}
          change={percentChange(current.expenses, previous.expenses)}
          previousLabel={previousLabel}
        />
      </View>
    </View>
  );
}

type TileProps = {
  label: string;
  value: number;
  change: number | null;
  previousLabel: string;
  highlighted?: boolean;
};

function Tile({ label, value, change, previousLabel, highlighted }: TileProps) {
  const theme = useTheme();
  const color = highlighted ? theme.onAccent : theme.onPrimary;

  return (
    <View
      style={[
        styles.tile,
        { backgroundColor: highlighted ? theme.accent : 'rgba(255, 255, 255, 0.12)' },
      ]}>
      <ThemedText type="small" style={[styles.tileLabel, { color }]}>
        {label}
      </ThemedText>
      <ThemedText style={[styles.tileValue, { color }]} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.6}>
        {formatPeso(value)}
      </ThemedText>
      <Change
        value={change}
        previousLabel={previousLabel}
        tone={highlighted ? 'onAccent' : 'onPrimary'}
        compact
      />
    </View>
  );
}

type ChangeProps = {
  value: number | null;
  previousLabel: string;
  tone: 'accent' | 'onAccent' | 'onPrimary';
  compact?: boolean;
};

/** "▲ 12% vs last week". Neutral colors on purpose: for expenses, up is not good news. */
function Change({ value, previousLabel, tone, compact }: ChangeProps) {
  const theme = useTheme();
  const color = theme[tone];

  if (value === null) {
    return (
      <ThemedText type="small" style={[styles.changeMuted, styles.changeText, { color }]}>
        No data {previousLabel}
      </ThemedText>
    );
  }

  const up = value >= 0;
  const percent = `${Math.round(Math.abs(value) * 100)}%`;

  return (
    <View style={[styles.change, !compact && styles.changePill]}>
      <SymbolView
        name={
          up
            ? { ios: 'arrow.up.right', android: 'trending_up', web: 'trending_up' }
            : { ios: 'arrow.down.right', android: 'trending_down', web: 'trending_down' }
        }
        size={14}
        tintColor={color}
      />
      <ThemedText type="small" style={[styles.changeText, { color }]}>
        {`${percent} vs ${previousLabel}`}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: Spacing.four,
    borderRadius: Radius.card,
    gap: Spacing.one,
    boxShadow: Shadow.raised,
  },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  net: {
    fontSize: 38,
    lineHeight: 46,
    fontFamily: FontFamily.bold,
    letterSpacing: -0.6,
  },
  tiles: {
    flexDirection: 'row',
    gap: Spacing.three,
    marginTop: Spacing.three,
  },
  tile: {
    flex: 1,
    padding: Spacing.three,
    borderRadius: Radius.tile,
    gap: Spacing.half,
  },
  tileLabel: {
    opacity: 0.8,
  },
  tileValue: {
    fontSize: 18,
    lineHeight: 24,
    fontFamily: FontFamily.bold,
  },
  change: {
    flexShrink: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
  changePill: {
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.two + Spacing.half,
    borderRadius: Radius.pill,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
  changeText: {
    flexShrink: 1,
  },
  changeMuted: {
    opacity: 0.7,
  },
});
