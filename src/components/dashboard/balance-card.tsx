import { router } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { KindConfig, SymbolName } from '@/constants/ledger';
import { FontFamily, Radius, Shadow, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { formatPeso, formatSignedPeso } from '@/utils/currency';

type Action = {
  label: string;
  icon: SymbolName;
  onPress: () => void;
};

const ACTIONS: Action[] = [
  {
    label: KindConfig.in.actionLabel,
    icon: { ios: 'arrow.down.left', android: 'south_west', web: 'south_west' },
    onPress: () => router.push(KindConfig.in.addRoute),
  },
  {
    label: KindConfig.out.actionLabel,
    icon: { ios: 'arrow.up.right', android: 'north_east', web: 'north_east' },
    onPress: () => router.push(KindConfig.out.addRoute),
  },
  {
    label: 'Revenue',
    icon: { ios: 'chart.bar', android: 'bar_chart', web: 'bar_chart' },
    onPress: () => router.navigate('/revenue'),
  },
];

/** "+₱2,300.00" for gains, "−₱2,300.00" for losses. */
function formatChange(amount: number) {
  return amount > 0 ? `+${formatPeso(amount)}` : formatSignedPeso(amount);
}

type BalanceCardProps = {
  /** All-time income minus expenses. */
  balance: number;
  /** Today's income minus expenses. */
  todayNet: number;
};

/** Brown hero card: total balance, today's net in a chip, and round quick actions. */
export function BalanceCard({ balance, todayNet }: BalanceCardProps) {
  const theme = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: theme.primary }]}>
      <View style={styles.chip}>
        <SymbolView
          name={{ ios: 'calendar', android: 'today', web: 'today' }}
          size={14}
          tintColor={theme.accent}
        />
        <ThemedText style={[styles.chipText, { color: theme.onPrimary }]}>
          Today {formatChange(todayNet)}
        </ThemedText>
      </View>

      <View style={styles.balance}>
        <ThemedText style={[styles.balanceLabel, { color: theme.onPrimary }]}>
          Total balance
        </ThemedText>
        <ThemedText
          style={[styles.amount, { color: theme.onPrimary }]}
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.6}
          accessibilityLabel={`Total balance ${formatSignedPeso(balance)}`}>
          {formatSignedPeso(balance)}
        </ThemedText>
      </View>

      <View style={styles.actions}>
        {ACTIONS.map((action) => (
          <Pressable
            key={action.label}
            onPress={action.onPress}
            accessibilityRole="button"
            accessibilityLabel={action.label}
            style={({ pressed }) => [styles.action, pressed && styles.pressed]}>
            <View style={[styles.actionCircle, { backgroundColor: theme.backgroundElement }]}>
              <SymbolView name={action.icon} size={20} tintColor={theme.primary} />
            </View>
            <ThemedText style={[styles.actionLabel, { color: theme.onPrimary }]}>
              {action.label}
            </ThemedText>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const ACTION_SIZE = 48;

const styles = StyleSheet.create({
  card: {
    paddingTop: Spacing.three,
    paddingBottom: Spacing.four,
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.card + 4,
    alignItems: 'center',
    gap: Spacing.three,
    boxShadow: Shadow.raised,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one + Spacing.half,
    paddingVertical: Spacing.one + Spacing.half,
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.pill,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
  chipText: {
    fontSize: 12,
    lineHeight: 16,
    fontFamily: FontFamily.semibold,
    textAlign: 'center',
  },
  balance: {
    alignSelf: 'stretch',
    alignItems: 'center',
    paddingHorizontal: Spacing.two,
  },
  balanceLabel: {
    fontSize: 13,
    lineHeight: 18,
    fontFamily: FontFamily.medium,
    opacity: 0.7,
    textAlign: 'center',
  },
  amount: {
    alignSelf: 'stretch',
    fontSize: 30,
    lineHeight: 38,
    fontFamily: FontFamily.bold,
    letterSpacing: -0.4,
    textAlign: 'center',
  },
  actions: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    marginTop: Spacing.two,
  },
  action: {
    flex: 1,
    alignItems: 'center',
    gap: Spacing.one + Spacing.half,
  },
  actionCircle: {
    width: ACTION_SIZE,
    height: ACTION_SIZE,
    borderRadius: ACTION_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionLabel: {
    alignSelf: 'stretch',
    fontSize: 12,
    lineHeight: 16,
    fontFamily: FontFamily.medium,
    opacity: 0.8,
    textAlign: 'center',
  },
  pressed: {
    opacity: 0.7,
  },
});
