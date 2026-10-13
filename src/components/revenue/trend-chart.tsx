import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ChartColors, FontFamily, Radius, Shadow, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { formatPeso, formatPesoCompact } from '@/utils/currency';
import { Totals } from '@/utils/ledger-stats';
import { Bucket } from '@/utils/period';

export type ChartBucket = Bucket & Totals;

type TrendChartProps = {
  buckets: ChartBucket[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  title?: string;
};

const PLOT_HEIGHT = 168;
const AXIS_WIDTH = 48;

/** Rounds up to 1, 2, 2.5 or 5 × 10ⁿ so gridlines land on readable values. */
function niceMax(value: number) {
  if (value <= 0) return 1000;
  const magnitude = 10 ** Math.floor(Math.log10(value));
  const step = [1, 2, 2.5, 5, 10].find((s) => s * magnitude >= value) ?? 10;
  return step * magnitude;
}

/** Grouped bars of income vs expenses per bucket; tap a column to read its values. */
export function TrendChart({
  buckets,
  selectedIndex,
  onSelect,
  title = 'Income vs expenses',
}: TrendChartProps) {
  const theme = useTheme();
  const max = niceMax(Math.max(...buckets.map((b) => Math.max(b.income, b.expenses))));
  const gridValues = [max, max / 2, 0];
  const barWidth = buckets.length > 7 ? 7 : 12;
  const selected = buckets[selectedIndex];
  const isEmpty = buckets.every((b) => b.income === 0 && b.expenses === 0);

  return (
    <ThemedView type="backgroundElement" style={styles.card}>
      <View style={styles.header}>
        <ThemedText style={styles.title}>{title}</ThemedText>
        <View style={styles.legend}>
          <LegendItem color={ChartColors.income} label="Income" />
          <LegendItem color={ChartColors.expenses} label="Expenses" />
        </View>
      </View>

      {selected ? (
        <View
          style={[styles.readout, { backgroundColor: theme.backgroundSelected }]}
          accessibilityLiveRegion="polite">
          <ThemedText type="small" themeColor="textSecondary">
            {selected.longLabel}
          </ThemedText>
          <View style={styles.readoutValues}>
            <ReadoutValue color={ChartColors.income} value={selected.income} />
            <ReadoutValue color={ChartColors.expenses} value={selected.expenses} />
          </View>
        </View>
      ) : null}

      <View style={styles.plotArea}>
        <View style={[styles.axis, { height: PLOT_HEIGHT }]}>
          {gridValues.map((value) => (
            <ThemedText key={value} style={[styles.axisLabel, { color: theme.textMuted }]}>
              {formatPesoCompact(value)}
            </ThemedText>
          ))}
        </View>

        <View style={styles.plotColumn}>
          <View style={[styles.plot, { height: PLOT_HEIGHT }]}>
            {gridValues.map((value) => (
              <View
                key={value}
                style={[
                  styles.gridline,
                  { top: PLOT_HEIGHT * (1 - value / max), backgroundColor: theme.border },
                ]}
              />
            ))}

            {buckets.map((bucket, index) => {
              const isSelected = index === selectedIndex;
              return (
                <Pressable
                  key={bucket.start.toISOString()}
                  onPress={() => onSelect(index)}
                  accessibilityRole="button"
                  accessibilityLabel={`${bucket.longLabel}: income ${formatPeso(bucket.income)}, expenses ${formatPeso(bucket.expenses)}`}
                  accessibilityState={{ selected: isSelected }}
                  style={[
                    styles.column,
                    isSelected && { backgroundColor: theme.backgroundSelected },
                  ]}>
                  <View style={styles.bars}>
                    <Bar value={bucket.income} max={max} width={barWidth} color={ChartColors.income} />
                    <Bar
                      value={bucket.expenses}
                      max={max}
                      width={barWidth}
                      color={ChartColors.expenses}
                    />
                  </View>
                </Pressable>
              );
            })}

            {isEmpty ? (
              <View style={styles.emptyOverlay} pointerEvents="none">
                <ThemedText type="small" themeColor="textSecondary">
                  No entries in this period yet
                </ThemedText>
              </View>
            ) : null}
          </View>

          <View style={styles.labels}>
            {buckets.map((bucket, index) => (
              <ThemedText
                key={bucket.start.toISOString()}
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.6}
                style={[
                  styles.columnLabel,
                  {
                    color: index === selectedIndex ? theme.text : theme.textSecondary,
                    fontFamily: index === selectedIndex ? FontFamily.bold : FontFamily.medium,
                  },
                ]}>
                {bucket.label}
              </ThemedText>
            ))}
          </View>
        </View>
      </View>
    </ThemedView>
  );
}

function Bar({ value, max, width, color }: { value: number; max: number; width: number; color: string }) {
  if (value <= 0) return <View style={{ width }} />;
  // Keep tiny values visible as a sliver instead of disappearing.
  const height = Math.max(3, (value / max) * PLOT_HEIGHT);
  return (
    <View
      style={{
        width,
        height,
        backgroundColor: color,
        borderTopLeftRadius: 4,
        borderTopRightRadius: 4,
      }}
    />
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <View style={styles.legendItem}>
      <View style={[styles.swatch, { backgroundColor: color }]} />
      <ThemedText type="small" themeColor="textSecondary">
        {label}
      </ThemedText>
    </View>
  );
}

function ReadoutValue({ color, value }: { color: string; value: number }) {
  return (
    <View style={styles.legendItem}>
      <View style={[styles.swatch, { backgroundColor: color }]} />
      <ThemedText style={styles.readoutValue}>{formatPeso(value)}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: Spacing.four,
    borderRadius: Radius.card,
    gap: Spacing.three,
    boxShadow: Shadow.card,
  },
  header: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  title: {
    fontSize: 18,
    lineHeight: 24,
    fontFamily: FontFamily.bold,
  },
  legend: {
    flexDirection: 'row',
    gap: Spacing.three,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one + Spacing.half,
  },
  swatch: {
    width: 10,
    height: 10,
    borderRadius: 3,
  },
  readout: {
    padding: Spacing.three,
    borderRadius: Radius.field,
    gap: Spacing.one,
  },
  readoutValues: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    columnGap: Spacing.four,
    rowGap: Spacing.one,
  },
  readoutValue: {
    fontFamily: FontFamily.bold,
  },
  plotArea: {
    flexDirection: 'row',
  },
  axis: {
    width: AXIS_WIDTH,
    justifyContent: 'space-between',
    // Center each label on its gridline.
    marginTop: -8,
    marginBottom: -8,
  },
  axisLabel: {
    fontSize: 11,
    lineHeight: 16,
    fontFamily: FontFamily.medium,
  },
  plotColumn: {
    flex: 1,
  },
  plot: {
    flexDirection: 'row',
  },
  gridline: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: StyleSheet.hairlineWidth,
  },
  column: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    borderTopLeftRadius: Radius.field,
    borderTopRightRadius: Radius.field,
  },
  bars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    // 2px surface gap between the paired bars.
    gap: 2,
  },
  labels: {
    flexDirection: 'row',
    marginTop: Spacing.two,
  },
  columnLabel: {
    flex: 1,
    textAlign: 'center',
    fontSize: 11,
    lineHeight: 14,
  },
  emptyOverlay: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
