import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CategoryBreakdown } from '@/components/revenue/category-breakdown';
import { MethodBreakdown } from '@/components/revenue/method-breakdown';
import { NetSummary } from '@/components/revenue/net-summary';
import { PeriodNavigator } from '@/components/revenue/period-navigator';
import { ChartBucket, TrendChart } from '@/components/revenue/trend-chart';
import { PageHeader } from '@/components/ui/page-header';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useIsTablet } from '@/hooks/use-is-tablet';
import { useTheme } from '@/hooks/use-theme';
import { useAllEntries } from '@/store/ledger-store';
import { entriesInRange, getTotals } from '@/utils/ledger-stats';
import {
  getBuckets,
  getRange,
  isInRange,
  Period,
  Periods,
  previousLabel,
  shiftAnchor,
} from '@/utils/period';

export default function RevenueScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const isTablet = useIsTablet();
  const allEntries = useAllEntries();

  const [period, setPeriod] = useState<Period>('week');
  const [anchor, setAnchor] = useState(() => new Date());
  // Tapped chart column, remembered only for the range it was tapped in.
  const [selection, setSelection] = useState<{ key: string; index: number } | null>(null);

  const range = getRange(period, anchor);
  const rangeKey = `${period}:${range.start.toISOString()}`;
  const entries = entriesInRange(allEntries, range);
  const current = getTotals(entries);
  const previous = getTotals(entriesInRange(allEntries, getRange(period, shiftAnchor(period, anchor, -1))));

  const buckets: ChartBucket[] = getBuckets(period, anchor).map((bucket) => ({
    ...bucket,
    ...getTotals(entriesInRange(allEntries, bucket)),
  }));
  // Default to the column holding today (or the chosen day); otherwise the last one.
  const focusDay = period === 'day' ? anchor : new Date();
  const todayIndex = buckets.findIndex((bucket) => isInRange(focusDay, bucket));
  const defaultIndex = todayIndex === -1 ? buckets.length - 1 : todayIndex;
  const selectedIndex = selection?.key === rangeKey ? selection.index : defaultIndex;

  const controls = (
    <View style={[styles.controls, isTablet && styles.controlsTablet]}>
      <View style={isTablet ? styles.controlItem : undefined}>
        <SegmentedControl options={Periods} value={period} onChange={setPeriod} />
      </View>
      <View style={isTablet ? styles.controlItem : undefined}>
        <PeriodNavigator period={period} anchor={anchor} onChange={setAnchor} />
      </View>
    </View>
  );

  const overview = (
    <>
      <NetSummary current={current} previous={previous} previousLabel={previousLabel(period)} />
      <TrendChart
        buckets={buckets}
        selectedIndex={selectedIndex}
        onSelect={(index) => setSelection({ key: rangeKey, index })}
      />
    </>
  );

  const breakdowns = (
    <>
      <CategoryBreakdown entries={entries} />
      <MethodBreakdown entries={entries} />
    </>
  );

  return (
    <ScrollView
      style={{ backgroundColor: theme.background }}
      contentContainerStyle={[
        styles.content,
        isTablet && styles.contentTablet,
        {
          paddingTop: insets.top + (isTablet ? Spacing.four : Spacing.three),
          paddingBottom: insets.bottom + Spacing.five,
        },
      ]}>
      <PageHeader title="Revenue" subtitle="Earnings after expenses" />
      {controls}
      {isTablet ? (
        <View style={styles.columns}>
          <View style={styles.column}>{overview}</View>
          <View style={styles.column}>{breakdowns}</View>
        </View>
      ) : (
        <>
          {overview}
          {breakdowns}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    paddingHorizontal: Spacing.four,
    gap: Spacing.four,
  },
  contentTablet: {
    paddingHorizontal: Spacing.five,
  },
  controls: {
    gap: Spacing.three,
  },
  controlsTablet: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.four,
  },
  controlItem: {
    flex: 1,
  },
  columns: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.four,
  },
  column: {
    flex: 1,
    gap: Spacing.four,
  },
});
